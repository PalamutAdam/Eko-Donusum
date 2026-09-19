/* ==========================================================================
   EkoDönüşüm - Interactive JavaScript Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initStatsCounter();
  initMaterialsSection();
  initEcoCalculator();
  initMythsSection();
  initQuizSection();
  initDropoffSection();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('ekodonusum_theme') || 'light';
  
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('ekodonusum_theme', 'light');
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('ekodonusum_theme', 'dark');
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.navbar');

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navbar.contains(e.target)) {
      navMenu.classList.remove('active');
      mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
    }
  });
}

/* --------------------------------------------------------------------------
   3. Animated Stats Counter (Scroll Observer)
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statCards = document.querySelectorAll('.stat-number');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        statCards.forEach(card => {
          const target = parseInt(card.getAttribute('data-target'), 10);
          let count = 0;
          const speed = target > 1000 ? 50 : 25;
          const step = Math.ceil(target / speed);

          const updateCount = () => {
            count += step;
            if (count >= target) {
              card.innerText = target.toLocaleString('tr-TR');
            } else {
              card.innerText = count.toLocaleString('tr-TR');
              setTimeout(updateCount, 30);
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* --------------------------------------------------------------------------
   4. Material & Waste Recycling Database & Guide
   -------------------------------------------------------------------------- */
const materialsData = [
  {
    id: 1,
    name: 'Plastik Su & İçecek Şişesi (PET 1)',
    category: 'plastik',
    icon: 'fa-solid fa-bottle-water',
    time: '450 Yıl',
    status: 'yes',
    statusText: 'Tamamen Dönüştürülebilir',
    preview: 'Çalkalayıp havasını sıkıştırarak kapağıyla birlikte plastik ambalaj kutusuna atın.',
    details: {
      code: 'PET / PETE (1)',
      usage: 'Su şişeleri, gazlı meşrubat kapları, yağ ambalajları.',
      steps: [
        'İçindeki sıvı kalıntısını lavaboya boşaltın.',
        'Hacim tasarrufu sağlamak için ezerek yassılaştırın.',
        'Mavi veya sarı plastik geri dönüşüm kumbarasına bırakın.'
      ],
      warning: 'PET 1 şişeleri tek kullanımlıktır, tekrar tekrar su doldurup içmek mikroplastik salınımına yol açabilir.'
    }
  },
  {
    id: 2,
    name: 'Sert Plastik Deterjan & Şampuan Kutusu (HDPE 2)',
    category: 'plastik',
    icon: 'fa-solid fa-pump-soap',
    time: '100 - 300 Yıl',
    status: 'yes',
    statusText: 'Tamamen Dönüştürülebilir',
    preview: 'Yüksek yoğunluklu polietilendir. Kolaylıkla geri dönüştürülüp boru veya oyuncak yapılır.',
    details: {
      code: 'HDPE (2)',
      usage: 'Şampuan, deterjan, süt bidonları ve çamaşır suyu kutuları.',
      steps: [
        'Kutuyu su ile çalkalayın.',
        'Pompa mekanizması varsa pompayı çıkarın (farklı plastik türüdür).',
        'Plastik ambalaj kumbarasına atın.'
      ],
      warning: 'İçinde kimyasal kalıntı kalmamasına özen gösterin.'
    }
  },
  {
    id: 3,
    name: 'Süt & Meyve Suyu Ambalajı (Kompozit Kutular)',
    category: 'kagit',
    icon: 'fa-solid fa-box-archive',
    time: '5 Yıl',
    status: 'yes',
    statusText: 'Özel Tesislerde Dönüştürülebilir',
    preview: '%75 Kağıt, %20 Plastik ve %5 Alüminyum katmandan oluşur.',
    details: {
      code: 'C/PAP (84)',
      usage: 'Uzun ömürlü sütler, meyve suları, hazır çorba ambalajları.',
      steps: [
        'Kutunun kulakçıklarını açıp tamamen düzleştirin.',
        'Kapağını kapatıp kağıt/kompozit ambalaj kutusuna atın.'
      ],
      warning: 'Evsel organik çöp kutularına kesinlikle atmayın.'
    }
  },
  {
    id: 4,
    name: 'Yağlı Pizza Kutusu',
    category: 'kagit',
    icon: 'fa-solid fa-pizza-slice',
    time: '2 - 3 Ay',
    status: 'part',
    statusText: 'Kısmen Dönüştürülebilir',
    preview: 'Yağ emmiş karton kısımlar kağıt geri dönüşüm liflerini bozar!',
    details: {
      code: 'PAP (20)',
      usage: 'Paket pizza kutuları.',
      steps: [
        'Kutunun temiz kalan üst kapağını yırtıp kağıt kumbarasına atın.',
        'Peynir ve yağ yapışmış alt tabanını ise organik / evsel atığa atın.'
      ],
      warning: 'Yağlı kağıtlar geri dönüşüm hamurunu kirlettiği için tüm partiyi çöpe dönüştürebilir!'
    }
  },
  {
    id: 5,
    name: 'Cam Şişe & Kavanoz',
    category: 'cam',
    icon: 'fa-solid fa-wine-bottle',
    time: '4.000 Yıl',
    status: 'yes',
    statusText: '%100 Sonsuz Dönüştürülebilir',
    preview: 'Cam kalitesini hiç kaybetmeden sonsuz kez eritilip yeniden kullanılabilir.',
    details: {
      code: 'GL (70-72)',
      usage: 'Maden suyu şişeleri, konserve kavanozları, zeytinyağı şişeleri.',
      steps: [
        'Kapağını çıkartın (metal kapaklar metal kumbarasına).',
        'Durulayıp yeşil/beyaz cam kumbarasına atın.'
      ],
      warning: 'Kırık camları atarken görevlilerin güvenliği için gazete kağıdına sarın.'
    }
  },
  {
    id: 6,
    name: 'Alüminyum Meşrubat Kutusu',
    category: 'metal',
    icon: 'fa-solid fa-prescription-bottle',
    time: '200 - 500 Yıl',
    status: 'yes',
    statusText: '%95 Enerji Tasarrufu',
    preview: 'Sıfırdan alüminyum üretmeye kıyasla geri dönüşümü %95 daha az enerji harcar!',
    details: {
      code: 'ALU (41)',
      usage: 'İçecek ve soda kutuları.',
      steps: [
        'İçini boşaltın ve ezerek küçültün.',
        'Metal toplama kutusuna veya ambalaj konteynerine atın.'
      ],
      warning: 'Geri dönüştürülen bir meşrubat kutusu, bir televizyonu 3 saat çalıştıracak enerjiyi tasarruf eder.'
    }
  },
  {
    id: 7,
    name: 'Atık Pil & Akü',
    category: 'tehlikeli',
    icon: 'fa-solid fa-battery-three-quarters',
    time: '100 Yıl',
    status: 'no',
    statusText: 'Özel Toplama (Tehlikeli Atık)',
    preview: 'Cıva, kurşun ve kadmiyum içerir. Asla evsel çöpe veya doğaya atılmamalıdır!',
    details: {
      code: 'HAZMAT / E-ATIK',
      usage: 'Kumanda pilleri, şarjlı piller, laptop bataryaları.',
      steps: [
        'Evde kuru bir kutuda biriktirin.',
        'Okul, market veya muhtarlıklardaki kilitli Atık Pil Kutularına bırakın.'
      ],
      warning: '1 adet küçük kalem pil, 4 metreküp toprağı zehirleyebilir!'
    }
  },
  {
    id: 8,
    name: 'Eski Cep Telefonu & Bilgisayar (E-Atık)',
    category: 'elektronik',
    icon: 'fa-solid fa-laptop-code',
    time: 'Binlerce Yıl',
    status: 'yes',
    statusText: 'Değerli Maden Geri Kazanımı',
    preview: 'İçerisinde altın, gümüş, bakır ve nadir toprak elementleri barındırır.',
    details: {
      code: 'WEEE / E-WASTE',
      usage: 'Eski telefonlar, şarj kabloları, yazıcılar, klavyeler.',
      steps: [
        'Kişisel verilerinizi sıfırlayın.',
        'Belediyelerin 1. Sınıf Atık Getirme Merkezlerine veya e-atık toplama kampanyalarına teslim edin.'
      ],
      warning: 'E-atıklar dünyada en hızlı büyüyen atık türüdür.'
    }
  },
  {
    id: 9,
    name: 'Bitkisel Atık Pişirme Yağı',
    category: 'tehlikeli',
    icon: 'fa-solid fa-oil-can',
    time: 'Doğada Çürümez',
    status: 'no',
    statusText: 'Lavaboya Dökülemez! (Biyodizel yapılır)',
    preview: 'Lavaboya dökülen 1 litrelik atık yağ tam 1 milyon litre içme suyunu kirletir!',
    details: {
      code: 'VEG-OIL',
      usage: 'Kızartma yağları, konserve balık yağları.',
      steps: [
        'Tavadaki yağı soğutun.',
        'Bir cam kavanoz veya PET şişede biriktirin.',
        'Belediye atık yağ toplama noktalarına veya muhtarlıklara verin.'
      ],
      warning: 'Atık yağlar lisanslı tesislerde çevre dostu Biyodizel yakıtına dönüştürülür.'
    }
  },
  {
    id: 10,
    name: 'Meyve & Sebze Kabukları',
    category: 'tehlikeli',
    icon: 'fa-solid fa-apple-whole',
    time: '1 - 6 Ay',
    status: 'yes',
    statusText: 'Evde Kompost Yapılabilir',
    preview: 'Organik atıklar çöplükte metan gazı üretir. Evde gübre yapmak harika bir alternatiftir.',
    details: {
      code: 'ORGANIC',
      usage: 'Müz kabuğu, elma çöpü, çay posası, sebze artıkları.',
      steps: [
        'Kompost kovasında kahverengi atıklarla (kuru yaprak/karton) karıştırın.',
        'Bahçeniz ve saksı bitkileriniz için zengin besinli toprak elde edin.'
      ],
      warning: 'Et ve süt ürünlerini sinek ve koku yapmaması için ev kompostuna eklemeyin.'
    }
  },
  {
    id: 11,
    name: 'Gazete, Dergi & Kitap',
    category: 'kagit',
    icon: 'fa-solid fa-newspaper',
    time: '6 Hafta - 2 Ay',
    status: 'yes',
    statusText: 'Tamamen Dönüştürülebilir',
    preview: 'Lif kalitesi yüksektir. Dönüştürülerek tuvalet kağıdı veya karton koliye çevrilir.',
    details: {
      code: 'PAP (22)',
      usage: 'Ders kitapları, dergiler, gazete sayfaları, broşürler.',
      steps: [
        'Zımba teli veya plastik kapaklarını ayırın.',
        'Mavi kağıt kumbarasına bırakın.'
      ],
      warning: 'Islak ve küflenmiş kağıtları kurutmadan geri dönüşüme koymayın.'
    }
  },
  {
    id: 12,
    name: 'Floresan & LED Ampul',
    category: 'elektronik',
    icon: 'fa-solid fa-lightbulb',
    time: 'Belirsiz',
    status: 'no',
    statusText: 'Tehlikeli Atık Kapsamındadır',
    preview: 'Floresan ampuller cıva buharı içerir. Kırılması zehirli gaz salınımına neden olur.',
    details: {
      code: 'HAZMAT-LIGHT',
      usage: 'Tüp floresanlar, tasarruflu ampuller, LED lambalar.',
      steps: [
        'Ampulü kırmadan orijinal kutusuna veya kartona sarın.',
        'Elektrikli ev aletleri / e-atık toplama noktalarına teslim edin.'
      ],
      warning: 'Evsel çöp kutusuna atıldığında çöp kamyonunda kırılarak işçilere zarar verir.'
    }
  }
];

function initMaterialsSection() {
  const materialsGrid = document.getElementById('materialsGrid');
  const searchInput = document.getElementById('materialSearch');
  const clearSearchBtn = document.getElementById('clearSearch');
  const categoryTabs = document.querySelectorAll('.tab-btn');
  const noResults = document.getElementById('noResults');

  let currentCategory = 'all';
  let currentSearch = '';

  function renderMaterials() {
    materialsGrid.innerHTML = '';

    const filtered = materialsData.filter(item => {
      const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
      const searchLower = currentSearch.toLocaleLowerCase('tr-TR');
      const matchesSearch = item.name.toLocaleLowerCase('tr-TR').includes(searchLower) ||
                            item.preview.toLocaleLowerCase('tr-TR').includes(searchLower) ||
                            item.category.toLocaleLowerCase('tr-TR').includes(searchLower);
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';

      filtered.forEach(mat => {
        const card = document.createElement('div');
        card.className = 'material-card';
        card.setAttribute('data-id', mat.id);

        let statusClass = 'status-yes';
        if (mat.status === 'part') statusClass = 'status-part';
        if (mat.status === 'no') statusClass = 'status-no';

        card.innerHTML = `
          <div class="mat-card-header">
            <div class="mat-icon-wrapper cat-${mat.category}">
              <i class="${mat.icon}"></i>
            </div>
            <span class="recyc-status ${statusClass}">${mat.statusText}</span>
          </div>
          <h3 class="mat-title">${mat.name}</h3>
          <div class="mat-time-badge">
            <i class="fa-solid fa-hourglass-half"></i> Doğada Kalma Süresi: <strong>${mat.time}</strong>
          </div>
          <p class="mat-tip-preview">${mat.preview}</p>
          <div class="mat-footer-link">
            <span>Detaylı Rehberi Oku</span> <i class="fa-solid fa-chevron-right"></i>
          </div>
        `;

        card.addEventListener('click', () => openMaterialModal(mat));
        materialsGrid.appendChild(card);
      });
    }
  }

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      renderMaterials();
    });
  });

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    clearSearchBtn.style.display = currentSearch.length > 0 ? 'block' : 'none';
    renderMaterials();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    currentSearch = '';
    clearSearchBtn.style.display = 'none';
    renderMaterials();
  });

  renderMaterials();
}

function openMaterialModal(mat) {
  const modal = document.getElementById('materialModal');
  const modalBody = document.getElementById('modalBody');

  let statusClass = 'status-yes';
  if (mat.status === 'part') statusClass = 'status-part';
  if (mat.status === 'no') statusClass = 'status-no';

  modalBody.innerHTML = `
    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
      <div class="mat-icon-wrapper cat-${mat.category}" style="width:64px; height:64px; font-size:2rem;">
        <i class="${mat.icon}"></i>
      </div>
      <div>
        <span class="recyc-status ${statusClass}">${mat.statusText}</span>
        <h2 style="font-size: 1.5rem; margin-top:4px;">${mat.name}</h2>
      </div>
    </div>

    <div style="background: var(--bg-card-subtle); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
      <p style="margin-bottom:6px;"><strong>Reçine / Sembol Kodu:</strong> ${mat.details.code}</p>
      <p style="margin-bottom:6px;"><strong>Tipik Kullanım Alanı:</strong> ${mat.details.usage}</p>
      <p style="margin:0;"><strong>Doğada Yok Olma Süresi:</strong> ${mat.time}</p>
    </div>

    <h4 style="margin-bottom: 12px;"><i class="fa-solid fa-list-check text-success"></i> Doğru Geri Dönüşüm Adımları:</h4>
    <ul style="margin-left: 20px; margin-bottom: 20px; font-size:0.95rem;">
      ${mat.details.steps.map(step => `<li style="margin-bottom:8px;">${step}</li>`).join('')}
    </ul>

    <div style="background: #fffbe6; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: var(--radius-sm); font-size: 0.9rem; color: #78350f;">
      <i class="fa-solid fa-triangle-exclamation"></i> <strong>Önemli Uyarı:</strong> ${mat.details.warning}
    </div>
  `;

  modal.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('materialModal');
  const modalClose = document.getElementById('modalClose');

  if (modalClose) {
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
});

/* --------------------------------------------------------------------------
   5. Eco-Impact Calculator Logic
   -------------------------------------------------------------------------- */
function initEcoCalculator() {
  const inputPlastic = document.getElementById('inputPlastic');
  const inputPaper = document.getElementById('inputPaper');
  const inputGlass = document.getElementById('inputGlass');
  const inputCan = document.getElementById('inputCan');

  const valPlastic = document.getElementById('valPlastic');
  const valPaper = document.getElementById('valPaper');
  const valGlass = document.getElementById('valGlass');
  const valCan = document.getElementById('valCan');

  const resTrees = document.getElementById('resTrees');
  const resWater = document.getElementById('resWater');
  const resEnergy = document.getElementById('resEnergy');
  const resCo2 = document.getElementById('resCo2');
  const badgeTitle = document.getElementById('badgeTitle');
  const calcFunFact = document.getElementById('calcFunFact');

  function calculate() {
    const plasticCount = parseInt(inputPlastic.value, 10);
    const paperKg = parseInt(inputPaper.value, 10);
    const glassCount = parseInt(inputGlass.value, 10);
    const canCount = parseInt(inputCan.value, 10);

    valPlastic.innerText = `${plasticCount} Adet`;
    valPaper.innerText = `${paperKg} Kg`;
    valGlass.innerText = `${glassCount} Adet`;
    valCan.innerText = `${canCount} Adet`;

    const annualPaperKg = paperKg * 12;
    const annualPlastic = plasticCount * 12;
    const annualGlass = glassCount * 12;
    const annualCan = canCount * 12;

    const treesSaved = (annualPaperKg * 0.017).toFixed(1);
    const waterSaved = Math.round(annualPlastic * 3 + annualPaperKg * 26 + annualGlass * 4 + annualCan * 5);
    const energySaved = Math.round(annualPlastic * 0.4 + annualPaperKg * 4 + annualGlass * 0.3 + annualCan * 0.6);
    const co2Reduced = Math.round(annualPlastic * 0.15 + annualPaperKg * 1.2 + annualGlass * 0.2 + annualCan * 0.25);

    resTrees.innerText = treesSaved;
    resWater.innerText = waterSaved.toLocaleString('tr-TR');
    resEnergy.innerText = energySaved.toLocaleString('tr-TR');
    resCo2.innerText = co2Reduced.toLocaleString('tr-TR');

    const totalItems = plasticCount + paperKg + glassCount + canCount;

    if (totalItems === 0) {
      badgeTitle.innerText = 'Geri Dönüşüm Başlangıcı';
      calcFunFact.innerHTML = `<i class="fa-solid fa-lightbulb"></i> <span>Geri dönüşüm sürgülerini kaydırarak yıllık dünya tasarrufunuzu keşfedin!</span>`;
    } else if (totalItems < 30) {
      badgeTitle.innerText = 'Çevre Dostu Vatandaş';
      const ledHours = Math.round(energySaved * 10);
      calcFunFact.innerHTML = `<i class="fa-solid fa-lightbulb"></i> <span>Tasarruf ettiğiniz enerji ile <strong>${ledHours} saat boyunca LED ampul</strong> yakabilirsiniz!</span>`;
    } else if (totalItems < 80) {
      badgeTitle.innerText = 'Geri Dönüşüm Ustası 🌿';
      const kmCar = Math.round(co2Reduced * 6);
      calcFunFact.innerHTML = `<i class="fa-solid fa-lightbulb"></i> <span>Engellediğiniz CO₂ salınımı, bir arabanın <strong>${kmCar} km yol yapmasına</strong> eşdeğerdir!</span>`;
    } else {
      badgeTitle.innerText = 'Sıfır Atık Şampiyonu 🏆';
      const phoneCharges = Math.round(energySaved * 80);
      calcFunFact.innerHTML = `<i class="fa-solid fa-lightbulb"></i> <span>Tasarrufunuz bir cep telefonunu tam <strong>${phoneCharges} kez şarj etmeye</strong> yeter!</span>`;
    }
  }

  [inputPlastic, inputPaper, inputGlass, inputCan].forEach(input => {
    input.addEventListener('input', calculate);
  });

  calculate();
}

/* --------------------------------------------------------------------------
   6. Myth vs Fact Cards (Click Flip toggle)
   -------------------------------------------------------------------------- */
function initMythsSection() {
  const mythCards = document.querySelectorAll('.myth-card');
  mythCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

/* --------------------------------------------------------------------------
   7. Interactive Quiz Engine
   -------------------------------------------------------------------------- */
const quizQuestions = [
  {
    question: '1 Ton atık kağıdın geri dönüştürülmesi yaklaşık kaç yetişkin ağacın kesilmesini önler?',
    options: ['5 Ağaç', '17 Ağaç', '50 Ağaç', '100 Ağaç'],
    correct: 1,
    explanation: '1 ton kağıdın geri kazanılması 17 olgun ağacı kesilmekten kurtarır, 4100 kWh elektrik ve 26.000 litre su tasarrufu sağlar.'
  },
  {
    question: 'Bir alüminyum içecek kutusu geri dönüştürüldüğünde sıfırdan üretimine göre yüzde kaç enerji tasarrufu sağlanır?',
    options: ['%25', '%50', '%75', '%95'],
    correct: 3,
    explanation: 'Alüminyumun geri dönüşümü %95 oranında muazzam bir enerji tasarrufu sağlar ve sonsuz kez dönüştürülebilir.'
  },
  {
    question: 'Aşağıdaki maddelerden hangisi ambalaj camı kumbarasına KESİNLİKLE atılmamalıdır?',
    options: ['Maden Suyu Şişesi', 'Reçel Kavanozu', 'Pencere Camı ve Ayna', 'Zeytinyağı Şişesi'],
    correct: 2,
    explanation: 'Pencere camı ve aynaların erime sıcaklıkları ambalaj camlarından farklıdır. Kumbaralara atılırlarsa tüm cam serisini bozar.'
  },
  {
    question: 'Lavaboya dökülen 1 litrelik atık bitkisel yağ yaklaşık ne kadar temiz suyu kirletir?',
    options: ['100 Litre', '1.000 Litre', '10.000 Litre', '1.000.000 (1 Milyon) Litre'],
    correct: 3,
    explanation: '1 Litre atık yağ tam 1 milyon litre içme suyunu kirletebilir ve su yüzeyini kaplayarak sudaki canlıların oksijensiz kalmasına sebep olur.'
  },
  {
    question: 'Evde sebze kabukları, çay posaları ve kuru yapraklardan elde edilen zengin organik gübreye ne ad verilir?',
    options: ['Biyodizel', 'Kompost', 'Polimer', 'Geri Kazanım'],
    correct: 1,
    explanation: 'Kompost, evsel organik atıkların doğal yolla çürütülüp toprağa geri kazandırılmasıdır.'
  }
];

function initQuizSection() {
  const quizCard = document.getElementById('quizCard');
  const quizContent = document.getElementById('quizContent');
  const quizStepText = document.getElementById('quizStepText');
  const quizScorePill = document.getElementById('quizScorePill');
  const quizProgressFill = document.getElementById('quizProgressFill');

  let currentStep = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    answered = false;
    const q = quizQuestions[currentStep];

    quizStepText.innerText = `Soru ${currentStep + 1} / ${quizQuestions.length}`;
    quizScorePill.innerText = `Puan: ${score}`;
    quizProgressFill.style.width = `${((currentStep + 1) / quizQuestions.length) * 100}%`;

    quizContent.innerHTML = `
      <h3 class="quiz-q-title">${q.question}</h3>
      <div class="quiz-options">
        ${q.options.map((opt, idx) => `
          <button class="quiz-opt-btn" data-idx="${idx}">
            <span>${opt}</span>
            <i class="fa-regular fa-circle"></i>
          </button>
        `).join('')}
      </div>
      <div id="quizExplainBox" style="display:none;"></div>
      <div style="text-align:right; margin-top:20px;">
        <button id="quizNextBtn" class="btn btn-primary" style="display:none;">
          ${currentStep === quizQuestions.length - 1 ? 'Sonuçları Gör' : 'Sonraki Soru <i class="fa-solid fa-arrow-right"></i>'}
        </button>
      </div>
    `;

    const optBtns = quizContent.querySelectorAll('.quiz-opt-btn');
    const quizExplainBox = document.getElementById('quizExplainBox');
    const quizNextBtn = document.getElementById('quizNextBtn');

    optBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;

        const selectedIdx = parseInt(btn.getAttribute('data-idx'), 10);
        
        if (selectedIdx === q.correct) {
          score += 20;
          btn.classList.add('correct');
          btn.querySelector('i').className = 'fa-solid fa-circle-check';

          quizExplainBox.className = 'quiz-explanation';
          quizExplainBox.innerHTML = `<strong><i class="fa-solid fa-circle-check"></i> Doğru Cevap!</strong> ${q.explanation}`;
        } else {
          btn.classList.add('wrong');
          btn.querySelector('i').className = 'fa-solid fa-circle-xmark';
          
          // Show correct one
          optBtns[q.correct].classList.add('correct');
          optBtns[q.correct].querySelector('i').className = 'fa-solid fa-circle-check';

          quizExplainBox.className = 'quiz-explanation wrong-explain';
          quizExplainBox.innerHTML = `<strong><i class="fa-solid fa-circle-xmark"></i> Yanlış Cevap.</strong> (Doğru Cevap: <strong>${q.options[q.correct]}</strong>)<br>${q.explanation}`;
        }

        quizScorePill.innerText = `Puan: ${score}`;
        quizExplainBox.style.display = 'block';
        quizNextBtn.style.display = 'inline-flex';
      });
    });

    quizNextBtn.addEventListener('click', () => {
      currentStep++;
      if (currentStep < quizQuestions.length) {
        renderQuestion();
      } else {
        renderResults();
      }
    });
  }

  function renderResults() {
    quizStepText.innerText = 'Test Tamamlandı!';
    quizProgressFill.style.width = '100%';

    let badgeIcon = 'fa-award';
    let badgeName = 'Geri Dönüşüm Çırağı';
    let message = 'Güzel bir başlangıç! Rehberimizi inceleyerek çevre bilincinizi geliştirebilirsiniz.';

    if (score >= 80) {
      badgeIcon = 'fa-trophy';
      badgeName = 'Eko-Kahraman 🏆';
      message = 'Muazzam! Geri dönüşüm ve çevre konusunda tam bir uzmansınız. Bu bilinci çevrenizle paylaşın!';
    } else if (score >= 60) {
      badgeIcon = 'fa-medal';
      badgeName = 'Sürdürülebilirlik Elçisi 🌿';
      message = 'Harika sonuç! Geri dönüşüm kurallarına hakimsiniz. Küçük detayları öğrenerek mükemmel olabilirsiniz.';
    }

    quizContent.innerHTML = `
      <div class="quiz-results-view">
        <div class="quiz-badge-icon"><i class="fa-solid ${badgeIcon}"></i></div>
        <h2 style="font-size:2rem; margin-bottom:8px;">Puanınız: ${score} / 100</h2>
        <div class="eco-badge-level" style="margin-bottom:16px;">
          <i class="fa-solid fa-star"></i> Unvanınız: ${badgeName}
        </div>
        <p style="color:var(--text-muted); max-width:500px; margin:0 auto 28px auto;">${message}</p>
        
        <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
          <button id="restartQuizBtn" class="btn btn-primary">
            <i class="fa-solid fa-rotate-left"></i> Testi Tekrar Çöz
          </button>
          <a href="#rehber" class="btn btn-secondary">
            <i class="fa-solid fa-book-open"></i> Atık Rehberini İncele
          </a>
        </div>
      </div>
    `;

    document.getElementById('restartQuizBtn').addEventListener('click', () => {
      currentStep = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}

/* --------------------------------------------------------------------------
   8. Drop-off Location Finder Simulator
   -------------------------------------------------------------------------- */
const dropoffData = {
  pil: {
    title: 'Atık Pil Toplama Noktaları',
    desc: 'Evsel çöplere atılmaması gereken cıva, kadmiyum ve nikel içeren piller.',
    locations: [
      { name: 'Zincir Süpermarket Girişleri', time: '09:00 - 22:00' },
      { name: 'İlçe Okulları ve Kamu Binaları (Atık Pil Kutuları)', time: '08:30 - 17:00' },
      { name: 'Mahalle Muhtarlıkları & Aile Sağlığı Merkezleri', time: '08:30 - 17:00' }
    ],
    tip: 'Pilleri kutuya atmadan önce kutuplarını bantlamak kısa devre riskini engeller.'
  },
  yag: {
    title: 'Bitkisel Atık Yağ Getirme Noktaları',
    desc: 'Kullanılmış kızartma yağları Biyodizel yakıtına dönüştürülür.',
    locations: [
      { name: 'Belediye 1. Sınıf Atık Getirme Merkezi', time: '08:30 - 17:30' },
      { name: 'Muhtarlık Atık Yağ Toplama Bidonları', time: '08:30 - 17:00' },
      { name: 'Lisanslı Atık Yağ Toplama Araçları (Adresten Alım)', time: 'Randevulu' }
    ],
    tip: 'En az 5 Litre biriktirdiğinizde lisanslı toplayıcılar adresinizden ücretsiz alabilir.'
  },
  'e-atik': {
    title: 'E-Atık & Elektronik Toplama Merkezleri',
    desc: 'Eski TV, bilgisayar, küçük ev aletleri ve kablo atıkları.',
    locations: [
      { name: 'Belediye Mobil Atık Getirme Aracı', time: 'Haftalık Program' },
      { name: 'Elektronik ve Teknoloji Mağazaları Atık Kutuları', time: '10:00 - 22:00' }
    ],
    tip: 'Cihazlarınızı teslim etmeden önce tüm kişisel verilerinizi silip fabrika ayarlarına sıfırlayın.'
  },
  tekstil: {
    title: 'Giysi & Tekstil Kumbaraları',
    desc: 'Kullanılmayan kıyafetler, ayakkabılar, perde ve ev tekstili.',
    locations: [
      { name: 'Sokak & Park Yanı Giysi Kumbaraları', time: '7/24 Açık' },
      { name: 'Sosyal Yardımlaşma Giysi Mağazaları', time: '09:00 - 17:00' }
    ],
    tip: 'Kıyafetlerin yırtık olmamasına ve temiz bir poşet içinde kumbaraya atılmasına özen gösterin.'
  }
};

function initDropoffSection() {
  const dtypeItems = document.querySelectorAll('.dtype-item');
  const dropoffDisplay = document.getElementById('dropoffDisplay');

  function renderDropoff(type) {
    const data = dropoffData[type];
    if (!data) return;

    dropoffDisplay.innerHTML = `
      <h3><i class="fa-solid fa-location-dot text-teal"></i> ${data.title}</h3>
      <p>${data.desc}</p>
      
      <div class="dropoff-loc-list" style="margin-bottom:20px;">
        ${data.locations.map(loc => `
          <div class="loc-pill">
            <span><strong>${loc.name}</strong></span>
            <span style="color:#6ee7b7; font-weight:600;"><i class="fa-regular fa-clock"></i> ${loc.time}</span>
          </div>
        `).join('')}
      </div>

      <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding:12px 16px; border-radius: var(--radius-sm); font-size:0.88rem; color:#a7f3d0;">
        <i class="fa-solid fa-circle-info"></i> <strong>Tavsiye:</strong> ${data.tip}
      </div>
    `;
  }

  dtypeItems.forEach(item => {
    item.addEventListener('click', () => {
      dtypeItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      renderDropoff(item.getAttribute('data-type'));
    });
  });

  renderDropoff('pil');
}
