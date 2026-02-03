// API Configuration (config.js dan o'qiladi)
const API_BASE_URL = CONFIG.API_BASE_URL;

// Tarjima yordamchisi - sayt tiliga qarab matn qaytaradi (translations.js dan)
function t(key) {
    const lang = typeof getCurrentLanguage !== 'undefined' ? getCurrentLanguage() : 'ko';
    const T = typeof translations !== 'undefined' ? (translations[lang] || translations.ko) : {};
    return T[key] != null ? T[key] : (translations && translations.ko ? translations.ko[key] : null) || key;
}

// State Management
let currentUser = null;
let currentPage = 'dashboard';

// ==================== AUTHENTICATION ====================

// Login
async function handleLogin(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput ? usernameInput.value : '';
    const password = passwordInput ? passwordInput.value : '';
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.style.display = 'none';
    
    if (!username || !password) {
        errorDiv.textContent = '사용자명과 비밀번호를 입력하세요!';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        console.log('Login boshlanmoqda...', { username, API_BASE_URL });
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            let errorMessage = '로그인 오류';
            try {
            const error = await response.json();
                errorMessage = error.detail || error.message || '로그인 오류';
            } catch (e) {
                // JSON parse xatosi
                const text = await response.text();
                errorMessage = text || `서버 오류 (${response.status})`;
            }
            console.error('Login xatosi:', errorMessage);
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        console.log('Login muvaffaqiyatli:', data);
        
        // Token va user ma'lumotlarini saqlash
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('username', username);
        currentUser = { role: data.role, permissions: data.permissions, username: username };
        
        // Login ekranini yashirish, app ekranini ko'rsatish
        const loginScreen = document.getElementById('loginScreen');
        const appScreen = document.getElementById('appScreen');
        
        if (loginScreen) loginScreen.classList.remove('active');
        if (appScreen) appScreen.classList.add('active');
        
        // Admin link'ni ko'rsatish/yashirish
        const adminLink = document.getElementById('adminLink');
        if (adminLink && data.role === 'admin') {
            adminLink.style.display = 'block';
        }
        
        // Top nav
        const headerUsernameNavEl = document.getElementById('headerUsernameNav');
        if (headerUsernameNavEl) {
            headerUsernameNavEl.setAttribute('title', `${username} (${data.role})`);
        }
        
        // My Page link'ni ko'rsatish (barcha user'lar uchun)
        const adminNavLink = document.getElementById('adminNavLink');
        if (adminNavLink) {
            adminNavLink.style.display = 'inline-block';
        }
        const adminNavLinkMobile = document.getElementById('adminNavLinkMobile');
        if (adminNavLinkMobile) {
            adminNavLinkMobile.style.display = 'inline-block';
        }
        // Admin Panel link – faqat admin uchun (agent uchun kerak emas)
        const adminPanelNavLink = document.getElementById('adminPanelNavLink');
        const adminPanelNavLinkMobile = document.getElementById('adminPanelNavLinkMobile');
        if (data.role === 'admin') {
            if (adminPanelNavLink) adminPanelNavLink.style.display = 'inline-block';
            if (adminPanelNavLinkMobile) adminPanelNavLinkMobile.style.display = 'inline-block';
        } else {
            if (adminPanelNavLink) adminPanelNavLink.style.display = 'none';
            if (adminPanelNavLinkMobile) adminPanelNavLinkMobile.style.display = 'none';
        }
        
        // Profil dropdown: Login yashirish, Logout ko'rsatish
        var topNavLoginBtn = document.getElementById('topNavLoginBtn');
        var topNavLogoutBtn = document.getElementById('topNavLogoutBtn');
        if (topNavLoginBtn) topNavLoginBtn.style.display = 'none';
        if (topNavLogoutBtn) topNavLogoutBtn.style.display = '';
        
        // SweetAlert: login muvaffaqiyatli bildirish
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: typeof t === 'function' ? t('loginSuccess') : 'Login successful!',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        }
        
        // Home page'ga o'tish (default)
        showPage('dashboard');
        // Admin/Agent nav va sahifa sarlavhasini yangilash
        if (typeof applyTranslations === 'function') applyTranslations(localStorage.getItem('language') || 'ko');
        
    } catch (error) {
        console.error('Login catch xatosi:', error);
        let errorMessage = error.message || '로그인 중 오류가 발생했습니다';
        
        // Network xatolari uchun
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = '서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인하세요. (Backend ishlamayapti)';
        }
        
        errorDiv.textContent = errorMessage;
        errorDiv.style.display = 'block';
        
        // Error div'ni qizil rangga o'zgartirish
        errorDiv.style.color = '#ef4444';
        errorDiv.style.backgroundColor = '#fee2e2';
        errorDiv.style.padding = '10px';
        errorDiv.style.borderRadius = '5px';
        errorDiv.style.marginTop = '10px';
    }
}

// Logout - User va Admin uchun (localStorage + sessionStorage tozalash)
function handleLogout() {
    var keys = ['token', 'user_role', 'username'];
    keys.forEach(function(k) {
        try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch (e) {}
    });
    
    // Current user'ni null qilish
    currentUser = null;
    currentPage = 'dashboard';
    
    // Logoutdan keyin bosh sahifa (mehmon) ko'rsatish – login ekrani emas
    const appScreen = document.getElementById('appScreen');
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.classList.remove('active');
    if (appScreen) appScreen.classList.add('active');
    
    // My Page yashirish; profil ikonka qoladi, dropdownda "Login" ko‘rsatish
    var adminNavLink = document.getElementById('adminNavLink');
    var adminNavLinkMobile = document.getElementById('adminNavLinkMobile');
    var adminPanelNavLink = document.getElementById('adminPanelNavLink');
    var adminPanelNavLinkMobile = document.getElementById('adminPanelNavLinkMobile');
    var profileSection = document.getElementById('profileSection');
    var topNavLoginBtn = document.getElementById('topNavLoginBtn');
    var topNavLogoutBtn = document.getElementById('topNavLogoutBtn');
    if (adminNavLink) adminNavLink.style.display = 'none';
    if (adminNavLinkMobile) adminNavLinkMobile.style.display = 'none';
    if (adminPanelNavLink) adminPanelNavLink.style.display = 'none';
    if (adminPanelNavLinkMobile) adminPanelNavLinkMobile.style.display = 'none';
    if (profileSection) profileSection.style.display = '';
    if (topNavLoginBtn) topNavLoginBtn.style.display = '';
    if (topNavLogoutBtn) topNavLogoutBtn.style.display = 'none';
    
    showPage('dashboard');
    
    // Form'larni tozalash (keyingi login uchun)
    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');
    if (loginForm) loginForm.reset();
    if (signupForm) signupForm.reset();
    var loginFormContainer = document.getElementById('loginFormContainer');
    var signupFormContainer = document.getElementById('signupFormContainer');
    if (loginFormContainer) loginFormContainer.style.display = 'block';
    if (signupFormContainer) signupFormContainer.style.display = 'none';
    var loginError = document.getElementById('loginError');
    var signupError = document.getElementById('signupError');
    if (loginError) loginError.style.display = 'none';
    if (signupError) signupError.style.display = 'none';
    
    var navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('active');
    if (document.body) document.body.classList.remove('menu-open');
    var profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) profileDropdown.classList.remove('active');
    var profileDropdownOverlay = document.getElementById('profileDropdownOverlay');
    if (profileDropdownOverlay) profileDropdownOverlay.classList.remove('active');
    
    // SweetAlert: logout bildirish
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'info',
            title: typeof t === 'function' ? t('logoutSuccess') : 'Logged out successfully',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }
    
    console.log('Logout muvaffaqiyatli');
}
window.handleLogout = handleLogout;

// Admin/Agent maxfiy kalit – config.local.js dan (GitHub'da yo'q)
var ADMIN_SECRET_PASSWORD = (typeof CONFIG !== 'undefined' && CONFIG.ADMIN_AGENT_SECRET) ? CONFIG.ADMIN_AGENT_SECRET : '';

// Signup role tanlanganda: Agent = admin maxfiy kalit maydonini ko'rsatish va majburiy qilish
function updateSignupFormByRole() {
    var role = (document.getElementById('signupRole') || {}).value || 'user';
    var adminGroup = document.getElementById('signupAdminPasswordGroup');
    var adminInput = document.getElementById('signupAdminPassword');
    if (adminGroup) adminGroup.style.display = role === 'agent' ? 'block' : 'none';
    if (adminInput) {
        adminInput.required = role === 'agent';
        if (role !== 'agent') adminInput.value = '';
    }
}

// Signup
async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const role = (document.getElementById('signupRole') || {}).value || 'user';
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
    const adminPassword = (document.getElementById('signupAdminPassword') || {}).value;
    const errorDiv = document.getElementById('signupError');
    
    errorDiv.style.display = 'none';
    
    if (password.length < 6) {
        errorDiv.textContent = typeof t === 'function' ? t('signupPasswordMin') : 'Parol kamida 6 belgi bo\'lishi kerak';
        errorDiv.style.display = 'block';
        return;
    }
    if (password !== passwordConfirm) {
        errorDiv.textContent = typeof t === 'function' ? t('signupPasswordMismatch') : 'Parollar mos kelmadi';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (role === 'agent') {
        if (!ADMIN_SECRET_PASSWORD) {
            errorDiv.textContent = typeof t === 'function' ? t('signupAgentSecretNotConfigured') : 'Agent signup sozlanmagan. Administrator bilan bog\'laning.';
            errorDiv.style.display = 'block';
            return;
        }
        if (adminPassword !== ADMIN_SECRET_PASSWORD) {
            errorDiv.textContent = typeof t === 'function' ? t('signupAgentSecretRequired') : 'Agent sifatida ro\'yxatdan o\'tish uchun maxfiy kalit majburiy.';
            errorDiv.style.display = 'block';
            return;
        }
    }
    
    var finalRole = role;
    if (role === 'agent' && adminPassword === ADMIN_SECRET_PASSWORD) {
        finalRole = 'admin';
    } else if (role === 'agent') {
        finalRole = 'agent';
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: password, email: email || null, role: finalRole, admin_password: role === 'agent' ? adminPassword : null })
        });
        
        if (!response.ok) {
            const errData = await response.json().catch(function() { return {}; });
            throw new Error(errData.detail || 'Ro\'yxatdan o\'tish xatosi');
        }
        
        const data = await response.json();
        
        var successMsg = typeof t === 'function' ? t('signupSuccess') : 'Ro\'yxatdan o\'tish muvaffaqiyatli! Endi login qiling.';
        if (typeof Swal !== 'undefined') {
            Swal.fire({ icon: 'success', title: successMsg, timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' });
        } else {
            alert(successMsg);
        }
        
        document.getElementById('signupFormContainer').style.display = 'none';
        document.getElementById('loginFormContainer').style.display = 'block';
        document.getElementById('signupForm').reset();
        updateSignupFormByRole();
        document.getElementById('username').value = username;
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

// Refresh (F5) da joriy sahifada qolish; yangi kirishda (navigate) har doim homepage
function getInitialPage() {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    var isReload = nav && nav.type === 'reload';
    if (!isReload) return 'dashboard';
    var saved = localStorage.getItem('currentPage') || 'dashboard';
    if (saved === 'admin' && !localStorage.getItem('token')) return 'dashboard';
    if (saved === 'adminPanel') {
        var r = localStorage.getItem('user_role');
        if (r !== 'admin') return 'dashboard';
    }
    var pageEl = document.getElementById(saved + 'Page');
    if (!pageEl) return 'dashboard';
    return saved;
}

// Check authentication on load
function checkAuth() {
    var token = localStorage.getItem('token');
    var role = localStorage.getItem('user_role');
    var username = localStorage.getItem('username');
    token = token ? String(token).trim() : '';
    role = role ? String(role).trim() : '';
    username = username ? String(username).trim() : '';
    
    // Token bo'lmasa yoki bo'sh bo'lsa – mehmon (eski kalitlarni ham tozalash)
    if (!token || !role || !username) {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('username');
        } catch (e) {}
        token = '';
        role = '';
        username = '';
    }
    
    console.log('checkAuth called:', { token: !!token, role: !!role, username: !!username });
    
    if (token && role && username) {
        currentUser = { role, username: username || 'user' };
        const loginScreen = document.getElementById('loginScreen');
        const appScreen = document.getElementById('appScreen');
        
        if (loginScreen) loginScreen.classList.remove('active');
        if (appScreen) appScreen.classList.add('active');
        
        // Profile dropdown'ni yangilash
        const profileUsername = document.getElementById('profileUsername');
        const profileRoleValue = document.getElementById('profileRoleValue');
        if (profileUsername) profileUsername.textContent = username;
        if (profileRoleValue) profileRoleValue.textContent = role.toUpperCase();
        
        // Top nav
        const headerUsernameNavEl = document.getElementById('headerUsernameNav');
        if (headerUsernameNavEl) {
            const usernameValue = username || 'user';
            headerUsernameNavEl.setAttribute('title', `${usernameValue} (${role})`);
        }
        
        // My Page link'ni ko'rsatish (barcha user'lar uchun)
        const adminNavLink = document.getElementById('adminNavLink');
        if (adminNavLink) {
            adminNavLink.style.display = 'inline-block';
        }
        const adminNavLinkMobile = document.getElementById('adminNavLinkMobile');
        if (adminNavLinkMobile) {
            adminNavLinkMobile.style.display = 'inline-block';
        }
        // Admin Panel link – faqat admin uchun (agent uchun kerak emas)
        const adminPanelNavLink = document.getElementById('adminPanelNavLink');
        const adminPanelNavLinkMobile = document.getElementById('adminPanelNavLinkMobile');
        if (role === 'admin') {
            if (adminPanelNavLink) adminPanelNavLink.style.display = 'inline-block';
            if (adminPanelNavLinkMobile) adminPanelNavLinkMobile.style.display = 'inline-block';
        } else {
            if (adminPanelNavLink) adminPanelNavLink.style.display = 'none';
            if (adminPanelNavLinkMobile) adminPanelNavLinkMobile.style.display = 'none';
        }
        // Profil ikonka doim; dropdownda "Logout" ko‘rsatish (Login yashirish)
        var profileSection = document.getElementById('profileSection');
        if (profileSection) profileSection.style.display = '';
        var topNavLoginBtn = document.getElementById('topNavLoginBtn');
        var topNavLogoutBtn = document.getElementById('topNavLogoutBtn');
        if (topNavLoginBtn) topNavLoginBtn.style.display = 'none';
        if (topNavLogoutBtn) topNavLogoutBtn.style.display = '';
        
        // Refresh da saqlangan sahifa; yangi kirishda homepage
        setTimeout(() => {
            const savedPage = getInitialPage();
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const targetPage = document.getElementById(`${savedPage}Page`);
            if (targetPage) {
                targetPage.classList.add('active');
            } else {
                const dashboardPage = document.getElementById('dashboardPage');
                if (dashboardPage) dashboardPage.classList.add('active');
            }
            showPage(savedPage);
            if (typeof applyTranslations === 'function') applyTranslations(localStorage.getItem('language') || 'ko');
        }, 100);
    } else {
        // Token yo'q – saytni login/signup so'ramasdan ko'rsatish (boshqa websitelardek)
        currentUser = null;
        const loginScreen = document.getElementById('loginScreen');
        const appScreen = document.getElementById('appScreen');
        
        if (loginScreen) loginScreen.classList.remove('active');
        if (appScreen) appScreen.classList.add('active');
        
        // Mehmon uchun My Page yashirish; profil ikonka (👤) doim ko‘rinadi, dropdownda "Login"
        const adminNavLink = document.getElementById('adminNavLink');
        const adminNavLinkMobile = document.getElementById('adminNavLinkMobile');
    if (adminNavLink) adminNavLink.style.display = 'none';
    if (adminNavLinkMobile) adminNavLinkMobile.style.display = 'none';
    var adminPanelNavLink = document.getElementById('adminPanelNavLink');
    var adminPanelNavLinkMobile = document.getElementById('adminPanelNavLinkMobile');
    if (adminPanelNavLink) adminPanelNavLink.style.display = 'none';
    if (adminPanelNavLinkMobile) adminPanelNavLinkMobile.style.display = 'none';
    var profileSection = document.getElementById('profileSection');
        if (profileSection) profileSection.style.display = '';
        var topNavLoginBtn = document.getElementById('topNavLoginBtn');
        var topNavLogoutBtn = document.getElementById('topNavLogoutBtn');
        if (topNavLoginBtn) topNavLoginBtn.style.display = '';
        if (topNavLogoutBtn) topNavLogoutBtn.style.display = 'none';
        
        // Refresh da saqlangan sahifa; yangi kirishda homepage
        setTimeout(() => {
            const savedPage = getInitialPage();
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const targetPage = document.getElementById(`${savedPage}Page`);
            if (targetPage) {
                targetPage.classList.add('active');
            } else {
                const dashboardPage = document.getElementById('dashboardPage');
                if (dashboardPage) dashboardPage.classList.add('active');
            }
            showPage(savedPage);
        }, 100);
    }
}

// Login ekranini ko'rsatish (masalan, hujjat skaner qilishda ro'yxatdan o'tish kerak bo'lganda)
function showLoginScreen() {
    const loginScreen = document.getElementById('loginScreen');
    const appScreen = document.getElementById('appScreen');
    if (loginScreen) loginScreen.classList.add('active');
    if (appScreen) appScreen.classList.remove('active');
}
window.showLoginScreen = showLoginScreen;

// Saytni login qilmasdan ko'rish (login ekranidan qaytish)
function showAppWithoutLogin() {
    const loginScreen = document.getElementById('loginScreen');
    const appScreen = document.getElementById('appScreen');
    if (loginScreen) loginScreen.classList.remove('active');
    if (appScreen) appScreen.classList.add('active');
    showPage('dashboard');
}

// ==================== API HELPERS ====================

async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });
    if (!response.ok) {
        const errText = await response.text();
        if (response.status === 401) {
            // Faqat avval login qilgan foydalanuvchi uchun logout (mehmon saytda qoladi)
            if (token) handleLogout();
            throw new Error('인증 오류');
        }
        let errorMsg = 'API 오류';
        try {
            const error = JSON.parse(errText);
            errorMsg = error.detail || errorMsg;
        } catch (_) {
            errorMsg = errText.slice(0, 100) || errorMsg;
        }
        throw new Error(errorMsg);
    }
    const text = await response.text();
    if (!text.trim()) return null;
    try {
        return JSON.parse(text);
    } catch (e) {
        throw e;
    }
}

// ==================== NAVIGATION ====================

// Global funksiya - barcha joydan chaqirish mumkin
function showPage(pageName) {
    // Global scope'ga qo'shish
    if (!window.showPage) {
        window.showPage = showPage;
    }
    // Mehmon (login qilmagan) uchun My Page sahifasi mavjud emas
    if (pageName === 'admin' && !localStorage.getItem('token')) {
        pageName = 'dashboard';
    }
    // Admin Panel faqat admin uchun; boshqalar dashboard'ga
    if (pageName === 'adminPanel') {
        var r = localStorage.getItem('user_role');
        if (r !== 'admin') pageName = 'dashboard';
    }
    console.log('📄 showPage called with:', pageName);
    
    if (!pageName) {
        console.error('❌ showPage: pageName is empty!');
        return;
    }
    
    // Barcha sahifalarni yashirish
    const allPages = document.querySelectorAll('.page');
    console.log('📄 Found pages:', allPages.length);
    allPages.forEach(p => {
        p.classList.remove('active');
        console.log('📄 Hiding page:', p.id);
    });
    
    // Barcha navigation link'lardan active class'ni olib tashlash (barcha turdagi)
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.remove('active');
    });
    document.querySelectorAll('.nav-link-modern').forEach(l => {
        l.classList.remove('active');
    });
    document.querySelectorAll('.nav-top-link').forEach(l => {
        l.classList.remove('active');
    });
    
    // Tanlangan sahifani ko'rsatish
    const pageId = `${pageName}Page`;
    const page = document.getElementById(pageId);
    
    if (page) {
        page.classList.add('active');
        console.log('✅ Page activated:', pageId);
    } else {
        console.error('❌ Page not found:', pageId);
        console.error('❌ Available pages:', Array.from(allPages).map(p => p.id));
        
        // Agar page topilmasa, dashboard'ni ko'rsatish
        const dashboardPage = document.getElementById('dashboardPage');
        if (dashboardPage) {
            dashboardPage.classList.add('active');
            console.log('✅ Fallback to dashboard');
            pageName = 'dashboard';
        } else {
            console.error('❌ Dashboard page also not found!');
            return;
        }
    }
    
    // Faqat hozirgi page'ning nav link'ini active qilish (top navigation)
    // Barcha nav-link-modern link'larni topib, faqat to'g'ri birini active qilish
    const allTopNavLinks = document.querySelectorAll('.nav-links-modern .nav-link-modern');
    allTopNavLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');
        if (linkPage === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    currentPage = pageName;
    if (pageName === 'admin') document.body.classList.add('mypage-visible');
    else document.body.classList.remove('mypage-visible');
    // Current page'ni localStorage'ga saqlash (refresh uchun)
    localStorage.setItem('currentPage', pageName);
    
    // History: asosiy sahifalarga (dashboard, documents, …) pushState qilamiz, shunda orqaga bosganda oldingi sahifa to'g'ri ochiladi. Servis sahifalari ham pushState. Faqat birinchi yuklanishda replaceState.
    const servicePages = ['webfax', 'branch', 'forms', 'calculator', 'guide', 'statistics', 'chat', 'aboutUs'];
    const mainPages = ['dashboard', 'documents', 'upload', 'admin', 'adminPanel'];
    if (pageName === 'documentDetail') {
        // hech narsa – viewDocument o'zi pushState qiladi
    } else if (typeof history.replaceState === 'function' && typeof history.pushState === 'function') {
        const hasState = history.state && history.state.page != null;
        if (servicePages.includes(pageName) || mainPages.includes(pageName)) {
            if (hasState) {
                history.pushState({ page: pageName }, '', window.location.pathname || '/');
            } else {
                history.replaceState({ page: pageName }, '', window.location.pathname || '/');
            }
        }
    }
    
    // Sahifa yuklanganda ma'lumotlarni yuklash
    if (pageName === 'dashboard') {
        loadDashboard();
    } else if (pageName === 'documents') {
        loadDocuments();
    } else if (pageName === 'upload') {
        updateUploadPageForAuth();
    } else if (pageName === 'admin') {
        loadAdminPanel();
    } else if (pageName === 'adminPanel') {
        loadAdminPanelPage();
    } else if (pageName === 'statistics') {
        loadStatistics();
    } else if (pageName === 'branch') {
        initBranchMap();
    } else if (pageName === 'webfax') {
        loadWebfax();
    }
}

// Upload sahifasi: mehmon uchun fayl tanlash/yuklash bloklangan
function updateUploadPageForAuth() {
    var fileInput = document.getElementById('fileInput');
    var uploadBtn = document.getElementById('uploadBtn');
    var uploadForm = document.getElementById('uploadForm');
    var guestMessage = document.getElementById('uploadGuestMessage');
    var hasToken = !!localStorage.getItem('token');
    if (fileInput) {
        fileInput.disabled = !hasToken;
        if (!hasToken) fileInput.value = '';
    }
    if (uploadBtn) uploadBtn.disabled = !hasToken;
    if (guestMessage) guestMessage.style.display = hasToken ? 'none' : 'block';
    if (uploadForm && !hasToken) uploadForm.style.pointerEvents = 'none';
    if (uploadForm && hasToken) uploadForm.style.pointerEvents = '';
}

// Koreyadagi NPS (Milliy pensiya xizmati) filiallari xaritasi
function initBranchMap() {
    const container = document.getElementById('branchMap');
    if (!container || typeof L === 'undefined') return;
    if (window.branchMapLeaflet) {
        window.branchMapLeaflet.invalidateSize();
        return;
    }
    container.classList.add('map-initialized');
    // Janubiy Koreya markazi, zoom 7
    var map = L.map('branchMap', { center: [36.35, 127.85], zoom: 7, scrollWheelZoom: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    // NPS filiallari (Koreya – 국민연금공단)
    var npsOffices = [
        { name: 'NPS 본부 / NPS Headquarters', nameEn: 'NPS Headquarters', addr: 'Jeonju, Deokjin District', lat: 35.8298, lng: 127.1192 },
        { name: '종로·중구 regional', nameEn: 'Jongno-Junggu Regional Office', addr: 'Toegye-ro 173, Jung-gu, Seoul', lat: 37.5600, lng: 126.9870 },
        { name: '강남 Southern Seoul', nameEn: 'Southern Seoul Regional HQ', addr: 'Dosandae-ro 128, Gangnam-gu, Seoul', lat: 37.4979, lng: 127.0276 },
        { name: '송파 (잠실)', nameEn: 'Songpa (Jamsil) Office', addr: 'Olympic-ro 35da-gil 13, Songpa-gu, Seoul', lat: 37.5145, lng: 127.1059 },
        { name: '인천공항 센터', nameEn: 'Incheon Airport Center', addr: '272 Gonghang-ro, Incheon', lat: 37.4602, lng: 126.4407 },
        { name: '동대문·중랑', nameEn: 'Dongdaemun-Jungnang Office', addr: 'Whangsanro 6, Dongdaemun-gu, Seoul', lat: 37.5745, lng: 127.0394 },
        { name: '성동·광진', nameEn: 'Seongdong-Gwangjin Office', addr: 'Achasan-ro 563, Gwangjin-gu, Seoul', lat: 37.5440, lng: 127.0865 },
        { name: '강동·하남', nameEn: 'Gangdong-Hanam Office', addr: '1102 Cheonho-daero, Gangdong-gu, Seoul', lat: 37.5525, lng: 127.1454 },
        { name: '성북·강북', nameEn: 'Seongbuk-Gangbuk Office', addr: 'Dobong-ro 314, Gangbuk-gu, Seoul', lat: 37.6390, lng: 127.0262 }
    ];
    npsOffices.forEach(function (o) {
        var marker = L.marker([o.lat, o.lng]).addTo(map);
        marker.bindPopup('<strong>' + o.name + '</strong><br>' + (o.nameEn || '') + '<br><small>' + (o.addr || '') + '</small>');
    });
    window.branchMapLeaflet = map;
}

// Detail sahifadan ortga – hujjatlar ro'yxatiga. To'g'ridan-to'g'ri sahifani almashtiramiz (history.back() ishonchli ishlamasligi mumkin).
function goBackFromDetail() {
    showPage('documents');
    if (typeof history.replaceState === 'function') {
        history.replaceState({ page: 'documents' }, '', window.location.pathname || '/');
    }
}

// ==================== DASHBOARD ====================

// NPS (Korea Milliy pensiya xizmati) haqida haqiqiy yangiliklar – rasmiy saytga linklar
var NPS_NEWS = [
    { date: '2024-08-30', title: 'NPS Job Opening: Portfolio Manager Recruitment', url: 'https://www.nps.or.kr/eng/main.do' },
    { date: '2024-06-12', title: 'Research Manager – EM-Asia Market Research and Investment Strategy', url: 'https://www.nps.or.kr/eng/main.do' },
    { date: '2024-06-12', title: 'Infrastructure Portfolio Manager – Senior Associate', url: 'https://www.nps.or.kr/eng/main.do' },
    { date: '2024-01-15', title: 'NPS Fund Management Report – Annual Performance', url: 'https://fund.nps.or.kr/eng/main.do' },
    { date: '2023-12-01', title: 'National Pension Act and Foreigners Lump-sum Refund', url: 'https://www.nps.or.kr/eng/main.do' },
    { date: '2023-11-20', title: 'NPS Center for International Affairs – Consultation', url: 'https://www.nps.or.kr/eng/main.do' }
];

// Featured list checkbox'larini boshqarish funksiyasi (global)
function initFeaturedCheckboxes() {
    const featuredCheckboxes = document.querySelectorAll('.featured-checkbox');
    featuredCheckboxes.forEach(checkbox => {
        // Agar event listener allaqachon qo'shilgan bo'lsa, o'tkazib yuborish
        if (checkbox.hasAttribute('data-listener-attached')) {
            return;
        }
        
        // Event listener qo'shilganini belgilash
        checkbox.setAttribute('data-listener-attached', 'true');
        
        // Checkbox holatini tekshirish va active class qo'shish/olib tashlash
        const updateCheckboxState = (isChecked) => {
            const listItem = checkbox.closest('.featured-list-item');
            if (listItem) {
                if (isChecked) {
                    listItem.classList.add('active');
                } else {
                    listItem.classList.remove('active');
                }
            }
        };
        
        // Checkbox change event
        checkbox.addEventListener('change', (e) => {
            const feature = e.target.getAttribute('data-feature');
            const isChecked = e.target.checked;
            
            // Checkbox holatini localStorage'da saqlash
            localStorage.setItem(`feature_${feature}`, isChecked);
            
            // Active class'ni yangilash
            updateCheckboxState(isChecked);
            
            // Console'da log qilish (debug uchun)
            console.log(`Feature "${feature}" ${isChecked ? 'checked' : 'unchecked'}`);
        });
        
        // Label'ga click event qo'shish (butun label'ga click qilganda checkbox toggle bo'lishi uchun)
        const label = checkbox.closest('.checkbox-label');
        if (label) {
            label.addEventListener('click', (e) => {
                // Agar checkbox'ga to'g'ridan-to'g'ri click qilinsa, event propagation'ni to'xtatish
                if (e.target === checkbox) {
                    return;
                }
                
                // Checkbox'ni toggle qilish
                e.preventDefault();
                checkbox.checked = !checkbox.checked;
                
                // Change event'ni trigger qilish
                const changeEvent = new Event('change', { bubbles: true });
                checkbox.dispatchEvent(changeEvent);
            });
        }
        
        // Page yuklanganda saved state'ni restore qilish
        const feature = checkbox.getAttribute('data-feature');
        const savedState = localStorage.getItem(`feature_${feature}`);
        if (savedState === 'true') {
            checkbox.checked = true;
            updateCheckboxState(true);
        } else {
            updateCheckboxState(false);
        }
    });
}

async function loadDashboard() {
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        const documents = await apiCall(`/ocr/documents?skip=0&limit=5&user_role=${userRole}`);
        
        // Stats cards (agar mavjud bo'lsa)
        const totalDocumentsEl = document.getElementById('totalDocuments');
        if (totalDocumentsEl) {
            totalDocumentsEl.textContent = documents.length;
        }
        
        const totalNewsEl = document.getElementById('totalNews');
        if (totalNewsEl) {
            totalNewsEl.textContent = '-';
        }
        
        // Recent documents (agar mavjud bo'lsa). Oddiy user: tartib raqami (1,2,3...), admin: haqiqiy id
        const recentDiv = document.getElementById('recentDocuments');
        if (recentDiv) {
            if (documents.length === 0) {
                recentDiv.innerHTML = '<p>문서가 없습니다</p>';
            } else {
                const forUser = userRole === 'user';
                recentDiv.innerHTML = documents.map((doc, idx) => {
                    const num = forUser ? (idx + 1) : doc.id;
                    return `
                    <div class="document-card" onclick="viewDocument(${doc.id})">
                        <h4>문서 #${num}</h4>
                        <p>유형: ${doc.file_type}</p>
                        <p>상태: ${doc.status}</p>
                        <p>신뢰도: ${doc.confidence || 0}%</p>
                    </div>
                `;
                }).join('');
            }
        }
        
        // News list – haqiqiy NPS yangiliklari (onlayn linklar)
        const newsList = document.querySelector('.news-list');
        if (newsList) {
            var items = (typeof NPS_NEWS !== 'undefined' && NPS_NEWS.length) ? NPS_NEWS : [];
            if (items.length > 0) {
                var titles = (typeof t === 'function') ? [t('npsNews1'), t('npsNews2'), t('npsNews3'), t('npsNews4'), t('npsNews5'), t('npsNews6')] : null;
                if (!titles) titles = items.map(function (i) { return i.title; });
                newsList.innerHTML = items.map(function (item, idx) {
                    var url = item.url || 'https://www.nps.or.kr/eng/main.do';
                    var title = (titles && titles[idx]) ? titles[idx] : (item.title || '');
                    return '<a class="news-item news-item-link" href="' + url + '" target="_blank" rel="noopener noreferrer">' +
                        '<span class="news-date">' + (item.date || '') + '</span>' +
                        '<span class="news-title">' + title + '</span></a>';
                }).join('');
            } else {
                newsList.innerHTML = '<div class="news-item" style="grid-column: 1 / -1; text-align: center; padding: 30px; background: #f8f9fa;"><span class="news-title" style="color: #999;">' + (typeof t === "function" ? t("docNotFound") : "No news") + '</span></div>';
            }
        }
        // "Ko'proq +" tugmasi – NPS rasmiy yangiliklar sahifasiga
        var btnMore = document.querySelector('.news-box .btn-more');
        if (btnMore) {
            btnMore.onclick = function () { window.open('https://www.nps.or.kr/eng/main.do', '_blank'); };
            btnMore.style.cursor = 'pointer';
        }
        // Yangiliklar qutisi tablari – nomiga mos saytga ochish
        var tabs = document.querySelectorAll('.news-box .box-tabs .tab');
        var tabUrls = [
            null,
            'https://www.mohw.go.kr/board.es?mid=a20401000000&bid=0032',
            'https://www.nps.or.kr/eng/main.do',
            'https://www.jobkorea.co.kr/'
        ];
        tabs.forEach(function (tab, index) {
            tab.style.cursor = 'pointer';
            if (tabUrls[index]) {
                tab.onclick = function (e) {
                    e.preventDefault();
                    tabs.forEach(function (t) { t.classList.remove('active'); });
                    tab.classList.add('active');
                    window.open(tabUrls[index], '_blank');
                };
            } else {
                tab.onclick = function () {
                    tabs.forEach(function (t) { t.classList.remove('active'); });
                    tab.classList.add('active');
                };
            }
        });
        
        // Featured checkbox'larini init qilish (dashboard yuklanganda)
        setTimeout(() => {
            initFeaturedCheckboxes();
        }, 100);
        
        // Service items event listeners (dashboard yuklanganda qayta qo'shish)
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            // Eski event listener'larni olib tashlash (agar bor bo'lsa)
            const newServicesGrid = servicesGrid.cloneNode(true);
            servicesGrid.parentNode.replaceChild(newServicesGrid, servicesGrid);
            
            // Yangi event listener qo'shish
            document.querySelector('.services-grid').addEventListener('click', (e) => {
                const serviceItem = e.target.closest('.service-item');
                if (serviceItem) {
                    const service = serviceItem.getAttribute('data-service');
                    if (service) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Service clicked:', service);
                        handleServiceClick(service);
                    }
                }
            });
        }
        
    } catch (error) {
        console.error('Dashboard yuklash xatosi:', error);
    }
}

// ==================== DOCUMENTS ====================

var documentsFullList = [];
var documentsViewState = 'initial';
var documentsPageNum = 1;
var DOCUMENTS_INITIAL = 8;
var DOCUMENTS_EXPANDED = 30;
var DOCUMENTS_PAGE_SIZE = 30;

function renderDocumentsRows(list, startIdx, count, useUserNumber, totalDocs) {
    var viewLabel = typeof t === 'function' ? t('docView') || 'Ko\'rish' : 'Ko\'rish';
    var slice = list.slice(startIdx, startIdx + count);
    return slice.map(function (doc, i) {
        var idx = startIdx + i;
        var docId = doc.id ?? doc._id;
        var displayNum = useUserNumber ? (idx + 1) : (totalDocs - idx);
        var meta = doc.extracted_data && doc.extracted_data.metadata;
        var status = doc.status || (meta && meta.verified ? 'completed' : meta && meta.rejected ? 'error' : 'processing');
        var dateStr = doc.created_at ? new Date(doc.created_at).toLocaleDateString('ko-KR') : '-';
        var createdBy = escapeHtml(doc.created_by_username || '-');
        return '<tr><td>' + displayNum + '</td><td>' + escapeHtml(doc.file_type || '-') + '</td><td>' + createdBy + '</td><td><span class="status-badge status-' + escapeHtml(status) + '">' + escapeHtml(status) + '</span></td><td>' + (doc.confidence || 0) + '%</td><td>' + escapeHtml(dateStr) + '</td><td><button class="btn-small" onclick="viewDocument(' + (docId != null ? JSON.stringify(docId) : 'null') + ')">' + viewLabel + '</button></td></tr>';
    }).join('');
}

function updateDocumentsView(filteredList) {
    var tbody = document.getElementById('documentsTableBody');
    var controlsEl = document.getElementById('documentsControls');
    var showMoreEl = document.getElementById('documentsShowMore');
    var paginationEl = document.getElementById('documentsPagination');
    var tableWrap = document.querySelector('.documents-table-wrap');
    var emptyMsg = typeof t === 'function' ? (t('docNotFound') || '문서를 찾을 수 없습니다') : '문서를 찾을 수 없습니다';
    var showMoreLabel = typeof t === 'function' ? t('adminShowMore') : 'Show more';
    var prevLabel = typeof t === 'function' ? t('adminPrev') : 'Oldingi';
    var nextLabel = typeof t === 'function' ? t('adminNext') : 'Keyingi';

    if (!tbody) return;
    var total = filteredList.length;
    var userRole = localStorage.getItem('user_role') || 'user';
    var useUserNumber = userRole === 'user';

    if (total === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">' + emptyMsg + '</td></tr>';
        if (controlsEl) controlsEl.style.display = 'none';
        return;
    }

    var start = 0, count = total;
    if (documentsViewState === 'initial') count = Math.min(DOCUMENTS_INITIAL, total);
    else if (documentsViewState === 'expanded') count = Math.min(DOCUMENTS_EXPANDED, total);
    else {
        start = (documentsPageNum - 1) * DOCUMENTS_PAGE_SIZE;
        count = Math.min(DOCUMENTS_PAGE_SIZE, total - start);
    }

    tbody.innerHTML = renderDocumentsRows(filteredList, start, count, useUserNumber, total);

    if (controlsEl) {
        controlsEl.style.display = 'flex';
        if (showMoreEl) {
            if (documentsViewState === 'initial' && total > DOCUMENTS_INITIAL) {
                showMoreEl.style.display = 'inline-block';
                showMoreEl.textContent = showMoreLabel;
                showMoreEl.title = showMoreLabel;
            } else showMoreEl.style.display = 'none';
        }
        if (tableWrap) {
            tableWrap.classList.remove('expanded');
            if (documentsViewState === 'expanded' || documentsViewState === 'pagination') tableWrap.classList.add('expanded');
        }
        if (paginationEl) {
            if (documentsViewState === 'pagination' && total > DOCUMENTS_EXPANDED) {
                paginationEl.style.display = 'flex';
                var totalPages = Math.ceil(total / DOCUMENTS_PAGE_SIZE);
                var from = (documentsPageNum - 1) * DOCUMENTS_PAGE_SIZE + 1;
                var to = Math.min(documentsPageNum * DOCUMENTS_PAGE_SIZE, total);
                paginationEl.innerHTML = '<span class="pagination-info">' + from + '-' + to + ' / ' + total + '</span>' +
                    '<button type="button" onclick="documentsGoPage(-1)" ' + (documentsPageNum <= 1 ? 'disabled' : '') + '>' + prevLabel + '</button>' +
                    '<span class="pagination-info">' + documentsPageNum + ' / ' + totalPages + '</span>' +
                    '<button type="button" onclick="documentsGoPage(1)" ' + (documentsPageNum >= totalPages ? 'disabled' : '') + '>' + nextLabel + '</button>';
            } else paginationEl.style.display = 'none';
        }
    }
}

function documentsShowMore() {
    documentsViewState = 'expanded';
    var q = (document.getElementById('documentsSearch') || {}).value || '';
    var filtered = filterDocumentsList(documentsFullList, q);
    updateDocumentsView(filtered);
    if (filtered.length > DOCUMENTS_EXPANDED) {
        documentsViewState = 'pagination';
        documentsPageNum = 1;
        updateDocumentsView(filtered);
    }
}

function documentsGoPage(delta) {
    var q = (document.getElementById('documentsSearch') || {}).value || '';
    var filtered = filterDocumentsList(documentsFullList, q);
    var totalPages = Math.ceil(filtered.length / DOCUMENTS_PAGE_SIZE);
    documentsPageNum = Math.max(1, Math.min(totalPages, documentsPageNum + delta));
    updateDocumentsView(filtered);
}

function filterDocumentsList(list, query) {
    if (!query || !query.trim()) return list;
    var q = query.trim().toLowerCase();
    return list.filter(function (doc) {
        var id = String(doc.id || doc._id || '').toLowerCase();
        var fileType = (doc.file_type || '').toLowerCase();
        var status = (doc.status || '').toLowerCase();
        var user = (doc.created_by_username || '').toLowerCase();
        return id.indexOf(q) >= 0 || fileType.indexOf(q) >= 0 || status.indexOf(q) >= 0 || user.indexOf(q) >= 0;
    });
}

async function loadDocuments() {
    const tbody = document.getElementById('documentsTableBody');
    if (!localStorage.getItem('token')) {
        const msg = typeof t === 'function' ? t('pleaseSignUpToScan') : '문서를 보려면 로그인하세요.';
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">' + msg + '</td></tr>';
        return;
    }
    if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="loading">로딩 중...</td></tr>';

    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        const documents = await apiCall(`/ocr/documents?skip=0&limit=500&user_role=${userRole}`);
        var list = Array.isArray(documents) ? documents : [];

        if (list.length === 0) {
            if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">문서를 찾을 수 없습니다</td></tr>';
            return;
        }

        var sorted = list.slice().sort(function (a, b) {
            if (a.created_at && b.created_at) return new Date(b.created_at) - new Date(a.created_at);
            return (b.id || b._id || 0) - (a.id || a._id || 0);
        });
        documentsFullList = sorted;
        documentsViewState = 'initial';
        documentsPageNum = 1;
        var searchEl = document.getElementById('documentsSearch');
        if (searchEl) searchEl.value = '';
        var filtered = filterDocumentsList(documentsFullList, '');
        updateDocumentsView(filtered);

        if (searchEl && !searchEl._docBound) {
            searchEl._docBound = true;
            searchEl.addEventListener('input', function () {
                var q = searchEl.value || '';
                var f = filterDocumentsList(documentsFullList, q);
                if (f.length > DOCUMENTS_EXPANDED) documentsViewState = 'pagination', documentsPageNum = 1;
                else if (f.length > DOCUMENTS_INITIAL) documentsViewState = 'expanded';
                else documentsViewState = 'initial';
                updateDocumentsView(f);
            });
        }
        var showMoreEl = document.getElementById('documentsShowMore');
        if (showMoreEl && !showMoreEl._docBound) {
            showMoreEl._docBound = true;
            showMoreEl.addEventListener('mouseenter', documentsShowMore);
            showMoreEl.addEventListener('focus', documentsShowMore);
        }
    } catch (error) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="error">오류: ' + (error.message || '') + '</td></tr>';
    }
}

async function viewDocument(id) {
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        const doc = await apiCall(`/ocr/documents/${id}?user_role=${userRole}`);
        const docId = doc.id ?? doc._id;
        if (docId == null || docId === '') {
            console.error('Document has no id or _id:', doc);
            alert('문서 ID를 찾을 수 없습니다.');
            return;
        }
        console.log('Document data:', doc); // Debug
        console.log('Extracted data:', doc.extracted_data); // Debug

        const contentDiv = document.getElementById('documentDetailContent');
        const isAdmin = userRole === 'admin';
        
        // Extracted data
        const extractedData = doc.extracted_data || {};
        const table = extractedData.table || {};
        
        // User edited data'ni olish (metadata'dan yoki extracted_data.metadata'dan)
        let userEditedData = {};
        let isEdited = false;
        
        // Metadata'ni topish (turli joylardan - backend turli formatlarda qaytarishi mumkin)
        // 1. extractedData.metadata (eng keng tarqalgan)
        if (extractedData.metadata && extractedData.metadata.user_edited_data) {
            userEditedData = extractedData.metadata.user_edited_data;
            isEdited = extractedData.metadata.is_edited || false;
        }
        // 2. doc.metadata (ba'zi backend'larda to'g'ridan-to'g'ri)
        else if (doc.metadata && doc.metadata.user_edited_data) {
            userEditedData = doc.metadata.user_edited_data;
            isEdited = doc.metadata.is_edited || false;
        }
        // 3. extractedData.user_edited_data (to'g'ridan-to'g'ri)
        else if (extractedData.user_edited_data) {
            userEditedData = extractedData.user_edited_data;
            isEdited = extractedData.is_edited || false;
        }
        // 4. doc.user_edited_data (to'g'ridan-to'g'ri)
        else if (doc.user_edited_data) {
            userEditedData = doc.user_edited_data;
            isEdited = doc.is_edited || false;
        }
        
        console.log('🔍 User edited data check:', {
            hasUserEditedData: Object.keys(userEditedData).length > 0,
            userEditedData: userEditedData,
            isEdited: isEdited,
            extractedDataMetadata: extractedData.metadata,
            docMetadata: doc.metadata,
            extractedDataUserEdited: extractedData.user_edited_data,
            docUserEdited: doc.user_edited_data,
            fullDoc: doc  // To'liq doc obyektini ko'rish uchun
        });
        
        // Agar user tahrirlagan bo'lsa, extractedData.fields'ni yangilash
        if (isEdited && userEditedData && Object.keys(userEditedData).length > 0) {
            // Fields'ni user_edited_data bilan yangilash
            if (!extractedData.fields) {
                extractedData.fields = {};
            }
            
            // User edited data'ni fields'ga qo'shish
            Object.keys(userEditedData).forEach(key => {
                if (userEditedData[key]) {
                    // Field mapping
                    const fieldMappings = {
                        'surname': ['surname', 'familiya'],
                        'given_name': ['given_names', 'ism'],
                        'passport_no': ['passport_number', 'passport_raqami'],
                        'date_of_birth': ['date_of_birth', 'tugilgan_sanasi'],
                        'date_of_issue': ['date_of_issue', 'berilgan_vaqti'],
                        'date_of_expiry': ['date_of_expiry', 'amal_qilish_muddati'],
                        'nationality': ['nationality', 'millati'],
                        'sex': ['sex', 'jinsi'],
                        'place_of_birth': ['place_of_birth', 'tugilgan_joyi'],
                        'authority': ['authority', 'kim_tomonidan_berilgan']
                    };
                    
                    const fieldNames = fieldMappings[key] || [key];
                    fieldNames.forEach(fieldName => {
                        extractedData.fields[fieldName] = {
                            value: userEditedData[key],
                            confidence: 100.0
                        };
                    });
                }
            });
            
            console.log('✅ User edited data applied to extractedData.fields:', extractedData.fields);
        }
        
        // Original rasm URL'ni tayyorlash
        let imageUrl = null;
        console.log('Document file_path:', doc.file_path); // Debug
        
        if (doc.file_path) {
            // Backend'dan rasm URL'ni olish
            const baseUrl = API_BASE_URL.replace('/api', '');
            
            // file_path format: "uploads/documents/filename.jpg" yoki to'liq path
            let filePath = doc.file_path;
            
            // Agar file_path "uploads/" bilan boshlanmasa, qo'shish
            if (!filePath.startsWith('uploads/') && !filePath.startsWith('/uploads/')) {
                filePath = `uploads/${filePath}`;
            }
            
            // Boshidagi "/" ni olib tashlash
            filePath = filePath.replace(/^\/+/, '');
            
            // URL yaratish
            imageUrl = `${baseUrl}/${filePath}`;
            
            // URL encoding qo'shish (fayl nomidagi maxsus belgilar uchun)
            // Lekin encodeURIComponent butun URL'ni buzadi, shuning uchun faqat fayl nomini encode qilamiz
            const pathParts = imageUrl.split('/');
            const fileName = pathParts[pathParts.length - 1];
            const encodedFileName = encodeURIComponent(fileName);
            pathParts[pathParts.length - 1] = encodedFileName;
            imageUrl = pathParts.join('/');
            
            console.log('Image URL:', imageUrl); // Debug
        } else if (doc.image_url) {
            imageUrl = doc.image_url;
        } else if (doc.file_name) {
            // Agar file_name bo'lsa
            const baseUrl = API_BASE_URL.replace('/api', '');
            const encodedFileName = encodeURIComponent(doc.file_name);
            imageUrl = `${baseUrl}/uploads/documents/${encodedFileName}`;
        }
        
        let html = `
            <h1>문서 #${docId}</h1>
            <div class="document-info-card">
                <h3>기본 정보</h3>
                <p><strong>파일 유형:</strong> ${doc.file_type}</p>
                <p><strong>상태:</strong> ${doc.status}</p>
                <p><strong>신뢰도:</strong> ${doc.confidence || 0}%</p>
                <p><strong>생성일:</strong> ${new Date(doc.created_at).toLocaleString('ko-KR')}</p>
            </div>
        `;
        
        // Original rasm ko'rsatish (har doim ko'rsatish)
        html += `
            <div class="document-image-section" style="margin: 30px 0; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 15px; color: #0066cc;">원본 이미지 (Original Image)</h3>
                ${imageUrl ? `
                    <div style="position: relative; display: inline-block; cursor: pointer;" onclick="openImageModal('${imageUrl}')">
                        <img src="${imageUrl}" 
                             alt="Document Image" 
                             id="documentImage_${docId}"
                             style="max-width: 300px; max-height: 400px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.3s; display: block;"
                             onmouseover="this.style.transform='scale(1.05)'"
                             onmouseout="this.style.transform='scale(1)'"
                             onerror="this.onerror=null; this.style.display='none'; const errorDiv = this.nextElementSibling; if(errorDiv) errorDiv.style.display='block';">
                        <div style="display: none; padding: 20px; text-align: center; color: #999;">
                            <p>${t('imageLoadError')}</p>
                            <p style="font-size: 0.85em; margin-top: 10px;">URL: ${imageUrl}</p>
                        </div>
                        <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 5px; font-size: 0.85em; pointer-events: none;">
                            🔍 ${t('clickToEnlarge')}
                        </div>
                    </div>
                ` : `
                    <div style="padding: 40px; text-align: center; color: #999; border: 2px dashed #ddd; border-radius: 8px;">
                        <p>${t('imageLoadError')}</p>
                        <p style="font-size: 0.85em; margin-top: 10px;">${t('noImagePath')}: ${doc.file_path || 'N/A'}</p>
                    </div>
                `}
            </div>
        `;
        
        // Passport ma'lumotlarini ko'rsatish (agar passport bo'lsa yoki extractedData'da passport ma'lumotlari bo'lsa)
        // file_type 'boshqa' bo'lsa ham, agar extractedData'da passport ma'lumotlari bo'lsa, ko'rsatish
        const hasPassportData = doc.file_type === 'passport' || 
                                extractedData.passport || 
                                extractedData.simplified || 
                                extractedData.fields ||
                                extractedData.normalized;
        
        if (hasPassportData) {
            console.log('🔍 Formatting passport data for user:', { 
                isAdmin, 
                documentId: docId, 
                fileType: doc.file_type,
                hasPassport: !!extractedData.passport,
                hasSimplified: !!extractedData.simplified,
                hasFields: !!extractedData.fields,
                hasNormalized: !!extractedData.normalized,
                extractedData 
            });
            const passportHtml = formatPassportData(extractedData, isAdmin, docId);
            console.log('🔍 Passport HTML result:', passportHtml ? 'HTML generated' : 'Empty HTML');
            if (passportHtml) {
                html += passportHtml;
            }
        }
        
        // Table data (agar bor bo'lsa)
        if (table.rows && table.rows.length > 0) {
            html += `
                <div class="table-section">
                    <h3>${t('docTableData')}</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>${t('docDate')}</th>
                                <th>${t('docIron')}</th>
                                <th>${t('docCopper')}</th>
                                <th>${t('docTotal')}</th>
                                ${table.rows[0].flags ? '<th>' + t('docFlags') + '</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${table.rows.map(row => `
                                <tr>
                                    <td>${row.date || '-'}</td>
                                    <td>${row.iron !== null && row.iron !== undefined ? row.iron : '-'}</td>
                                    <td>${row.copper !== null && row.copper !== undefined ? row.copper : '-'}</td>
                                    <td>${row.total !== null && row.total !== undefined ? row.total : '-'}</td>
                                    ${row.flags ? `<td>${row.flags.join(', ')}</td>` : ''}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // Raw text (faqat admin uchun)
        if (isAdmin && doc.extracted_text) {
            html += `
                <div class="raw-text-section">
                    <h3>${t('docRawText')}</h3>
                    <pre class="raw-text">${escapeHtml(doc.extracted_text)}</pre>
                </div>
            `;
        }
        
        // Full JSON (faqat admin uchun) - HAR DOIM ko'rsatish
        if (isAdmin) {
            const jsonData = doc.extracted_data || {};
            const jsonString = JSON.stringify(jsonData, null, 2);
            
            html += `
                <div class="raw-text-section">
                    <h3>${t('docFullJson')}</h3>
                    <pre class="raw-text">${escapeHtml(jsonString)}</pre>
                    ${Object.keys(jsonData).length === 0 ? '<p style="color: #999; margin-top: 10px;">⚠️ ' + t('docNoData') + '</p>' : ''}
                </div>
            `;
        }
        
        // Edit va Delete – tasdiqlangan hujjatda Tahrirlash ko‘rsatilmaydi. Oddiy user o‘z hujjatini faqat 4 soat ichida o‘chira oladi.
        const docConfirmed = extractedData.metadata && (extractedData.metadata.confirmed === true || extractedData.metadata.submitted_for_review === true);
        // Delete uchun vaqt cheklovi: oddiy user faqat 4 soat ichida o'chira oladi.
        // Inline JS ichida qo'shtirnoq muammosini oldini olish uchun created_at'ni millisekund (number) ko'rinishida uzatamiz.
        var createdAtMs = doc.created_at ? new Date(doc.created_at).getTime() : 0;
        var canDelete = isAdmin || (createdAtMs && isWithin4Hours(createdAtMs));
        var createdAtArg = createdAtMs || 0;
        html += `
            <div class="document-actions" style="margin-top: 30px; display: flex; gap: 15px; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                <button type="button" class="btn-secondary" onclick="goBackFromDetail()" style="padding: 10px 20px;">
                    ${t('docBack')}
                </button>
                <div style="display: flex; gap: 15px; align-items: center;">
                    ${!docConfirmed ? (doc.file_type === 'passport' ? `
                        <button class="btn-primary" onclick="openEditPassportModal(${docId})" style="padding: 10px 20px;">
                            ${t('btnEdit')}
                        </button>
                    ` : `
                        <button class="btn-primary" onclick="openEditDocumentModal(${docId})" style="padding: 10px 20px;">
                            ${t('btnEdit')}
                        </button>
                    `) : ''}
                    ${canDelete ? `<button class="btn-danger" onclick="deleteDocument(${docId}, ${createdAtArg})" style="padding: 10px 20px;">${t('btnDelete')}</button>` : (!isAdmin ? `<span style="font-size: 0.9em; color: #6b7280;">${typeof t === 'function' ? t('deleteNotAllowedAfter4Hours') : 'O\'chirish faqat 4 soat ichida mumkin.'}</span>` : '')}
                </div>
            </div>
        `;
        
        contentDiv.innerHTML = html;
        currentPage = 'documentDetail';
        localStorage.setItem('currentPage', 'documentDetail');
        localStorage.setItem('documentDetailId', String(docId));
        showPage('documentDetail');
        // Brauzer orqaga bosganda shu hujjat detail o'rniga documents ga qaytishi uchun history'ga yozamiz
        if (typeof history.pushState === 'function') {
            history.pushState({ page: 'documentDetail', docId: docId }, '', window.location.pathname || '/');
        }
        
    } catch (error) {
        console.error(t('docLoadError') + ':', error);
        alert(t('docLoadError') + ': ' + error.message);
    }
}
window.viewDocument = viewDocument;

// HTML escape funksiyasi
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== IMAGE MODAL ====================

// Image Modal funksiyasi (rasmni kattalashtirish uchun)
function openImageModal(imageUrl) {
    console.log('Opening image modal with URL:', imageUrl);
    
    // Modal yaratish yoki mavjud modal'ni ishlatish
    let modal = document.getElementById('imageModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'modal-overlay';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 2000;';
        modal.innerHTML = `
            <div class="image-modal-content" style="position: relative; max-width: 90vw; max-height: 90vh; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <button onclick="closeImageModal()" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 35px; height: 35px; font-size: 1.5em; cursor: pointer; z-index: 10; transition: background 0.3s;">&times;</button>
                <img src="" alt="Document Image" style="max-width: 100%; max-height: 85vh; border-radius: 8px; display: block; margin: 0 auto;">
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Rasm URL'ni yangilash
    const img = modal.querySelector('img');
    if (img) {
        img.src = imageUrl;
        img.onerror = function() {
            this.style.display = 'none';
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'padding: 40px; text-align: center; color: #999;';
            errorDiv.innerHTML = '<p>' + t('imageLoadError') + '</p><p style="font-size: 0.85em; margin-top: 10px;">URL: ' + imageUrl + '</p>';
            modal.querySelector('.image-modal-content').appendChild(errorDiv);
        };
    }
    
    modal.style.display = 'flex';
    
    // Modal tashqarisiga bosilganda yopish
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    };
    
    // ESC tugmasi bilan yopish
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeImageModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ==================== PII MASKING FUNCTIONS ====================

// Familiyani mask qilish: bosh 2 ta harf + oxiridagi 2 ta harf
function maskSurname(surname, isAdmin = false, alreadyMasked = false) {
    if (!surname) return '';
    if (isAdmin) return surname;
    if (alreadyMasked) return surname; // Agar allaqachon mask qilingan bo'lsa
    
    const str = String(surname).trim();
    if (str.length <= 4) return '*'.repeat(str.length);
    
    const first = str.substring(0, 2);
    const last = str.substring(str.length - 2);
    const middle = '*'.repeat(str.length - 4);
    
    return `${first}${middle}${last}`;
}

// Passport raqamini mask qilish: bosh 2 ta harf + oxiridagi 2 ta raqam
function maskPassportNumber(passportNo, isAdmin = false, alreadyMasked = false) {
    if (!passportNo) return '';
    if (isAdmin) return passportNo;
    if (alreadyMasked) return passportNo; // Agar allaqachon mask qilingan bo'lsa
    
    const str = String(passportNo).trim().toUpperCase();
    if (str.length <= 4) return '*'.repeat(str.length);
    
    const first = str.substring(0, 2);
    const last = str.substring(str.length - 2);
    const middle = '*'.repeat(str.length - 4);
    
    return `${first}${middle}${last}`;
}

// Ismni mask qilish: bosh 2 ta harf + oxiridagi 2 ta harf
function maskGivenName(givenName, isAdmin = false, alreadyMasked = false) {
    if (!givenName) return '';
    if (isAdmin) return givenName;
    if (alreadyMasked) return givenName; // Agar allaqachon mask qilingan bo'lsa
    
    const str = String(givenName).trim();
    if (str.length <= 4) return '*'.repeat(str.length);
    
    const first = str.substring(0, 2);
    const last = str.substring(str.length - 2);
    const middle = '*'.repeat(str.length - 4);
    
    return `${first}${middle}${last}`;
}

// Ma'lumot allaqachon mask qilinganligini tekshirish
function isAlreadyMasked(value) {
    if (!value) return false;
    const str = String(value);
    // Agar '*' belgisi bo'lsa, mask qilingan deb hisoblash
    return str.includes('*') && str.length > 2;
}

// Passport ma'lumotlarini format qilish va ko'rsatish
function formatPassportData(extractedData, isAdmin = false, documentId = null) {
    if (!extractedData) return '';
    
    // Turli format'larni qo'llab-quvvatlash
    const passport = extractedData.passport || {};
    const simplified = extractedData.simplified || {};
    const fields = extractedData.fields || {};
    const normalized = extractedData.normalized || {};
    
    // Helper function: label'larni (yordamchi so'zlarni) tozalash
    const cleanFieldValue = (value) => {
        if (!value || typeof value !== 'string') return value;
        
        // Label'lar ro'yxati (O'zbek/Kirill/Ingliz)
        const labels = [
            'ФАМИЛИЯСИ', 'ФАМИЛИЯ', 'FAMILIYA', 'SURNAME', 'Familiyasi', 'Фамилияси', 'Фамилия',
            'ИСМИ', 'ИМЯ', 'ISM', 'GIVEN NAME', 'GIVEN', 'NAME', 'Исм', 'Имя',
            'ОТАСИНИНГ ИСМИ', 'ОТЧЕСТВО', 'PATRONYMIC', 'ОТАСИНИНГ', 'Otasining ismi',
            'МИЛЛАТИ', 'НАЦИОНАЛЬНОСТЬ', 'NATIONALITY', 'Millati', 'Национальность',
            'ТУҒИЛГАН ВАҚТИ', 'ДАТА РОЖДЕНИЯ', 'DATE OF BIRTH', 'DOB', 'Tugilgan sanasi',
            'БЕРИЛГАН ВАҚТИ', 'ДАТА ВЫДАЧИ', 'DATE OF ISSUE', 'Berilgan vaqti',
            'АМАЛ ҚИЛИШ МУДДАТИ', 'ДЕЙСТВИТЕЛЕН ДО', 'DATE OF EXPIRY', 'Amal qilish muddati',
            'ПАСПОРТ РАҚАМИ', 'PASSPORT NO', 'PASSPORT NUMBER', 'Passport raqami',
            'ТУҒИЛГАН ЖОЙИ', 'МЕСТО РОЖДЕНИЯ', 'PLACE OF BIRTH', 'Tugilgan joyi',
            'КИМ ТОМОНИДАН БЕРИЛГАН', 'КЕМ ВЫДАН', 'AUTHORITY', 'Kim tomonidan berilgan',
            'ЖИНСИ', 'ПОЛ', 'SEX', 'GENDER', 'Jinsi', 'Пол'
        ];
        
        // Qatorlarga ajratish
        const lines = value.split('\n').map(line => line.trim()).filter(line => line);
        
        // Har bir qatorni tekshirish - label bo'lmasa, qo'shish
        const cleanedLines = [];
        for (const line of lines) {
            // Label ekanligini tekshirish (case-insensitive)
            const isLabel = labels.some(label => {
                const labelUpper = label.toUpperCase();
                const lineUpper = line.toUpperCase();
                // To'liq mos kelish yoki label bilan boshlanish
                return lineUpper === labelUpper || 
                       lineUpper.startsWith(labelUpper + ':') ||
                       lineUpper.startsWith(labelUpper + '/') ||
                       lineUpper.includes(labelUpper + ' ') ||
                       (lineUpper.length <= labelUpper.length + 2 && lineUpper.includes(labelUpper));
            });
            
            // Agar label bo'lmasa, qo'shish
            if (!isLabel && line.length > 0) {
                cleanedLines.push(line);
            }
        }
        
        // Agar hech qanday toza qiymat topilmasa, original qiymatni qaytarish
        if (cleanedLines.length === 0) {
            return value;
        }
        
        // Toza qiymatlarni birlashtirish
        return cleanedLines.join(' ').trim();
    };
    
    // Helper function: confidence score'ni olish
    const getFieldConfidence = (fieldName, altNames = []) => {
        for (const name of [fieldName, ...altNames]) {
            if (fields[name] && typeof fields[name] === 'object' && fields[name].confidence !== undefined) {
                return fields[name].confidence;
            }
        }
        return null;
    };
    
    // Helper function: confidence rangini aniqlash
    const getConfidenceColor = (confidence) => {
        if (!confidence) return 'gray';
        if (confidence >= 95) return 'green';
        if (confidence >= 90) return 'yellow';
        return 'red';
    };
    
    // Helper function: Kirill harflarni transliteratsiya qilish (masalan, АХМЕДОВ -> AKHMEDOV)
    const transliterate = (text) => {
        if (!text || typeof text !== 'string') return '';
        
        const translitMap = {
            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'YO',
            'Ж': 'ZH', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
            'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
            'Ф': 'F', 'Х': 'KH', 'Ц': 'TS', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SHCH',
            'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'YU', 'Я': 'YA',
            'Қ': 'Q', 'Ғ': 'GH', 'Ҳ': 'H', 'Ў': 'O\'', 'Ң': 'NG'
        };
        
        return text.split('').map(char => {
            const upper = char.toUpperCase();
            return translitMap[upper] || (upper === char ? char : char.toUpperCase());
        }).join('');
    };
    
    // Helper function: field value'ni olish va tozalash
    const getFieldValue = (fieldName, altNames = [], includeTranslit = false) => {
        let rawValue = '';
        let confidence = null;
        
        // Fields format - birinchi tekshirish (chunki backend'dan yangilangan fields kelishi mumkin)
        // Bu eng muhim, chunki user tahrirlagan ma'lumotlar fields'da bo'lishi mumkin
        for (const name of [fieldName, ...altNames]) {
            if (fields[name]) {
                if (typeof fields[name] === 'object' && fields[name].value !== undefined) {
                    rawValue = fields[name].value;
                    confidence = fields[name].confidence;
                    break;
                } else if (typeof fields[name] === 'string') {
                    rawValue = fields[name];
                    break;
                }
            }
        }
        
        // Agar fields'da topilmasa, boshqa formatlardan olish
        if (!rawValue) {
            // Normalized format
            if (normalized[fieldName]) {
                rawValue = normalized[fieldName];
            }
            // Passport format
            else if (passport[fieldName]) {
                rawValue = passport[fieldName];
            }
            // Simplified format
            else if (simplified[fieldName]) {
                rawValue = simplified[fieldName];
            }
        }
        
        // Debug: field value topilganini ko'rsatish
        if (rawValue && fieldName === 'place_of_birth') {
            console.log('🔍 getFieldValue - place_of_birth:', {
                rawValue: rawValue,
                fieldName: fieldName,
                altNames: altNames,
                foundInFields: !!fields[fieldName] || altNames.some(name => !!fields[name])
            });
        }
        if (rawValue && fieldName === 'authority') {
            console.log('🔍 getFieldValue - authority:', {
                rawValue: rawValue,
                fieldName: fieldName,
                altNames: altNames,
                foundInFields: !!fields[fieldName] || altNames.some(name => !!fields[name])
            });
        }
        
        // Tozalash
        let cleaned = cleanFieldValue(rawValue);
        
        // Millat maydonida faqat label (НАЦИОНАЛЬНОСТЬ / MILLATI – "millat" so'zining tarjimasi) chiqsa – bu qiymat emas, bo'sh qoldiramiz
        const nationalityLabelsOnly = [
            'НАЦИОНАЛЬНОСТЬ', 'NATIONALITY', 'МИЛЛАТИ', 'MILLATI', 'Millati', 'Национальность'
        ];
        const normalizeForLabelCheck = (str) => (str || '').toString().trim().replace(/\s+/g, ' ').replace(/^[\s.,:;]+|[\s.,:;]+$/g, '').toUpperCase();
        const isNationalityField = fieldName === 'nationality' || (altNames && altNames.includes('millati'));
        if (isNationalityField && cleaned && typeof cleaned === 'string') {
            const c = normalizeForLabelCheck(cleaned);
            const isLabel = c && (
                nationalityLabelsOnly.some(l => normalizeForLabelCheck(l) === c) ||
                (c.length <= 25 && (c.includes('НАЦИОНАЛЬНОСТЬ') || c.includes('NATIONALITY') || c.includes('МИЛЛАТИ') || c === 'MILLATI'))
            );
            if (isLabel) cleaned = '';
        }
        
        // Auto-formatting: UPPERCASE (pasport standarti)
        const formatted = cleaned ? cleaned.toUpperCase().trim() : '';
        
        // Transliteratsiya qo'shish (masalan, АХМЕДОВ (AKHMEDOV))
        if (includeTranslit && formatted) {
            const translit = transliterate(formatted);
            if (translit && translit !== formatted) {
                return `${formatted} (${translit})`;
            }
        }
        
        return formatted;
    };
    
    // Ma'lumotlarni topish (barcha variantlarni tekshirish) - transliteratsiya bilan
    // Debug: extractedData'ni tekshirish
    console.log('🔍 formatPassportData - extractedData:', {
        'hasPassport': !!extractedData.passport,
        'hasSimplified': !!extractedData.simplified,
        'hasFields': !!extractedData.fields,
        'hasNormalized': !!extractedData.normalized,
        'fields keys': extractedData.fields ? Object.keys(extractedData.fields) : [],
        'normalized keys': extractedData.normalized ? Object.keys(extractedData.normalized) : []
    });
    
    let surname = getFieldValue('surname', ['familiya'], true); // includeTranslit = true
    let givenName = getFieldValue('given_name', ['given_names', 'ism'], true);
    let patronymic = getFieldValue('patronymic', ['otasining_ismi'], true);
    let passportNo = getFieldValue('passport_no', ['passport_number', 'passport_raqami']);
    let dateOfBirth = getFieldValue('date_of_birth', ['dob', 'tugilgan_sanasi']);
    let dateOfIssue = getFieldValue('date_of_issue', ['issue_date', 'berilgan_vaqti']);
    let dateOfExpiry = getFieldValue('date_of_expiry', ['expiry', 'amal_qilish_muddati']);
    let nationality = getFieldValue('nationality', ['millati']);
    // Pasportda "Millati / НАЦИОНАЛЬНОСТЬ" – bu label; qiymat ularning ostidagi millat nomi (masalan ўзбек). Label ni hech qachon qiymat sifatida ko'rsatmaymiz.
    if (nationality && typeof nationality === 'string') {
        const n = nationality.trim().replace(/\s+/g, ' ').toUpperCase();
        if (n === 'НАЦИОНАЛЬНОСТЬ' || n === 'NATIONALITY' || n === 'МИЛЛАТИ' || n === 'MILLATI' || (n.startsWith('НАЦИОНАЛЬНОСТЬ') && n.length < 22) || (n.startsWith('NATIONALITY') && n.length < 15)) {
            nationality = '';
        }
    }
    let sex = getFieldValue('sex', ['jinsi']);
    let placeOfBirth = getFieldValue('place_of_birth', ['tugilgan_joyi']);
    let authority = getFieldValue('authority', ['kim_tomonidan_berilgan']);
    
    // OCR millat qiymatini olmagan bo'lsa (yoki faqat label olgani uchun bo'sh qoldirdik) – O'zbekiston pasporti belgilari bo'lsa "O'zbek" ko'rsatamiz
    if (!nationality || (typeof nationality === 'string' && !nationality.trim())) {
        const placeUpper = (placeOfBirth || '').toUpperCase();
        const authUpper = (authority || '').toUpperCase();
        const looksUzbekPassport = placeUpper.includes('ТОШКЕНТ') || placeUpper.includes('TOSHKENT') || placeUpper.includes('O\'ZBEKISTON') || placeUpper.includes('UZBEKISTAN') ||
            authUpper.includes('ТОШКЕНТ') || authUpper.includes('TOSHKENT') || authUpper.includes('UZBEKISTAN') ||
            (passportNo && String(passportNo).toUpperCase().includes('UZB'));
        if (looksUzbekPassport) {
            nationality = 'O\'zbek';
        }
    }
    
    // Debug: topilgan ma'lumotlarni ko'rsatish
    console.log('🔍 formatPassportData - extracted values:', {
        surname, givenName, patronymic, passportNo,
        dateOfBirth, dateOfIssue, dateOfExpiry,
        nationality, sex, placeOfBirth, authority
    });
    
    // Confidence score'larni olish
    const surnameConfidence = getFieldConfidence('surname', ['familiya']);
    const givenNameConfidence = getFieldConfidence('given_name', ['given_names', 'ism']);
    const patronymicConfidence = getFieldConfidence('patronymic', ['otasining_ismi']);
    const passportNoConfidence = getFieldConfidence('passport_no', ['passport_number', 'passport_raqami']);
    const dateOfBirthConfidence = getFieldConfidence('date_of_birth', ['dob', 'tugilgan_sanasi']);
    const dateOfIssueConfidence = getFieldConfidence('date_of_issue', ['issue_date', 'berilgan_vaqti']);
    const dateOfExpiryConfidence = getFieldConfidence('date_of_expiry', ['expiry', 'amal_qilish_muddati']);
    const nationalityConfidence = getFieldConfidence('nationality', ['millati']);
    const sexConfidence = getFieldConfidence('sex', ['jinsi']);
    const placeOfBirthConfidence = getFieldConfidence('place_of_birth', ['tugilgan_joyi']);
    const authorityConfidence = getFieldConfidence('authority', ['kim_tomonidan_berilgan']);
    
    // Amal qilish muddatini tekshirish
    const isExpired = (() => {
        if (!dateOfExpiry) return false;
        try {
            // DateOfExpiry format: "2009-06-15" yoki "15.06.2009"
            let expiryDate;
            if (dateOfExpiry.includes('-')) {
                expiryDate = new Date(dateOfExpiry);
            } else if (dateOfExpiry.includes('.')) {
                const parts = dateOfExpiry.split('.');
                if (parts.length === 3) {
                    expiryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                }
            }
            if (expiryDate && !isNaN(expiryDate.getTime())) {
                return expiryDate < new Date();
            }
        } catch (e) {
            console.error('Date parsing error:', e);
        }
        return false;
    })();
    
    // Agar ma'lumotlar bo'sh bo'lsa, qaytarish
    // Lekin to'liq bo'lmasa ham, mavjud ma'lumotlarni ko'rsatish
    const hasAnyData = surname || givenName || passportNo || dateOfBirth || dateOfIssue || dateOfExpiry;
    if (!hasAnyData) {
        return '';
    }
    
    // Mask qilish (admin bo'lmasa va allaqachon mask qilinmagan bo'lsa)
    // Helper: mask qilinganini tekshirish
    const isAlreadyMasked = (value) => {
        if (!value || typeof value !== 'string') return false;
        return value.includes('*') || value.includes('X') || /[A-Z]{2}\*+[A-Z]/.test(value);
    };
    
    // Helper: surname mask qilish
    const maskSurname = (value, admin, alreadyMasked) => {
        if (admin || alreadyMasked) return value;
        if (!value || value.length < 3) return value;
        const first = value.substring(0, 2);
        const last = value.substring(value.length - 1);
        return first + '*'.repeat(Math.max(0, value.length - 3)) + last;
    };
    
    // Helper: given name mask qilish
    const maskGivenName = (value, admin, alreadyMasked) => {
        if (admin || alreadyMasked) return value;
        if (!value || value.length < 3) return value;
        const first = value.substring(0, 2);
        const last = value.substring(value.length - 1);
        return first + '*'.repeat(Math.max(0, value.length - 3)) + last;
    };
    
    // Helper: passport number mask qilish
    const maskPassportNumber = (value, admin, alreadyMasked) => {
        if (admin || alreadyMasked) return value;
        if (!value || value.length < 4) return value;
        const first = value.substring(0, 2);
        const last = value.substring(value.length - 2);
        return first + '*'.repeat(Math.max(0, value.length - 4)) + last;
    };
    
    const surnameMasked = isAlreadyMasked(surname);
    const givenNameMasked = isAlreadyMasked(givenName);
    const passportNoMasked = isAlreadyMasked(passportNo);
    
    const maskedSurname = surname ? maskSurname(String(surname), isAdmin, surnameMasked) : '';
    const maskedGivenName = givenName ? maskGivenName(String(givenName), isAdmin, givenNameMasked) : '';
    const maskedPassportNo = passportNo ? maskPassportNumber(String(passportNo), isAdmin, passportNoMasked) : '';
    
    // Helper function: confidence indicator yaratish
    const getConfidenceIndicator = (confidence) => {
        if (!confidence) return '';
        const color = getConfidenceColor(confidence);
        const colorClass = `confidence-${color}`;
        return `<span class="confidence-indicator ${colorClass}" title="신뢰도: ${confidence}%"></span>`;
    };
    
    // Helper function: sana formatini yaxshilash (kalendar uchun)
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        try {
            let date;
            if (dateStr.includes('-')) {
                date = new Date(dateStr);
            } else if (dateStr.includes('.')) {
                const parts = dateStr.split('.');
                if (parts.length === 3) {
                    date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                }
            }
            if (date && !isNaN(date.getTime())) {
                return date.toISOString().split('T')[0]; // YYYY-MM-DD format
            }
        } catch (e) {
            console.error('Date formatting error:', e);
        }
        return dateStr;
    };
    
    let html = `
        <div class="passport-section">
            <h3>${t('passportInfo')}</h3>
            <div class="passport-data-grid">
    `;
    
    // ========== BARCHA FIELD'LAR HAR DOIM YARATILADI (TAHRIRLASH UCHUN) ==========
    // To'liq ma'lumotlarni olish (mask qilinmagan - admin uchun)
    const fullSurname = isAdmin ? surname : (surname || '');
    const fullGivenName = isAdmin ? givenName : (givenName || '');
    const fullPatronymic = isAdmin ? patronymic : (patronymic || '');
    const fullPassportNo = isAdmin ? passportNo : (passportNo || '');
    const fullNationality = isAdmin ? nationality : (nationality || '');
    const fullPlaceOfBirth = isAdmin ? placeOfBirth : (placeOfBirth || '');
    const fullAuthority = isAdmin ? authority : (authority || '');
    
    // 1. SURNAME - HAR DOIM
    const confIndSurname = getConfidenceIndicator(surnameConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">${t('labelSurname')}:</span>
                ${confIndSurname}
            </div>
            <input type="text" 
                   id="view-edit-surname-${documentId}" 
                   class="passport-edit-input" 
                   value="${(fullSurname || '').replace(/"/g, '&quot;')}" 
                   readonly 
                   data-field="surname"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; font-size: 1em;">
        </div>
    `;
    
    // 2. GIVEN NAME - HAR DOIM
    const confIndGivenName = getConfidenceIndicator(givenNameConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">${t('labelGivenName')}:</span>
                ${confIndGivenName}
            </div>
            <input type="text" 
                   id="view-edit-given-name-${documentId}" 
                   class="passport-edit-input" 
                   value="${(fullGivenName || '').replace(/"/g, '&quot;')}" 
                   readonly 
                   data-field="given_name"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; font-size: 1em;">
        </div>
    `;
    
    // 3. PATRONYMIC - HAR DOIM
    const confIndPatronymic = getConfidenceIndicator(patronymicConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">${t('labelPatronymic')}:</span>
                ${confIndPatronymic}
            </div>
            <input type="text" 
                   id="view-edit-patronymic-${documentId}" 
                   class="passport-edit-input" 
                   value="${(fullPatronymic || '').replace(/"/g, '&quot;')}" 
                   readonly 
                   data-field="patronymic"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; font-size: 1em;">
        </div>
    `;
    
    // 4. DATE OF BIRTH - HAR DOIM
    const confIndDateOfBirth = getConfidenceIndicator(dateOfBirthConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">${t('labelDateOfBirth')}:</span>
                ${confIndDateOfBirth}
            </div>
            <input type="text" 
                   id="view-edit-date-of-birth-${documentId}" 
                   class="passport-edit-input" 
                   value="${(dateOfBirth || '').replace(/"/g, '&quot;')}" 
                   readonly 
                   data-field="date_of_birth"
                   placeholder="DD.MM.YYYY"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; font-size: 1em;">
        </div>
    `;
    
    // 5. PASSPORT NUMBER - HAR DOIM
    const confIndPassportNo = getConfidenceIndicator(passportNoConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">${t('labelPassportNo')}:</span>
                ${confIndPassportNo}
            </div>
            <input type="text" 
                   id="view-edit-passport-no-${documentId}" 
                   class="passport-edit-input" 
                   value="${(fullPassportNo || '').replace(/"/g, '&quot;')}" 
                   readonly 
                   data-field="passport_no"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; font-size: 1em;">
        </div>
    `;
    
    // 6. DATE OF ISSUE - HAR DOIM
    const confIndDateOfIssue = getConfidenceIndicator(dateOfIssueConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">${t('labelDateOfIssue')}:</span>
                ${confIndDateOfIssue}
            </div>
            <input type="text" 
                   id="view-edit-date-of-issue-${documentId}" 
                   class="passport-edit-input" 
                   value="${(dateOfIssue || '').replace(/"/g, '&quot;')}" 
                   readonly 
                   data-field="date_of_issue"
                   placeholder="DD.MM.YYYY"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; font-size: 1em;">
        </div>
    `;
    
    // 7. DATE OF EXPIRY - HAR DOIM
    const confIndDateOfExpiry = getConfidenceIndicator(dateOfExpiryConfidence);
    const expiredClass = isExpired ? 'expired-warning' : '';
    html += `
        <div class="passport-field ${expiredClass}">
            <div class="field-label-row">
                <span class="field-label">${t('labelDateOfExpiry')}:</span>
                ${confIndDateOfExpiry}
            </div>
            <input type="text" 
                   id="view-edit-date-of-expiry-${documentId}" 
                   class="passport-edit-input" 
                   value="${(dateOfExpiry || '').replace(/"/g, '&quot;')}" 
                   readonly 
                   data-field="date_of_expiry"
                   placeholder="DD.MM.YYYY"
                   style="width: 100%; padding: 8px; border: 1px solid ${isExpired ? '#ef4444' : '#ddd'}; border-radius: 4px; background: ${isExpired ? '#fee2e2' : '#f8f9fa'}; font-size: 1em; color: ${isExpired ? '#ef4444' : 'inherit'};">
            ${isExpired ? '<span style="color: #ef4444; font-weight: bold; font-size: 0.9em; margin-top: 5px; display: block;">⚠️ ' + t('expired') + '</span>' : ''}
        </div>
    `;
    
    // 8. NATIONALITY - HAR DOIM
    const confIndNationality = getConfidenceIndicator(nationalityConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">${t('labelNationality')}:</span>
                ${confIndNationality}
            </div>
            <input type="text" 
                   id="view-edit-nationality-${documentId}" 
                   class="passport-edit-input" 
                   value="${(fullNationality || '').replace(/"/g, '&quot;')}" 
                   readonly 
                   data-field="nationality"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; font-size: 1em;">
        </div>
    `;
    
    // 9. SEX - HAR DOIM
    const confIndSex = getConfidenceIndicator(sexConfidence);
    const sexValue = sex || '';
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">${t('labelSex')}:</span>
                ${confIndSex}
            </div>
            <select id="view-edit-sex-${documentId}" 
                    class="passport-edit-input" 
                    disabled 
                    data-field="sex"
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; font-size: 1em;">
                <option value="">${t('selectPlaceholder')}</option>
                <option value="M" ${sexValue === 'M' || sexValue === 'MALE' || sexValue === '남성' || sexValue.toUpperCase().includes('M') ? 'selected' : ''}>${t('maleOption')}</option>
                <option value="F" ${sexValue === 'F' || sexValue === 'FEMALE' || sexValue === '여성' || sexValue.toUpperCase().includes('F') ? 'selected' : ''}>${t('femaleOption')}</option>
            </select>
        </div>
    `;
    
    // 10. PLACE OF BIRTH - HAR DOIM
    const confIndPlaceOfBirth = getConfidenceIndicator(placeOfBirthConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">${t('labelPlaceOfBirth')}:</span>
                ${confIndPlaceOfBirth}
            </div>
            <input type="text" 
                   id="view-edit-place-of-birth-${documentId}" 
                   class="passport-edit-input" 
                   value="${(fullPlaceOfBirth || '').replace(/"/g, '&quot;')}" 
                   readonly 
                   data-field="place_of_birth"
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; font-size: 1em;">
        </div>
    `;
    
    // 11. AUTHORITY - HAR DOIM
    const confIndAuthority = getConfidenceIndicator(authorityConfidence);
    html += `
        <div class="passport-field" style="grid-column: 1 / -1;">
            <div class="field-label-row">
                <span class="field-label">${t('labelAuthority')}:</span>
                ${confIndAuthority}
            </div>
            <textarea id="view-edit-authority-${documentId}" 
                      class="passport-edit-input" 
                      readonly 
                      data-field="authority"
                      style="width: 100%; min-height: 80px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; resize: vertical; font-size: 1em;">${(fullAuthority || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        </div>
    `;
    
    // Qo'shimcha maydonlar: hujjatda qanday so'zlar/label'lar bo'lsa (koreys, arab, o'zbek va h.k.) – backend yuborgan barcha noma'lum maydonlarni ko'rsatish
    const knownFieldKeys = new Set([
        'surname', 'familiya', 'given_name', 'given_names', 'ism', 'patronymic', 'otasining_ismi',
        'passport_no', 'passport_number', 'passport_raqami', 'date_of_birth', 'dob', 'tugilgan_sanasi',
        'date_of_issue', 'issue_date', 'berilgan_vaqti', 'date_of_expiry', 'expiry', 'amal_qilish_muddati',
        'nationality', 'millati', 'sex', 'jinsi', 'place_of_birth', 'tugilgan_joyi', 'authority', 'kim_tomonidan_berilgan'
    ]);
    const extraEntries = [];
    const allFieldSources = [fields, normalized].filter(Boolean);
    for (const source of allFieldSources) {
        for (const [key, raw] of Object.entries(source)) {
            if (!key) continue;
            const keyNorm = String(key).toLowerCase().replace(/\s+/g, '_').trim();
            if (knownFieldKeys.has(keyNorm) || knownFieldKeys.has(key)) continue;
            const val = typeof raw === 'object' && raw != null && 'value' in raw ? raw.value : raw;
            if (val == null && typeof raw === 'object') continue;
            const displayVal = typeof val === 'string' ? val : (val != null ? String(val) : '');
            if (extraEntries.some(e => e.label === key)) continue;
            extraEntries.push({ label: key, value: displayVal });
        }
    }
    if (extraEntries.length > 0) {
        html += `<div class="passport-field" style="grid-column: 1 / -1;"><p class="field-label" style="margin-bottom: 10px; font-weight: 600;">${t('extraFieldsTitle')}</p></div>`;
        for (const { label, value } of extraEntries) {
            const safeVal = (value || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            html += `
                <div class="passport-field">
                    <div class="field-label-row"><span class="field-label">${escapeHtml(label)}:</span></div>
                    <input type="text" class="passport-edit-input" value="${safeVal}" readonly style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; font-size: 1em;">
                </div>
            `;
        }
    }
    
    // Agar ma'lumotlar to'liq bo'lmasa, xabar ko'rsatish
    if (!surname && !givenName && !passportNo) {
        html += `
            <div class="passport-field" style="grid-column: 1 / -1;">
                <span class="field-value" style="color: #999; font-style: italic;">
                    ⚠️ ${t('partialDataWarning')}
                </span>
            </div>
        `;
    }
    
    // "Tasdiqlayman" va "Qayta skanerlash" – admin sahifasida ko'rsatilmaydi; oddiy user uchun tasdiqlanmagan bo'lsa ko'rsatiladi
    const metadata = extractedData.metadata || {};
    const userConfirmed = metadata.confirmed === true || metadata.submitted_for_review === true;
    if (isAdmin) {
        // Admin: Tasdiqlayman / Qayta skanerlash tugmalari yo'q
        html += `
            </div>
        </div>
    `;
    } else if (!userConfirmed) {
        html += `
            </div>
            <div id="passport-actions-${documentId}" class="passport-actions" style="margin-top: 30px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button class="btn-success" onclick="confirmPassportData(${documentId})" style="padding: 12px 30px;">
                    ✓ ${t('confirmButton')}
                </button>
                <button class="btn-warning" onclick="reprocessDocument(${documentId})" style="padding: 12px 30px;">
                    🔄 ${t('rescanButton')}
                </button>
            </div>
        </div>
    `;
    } else {
        html += `
            </div>
            <p class="passport-confirmed-msg" style="margin-top: 20px; padding: 12px 20px; background: #ecfdf5; color: #065f46; border-radius: 8px; text-align: center;">
                ✓ ${t('docConfirmedMsg')}
            </p>
        </div>
    `;
    }
    
    return html;
}

// ==================== PASSPORT EDITING FROM VIEW ====================

// View page'dan tahrirlashni yoqish
window.enablePassportEditing = function(documentId) {
    console.log('🔍 enablePassportEditing called for document:', documentId);
    
    // Barcha input field'larni topish (view page'dagi)
    const inputs = document.querySelectorAll(`[id^="view-edit-"][id$="-${documentId}"]`);
    console.log('🔍 Found input fields:', inputs.length);
    
    inputs.forEach(input => {
        // Readonly va disabled olib tashlash
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.readOnly = false;
        input.disabled = false;
        
        // CSS style'ni yangilash
        input.style.backgroundColor = '#fff';
        input.style.border = '1px solid #4f46e5';
        input.style.cursor = 'text';
        input.style.pointerEvents = 'auto';
        input.style.opacity = '1';
        
        console.log('✅ Input made editable:', {
            id: input.id,
            type: input.type || input.tagName,
            readOnly: input.readOnly,
            disabled: input.disabled,
            value: input.value ? input.value.substring(0, 20) + '...' : 'empty'
        });
    });
    
    // Tugmalarni yangilash
    const enableEditBtn = document.getElementById(`btn-enable-edit-${documentId}`);
    const saveBtn = document.getElementById(`btn-save-${documentId}`);
    
    if (enableEditBtn) enableEditBtn.style.display = 'none';
    if (saveBtn) saveBtn.style.display = 'inline-block';
    
    console.log('✅ Passport editing enabled');
};

// View page'dan ma'lumotlarni saqlash
window.savePassportDataFromView = async function(documentId) {
    console.log('🔍 savePassportDataFromView called for document:', documentId);
    
    if (!documentId) {
        alert('문서 ID를 찾을 수 없습니다.');
        return;
    }
    
    const errorDiv = document.getElementById('editPassportError');
    if (errorDiv) errorDiv.style.display = 'none';
    
    // View page'dagi input field'larni topish
    const getViewInputValue = (fieldName) => {
        const input = document.getElementById(`view-edit-${fieldName}-${documentId}`);
        if (!input) {
            console.warn(`⚠️ Input not found: view-edit-${fieldName}-${documentId}`);
            return '';
        }
        
        let value = '';
        if (input.tagName === 'TEXTAREA') {
            value = input.value || input.textContent || '';
        } else if (input.tagName === 'SELECT') {
            value = input.value || input.options[input.selectedIndex]?.text || '';
        } else {
            value = input.value || input.textContent || '';
        }
        
        value = String(value).trim();
        console.log(`📝 View input ${fieldName}: "${value}"`);
        return value;
    };
    
    // Ma'lumotlarni yig'ish
    const userEditedData = {
        surname: getViewInputValue('surname'),
        given_name: getViewInputValue('given-name'),
        patronymic: getViewInputValue('patronymic'),
        passport_no: getViewInputValue('passport-no'),
        date_of_birth: getViewInputValue('date-of-birth'),
        date_of_issue: getViewInputValue('date-of-issue'),
        date_of_expiry: getViewInputValue('date-of-expiry'),
        nationality: getViewInputValue('nationality'),
        sex: getViewInputValue('sex'),
        place_of_birth: getViewInputValue('place-of-birth'),
        authority: getViewInputValue('authority')
    };
    
    console.log('🔍 Collected userEditedData from view:', userEditedData);
    
    // Original document'ni olish
    const userRole = localStorage.getItem('user_role') || 'user';
    const originalDoc = await apiCall(`/ocr/documents/${documentId}?user_role=${userRole}`);
    const originalData = originalDoc.extracted_data || {};
    const originalFields = originalData.fields || {};
    
    // is_edited flag'ni aniqlash
    let isEdited = false;
    const fieldMappings = {
        surname: ['surname', 'familiya'],
        given_name: ['given_name', 'given_names', 'ism'],
        patronymic: ['patronymic', 'otasining_ismi'],
        passport_no: ['passport_no', 'passport_number', 'passport_raqami'],
        date_of_birth: ['date_of_birth', 'dob', 'tugilgan_sanasi'],
        date_of_issue: ['date_of_issue', 'issue_date', 'berilgan_vaqti'],
        date_of_expiry: ['date_of_expiry', 'expiry', 'amal_qilish_muddati'],
        nationality: ['nationality', 'millati'],
        sex: ['sex', 'jinsi'],
        place_of_birth: ['place_of_birth', 'tugilgan_joyi'],
        authority: ['authority', 'kim_tomonidan_berilgan']
    };
    
    for (const [userField, fieldAliases] of Object.entries(fieldMappings)) {
        const userValue = userEditedData[userField];
        if (!userValue) continue;
        
        let originalValue = null;
        for (const fieldAlias of fieldAliases) {
            if (originalFields[fieldAlias]) {
                if (typeof originalFields[fieldAlias] === 'object' && originalFields[fieldAlias].value !== undefined) {
                    originalValue = originalFields[fieldAlias].value;
                    break;
                } else if (typeof originalFields[fieldAlias] === 'string') {
                    originalValue = originalFields[fieldAlias];
                    break;
                }
            }
        }
        
        if (originalValue && String(userValue).trim().toUpperCase() !== String(originalValue).trim().toUpperCase()) {
            isEdited = true;
            break;
        }
    }
    
    // Updated fields yaratish
    const existingExtractedData = { ...originalData };
    const updatedFields = {
        ...originalFields,
        surname: {
            value: userEditedData.surname || (originalFields.surname?.value || originalFields.familiya?.value || ''),
            confidence: userEditedData.surname ? 100.0 : (originalFields.surname?.confidence || originalFields.familiya?.confidence || 0)
        },
        familiya: {
            value: userEditedData.surname || (originalFields.familiya?.value || originalFields.surname?.value || ''),
            confidence: userEditedData.surname ? 100.0 : (originalFields.familiya?.confidence || originalFields.surname?.confidence || 0)
        },
        given_names: {
            value: userEditedData.given_name || (originalFields.given_names?.value || originalFields.ism?.value || ''),
            confidence: userEditedData.given_name ? 100.0 : (originalFields.given_names?.confidence || originalFields.ism?.confidence || 0)
        },
        ism: {
            value: userEditedData.given_name || (originalFields.ism?.value || originalFields.given_names?.value || ''),
            confidence: userEditedData.given_name ? 100.0 : (originalFields.ism?.confidence || originalFields.given_names?.confidence || 0)
        },
        passport_number: {
            value: userEditedData.passport_no || (originalFields.passport_number?.value || originalFields.passport_raqami?.value || ''),
            confidence: userEditedData.passport_no ? 100.0 : (originalFields.passport_number?.confidence || originalFields.passport_raqami?.confidence || 0)
        },
        passport_raqami: {
            value: userEditedData.passport_no || (originalFields.passport_raqami?.value || originalFields.passport_number?.value || ''),
            confidence: userEditedData.passport_no ? 100.0 : (originalFields.passport_raqami?.confidence || originalFields.passport_number?.confidence || 0)
        },
        date_of_birth: {
            value: userEditedData.date_of_birth || (originalFields.date_of_birth?.value || originalFields.tugilgan_sanasi?.value || ''),
            confidence: userEditedData.date_of_birth ? 100.0 : (originalFields.date_of_birth?.confidence || originalFields.tugilgan_sanasi?.confidence || 0)
        },
        tugilgan_sanasi: {
            value: userEditedData.date_of_birth || (originalFields.tugilgan_sanasi?.value || originalFields.date_of_birth?.value || ''),
            confidence: userEditedData.date_of_birth ? 100.0 : (originalFields.tugilgan_sanasi?.confidence || originalFields.date_of_birth?.confidence || 0)
        },
        date_of_issue: {
            value: userEditedData.date_of_issue || (originalFields.date_of_issue?.value || originalFields.berilgan_vaqti?.value || ''),
            confidence: userEditedData.date_of_issue ? 100.0 : (originalFields.date_of_issue?.confidence || originalFields.berilgan_vaqti?.confidence || 0)
        },
        berilgan_vaqti: {
            value: userEditedData.date_of_issue || (originalFields.berilgan_vaqti?.value || originalFields.date_of_issue?.value || ''),
            confidence: userEditedData.date_of_issue ? 100.0 : (originalFields.berilgan_vaqti?.confidence || originalFields.date_of_issue?.confidence || 0)
        },
        date_of_expiry: {
            value: userEditedData.date_of_expiry || (originalFields.date_of_expiry?.value || originalFields.amal_qilish_muddati?.value || ''),
            confidence: userEditedData.date_of_expiry ? 100.0 : (originalFields.date_of_expiry?.confidence || originalFields.amal_qilish_muddati?.confidence || 0)
        },
        amal_qilish_muddati: {
            value: userEditedData.date_of_expiry || (originalFields.amal_qilish_muddati?.value || originalFields.date_of_expiry?.value || ''),
            confidence: userEditedData.date_of_expiry ? 100.0 : (originalFields.amal_qilish_muddati?.confidence || originalFields.date_of_expiry?.confidence || 0)
        },
        nationality: {
            value: userEditedData.nationality || (originalFields.nationality?.value || originalFields.millati?.value || ''),
            confidence: userEditedData.nationality ? 100.0 : (originalFields.nationality?.confidence || originalFields.millati?.confidence || 0)
        },
        millati: {
            value: userEditedData.nationality || (originalFields.millati?.value || originalFields.nationality?.value || ''),
            confidence: userEditedData.nationality ? 100.0 : (originalFields.millati?.confidence || originalFields.nationality?.confidence || 0)
        },
        sex: {
            value: userEditedData.sex || (originalFields.sex?.value || originalFields.jinsi?.value || ''),
            confidence: userEditedData.sex ? 100.0 : (originalFields.sex?.confidence || originalFields.jinsi?.confidence || 0)
        },
        jinsi: {
            value: userEditedData.sex || (originalFields.jinsi?.value || originalFields.sex?.value || ''),
            confidence: userEditedData.sex ? 100.0 : (originalFields.jinsi?.confidence || originalFields.sex?.confidence || 0)
        },
        place_of_birth: {
            value: userEditedData.place_of_birth || (originalFields.place_of_birth?.value || originalFields.tugilgan_joyi?.value || ''),
            confidence: userEditedData.place_of_birth ? 100.0 : (originalFields.place_of_birth?.confidence || originalFields.tugilgan_joyi?.confidence || 0)
        },
        tugilgan_joyi: {
            value: userEditedData.place_of_birth || (originalFields.tugilgan_joyi?.value || originalFields.place_of_birth?.value || ''),
            confidence: userEditedData.place_of_birth ? 100.0 : (originalFields.tugilgan_joyi?.confidence || originalFields.place_of_birth?.confidence || 0)
        },
        authority: {
            value: userEditedData.authority || (originalFields.authority?.value || originalFields.kim_tomonidan_berilgan?.value || ''),
            confidence: userEditedData.authority ? 100.0 : (originalFields.authority?.confidence || originalFields.kim_tomonidan_berilgan?.confidence || 0)
        },
        kim_tomonidan_berilgan: {
            value: userEditedData.authority || (originalFields.kim_tomonidan_berilgan?.value || originalFields.authority?.value || ''),
            confidence: userEditedData.authority ? 100.0 : (originalFields.kim_tomonidan_berilgan?.confidence || originalFields.authority?.confidence || 0)
        }
    };
    
    const updatedData = {
        ...existingExtractedData,
        fields: updatedFields
    };
    
    try {
        const token = localStorage.getItem('token');
        
        console.log('🔍 savePassportDataFromView - Sending data to backend:', {
            documentId: documentId,
            updatedData: updatedData,
            userEditedData: userEditedData,
            isEdited: isEdited
        });
        
        const response = await fetch(`${API_BASE_URL}/ocr/documents/${documentId}?user_role=${userRole}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                extracted_data: updatedData,
                user_edited_data: userEditedData,
                is_edited: isEdited
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Backend error:', error);
            throw new Error(error.detail || '저장 오류');
        }
        
        const responseData = await response.json();
        console.log('✅ Backend response:', responseData);
        
        alert('문서가 성공적으로 저장되었습니다!');
        
        // Document'ni qayta yuklash
        await new Promise(resolve => setTimeout(resolve, 500));
        await viewDocument(documentId);
        
        // Input'larni yana readonly qilish
        const inputs = document.querySelectorAll(`[id^="view-edit-"][id$="-${documentId}"]`);
        inputs.forEach(input => {
            input.readOnly = true;
            input.disabled = (input.tagName === 'SELECT');
            input.style.backgroundColor = '#f8f9fa';
            input.style.border = '1px solid #ddd';
        });
        
        // Tugmalarni yangilash
        const enableEditBtn = document.getElementById(`btn-enable-edit-${documentId}`);
        const saveBtn = document.getElementById(`btn-save-${documentId}`);
        
        if (enableEditBtn) enableEditBtn.style.display = 'inline-block';
        if (saveBtn) saveBtn.style.display = 'none';
        
    } catch (error) {
        console.error('저장 오류:', error);
        if (errorDiv) {
            errorDiv.textContent = error.message || '저장 중 오류가 발생했습니다.';
            errorDiv.style.display = 'block';
        } else {
            alert(t('saveErrorAlert') + ': ' + error.message);
        }
    }
};

// ==================== PASSPORT ACTIONS ====================

async function confirmPassportData(documentId) {
    if (!confirm(t('confirmDialogTitle') + '\n\n' + t('confirmDialogSent'))) {
        return;
    }
    
    // Darhol: Tasdiqlayman/Qayta skanerlash blokini xabar bilan almashtirish
    const id = String(documentId);
    const contentRoot = document.getElementById('documentDetailContent');
    const actionsEl = document.getElementById('passport-actions-' + id) ||
        (contentRoot && contentRoot.querySelector('.passport-actions')) ||
        document.querySelector('.passport-actions');
    if (actionsEl) {
        actionsEl.innerHTML = '<p class="passport-confirmed-msg" style="margin:0; padding: 12px 20px; background: #ecfdf5; color: #065f46; border-radius: 8px; text-align: center;">✓ ' + t('docConfirmedMsg') + '</p>';
        actionsEl.id = 'passport-actions-' + id;
    }
    // Darhol: pastdagi Tahrirlash tugmasini yashirish
    const docActions = contentRoot && contentRoot.querySelector('.document-actions');
    if (docActions) {
        const editBtn = docActions.querySelector('.btn-primary');
        if (editBtn) editBtn.style.display = 'none';
    }
    
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username') || 'user';
        
        const response = await fetch(`${API_BASE_URL}/ocr/documents/${documentId}?user_role=${userRole}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                status: 'pending',
                metadata: {
                    submitted_for_review: true,
                    submitted_at: new Date().toISOString(),
                    submitted_by: username,
                    confirmed: true,
                    confirmed_at: new Date().toISOString()
                }
            })
        });
        
        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody.detail || t('confirmErr'));
        }
        
        // Muvaffaqiyat: sahifani qayta yuklamaymiz, shunchaki xabar – tugmalar allaqachon yo‘qolgan
        alert(t('confirmSuccessAlert'));
    } catch (error) {
        console.error(t('confirmErr') + ':', error);
        await viewDocument(documentId);
        alert(t('confirmErrorAlert') + ': ' + error.message);
    }
}

async function reprocessDocument(documentId) {
    if (!confirm(t('rescanConfirm'))) {
        return;
    }
    
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        const token = localStorage.getItem('token');
        
        // Document'ni qayta ishlash
        const response = await fetch(`${API_BASE_URL}/ocr/documents/${documentId}/reprocess?user_role=${userRole}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || t('rescanErrorAlert'));
        }
        
        alert(t('rescanSuccessAlert'));
        
        // 2 soniyadan keyin document'ni qayta yuklash
        setTimeout(async () => {
            await viewDocument(documentId);
        }, 2000);
        
    } catch (error) {
        console.error(t('rescanErrorAlert') + ':', error);
        alert(t('rescanErrorAlert') + ': ' + error.message);
    }
}

// ==================== EDIT PASSPORT ====================

let currentEditingDocumentId = null;

// Global scope'ga qo'shish (onclick event'lar uchun)
// Helper function: Input'ni majburiy editable qilish
function forceInputEditable(input) {
    if (!input) return false;
    
    // 1. HTML atributlarni olib tashlash (barcha variantlar)
    input.removeAttribute('readonly');
    input.removeAttribute('disabled');
    input.removeAttribute('readOnly');
    input.removeAttribute('READONLY');
    input.removeAttribute('DISABLED');
    
    // 2. JavaScript property'larni o'zgartirish
    input.readOnly = false;
    input.disabled = false;
    
    // 3. CSS style'larni tozalash va editable qilish (barcha variantlar)
    input.style.setProperty('background-color', '#fff', 'important');
    input.style.setProperty('border', '1px solid #4f46e5', 'important');
    input.style.setProperty('cursor', 'text', 'important');
    input.style.setProperty('pointer-events', 'auto', 'important');
    input.style.setProperty('opacity', '1', 'important');
    input.style.setProperty('user-select', 'text', 'important');
    input.style.setProperty('-webkit-user-select', 'text', 'important');
    input.style.setProperty('-moz-user-select', 'text', 'important');
    input.style.setProperty('-ms-user-select', 'text', 'important');
    
    // 4. Contenteditable'ni o'chirish (input/textarea uchun kerak emas)
    if (input.hasAttribute('contenteditable')) {
        input.removeAttribute('contenteditable');
    }
    
    // 5. Event listener'larni bloklovchi narsalarni olib tashlash
    // Agar input'da onkeydown, onkeypress kabi atributlar bo'lsa, ularni olib tashlash
    ['onkeydown', 'onkeypress', 'onkeyup', 'oninput', 'onchange'].forEach(attr => {
        if (input.hasAttribute(attr)) {
            const handler = input.getAttribute(attr);
            // Faqat readonly/disabled'ni qaytaruvchi handler'larni olib tashlash
            if (handler && (handler.includes('readonly') || handler.includes('disabled'))) {
                input.removeAttribute(attr);
            }
        }
    });
    
    return true;
}

// MutationObserver: readonly/disabled qayta qo'shilishini kuzatish
let editModalObserver = null;

// ==================== YANGI SODDA VERSIYA - 100% ISHLAYDI ====================

// 1. Modalni ochish va ma'lumotlarni yuklash
window.openEditPassportModal = async function openEditModal(documentId) {
    if (documentId == null || documentId === '' || String(documentId) === 'undefined') {
        console.error('❌ openEditPassportModal: documentId yo\'q', documentId);
        alert('문서 ID를 찾을 수 없습니다. 문서를 다시 열어주세요.');
        return;
    }
    currentEditingDocId = documentId;
    currentEditingDocumentId = documentId; // Eski versiya bilan moslashish uchun

    const modal = document.getElementById('editPassportModal');
    if (!modal) {
        console.error('❌ editPassportModal not found!');
        alert('Edit modal topilmadi. Sahifani yangilang.');
        return;
    }
    
    const errorDiv = document.getElementById('editPassportError');
    if (errorDiv) errorDiv.style.display = 'none';
    
    // Modal'ni ochish
    modal.style.display = 'block';
    
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        const doc = await apiCall(`/ocr/documents/${documentId}?user_role=${userRole}`);
        const fields = doc.extracted_data?.fields || {};
        console.log('📄 Document loaded for editing:', {
            id: documentId,
            hasFields: !!doc.extracted_data?.fields
        });
        
        // Qiymatlarni inputlarga joylashtirish - to'g'ridan-to'g'ri
        const surnameEl = document.getElementById('edit-surname');
        const givenNamesEl = document.getElementById('edit-given-names');
        const passportNoEl = document.getElementById('edit-passport-no');
        const nationalityEl = document.getElementById('edit-nationality');
        const authorityEl = document.getElementById('edit-authority');
        
        if (surnameEl) {
            surnameEl.value = fields.surname?.value || fields.familiya?.value || '';
            surnameEl.removeAttribute('readonly');
            surnameEl.removeAttribute('disabled');
            surnameEl.readOnly = false;
            surnameEl.disabled = false;
        }
        
        if (givenNamesEl) {
            givenNamesEl.value = fields.given_names?.value || fields.ism?.value || '';
            givenNamesEl.removeAttribute('readonly');
            givenNamesEl.removeAttribute('disabled');
            givenNamesEl.readOnly = false;
            givenNamesEl.disabled = false;
        }
        
        if (passportNoEl) {
            passportNoEl.value = fields.passport_no?.value || fields.passport_number?.value || fields.passport_raqami?.value || '';
            passportNoEl.removeAttribute('readonly');
            passportNoEl.removeAttribute('disabled');
            passportNoEl.readOnly = false;
            passportNoEl.disabled = false;
        }
        
        if (nationalityEl) {
            let natVal = fields.nationality?.value || fields.millati?.value || '';
            const natUpper = (natVal && typeof natVal === 'string' ? natVal.trim().toUpperCase() : '');
            if (natUpper === 'НАЦИОНАЛЬНОСТЬ' || natUpper === 'NATIONALITY' || natUpper === 'МИЛЛАТИ' || natUpper === 'MILLATI') natVal = '';
            nationalityEl.value = natVal;
            nationalityEl.removeAttribute('readonly');
            nationalityEl.removeAttribute('disabled');
            nationalityEl.readOnly = false;
            nationalityEl.disabled = false;
        }
        
        if (authorityEl) {
            authorityEl.value = fields.authority?.value || fields.kim_tomonidan_berilgan?.value || '';
            authorityEl.removeAttribute('readonly');
            authorityEl.removeAttribute('disabled');
            authorityEl.readOnly = false;
            authorityEl.disabled = false;
        }
        
        // Saqlash tugmasiga event qo'shish
        const saveBtn = document.getElementById('saveEditBtn');
        if (saveBtn) {
            saveBtn.onclick = () => saveEditedData(documentId);
        }
        console.log("✅ Tahrirlash uchun ma'lumotlar yuklandi:", documentId);
    } catch (error) {
        console.error("❌ Yuklashda xato:", error);
        if (errorDiv) {
            errorDiv.textContent = "Ma'lumotlarni yuklab bo'lmadi: " + error.message;
            errorDiv.style.display = 'block';
        } else {
            alert("Ma'lumotlarni yuklab bo'lmadi.");
        }
    }
};

// 2. Ma'lumotlarni yig'ish va Backendga yuborish
async function saveEditedData(docId) {
    console.log("💾 Saving to backend - Document ID:", docId);
    
    const errorDiv = document.getElementById('editPassportError');
    if (errorDiv) errorDiv.style.display = 'none';
    
    // Ma'lumotlarni to'g'ridan-to'g'ri olish
    const updatedData = {
        surname: (document.getElementById('edit-surname')?.value || '').trim(),
        given_names: (document.getElementById('edit-given-names')?.value || '').trim(),
        passport_no: (document.getElementById('edit-passport-no')?.value || '').trim(),
        nationality: (document.getElementById('edit-nationality')?.value || '').trim(),
        authority: (document.getElementById('edit-authority')?.value || '').trim()
    };
    console.log("🚀 Saqlanayotgan ma'lumot:", updatedData);
    
    // Tekshirish - kamida bir maydon to'ldirilgan bo'lishi kerak
    const filledFields = Object.values(updatedData).filter(v => v !== '');
    if (filledFields.length === 0) {
        const errorMsg = "❌ Hech bo'lmaganda bir maydonni to'ldiring!";
        if (errorDiv) {
            errorDiv.textContent = errorMsg;
            errorDiv.style.display = 'block';
        } else {
            alert(errorMsg);
        }
        return;
    }
    
    // await dan OLDIN qiymatlarni nusxalab olamiz – await dan keyin updatedData o'zgarishi mumkin
    const payloadToSend = {
        surname: String(updatedData.surname ?? '').trim(),
        given_names: String(updatedData.given_names ?? '').trim(),
        passport_no: String(updatedData.passport_no ?? '').trim(),
        nationality: String(updatedData.nationality ?? '').trim(),
        authority: String(updatedData.authority ?? '').trim()
    };
    
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        
        // Avvalgi ma'lumotlarni olish (solishtirish uchun)
        const originalDoc = await apiCall(`/ocr/documents/${docId}?user_role=${userRole}`);
        const originalFields = originalDoc.extracted_data?.fields || {};
        
        // is_edited flag'ni aniqlash (payloadToSend dan, await dan keyin emas)
        let isEdited = false;
        if (payloadToSend.surname !== (originalFields.surname?.value || originalFields.familiya?.value || '')) {
            isEdited = true;
        } else if (payloadToSend.given_names !== (originalFields.given_names?.value || originalFields.ism?.value || '')) {
            isEdited = true;
        } else if (payloadToSend.passport_no !== (originalFields.passport_no?.value || originalFields.passport_number?.value || originalFields.passport_raqami?.value || '')) {
            isEdited = true;
        } else if (payloadToSend.nationality !== (originalFields.nationality?.value || originalFields.millati?.value || '')) {
            isEdited = true;
        } else if (payloadToSend.authority !== (originalFields.authority?.value || originalFields.kim_tomonidan_berilgan?.value || '')) {
            isEdited = true;
        }
        
        const patchData = {
            user_edited_data: payloadToSend,
            is_edited: isEdited
        };
        
        console.log("📤 Backend'ga yuborilayotgan ma'lumot:", patchData);
        const response = await apiCall(`/ocr/documents/${docId}?user_role=${userRole}`, {
            method: 'PATCH',
            body: JSON.stringify(patchData)
        });
        console.log("✅ Backend response:", response);
        
        // Modal'ni yopish
        closeEditPassportModal();
        
        // Success message
        alert("✅ Muvaffaqiyatli saqlandi!");
        
        // Shu hujjat detali sahifada qolish – yangilangan ma'lumot bilan (Tasdiqlayman bosish uchun)
        await viewDocument(docId);
    } catch (error) {
        console.error("❌ Saqlashda xato:", error);
        const errorMsg = "Saqlashda xato: " + (error.message || 'Noma\'lum xatolik');
        
        if (errorDiv) {
            errorDiv.textContent = errorMsg;
            errorDiv.style.display = 'block';
        } else {
            alert(errorMsg);
        }
    }
}

// 3. Modal'ni yopish
window.closeEditPassportModal = function() {
    const modal = document.getElementById('editPassportModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentEditingDocId = null;
    currentEditingDocumentId = null;
    
    // Eski observer'ni tozalash
    if (editModalObserver) {
        editModalObserver.disconnect();
        editModalObserver = null;
    }
};

// ==================== ESKI VERSIYA (Backup) - O'chirilgan, chunki ishlatilmaydi ====================
// Eski funksiya o'chirildi - yangi versiya ishlatiladi (openEditPassportModal)

// loadDocumentForEdit funksiyasi - hozir ishlatilmaydi, lekin boshqa joylarda chaqirilishi mumkin
async function loadDocumentForEdit(documentId) {
    try {
        console.log('📄 Document loaded for editing - ID:', documentId);
        const userRole = localStorage.getItem('user_role') || 'user';
        const doc = await apiCall(`/ocr/documents/${documentId}?user_role=${userRole}`);
        
        console.log('📄 Document data received:', {
            id: doc.id,
            hasExtractedData: !!doc.extracted_data,
            hasFields: !!(doc.extracted_data?.fields)
        });
        
        const extractedData = doc.extracted_data || {};
        const passport = extractedData.passport || {};
        const simplified = extractedData.simplified || {};
        const fields = extractedData.fields || {};
        const normalized = extractedData.normalized || {};
        
        // Helper function: label'larni tozalash (formatPassportData'dan olingan)
        const cleanFieldValue = (value) => {
            if (!value || typeof value !== 'string') return value;
            
            const labels = [
                'ФАМИЛИЯСИ', 'ФАМИЛИЯ', 'FAMILIYA', 'SURNAME', 'Familiyasi', 'Фамилияси', 'Фамилия',
                'ИСМИ', 'ИМЯ', 'ISM', 'GIVEN NAME', 'GIVEN', 'NAME', 'Исм', 'Имя',
                'ОТАСИНИНГ ИСМИ', 'ОТЧЕСТВО', 'PATRONYMIC', 'ОТАСИНИНГ', 'Otasining ismi',
                'МИЛЛАТИ', 'НАЦИОНАЛЬНОСТЬ', 'NATIONALITY', 'Millati', 'Национальность',
                'ТУҒИЛГАН ВАҚТИ', 'ДАТА РОЖДЕНИЯ', 'DATE OF BIRTH', 'DOB', 'Tugilgan sanasi',
                'БЕРИЛГАН ВАҚТИ', 'ДАТА ВЫДАЧИ', 'DATE OF ISSUE', 'Berilgan vaqti',
                'АМАЛ ҚИЛИШ МУДДАТИ', 'ДЕЙСТВИТЕЛЕН ДО', 'DATE OF EXPIRY', 'Amal qilish muddati',
                'ПАСПОРТ РАҚАМИ', 'PASSPORT NO', 'PASSPORT NUMBER', 'Passport raqami',
                'ТУҒИЛГАН ЖОЙИ', 'МЕСТО РОЖДЕНИЯ', 'PLACE OF BIRTH', 'Tugilgan joyi',
                'КИМ ТОМОНИДАН БЕРИЛГАН', 'КЕМ ВЫДАН', 'AUTHORITY', 'Kim tomonidan berilgan',
                'ЖИНСИ', 'ПОЛ', 'SEX', 'GENDER', 'Jinsi', 'Пол'
            ];
            
            const lines = value.split('\n').map(line => line.trim()).filter(line => line);
            const cleanedLines = [];
            
            for (const line of lines) {
                const isLabel = labels.some(label => {
                    const labelUpper = label.toUpperCase();
                    const lineUpper = line.toUpperCase();
                    return lineUpper === labelUpper || 
                           lineUpper.startsWith(labelUpper + ':') ||
                           lineUpper.startsWith(labelUpper + '/') ||
                           lineUpper.includes(labelUpper + ' ') ||
                           (lineUpper.length <= labelUpper.length + 2 && lineUpper.includes(labelUpper));
                });
                
                if (!isLabel && line.length > 0) {
                    cleanedLines.push(line);
                }
            }
            
            return cleanedLines.length > 0 ? cleanedLines.join(' ').trim() : value;
        };
        
        // Millat maydonida faqat label bo'lsa bo'sh qaytarish (qiymat emas)
        const nationalityLabelsOnly = [
            'НАЦИОНАЛЬНОСТЬ', 'NATIONALITY', 'МИЛЛАТИ', 'MILLATI', 'Millati', 'Национальность'
        ];
        const normalizeForLabelCheck = (str) => (str || '').toString().trim().replace(/\s+/g, ' ').replace(/^[\s.,:;]+|[\s.,:;]+$/g, '').toUpperCase();
        const isNationalityLabelOnly = (val, fieldName, altNames) => {
            if (fieldName !== 'nationality' && !(altNames && altNames.includes('millati'))) return false;
            if (!val || typeof val !== 'string') return false;
            const c = normalizeForLabelCheck(val);
            return c && (
                nationalityLabelsOnly.some(l => normalizeForLabelCheck(l) === c) ||
                (c.length <= 25 && (c.includes('НАЦИОНАЛЬНОСТЬ') || c.includes('NATIONALITY') || c.includes('МИЛЛАТИ') || c === 'MILLATI'))
            );
        };
        
        // Helper function: field value'ni olish va tozalash
        const getFieldValue = (fieldName, altNames = []) => {
            let rawValue = '';
            
            if (normalized[fieldName]) {
                rawValue = normalized[fieldName];
            } else if (passport[fieldName]) {
                rawValue = passport[fieldName];
            } else if (simplified[fieldName]) {
                rawValue = simplified[fieldName];
            } else {
                for (const name of [fieldName, ...altNames]) {
                    if (fields[name]) {
                        if (typeof fields[name] === 'object' && fields[name].value !== undefined) {
                            rawValue = fields[name].value;
                            break;
                        } else if (typeof fields[name] === 'string') {
                            rawValue = fields[name];
                            break;
                        }
                    }
                }
            }
            
            let result = cleanFieldValue(rawValue);
            if (isNationalityLabelOnly(result, fieldName, altNames)) result = '';
            return result;
        };
        
        // Form'ni to'ldirish (to'liq, mask qilinmagan ma'lumotlar bilan)
        // Edit rejimida: to'liq ma'lumotlarni ko'rsatish
        const surnameField = fields.surname || fields.familiya;
        const givenNameField = fields.given_name || fields.given_names || fields.ism;
        
        // Original qiymatlarni olish (mask qilinmagan)
        let fullSurname = '';
        let fullGivenName = '';
        
        if (surnameField) {
            if (typeof surnameField === 'object' && surnameField.value) {
                fullSurname = cleanFieldValue(surnameField.value);
            } else if (typeof surnameField === 'string') {
                fullSurname = cleanFieldValue(surnameField);
            }
        }
        
        if (givenNameField) {
            if (typeof givenNameField === 'object' && givenNameField.value) {
                fullGivenName = cleanFieldValue(givenNameField.value);
            } else if (typeof givenNameField === 'string') {
                fullGivenName = cleanFieldValue(givenNameField);
            }
        }
        
        // Agar hali ham bo'sh bo'lsa, boshqa formatlardan olish
        if (!fullSurname) {
            fullSurname = getFieldValue('surname', ['familiya']) || '';
        }
        if (!fullGivenName) {
            fullGivenName = getFieldValue('given_name', ['given_names', 'ism']) || '';
        }
        
        // Place of Birth va Authority maydonlarini to'g'ridan-to'g'ri olish (unmasked)
        const placeOfBirthField = fields.place_of_birth || fields.tugilgan_joyi;
        const authorityField = fields.authority || fields.kim_tomonidan_berilgan;
        
        let fullPlaceOfBirth = '';
        let fullAuthority = '';
        
        if (placeOfBirthField) {
            if (typeof placeOfBirthField === 'object' && placeOfBirthField.value) {
                fullPlaceOfBirth = cleanFieldValue(placeOfBirthField.value);
            } else if (typeof placeOfBirthField === 'string') {
                fullPlaceOfBirth = cleanFieldValue(placeOfBirthField);
            }
        }
        
        if (authorityField) {
            if (typeof authorityField === 'object' && authorityField.value) {
                fullAuthority = cleanFieldValue(authorityField.value);
            } else if (typeof authorityField === 'string') {
                fullAuthority = cleanFieldValue(authorityField);
            }
        }
        
        // Agar hali ham bo'sh bo'lsa, boshqa formatlardan olish
        if (!fullPlaceOfBirth) {
            fullPlaceOfBirth = getFieldValue('place_of_birth', ['tugilgan_joyi']) || '';
        }
        if (!fullAuthority) {
            fullAuthority = getFieldValue('authority', ['kim_tomonidan_berilgan']) || '';
        }
        
        // Helper: Multiple ID patterns bilan element topish
        const getElement = (...ids) => {
            for (const id of ids) {
                const el = document.getElementById(id);
                if (el) {
                    console.log(`✅ Found input element: "${id}"`);
                    return el;
                }
            }
            console.warn(`⚠️ Input not found for IDs:`, ids);
            return null;
        };
        
        // Input elementlarini olish - multiple ID patterns bilan
        const editSurnameEl = getElement('editSurname', 'edit-surname', 'edit_surname');
        const editGivenNameEl = getElement('editGivenName', 'editGivenNames', 'edit-given-names', 'edit-given-name');
        const editPassportNoEl = getElement('editPassportNo', 'edit-passport-no', 'edit_passport_no');
        const editDateOfBirthEl = getElement('editDateOfBirth', 'edit-date-of-birth', 'edit_date_of_birth');
        const editDateOfIssueEl = getElement('editDateOfIssue', 'edit-date-of-issue', 'edit_date_of_issue');
        const editDateOfExpiryEl = getElement('editDateOfExpiry', 'edit-date-of-expiry', 'edit_date_of_expiry');
        const editNationalityEl = getElement('editNationality', 'edit-nationality', 'edit_nationality');
        const editSexEl = getElement('editSex', 'edit-sex', 'edit_sex');
        const editPlaceOfBirthEl = getElement('editPlaceOfBirth', 'edit-place-of-birth', 'edit_place_of_birth');
        const editAuthorityEl = getElement('editAuthority', 'edit-authority', 'edit_authority');
        
        // Barcha inputlarni editable qilish (forceInputEditable funksiyasidan foydalanish)
        [editSurnameEl, editGivenNameEl, editPassportNoEl, editDateOfBirthEl, 
         editDateOfIssueEl, editDateOfExpiryEl, editNationalityEl, editSexEl, 
         editPlaceOfBirthEl, editAuthorityEl].forEach(input => {
            if (input) {
                forceInputEditable(input);
                
                console.log('✅ Input made editable in loadDocumentForEdit:', {
                    id: input.id,
                    type: input.type || input.tagName,
                    readOnly: input.readOnly,
                    disabled: input.disabled,
                    hasValue: !!input.value
                });
            }
        });
        
        // Helper function: input'ga qiymat yozish va editable qilish
        const setInputValue = (element, value) => {
            if (!element) {
                console.warn(`⚠️ Input element not found for value: ${value}`);
                return false;
            }
            
            // Qiymatni tozalash
            const cleanValue = String(value || '').trim();
            
            // Input type'ga qarab qiymat yozish
            if (element.tagName === 'TEXTAREA') {
                element.value = cleanValue;
                element.textContent = cleanValue; // Qo'shimcha
            } else if (element.tagName === 'SELECT') {
                element.value = cleanValue;
                // Agar option topilmasa, birinchi option'ni tanlash
                if (!element.value && element.options.length > 0) {
                    element.selectedIndex = 0;
                }
            } else {
                element.value = cleanValue;
            }
            
            // Editable qilish (forceInputEditable funksiyasidan foydalanish)
            forceInputEditable(element);
            
            console.log(`✅ Set input ${element.id}: "${cleanValue}" (readOnly: ${element.readOnly}, disabled: ${element.disabled})`);
            
            return true;
        };
        
        // Ma'lumotlarni to'ldirish va editable qilish
        const passportNo = getFieldValue('passport_no', ['passport_number', 'passport_raqami']) || '';
        const dateOfBirth = getFieldValue('date_of_birth', ['dob', 'tugilgan_sanasi']) || '';
        const dateOfIssue = getFieldValue('date_of_issue', ['issue_date', 'berilgan_vaqti']) || '';
        const dateOfExpiry = getFieldValue('date_of_expiry', ['expiry', 'amal_qilish_muddati']) || '';
        const nationality = getFieldValue('nationality', ['millati']) || '';
        const sex = getFieldValue('sex', ['jinsi']) || '';
        
        setInputValue(editSurnameEl, fullSurname);
        setInputValue(editGivenNameEl, fullGivenName);
        setInputValue(editPassportNoEl, passportNo);
        setInputValue(editDateOfBirthEl, dateOfBirth);
        setInputValue(editDateOfIssueEl, dateOfIssue);
        setInputValue(editDateOfExpiryEl, dateOfExpiry);
        setInputValue(editNationalityEl, nationality);
        setInputValue(editSexEl, sex);
        setInputValue(editPlaceOfBirthEl, fullPlaceOfBirth);
        setInputValue(editAuthorityEl, fullAuthority);
        
        // Qo'shimcha tekshirish - barcha inputlar to'ldirilgan va editable bo'lishi kerak
        const allInputs = [editSurnameEl, editGivenNameEl, editPassportNoEl, editDateOfBirthEl, 
                          editDateOfIssueEl, editDateOfExpiryEl, editNationalityEl, editSexEl, 
                          editPlaceOfBirthEl, editAuthorityEl];
        
        const filledInputs = allInputs.filter(el => el && el.value && el.value.trim());
        const editableInputs = allInputs.filter(el => el && !el.readOnly && !el.disabled);
        
        console.log('✅ Made X inputs editable:', {
            totalInputs: allInputs.length,
            filledInputs: filledInputs.length,
            editableInputs: editableInputs.length,
            allEditable: editableInputs.length === allInputs.length,
            summary: `${editableInputs.length}/${allInputs.length} inputs are editable`
        });
        
        console.log('📋 Form data loaded:', {
            surname: fullSurname?.substring(0, 30) || 'empty',
            givenName: fullGivenName?.substring(0, 30) || 'empty',
            placeOfBirth: fullPlaceOfBirth?.substring(0, 30) || 'empty',
            authority: fullAuthority?.substring(0, 30) || 'empty',
            passportNo: passportNo || 'empty',
            dateOfBirth: dateOfBirth || 'empty',
            dateOfIssue: dateOfIssue || 'empty',
            dateOfExpiry: dateOfExpiry || 'empty',
            nationality: nationality || 'empty',
            sex: sex || 'empty'
        });
        
    } catch (error) {
        console.error('Document yuklash xatosi:', error);
        alert('문서 로드 오류: ' + error.message);
    }
}

// 1. Tahrirlashni yoqish funksiyasi (Clean Code standartida)
window.enableEditing = function() {
    // Barcha input va textarea'larni topish
    const inputs = document.querySelectorAll('.passport-card input, .passport-card textarea');
    inputs.forEach(input => {
        input.removeAttribute('readonly'); // Readonly'ni olib tashlash
        input.removeAttribute('disabled'); // Disabled'ni olib tashlash
        input.readOnly = false; // JavaScript property
        input.disabled = false; // JavaScript property
        input.classList.add('editing-mode'); // Vizual uslub berish uchun
        input.style.border = "2px solid #4f46e5"; // Binafsha ramka
        input.style.backgroundColor = "#fff";
        input.style.cursor = "text";
        input.style.pointerEvents = "auto";
    });
    console.log("✅ Tahrirlash rejimi yoqildi. Found inputs:", inputs.length);
}

async function savePassportData() {
    // Foydalanuvchi bergan versiyaga moslashtirilgan
    const docId = currentEditingDocumentId;
    
    if (!docId) {
        alert('문서 ID를 찾을 수 없습니다.');
        return;
    }
    
    console.log("💾 Saving to backend - Document ID:", docId);
    
    const errorDiv = document.getElementById('editPassportError');
    if (errorDiv) errorDiv.style.display = 'none';
    
    // Modal tekshirish
    const modal = document.getElementById('editPassportModal');
    if (!modal) {
        console.error('❌ Modal not found');
        alert('Edit modal topilmadi. Sahifani yangilang.');
        return;
    }
    
    // MUHIM: Helper funksiya - barcha mumkin bo'lgan ID variantlarini tekshirish
    const getVal = (...ids) => {
        for (const id of ids) {
            const el = document.getElementById(id);
            if (el) {
                // Input, textarea, select uchun value, boshqalar uchun textContent
                let value = '';
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                    value = el.value || '';
                } else {
                    value = el.textContent || el.innerText || '';
                }
                const trimmedValue = value.trim();
                console.log(`✅ Found element with ID "${id}":`, trimmedValue.substring(0, 50) + (trimmedValue.length > 50 ? '...' : ''));
                return trimmedValue;
            }
        }
        console.warn(`⚠️ Element not found for IDs:`, ids);
        return '';
    };
    
    // Avvalgi ma'lumotlarni olish (solishtirish uchun)
    const userRole = localStorage.getItem('user_role') || 'user';
    const originalDoc = await apiCall(`/ocr/documents/${currentEditingDocumentId}?user_role=${userRole}`);
    const originalData = originalDoc.extracted_data || {};
    const originalFields = originalData.fields || {};
    
    // Mavjud extracted_data'ni saqlab qolish (passport, simplified, normalized va boshqalar)
    // Faqat fields qismini yangilaymiz
    const existingExtractedData = { ...originalData };
    
    // DOM-dan qiymatlarni olish - barcha mumkin bo'lgan ID variantlarini tekshirish
    // Multiple ID patterns: camelCase, kebab-case, snake_case
    const userEditedData = {
        surname: getVal('editSurname', 'edit-surname', 'edit_surname', 'surname'),
        given_name: getVal('editGivenName', 'editGivenNames', 'edit-given-names', 'edit-given-name', 'edit_given_name', 'givenName'),
        passport_no: getVal('editPassportNo', 'edit-passport-no', 'edit_passport_no', 'passportNo', 'passport_no'),
        date_of_birth: getVal('editDateOfBirth', 'edit-date-of-birth', 'edit_date_of_birth', 'dateOfBirth', 'date_of_birth'),
        date_of_issue: getVal('editDateOfIssue', 'edit-date-of-issue', 'edit_date_of_issue', 'dateOfIssue', 'date_of_issue'),
        date_of_expiry: getVal('editDateOfExpiry', 'edit-date-of-expiry', 'edit_date_of_expiry', 'dateOfExpiry', 'date_of_expiry'),
        nationality: getVal('editNationality', 'edit-nationality', 'edit_nationality', 'nationality'),
        sex: getVal('editSex', 'edit-sex', 'edit_sex', 'sex'),
        place_of_birth: getVal('editPlaceOfBirth', 'edit-place-of-birth', 'edit_place_of_birth', 'placeOfBirth', 'place_of_birth'),
        authority: getVal('editAuthority', 'edit-authority', 'edit_authority', 'authority')
    };
    
    // Ma'lumotlar yig'ilganini tekshirish
    const filledFields = Object.entries(userEditedData).filter(([key, value]) => value && value.trim() !== '');
    console.log(`📦 Backendga yuborilayotgan ma'lumot:`, {
        totalFields: Object.keys(userEditedData).length,
        filledFields: filledFields.length,
        data: userEditedData
    });
    
    // Agar hamma maydon bo'sh bo'lsa, to'xtatish
    if (filledFields.length === 0) {
        const errorMsg = "❌ Xatolik: Ma'lumotlar yig'ilmadi. Inputlarni tekshiring!";
        alert(errorMsg);
        console.error("❌ No data entered - All fields are empty!");
        console.error("❌ Check if inputs are readonly/disabled or IDs don't match");
        
        // Debug: barcha inputlarni ko'rsatish
        const allInputs = modal.querySelectorAll('input, textarea, select');
        console.log(`🔍 Found ${allInputs.length} inputs in modal:`, 
            Array.from(allInputs).map(el => ({
                id: el.id,
                type: el.type || el.tagName,
                readOnly: el.readOnly,
                disabled: el.disabled,
                value: (el.value || '').substring(0, 20)
            }))
        );
        return;
    }
    
    // is_edited flag'ni aniqlash - foydalanuvchi biror maydonni o'zgartirganmi?
    let isEdited = false;
    
    // Barcha maydonlarni original ma'lumotlar bilan solishtirish
    const fieldMappings = {
        surname: ['surname', 'familiya'],
        given_name: ['given_name', 'given_names', 'ism'],
        passport_no: ['passport_number', 'passport_raqami'],
        date_of_birth: ['date_of_birth', 'tugilgan_sanasi'],
        date_of_issue: ['date_of_issue', 'berilgan_vaqti'],
        date_of_expiry: ['date_of_expiry', 'amal_qilish_muddati'],
        nationality: ['nationality', 'millati'],
        sex: ['sex', 'jinsi'],
        place_of_birth: ['place_of_birth', 'tugilgan_joyi'],
        authority: ['authority', 'kim_tomonidan_berilgan']
    };
    
    // Helper function: original qiymatni olish
    const getOriginalValue = (fieldAliases) => {
        for (const fieldAlias of fieldAliases) {
            if (originalFields[fieldAlias]) {
                if (typeof originalFields[fieldAlias] === 'object' && originalFields[fieldAlias].value !== undefined) {
                    return String(originalFields[fieldAlias].value || '').trim();
                } else if (typeof originalFields[fieldAlias] === 'string') {
                    return String(originalFields[fieldAlias] || '').trim();
                }
            }
        }
        return '';
    };
    
    // Har bir maydonni tekshirish
    for (const [userField, fieldAliases] of Object.entries(fieldMappings)) {
        const userValue = String(userEditedData[userField] || '').trim();
        const originalValue = getOriginalValue(fieldAliases);
        
        // Agar qiymatlar farq qilsa, edited deb belgilash
        if (userValue && userValue.toUpperCase() !== originalValue.toUpperCase()) {
            isEdited = true;
            console.log(`✅ Field changed: ${userField}`, {
                original: originalValue,
                edited: userValue
            });
            break;
        }
    }
    
    console.log("🔍 is_edited flag:", isEdited);
    
    // Updated data - mavjud extracted_data'ni saqlab qolish va faqat fields'ni yangilash
    const updatedFields = {
        ...originalFields,  // Mavjud fields'larni saqlab qolish
        // Yangilangan maydonlar
        surname: {
            value: userEditedData.surname || (originalFields.surname?.value || originalFields.familiya?.value || ''),
            confidence: userEditedData.surname ? 100.0 : (originalFields.surname?.confidence || originalFields.familiya?.confidence || 0)
        },
        familiya: {
            value: userEditedData.surname || (originalFields.familiya?.value || originalFields.surname?.value || ''),
            confidence: userEditedData.surname ? 100.0 : (originalFields.familiya?.confidence || originalFields.surname?.confidence || 0)
        },
        given_names: {
            value: userEditedData.given_name || (originalFields.given_names?.value || originalFields.ism?.value || ''),
            confidence: userEditedData.given_name ? 100.0 : (originalFields.given_names?.confidence || originalFields.ism?.confidence || 0)
        },
        ism: {
            value: userEditedData.given_name || (originalFields.ism?.value || originalFields.given_names?.value || ''),
            confidence: userEditedData.given_name ? 100.0 : (originalFields.ism?.confidence || originalFields.given_names?.confidence || 0)
        },
        passport_number: {
            value: userEditedData.passport_no || (originalFields.passport_number?.value || originalFields.passport_raqami?.value || ''),
            confidence: userEditedData.passport_no ? 100.0 : (originalFields.passport_number?.confidence || originalFields.passport_raqami?.confidence || 0)
        },
        passport_raqami: {
            value: userEditedData.passport_no || (originalFields.passport_raqami?.value || originalFields.passport_number?.value || ''),
            confidence: userEditedData.passport_no ? 100.0 : (originalFields.passport_raqami?.confidence || originalFields.passport_number?.confidence || 0)
        },
        date_of_birth: {
            value: userEditedData.date_of_birth || (originalFields.date_of_birth?.value || originalFields.tugilgan_sanasi?.value || ''),
            confidence: userEditedData.date_of_birth ? 100.0 : (originalFields.date_of_birth?.confidence || originalFields.tugilgan_sanasi?.confidence || 0)
        },
        tugilgan_sanasi: {
            value: userEditedData.date_of_birth || (originalFields.tugilgan_sanasi?.value || originalFields.date_of_birth?.value || ''),
            confidence: userEditedData.date_of_birth ? 100.0 : (originalFields.tugilgan_sanasi?.confidence || originalFields.date_of_birth?.confidence || 0)
        },
        date_of_issue: {
            value: userEditedData.date_of_issue || (originalFields.date_of_issue?.value || originalFields.berilgan_vaqti?.value || ''),
            confidence: userEditedData.date_of_issue ? 100.0 : (originalFields.date_of_issue?.confidence || originalFields.berilgan_vaqti?.confidence || 0)
        },
        berilgan_vaqti: {
            value: userEditedData.date_of_issue || (originalFields.berilgan_vaqti?.value || originalFields.date_of_issue?.value || ''),
            confidence: userEditedData.date_of_issue ? 100.0 : (originalFields.berilgan_vaqti?.confidence || originalFields.date_of_issue?.confidence || 0)
        },
        date_of_expiry: {
            value: userEditedData.date_of_expiry || (originalFields.date_of_expiry?.value || originalFields.amal_qilish_muddati?.value || ''),
            confidence: userEditedData.date_of_expiry ? 100.0 : (originalFields.date_of_expiry?.confidence || originalFields.amal_qilish_muddati?.confidence || 0)
        },
        amal_qilish_muddati: {
            value: userEditedData.date_of_expiry || (originalFields.amal_qilish_muddati?.value || originalFields.date_of_expiry?.value || ''),
            confidence: userEditedData.date_of_expiry ? 100.0 : (originalFields.amal_qilish_muddati?.confidence || originalFields.date_of_expiry?.confidence || 0)
        },
        nationality: {
            value: userEditedData.nationality || (originalFields.nationality?.value || originalFields.millati?.value || ''),
            confidence: userEditedData.nationality ? 100.0 : (originalFields.nationality?.confidence || originalFields.millati?.confidence || 0)
        },
        millati: {
            value: userEditedData.nationality || (originalFields.millati?.value || originalFields.nationality?.value || ''),
            confidence: userEditedData.nationality ? 100.0 : (originalFields.millati?.confidence || originalFields.nationality?.confidence || 0)
        },
        sex: {
            value: userEditedData.sex || (originalFields.sex?.value || originalFields.jinsi?.value || ''),
            confidence: userEditedData.sex ? 100.0 : (originalFields.sex?.confidence || originalFields.jinsi?.confidence || 0)
        },
        jinsi: {
            value: userEditedData.sex || (originalFields.jinsi?.value || originalFields.sex?.value || ''),
            confidence: userEditedData.sex ? 100.0 : (originalFields.jinsi?.confidence || originalFields.sex?.confidence || 0)
        },
        place_of_birth: {
            value: userEditedData.place_of_birth || (originalFields.place_of_birth?.value || originalFields.tugilgan_joyi?.value || ''),
            confidence: userEditedData.place_of_birth ? 100.0 : (originalFields.place_of_birth?.confidence || originalFields.tugilgan_joyi?.confidence || 0)
        },
        tugilgan_joyi: {
            value: userEditedData.place_of_birth || (originalFields.tugilgan_joyi?.value || originalFields.place_of_birth?.value || ''),
            confidence: userEditedData.place_of_birth ? 100.0 : (originalFields.tugilgan_joyi?.confidence || originalFields.place_of_birth?.confidence || 0)
        },
        authority: {
            value: userEditedData.authority || (originalFields.authority?.value || originalFields.kim_tomonidan_berilgan?.value || ''),
            confidence: userEditedData.authority ? 100.0 : (originalFields.authority?.confidence || originalFields.kim_tomonidan_berilgan?.confidence || 0)
        },
        kim_tomonidan_berilgan: {
            value: userEditedData.authority || (originalFields.kim_tomonidan_berilgan?.value || originalFields.authority?.value || ''),
            confidence: userEditedData.authority ? 100.0 : (originalFields.kim_tomonidan_berilgan?.confidence || originalFields.authority?.confidence || 0)
        }
    };
    
    // Mavjud extracted_data'ni saqlab qolish va faqat fields'ni yangilash
    const extractedDataForBackend = {
        ...existingExtractedData,  // Mavjud barcha ma'lumotlarni saqlash (passport, simplified, normalized, va boshqalar)
        fields: updatedFields  // Faqat fields'ni yangilash
    };
    
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        
        // apiCall yordamchi funksiyangizdan foydalanamiz (Clean Code standartida)
        const response = await apiCall(`/ocr/documents/${docId}?user_role=${userRole}`, {
            method: 'PATCH', // Backend PATCH kutadi
            body: JSON.stringify({
                extracted_data: extractedDataForBackend,
                user_edited_data: userEditedData,
                is_edited: isEdited
            })
        });
        
        console.log("✅ Backend response received:", response);
        console.log("✅ Data saved successfully!");
        
        // Modal'ni yopish
        closeEditPassportModal();
        
        // Success message
        alert("✅ Ma'lumotlar muvaffaqiyatli saqlandi!");
        
        // ID'ni tozalash
        currentEditingDocumentId = null;
        
        // Kichik kutish - modal to'liq yopilishini kutish
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Documents sahifasiga o'tish (showPage ichida loadDocuments() avtomatik chaqiriladi)
        showPage('documents');
        
        // Qo'shimcha tekshirish - agar sahifa ko'rinmasa, qayta urinish
        setTimeout(() => {
            const documentsPage = document.getElementById('documentsPage');
            if (documentsPage && !documentsPage.classList.contains('active')) {
                console.log('⚠️ Documents page not active, retrying...');
                showPage('documents');
            }
        }, 100);
        
    } catch (error) {
        console.error("❌ Saqlashda xato yuz berdi:", error);
        const errorMessage = error.message || 'Noma\'lum xatolik';
        
        if (errorDiv) {
            errorDiv.textContent = `❌ Xatolik: ${errorMessage}`;
            errorDiv.style.display = 'block';
            errorDiv.style.color = '#ef4444';
            errorDiv.style.backgroundColor = '#fee';
            errorDiv.style.padding = '12px';
            errorDiv.style.borderRadius = '8px';
            errorDiv.style.marginTop = '15px';
        } else {
            alert(`❌ Xatolik: ${errorMessage}`);
        }
        
        // Error details console'da
        console.error("❌ Error details:", {
            message: error.message,
            stack: error.stack,
            documentId: docId
        });
    }
}

// ==================== DELETE DOCUMENT ====================

// Hujjat yaratilganidan 4 soat o'tmaganmi tekshirish (oddiy user faqat shu vaqt ichida o'chira oladi)
// Parametr sifatida string (ISO sana) yoki millisekundlarda number kelishi mumkin.
function isWithin4Hours(createdAt) {
    if (!createdAt && createdAt !== 0) return false;
    var created = typeof createdAt === 'number' ? createdAt : new Date(createdAt).getTime();
    if (!created || isNaN(created)) return false;
    var now = Date.now();
    return (now - created) <= 4 * 60 * 60 * 1000;
}

// Global scope'ga qo'shish (onclick event'lar uchun). createdAtMsOptional – oddiy user uchun 4 soat tekshiruvi (millisekundlarda)
window.deleteDocument = async function(documentId, createdAtMsOptional) {
    var userRole = localStorage.getItem('user_role') || 'user';
    // Oddiy user: 4 soatdan oshgan hujjatni o'chirishga ruxsat yo'q
    if (userRole !== 'admin') {
        if (!createdAtMsOptional || !isWithin4Hours(createdAtMsOptional)) {
            var msg = typeof t === 'function' ? t('deleteNotAllowedAfter4Hours') : 'Hujjatni faqat yaratilganidan keyin 4 soat ichida o\'chirish mumkin.';
            alert(msg);
            return;
        }
    }
    // Tasdiqlash
    if (!confirm('정말로 이 문서를 삭제하시겠습니까? (Bu hujjatni o\'chirishni tasdiqlaysizmi?)\n\n참고: 문서는 관리자에게 여전히 표시됩니다.')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        
        // Soft delete - faqat user uchun yashirish, admin'da ko'rinadi
        const response = await fetch(`${API_BASE_URL}/ocr/documents/${documentId}?user_role=${userRole}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '삭제 오류');
        }
        
        // Muvaffaqiyatli o'chirildi (user uchun yashirildi)
        alert('문서가 성공적으로 삭제되었습니다! (관리자에게는 여전히 표시됩니다)');
        
        // Documents sahifasiga qaytish
        showPage('documents');
        loadDocuments();
        
    } catch (error) {
        console.error('삭제 오류:', error);
        alert('삭제 중 오류가 발생했습니다: ' + error.message);
    }
};

// ==================== EDIT DOCUMENT (Boshqa turlar uchun) ====================

// Global scope'ga qo'shish (onclick event'lar uchun)
window.openEditDocumentModal = function(documentId) {
    // Hozircha faqat passport uchun edit modal mavjud
    // Boshqa turlar uchun ham qo'shish mumkin
    alert('이 문서 유형의 편집 기능은 아직 개발 중입니다.');
};

// ==================== UPLOAD ====================

async function handleUpload(e) {
    e.preventDefault();
    
    // Hujjat skaner qilish uchun ro'yxatdan o'tish kerak
    if (!localStorage.getItem('token')) {
        const msg = typeof t === 'function' ? t('pleaseSignUpToScan') : 'Hujjat skaner qilish uchun ro\'yxatdan o\'ting. / Please sign up to scan documents.';
        alert(msg);
        showLoginScreen();
        return;
    }
    
    const fileInput = document.getElementById('fileInput');
    const fileType = document.getElementById('fileType').value;
    const language = document.getElementById('language').value;
    const errorDiv = document.getElementById('uploadError');
    const uploadBtn = document.getElementById('uploadBtn');
    
    if (!fileInput.files[0]) {
        errorDiv.textContent = '파일을 선택하세요!';
        errorDiv.style.display = 'block';
        return;
    }
    
    errorDiv.style.display = 'none';
    uploadBtn.disabled = true;
    uploadBtn.textContent = '업로드 중...';
    
    try {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        
        const userRole = localStorage.getItem('user_role') || 'user';
        
        const response = await fetch(
            `${API_BASE_URL}/ocr/upload?file_type=${fileType}&language=${language}&user_role=${userRole}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '업로드 오류');
        }
        
        const data = await response.json();
        
        // Muvaffaqiyatli yuklandi
        alert('문서가 성공적으로 업로드되었습니다! 문서가 관리자에게 전송되었습니다.');
        fileInput.value = '';
        
        // Documents sahifasiga o'tish va yangilash
        showPage('documents');
        loadDocuments();
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = '업로드';
    }
}

// ==================== SERVICES ====================

function handleServiceClick(service) {
    console.log('Service clicked:', service);
    switch(service) {
        case 'documents':
            showPage('documents');
            loadDocuments();
            break;
        case 'branch':
            showPage('branch');
            break;
        case 'forms':
            showPage('forms');
            break;
        case 'calculator':
            showPage('calculator');
            break;
        case 'guide':
            showPage('guide');
            break;
        case 'webfax':
            showPage('webfax');
            break;
        case 'statistics':
            showPage('statistics');
            loadStatistics();
            break;
        case 'chat':
            showPage('chat');
            break;
        default:
            console.log('Unknown service:', service);
    }
}

// Shakl topish: PDF yuklash (minimal placeholder PDF – keyinchalik haqiqiy fayllar qo‘yilishi mumkin)
function getMinimalPdfBase64() {
    var raw = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF';
    return btoa(raw);
}

function downloadFormPdf(formIndex, filename) {
    try {
        var base64 = getMinimalPdfBase64();
        var binary = atob(base64);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        var blob = new Blob([bytes], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename || 'form.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('PDF download error:', err);
        if (typeof alert === 'function') alert(typeof t === 'function' ? t('error') : 'Error');
    }
}

// Pensiya kalkulyatori: yosh + oylik to'lov -> taxminiy pensiya
function handleCalculator() {
    const age = parseInt(document.getElementById('calcAge')?.value, 10);
    const monthlyPayment = parseFloat(document.getElementById('calcMonthly')?.value);
    
    if (!age || age < 18 || age > 100) {
        alert('나이를 입력하세요 (18–100). / Yoshni kiriting (18–100).');
        return;
    }
    if (!monthlyPayment || monthlyPayment < 0) {
        alert('월 납부액을 입력하세요. / Pensiya uchun oylik badal summasini kiriting.');
        return;
    }
    
    // Soddalashtirilgan formula: pensiya yoshi 63, to'lovlar 63 gacha, pensiya 20 yil davomida
    const PENSION_AGE = 63;
    const PENSION_YEARS = 20;
    const yearsLeft = Math.max(0, PENSION_AGE - age);
    const totalAccumulated = monthlyPayment * 12 * yearsLeft;
    const monthlyPension = yearsLeft > 0 ? totalAccumulated / (PENSION_YEARS * 12) : 0;
    
    const resultDiv = document.getElementById('calcResult');
    const resultValue = document.getElementById('calcResultValue');
    const resultNote = document.getElementById('calcResultNote');
    
    if (resultDiv && resultValue) {
        resultValue.textContent = '월 ~' + Math.round(monthlyPension).toLocaleString() + ' / oy';
        if (resultNote) {
            resultNote.innerHTML = '한국어: 연금나이 63세, ' + yearsLeft + '년 납부, ' + PENSION_YEARS + '년 수령 (예상).<br>O\'zbek: Pensiya yoshi 63, to\'lovlar ' + yearsLeft + ' yil, pensiya ' + PENSION_YEARS + ' yil davomida (taxminiy).';
        }
        resultDiv.style.display = 'block';
    }
}

// Kalit-so‘z javob + haqiqiy AI uchun eslatma
var AI_CHAT_HINT = ' Haqiqiy AI (Gemini/Groq) uchun config.js da GEMINI_API_KEY yoki GROQ_API_KEY kiriting.';

function getKeywordReply(message) {
    var lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'ko';
    var t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : (typeof translations !== 'undefined' ? translations.ko : {});
    var lower = (message || '').toLowerCase().trim();
    var reply = t.chatBotHint || t.chatBotPreparing || 'Try: help, documents, pension, branch, form';
    if (/hello|hi|salom|привет|안녕|你好|xin chào|สวัสดี/i.test(lower) && !/website|sayt|haqida|bilmoqchi|about/.test(lower)) {
        reply = t.chatWelcome || 'Hello!';
    } else if (/help|yordam|помощь|도움|帮助|giúp|ช่วย/i.test(lower)) {
        reply = t.chatBotHelp || 'See the top menu for services.';
    } else if (/document|hujjat|문서|документ|เอกสาร|tài liệu|文档/i.test(lower)) {
        reply = t.chatBotDocsHint || 'Open the Documents menu above.';
    } else if (/website|sayt|haqida|bilmoqchi|about|know.*about|사이트|웹사이트|网站|сайт/i.test(lower)) {
        reply = t.chatBotWhatIsThis || 'This is the AI-OCR service. Ask about documents, pension, branch, form.';
    } else if (/nima|what|bu nima|qanday|what is this|это что|这是|이건|gì vậy|นี่คืออะไร/i.test(lower)) {
        reply = t.chatBotWhatIsThis || 'This chat is for AI-OCR services. Type "help" for a short guide.';
    } else if (/pension|pensiya|연금|пенси|养老金|lương hưu|บำนาญ|filial|branch|филиал|지사|分支|chi nhánh|สาขา|shakl|form|서식|форма|แบบฟอร์ม|表格/i.test(lower)) {
        reply = t.chatBotHelp || 'See the top menu for services.';
    }
    return reply;
}

function getAIReply(message) {
    var geminiKey = (typeof CONFIG !== 'undefined' && CONFIG.GEMINI_API_KEY) ? CONFIG.GEMINI_API_KEY : (typeof window !== 'undefined' && window.GEMINI_API_KEY) ? window.GEMINI_API_KEY : '';
    var groqKey = (typeof CONFIG !== 'undefined' && CONFIG.GROQ_API_KEY) ? CONFIG.GROQ_API_KEY : (typeof window !== 'undefined' && window.GROQ_API_KEY) ? window.GROQ_API_KEY : '';

    function callGroq(msg) {
        if (!groqKey) return Promise.resolve((typeof t !== 'undefined' && t.chatBotOverloaded) ? t.chatBotOverloaded : 'AI modeli hozir band. Bir ozdan keyin qayta urinib ko\'ring.');
        return fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + groqKey },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'You are a helpful AI assistant for the AI-OCR system (document OCR, pension calculator, NPS branch finder, forms). Answer briefly in the same language as the user.' },
                    { role: 'user', content: msg }
                ],
                model: 'llama-3.1-8b-instant',
                temperature: 0.7,
                max_tokens: 500
            })
        })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                var text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
                if (text) return text.trim();
                throw new Error('No text in Groq response');
            })
            .catch(function(err) {
                console.warn('Groq API error:', err);
                return 'AI javob bermadi. Brauzer Konsol (F12) da xatolikni ko\'ring. Sahifani file:// emas, http:// orqali oching.';
            });
    }

    // 1) Gemini API (Google) – 429/503 bo‘lsa Groq ga o‘tadi
    if (geminiKey) {
        var systemPrompt = 'You are a helpful AI assistant for the AI-OCR system. The system offers: document upload and OCR, pension calculator, NPS (National Pension Service) branch finder in Korea, forms (passport, pension, ID). Answer briefly and in the same language the user writes.';
        return fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(geminiKey), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\nUser: ' + message }] }],
                generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
            })
        })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.error) {
                    console.warn('Gemini API error:', data.error);
                    var code = data.error.code;
                    var status = (data.error.status || '').toUpperCase();
                    var msgText = data.error.message || '';
                    var isOverloaded = code === 503 || status === 'UNAVAILABLE' || msgText.indexOf('overloaded') !== -1;
                    var isQuota = code === 429 || status === 'RESOURCE_EXHAUSTED' || msgText.indexOf('quota') !== -1;
                    if ((isOverloaded || isQuota) && groqKey) {
                        return callGroq(message);
                    }
                    if (isOverloaded || isQuota) {
                        return (typeof t !== 'undefined' && t.chatBotOverloaded) ? t.chatBotOverloaded : 'AI modeli hozir band. Bir ozdan keyin qayta urinib ko\'ring.';
                    }
                    throw new Error(msgText || 'Gemini error');
                }
                var parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
                var text = parts && parts[0] && parts[0].text;
                if (text) return text.trim();
                throw new Error('No text in Gemini response');
            })
            .catch(function(err) {
                console.warn('Gemini API error:', err);
                var errMsg = err && err.message ? err.message : '';
                var overloadedOrQuota = errMsg.indexOf('overloaded') !== -1 || errMsg.indexOf('503') !== -1 || errMsg.indexOf('quota') !== -1 || errMsg.indexOf('429') !== -1;
                if (overloadedOrQuota && groqKey) {
                    return callGroq(message);
                }
                if (overloadedOrQuota) {
                    return (typeof t !== 'undefined' && t.chatBotOverloaded) ? t.chatBotOverloaded : 'AI modeli hozir band. Bir ozdan keyin qayta urinib ko\'ring.';
                }
                return 'AI javob bermadi. Brauzer Konsol (F12) da xatolikni ko\'ring. Agar sahifani file:// ochgan bo\'lsangiz, lokal serverdan oching (masalan: Live Server yoki npx serve).';
            });
    }

    // 2) Groq API (Locohub dagi kabi – bepul, tez)
    if (groqKey) {
        return callGroq(message);
    }

    // 3) API kaliti yo‘q – kalit-so‘z javob + eslatma
    return Promise.resolve(getKeywordReply(message) + AI_CHAT_HINT);
}

function handleChatSend() {
    var chatInput = document.getElementById('chatInput');
    var chatMessages = document.getElementById('chatMessages');
    if (!chatInput || !chatMessages) return;
    var message = chatInput.value.trim();
    if (!message) return;
    var userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML = '<p>' + message.replace(/</g, '&lt;') + '</p>';
    chatMessages.appendChild(userMsg);
    chatInput.value = '';
    var loadingMsg = document.createElement('div');
    loadingMsg.className = 'chat-message bot';
    loadingMsg.innerHTML = '<p class="chat-loading">Javob yozilmoqda...</p>';
    chatMessages.appendChild(loadingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    getAIReply(message).then(function(reply) {
        loadingMsg.remove();
        var botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot';
        botMsg.innerHTML = '<p>' + reply.replace(/</g, '&lt;') + '</p>';
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// Locohub-uslubidagi float AI Chat: ochish/yopish va yuborish
function initAIChatFloat() {
    var wrap = document.querySelector('.aichat-btn-gradient-wrap');
    var btn = document.getElementById('aiChatFloatBtn');
    var frame = document.getElementById('aiChatFrame');
    var icon = document.getElementById('aiChatBtnIcon');
    var content = document.getElementById('aiChatContent');
    var main = document.getElementById('aiChatMessages');
    var input = document.getElementById('aiChatInput');
    var sendBtn = document.getElementById('aiChatSendBtn');
    if (!btn || !frame || !main || !input || !sendBtn) return;
    var toggleChat = function(e) {
        e.preventDefault();
        e.stopPropagation();
        frame.classList.toggle('open');
        if (icon) icon.textContent = frame.classList.contains('open') ? '×' : '✦';
    };
    if (wrap) wrap.addEventListener('click', toggleChat);
    else btn.addEventListener('click', toggleChat);
    function sendFloatMessage() {
        var text = input.value.trim();
        if (!text) return;
        input.value = '';
        var userRow = document.createElement('div');
        userRow.className = 'msg-row user';
        userRow.innerHTML = '<div class="msg-right">' + text.replace(/</g, '&lt;') + '</div>';
        main.appendChild(userRow);
        content.scrollTop = content.scrollHeight;
        var loadingRow = document.createElement('div');
        loadingRow.className = 'msg-row';
        loadingRow.innerHTML = '<div class="msg-left msg-loading">Javob yozilmoqda...</div>';
        main.appendChild(loadingRow);
        content.scrollTop = content.scrollHeight;
        getAIReply(text).then(function(reply) {
            loadingRow.remove();
            var botRow = document.createElement('div');
            botRow.className = 'msg-row';
            botRow.innerHTML = '<div class="msg-left">' + reply.replace(/</g, '&lt;') + '</div>';
            main.appendChild(botRow);
            content.scrollTop = content.scrollHeight;
        });
    }
    sendBtn.addEventListener('click', sendFloatMessage);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); sendFloatMessage(); }
    });
}

async function loadStatistics() {
    var chartDiv = document.getElementById('statisticsChart');
    if (!chartDiv) return;
    var lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'ko';
    var t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : (typeof translations !== 'undefined' ? translations.ko : {});
    var statsTitle = t.statsTitle || 'Document statistics';
    var statsTotalDocs = t.statsTotalDocs || 'Total';
    var statsCompleted = t.statsCompleted || 'Completed';
    var statsProcessing = t.statsProcessing || 'Processing';
    var statsNoData = t.statsNoData || 'Unable to load data.';
    try {
        var userRole = localStorage.getItem('user_role') || 'user';
        var documents = await apiCall('/ocr/documents?skip=0&limit=100&user_role=' + userRole);
        var totalDocs = documents.length;
        var completedDocs = documents.filter(function(d) { return d.status === 'completed'; }).length;
        var processingDocs = documents.filter(function(d) { return d.status === 'processing'; }).length;
        chartDiv.innerHTML = '<div class="stats-inner"><h3>' + statsTitle + '</h3><p>' + statsTotalDocs + ': ' + totalDocs + '</p><p>' + statsCompleted + ': ' + completedDocs + '</p><p>' + statsProcessing + ': ' + processingDocs + '</p></div>';
    } catch (error) {
        console.error('Statistics yuklash xatosi:', error);
        chartDiv.innerHTML = '<div class="stats-inner"><h3>' + statsTitle + '</h3><p>' + statsNoData + '</p></div>';
    }
}

function loadWebfax() {
    var listEl = document.querySelector('#webfaxPage .webfax-list');
    if (!listEl) return;
    var lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'ko';
    var t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : (typeof translations !== 'undefined' ? translations.ko : {});
    var docLabel = t.webfaxDocLabel || 'Document';
    var processed = t.webfaxProcessed || 'Processed';
    var demoList = [
        { date: '2026-01-23', num: 1, status: processed },
        { date: '2026-01-22', num: 2, status: processed },
        { date: '2026-01-20', num: 3, status: processed }
    ];
    listEl.innerHTML = demoList.map(function(item) {
        return '<div class="webfax-item"><span>' + item.date + '</span><span>' + docLabel + ' #' + item.num + '</span><span>' + item.status + '</span></div>';
    }).join('');
}

// ==================== MY PAGE (Profile + Documents) ====================

function renderMypageProfileView() {
    const profileView = document.getElementById('mypageProfileView');
    const documentsView = document.getElementById('mypageDocumentsView');
    if (profileView) profileView.style.display = 'block';
    if (documentsView) documentsView.style.display = 'none';
    document.querySelectorAll('.mypage-nav-item[data-mypage]').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-mypage') === 'profile');
    });
    // Profile form values from localStorage
    const username = localStorage.getItem('username') || '';
    const phone = localStorage.getItem('mypage_phone') || localStorage.getItem('phone') || '';
    const address = localStorage.getItem('mypage_address') || '';
    const unEl = document.getElementById('mypageUsername');
    const phEl = document.getElementById('mypagePhone');
    const adEl = document.getElementById('mypageAddress');
    if (unEl) unEl.value = username;
    if (phEl) phEl.value = phone;
    if (adEl) adEl.value = address;
    applyMypageTranslations();
}

function applyMypageTranslations() {
    if (typeof t !== 'function') return;
    document.querySelectorAll('#adminPage [data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if (k) el.textContent = t(k);
    });
}

async function renderMypageDocumentsView() {
    const profileView = document.getElementById('mypageProfileView');
    const documentsView = document.getElementById('mypageDocumentsView');
    const filtersDiv = document.getElementById('adminFiltersDiv');
    const headerH2 = document.getElementById('adminSectionHeaderH2');
    if (profileView) profileView.style.display = 'none';
    if (documentsView) documentsView.style.display = 'block';
    document.querySelectorAll('.mypage-sidebar-nav .mypage-nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector('.mypage-nav-item[data-mypage="documents"]')?.classList.add('active');
    const userRole = localStorage.getItem('user_role') || 'user';
    if (headerH2) headerH2.textContent = typeof t === 'function' ? t('documentsTitle') : 'Documents';
    if (filtersDiv) filtersDiv.style.display = userRole === 'admin' ? 'flex' : 'none';
    if (userRole === 'admin') await loadAdminDocuments();
    else await loadUserMyPageDocuments();
}

function applyMypageAvatar() {
    var dataUrl = localStorage.getItem('mypage_avatar');
    var ids = ['mypageProfileAvatar', 'mypageSidebarAvatar'];
    ids.forEach(function(id) {
        var img = document.getElementById(id);
        if (!img) return;
        var placeholder = img.nextElementSibling;
        if (placeholder && placeholder.classList && placeholder.classList.contains) {
            if (dataUrl) {
                img.src = dataUrl;
                img.style.display = '';
                placeholder.classList.remove('show');
            } else {
                img.removeAttribute('src');
                img.style.display = 'none';
                placeholder.classList.add('show');
            }
        } else {
            if (dataUrl) { img.src = dataUrl; img.style.display = ''; }
            else { img.removeAttribute('src'); img.style.display = 'none'; }
        }
    });
}

function setupMypageSidebar() {
    const username = localStorage.getItem('username') || 'User';
    const phone = localStorage.getItem('mypage_phone') || localStorage.getItem('phone') || '';
    const role = (localStorage.getItem('user_role') || 'user').toUpperCase();
    const initial = username.charAt(0).toUpperCase();
    const nameEl = document.getElementById('mypageSidebarName');
    const phoneEl = document.getElementById('mypageSidebarPhone');
    const roleEl = document.getElementById('mypageSidebarRole');
    const initSide = document.getElementById('mypageSidebarInitial');
    const initProfile = document.getElementById('mypageProfileInitial');
    if (nameEl) nameEl.textContent = username;
    if (phoneEl) phoneEl.textContent = phone || '—';
    if (roleEl) roleEl.textContent = role; /* ADMIN, AGENT, USER */
    if (initSide) initSide.textContent = initial;
    if (initProfile) initProfile.textContent = initial;
    applyMypageAvatar();
    const navTexts = document.querySelectorAll('.mypage-sidebar-nav .mypage-nav-item .mypage-nav-text');
    const labels = [
        typeof t === 'function' ? t('myProfile') : 'My Profile',
        typeof t === 'function' ? t('logout') : 'Logout'
    ];
    navTexts.forEach((el, i) => { if (labels[i]) el.textContent = labels[i]; });
    const logoutBtn = document.getElementById('mypageLogout');
    if (logoutBtn) {
        logoutBtn.onclick = (e) => { e.preventDefault(); handleLogout(); };
    }
    document.querySelectorAll('.mypage-nav-item[data-mypage]').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-mypage');
            if (page === 'profile') renderMypageProfileView();
            else if (page === 'documents' || page === 'favorites') renderMypageDocumentsView();
        };
    });
    // Float AI Chat – initAIChatFloat() barcha sahifalarda DOMContentLoaded da chaqiriladi
    const updateBtn = document.getElementById('mypageUpdateBtn');
    if (updateBtn) {
        updateBtn.onclick = () => {
            const unEl = document.getElementById('mypageUsername');
            const phEl = document.getElementById('mypagePhone');
            const adEl = document.getElementById('mypageAddress');
            if (unEl) localStorage.setItem('username', unEl.value.trim());
            if (phEl) localStorage.setItem('mypage_phone', phEl.value.trim());
            if (adEl) localStorage.setItem('mypage_address', adEl.value.trim());
            setupMypageSidebar();
            alert(typeof t === 'function' ? t('success') : 'Saved');
        };
    }
    var uploadPhotoBtn = document.getElementById('mypageUploadPhotoBtn');
    var photoInput = document.getElementById('mypagePhotoInput');
    if (uploadPhotoBtn && photoInput) {
        uploadPhotoBtn.onclick = function() { photoInput.click(); };
        photoInput.onchange = function() {
            var file = photoInput.files && photoInput.files[0];
            if (!file) return;
            var ok = /^image\/(jpeg|jpg|png|webp)$/i.test(file.type);
            if (!ok) {
                alert(typeof t === 'function' ? t('photoHint') : 'Rasm JPG, JPEG, PNG yoki WebP formatida bo\'lishi kerak!');
                photoInput.value = '';
                return;
            }
            var reader = new FileReader();
            reader.onload = function() {
                try {
                    localStorage.setItem('mypage_avatar', reader.result);
                    applyMypageAvatar();
                    alert(typeof t === 'function' ? t('success') : 'Saved');
                } catch (e) {
                    console.error('Avatar saqlash xatosi:', e);
                    alert('Rasm juda katta yoki saqlashda xato.');
                }
            };
            reader.readAsDataURL(file);
            photoInput.value = '';
        };
    }
}

async function loadAdminPanel() {
    try {
        setupMypageSidebar();
        renderMypageProfileView();
        applyMypageTranslations();
    } catch (error) {
        console.error('My Page yuklash xatosi:', error);
    }
}

// Oddiy user uchun My Page – o‘z hujjatlarini ro‘yxati
async function loadUserMyPageDocuments() {
    const adminList = document.getElementById('adminDocumentsList');
    if (!adminList) return;
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        const documents = await apiCall(`/ocr/documents?skip=0&limit=100&user_role=${userRole}`);
        const docViewText = typeof t === 'function' ? t('docView') : 'View';
        
        if (documents.length === 0) {
            adminList.innerHTML = '<div class="empty-state">' + (typeof t === 'function' ? t('docNotFound') : 'No documents') + '</div>';
            return;
        }
        
        const sorted = [...documents].sort((a, b) => {
            if (a.created_at && b.created_at) return new Date(b.created_at) - new Date(a.created_at);
            return (b.id || 0) - (a.id || 0);
        });
        
        adminList.innerHTML = sorted.map((doc, index) => {
            const status = doc.status || (doc.extracted_data?.metadata?.verified ? 'verified' : 'pending');
            const statusCls = status === 'verified' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending';
            const date = doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '';
            const displayNum = index + 1;
            return `
                <div class="admin-document-card ${statusCls}" onclick="viewDocument(${doc.id})" style="cursor: pointer;">
                    <div class="admin-doc-header">
                        <span class="admin-doc-id">#${displayNum}</span>
                        <span class="admin-doc-status status-${statusCls}">${status}</span>
                    </div>
                    <div class="admin-doc-info">
                        <p><strong>${doc.file_type || 'N/A'}</strong> · ${date}</p>
                    </div>
                    <button type="button" class="btn-small" onclick="event.stopPropagation(); viewDocument(${doc.id})">${docViewText}</button>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('User documents yuklash xatosi:', err);
        adminList.innerHTML = '<div class="error">' + (err.message || 'Error') + '</div>';
    }
}

// Admin document'larni yuklash
async function loadAdminDocuments(filter = 'all') {
    try {
        const userRole = localStorage.getItem('user_role') || 'admin';
        const documents = await apiCall(`/ocr/documents?skip=0&limit=100&user_role=${userRole}`);
        
        const adminList = document.getElementById('adminDocumentsList');
        if (!adminList) return;
        
        if (documents.length === 0) {
            adminList.innerHTML = '<div class="empty-state">대기 중인 문서가 없습니다</div>';
            return;
        }
        
        // Filter qo'llash va metadata'larni olish
        let filteredDocs = documents.map(doc => {
            // Metadata'dan ma'lumotlarni olish
            const metadata = doc.extracted_data?.metadata || {};
            doc.user_edited_data = metadata.user_edited_data || {};
            doc.is_edited = metadata.is_edited || false;
            // Verified status - metadata'dan yoki document status'dan
        doc.verified = metadata.verified || false || (doc.status === 'verified');
            doc.rejected = metadata.rejected || false;
            doc.reprocess_count = metadata.reprocess_count || 0;
            doc.edit_count = metadata.edit_count || 0;
            return doc;
        });
        
        if (filter === 'pending') {
            filteredDocs = filteredDocs.filter(doc => !doc.verified && !doc.rejected);
        } else if (filter === 'approved') {
            filteredDocs = filteredDocs.filter(doc => doc.verified);
        } else if (filter === 'rejected') {
            filteredDocs = filteredDocs.filter(doc => doc.rejected);
        }
        
        // Document'larni yangi birinchi tartibda
        const sortedDocs = [...filteredDocs].sort((a, b) => {
            if (a.created_at && b.created_at) {
                return new Date(b.created_at) - new Date(a.created_at);
            }
            return (b.id || 0) - (a.id || 0);
        });
        
        adminList.innerHTML = sortedDocs.map(doc => {
            const statusClass = doc.verified ? 'approved' : doc.rejected ? 'rejected' : 'pending';
            const statusText = doc.verified ? '승인됨' : doc.rejected ? '거부됨' : '대기 중';
            const createdBy = doc.created_by_username || 'Unknown';
            const createdDate = new Date(doc.created_at).toLocaleDateString('ko-KR');
            
            return `
                <div class="admin-document-card ${statusClass}" onclick="viewAdminDocument(${doc.id})">
                    <div class="admin-doc-header">
                        <span class="admin-doc-id">문서 #${doc.id}</span>
                        <span class="admin-doc-status status-${statusClass}">${statusText}</span>
                    </div>
                    <div class="admin-doc-info">
                        <p><strong>유형:</strong> ${doc.file_type || 'N/A'}</p>
                        <p><strong>사용자:</strong> ${createdBy}</p>
                        <p><strong>생성일:</strong> ${createdDate}</p>
                        <p><strong>신뢰도:</strong> ${doc.confidence || 0}%</p>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Admin documents yuklash xatosi:', error);
        const adminList = document.getElementById('adminDocumentsList');
        if (adminList) {
            adminList.innerHTML = `<div class="error">오류: ${error.message}</div>`;
        }
    }
}

// Admin Scanner: 10 dastlab, 30 gacha kengaytirish, pagination. Saqlangan ro'yxat.
var adminScannerFullList = [];
var adminScannerViewState = 'initial'; // initial | expanded | pagination
var adminScannerPage = 1;
var ADMIN_SCANNER_INITIAL = 8;
var adminSubscribersFullList = [];
var adminSubscribersViewState = 'initial';
var ADMIN_SUBSCRIBERS_INITIAL = 8;
var ADMIN_SCANNER_EXPANDED = 30;
var ADMIN_SCANNER_PAGE_SIZE = 30;

function renderAdminScannerRows(docs, startIdx, count) {
    var statusText = function (doc) {
        var meta = doc.extracted_data && doc.extracted_data.metadata ? doc.extracted_data.metadata : {};
        if (meta.verified) return typeof t === 'function' ? t('statusApproved') || 'Tasdiqlangan' : 'Tasdiqlangan';
        if (meta.rejected) return typeof t === 'function' ? t('statusRejected') || 'Rad etilgan' : 'Rad etilgan';
        return typeof t === 'function' ? t('statusPending') || 'Kutilmoqda' : 'Kutilmoqda';
    };
    var viewLabel = typeof t === 'function' ? t('docView') || 'Ko\'rish' : 'Ko\'rish';
    var slice = docs.slice(startIdx, startIdx + count);
    return slice.map(function (doc) {
        var createdBy = doc.created_by_username || '-';
        var createdDate = doc.created_at ? new Date(doc.created_at).toLocaleString() : '-';
        var status = statusText(doc);
        return '<tr><td>' + (doc.id || '-') + '</td><td>' + escapeHtml(doc.file_type || '-') + '</td><td>' + escapeHtml(createdBy) + '</td><td>' + escapeHtml(status) + '</td><td>' + escapeHtml(createdDate) + '</td><td><a href="#" onclick="viewAdminDocument(' + doc.id + '); return false;">' + viewLabel + '</a></td></tr>';
    }).join('');
}

function updateAdminScannerView(filteredList) {
    var scannerTbody = document.getElementById('adminScannerList');
    var controlsEl = document.getElementById('adminScannerControls');
    var showMoreBtn = document.getElementById('adminScannerShowMore');
    var paginationEl = document.getElementById('adminScannerPagination');
    var tableWrap = document.querySelector('.admin-scanner-table-wrap');
    var emptyScanner = typeof t === 'function' ? t('adminScannerEmpty') : 'Skaner hujjatlar yo\'q';
    var showMoreLabel = typeof t === 'function' ? t('adminShowMore') : 'Show more';
    var prevLabel = typeof t === 'function' ? t('adminPrev') : 'Oldingi';
    var nextLabel = typeof t === 'function' ? t('adminNext') : 'Keyingi';

    if (!scannerTbody) return;
    var total = filteredList.length;

    if (total === 0) {
        scannerTbody.innerHTML = '<tr><td colspan="6" class="empty">' + emptyScanner + '</td></tr>';
        if (controlsEl) controlsEl.style.display = 'none';
        return;
    }

    var start = 0, count = total;
    if (adminScannerViewState === 'initial') {
        count = Math.min(ADMIN_SCANNER_INITIAL, total);
    } else if (adminScannerViewState === 'expanded') {
        count = Math.min(ADMIN_SCANNER_EXPANDED, total);
    } else {
        start = (adminScannerPage - 1) * ADMIN_SCANNER_PAGE_SIZE;
        count = Math.min(ADMIN_SCANNER_PAGE_SIZE, total - start);
    }

    scannerTbody.innerHTML = renderAdminScannerRows(filteredList, start, count);

    if (controlsEl) {
        controlsEl.style.display = 'flex';
        if (showMoreBtn) {
            if (adminScannerViewState === 'initial' && total > ADMIN_SCANNER_INITIAL) {
                showMoreBtn.style.display = 'inline-block';
                showMoreBtn.textContent = showMoreLabel;
                showMoreBtn.title = showMoreLabel;
            } else {
                showMoreBtn.style.display = 'none';
            }
        }
        if (tableWrap) {
            tableWrap.classList.remove('expanded');
            if (adminScannerViewState === 'expanded' || adminScannerViewState === 'pagination') tableWrap.classList.add('expanded');
        }
        if (paginationEl) {
            if (adminScannerViewState === 'pagination' && total > ADMIN_SCANNER_EXPANDED) {
                paginationEl.style.display = 'flex';
                var totalPages = Math.ceil(total / ADMIN_SCANNER_PAGE_SIZE);
                var from = (adminScannerPage - 1) * ADMIN_SCANNER_PAGE_SIZE + 1;
                var to = Math.min(adminScannerPage * ADMIN_SCANNER_PAGE_SIZE, total);
                paginationEl.innerHTML = '<span class="pagination-info">' + from + '-' + to + ' / ' + total + '</span>' +
                    '<button type="button" onclick="adminScannerGoPage(-1)" ' + (adminScannerPage <= 1 ? 'disabled' : '') + '>' + prevLabel + '</button>' +
                    '<span class="pagination-info">' + adminScannerPage + ' / ' + totalPages + '</span>' +
                    '<button type="button" onclick="adminScannerGoPage(1)" ' + (adminScannerPage >= totalPages ? 'disabled' : '') + '>' + nextLabel + '</button>';
            } else {
                paginationEl.style.display = 'none';
            }
        }
    }
}

function adminScannerShowMore() {
    adminScannerViewState = 'expanded';
    var q = (document.getElementById('adminScannerSearch') || {}).value || '';
    var filtered = filterAdminScannerList(adminScannerFullList, q);
    updateAdminScannerView(filtered);
    if (filtered.length > ADMIN_SCANNER_EXPANDED) {
        adminScannerViewState = 'pagination';
        adminScannerPage = 1;
        updateAdminScannerView(filtered);
    }
}

function adminScannerGoPage(delta) {
    var q = (document.getElementById('adminScannerSearch') || {}).value || '';
    var filtered = filterAdminScannerList(adminScannerFullList, q);
    var totalPages = Math.ceil(filtered.length / ADMIN_SCANNER_PAGE_SIZE);
    adminScannerPage = Math.max(1, Math.min(totalPages, adminScannerPage + delta));
    updateAdminScannerView(filtered);
}

function filterAdminScannerList(list, query) {
    if (!query || !query.trim()) return list;
    var q = query.trim().toLowerCase();
    return list.filter(function (doc) {
        var id = String(doc.id || '').toLowerCase();
        var user = (doc.created_by_username || '').toLowerCase();
        var fileType = (doc.file_type || '').toLowerCase();
        return id.indexOf(q) >= 0 || user.indexOf(q) >= 0 || fileType.indexOf(q) >= 0;
    });
}

function renderSubscribersRows(users, limit) {
    var take = limit ? Math.min(limit, users.length) : users.length;
    return users.slice(0, take).map(function (u) {
        var username = (u.username || u.email || '-');
        var email = (u.email != null && u.email !== '') ? u.email : '-';
        var created = u.created_at ? new Date(u.created_at).toLocaleString() : '-';
        return '<tr><td>' + escapeHtml(username) + '</td><td>' + escapeHtml(email) + '</td><td>' + escapeHtml(created) + '</td></tr>';
    }).join('');
}

function updateAdminSubscribersView() {
    var tbody = document.getElementById('adminSubscribersList');
    var controlsEl = document.getElementById('adminSubscribersControls');
    var showMoreEl = document.getElementById('adminSubscribersShowMore');
    var tableWrap = document.querySelector('.admin-subscribers-table-wrap');
    var emptySubs = typeof t === 'function' ? t('adminSubscribersEmpty') : 'Obunachilar yo\'q';
    var showMoreLabel = typeof t === 'function' ? t('adminShowMore') : 'Show more';

    if (!tbody) return;
    var users = adminSubscribersFullList;

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty">' + emptySubs + '</td></tr>';
        if (controlsEl) controlsEl.style.display = 'none';
        if (tableWrap) tableWrap.classList.remove('expanded');
        return;
    }

    var count = adminSubscribersViewState === 'initial' && users.length > ADMIN_SUBSCRIBERS_INITIAL
        ? ADMIN_SUBSCRIBERS_INITIAL
        : users.length;
    tbody.innerHTML = renderSubscribersRows(users, count);

    if (controlsEl) {
        if (adminSubscribersViewState === 'initial' && users.length > ADMIN_SUBSCRIBERS_INITIAL) {
            controlsEl.style.display = 'block';
            if (showMoreEl) {
                showMoreEl.style.display = 'inline-block';
                showMoreEl.textContent = showMoreLabel;
            }
        } else {
            controlsEl.style.display = 'none';
        }
    }
    if (tableWrap) {
        tableWrap.classList.toggle('expanded', adminSubscribersViewState === 'expanded');
    }
}

function adminSubscribersShowMore() {
    adminSubscribersViewState = 'expanded';
    updateAdminSubscribersView();
}

// Admin Panel sahifasi: obunachilar ro'yxati + skaner (OCR) hujjatlar
async function loadAdminPanelPage() {
    const subscribersTbody = document.getElementById('adminSubscribersList');
    const scannerTbody = document.getElementById('adminScannerList');
    const loadingMsg = typeof t === 'function' ? t('adminPanelLoading') : 'Yuklanmoqda...';
    const emptySubs = typeof t === 'function' ? t('adminSubscribersEmpty') : 'Obunachilar yo\'q';
    const emptyScanner = typeof t === 'function' ? t('adminScannerEmpty') : 'Skaner hujjatlar yo\'q';
    const errMsg = typeof t === 'function' ? t('adminPanelError') : 'Xato';
    const emailNote = typeof t === 'function' ? t('adminSubscribersEmailNote') : 'Email backend /auth/users orqali';

    if (subscribersTbody) subscribersTbody.innerHTML = '<tr><td colspan="3" class="loading">' + loadingMsg + '</td></tr>';
    if (scannerTbody) scannerTbody.innerHTML = '<tr><td colspan="6" class="loading">' + loadingMsg + '</td></tr>';

    const userRole = localStorage.getItem('user_role') || 'admin';
    var isAdmin = userRole === 'admin';

    // Agent uchun obunachilar bo'limini yashirish – faqat doc ma'lumotlari
    var subscribersSection = document.getElementById('adminSubscribersSection');
    if (subscribersSection) subscribersSection.style.display = isAdmin ? '' : 'none';

    // 1) Obunachilar (faqat admin uchun) va skaner hujjatlarini parallel yuklash
    let users = [];
    let documents = [];
    if (isAdmin) {
        try {
            users = await apiCall('/auth/users');
            if (!Array.isArray(users)) users = [];
        } catch (e) {
            console.warn('Admin: users API not available', e);
            users = [];
        }
    }
    try {
        const docsRaw = await apiCall('/ocr/documents?skip=0&limit=500&user_role=' + userRole);
        documents = Array.isArray(docsRaw) ? docsRaw : [];
    } catch (e) {
        console.warn('Admin: documents API error', e);
        documents = [];
    }

    // 2) Agar /auth/users bo'sh bo'lsa – skaner hujjatlaridan foydalanuvchilarni chiqarish
    if (users.length === 0 && documents.length > 0) {
        var docSorted = documents.slice().sort(function (a, b) {
            var ta = a.created_at ? new Date(a.created_at).getTime() : 0;
            var tb = b.created_at ? new Date(b.created_at).getTime() : 0;
            return tb - ta;
        });
        var seen = {};
        docSorted.forEach(function (doc) {
            var uname = (doc.created_by_username || '').trim();
            if (!uname || uname === '-') return;
            if (seen[uname]) return;
            seen[uname] = true;
            users.push({
                username: uname,
                email: null,
                created_at: doc.created_at || null
            });
        });
        users.sort(function (a, b) {
            var da = a.created_at ? new Date(a.created_at).getTime() : 0;
            var db = b.created_at ? new Date(b.created_at).getTime() : 0;
            return db - da;
        });
    }
    // 2b) created_at bo'lmasa – hujjatlar orqali to'ldirish (eski signup'lar uchun)
    if (users.length > 0 && documents.length > 0) {
        var userFirstDoc = {};
        documents.forEach(function (doc) {
            var uname = (doc.created_by_username || '').trim();
            if (!uname || uname === '-') return;
            var t = doc.created_at ? new Date(doc.created_at).getTime() : 0;
            if (!userFirstDoc[uname] || t < userFirstDoc[uname]) userFirstDoc[uname] = doc.created_at;
        });
        users.forEach(function (u) {
            if (!u.created_at && userFirstDoc[u.username]) u.created_at = userFirstDoc[u.username];
        });
    }

    adminSubscribersFullList = users;
    adminSubscribersViewState = 'initial';
    updateAdminSubscribersView();

    var subsShowMore = document.getElementById('adminSubscribersShowMore');
    var subsControls = document.getElementById('adminSubscribersControls');
    var subsTableWrap = document.querySelector('.admin-subscribers-table-wrap');
    if (subsShowMore && !subsShowMore._bound) {
        subsShowMore._bound = true;
        subsShowMore.addEventListener('mouseenter', adminSubscribersShowMore);
        subsShowMore.addEventListener('focus', adminSubscribersShowMore);
    }

    // 3) Skaner ma'lumotlari – 10 dastlab, 30 gacha kengaytirish, pagination
    var sorted = documents.slice().sort(function (a, b) {
        if (a.created_at && b.created_at) return new Date(b.created_at) - new Date(a.created_at);
        return (b.id || 0) - (a.id || 0);
    });
    adminScannerFullList = sorted;
    adminScannerViewState = 'initial';
    adminScannerPage = 1;
    var searchEl = document.getElementById('adminScannerSearch');
    if (searchEl) searchEl.value = '';
    var filtered = filterAdminScannerList(adminScannerFullList, '');
    updateAdminScannerView(filtered);

    // Search va Show more event listener
    if (searchEl && !searchEl._adminBound) {
        searchEl._adminBound = true;
        searchEl.addEventListener('input', function () {
            var q = searchEl.value || '';
            var f = filterAdminScannerList(adminScannerFullList, q);
            if (f.length > ADMIN_SCANNER_EXPANDED) {
                adminScannerViewState = 'pagination';
                adminScannerPage = 1;
            } else if (f.length > ADMIN_SCANNER_INITIAL) {
                adminScannerViewState = 'expanded';
            } else {
                adminScannerViewState = 'initial';
            }
            updateAdminScannerView(f);
        });
    }
    var showMoreBtn = document.getElementById('adminScannerShowMore');
    if (showMoreBtn && !showMoreBtn._adminBound) {
        showMoreBtn._adminBound = true;
        showMoreBtn.addEventListener('mouseenter', adminScannerShowMore);
        showMoreBtn.addEventListener('focus', adminScannerShowMore);
    }

    // Izoh: email faqat backend /auth/users orqali ko'rinadi
    var noteEl = document.getElementById('adminSubscribersNote');
    if (noteEl) {
        var subs = adminSubscribersFullList;
        noteEl.textContent = subs.length > 0 && !subs.some(function (u) { return u.email; }) ? emailNote : '';
        noteEl.style.display = noteEl.textContent ? 'block' : 'none';
    }
}

// Filter funksiyasi
function filterAdminDocuments(filter) {
    // Filter button'larni active qilish
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Document'larni filter qilib yuklash
    loadAdminDocuments(filter);
}

// Admin document verification view
async function viewAdminDocument(id) {
    try {
        const userRole = localStorage.getItem('user_role') || 'admin';
        const doc = await apiCall(`/ocr/documents/${id}?user_role=${userRole}`);
        
        const contentDiv = document.getElementById('adminVerificationContent');
        if (!contentDiv) return;
        
        const extractedData = doc.extracted_data || {};
        const fields = extractedData.fields || {};
        const normalized = extractedData.normalized || {};
        
        // Original rasm URL
        let imageUrl = null;
        if (doc.file_path) {
            const baseUrl = API_BASE_URL.replace('/api', '');
            let filePath = doc.file_path;
            if (!filePath.startsWith('uploads/') && !filePath.startsWith('/uploads/')) {
                filePath = `uploads/${filePath}`;
            }
            filePath = filePath.replace(/^\/+/, '');
            imageUrl = `${baseUrl}/${filePath}`;
            const pathParts = imageUrl.split('/');
            const fileName = pathParts[pathParts.length - 1];
            const encodedFileName = encodeURIComponent(fileName);
            pathParts[pathParts.length - 1] = encodedFileName;
            imageUrl = pathParts.join('/');
        }
        
        // Metadata'dan ma'lumotlarni olish
        const metadata = extractedData.metadata || {};
        doc.user_edited_data = metadata.user_edited_data || {};
        doc.is_edited = metadata.is_edited || false;
        
        // Verified status - metadata'dan yoki document status'dan
        const statusValue = doc.status?.value || doc.status || '';
        // Verified status - metadata'dan yoki document status'dan (barcha variantlarni tekshirish)
        const isVerified = metadata.verified === true || 
                          metadata.verified === 'true' || 
                          String(metadata.verified).toLowerCase() === 'true' ||
                          statusValue === 'verified' || 
                          statusValue === 'VERIFIED' ||
                          String(statusValue).toLowerCase() === 'verified';
        doc.verified = Boolean(isVerified);
        doc.rejected = Boolean(metadata.rejected === true || false);
        doc.reprocess_count = metadata.reprocess_count || 0;
        doc.edit_count = metadata.edit_count || 0;
        doc.metadata = metadata;  // Metadata'ni saqlash (verified_at, verified_by uchun)
        
        // Debug: verified status'ni tekshirish
        console.log('🔍 Document verified check:', {
            'metadata.verified': metadata.verified,
            'metadata.verified type': typeof metadata.verified,
            'doc.status': doc.status,
            'statusValue': statusValue,
            'isVerified': isVerified,
            'doc.verified': doc.verified,
            'doc.verified type': typeof doc.verified,
            'doc.rejected': doc.rejected,
            'full metadata': metadata,
            'extractedData': extractedData
        });
        
        // OCR va Edited ma'lumotlarni solishtirish
        const comparisonData = getComparisonData(extractedData, doc);
        
        let html = `
            <div class="admin-verification-container">
                <h1>문서 검증 #${doc.id}</h1>
                
                <!-- Layout: Original Image (Left) + Comparison Table (Right) -->
                <div class="admin-verification-layout">
                    <!-- Left: Original Image -->
                    <div class="admin-image-panel">
                        <h3>원본 이미지 (Original Image)</h3>
                        ${imageUrl ? `
                            <div class="admin-image-container">
                                <img src="${imageUrl}" 
                                     alt="Document Image" 
                                     onclick="openImageModal('${imageUrl}')"
                                     style="max-width: 100%; max-height: 600px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer;">
                            </div>
                        ` : `
                            <div class="admin-image-placeholder">
                                <p>이미지를 불러올 수 없습니다</p>
                            </div>
                        `}
                    </div>
                    
                    <!-- Right: Comparison Table -->
                    <div class="admin-comparison-panel">
                        <h3>데이터 비교 (Data Comparison)</h3>
                        <div class="comparison-table-container">
                            <table class="comparison-table">
                                <thead>
                                    <tr>
                                        <th>필드명</th>
                                        <th>사용자 입력</th>
                                        <th>OCR 결과</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${comparisonData.map(item => `
                                        <tr class="${item.highlighted ? 'row-highlighted' : ''} ${item.isExpired ? 'row-expired' : ''}">
                                            <td><strong>${item.fieldName}</strong></td>
                                            <td class="${item.highlighted ? 'cell-highlighted' : ''}">${item.userValue || '-'}</td>
                                            <td>${item.ocrValue || '-'}</td>
                                            <td class="${item.isExpired ? 'status-expired' : item.statusClass}">
                                                ${item.statusIcon} ${item.statusText}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- Action Sidebar -->
                <div class="admin-action-sidebar">
                    <h3>관리 작업</h3>
                    
                    <!-- Document Info -->
                    <div class="admin-doc-info-box">
                        <p><strong>문서 ID:</strong> #${doc.id}</p>
                        <p><strong>사용자:</strong> ${doc.created_by_username || 'Unknown'}</p>
                        <p><strong>생성일:</strong> ${new Date(doc.created_at).toLocaleString('ko-KR')}</p>
                        <p><strong>신뢰도:</strong> ${doc.confidence || 0}%</p>
                        ${doc.is_edited ? '<p style="color: #0066cc; font-weight: 600;"><strong>✏️ 수정됨:</strong> 사용자가 데이터를 수정했습니다</p>' : ''}
                        ${checkDocumentExpired(doc) ? '<p style="color: #ef4444; font-weight: 600;"><strong>⚠️ 만료됨:</strong> 문서 유효기간이 만료되었습니다</p>' : ''}
                    </div>
                    
                    <!-- Log Files -->
                    <div class="admin-log-section">
                        <h4>로그 파일 (Log Files)</h4>
                        <div class="log-item">
                            <span class="log-label">업로드:</span>
                            <span class="log-value">${new Date(doc.created_at).toLocaleString('ko-KR')}</span>
                        </div>
                        <div class="log-item">
                            <span class="log-label">재스캔 횟수:</span>
                            <span class="log-value">${doc.reprocess_count || 0}회</span>
                        </div>
                        <div class="log-item">
                            <span class="log-label">수정 횟수:</span>
                            <span class="log-value">${doc.edit_count || 0}회</span>
                        </div>
                    </div>
                    
                    <!-- User History -->
                    <div class="admin-user-history">
                        <h4>사용자 이력 (User History)</h4>
                        <div id="userHistory_${doc.id}" class="user-history-list">
                            <p class="loading-small">로딩 중...</p>
                        </div>
                    </div>
                    
                    <!-- Action Buttons (faqat verified bo'lmagan document'lar uchun) -->
                    ${!doc.verified && !doc.rejected ? `
                        <div class="admin-action-buttons">
                            <button class="btn-approve" onclick="approveDocument(${doc.id})">
                                ✓ 승인 (Approve)
                            </button>
                            <button class="btn-reject" onclick="openRejectModal(${doc.id})">
                                ✗ 거부 (Reject)
                            </button>
                        </div>
                    ` : doc.verified ? `
                        <div class="admin-verified-message">
                            <div class="verified-badge">
                                <span class="verified-icon">✓</span>
                                <span class="verified-text">이 문서는 승인되었습니다 (This document has been verified)</span>
                            </div>
                            <p class="verified-info">승인일: ${new Date((doc.metadata && doc.metadata.verified_at) || doc.created_at).toLocaleString('ko-KR')}</p>
                            <p class="verified-info">승인자: ${(doc.metadata && doc.metadata.verified_by) || 'Admin'}</p>
                        </div>
                    ` : doc.rejected ? `
                        <div class="admin-rejected-message">
                            <div class="rejected-badge">
                                <span class="rejected-icon">✗</span>
                                <span class="rejected-text">이 문서는 거부되었습니다 (This document has been rejected)</span>
                            </div>
                            <p class="rejected-info">거부 사유: ${(doc.metadata && doc.metadata.rejection_reason) || 'N/A'}</p>
                            ${(doc.metadata && doc.metadata.rejection_notes) ? `<p class="rejected-info">추가 설명: ${doc.metadata.rejection_notes}</p>` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        contentDiv.innerHTML = html;
        showPage('adminVerification');
        
        // Debug: HTML'dan keyin verified status'ni tekshirish
        console.log('🔍 After HTML generation - doc.verified:', doc.verified, 'doc.rejected:', doc.rejected);
        console.log('🔍 Action buttons should be:', !doc.verified && !doc.rejected ? 'VISIBLE' : 'HIDDEN');
        
        // User history yuklash
        loadUserHistory(doc.created_by_username, doc.id);
        
    } catch (error) {
        console.error('Admin document yuklash xatosi:', error);
        alert('문서 로드 오류: ' + error.message);
    }
}

// Comparison data yaratish
function getComparisonData(extractedData, doc) {
    const fields = extractedData.fields || {};
    const normalized = extractedData.normalized || {};
    const comparison = [];
    
    // Helper: field value olish
    const getFieldValue = (fieldName, altNames = []) => {
        if (normalized[fieldName]) return normalized[fieldName];
        for (const name of [fieldName, ...altNames]) {
            if (fields[name]) {
                if (typeof fields[name] === 'object' && fields[name].value) {
                    return fields[name].value;
                } else if (typeof fields[name] === 'string') {
                    return fields[name];
                }
            }
        }
        return null;
    };
    
    // Helper: status aniqlash (tarjima t() orqali)
    const getStatus = (userValue, ocrValue) => {
        if (!userValue && !ocrValue) return { icon: '⚪', text: t('statusNone'), class: 'status-empty' };
        if (!userValue || !ocrValue) return { icon: '⚠️', text: t('statusPartial'), class: 'status-partial' };
        const userClean = String(userValue).trim().toUpperCase();
        const ocrClean = String(ocrValue).trim().toUpperCase();
        if (userClean === ocrClean) {
            return { icon: '✅', text: t('statusMatch'), class: 'status-match' };
        }
        return { icon: '❌', text: t('statusMismatch'), class: 'status-mismatch' };
    };
    
    // Passport fields (labelKey – translations.js dagi kalit)
    const fieldsToCompare = [
        { labelKey: 'labelSurname', field: 'surname', alt: ['familiya'] },
        { labelKey: 'labelGivenName', field: 'given_name', alt: ['given_names', 'ism'] },
        { labelKey: 'labelPassportNo', field: 'passport_no', alt: ['passport_number', 'passport_raqami'] },
        { labelKey: 'labelDateOfBirth', field: 'date_of_birth', alt: ['dob', 'tugilgan_sanasi'] },
        { labelKey: 'labelDateOfExpiry', field: 'date_of_expiry', alt: ['expiry', 'amal_qilish_muddati'] },
        { labelKey: 'labelNationality', field: 'nationality', alt: ['millati'] },
    ];
    
    fieldsToCompare.forEach(({ labelKey, field, alt }) => {
        const ocrValue = getFieldValue(field, alt);
        const userValue = doc.edited_data && doc.edited_data[field] ? doc.edited_data[field] : null;
        const status = getStatus(userValue, ocrValue);
        
        let statusIcon = status.icon;
        let statusText = status.text;
        if (field === 'date_of_expiry' && ocrValue) {
            try {
                const expiryDate = new Date(ocrValue);
                if (expiryDate < new Date()) {
                    statusIcon = '❌';
                    statusText = t('statusExpired');
                }
            } catch (e) {}
        }
        
        comparison.push({
            fieldName: t(labelKey),
            userValue: userValue || '-',
            ocrValue: ocrValue || '-',
            statusIcon: statusIcon,
            statusText: statusText,
            statusClass: status.class
        });
    });
    
    return comparison;
}

// Document muddati o'tganini tekshirish
function checkDocumentExpired(doc) {
    const extractedData = doc.extracted_data || {};
    const userEditedData = doc.user_edited_data || {};
    const fields = extractedData.fields || {};
    
    // Date of expiry ni topish
    let expiryValue = userEditedData.date_of_expiry || userEditedData.date_of_expiry;
    if (!expiryValue) {
        const expiryField = fields.date_of_expiry || fields.expiry || fields.amal_qilish_muddati;
        if (expiryField) {
            expiryValue = typeof expiryField === 'object' ? expiryField.value : expiryField;
        }
    }
    
    if (!expiryValue) return false;
    
    try {
        let expiryDate;
        if (expiryValue.includes('-')) {
            expiryDate = new Date(expiryValue);
        } else if (expiryValue.includes('.')) {
            const parts = expiryValue.split('.');
            if (parts.length === 3) {
                expiryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
        }
        if (expiryDate && !isNaN(expiryDate.getTime())) {
            return expiryDate < new Date();
        }
    } catch (e) {
        console.error('Date parsing error:', e);
    }
    
    return false;
}

// User history yuklash
async function loadUserHistory(username, currentDocId) {
    try {
        const userRole = localStorage.getItem('user_role') || 'admin';
        const documents = await apiCall(`/ocr/documents?skip=0&limit=100&user_role=${userRole}`);
        
        const userDocs = documents.filter(doc => 
            doc.created_by_username === username && doc.id !== currentDocId
        );
        
        const historyDiv = document.getElementById(`userHistory_${currentDocId}`);
        if (!historyDiv) return;
        
        if (userDocs.length === 0) {
            historyDiv.innerHTML = '<p class="no-history">이전 문서 없음</p>';
            return;
        }
        
        historyDiv.innerHTML = userDocs.slice(0, 5).map(doc => `
            <div class="history-item">
                <span class="history-doc-id">문서 #${doc.id}</span>
                <span class="history-date">${new Date(doc.created_at).toLocaleDateString('ko-KR')}</span>
                <span class="history-status status-${doc.verified ? 'approved' : doc.rejected ? 'rejected' : 'pending'}">
                    ${doc.verified ? '승인' : doc.rejected ? '거부' : '대기'}
                </span>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('User history yuklash xatosi:', error);
    }
}

// Document'ni tasdiqlash
async function approveDocument(documentId) {
    if (!confirm('이 문서를 승인하시겠습니까?')) {
        return;
    }
    
    try {
        const userRole = localStorage.getItem('user_role') || 'admin';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/ocr/documents/${documentId}/approve?user_role=${userRole}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '승인 오류');
        }
        
        // Response'dan document'ni olish
        const result = await response.json();
        
        alert('문서가 성공적으로 승인되었습니다! 문서 상태가 verified로 변경되었습니다.');
        
        // Admin verification page'da bo'lsak, qayta yuklash
        const currentPage = localStorage.getItem('currentPage');
        if (currentPage === 'adminVerification') {
            // Hozirgi document'ni qayta yuklash (force reload)
            // Kichik delay qo'shamiz, chunki backend yangilanishi uchun vaqt kerak
            setTimeout(async () => {
                await viewAdminDocument(documentId);
            }, 500);
        } else {
            showPage('admin');
            loadAdminDocuments();
        }
        
    } catch (error) {
        console.error('승인 오류:', error);
        alert('승인 중 오류가 발생했습니다: ' + error.message);
    }
}

// Reject modal ochish
function openRejectModal(documentId) {
    const modal = document.getElementById('rejectModal');
    if (!modal) {
        // Modal yaratish
        const rejectModal = document.createElement('div');
        rejectModal.id = 'rejectModal';
        rejectModal.className = 'modal-overlay';
        rejectModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>문서 거부 (Document Rejection)</h2>
                    <button class="modal-close-btn" onclick="closeRejectModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>거부 사유 (Rejection Reason):</label>
                        <select id="rejectReason" class="form-input">
                            <option value="image_blurry">이미지 흐림 (Image Blurry)</option>
                            <option value="document_expired">문서 만료됨 (Document Expired)</option>
                            <option value="data_mismatch">데이터 불일치 (Data Mismatch)</option>
                            <option value="low_confidence">낮은 신뢰도 (Low Confidence)</option>
                            <option value="invalid_document">잘못된 문서 (Invalid Document)</option>
                            <option value="other">기타 (Other)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>추가 설명 (Additional Notes):</label>
                        <textarea id="rejectNotes" class="form-input" rows="4" placeholder="선택사항"></textarea>
                    </div>
                    <div id="rejectError" class="error" style="display: none;"></div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="closeRejectModal()">취소</button>
                        <button class="btn-danger" onclick="rejectDocument(${documentId})">거부</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(rejectModal);
    }
    
    document.getElementById('rejectModal').style.display = 'flex';
    document.getElementById('rejectReason').value = '';
    document.getElementById('rejectNotes').value = '';
}

function closeRejectModal() {
    const modal = document.getElementById('rejectModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Document'ni rad etish
async function rejectDocument(documentId) {
    try {
        const userRole = localStorage.getItem('user_role') || 'admin';
        const token = localStorage.getItem('token');
        const reason = document.getElementById('rejectReason').value;
        const notes = document.getElementById('rejectNotes').value;
        
        const response = await fetch(`${API_BASE_URL}/ocr/documents/${documentId}/reject?user_role=${userRole}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reason: reason,
                notes: notes
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '거부 오류');
        }
        
        alert('문서가 거부되었습니다!');
        closeRejectModal();
        showPage('admin');
        loadAdminDocuments();
        
    } catch (error) {
        console.error('거부 오류:', error);
        const errorDiv = document.getElementById('rejectError');
        if (errorDiv) {
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        }
    }
}

// ==================== PROFILE ====================

// loadProfile funksiyasi olib tashlandi - endi loadAdminPanel ishlatiladi

// ==================== EVENT LISTENERS ====================

// ==================== DARK MODE (Locohub uslubida) ====================
function initDarkMode() {
    const saved = localStorage.getItem('darkMode') === 'true';
    applyDarkMode(saved);
    updateDarkModeIcon(saved);
}
function applyDarkMode(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }
}
function updateDarkModeIcon(isDark) {
    const el = document.getElementById('darkModeToggle');
    if (el) el.textContent = isDark ? '☀️' : '🌙';
}
function playThemeEntranceOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'theme-entrance-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
    requestAnimationFrame(function () {
        requestAnimationFrame(function () { overlay.classList.add('theme-entrance-overlay--active'); });
    });
    overlay.addEventListener('transitionend', function onEnd() {
        overlay.removeEventListener('transitionend', onEnd);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    });
}

function toggleDarkMode() {
    var wasDark = localStorage.getItem('darkMode') === 'true';
    var next = !wasDark;
    localStorage.setItem('darkMode', String(next));
    applyDarkMode(next);
    updateDarkModeIcon(next);
    if (wasDark && !next) playThemeEntranceOverlay();
}

// ==================== CURSOR GLOW (dark mode: yashil nuqta + glow sichqoncha kuzatadi, Locohub uslubi) ====================
function initCursorGlow() {
    function isDark() { return document.documentElement.classList.contains('dark-mode'); }
    var cursorGlow = null;
    var cursorDot = null;
    var active = false;
    var hoverHandlers = [];

    function removeCursor() {
        if (cursorGlow && cursorGlow.parentNode) cursorGlow.parentNode.removeChild(cursorGlow);
        if (cursorDot && cursorDot.parentNode) cursorDot.parentNode.removeChild(cursorDot);
        cursorGlow = null;
        cursorDot = null;
        active = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseleave', onLeave);
        document.removeEventListener('mouseenter', onEnter);
        hoverHandlers.forEach(function (h) {
            if (h.el && h.enter) h.el.removeEventListener('mouseenter', h.enter);
            if (h.el && h.leave) h.el.removeEventListener('mouseleave', h.leave);
        });
        hoverHandlers.length = 0;
    }

    function createCursor() {
        var g = document.querySelector('.cursor-glow');
        var d = document.querySelector('.cursor-dot-custom');
        if (g) g.remove();
        if (d) d.remove();
        cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot-custom';
        document.body.appendChild(cursorGlow);
        document.body.appendChild(cursorDot);
        active = true;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseenter', onEnter);
        var sel = 'a, button, [role="button"], [onclick], input[type="submit"], input[type="button"], .btn-primary, .nav-link-modern, .service-item, .tab, .news-item-link';
        document.querySelectorAll(sel).forEach(function (el) {
            var enter = function () {
                if (!cursorGlow || !cursorDot) return;
                cursorGlow.style.width = '300px';
                cursorGlow.style.height = '300px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, transparent 70%)';
                cursorDot.style.width = '12px';
                cursorDot.style.height = '12px';
            };
            var leave = function () {
                if (!cursorGlow || !cursorDot) return;
                cursorGlow.style.width = '200px';
                cursorGlow.style.height = '200px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)';
                cursorDot.style.width = '8px';
                cursorDot.style.height = '8px';
            };
            el.addEventListener('mouseenter', enter);
            el.addEventListener('mouseleave', leave);
            hoverHandlers.push({ el: el, enter: enter, leave: leave });
        });
    }

    function onMove(e) {
        if (!cursorGlow || !cursorDot) return;
        var x = e.clientX;
        var y = e.clientY;
        cursorGlow.style.left = x + 'px';
        cursorGlow.style.top = y + 'px';
        cursorGlow.style.opacity = '1';
        cursorDot.style.left = x + 'px';
        cursorDot.style.top = y + 'px';
        cursorDot.style.opacity = '1';
    }
    function onLeave() {
        if (cursorGlow) cursorGlow.style.opacity = '0';
        if (cursorDot) cursorDot.style.opacity = '0';
    }
    function onEnter() {
        if (cursorDot) cursorDot.style.opacity = '1';
    }

    function sync() {
        if (isDark() && !active) createCursor();
        else if (!isDark() && active) removeCursor();
    }

    sync();
    var obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initCursorGlow();
    // Welcome overlay: yangi kirishda har doim; sayt ichida F5 da – faqat har 5-refresh da (1,6,11...)
    (function () {
        var overlay = document.getElementById('welcomeOverlay');
        if (!overlay) return;
        var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
        var isReload = nav && nav.type === 'reload';
        if (isReload) {
            var key = 'welcomeVisitCount';
            var count = (parseInt(localStorage.getItem(key), 10) || 0) + 1;
            localStorage.setItem(key, String(count));
            if (count % 5 !== 1) {
                overlay.remove();
                return;
            }
        }
        setTimeout(function () {
            overlay.classList.add('welcome-overlay-hide');
            setTimeout(function () {
                overlay.remove();
            }, 700);
        }, 5000);
    })();
    var hpVideo = document.querySelector('.featured-video-player');
    if (hpVideo) hpVideo.playbackRate = 0.7;
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) darkToggle.addEventListener('click', (e) => { e.preventDefault(); toggleDarkMode(); });
    
    const logoHomeLink = document.getElementById('logoHomeLink');
    if (logoHomeLink) logoHomeLink.addEventListener('click', (e) => { e.preventDefault(); showPage('dashboard'); });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Signup form
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // Show signup form
    document.getElementById('showSignup').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginFormContainer').style.display = 'none';
        document.getElementById('signupFormContainer').style.display = 'block';
        if (typeof updateSignupFormByRole === 'function') updateSignupFormByRole();
    });
    var signupRoleEl = document.getElementById('signupRole');
    if (signupRoleEl) signupRoleEl.addEventListener('change', updateSignupFormByRole);
    
    // Show login form
    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('signupFormContainer').style.display = 'none';
        document.getElementById('loginFormContainer').style.display = 'block';
    });
    
    // Login qilmasdan saytni ko'rish (boshqa websitelardek)
    const browseWithoutLoginEl = document.getElementById('browseWithoutLogin');
    if (browseWithoutLoginEl) {
        browseWithoutLoginEl.addEventListener('click', (e) => { e.preventDefault(); showAppWithoutLogin(); });
    }
    const browseWithoutLoginSignupEl = document.getElementById('browseWithoutLoginSignup');
    if (browseWithoutLoginSignupEl) {
        browseWithoutLoginSignupEl.addEventListener('click', (e) => { e.preventDefault(); showAppWithoutLogin(); });
    }
    
    // Profile dropdown toggle va logout
    const profileDropdownToggle = document.getElementById('profileDropdownToggle');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileDropdownOverlay = document.getElementById('profileDropdownOverlay');
    const profileDropdownClose = document.getElementById('profileDropdownClose');
    const topNavLogoutBtn = document.getElementById('topNavLogoutBtn');
    
    // Dropdown'ni yopish funksiyasi
    const closeProfileDropdown = () => {
        if (profileDropdown) {
            profileDropdown.classList.remove('active');
        }
        if (profileDropdownOverlay) {
            profileDropdownOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    if (profileDropdownToggle && profileDropdown) {
        // Profile icon'ga click qilganda dropdown'ni ochish/yopish
        profileDropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const isActive = profileDropdown.classList.toggle('active');
            
            // Mobile'da overlay'ni ko'rsatish/yashirish
            if (window.innerWidth <= 768) {
                if (isActive && profileDropdownOverlay) {
                    profileDropdownOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Scroll'ni to'xtatish
                    // Force reflow for animation
                    profileDropdown.offsetHeight;
                } else if (profileDropdownOverlay) {
                    profileDropdownOverlay.classList.remove('active');
                    document.body.style.overflow = ''; // Scroll'ni qayta yoqish
                }
            }
        });
        
        // X tugmasi bilan dropdown'ni yopish
        if (profileDropdownClose) {
            profileDropdownClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeProfileDropdown();
            });
        }
        
        // Overlay'ga click qilganda dropdown'ni yopish (mobile)
        if (profileDropdownOverlay) {
            profileDropdownOverlay.addEventListener('click', () => {
                closeProfileDropdown();
            });
        }
        
        // Click outside to close dropdown (desktop)
        document.addEventListener('click', (e) => {
            if (window.innerWidth > 768) {
                if (!profileDropdown.contains(e.target) && !profileDropdownToggle.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            }
        });
        
        // Dropdown ichidagi item'ga click qilganda yopish (logout va X tugmasidan tashqari)
        profileDropdown.addEventListener('click', (e) => {
            if (!e.target.closest('.profile-dropdown-logout') && !e.target.closest('.profile-dropdown-close')) {
                // Logout va X tugmasi emas, boshqa item'ga click qilinsa yopish (mobile'da)
                if (window.innerWidth <= 768) {
                    // Mobile'da item'ga click qilganda dropdown yopiladi
                    setTimeout(() => {
                        closeProfileDropdown();
                    }, 100);
                }
            }
        });
        
        // Window resize - dropdown'ni yopish
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeProfileDropdown();
            }
        });
    }
    
    // Logout: top nav dropdown tugmasi
    if (topNavLogoutBtn && profileDropdown) {
        topNavLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeProfileDropdown();
            handleLogout();
        });
    }
    
    // Logout / Login – document delegation
    document.addEventListener('click', function(e) {
        var el = e.target.closest('.profile-dropdown-logout, #topNavLogoutBtn, #topNavLoginBtn, #mypageLogout, .mypage-nav-logout');
        if (!el) return;
        e.preventDefault();
        e.stopPropagation();
        if (typeof closeProfileDropdown === 'function') closeProfileDropdown();
        if (el.id === 'topNavLoginBtn') {
            if (typeof showLoginScreen === 'function') showLoginScreen();
        } else {
            handleLogout();
        }
    }, true);
    
    // Top navigation links (nav-link-modern)
    const navLinks = document.querySelectorAll('.nav-link-modern');
    console.log('🔍 Found navigation links:', navLinks.length);
    
    navLinks.forEach((link, index) => {
        const page = link.getAttribute('data-page');
        console.log(`  Link ${index + 1}:`, {
            text: link.textContent.trim(),
            dataPage: page,
            href: link.getAttribute('href')
        });
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const pageName = link.getAttribute('data-page');
            console.log('🖱️ Navigation link clicked:', pageName);
            if (pageName) {
                showPage(pageName);
            } else {
                console.error('❌ No data-page attribute found on link');
            }
        });
    });
    
    // Data-page attribute'ga ega barcha elementlar (masalan, "+ Yangi Document" tugmasi)
    // Lekin navigation link'larni o'tkazib yuborish (ular allaqachon event listener'ga ega)
    document.querySelectorAll('[data-page]').forEach(element => {
        if (!element.classList.contains('nav-link') && !element.classList.contains('nav-link-modern')) {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const page = element.getAttribute('data-page');
                if (page) {
                    showPage(page);
                }
            });
        }
    });
    
    // Upload form
    document.getElementById('uploadForm').addEventListener('submit', handleUpload);
    
    // Service items event listeners (event delegation - services-grid'ga)
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        servicesGrid.addEventListener('click', (e) => {
            const serviceItem = e.target.closest('.service-item');
            if (serviceItem) {
                const service = serviceItem.getAttribute('data-service');
                if (service) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Service clicked:', service);
                    handleServiceClick(service);
                }
            }
        });
    }
    
    // Oson qo'llanma: bo'limni bosganda yig'ish/ochish (accordion)
    var guideSections = document.querySelector('#guidePage .guide-sections');
    if (guideSections) {
        guideSections.addEventListener('click', function(e) {
            var h2 = e.target.closest('.guide-section h2');
            if (h2) {
                var section = h2.closest('.guide-section');
                if (section) section.classList.toggle('collapsed');
            }
        });
    }

    // Shakl topish: PDF yuklash tugmalari
    const formsList = document.querySelector('#formsPage .forms-list');
    if (formsList) {
        formsList.addEventListener('click', function(e) {
            var btn = e.target.closest('.form-item button.btn-primary');
            if (!btn) return;
            var item = btn.closest('.form-item');
            var items = document.querySelectorAll('#formsPage .form-item');
            var idx = Array.prototype.indexOf.call(items, item);
            var names = ['passport-translation-form.pdf', 'pension-application.pdf', 'id-translation-form.pdf'];
            downloadFormPdf(idx, names[idx] || 'form.pdf');
        });
    }

    // Calculator functionality
    const calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
        calcBtn.addEventListener('click', handleCalculator);
    }
    
    // Chat functionality
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatInput = document.getElementById('chatInput');
    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener('click', handleChatSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleChatSend();
            }
        });
    }

    // Float AI Chat (Locohub-style) – barcha sahifalarda ko‘rinadi
    initAIChatFloat();

    // Language selector event listener
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        // Set current language from localStorage
        const currentLang = localStorage.getItem('language') || 'ko';
        languageSelector.value = currentLang;
        
        languageSelector.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            localStorage.setItem('language', selectedLang);
            if (typeof setLanguage === 'function') {
                setLanguage(selectedLang);
            }
        });
    }
    
    // Initialize language translations
    if (typeof initializeLanguage === 'function') {
        initializeLanguage();
    }
    
    // Check authentication (page load'da)
    checkAuth();
    
    // Window load'da ham tekshirish (F5 – login bo‘lsa sahifani saqlab qolish)
    window.addEventListener('load', () => {
        console.log('🔄 Window loaded, checking auth again...');
        checkAuth();
        
        // Hech qanday sahifa active bo‘lmasa – refresh bo‘lsa saqlangan, yo‘q bo‘lsa homepage
        setTimeout(() => {
            const appScreen = document.getElementById('appScreen');
            const currentActive = document.querySelector('.page.active');
            if (appScreen && appScreen.classList.contains('active') && !currentActive) {
                showPage(getInitialPage());
            }
        }, 300);
    });
    
    // Dastlabki yuklanish - checkbox'lar init qilish
    setTimeout(() => {
        initFeaturedCheckboxes();
    }, 200);
    
    // Edit form submit handler
    const editForm = document.getElementById('editPassportForm');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await savePassportData();
        });
    }
    
    // Modal overlay click - close modal
    const modal = document.getElementById('editPassportModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditPassportModal();
            }
        });
    }
    
    // Sahifa checkAuth'da getInitialPage() orqali o'rnatiladi (refresh = saqlangan, navigate = homepage)
    
    // Brauzer orqaga/oldinga: sayt ichida qolish. Documents (yoki boshqa asosiy sahifa)dan orqaga bosganda servis sahifasiga tushmaslik – to'g'ridan-to'g'ri dashboard.
    const mainPages = ['dashboard', 'documents', 'upload', 'admin', 'adminPanel'];
    const servicePages = ['webfax', 'branch', 'forms', 'calculator', 'guide', 'statistics', 'chat', 'aboutUs'];
    window.addEventListener('popstate', function(e) {
        const state = e.state;
        const fromPage = currentPage;
        if (state && state.page === 'documentDetail' && state.docId != null) {
            viewDocument(state.docId);
            return;
        }
        if (state && state.page) {
            // Asosiy sahifadan (documents, upload, admin) orqaga bosib servis sahifasiga (webfax, ...) tushmaslik – dashboard ko'rsatamiz va history'ni tozalaymiz
            if (mainPages.includes(fromPage) && servicePages.includes(state.page)) {
                showPage('dashboard');
                if (typeof history.replaceState === 'function') {
                    history.replaceState({ page: 'dashboard' }, '', window.location.pathname || '/');
                }
                return;
            }
            showPage(state.page);
            return;
        }
        showPage('documents');
    });
});

// Window load event - qo'shimcha tekshirish
window.addEventListener('load', () => {
    console.log('✅ Window loaded, checking navigation links...');
    
    // Navigation link'larni qayta tekshirish
    const navLinks = document.querySelectorAll('.nav-link-modern');
    if (navLinks.length === 0) {
        console.warn('⚠️ No navigation links found after window load!');
    } else {
        console.log('✅ Navigation links found after window load:', navLinks.length);
    }
    
    // Sahifa allaqachon checkAuth/getInitialPage orqali o‘rnatilgan; bu yerda faqat fallback (active yo‘q bo‘lsa)
    var currentActivePage = document.querySelector('.page.active');
    if (!currentActivePage) {
        showPage(getInitialPage());
    }
});
