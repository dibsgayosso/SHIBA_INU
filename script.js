const STORAGE_KEY = 'shibaLandingConfig';
const AUTH_TOKEN_KEY = 'shibaAdminToken';

const defaultConfig = {
  texts: {},
  images: {
    heroBackgroundImage:
      'https://images.unsplash.com/photo-1547407139-3c921a66005c?auto=format&fit=crop&w=1500&q=80',
  },
  colors: { '--primary': '#cb4f26', '--primary-dark': '#9a3918', '--bg': '#fff8f3' },
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

const saveConfig = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY) || '';
const setAuthToken = (token) => localStorage.setItem(AUTH_TOKEN_KEY, token);
const clearAuthToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

const applyTexts = () => {
  document.querySelectorAll('[data-edit-text]').forEach((node) => {
    const key = node.dataset.editText;
    if (config.texts[key]) node.innerHTML = config.texts[key];
  });
};

const applyImages = () => {
  if (config.images.heroBackgroundImage) {
    document.getElementById('hero').style.setProperty('--hero-bg-image', `url('${config.images.heroBackgroundImage}')`);
  }

  document.querySelectorAll('[data-edit-image]').forEach((img) => {
    const key = img.dataset.editImage;
    if (config.images[key]) img.src = config.images[key];
  });
};

const applyColors = () => {
  Object.entries(config.colors).forEach(([variable, color]) => {
    document.documentElement.style.setProperty(variable, color);
  });
};

const applyWhatsApp = () => {
  const number = (config.whatsapp.number || '').replace(/\D/g, '');
  const message = encodeURIComponent(config.whatsapp.message || '');
  document.getElementById('whatsappFloatingButton').href = `https://wa.me/${number}?text=${message}`;
  document.getElementById('whatsappFloatingText').textContent = config.whatsapp.buttonText || 'WhatsApp';
};

const applySeo = () => {
  const seo = { ...defaultConfig.seo, ...config.seo };
  document.title = seo.title;
  document.getElementById('seoTitle').textContent = seo.title;
  document.getElementById('seoDescription').setAttribute('content', seo.description);
  document.getElementById('seoKeywords').setAttribute('content', seo.keywords);
  document.getElementById('seoOgTitle').setAttribute('content', seo.title);
  document.getElementById('seoOgDescription').setAttribute('content', seo.description);
  document.getElementById('seoOgImage').setAttribute('content', seo.ogImage);
  document.getElementById('seoCanonical').setAttribute('href', seo.canonical);
};

const syncAdminInputs = () => {
  document.querySelectorAll('[data-admin-text]').forEach((field) => {
    const key = field.dataset.adminText;
    const target = document.querySelector(`[data-edit-text="${key}"]`);
    field.value = config.texts[key] || target?.innerHTML || '';
  });

  document.querySelectorAll('[data-admin-image]').forEach((field) => {
    const key = field.dataset.adminImage;
    const target = document.querySelector(`[data-edit-image="${key}"]`);
    field.value = config.images[key] || target?.src || defaultConfig.images[key] || '';
  });

  document.querySelectorAll('[data-admin-color]').forEach((field) => {
    field.value = config.colors[field.dataset.adminColor] || defaultConfig.colors[field.dataset.adminColor];
  });

  document.querySelectorAll('[data-admin-whatsapp]').forEach((field) => {
    field.value = config.whatsapp[field.dataset.adminWhatsapp] || defaultConfig.whatsapp[field.dataset.adminWhatsapp];
  });

  document.querySelectorAll('[data-admin-seo]').forEach((field) => {
    field.value = config.seo[field.dataset.adminSeo] || defaultConfig.seo[field.dataset.adminSeo];
  });
};

const setAdminVisible = (visible) => {
  document.getElementById('adminPanel').classList.toggle('hidden', !visible);
  document.getElementById('openLogin').classList.toggle('hidden', visible);
};

const setupAdminPanel = () => {
  document.querySelectorAll('[data-admin-text]').forEach((field) => {
    field.addEventListener('input', (event) => {
      const key = event.target.dataset.adminText;
      const target = document.querySelector(`[data-edit-text="${key}"]`);
      config.texts[key] = event.target.value;
      if (target) target.innerHTML = event.target.value;
      saveConfig();
    });
  });

  document.querySelectorAll('[data-admin-image]').forEach((field) => {
    field.addEventListener('change', (event) => {
      const key = event.target.dataset.adminImage;
      config.images[key] = event.target.value.trim();
      applyImages();
      saveConfig();
    });
  });

  document.querySelectorAll('[data-admin-color]').forEach((field) => {
    field.addEventListener('input', (event) => {
      const key = event.target.dataset.adminColor;
      config.colors[key] = event.target.value;
      applyColors();
      saveConfig();
    });
  });

  document.querySelectorAll('[data-admin-whatsapp]').forEach((field) => {
    field.addEventListener('input', (event) => {
      config.whatsapp[event.target.dataset.adminWhatsapp] = event.target.value;
      applyWhatsApp();
      saveConfig();
    });
  });

  document.querySelectorAll('[data-admin-seo]').forEach((field) => {
    field.addEventListener('input', (event) => {
      config.seo[event.target.dataset.adminSeo] = event.target.value;
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

const openModal = () => document.getElementById('adminLoginModal').setAttribute('aria-hidden', 'false');
const closeModal = () => document.getElementById('adminLoginModal').setAttribute('aria-hidden', 'true');

const checkSession = async () => {
  const token = getAuthToken();
  if (!token) return false;

  const response = await fetch('/api/session', { headers: { Authorization: `Bearer ${token}` } });
  return response.ok;
};

const setupAuth = () => {
  const loginMessage = document.getElementById('loginMessage');

  document.getElementById('openLogin').addEventListener('click', openModal);

  document.getElementById('adminLoginModal').addEventListener('click', (event) => {
    if (event.target.id === 'adminLoginModal') closeModal();
  });

  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    loginMessage.textContent = '';

    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      loginMessage.textContent = data.message || 'No fue posible iniciar sesión.';
      return;
    }

    setAuthToken(data.token);
    closeModal();
    setAdminVisible(true);
  });

  document.getElementById('logoutAdmin').addEventListener('click', async () => {
    const token = getAuthToken();
    if (token) {
      await fetch('/api/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    }
    clearAuthToken();
    setAdminVisible(false);
  });
};

const boot = async () => {
  applyTexts();
  applyImages();
  applyColors();
  applyWhatsApp();
  applySeo();
  syncAdminInputs();
  setupAdminPanel();
  setupAuth();
  setAdminVisible(await checkSession());
};

boot();
