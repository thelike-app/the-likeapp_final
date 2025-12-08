import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SportType } from "./SportToggle";
import type { ApiPlayer } from "@/pages/Index";

interface SearchInputProps {
  onSearch: (playerName: string, playerId?: number) => void;
  isLoading?: boolean;
  sportFilter: SportType;
  apiPlayers?: ApiPlayer[];
  hasResults?: boolean;
}

export function SearchInput({
  onSearch,
  isLoading,
  sportFilter,
  apiPlayers = [],
  hasResults = false,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<
    number | undefined
  >();
  const [suggestions, setSuggestions] = useState<ApiPlayer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [justSelected, setJustSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (justSelected) {
      setJustSelected(false);
      return;
    }
    if (query.length >= 1 && apiPlayers.length > 0) {
      const matches = apiPlayers
        .filter((player) =>
          player.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  }, [query, apiPlayers]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (player: ApiPlayer) => {
    setJustSelected(true);
    setQuery(player.name);
    setSelectedPlayerId(player.player_id);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    if (query.trim()) {
      const matchedPlayer = apiPlayers.find(
        (p) => p.name.toLowerCase() === query.trim().toLowerCase()
      );
      const playerId = selectedPlayerId || matchedPlayer?.player_id;
      onSearch(query.trim(), playerId);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSubmit();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        const player = suggestions[highlightedIndex];
        setJustSelected(true);
        setQuery(player.name);
        setSelectedPlayerId(player.player_id);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        onSearch(player.name, player.player_id);
      } else {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const placeholderText =
    sportFilter === "Football"
      ? "Search Football player..."
      : "Search NBA player...";

  const handleCancel = () => {
    setQuery("");
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  return (
    <>
      {/* Blur Overlay */}
      {showSuggestions && hasResults && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30"
          onClick={handleCancel}
        />
      )}

      <div ref={containerRef} className="relative w-full max-w-lg mx-auto z-40">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              query.length >= 1 &&
              suggestions.length > 0 &&
              setShowSuggestions(true)
            }
            placeholder={placeholderText}
            className="search-input pl-14 pr-12"
            disabled={isLoading}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-card overflow-hidden z-50">
            {suggestions.map((player, index) => (
              <div
                key={player.player_id}
                onClick={() => handleSelect(player)}
                className={cn(
                  "suggestion-item",
                  index === highlightedIndex && "bg-muted"
                )}
              >
                <span className="font-medium">{player.name}</span>
              </div>
            ))}

            {/* Cancel Button */}
            {hasResults && (
              <button
                onClick={handleCancel}
                className="w-full py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-t border-border"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading}
          className={cn(
            "btn-analyze mt-5 w-full flex items-center justify-center gap-2",
            (!query.trim() || isLoading) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <span>ANALYZE</span>
          )}
        </button>

        {/* Tagline */}
        <p className="text-center text-muted-foreground text-sm mt-4">
          Ask less. Get more.
        </p>
      </div>
    </>
  );
}
