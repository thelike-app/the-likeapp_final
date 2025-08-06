# GitHub ve Vercel Deploy Rehberi 🚀

## 📋 Özet

Bu rehber, spor istatistikleri uygulamanızı GitHub'a yükleyip Vercel'de ücretsiz olarak nasıl yayınlayacağınızı adım adım anlatır. **Herhangi bir token veya ödeme gerektirmez!**

## 🎯 Hedef

- ✅ GitHub repository'nizi güncellemek
- ✅ Vercel'de ücretsiz deploy yapmak
- ✅ Çalışan bir spor istatistikleri sitesi elde etmek

## 📁 Proje Dosyaları

Aşağıdaki dosyalar hazır ve GitHub'a yüklenmeye hazır:

```
sports-stats-app/
├── index.html              # Ana sayfa (sade tasarım)
├── api/
│   └── sports-stats.js     # API entegrasyonu (Ball Don't Lie API anahtarı dahil)
├── vercel.json             # Vercel konfigürasyonu
├── package.json            # Proje ayarları
├── README.md              # Detaylı dokümantasyon
├── .gitignore             # Git ignore dosyası
└── github-vercel-deploy-guide.md # Bu rehber
```

## 🛠️ Adım 1: GitHub Repository'nizi Güncelleyin

### Seçenek A: Web Arayüzü (Kolay)

1. **GitHub'da `thelike-app` repository'nize gidin**
   - https://github.com/KULLANICI_ADINIZ/thelike-app

2. **Mevcut dosyaları silin (opsiyonel)**
   - Eğer repository'nizde eski dosyalar varsa, bunları silebilirsiniz
   - Her dosyayı tek tek seçip "Delete file" yapabilirsiniz

3. **Yeni dosyaları yükleyin**
   - "Add file" > "Upload files" butonuna tıklayın
   - `sports-stats-app.zip` dosyasını çıkarın
   - Tüm dosyaları sürükleyip bırakın:
     - `index.html`
     - `api/sports-stats.js`
     - `vercel.json`
     - `package.json`
     - `README.md`
     - `.gitignore`
     - `github-vercel-deploy-guide.md`

4. **Commit yapın**
   - Commit message: "Update: Complete sports statistics app with API integration"
   - "Commit changes" butonuna tıklayın

### Seçenek B: Git Commands (Gelişmiş)

```bash
# Repository'yi klonlayın
git clone https://github.com/KULLANICI_ADINIZ/thelike-app.git
cd thelike-app

# Eski dosyaları silin (opsiyonel)
rm -rf *

# Yeni dosyaları kopyalayın
# (sports-stats-app klasöründeki tüm dosyaları buraya kopyalayın)

# Git'e ekleyin ve commit yapın
git add .
git commit -m "Update: Complete sports statistics app with API integration"
git push origin main
```

## 🌐 Adım 2: Vercel'de Deploy Edin

### 1. Vercel'e Giriş Yapın

1. **Vercel.com'a gidin**: https://vercel.com
2. **"Sign Up" veya "Log In" butonuna tıklayın**
3. **"Continue with GitHub" seçeneğini seçin**
4. **GitHub hesabınızla giriş yapın**

### 2. Yeni Proje Oluşturun

1. **Vercel dashboard'da "New Project" butonuna tıklayın**
2. **GitHub repository'leriniz listelenir**
3. **`thelike-app` repository'nizi bulun ve "Import" butonuna tıklayın**

### 3. Proje Ayarlarını Yapın

1. **Project Name**: `thelike-app` (varsayılan olarak gelir)
2. **Framework Preset**: "Other" seçin
3. **Build and Output Settings**:
   - Build Command: `echo "Build complete"` (veya boş bırakın)
   - Output Directory: `.` (nokta)
   - Install Command: `npm install` (varsayılan)

### 4. Environment Variables (Önemli!)

1. **"Environment Variables" bölümünü açın**
2. **Aşağıdaki değişkeni ekleyin**:
   - **Name**: `BALLDONTLIE_API_KEY`
   - **Value**: `ef97e450-1fd1-4d12-8535-6357d948f65c`
   - **Environment**: All (Production, Preview, Development)

### 5. Deploy Edin

1. **"Deploy" butonuna tıklayın**
2. **Deploy işlemi 1-2 dakika sürer**
3. **Başarılı olduğunda size bir URL verilir**

## 🧪 Adım 3: Sitenizi Test Edin

Deploy tamamlandıktan sonra:

1. **Vercel'in verdiği URL'yi açın** (örn: `https://thelike-app-xyz.vercel.app`)
2. **Aşağıdaki test aramalarını yapın**:

### Basketball Testleri
- `LeBron James`
- `Stephen Curry`
- `Giannis Antetokounmpo`

### Football Testleri
- `Messi`
- `Cristiano Ronaldo`
- `Kylian Mbappe`

### Tennis Testleri
- `Novak Djokovic`
- `Rafael Nadal`
- `Carlos Alcaraz`

### Formula 1 Testleri
- `Lewis Hamilton`
- `Max Verstappen`
- `Charles Leclerc`

## 🎯 Beklenen Sonuçlar

✅ **Başarılı Test**: Atlet adını girip "ANALYZE" butonuna bastığınızda, atletin bilgileri ve son 10 etkinlik istatistikleri görüntülenir.

❌ **Hata Durumu**: Eğer "Failed to fetch athlete statistics" hatası alırsanız:
1. Environment variable'ın doğru eklendiğini kontrol edin
2. Vercel logs'larını kontrol edin (Vercel dashboard > Functions > View Function Logs)
3. API anahtarının doğru olduğunu kontrol edin

## 🔧 Sorun Giderme

### API Hatası
- **Sebep**: Environment variable eksik veya yanlış
- **Çözüm**: Vercel dashboard'da Environment Variables'ı kontrol edin

### Deploy Hatası
- **Sebep**: Dosya yapısı yanlış
- **Çözüm**: Dosyaların doğru konumda olduğunu kontrol edin

### Responsive Sorunları
- **Sebep**: CSS yüklenmemiş
- **Çözüm**: Tarayıcı cache'ini temizleyin

## 📱 Özellikler

✅ **7 Farklı Spor**: Basketball, Football, Baseball, Hockey, Tennis, MMA, Formula 1
✅ **Responsive Tasarım**: Mobil ve masaüstü uyumlu
✅ **Modern UI**: Glassmorphism tasarım
✅ **Gerçek API**: Ball Don't Lie NBA API entegrasyonu
✅ **Ücretsiz**: Vercel free tier kullanır

## 🎉 Tebrikler!

Bu adımları tamamladıktan sonra:

- ✅ Çalışan bir spor istatistikleri siteniz olacak
- ✅ GitHub'da güncel kodlarınız bulunacak
- ✅ Vercel'de otomatik deploy sisteminiz çalışacak
- ✅ Ücretsiz ve kalıcı bir URL'niz olacak

## 🔄 Gelecek Güncellemeler

GitHub'a yeni kod push ettiğinizde, Vercel otomatik olarak sitenizi güncelleyecek. Bu sayede sürekli geliştirme yapabilirsiniz.

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Bu rehberi tekrar okuyun
2. Vercel logs'larını kontrol edin
3. GitHub repository'nizin dosya yapısını kontrol edin

---

**Not**: Bu rehber, ücretsiz Vercel hesabı kullanır ve herhangi bir ödeme gerektirmez. Vercel free tier, bu proje için yeterlidir.

