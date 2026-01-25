// API Configuration (config.js dan o'qiladi)
const API_BASE_URL = CONFIG.API_BASE_URL;

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
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '로그인 오류');
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
        
        // Sidebar profile
        const sidebarUsernameEl = document.getElementById('sidebarUsername');
        if (sidebarUsernameEl && typeof username === 'string') {
            sidebarUsernameEl.textContent = username;
        }
        
        const sidebarRoleEl = document.getElementById('sidebarRole');
        if (sidebarRoleEl) sidebarRoleEl.textContent = data.role.toUpperCase();
        
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
        
        // Home page'ga o'tish (default)
        showPage('dashboard');
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

// Logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    currentUser = null;
    
    document.getElementById('appScreen').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
    
    // Login form'ni ko'rsatish
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('signupFormContainer').style.display = 'none';
}

// Signup
async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
    const errorDiv = document.getElementById('signupError');
    
    errorDiv.style.display = 'none';
    
    // Password tasdiqlash
    if (password !== passwordConfirm) {
        errorDiv.textContent = '비밀번호가 일치하지 않습니다!';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Password uzunligi
    if (password.length < 6) {
        errorDiv.textContent = '비밀번호는 최소 6자 이상이어야 합니다!';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email: email || null })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '회원가입 오류');
        }
        
        const data = await response.json();
        
        // Muvaffaqiyatli signup - login qilish
        alert(`회원가입이 완료되었습니다! 이제 로그인하세요.`);
        
        // Login form'ga o'tish
        document.getElementById('signupFormContainer').style.display = 'none';
        document.getElementById('loginFormContainer').style.display = 'block';
        document.getElementById('signupForm').reset();
        
        // Username'ni login form'ga qo'yish
        document.getElementById('username').value = username;
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

// Check authentication on load
function checkAuth() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user_role');
    const username = localStorage.getItem('username');
    
    if (token && role) {
        currentUser = { role, username: username || 'user' };
        const loginScreen = document.getElementById('loginScreen');
        const appScreen = document.getElementById('appScreen');
        
        if (loginScreen) loginScreen.classList.remove('active');
        if (appScreen) appScreen.classList.add('active');
        
        // Sidebar profile
        const sidebarUsernameEl = document.getElementById('sidebarUsername');
        if (sidebarUsernameEl) {
            const usernameValue = username || 'user';
            sidebarUsernameEl.textContent = usernameValue;
        }
        
        const sidebarRoleEl = document.getElementById('sidebarRole');
        if (sidebarRoleEl) sidebarRoleEl.textContent = role.toUpperCase();
        
        // Top nav
        const headerUsernameNavEl = document.getElementById('headerUsernameNav');
        if (headerUsernameNavEl) {
            const usernameValue = username || 'user';
            headerUsernameNavEl.setAttribute('title', `${usernameValue} (${role})`);
        }
        
        // Sidebar profile card'ni yashirish (showPage funksiyasida ko'rsatiladi)
        const sidebarProfile = document.getElementById('sidebarProfile');
        if (sidebarProfile) sidebarProfile.style.display = 'none';
        
        // My Page link'ni ko'rsatish (barcha user'lar uchun)
        const adminNavLink = document.getElementById('adminNavLink');
        if (adminNavLink) {
            adminNavLink.style.display = 'inline-block';
        }
        
        // Home page'ga o'tish (default)
        showPage('dashboard');
    }
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
        if (response.status === 401) {
            handleLogout();
            throw new Error('인증 오류');
        }
        const error = await response.json();
        throw new Error(error.detail || 'API 오류');
    }
    
    return response.json();
}

// ==================== NAVIGATION ====================

function showPage(pageName) {
    // Barcha sahifalarni yashirish
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
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
    const page = document.getElementById(`${pageName}Page`);
    if (page) {
        page.classList.add('active');
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
    
    // Faqat hozirgi page'ning sidebar nav link'ini active qilish
    const allSidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    allSidebarLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');
        if (linkPage === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    currentPage = pageName;
    
    // Sidebar profile card'ni ko'rsatish/yashirish (faqat admin page'da)
    const sidebarProfile = document.getElementById('sidebarProfile');
    if (pageName === 'admin') {
        // Faqat admin page'da profile card'ni ko'rsatish
        if (sidebarProfile) sidebarProfile.style.display = 'block';
    } else {
        // Boshqa sahifalarda profile card'ni yashirish
        if (sidebarProfile) sidebarProfile.style.display = 'none';
    }
    
    // Sidebar section'larni yashirish (My Page'da kerak emas)
    const manageListingsSection = document.getElementById('manageListingsSection');
    const manageAccountSection = document.getElementById('manageAccountSection');
    
    if (manageListingsSection) manageListingsSection.style.display = 'none';
    if (manageAccountSection) manageAccountSection.style.display = 'none';
    
    // Sahifa yuklanganda ma'lumotlarni yuklash
    if (pageName === 'dashboard') {
        loadDashboard();
    } else if (pageName === 'documents') {
        loadDocuments();
    } else if (pageName === 'admin') {
        loadAdminPanel();
    }
}

// ==================== DASHBOARD ====================

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
        
        // Recent documents (agar mavjud bo'lsa)
        const recentDiv = document.getElementById('recentDocuments');
        if (recentDiv) {
            if (documents.length === 0) {
                recentDiv.innerHTML = '<p>문서가 없습니다</p>';
            } else {
                recentDiv.innerHTML = documents.map(doc => `
                    <div class="document-card" onclick="viewDocument(${doc.id})">
                        <h4>문서 #${doc.id}</h4>
                        <p>유형: ${doc.file_type}</p>
                        <p>상태: ${doc.status}</p>
                        <p>신뢰도: ${doc.confidence || 0}%</p>
                    </div>
                `).join('');
            }
        }
        
        // News list yangilash (agar mavjud bo'lsa)
        const newsList = document.querySelector('.news-list');
        if (newsList && documents.length > 0) {
            // Eng so'nggi 3 ta document'ni news sifatida ko'rsatish
            const latestDocs = documents.slice(0, 3);
            newsList.innerHTML = latestDocs.map(doc => `
                <div class="news-item">
                    <span class="news-date">${new Date(doc.created_at).toISOString().split('T')[0]}</span>
                    <span class="news-title">문서 #${doc.id} - ${doc.file_type} 처리 완료</span>
                </div>
            `).join('');
        }
        
    } catch (error) {
        console.error('Dashboard yuklash xatosi:', error);
    }
}

// ==================== DOCUMENTS ====================

async function loadDocuments() {
    const tbody = document.getElementById('documentsTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">로딩 중...</td></tr>';
    
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        const documents = await apiCall(`/ocr/documents?skip=0&limit=100&user_role=${userRole}`);
        
        if (documents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">문서를 찾을 수 없습니다</td></tr>';
            return;
        }
        
        tbody.innerHTML = documents.map(doc => `
            <tr>
                <td>${doc.id}</td>
                <td>${doc.file_type}</td>
                <td><span class="status-badge status-${doc.status}">${doc.status}</span></td>
                <td>${doc.confidence || 0}%</td>
                <td>${new Date(doc.created_at).toLocaleDateString('ko-KR')}</td>
                <td>
                    <button class="btn-small" onclick="viewDocument(${doc.id})">보기</button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" class="error">오류: ${error.message}</td></tr>`;
    }
}

async function viewDocument(id) {
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        const doc = await apiCall(`/ocr/documents/${id}?user_role=${userRole}`);
        
        console.log('Document data:', doc); // Debug
        console.log('Extracted data:', doc.extracted_data); // Debug
        
        const contentDiv = document.getElementById('documentDetailContent');
        const isAdmin = userRole === 'admin';
        
        // Extracted data
        const extractedData = doc.extracted_data || {};
        const table = extractedData.table || {};
        
        let html = `
            <h1>문서 #${doc.id}</h1>
            <div class="document-info-card">
                <h3>기본 정보</h3>
                <p><strong>파일 유형:</strong> ${doc.file_type}</p>
                <p><strong>상태:</strong> ${doc.status}</p>
                <p><strong>신뢰도:</strong> ${doc.confidence || 0}%</p>
                <p><strong>생성일:</strong> ${new Date(doc.created_at).toLocaleString('ko-KR')}</p>
            </div>
        `;
        
        // Table data (agar bor bo'lsa)
        if (table.rows && table.rows.length > 0) {
            html += `
                <div class="table-section">
                    <h3>표 데이터</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <th>철</th>
                                <th>동</th>
                                <th>합계</th>
                                ${table.rows[0].flags ? '<th>플래그</th>' : ''}
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
                    <h3>원본 텍스트 (관리자 전용)</h3>
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
                    <h3>전체 JSON 데이터 (관리자 전용)</h3>
                    <pre class="raw-text">${escapeHtml(jsonString)}</pre>
                    ${Object.keys(jsonData).length === 0 ? '<p style="color: #999; margin-top: 10px;">⚠️ 추출된 데이터가 없습니다</p>' : ''}
                </div>
            `;
        }
        
        contentDiv.innerHTML = html;
        showPage('documentDetail');
        
    } catch (error) {
        console.error('문서 로드 오류:', error);
        alert('문서 로드 오류: ' + error.message);
    }
}

// HTML escape funksiyasi
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== UPLOAD ====================

async function handleUpload(e) {
    e.preventDefault();
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
        alert('문서가 성공적으로 업로드되었습니다!');
        fileInput.value = '';
        
        // Documents sahifasiga o'tish
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

// ==================== ADMIN PANEL ====================

async function loadAdminPanel() {
    try {
        const username = localStorage.getItem('username') || 'admin';
        const role = localStorage.getItem('user_role') || 'admin';
        
        // Profile ma'lumotlarini yuklash
        document.getElementById('adminProfileUsername').value = username;
        document.getElementById('adminProfilePhone').value = '-';
        document.getElementById('adminProfileEmail').value = '-';
        
    } catch (error) {
        console.error('Admin panel yuklash xatosi:', error);
    }
}

// ==================== PROFILE ====================

// loadProfile funksiyasi olib tashlandi - endi loadAdminPanel ishlatiladi

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', () => {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Signup form
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // Show signup form
    document.getElementById('showSignup').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginFormContainer').style.display = 'none';
        document.getElementById('signupFormContainer').style.display = 'block';
    });
    
    // Show login form
    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('signupFormContainer').style.display = 'none';
        document.getElementById('loginFormContainer').style.display = 'block';
    });
    
    // Logout button (sidebar)
    const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener('click', handleLogout);
    }
    
    // Top navigation links (nav-link-modern)
    document.querySelectorAll('.nav-link-modern').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                showPage(page);
            }
        });
    });
    
    // Sidebar navigation links
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                showPage(page);
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
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    
    // Navigation menu toggle function
    function toggleNavMenu() {
        if (navLinks) {
            const isActive = navLinks.classList.toggle('active');
            // Body scroll'ni to'xtatish/yechish
            if (isActive && window.innerWidth <= 768) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        }
    }
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNavMenu();
        });
    }
    
    // Sidebar toggle (mobile)
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            if (sidebarOverlay) {
                sidebarOverlay.classList.toggle('active');
            }
            // Body scroll'ni to'xtatish/yechish
            if (sidebar.classList.contains('active') && window.innerWidth <= 768) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
    
    // Overlay bosilganda sidebar'ni yopish
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
    
    // Navigation menu link'lariga click qilganda menu'ni yopish
    if (navLinks) {
        navLinks.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link-modern') && window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Sidebar'ni yopish (link bosilganda)
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Nav links'ni yopish (link bosilganda - mobile)
    const topNavLinks = document.querySelectorAll('.nav-links-modern .nav-link-modern');
    topNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Window resize - mobile menu'ni yopish
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            if (navLinks) navLinks.classList.remove('active');
            if (sidebar) sidebar.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Click outside navigation menu to close it
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const isClickInsideNav = navLinks && (navLinks.contains(e.target) || e.target === mobileMenuToggle);
            const isClickInsideSidebar = sidebar && (sidebar.contains(e.target) || e.target === mobileMenuToggle);
            
            if (!isClickInsideNav && navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
            
            if (!isClickInsideSidebar && sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
    
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
    
    // Check authentication
    checkAuth();
});
