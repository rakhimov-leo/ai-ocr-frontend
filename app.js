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
        
        // Saved page'ni restore qilish yoki default dashboard'ga o'tish
        const savedPage = localStorage.getItem('currentPage') || 'dashboard';
        showPage(savedPage);
    } else {
        // Token yo'q bo'lsa, login screen'ni ko'rsatish
        const loginScreen = document.getElementById('loginScreen');
        const appScreen = document.getElementById('appScreen');
        
        if (loginScreen) loginScreen.classList.add('active');
        if (appScreen) appScreen.classList.remove('active');
        
        // Clear any stale data
        currentUser = null;
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
        tbody.innerHTML = sortedDocuments.map((doc, index) => `
            <tr>
                <td>${totalDocs - index}</td>
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
        
        // Passport ma'lumotlarini ko'rsatish (agar passport bo'lsa)
        if (doc.file_type === 'passport' || extractedData.passport || extractedData.simplified || extractedData.fields) {
            const passportHtml = formatPassportData(extractedData, isAdmin, doc.id);
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
                    <button class="btn-primary" onclick="openEditPassportModal(${doc.id})" style="padding: 10px 20px;">
                        수정 (Tahrirlash)
                    </button>
                ` : `
                    <button class="btn-primary" onclick="openEditDocumentModal(${doc.id})" style="padding: 10px 20px;">
                        수정 (Tahrirlash)
                    </button>
                `}
                <button class="btn-danger" onclick="deleteDocument(${doc.id})" style="padding: 10px 20px;">
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
    
    // Helper function: field value'ni olish va tozalash
    const getFieldValue = (fieldName, altNames = []) => {
        let rawValue = '';
        
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
        // Fields format
        else {
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
        
        // Tozalash
        return cleanFieldValue(rawValue);
    };
    
    // Ma'lumotlarni topish (barcha variantlarni tekshirish)
    let surname = getFieldValue('surname', ['familiya']);
    let givenName = getFieldValue('given_name', ['given_names', 'ism']);
    let passportNo = getFieldValue('passport_no', ['passport_number', 'passport_raqami']);
    let dateOfBirth = getFieldValue('date_of_birth', ['dob', 'tugilgan_sanasi']);
    let dateOfIssue = getFieldValue('date_of_issue', ['issue_date', 'berilgan_vaqti']);
    let dateOfExpiry = getFieldValue('date_of_expiry', ['expiry', 'amal_qilish_muddati']);
    let nationality = getFieldValue('nationality', ['millati']);
    let sex = getFieldValue('sex', ['jinsi']);
    
    // Agar ma'lumotlar bo'sh bo'lsa, qaytarish
    // Lekin to'liq bo'lmasa ham, mavjud ma'lumotlarni ko'rsatish
    const hasAnyData = surname || givenName || passportNo || dateOfBirth || dateOfIssue || dateOfExpiry;
    if (!hasAnyData) {
        return '';
    }
    
    // Mask qilish (admin bo'lmasa va allaqachon mask qilinmagan bo'lsa)
    const surnameMasked = isAlreadyMasked(surname);
    const givenNameMasked = isAlreadyMasked(givenName);
    const passportNoMasked = isAlreadyMasked(passportNo);
    
    const maskedSurname = surname ? maskSurname(String(surname), isAdmin, surnameMasked) : '';
    const maskedGivenName = givenName ? maskGivenName(String(givenName), isAdmin, givenNameMasked) : '';
    const maskedPassportNo = passportNo ? maskPassportNumber(String(passportNo), isAdmin, passportNoMasked) : '';
    
    let html = `
        <div class="passport-section">
            <h3>여권 정보</h3>
            <div class="passport-data-grid">
    `;
    
    if (surname) {
        html += `
            <div class="passport-field">
                <span class="field-label">성 (Фамилия):</span>
                <span class="field-value ${!isAdmin && surname ? 'masked' : ''}">${maskedSurname || '-'}</span>
            </div>
        `;
    }
    
    if (givenName) {
        html += `
            <div class="passport-field">
                <span class="field-label">이름 (Исм):</span>
                <span class="field-value ${!isAdmin && givenName ? 'masked' : ''}">${maskedGivenName || '-'}</span>
            </div>
        `;
    }
    
    if (passportNo) {
        html += `
            <div class="passport-field">
                <span class="field-label">여권 번호:</span>
                <span class="field-value ${!isAdmin && passportNo ? 'masked' : ''}">${maskedPassportNo || '-'}</span>
            </div>
        `;
    }
    
    if (dateOfBirth) {
        html += `
            <div class="passport-field">
                <span class="field-label">생년월일:</span>
                <span class="field-value">${dateOfBirth || '-'}</span>
            </div>
        `;
    }
    
    if (dateOfIssue) {
        html += `
            <div class="passport-field">
                <span class="field-label">발급일:</span>
                <span class="field-value">${dateOfIssue || '-'}</span>
            </div>
        `;
    }
    
    if (dateOfExpiry) {
        html += `
            <div class="passport-field">
                <span class="field-label">만료일:</span>
                <span class="field-value">${dateOfExpiry || '-'}</span>
            </div>
        `;
    }
    
    if (nationality) {
        html += `
            <div class="passport-field">
                <span class="field-label">국적:</span>
                <span class="field-value">${nationality || '-'}</span>
            </div>
        `;
    }
    
    if (sex) {
        html += `
            <div class="passport-field">
                <span class="field-label">성별:</span>
                <span class="field-value">${sex || '-'}</span>
            </div>
        `;
    }
    
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
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// ==================== EDIT PASSPORT ====================

let currentEditingDocumentId = null;

function openEditPassportModal(documentId) {
    currentEditingDocumentId = documentId;
    const modal = document.getElementById('editPassportModal');
    const errorDiv = document.getElementById('editPassportError');
    errorDiv.style.display = 'none';
    
    // Document ma'lumotlarini yuklash va form'ni to'ldirish
    loadDocumentForEdit(documentId);
    
    modal.style.display = 'flex';
}

function closeEditPassportModal() {
    const modal = document.getElementById('editPassportModal');
    modal.style.display = 'none';
    currentEditingDocumentId = null;
}

async function loadDocumentForEdit(documentId) {
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        const doc = await apiCall(`/ocr/documents/${documentId}?user_role=${userRole}`);
        
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
        
        // Form'ni to'ldirish (tozalangan qiymatlar bilan)
        document.getElementById('editSurname').value = getFieldValue('surname', ['familiya']) || '';
        document.getElementById('editGivenName').value = getFieldValue('given_name', ['given_names', 'ism']) || '';
        document.getElementById('editPassportNo').value = getFieldValue('passport_no', ['passport_number', 'passport_raqami']) || '';
        document.getElementById('editDateOfBirth').value = getFieldValue('date_of_birth', ['dob', 'tugilgan_sanasi']) || '';
        document.getElementById('editDateOfIssue').value = getFieldValue('date_of_issue', ['issue_date', 'berilgan_vaqti']) || '';
        document.getElementById('editDateOfExpiry').value = getFieldValue('date_of_expiry', ['expiry', 'amal_qilish_muddati']) || '';
        document.getElementById('editNationality').value = getFieldValue('nationality', ['millati']) || '';
        document.getElementById('editSex').value = getFieldValue('sex', ['jinsi']) || '';
        
    } catch (error) {
        console.error('Document yuklash xatosi:', error);
        alert('문서 로드 오류: ' + error.message);
    }
}

async function savePassportData() {
    if (!currentEditingDocumentId) {
        alert('문서 ID를 찾을 수 없습니다.');
        return;
    }
    
    const errorDiv = document.getElementById('editPassportError');
    errorDiv.style.display = 'none';
    
    // Form ma'lumotlarini yig'ish
    const updatedData = {
        fields: {
            surname: {
                value: document.getElementById('editSurname').value.trim(),
                confidence: 100.0
            },
            given_names: {
                value: document.getElementById('editGivenName').value.trim(),
                confidence: 100.0
            },
            passport_number: {
                value: document.getElementById('editPassportNo').value.trim(),
                confidence: 100.0
            },
            date_of_birth: {
                value: document.getElementById('editDateOfBirth').value.trim(),
                confidence: 100.0
            },
            date_of_issue: {
                value: document.getElementById('editDateOfIssue').value.trim(),
                confidence: 100.0
            },
            date_of_expiry: {
                value: document.getElementById('editDateOfExpiry').value.trim(),
                confidence: 100.0
            },
            nationality: {
                value: document.getElementById('editNationality').value.trim(),
                confidence: 100.0
            },
            sex: {
                value: document.getElementById('editSex').value.trim(),
                confidence: 100.0
            }
        }
    };
    
    try {
        const userRole = localStorage.getItem('user_role') || 'user';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/ocr/documents/${currentEditingDocumentId}?user_role=${userRole}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                extracted_data: updatedData
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '저장 오류');
        }
        
        // Muvaffaqiyatli saqlandi
        alert('문서가 성공적으로 저장되었습니다!');
        closeEditPassportModal();
        
        // Document'ni qayta yuklash
        await viewDocument(currentEditingDocumentId);
        
    } catch (error) {
        console.error('저장 오류:', error);
        errorDiv.textContent = error.message || '저장 중 오류가 발생했습니다.';
        errorDiv.style.display = 'block';
    }
}

// ==================== DELETE DOCUMENT ====================

async function deleteDocument(documentId) {
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
}

// ==================== EDIT DOCUMENT (Boshqa turlar uchun) ====================

function openEditDocumentModal(documentId) {
    // Hozircha faqat passport uchun edit modal mavjud
    // Boshqa turlar uchun ham qo'shish mumkin
    alert('이 문서 유형의 편집 기능은 아직 개발 중입니다.');
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
    document.querySelectorAll('.nav-link-modern').forEach(link => {
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
        checkAuth();
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
});
