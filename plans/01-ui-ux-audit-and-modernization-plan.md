# Kapsamlı UI/UX Denetimi ve Modernizasyon Planı (Actyra)

**Tarih:** 25 Ağustos 2026  
**Durum:** 🟢 Tamamlandı (Uygulandı ve Doğrulandı)  
**Kapsam:** Tüm Genel Sayfalar, Navigasyon, Tema Sistemi, Etkinlik Akışı, Mobil Uyumluluk  

---

## 🔍 UI/UX Denetim Bulguları (Tespit Edilen Sorunlar)

### 1. 🚨 Kritik Layout & Navigasyon Hataları (Çift/Üçlü Navbar & Footer)

- **Sorun:** `ConditionalLayout.js` tüm genel sayfaları `<NavBar />` ve `<Footer />` ile sarmalamaktadır. Ancak `events/page.js`, `events/[slug]/page.js`, `events/[slug]/tickets/page.js`, `warenkorb/page.js`, `profil/page.js` ve `(public)/layout.js` sayfaları da kendi içinde tekrar `<NavBar />` çağırmaktadır.
- **Sonuç:** Sayfalarda üst üste binmiş 2 veya 3 adet sabit navbar render edilmekte; bu durum z-index çakışmalarına, zıplayan sayfa düzenine, sepet sayacı senkronizasyon bozukluklarına ve kırık bir kullanıcı deneyimine yol açmaktadır.

### 2. 🎨 Tema (Dark/Light Mode) & Renk Kontrastı Tutarsızlıkları

- **Beyaz Üzerine Beyaz Yazı:** `globals.css` içindeki `.ticket-summary` ve `.ticket-total` sınıflarında açık temada (`text-white`) beyaz arka plan üstüne beyaz yazı yazılmaktadır (tamamen okunaksız).
- **Karanlık Modda Patlayan Neon Pembe:** `EventCardsIntro.js` bileşeni açık mod için hardcoded `bg-pink-100 border-pink-200` kullanırken karanlık mod desteği yoktur. `KategorienSection.js` ise karanlık modda kartları `dark:bg-pink-500` ile parlak pembe yapmaktadır.
- **Navbar Arama Çubuğu Kontrastı:** Navbar koyu degrade iken arama inputu `text-black` ve yarı saydam beyaz arka plan kullanmaktadır; metinler neredeyse görünmezdir.
- **Eksik CSS Değişkenleri:** Shadcn bileşenleri (`button.js`, `alert.js`) `--background`, `--primary` gibi CSS değişkenlerini beklerken `globals.css` içinde bu değişkenler tanımlanmamıştır.

### 3. 🔤 Tipografi & Font Entegrasyonu

- **Font Bağlantı Kopukluğu:** `layout.js` içinde modern **Geist** ve **Geist Mono** fontları tanımlanmış fakat `globals.css` içinde `body` için `font-family: Arial, Helvetica, sans-serif;` zorlanmıştır. Uygulama modern web fontu yerine ham Arial fontuyla render edilmektedir.

### 4. 📱 Responsive & Taşma (Overflow) Sorunları

- **Hardcoded Genişlik:** `globals.css` içindeki `.glass-card` sınıfı `width: 440px; height: 360px;` sabit piksel değerine sahiptir; bu durum 440px'den dar mobil cihazlarda yatay kaydırma (horizontal scroll) ve taşmaya yol açmaktadır.
- **Mobil Menü Tasarımı:** Mobil menü öğeleri `items-end` ile sağa yaslanmış, arama çubuğu mobilde tamamen gizlenmiş ve açılış animasyonu pürüzlüdür.

### 5. ⚡ Performans ve Render Sorunları

- **WaveSeparator CPU Tüketimi:** `WaveSeparator.js` bileşeni `requestAnimationFrame` ile ana iş parçacığında (main thread) her saniye 60-120 kez 100 adet trigonometrik `Math.sin` hesabı yapmakta, işlemciyi ve pil tüketimini gereksiz yere zorlamaktadır.
- **Kategori Bölümünde N+1 Fetch Döngüsü:** `KategorienSection.js` anasayfa yüklendiğinde bir `for` döngüsü içinde ardışık 8 ayrı API isteği atmaktadır.

### 6. 🧩 Sayfa Bazlı UX & Tasarım Sorunları

- **Etkinlik Detay Sayfasında Tekrarlayan Hero Banner:** Kullanıcı `/events/[slug]` sayfasına girdiğinde doğrudan etkinliği görmek yerine anasayfadaki video tanıtım banner'ı (`HeroDetailComp`) ile karşılaşmaktadır.
- **Bilet Sayfasında Çift Kart:** `/events/[slug]/tickets` sayfası dışta bir kart render ederken içine eklenen `TicketSelector` da aynı resmi ve başlığı içeren ikinci bir kart render etmektedir (iç içe çift kart).
- **Tarayıcı `alert()` Pop-up'ları:** Form gönderimlerinde veya hatalarda tarayıcının ilkel `alert(...)` pencereleri kullanılmaktadır.
- **Ham Emojiler:** Arayüzde ikon yerine doğrudan metin emojileri (`📅`, `📍`, `🎟️`, `💶`, `🤝`, `💰`) kullanılmıştır.

---

## 🎯 Tasarım Hedefleri & Kararları

1. **Geist Sans Tipografisi:** Arial fontu kaldırılarak tüm projede Next.js'in resmi `Geist` ve `Geist Mono` fontları aktif edilecektir.
2. **Düzen Temizliği:** Tüm sayfalardaki mükerrer `NavBar` ve `Footer` çağrıları temizlenecek, yalnızca `ConditionalLayout` üzerinden merkezi yönetilecektir.
3. **Tutarlı Kart ve Buton Tasarımı:** Sayfadaki farklı farklı kart stilleri (biri koyu lacivert, biri pembe, biri şeffaf) ortak modern tasarım token'larına bağlanacaktır.
4. **Etkinlik Detay Sayfası İyileştirmesi:** Etkinlik detay sayfasındaki anasayfa tanıtım videosu (`HeroDetailComp`) kaldırılarak yerine doğrudan etkinliğin odak noktası olduğu modern bir detay düzeni kurulacaktır.

---

## 📋 Uygulama Adımları

### Aşama 1: Temel Tasarım Sistemi, CSS ve Font Optimizasyonu

- `globals.css` dosyasının Tailwind v4 ve modern CSS değişkenleriyle (`@theme`, Geist font ailesi, dark/light mod token'ları, modern cam efektleri) güncellenmesi.
- Arial font kuralının kaldırılarak `Geist Sans`'ın varsayılan yapılması.
- Sabit genişlikli (`440px`) CSS sınıflarının responsive hale getirilmesi.
- `WaveSeparator.js` bileşeninin performans dostu CSS/SVG animasyonuna dönüştürülmesi.

### Aşama 2: Layout & Navigasyon (NavBar, Mobile Menu, Footer)

- Mükerrer `NavBar` çağrılarının kaldırılması (`(public)/layout.js`, `events/page.js`, `events/[slug]/page.js`, `warenkorb/page.js`, `profil/page.js` vb.).
- `NavBar.js` tasarımının yenilenmesi:
  - Modern, şık cam efektli header.
  - Okunabilir, şık arama çubuğu ve sonuç dropdown'ı.
  - Mobilde akıcı, modern açılır menü ve mobil arama deneyimi.
  - Profil dropdown'ındaki hardcoded negatif margin/stil bozukluklarının giderilmesi.
- `Footer.js` bileşenindeki sosyal ikonların, telif yılının (2026) ve grid hizalamasının modernize edilmesi.

### Aşama 3: Anasayfa Bölümleri (Hero, Intro Kartları, Etkinlik Listesi

Kategoriler)

- `HeroComp.js`: Modern badge etiketleri, akıcı tipografi, CTA butonları ve video modal tetikleyicisinin yenilenmesi.
- `EventCardsIntro.js`: Karanlık ve aydınlık mod uyumlu, modern cam efektli 3'lü tanıtım kartları.
- `EventListSection.js`: Modern kart tasarımı, hover animasyonları, Lucide ikonları, skeleton loading durumu.
- `KategorienSection.js`: N+1 API çağrısının optimize edilmesi, modern kategori kartları ve renk paleti.

### Aşama 4: Etkinlik Detay, Bilet Seçimi & Sepet Sayfaları

- `events/[slug]/page.js`: Gereksiz hero video banner'ının kaldırılması; 2 sütunlu modern etkinlik detay layout'u (Sol: Görsel + Açıklama + Organizatör; Sağ: Sticky Bilet & Fiyat Kutusu).
- `TicketSelector.js` & `events/[slug]/tickets/page.js`: İç içe çift kart yapısının temizlenmesi, miktar seçicinin ve bağış hesaplamasının modern arayüze kavuşturulması.
- `warenkorb/page.js`: Emojilerin Lucide ikonlarla değiştirilmesi, şık boş sepet ve sipariş özeti görünümü.

### Aşama 5: Formlar, Profil ve Bilgi Sayfaları (Event Erstellen, Profil, Footer Sayfaları)

- `EventErstellenForm.js`: Ham `alert()` yerine kullanıcı dostu bildirimler, input odak durumları, dark mode uyumu.
- `ProfileContent.js` & `ProfileTabs.js`: Temiz kullanıcı kartı, sekmeler ve modern butonlar.
- `ContactComp.js`, `FaqComp.js`, `TermsComp.js`, `PrivacyPolicyComp.js`: Tipografi ve form düzeni iyileştirmeleri.

---

## 🧪 Doğrulama Planı

### Otomatik Testler & Linting

- `bun run lint`: Sözdizimi ve ESLint kurallarının hatasız geçtiğinin doğrulanması.
- `bun run build`: Next.js production build'inin hatasız tamamlandığının teyit edilmesi.

### Manuel Doğrulama

- **Dark / Light Mode:** Tema butonuna basıldığında tüm sayfalarda metinlerin ve kartların net şekilde okunabilir olduğunun kontrolü.
- **Responsive & Mobil:** 375px (mobil), 768px (tablet) ve 1280px+ (desktop) ekran boyutlarında yatay taşma olmaksızın kusursuz görünümün doğrulanması.
- **Navigasyon:** Sayfa geçişlerinde çift navbar veya titreme oluşmadığının teyit edilmesi.
