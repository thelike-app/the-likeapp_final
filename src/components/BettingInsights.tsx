import { useMemo, useState } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PlayerStatsData } from "@/pages/Index";

interface BettingInsightsProps {
  player: PlayerStatsData;
  gamesCount?: number;
}

// ---------- Utilities for probabilistic modeling ----------
function sortGamesRecentFirst(player: PlayerStatsData) {
  return [...player.games].sort(
    (a, b) => new Date(b.game_date).getTime() - new Date(a.game_date).getTime()
  );
}

// Deterministic RNG utilities
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSeededRng(key: string): () => number {
  const seed = xmur3(key)();
  return mulberry32(seed);
}

function safeParse(n: string | number | null | undefined): number {
  if (typeof n === "number") return isFinite(n) ? n : 0;
  if (!n) return 0;
  const v = parseFloat(n as string);
  return isFinite(v) ? v : 0;
}

function ewma(values: number[], alpha: number): number {
  if (values.length === 0) return 0;
  // compute from oldest -> newest
  let s = values[0];
  for (let i = 1; i < values.length; i++) {
    s = alpha * values[i] + (1 - alpha) * s;
  }
  return s;
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function variance(values: number[], mu?: number): number {
  if (values.length === 0) return 0;
  const m = mu ?? mean(values);
  return values.reduce((acc, v) => acc + (v - m) * (v - m), 0) / values.length;
}

// Gamma sampling (Marsaglia and Tsang, 2000)
function randomGamma(shape: number, scale: number, rng: () => number): number {
  if (shape <= 0 || scale <= 0) return 0;
  if (shape < 1) {
    // boost to shape >= 1
    const u = rng();
    return randomGamma(1 + shape, scale, rng) * Math.pow(u, 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let x: number, v: number;
    do {
      // Standard normal via Box-Muller
      const u1 = rng();
      const u2 = rng();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      x = z;
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * x * x * x * x) return d * v * scale;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v)))
      return d * v * scale;
  }
}

// Poisson sampling: Knuth for small lambda, normal approx for large
function randomPoisson(lambda: number, rng: () => number): number {
  if (lambda <= 0) return 0;
  if (lambda < 30) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= rng();
    } while (p > L);
    return k - 1;
  }
  // Normal approximation
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const val = Math.floor(lambda + Math.sqrt(lambda) * z);
  return Math.max(0, val);
}

// Sample Negative Binomial via Poisson-Gamma mixture
function sampleNegativeBinomial(
  meanVal: number,
  size: number,
  rng: () => number
): number {
  if (meanVal <= 0) return 0;
  if (!isFinite(size) || size <= 0) {
    // Degenerates to Poisson when size -> ∞
    return randomPoisson(meanVal, rng);
  }
  const lambda = randomGamma(size, meanVal / size, rng);
  return randomPoisson(lambda, rng);
}

function probabilityOverLineUsingNB(
  meanVal: number,
  size: number,
  lineHalf: number,
  opts?: { samples?: number; zeroInflation?: number; rng?: () => number }
): number {
  const samples = opts?.samples ?? 2000;
  const pZero = Math.min(Math.max(opts?.zeroInflation ?? 0, 0), 0.98);
  const rng = opts?.rng ?? Math.random;
  const cutoff = Math.floor(lineHalf) + 1; // Over X.5 means >= X+1
  let count = 0;
  for (let i = 0; i < samples; i++) {
    let y: number;
    if (pZero > 0 && rng() < pZero) {
      y = 0;
    } else {
      y = sampleNegativeBinomial(meanVal, size, rng);
    }
    if (y >= cutoff) count++;
  }
  return count / samples;
}

function probabilityExactUsingNB(
  meanVal: number,
  size: number,
  exact: number,
  opts?: { samples?: number; zeroInflation?: number; rng?: () => number }
): number {
  const samples = opts?.samples ?? 4000;
  const pZero = Math.min(Math.max(opts?.zeroInflation ?? 0, 0), 0.98);
  const rng = opts?.rng ?? Math.random;
  let count = 0;
  for (let i = 0; i < samples; i++) {
    let y: number;
    if (pZero > 0 && rng() < pZero) {
      y = 0;
    } else {
      y = sampleNegativeBinomial(meanVal, size, rng);
    }
    if (y === exact) count++;
  }
  return count / samples;
}
function projectMeanFromEWMA(
  rawCounts: number[],
  minutes: number[],
  alpha?: number
): { mu: number; size: number; zeroInflation?: number } {
  const n = Math.min(rawCounts.length, minutes.length);
  if (n === 0) return { mu: 0, size: Number.POSITIVE_INFINITY };
  // Use last n values, compute per-minute rates where minutes > 0
  const rates: number[] = [];
  const validMinutes: number[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const m = minutes[i];
    const x = rawCounts[i];
    if (m > 0) {
      rates.push(x / m);
      validMinutes.push(m);
    }
  }
  if (rates.length === 0) return { mu: 0, size: Number.POSITIVE_INFINITY };

  // EWMA parameters
  const look = Math.max(3, Math.min(10, rates.length));
  const a = alpha ?? 2 / (look + 1); // standard EWMA smoothing factor
  // compute EWMA on chronological order (oldest -> newest)
  const ratesChrono = [...rates].reverse();
  const minutesChrono = [...validMinutes].reverse();
  const rateHat = ewma(ratesChrono, a);
  const minutesHat = ewma(minutesChrono, a);
  const mu = rateHat * minutesHat;

  // Empirical dispersion estimate
  const rawChrono = [...rawCounts].reverse().slice(-look);
  const muEmp = mean(rawChrono);
  const vEmp = variance(rawChrono, muEmp);
  let size = Number.POSITIVE_INFINITY;
  if (vEmp > muEmp + 1e-9) {
    size = (muEmp * muEmp) / (vEmp - muEmp); // NB2: Var = mu + mu^2/size
  }

  // Zero-inflation estimate for sparse stats (like 3PM)
  const zeros = rawChrono.filter((v) => v === 0).length;
  const pZero = zeros / rawChrono.length;
  const zeroInflation = pZero > 0.3 ? pZero : undefined;

  return { mu: Math.max(0, mu), size, zeroInflation };
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="confidence-bar flex-1 h-1">
        <div className="confidence-fill" style={{ width: `${confidence}%` }} />
      </div>
      <span className="text-foreground font-bold text-sm w-16">
        {confidence.toFixed(2)}%
      </span>
    </div>
  );
}

export function BettingInsights({ player, gamesCount }: BettingInsightsProps) {
  // ----- Build projections once for custom probability calculator -----
  const { ptsProj, rebProj, astProj, thrProj } = useMemo(() => {
    const sorted = sortGamesRecentFirst(player);
    const games = sorted;
    const ptsArr: number[] = [];
    const rebArr: number[] = [];
    const astArr: number[] = [];
    const thrArr: number[] = [];
    const minArr: number[] = [];
    games.forEach((g) => {
      ptsArr.push(safeParse(g.player_stats.ppg));
      rebArr.push(safeParse(g.player_stats.rpg));
      astArr.push(safeParse(g.player_stats.apg));
      thrArr.push(safeParse(g.player_stats.three_pm));
      minArr.push(Math.max(0, safeParse(g.player_stats.mpg)));
    });
    return {
      ptsProj: projectMeanFromEWMA(ptsArr, minArr),
      rebProj: projectMeanFromEWMA(rebArr, minArr),
      astProj: projectMeanFromEWMA(astArr, minArr),
      thrProj: projectMeanFromEWMA(thrArr, minArr),
    };
  }, [player]);

  // ----- UI state for selected lines -----
  const [pointsTarget, setPointsTarget] = useState<number>(5);
  const [reboundsTarget, setReboundsTarget] = useState<number>(3);
  const [assistsTarget, setAssistsTarget] = useState<number>(3);
  const [threesTarget, setThreesTarget] = useState<number>(1);

  const [pointsCustom, setPointsCustom] = useState<string>("");
  const [reboundsCustom, setReboundsCustom] = useState<string>("");
  const [assistsCustom, setAssistsCustom] = useState<string>("");
  const [threesCustom, setThreesCustom] = useState<string>("");

  // Options per stat
  const pointsOptions = [5, 10, 15, 20, 25];
  const threesOptions = [1, 2, 3, 4, 5];
  const arbSeq = [3, 5, 7, 9, 13]; // for assists and rebounds

  const probAtLeast = (
    mu: number,
    size: number,
    target: number,
    zeroInflation?: number
  ) => {
    if (!isFinite(target) || target < 0) return 0;
    // Over (target - 0.5) == P(Y >= target)
    return probabilityOverLineUsingNB(mu, size, target - 0.5, {
      samples: 2000,
      zeroInflation,
    });
  };

  // Deterministic, memoized probabilities per stat
  const pointsProb = useMemo(() => {
    const rng = makeSeededRng(
      `${player.player_id}-PTS-${pointsTarget}-${ptsProj.mu.toFixed(
        6
      )}-${ptsProj.size.toFixed(6)}`
    );
    return probabilityOverLineUsingNB(
      ptsProj.mu,
      ptsProj.size,
      pointsTarget - 0.5,
      {
        samples: 4000,
        rng,
      }
    );
  }, [player.player_id, pointsTarget, ptsProj.mu, ptsProj.size]);

  const threesProb = useMemo(() => {
    const rng = makeSeededRng(
      `${player.player_id}-3PM-${threesTarget}-${thrProj.mu.toFixed(
        6
      )}-${thrProj.size.toFixed(6)}-${thrProj.zeroInflation ?? 0}`
    );
    return probabilityOverLineUsingNB(
      thrProj.mu,
      thrProj.size,
      threesTarget - 0.5,
      {
        samples: 4000,
        zeroInflation: thrProj.zeroInflation,
        rng,
      }
    );
  }, [
    player.player_id,
    threesTarget,
    thrProj.mu,
    thrProj.size,
    thrProj.zeroInflation,
  ]);

  const assistsProb = useMemo(() => {
    const rng = makeSeededRng(
      `${player.player_id}-AST-${assistsTarget}-${astProj.mu.toFixed(
        6
      )}-${astProj.size.toFixed(6)}`
    );
    return probabilityOverLineUsingNB(
      astProj.mu,
      astProj.size,
      assistsTarget - 0.5,
      {
        samples: 4000,
        rng,
      }
    );
  }, [player.player_id, assistsTarget, astProj.mu, astProj.size]);

  const reboundsProb = useMemo(() => {
    const rng = makeSeededRng(
      `${player.player_id}-REB-${reboundsTarget}-${rebProj.mu.toFixed(
        6
      )}-${rebProj.size.toFixed(6)}`
    );
    return probabilityOverLineUsingNB(
      rebProj.mu,
      rebProj.size,
      reboundsTarget - 0.5,
      {
        samples: 4000,
        rng,
      }
    );
  }, [player.player_id, reboundsTarget, rebProj.mu, rebProj.size]);

  return (
    <div
      className="glass-card p-6 animate-fade-up"
      style={{ animationDelay: "200ms" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-5 h-5 text-foreground animate-flash" />
        <h3 className="text-lg font-semibold">Betting Insights</h3>
      </div>

      {/* Custom probability selectors */}
      <div className="space-y-6 mb-6">
        {/* Points */}
        <div
          className="betting-card p-4 animate-fade-up"
          style={{ animationDelay: "250ms" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Points</span>
            <span className="text-xs text-muted-foreground">
              at least {pointsTarget}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {pointsOptions.map((opt) => (
              <Button
                key={opt}
                variant={pointsTarget === opt ? "default" : "secondary"}
                size="sm"
                onClick={() => setPointsTarget(opt)}
              >
                {opt}
              </Button>
            ))}
            <div className="flex items-center gap-2">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Custom"
                value={pointsCustom}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[1-9]\d*$/.test(val)) {
                    setPointsCustom(val);
                  }
                }}
                className="w-24 h-8"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const v = parseInt(pointsCustom, 10);
                  if (isFinite(v) && v > 0) setPointsTarget(v);
                }}
              >
                Set
              </Button>
            </div>
          </div>
          <ConfidenceBar confidence={Math.round(pointsProb * 100)} />
          <p className="text-sm text-muted-foreground mt-2">
            Chance to score at least {pointsTarget} points next game.
          </p>
        </div>

        {/* 3-Pointers */}
        <div
          className="betting-card p-4 animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">3-Pointers</span>
            <span className="text-xs text-muted-foreground">
              at least {threesTarget}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {threesOptions.map((opt) => (
              <Button
                key={opt}
                variant={threesTarget === opt ? "default" : "secondary"}
                size="sm"
                onClick={() => setThreesTarget(opt)}
              >
                {opt}
              </Button>
            ))}
            <div className="flex items-center gap-2">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Custom"
                value={threesCustom}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[1-9]\d*$/.test(val)) {
                    setThreesCustom(val);
                  }
                }}
                className="w-24 h-8"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const v = parseInt(threesCustom, 10);
                  if (isFinite(v) && v > 0) setThreesTarget(v);
                }}
              >
                Set
              </Button>
            </div>
          </div>
          <ConfidenceBar confidence={Math.round(threesProb * 100)} />
          <p className="text-sm text-muted-foreground mt-2">
            Chance to make at least {threesTarget} threes next game.
          </p>
        </div>

        {/* Assists */}
        <div
          className="betting-card p-4 animate-fade-up"
          style={{ animationDelay: "350ms" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Assists</span>
            <span className="text-xs text-muted-foreground">
              at least {assistsTarget}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {arbSeq.map((opt) => (
              <Button
                key={opt}
                variant={assistsTarget === opt ? "default" : "secondary"}
                size="sm"
                onClick={() => setAssistsTarget(opt)}
              >
                {opt}
              </Button>
            ))}
            <div className="flex items-center gap-2">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Custom"
                value={assistsCustom}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[1-9]\d*$/.test(val)) {
                    setAssistsCustom(val);
                  }
                }}
                className="w-24 h-8"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const v = parseInt(assistsCustom, 10);
                  if (isFinite(v) && v > 0) setAssistsTarget(v);
                }}
              >
                Set
              </Button>
            </div>
          </div>
          <ConfidenceBar confidence={Math.round(assistsProb * 100)} />
          <p className="text-sm text-muted-foreground mt-2">
            Chance to record at least {assistsTarget} assists next game.
          </p>
        </div>

        {/* Rebounds */}
        <div
          className="betting-card p-4 animate-fade-up"
          style={{ animationDelay: "400ms" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Rebounds</span>
            <span className="text-xs text-muted-foreground">
              at least {reboundsTarget}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {arbSeq.map((opt) => (
              <Button
                key={opt}
                variant={reboundsTarget === opt ? "default" : "secondary"}
                size="sm"
                onClick={() => setReboundsTarget(opt)}
              >
                {opt}
              </Button>
            ))}
            <div className="flex items-center gap-2">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Custom"
                value={reboundsCustom}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[1-9]\d*$/.test(val)) {
                    setReboundsCustom(val);
                  }
                }}
                className="w-24 h-8"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const v = parseInt(reboundsCustom, 10);
                  if (isFinite(v) && v > 0) setReboundsTarget(v);
                }}
              >
                Set
              </Button>
            </div>
          </div>
          <ConfidenceBar confidence={Math.round(reboundsProb * 100)} />
          <p className="text-sm text-muted-foreground mt-2">
            Chance to grab at least {reboundsTarget} rebounds next game.
          </p>
        </div>
      </div>

      {/* Removed legacy heuristic insights list */}

      <div className="mt-6 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          * Analysis based on current season performance and recent form
        </p>
        <p className="text-xs text-muted-foreground">
          * Always gamble responsibly
        </p>
      </div>
    </div>
  );
}
