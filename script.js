const STORAGE_KEY = 'shibaLandingConfig';

const defaultConfig = {
  texts: {},
  images: {
    heroBackgroundImage:
      'https://images.unsplash.com/photo-1547407139-3c921a66005c?auto=format&fit=crop&w=1500&q=80',
  },
  colors: {
    '--primary': '#cb4f26',
    '--primary-dark': '#9a3918',
    '--bg': '#fff8f3',
  },
  whatsapp: {
    number: '15550000000',
    message: 'Hola, quiero información sobre cachorros Shiba Inu',
    buttonText: 'WhatsApp',
  },
  seo: {
    title: 'Shiba Inu Premium | Cachorros de Padres Importados',
    description:
      'Cachorros Shiba Inu de línea premium, hijos de padres importados de Rusia, Alemania, Japón, España y Brasil.',
    keywords: 'Shiba Inu, cachorros Shiba Inu, Shiba Inu premium, padres importados',
    ogImage:
      'https://images.unsplash.com/photo-1547407139-3c921a66005c?auto=format&fit=crop&w=1500&q=80',
    canonical: 'https://tusitio.com/shiba-inu',
  },
};

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const mergeConfig = (stored) => ({
  texts: { ...defaultConfig.texts, ...(stored?.texts || {}) },
  images: { ...defaultConfig.images, ...(stored?.images || {}) },
  colors: { ...defaultConfig.colors, ...(stored?.colors || {}) },
  whatsapp: { ...defaultConfig.whatsapp, ...(stored?.whatsapp || {}) },
  seo: { ...defaultConfig.seo, ...(stored?.seo || {}) },
});

let config = mergeConfig(safeParse(localStorage.getItem(STORAGE_KEY)));

const saveConfig = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

const applyTexts = () => {
  document.querySelectorAll('[data-edit-text]').forEach((node) => {
    const key = node.dataset.editText;
    if (config.texts[key]) {
      node.innerHTML = config.texts[key];
    }
  });
};

const applyImages = () => {
  const hero = document.getElementById('hero');
  if (config.images.heroBackgroundImage) {
    hero.style.setProperty('--hero-bg-image', `url('${config.images.heroBackgroundImage}')`);
  }

  document.querySelectorAll('[data-edit-image]').forEach((img) => {
    const key = img.dataset.editImage;
    if (config.images[key]) {
      img.src = config.images[key];
    }
  });
};

const applyColors = () => {
  Object.entries(config.colors).forEach(([variable, color]) => {
    document.documentElement.style.setProperty(variable, color);
  });
};

const applyWhatsApp = () => {
  const button = document.getElementById('whatsappFloatingButton');
  const text = document.getElementById('whatsappFloatingText');
  const number = (config.whatsapp.number || '').replace(/\D/g, '');
  const message = encodeURIComponent(config.whatsapp.message || '');
  button.href = `https://wa.me/${number}?text=${message}`;
  text.textContent = config.whatsapp.buttonText || 'WhatsApp';
};

const applySeo = () => {
  const title = config.seo.title || defaultConfig.seo.title;
  const description = config.seo.description || defaultConfig.seo.description;
  const keywords = config.seo.keywords || defaultConfig.seo.keywords;
  const ogImage = config.seo.ogImage || defaultConfig.seo.ogImage;
  const canonical = config.seo.canonical || defaultConfig.seo.canonical;

  document.title = title;
  document.getElementById('seoTitle').textContent = title;
  document.getElementById('seoDescription').setAttribute('content', description);
  document.getElementById('seoKeywords').setAttribute('content', keywords);
  document.getElementById('seoOgTitle').setAttribute('content', title);
  document.getElementById('seoOgDescription').setAttribute('content', description);
  document.getElementById('seoOgImage').setAttribute('content', ogImage);
  document.getElementById('seoCanonical').setAttribute('href', canonical);
};

const syncAdminInputs = () => {
  document.querySelectorAll('[data-admin-text]').forEach((field) => {
    const key = field.dataset.adminText;
    const target = document.querySelector(`[data-edit-text="${key}"]`);
    field.value = config.texts[key] || target?.innerHTML || '';
  });

  document.querySelectorAll('[data-admin-image]').forEach((field) => {
    const key = field.dataset.adminImage;
    if (key === 'heroBackgroundImage') {
      field.value = config.images[key] || defaultConfig.images.heroBackgroundImage;
      return;
    }

    const target = document.querySelector(`[data-edit-image="${key}"]`);
    field.value = config.images[key] || target?.src || '';
  });

  document.querySelectorAll('[data-admin-color]').forEach((field) => {
    const key = field.dataset.adminColor;
    field.value = config.colors[key] || defaultConfig.colors[key];
  });

  document.querySelectorAll('[data-admin-whatsapp]').forEach((field) => {
    const key = field.dataset.adminWhatsapp;
    field.value = config.whatsapp[key] || defaultConfig.whatsapp[key] || '';
  });

  document.querySelectorAll('[data-admin-seo]').forEach((field) => {
    const key = field.dataset.adminSeo;
    field.value = config.seo[key] || defaultConfig.seo[key] || '';
  });
};

const setupAdminPanel = () => {
  document.querySelectorAll('[data-admin-text]').forEach((field) => {
    field.addEventListener('input', (event) => {
      const key = event.target.dataset.adminText;
      const target = document.querySelector(`[data-edit-text="${key}"]`);
      config.texts[key] = event.target.value;
      if (target) {
        target.innerHTML = event.target.value;
      }
      saveConfig();
    });
  });

  document.querySelectorAll('[data-admin-image]').forEach((field) => {
    field.addEventListener('change', (event) => {
      const key = event.target.dataset.adminImage;
      const url = event.target.value.trim();
      config.images[key] = url;

      if (key === 'heroBackgroundImage') {
        document.getElementById('hero').style.setProperty('--hero-bg-image', `url('${url}')`);
      } else {
        const target = document.querySelector(`[data-edit-image="${key}"]`);
        if (target && url) {
          target.src = url;
        }
      }

      saveConfig();
    });
  });

  document.querySelectorAll('[data-admin-color]').forEach((field) => {
    field.addEventListener('input', (event) => {
      const variable = event.target.dataset.adminColor;
      config.colors[variable] = event.target.value;
      document.documentElement.style.setProperty(variable, event.target.value);
      saveConfig();
    });
  });

  document.querySelectorAll('[data-admin-whatsapp]').forEach((field) => {
    field.addEventListener('input', (event) => {
      const key = event.target.dataset.adminWhatsapp;
      config.whatsapp[key] = event.target.value;
      applyWhatsApp();
      saveConfig();
    });
  });

  document.querySelectorAll('[data-admin-seo]').forEach((field) => {
    field.addEventListener('input', (event) => {
      const key = event.target.dataset.adminSeo;
      config.seo[key] = event.target.value;
      applySeo();
      saveConfig();
    });
  });

  document.getElementById('resetConfig').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    config = mergeConfig(defaultConfig);
    applyTexts();
    applyImages();
    applyColors();
    applyWhatsApp();
    applySeo();
    syncAdminInputs();
  });

  document.getElementById('downloadConfig').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'shiba-landing-config.json';
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  });

  document.getElementById('togglePanel').addEventListener('click', (event) => {
    const panel = document.getElementById('adminPanel');
    panel.classList.toggle('collapsed');
    event.target.textContent = panel.classList.contains('collapsed') ? 'Mostrar' : 'Ocultar';
  });
};

applyTexts();
applyImages();
applyColors();
applyWhatsApp();
applySeo();
syncAdminInputs();
setupAdminPanel();
