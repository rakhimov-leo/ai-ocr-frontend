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
        
        // Home page'ga o'tish (default)
        showPage('dashboard');
        
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

// Logout - User va Admin uchun
function handleLogout() {
    // Barcha localStorage ma'lumotlarini tozalash
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    
    // Current user'ni null qilish
    currentUser = null;
    currentPage = 'dashboard';
    
    // App screen'ni yashirish, login screen'ni ko'rsatish
    const appScreen = document.getElementById('appScreen');
    const loginScreen = document.getElementById('loginScreen');
    
    if (appScreen) appScreen.classList.remove('active');
    if (loginScreen) loginScreen.classList.add('active');
    
    // Form'larni tozalash
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) loginForm.reset();
    if (signupForm) signupForm.reset();
    
    // Login form'ni ko'rsatish
    const loginFormContainer = document.getElementById('loginFormContainer');
    const signupFormContainer = document.getElementById('signupFormContainer');
    
    if (loginFormContainer) loginFormContainer.style.display = 'block';
    if (signupFormContainer) signupFormContainer.style.display = 'none';
    
    // Error message'larni yashirish
    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');
    
    if (loginError) loginError.style.display = 'none';
    if (signupError) signupError.style.display = 'none';
    
    // Navigation menu'larni yopish (mobile uchun)
    const navLinks = document.getElementById('navLinks');
    
    if (navLinks) navLinks.classList.remove('active');
    if (document.body) document.body.classList.remove('menu-open');
    
    // Profile dropdown'ni yopish
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) profileDropdown.classList.remove('active');
    const profileDropdownOverlay = document.getElementById('profileDropdownOverlay');
    if (profileDropdownOverlay) profileDropdownOverlay.classList.remove('active');
    
    // Console'da log qilish
    console.log('Logout muvaffaqiyatli');
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
// Check authentication on load
function checkAuth() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user_role');
    const username = localStorage.getItem('username');
    
    console.log('checkAuth called:', { token: !!token, role, username });
    
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
        
        // Refresh'da current page'ni restore qilish
        // Kichik kutish - DOM to'liq yuklanguncha
        setTimeout(() => {
            // Default: dashboard (homepage)
            const savedPage = localStorage.getItem('currentPage') || 'dashboard';
            
            // Barcha page'larni yashirish
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            
            // Tanlangan page'ni ko'rsatish
            const targetPage = document.getElementById(`${savedPage}Page`);
            if (targetPage) {
                targetPage.classList.add('active');
            } else {
                // Agar page topilmasa, dashboard'ni ko'rsatish
                const dashboardPage = document.getElementById('dashboardPage');
                if (dashboardPage) {
                    dashboardPage.classList.add('active');
                }
            }
            
            // showPage funksiyasini chaqirish (navigation va boshqa ishlarni bajarish uchun)
            showPage(savedPage);
        }, 100);
    } else {
        // Token yo'q bo'lsa ham, homepage'ga o'tkazish (login screen ko'rsatilmaydi)
        const loginScreen = document.getElementById('loginScreen');
        const appScreen = document.getElementById('appScreen');
        
        if (loginScreen) loginScreen.classList.remove('active');
        if (appScreen) appScreen.classList.add('active');
        
        // Clear any stale data
        currentUser = null;
        
        // Homepage'ga o'tkazish - DOM to'liq yuklanguncha kutish
        setTimeout(() => {
            // Barcha page'larni yashirish
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            
            // Dashboard page'ni ko'rsatish
            const dashboardPage = document.getElementById('dashboardPage');
            if (dashboardPage) {
                dashboardPage.classList.add('active');
                console.log('✅ Dashboard page activated');
            } else {
                console.error('❌ Dashboard page not found!');
            }
            
            // showPage funksiyasini ham chaqirish (navigation va boshqa ishlarni bajarish uchun)
            if (typeof showPage === 'function') {
                showPage('dashboard');
            }
            
            // Dashboard ma'lumotlarini yuklash
            if (typeof loadDashboard === 'function') {
                loadDashboard();
            }
        }, 200);
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
        const errText = await response.text();
        if (response.status === 401) {
            handleLogout();
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
    // Current page'ni localStorage'ga saqlash (refresh uchun)
    localStorage.setItem('currentPage', pageName);
    
    // Sahifa yuklanganda ma'lumotlarni yuklash
    if (pageName === 'dashboard') {
        loadDashboard();
    } else if (pageName === 'documents') {
        loadDocuments();
    } else if (pageName === 'admin') {
        loadAdminPanel();
    } else if (pageName === 'statistics') {
        loadStatistics();
    }
}

// ==================== DASHBOARD ====================

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
        
        // News list yangilash - Responsive Grid bilan (Clean Code tamoyili)
        const newsList = document.querySelector('.news-list');
        if (newsList) {
            if (documents.length > 0) {
                // Eng so'nggi document'larni news sifatida ko'rsatish
                const latestDocs = documents.slice(0, 6); // Ko'proq item'lar uchun
                
                // Clean Code: map() funksiyasi orqali kodni qisqartirish va optimallashtirish
                newsList.innerHTML = latestDocs.map((doc, index) => {
                    const date = new Date(doc.created_at).toISOString().split('T')[0];
                    // File type'ni format qilish
                    const fileTypeFormatted = doc.file_type || '기타';
                    const title = `문서 #${doc.id} - ${fileTypeFormatted} 처리 완료`;
                    
                    // Click event uchun onclick qo'shish
                    return `
                        <div class="news-item" onclick="viewDocument(${doc.id})" data-doc-id="${doc.id}">
                            <span class="news-date">${date}</span>
                            <span class="news-title">${title}</span>
                </div>
                    `;
                }).join('');
            } else {
                // Agar document'lar bo'lmasa - empty state
                newsList.innerHTML = `
                    <div class="news-item" style="grid-column: 1 / -1; text-align: center; padding: 30px; background: #f8f9fa;">
                        <span class="news-title" style="color: #999; font-weight: 400;">아직 뉴스가 없습니다</span>
                    </div>
                `;
            }
        }
        
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
        
        // Documentlarni yangi birinchi, eski oxirida bo'lishi uchun teskari tartibda saralash
        // created_at yoki id bo'yicha teskari tartib (descending) - yangi birinchi
        const sortedDocuments = [...documents].sort((a, b) => {
            // Avval created_at bo'yicha tekshirish (yangi birinchi - descending)
            if (a.created_at && b.created_at) {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                // Teskari tartib: yangi (katta vaqt) birinchi, eski (kichik vaqt) oxirida
                return dateB - dateA;
            }
            // Agar created_at yo'q bo'lsa, id bo'yicha teskari tartib (katta id birinchi - yangi)
            return (b.id || 0) - (a.id || 0);
        });
        
        // Har bir user uchun documentlar teskari raqamlanadi:
        // Eng yangi document eng katta raqam bilan (documents.length), eng eski document 1-raqam bilan
        const totalDocs = sortedDocuments.length;
        tbody.innerHTML = sortedDocuments.map((doc, index) => {
            const docId = doc.id ?? doc._id;
            return `
            <tr>
                <td>${totalDocs - index}</td>
                <td>${doc.file_type}</td>
                <td><span class="status-badge status-${doc.status}">${doc.status}</span></td>
                <td>${doc.confidence || 0}%</td>
                <td>${new Date(doc.created_at).toLocaleDateString('ko-KR')}</td>
                <td>
                    <button class="btn-small" onclick="viewDocument(${docId != null ? JSON.stringify(docId) : 'null'})">보기</button>
                </td>
            </tr>
        `;
        }).join('');
        
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" class="error">오류: ${error.message}</td></tr>`;
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
                            <p>이미지를 불러올 수 없습니다</p>
                            <p style="font-size: 0.85em; margin-top: 10px;">URL: ${imageUrl}</p>
                        </div>
                        <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 5px; font-size: 0.85em; pointer-events: none;">
                            🔍 클릭하여 확대
                        </div>
                    </div>
                ` : `
                    <div style="padding: 40px; text-align: center; color: #999; border: 2px dashed #ddd; border-radius: 8px;">
                        <p>이미지를 불러올 수 없습니다</p>
                        <p style="font-size: 0.85em; margin-top: 10px;">파일 경로: ${doc.file_path || 'N/A'}</p>
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
        
        // Edit va Delete tugmalari (barcha user'lar uchun)
        html += `
            <div class="document-actions" style="margin-top: 30px; display: flex; gap: 15px; justify-content: flex-end;">
                ${doc.file_type === 'passport' ? `
                    <button class="btn-primary" onclick="openEditPassportModal(${docId})" style="padding: 10px 20px;">
                        수정 (Tahrirlash)
                    </button>
                ` : `
                    <button class="btn-primary" onclick="openEditDocumentModal(${docId})" style="padding: 10px 20px;">
                        수정 (Tahrirlash)
                    </button>
                `}
                <button class="btn-danger" onclick="deleteDocument(${docId})" style="padding: 10px 20px;">
                    삭제 (O'chirish)
                </button>
            </div>
        `;
        
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
            errorDiv.innerHTML = '<p>이미지를 불러올 수 없습니다</p><p style="font-size: 0.85em; margin-top: 10px;">URL: ' + imageUrl + '</p>';
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
        const cleaned = cleanFieldValue(rawValue);
        
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
    let sex = getFieldValue('sex', ['jinsi']);
    let placeOfBirth = getFieldValue('place_of_birth', ['tugilgan_joyi']);
    let authority = getFieldValue('authority', ['kim_tomonidan_berilgan']);
    
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
            <h3>여권 정보</h3>
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
    
    // 1. SURNAME (성/Фамилия) - HAR DOIM
    const confIndSurname = getConfidenceIndicator(surnameConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">성 (Фамилия):</span>
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
    
    // 2. GIVEN NAME (이름/Исм) - HAR DOIM
    const confIndGivenName = getConfidenceIndicator(givenNameConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">이름 (Исм):</span>
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
    
    // 3. PATRONYMIC (부칭/Отасининг исми) - HAR DOIM
    const confIndPatronymic = getConfidenceIndicator(patronymicConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">부칭 (Отасининг исми):</span>
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
    
    // 4. DATE OF BIRTH (생년월일) - HAR DOIM
    const confIndDateOfBirth = getConfidenceIndicator(dateOfBirthConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">생년월일:</span>
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
    
    // 5. PASSPORT NUMBER (여권 번호) - HAR DOIM
    const confIndPassportNo = getConfidenceIndicator(passportNoConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">여권 번호:</span>
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
    
    // 6. DATE OF ISSUE (발급일) - HAR DOIM
    const confIndDateOfIssue = getConfidenceIndicator(dateOfIssueConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">발급일:</span>
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
    
    // 7. DATE OF EXPIRY (만료일) - HAR DOIM
    const confIndDateOfExpiry = getConfidenceIndicator(dateOfExpiryConfidence);
    const expiredClass = isExpired ? 'expired-warning' : '';
    html += `
        <div class="passport-field ${expiredClass}">
            <div class="field-label-row">
                <span class="field-label">만료일:</span>
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
            ${isExpired ? '<span style="color: #ef4444; font-weight: bold; font-size: 0.9em; margin-top: 5px; display: block;">⚠️ 만료됨</span>' : ''}
        </div>
    `;
    
    // 8. NATIONALITY (국적) - HAR DOIM
    const confIndNationality = getConfidenceIndicator(nationalityConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">국적:</span>
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
    
    // 9. SEX (성별) - HAR DOIM
    const confIndSex = getConfidenceIndicator(sexConfidence);
    const sexValue = sex || '';
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">성별:</span>
                ${confIndSex}
            </div>
            <select id="view-edit-sex-${documentId}" 
                    class="passport-edit-input" 
                    disabled 
                    data-field="sex"
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; font-size: 1em;">
                <option value="">선택하세요</option>
                <option value="M" ${sexValue === 'M' || sexValue === 'MALE' || sexValue === '남성' || sexValue.toUpperCase().includes('M') ? 'selected' : ''}>남성 (M)</option>
                <option value="F" ${sexValue === 'F' || sexValue === 'FEMALE' || sexValue === '여성' || sexValue.toUpperCase().includes('F') ? 'selected' : ''}>여성 (F)</option>
            </select>
        </div>
    `;
    
    // 10. PLACE OF BIRTH (출생지) - HAR DOIM
    const confIndPlaceOfBirth = getConfidenceIndicator(placeOfBirthConfidence);
    html += `
        <div class="passport-field">
            <div class="field-label-row">
                <span class="field-label">출생지:</span>
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
    
    // 11. AUTHORITY (발급 기관) - HAR DOIM
    const confIndAuthority = getConfidenceIndicator(authorityConfidence);
    html += `
        <div class="passport-field" style="grid-column: 1 / -1;">
            <div class="field-label-row">
                <span class="field-label">발급 기관:</span>
                ${confIndAuthority}
            </div>
            <textarea id="view-edit-authority-${documentId}" 
                      class="passport-edit-input" 
                      readonly 
                      data-field="authority"
                      style="width: 100%; min-height: 80px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; resize: vertical; font-size: 1em;">${(fullAuthority || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        </div>
    `;
    
    // Agar ma'lumotlar to'liq bo'lmasa, xabar ko'rsatish
    if (!surname && !givenName && !passportNo) {
        html += `
            <div class="passport-field" style="grid-column: 1 / -1;">
                <span class="field-value" style="color: #999; font-style: italic;">
                    ⚠️ 일부 정보만 추출되었습니다. 이미지를 다시 확인해주세요.
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
            <div class="passport-actions" style="margin-top: 30px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button class="btn-success" onclick="confirmPassportData(${documentId})" style="padding: 12px 30px;">
                    ✓ 확인 (Tasdiqlayman)
                </button>
                <button class="btn-warning" onclick="reprocessDocument(${documentId})" style="padding: 12px 30px;">
                    🔄 다시 스캔 (Qayta skanerlash)
                </button>
            </div>
        </div>
    `;
    } else {
        html += `
            </div>
            <p class="passport-confirmed-msg" style="margin-top: 20px; padding: 12px 20px; background: #ecfdf5; color: #065f46; border-radius: 8px; text-align: center;">
                ✓ 문서가 확인되었습니다. (Hujjat tasdiqlandi.)
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
            alert('저장 중 오류가 발생했습니다: ' + error.message);
        }
    }
};

// ==================== PASSPORT ACTIONS ====================

async function confirmPassportData(documentId) {
    if (!confirm('모든 정보가 정확한지 확인하셨습니까? (Barcha ma\'lumotlar to\'g\'riligiga ishonch hosil qildingizmi?)\n\n문서가 관리자에게 전송됩니다. (Hujjat admin\'ga yuboriladi.)')) {
        return;
    }
    
    // Darhol tugmalarni yashirish va "Hujjat tasdiqlandi" ko'rsatish (backend javobini kutmasdan)
    const actionsEl = document.querySelector('.passport-actions');
    if (actionsEl) {
        const msg = document.createElement('p');
        msg.className = 'passport-confirmed-msg';
        msg.setAttribute('style', 'margin-top: 20px; padding: 12px 20px; background: #ecfdf5; color: #065f46; border-radius: 8px; text-align: center;');
        msg.textContent = '✓ 문서가 확인되었습니다. (Hujjat tasdiqlandi.)';
        actionsEl.parentNode.replaceChild(msg, actionsEl);
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
            throw new Error(errBody.detail || '확인 오류');
        }
        
        alert('문서가 성공적으로 확인되었습니다!\n관리자가 검토할 때까지 기다려주세요.\n\n(Hujjat muvaffaqiyatli tasdiqlandi! Admin ko\'rib chiqishini kutib turing.)');
        
        // Sahifani qayta yuklash – keyingi safar ochganda ham tugmalar ko‘rinmasin
        await viewDocument(documentId);
    } catch (error) {
        console.error('확인 오류:', error);
        await viewDocument(documentId);
        alert('확인 중 오류가 발생했습니다: ' + error.message);
    }
}

async function reprocessDocument(documentId) {
    if (!confirm('이 문서를 다시 스캔하시겠습니까? (Bu hujjatni qayta skanerlashni xohlaysizmi?)')) {
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
            throw new Error(error.detail || '재처리 오류');
        }
        
        alert('문서가 다시 스캔되었습니다! 잠시 후 새로고침됩니다.');
        
        // 2 soniyadan keyin document'ni qayta yuklash
        setTimeout(async () => {
            await viewDocument(documentId);
        }, 2000);
        
    } catch (error) {
        console.error('재처리 오류:', error);
        alert('재처리 중 오류가 발생했습니다: ' + error.message);
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
            nationalityEl.value = fields.nationality?.value || fields.millati?.value || '';
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
        
        // Kichik kutish - modal to'liq yopilishini kutish
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Documents sahifasiga o'tish (showPage ichida loadDocuments() avtomatik chaqiriladi)
        console.log('🔄 Navigating to documents page...');
        showPage('documents');
        
        // Qo'shimcha tekshirish - agar sahifa ko'rinmasa, qayta urinish
        setTimeout(() => {
            const documentsPage = document.getElementById('documentsPage');
            if (documentsPage) {
                if (!documentsPage.classList.contains('active')) {
                    console.log('⚠️ Documents page not active, retrying...');
                    showPage('documents');
                } else {
                    console.log('✅ Documents page is active');
                }
            } else {
                console.error('❌ Documents page element not found');
            }
        }, 200);
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
            
            return cleanFieldValue(rawValue);
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

// Global scope'ga qo'shish (onclick event'lar uchun)
window.deleteDocument = async function(documentId) {
    // Tasdiqlash
    if (!confirm('정말로 이 문서를 삭제하시겠습니까? (Bu hujjatni o\'chirishni tasdiqlaysizmi?)\n\n참고: 문서는 관리자에게 여전히 표시됩니다.')) {
        return;
    }
    
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
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

function handleCalculator() {
    const age = parseInt(document.getElementById('calcAge')?.value);
    const years = parseInt(document.getElementById('calcYears')?.value);
    const income = parseInt(document.getElementById('calcIncome')?.value);
    
    if (!age || !years || !income) {
        alert('모든 필드를 입력하세요!');
        return;
    }
    
    // Simple pension calculation (example formula)
    const monthlyPension = Math.round((income * years * 0.02) / 12);
    const resultDiv = document.getElementById('calcResult');
    const resultValue = document.getElementById('calcResultValue');
    
    if (resultDiv && resultValue) {
        resultValue.textContent = `월 ${monthlyPension.toLocaleString()}원`;
        resultDiv.style.display = 'block';
    }
}

function handleChatSend() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(userMsg);
    
    chatInput.value = '';
    
    // Bot response (simple)
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot';
        botMsg.innerHTML = `<p>죄송합니다. 현재 채팅 기능이 준비 중입니다. 곧 이용하실 수 있습니다.</p>`;
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
}

async function loadStatistics() {
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        const documents = await apiCall(`/ocr/documents?skip=0&limit=100&user_role=${userRole}`);
        
        // Simple statistics
        const chartDiv = document.getElementById('statisticsChart');
        if (chartDiv) {
            const totalDocs = documents.length;
            const completedDocs = documents.filter(d => d.status === 'completed').length;
            const processingDocs = documents.filter(d => d.status === 'processing').length;
            
            chartDiv.innerHTML = `
                <div style="width: 100%;">
                    <h3>문서 통계</h3>
                    <p>전체 문서: ${totalDocs}개</p>
                    <p>처리 완료: ${completedDocs}개</p>
                    <p>처리 중: ${processingDocs}개</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Statistics yuklash xatosi:', error);
    }
}

// ==================== ADMIN PANEL ====================

async function loadAdminPanel() {
    try {
        const userRole = localStorage.getItem('user_role') || 'admin';
        
        // Admin bo'lmasa, boshqa sahifaga o'tkazish
        if (userRole !== 'admin') {
            showPage('dashboard');
            return;
        }
        
        // Barcha document'larni yuklash (admin uchun)
        await loadAdminDocuments();
        
    } catch (error) {
        console.error('Admin panel yuklash xatosi:', error);
        const adminList = document.getElementById('adminDocumentsList');
        if (adminList) {
            adminList.innerHTML = `<div class="error">오류: ${error.message}</div>`;
        }
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
    
    // Helper: status aniqlash
    const getStatus = (userValue, ocrValue) => {
        if (!userValue && !ocrValue) return { icon: '⚪', text: '없음', class: 'status-empty' };
        if (!userValue || !ocrValue) return { icon: '⚠️', text: '부분', class: 'status-partial' };
        const userClean = String(userValue).trim().toUpperCase();
        const ocrClean = String(ocrValue).trim().toUpperCase();
        if (userClean === ocrClean) {
            return { icon: '✅', text: '일치', class: 'status-match' };
        }
        return { icon: '❌', text: '불일치', class: 'status-mismatch' };
    };
    
    // Passport fields
    const fieldsToCompare = [
        { name: '성 (Фамилия)', field: 'surname', alt: ['familiya'] },
        { name: '이름 (Исм)', field: 'given_name', alt: ['given_names', 'ism'] },
        { name: '여권 번호', field: 'passport_no', alt: ['passport_number', 'passport_raqami'] },
        { name: '생년월일', field: 'date_of_birth', alt: ['dob', 'tugilgan_sanasi'] },
        { name: '만료일', field: 'date_of_expiry', alt: ['expiry', 'amal_qilish_muddati'] },
        { name: '국적', field: 'nationality', alt: ['millati'] },
    ];
    
    fieldsToCompare.forEach(({ name, field, alt }) => {
        const ocrValue = getFieldValue(field, alt);
        // User edited value (agar mavjud bo'lsa)
        const userValue = doc.edited_data && doc.edited_data[field] ? doc.edited_data[field] : null;
        const status = getStatus(userValue, ocrValue);
        
        // Muddati o'tgan tekshiruvi
        let statusIcon = status.icon;
        let statusText = status.text;
        if (field === 'date_of_expiry' && ocrValue) {
            try {
                const expiryDate = new Date(ocrValue);
                if (expiryDate < new Date()) {
                    statusIcon = '❌';
                    statusText = '만료됨';
                }
            } catch (e) {}
        }
        
        comparison.push({
            fieldName: name,
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
    
    // Logout button (top navigation dropdown)
    if (topNavLogoutBtn && profileDropdown) {
        topNavLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Dropdown'ni yopish
            closeProfileDropdown();
            // Logout qilish
            handleLogout();
        });
    }
    
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
    
    // Window load'da ham tekshirish (F5 uchun)
    window.addEventListener('load', () => {
        console.log('🔄 Window loaded, checking auth again...');
        checkAuth();
        
        // Qo'shimcha tekshirish - agar dashboard page ko'rinmasa
        setTimeout(() => {
            const dashboardPage = document.getElementById('dashboardPage');
            const appScreen = document.getElementById('appScreen');
            
            if (appScreen && appScreen.classList.contains('active')) {
                if (!dashboardPage || !dashboardPage.classList.contains('active')) {
                    console.log('⚠️ Dashboard not active, activating...');
                    // Barcha page'larni yashirish
                    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                    // Dashboard'ni ko'rsatish
                    if (dashboardPage) {
                        dashboardPage.classList.add('active');
                        showPage('dashboard');
                    }
                }
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
    
    // Sahifa yuklanganda currentPage'ni restore qilish
    const savedPage = localStorage.getItem('currentPage') || 'dashboard';
    console.log('📄 Restoring page from localStorage:', savedPage);
    showPage(savedPage);
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
    
    // Agar sahifa allaqachon yuklangan bo'lsa, currentPage'ni restore qilish
    const savedPage = localStorage.getItem('currentPage') || 'dashboard';
    const currentActivePage = document.querySelector('.page.active');
    if (!currentActivePage || currentActivePage.id !== `${savedPage}Page`) {
        console.log('📄 Restoring page on window load:', savedPage);
        showPage(savedPage);
    }
});
