// Translation System - 8 Languages Support
const translations = {
    ko: {
        // Navigation
        navHome: '홈',
        navDocuments: '문서',
        navUpload: '업로드',
        navMyPage: '내 페이지',
        // Login
        loginTitle: 'AI-OCR 시스템',
        loginSubtitle: '로그인',
        username: '사용자명',
        password: '비밀번호',
        loginButton: '로그인',
        signupButton: '회원가입',
        showSignup: '회원가입',
        showLogin: '로그인',
        testAccount: '테스트 계정:',
        testAdmin: '관리자: admin / admin123',
        testUser: '사용자: user / user123',
        needAccount: '새 계정이 필요하신가요?',
        haveAccount: '이미 계정이 있으신가요?',
        // Dashboard
        dashboardTitle: '대시보드',
        featuredTitle: '2026년 AI-OCR 시스템, 이렇게 달라집니다',
        featuredItem1: '○ (정확도 향상) OCR 정확도 95% → 98%',
        featuredItem2: '○ (사용자 신뢰 제고) 실시간 검증 시스템 도입',
        featuredItem3: '○ (성능 강화) 처리 속도 2배 향상',
        featuredDescription: '다국어 지원 확대, 저소득층 무료 서비스 대상 확대까지',
        featuredLink: '자세히 보기 >>',
        btnIndividual: '개인',
        btnWorkplace: '사업장 ↗',
        newsInfo: '소식·정보',
        btnMore: '더보기 +',
        tabNews: '새소식',
        tabPress: '보도자료',
        tabPromo: '홍보센터',
        tabJobs: '채용공고',
        newsUpdate: '2026년 AI-OCR 시스템 업데이트 안내',
        newsNewFeature: '새로운 문서 인식 기능 추가',
        newsService: '비대면 채널을 통한 서비스 안내',
        frequentServices: '자주 찾는 서비스',
        serviceMyDocs: '내 문서 알아보기',
        serviceBranch: '지사찾기',
        serviceForm: '서식찾기',
        serviceCalc: '계산기',
        serviceGuide: '알기쉬운 안내',
        serviceWebfax: '웹팩스 조회',
        serviceStats: '통계',
        serviceChat: '채팅상담',
        // Documents
        documentsTitle: '문서',
        btnNewDoc: '+ 새 문서',
        docId: 'ID',
        docFileType: '파일 유형',
        docStatus: '상태',
        docConfidence: '신뢰도',
        docCreated: '생성일',
        docAction: '작업',
        docView: '보기',
        docNotFound: '문서를 찾을 수 없습니다',
        docBack: '← 뒤로',
        docBasicInfo: '기본 정보',
        docTableData: '표 데이터',
        docDate: '날짜',
        docIron: '철',
        docCopper: '동',
        docTotal: '합계',
        docFlags: '플래그',
        docRawText: '원본 텍스트 (관리자 전용)',
        docFullJson: '전체 JSON 데이터 (관리자 전용)',
        docNoData: '⚠️ 추출된 데이터가 없습니다',
        // Upload
        uploadTitle: '문서 업로드',
        uploadFile: '파일',
        uploadFileType: '파일 유형',
        uploadLanguage: '언어',
        fileTypeOther: '기타',
        fileTypePassport: '여권',
        fileTypeId: '신분증',
        fileTypeApplication: '신청서',
        langAuto: '자동',
        langUzb: '우즈벡어',
        langEng: '영어',
        langKor: '한국어',
        uploadBtn: '업로드',
        uploadSuccess: '문서가 성공적으로 업로드되었습니다!',
        uploadSelectFile: '파일을 선택하세요!',
        // Admin/My Page
        myPageTitle: '내 페이지',
        myInfo: '내 정보',
        welcomeBack: '다시 만나서 반갑습니다!',
        profilePhoto: '사진',
        uploadPhoto: '프로필 사진 업로드',
        photoHint: '사진은 JPG, JPEG, PNG 또는 WebP 형식이어야 합니다!',
        userInfo: '사용자 정보',
        phone: '전화번호',
        email: '이메일',
        address: '주소',
        myProfile: '내 프로필',
        weGladToSeeYou: '다시 만나서 반갑습니다!',
        updateProfile: '프로필 업데이트',
        myDocuments: '내 문서',
        myFavorites: '내 즐겨찾기',
        recentlyVisited: '최근 방문',
        myFollowers: '내 팔로워',
        myFollowings: '내 팔로잉',
        pageBranchTitle: '지사찾기',
        pageBranchDesc: '가까운 지사를 찾아보세요.',
        pageBranchMapPlaceholder: '지도가 여기에 표시됩니다',
        pageFormsTitle: '서식찾기',
        pageFormsDesc: '필요한 서식을 다운로드하세요.',
        formPassportTitle: '여권 번역 서식',
        formPassportDesc: '여권 번역을 위한 공식 서식',
        formPensionTitle: '연금 신청서',
        formPensionDesc: '연금 신청을 위한 서식',
        formIdTitle: '신분증 번역 서식',
        formIdDesc: '신분증 번역을 위한 서식',
        btnPdfDownload: 'PDF 다운로드',
        pageCalcTitle: '연금 계산기 / Pensiya kalkulyatori',
        pageCalcDesc: '나이와 매월 연금 납부액을 입력하면 예상 월 연금을 계산합니다.',
        calcLabelAge: '나이 / Yoshi',
        calcLabelPayment: '월 납부액 / Pensiya uchun oylik badal',
        calcPlaceholder: '예: 35',
        calcBtn: '계산하기',
        pageGuideTitle: '알기쉬운 안내',
        guideSection1Title: '문서 제출 방법',
        guideSection1Text: '필요한 서류를 준비하여 온라인으로 제출하세요.',
        guideSection2Title: '처리 기간',
        guideSection2Text: '일반적으로 3-5 영업일 소요됩니다.',
        guideSection3Title: '문의',
        guideSection3Text: '추가 도움이 필요하시면 고객센터로 연락하세요.',
        pageWebfaxTitle: '웹팩스 조회',
        pageWebfaxSubtitle: '웹팩스 내역을 조회하세요.',
        webfaxDocLabel: '문서',
        webfaxProcessed: '처리 완료',
        pageStatsTitle: '통계',
        pageStatsSubtitle: '월별 통계를 확인하세요.',
        statsChartPlaceholder: '통계 차트가 여기에 표시됩니다',
        pageChatTitle: '채팅상담',
        chatWelcome: '안녕하세요! 무엇을 도와드릴까요?',
        chatPlaceholder: '메시지를 입력하세요...',
        chatSendBtn: '전송',
        // Common
        loading: '로딩 중...',
        error: '오류',
        success: '성공',
        logout: '로그아웃',
        // Passport / Document view
        passportInfo: '여권 정보',
        clickToEnlarge: '클릭하여 확대',
        imageLoadError: '이미지를 불러올 수 없습니다',
        noImagePath: '파일 경로',
        labelSurname: '성 (Фамилия)',
        labelGivenName: '이름 (Исм)',
        labelPatronymic: '부칭 (О타시닝 ис미)',
        labelDateOfBirth: '생년월일',
        labelPassportNo: '여권 번호',
        labelDateOfIssue: '발급일',
        labelDateOfExpiry: '만료일',
        labelNationality: '국적',
        labelSex: '성별',
        labelPlaceOfBirth: '출생지',
        labelAuthority: '발급 기관',
        expired: '만료됨',
        selectPlaceholder: '선택하세요',
        maleOption: '남성 (M)',
        femaleOption: '여성 (F)',
        partialDataWarning: '일부 정보만 추출되었습니다. 이미지를 다시 확인해주세요.',
        confirmButton: '확인 (Tasdiqlayman)',
        rescanButton: '다시 스캔 (Qayta skanerlash)',
        docConfirmedMsg: '문서가 확인되었습니다. (Hujjat tasdiqlandi.)',
        confirmDialogTitle: '모든 정보가 정확한지 확인하셨습니까? (Barcha ma\'lumotlar to\'g\'riligiga ishonch hosil qildingizmi?)',
        confirmDialogSent: '문서가 관리자에게 전송됩니다. (Hujjat admin\'ga yuboriladi.)',
        confirmSuccessAlert: '문서가 성공적으로 확인되었습니다! 관리자가 검토할 때까지 기다려주세요.',
        confirmErrorAlert: '확인 중 오류가 발생했습니다',
        rescanConfirm: '이 문서를 다시 스캔하시겠습니까? (Bu hujjatni qayta skanerlashni xohlaysizmi?)',
        rescanSuccessAlert: '문서가 다시 스캔되었습니다! 잠시 후 새로고침됩니다.',
        rescanErrorAlert: '재처리 중 오류가 발생했습니다',
        confirmErr: '확인 오류',
        btnEdit: '수정 (Tahrirlash)',
        btnDelete: '삭제 (O\'chirish)',
        docLoadError: '문서 로드 오류',
        saveErrorAlert: '저장 중 오류가 발생했습니다',
        statusMatch: '일치',
        statusMismatch: '불일치',
        statusPartial: '부분',
        statusNone: '없음',
        statusExpired: '만료됨',
        extraFieldsTitle: '기타 필드 (문서에 표시된 대로)'
    },
    en: {
        navHome: 'Home',
        navDocuments: 'Documents',
        navUpload: 'Upload',
        navMyPage: 'My Page',
        loginTitle: 'AI-OCR System',
        loginSubtitle: 'Login',
        username: 'Username',
        password: 'Password',
        loginButton: 'Login',
        signupButton: 'Sign Up',
        showSignup: 'Sign Up',
        showLogin: 'Login',
        testAccount: 'Test Account:',
        testAdmin: 'Admin: admin / admin123',
        testUser: 'User: user / user123',
        needAccount: 'Need a new account?',
        haveAccount: 'Already have an account?',
        dashboardTitle: 'Dashboard',
        featuredTitle: '2026 AI-OCR System, Here\'s What\'s Changing',
        featuredItem1: '○ (Accuracy Improvement) OCR Accuracy 95% → 98%',
        featuredItem2: '○ (User Trust Enhancement) Real-time Verification System Introduced',
        featuredItem3: '○ (Performance Boost) Processing Speed Doubled',
        featuredDescription: 'Expanded multilingual support, expanded free service for low-income earners',
        featuredLink: 'View Details >>',
        btnIndividual: 'Individual',
        btnWorkplace: 'Workplace ↗',
        newsInfo: 'News & Information',
        btnMore: 'More +',
        tabNews: 'News',
        tabPress: 'Press Release',
        tabPromo: 'Promotion Center',
        tabJobs: 'Job Postings',
        newsUpdate: '2026 AI-OCR System Update Notice',
        newsNewFeature: 'New Document Recognition Feature Added',
        newsService: 'Service Guide via Non-face-to-face Channels',
        frequentServices: 'Frequently Used Services',
        serviceMyDocs: 'My Documents',
        serviceBranch: 'Find Branch',
        serviceForm: 'Find Form',
        serviceCalc: 'Calculator',
        serviceGuide: 'Easy Guide',
        serviceWebfax: 'Web Fax Inquiry',
        serviceStats: 'Statistics',
        serviceChat: 'Chat Consultation',
        documentsTitle: 'Documents',
        btnNewDoc: '+ New Document',
        docId: 'ID',
        docFileType: 'File Type',
        docStatus: 'Status',
        docConfidence: 'Confidence',
        docCreated: 'Created',
        docAction: 'Action',
        docView: 'View',
        docNotFound: 'No documents found',
        docBack: '← Back',
        docBasicInfo: 'Basic Information',
        docTableData: 'Table Data',
        docDate: 'Date',
        docIron: 'Iron',
        docCopper: 'Copper',
        docTotal: 'Total',
        docFlags: 'Flags',
        docRawText: 'Raw Text (Admin Only)',
        docFullJson: 'Full JSON Data (Admin Only)',
        docNoData: '⚠️ No extracted data available',
        uploadTitle: 'Document Upload',
        uploadFile: 'File',
        uploadFileType: 'File Type',
        uploadLanguage: 'Language',
        fileTypeOther: 'Other',
        fileTypePassport: 'Passport',
        fileTypeId: 'ID Card',
        fileTypeApplication: 'Application',
        langAuto: 'Auto',
        langUzb: 'Uzbek',
        langEng: 'English',
        langKor: 'Korean',
        uploadBtn: 'Upload',
        uploadSuccess: 'Document uploaded successfully!',
        uploadSelectFile: 'Please select a file!',
        myPageTitle: 'My Page',
        myInfo: 'My Information',
        welcomeBack: 'Welcome back!',
        profilePhoto: 'Photo',
        uploadPhoto: 'Upload Profile Photo',
        photoHint: 'Photo must be in JPG, JPEG, PNG or WebP format!',
        userInfo: 'User Information',
        phone: 'Phone Number',
        email: 'Email',
        address: 'Address',
        myProfile: 'My Profile',
        weGladToSeeYou: 'We are glad to see you again!',
        updateProfile: 'Update Profile',
        myDocuments: 'My Documents',
        myFavorites: 'My Favorites',
        recentlyVisited: 'Recently Visited',
        myFollowers: 'My Followers',
        myFollowings: 'My Followings',
        pageBranchTitle: 'Find Branch',
        pageBranchDesc: 'Find a branch near you.',
        pageBranchMapPlaceholder: 'Map will be displayed here',
        pageFormsTitle: 'Find Form',
        pageFormsDesc: 'Download the forms you need.',
        formPassportTitle: 'Passport Translation Form',
        formPassportDesc: 'Official form for passport translation',
        formPensionTitle: 'Pension Application',
        formPensionDesc: 'Form for pension application',
        formIdTitle: 'ID Translation Form',
        formIdDesc: 'Official form for ID translation',
        btnPdfDownload: 'PDF Download',
        pageCalcTitle: 'Pension Calculator',
        pageCalcDesc: 'Enter your age and monthly pension contribution to estimate your monthly pension.',
        calcLabelAge: 'Age',
        calcLabelPayment: 'Monthly contribution',
        calcPlaceholder: 'e.g. 35',
        calcBtn: 'Calculate',
        pageGuideTitle: 'Easy Guide',
        guideSection1Title: 'How to Submit Documents',
        guideSection1Text: 'Prepare the required documents and submit them online.',
        guideSection2Title: 'Processing Time',
        guideSection2Text: 'Usually 3-5 business days.',
        guideSection3Title: 'Contact',
        guideSection3Text: 'Contact customer service for further assistance.',
        pageWebfaxTitle: 'Web Fax Inquiry',
        pageWebfaxSubtitle: 'Check your web fax history.',
        webfaxDocLabel: 'Document',
        webfaxProcessed: 'Processed',
        pageStatsTitle: 'Statistics',
        pageStatsSubtitle: 'View monthly statistics.',
        statsChartPlaceholder: 'Statistics chart will be displayed here',
        pageChatTitle: 'Chat Consultation',
        chatWelcome: 'Hello! How can I help you?',
        chatPlaceholder: 'Type your message...',
        chatSendBtn: 'Send',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        logout: 'Logout',
        passportInfo: 'Passport Information',
        clickToEnlarge: 'Click to enlarge',
        imageLoadError: 'Unable to load image',
        noImagePath: 'File path',
        labelSurname: 'Surname',
        labelGivenName: 'Given name',
        labelPatronymic: 'Patronymic',
        labelDateOfBirth: 'Date of birth',
        labelPassportNo: 'Passport number',
        labelDateOfIssue: 'Date of issue',
        labelDateOfExpiry: 'Date of expiry',
        labelNationality: 'Nationality',
        labelSex: 'Sex',
        labelPlaceOfBirth: 'Place of birth',
        labelAuthority: 'Authority',
        expired: 'Expired',
        selectPlaceholder: 'Select',
        maleOption: 'Male (M)',
        femaleOption: 'Female (F)',
        partialDataWarning: 'Only partial data was extracted. Please check the image again.',
        confirmButton: 'Confirm (Tasdiqlayman)',
        rescanButton: 'Rescan (Qayta skanerlash)',
        docConfirmedMsg: 'Document has been confirmed. (Hujjat tasdiqlandi.)',
        confirmDialogTitle: 'Have you verified all information? (Barcha ma\'lumotlar to\'g\'riligiga ishonch hosil qildingizmi?)',
        confirmDialogSent: 'The document will be sent to the administrator. (Hujjat admin\'ga yuboriladi.)',
        confirmSuccessAlert: 'Document confirmed successfully! Please wait for administrator review.',
        confirmErrorAlert: 'An error occurred while confirming',
        rescanConfirm: 'Do you want to rescan this document? (Bu hujjatni qayta skanerlashni xohlaysizmi?)',
        rescanSuccessAlert: 'Document has been rescanned! The page will refresh shortly.',
        rescanErrorAlert: 'An error occurred during reprocessing',
        confirmErr: 'Confirmation error',
        btnEdit: 'Edit (Tahrirlash)',
        btnDelete: 'Delete (O\'chirish)',
        docLoadError: 'Document load error',
        saveErrorAlert: 'An error occurred while saving',
        statusMatch: 'Match',
        statusMismatch: 'Mismatch',
        statusPartial: 'Partial',
        statusNone: 'None',
        statusExpired: 'Expired',
        extraFieldsTitle: 'Other fields (as on document)'
    },
    uz: {
        navHome: 'Bosh sahifa',
        navDocuments: 'Hujjatlar',
        navUpload: 'Yuklash',
        navMyPage: 'Mening sahifam',
        loginTitle: 'AI-OCR Tizimi',
        loginSubtitle: 'Kirish',
        username: 'Foydalanuvchi nomi',
        password: 'Parol',
        loginButton: 'Kirish',
        signupButton: 'Ro\'yxatdan o\'tish',
        showSignup: 'Ro\'yxatdan o\'tish',
        showLogin: 'Kirish',
        testAccount: 'Test hisob:',
        testAdmin: 'Admin: admin / admin123',
        testUser: 'Foydalanuvchi: user / user123',
        needAccount: 'Yangi hisob kerakmi?',
        haveAccount: 'Hisobingiz bormi?',
        dashboardTitle: 'Boshqaruv paneli',
        featuredTitle: '2026 AI-OCR Tizimi, Qanday O\'zgaradi',
        featuredItem1: '○ (Aniqlik yaxshilandi) OCR aniqlik 95% → 98%',
        featuredItem2: '○ (Foydalanuvchi ishonchi) Real vaqtda tekshirish tizimi joriy qilindi',
        featuredItem3: '○ (Ishlash tezligi) Qayta ishlash tezligi 2 barobar oshdi',
        featuredDescription: 'Ko\'p tilli qo\'llab-quvvatlash kengaytirildi, past daromadli fuqarolar uchun bepul xizmat kengaytirildi',
        featuredLink: 'Batafsil >>',
        btnIndividual: 'Shaxsiy',
        btnWorkplace: 'Ish joyi ↗',
        newsInfo: 'Yangiliklar va Ma\'lumot',
        btnMore: 'Ko\'proq +',
        tabNews: 'Yangiliklar',
        tabPress: 'Matbuot',
        tabPromo: 'Targ\'ibot markazi',
        tabJobs: 'Ish o\'rinlari',
        newsUpdate: '2026 AI-OCR Tizimi yangilanishi',
        newsNewFeature: 'Yangi hujjatni tanib olish funksiyasi qo\'shildi',
        newsService: 'Uzoqdan xizmat ko\'rsatish kanallari orqali qo\'llanma',
        frequentServices: 'Tez-tez ishlatiladigan xizmatlar',
        serviceMyDocs: 'Mening hujjatlarim',
        serviceBranch: 'Filial topish',
        serviceForm: 'Shakl topish',
        serviceCalc: 'Kalkulyator',
        serviceGuide: 'Oson qo\'llanma',
        serviceWebfax: 'Veb-faks so\'rov',
        serviceStats: 'Statistika',
        serviceChat: 'Chat maslahat',
        documentsTitle: 'Hujjatlar',
        btnNewDoc: '+ Yangi hujjat',
        docId: 'ID',
        docFileType: 'Fayl turi',
        docStatus: 'Holat',
        docConfidence: 'Ishonch',
        docCreated: 'Yaratilgan',
        docAction: 'Amal',
        docView: 'Ko\'rish',
        docNotFound: 'Hujjatlar topilmadi',
        docBack: '← Orqaga',
        docBasicInfo: 'Asosiy ma\'lumot',
        docTableData: 'Jadval ma\'lumotlari',
        docDate: 'Sana',
        docIron: 'Temir',
        docCopper: 'Mis',
        docTotal: 'Jami',
        docFlags: 'Bayroqlar',
        docRawText: 'Asl matn (faqat admin)',
        docFullJson: 'To\'liq JSON ma\'lumot (faqat admin)',
        docNoData: '⚠️ Ajratilgan ma\'lumotlar mavjud emas',
        uploadTitle: 'Hujjat yuklash',
        uploadFile: 'Fayl',
        uploadFileType: 'Fayl turi',
        uploadLanguage: 'Til',
        fileTypeOther: 'Boshqa',
        fileTypePassport: 'Pasport',
        fileTypeId: 'ID karta',
        fileTypeApplication: 'Ariza',
        langAuto: 'Avtomatik',
        langUzb: 'O\'zbek',
        langEng: 'Ingliz',
        langKor: 'Koreys',
        uploadBtn: 'Yuklash',
        uploadSuccess: 'Hujjat muvaffaqiyatli yuklandi!',
        uploadSelectFile: 'Iltimos, fayl tanlang!',
        myPageTitle: 'Mening sahifam',
        myInfo: 'Mening ma\'lumotlarim',
        welcomeBack: 'Qaytganingiz bilan!',
        profilePhoto: 'Rasm',
        uploadPhoto: 'Profil rasmini yuklash',
        photoHint: 'Rasm JPG, JPEG, PNG yoki WebP formatida bo\'lishi kerak!',
        userInfo: 'Foydalanuvchi ma\'lumotlari',
        phone: 'Telefon raqami',
        email: 'Email',
        address: 'Manzil',
        myProfile: 'Mening profilim',
        weGladToSeeYou: 'Qaytganingiz bilan xursandmiz!',
        updateProfile: 'Profilni yangilash',
        myDocuments: 'Mening hujjatlarim',
        myFavorites: 'Sevimlilarim',
        recentlyVisited: 'Yaqinda ko\'rilgan',
        myFollowers: 'Mening obunachilarim',
        myFollowings: 'Obuna bo\'lganlarim',
        pageBranchTitle: 'Filial topish',
        pageBranchDesc: 'Yaqin filialni toping.',
        pageBranchMapPlaceholder: 'Xarita shu yerda ko\'rsatiladi',
        pageFormsTitle: 'Shakl topish',
        pageFormsDesc: 'Kerakli shakllarni yuklab oling.',
        formPassportTitle: 'Pasport tarjima shakli',
        formPassportDesc: 'Pasport tarjimasi uchun rasmiy shakl',
        formPensionTitle: 'Pensiya arizasi',
        formPensionDesc: 'Pensiya uchun ariza shakli',
        formIdTitle: 'ID tarjima shakli',
        formIdDesc: 'ID tarjimasi uchun rasmiy shakl',
        btnPdfDownload: 'PDF yuklash',
        pageCalcTitle: 'Pensiya kalkulyatori',
        pageCalcDesc: 'Yoshingiz va oylik badalni kiriting – oylik pensiya hisoblanadi.',
        calcLabelAge: 'Yoshi',
        calcLabelPayment: 'Oylik badal',
        calcPlaceholder: 'Masalan: 35',
        calcBtn: 'Hisoblash',
        pageGuideTitle: 'Qisqa qo\'llanma',
        guideSection1Title: 'Hujjatlar qanday topshiriladi',
        guideSection1Text: 'Kerakli hujjatlarni tayyorlang va onlayn topshiring.',
        guideSection2Title: 'Qayta ishlash muddati',
        guideSection2Text: 'Odatda 3-5 ish kuni.',
        guideSection3Title: 'Aloqa',
        guideSection3Text: 'Yordam uchun mijozlar xizmatiga murojaat qiling.',
        pageWebfaxTitle: 'Veb-faks so\'rovlari',
        pageWebfaxSubtitle: 'Veb-faks tarixini ko\'ring.',
        webfaxDocLabel: 'Hujjat',
        webfaxProcessed: 'Qayta ishlangan',
        pageStatsTitle: 'Statistika',
        pageStatsSubtitle: 'Oylik statistikani ko\'ring.',
        statsChartPlaceholder: 'Statistika diagrammasi shu yerda ko\'rsatiladi',
        pageChatTitle: 'Chat orqali konsultatsiya',
        chatWelcome: 'Salom! Sizga qanday yordam bera olaman?',
        chatPlaceholder: 'Xabaringizni yozing...',
        chatSendBtn: 'Yuborish',
        loading: 'Yuklanmoqda...',
        error: 'Xato',
        success: 'Muvaffaqiyatli',
        logout: 'Chiqish',
        passportInfo: 'Pasport ma\'lumoti',
        clickToEnlarge: 'Kattalashtirish uchun bosing',
        imageLoadError: 'Rasm yuklanmadi',
        noImagePath: 'Fayl yo\'li',
        labelSurname: 'Familiya',
        labelGivenName: 'Ism',
        labelPatronymic: 'Otasining ismi',
        labelDateOfBirth: 'Tug\'ilgan sana',
        labelPassportNo: 'Pasport raqami',
        labelDateOfIssue: 'Berilgan sana',
        labelDateOfExpiry: 'Amal qilish muddati',
        labelNationality: 'Millati',
        labelSex: 'Jinsi',
        labelPlaceOfBirth: 'Tug\'ilgan joyi',
        labelAuthority: 'Bergan organ',
        expired: 'Muddati o\'tgan',
        selectPlaceholder: 'Tanlang',
        maleOption: 'Erkak (M)',
        femaleOption: 'Ayol (F)',
        partialDataWarning: 'Faqat qisman ma\'lumot ajratildi. Iltimos, rasmni qayta tekshiring.',
        confirmButton: 'Tasdiqlayman',
        rescanButton: 'Qayta skanerlash',
        docConfirmedMsg: 'Hujjat tasdiqlandi.',
        confirmDialogTitle: 'Barcha ma\'lumotlar to\'g\'riligiga ishonch hosil qildingizmi?',
        confirmDialogSent: 'Hujjat administratorga yuboriladi.',
        confirmSuccessAlert: 'Hujjat muvaffaqiyatli tasdiqlandi! Administrator ko\'rib chiqishini kutib turing.',
        confirmErrorAlert: 'Tasdiqlashda xato yuz berdi',
        rescanConfirm: 'Bu hujjatni qayta skanerlashni xohlaysizmi?',
        rescanSuccessAlert: 'Hujjat qayta skanerlandi! Tez orada sahifa yangilanadi.',
        rescanErrorAlert: 'Qayta ishlashda xato yuz berdi',
        confirmErr: 'Tasdiqlash xatosi',
        btnEdit: 'Tahrirlash',
        btnDelete: 'O\'chirish',
        docLoadError: 'Hujjat yuklash xatosi',
        saveErrorAlert: 'Saqlashda xato yuz berdi',
        statusMatch: 'Mos',
        statusMismatch: 'Mos emas',
        statusPartial: 'Qisman',
        statusNone: 'Yo\'q',
        statusExpired: 'Muddati o\'tgan',
        extraFieldsTitle: 'Qo\'shimcha maydonlar (hujjatda qanday yozilgan bo\'lsa)'
    },
    ru: {
        navHome: 'Главная',
        navDocuments: 'Документы',
        navUpload: 'Загрузка',
        navMyPage: 'Моя страница',
        loginTitle: 'AI-OCR Система',
        loginSubtitle: 'Вход',
        username: 'Имя пользователя',
        password: 'Пароль',
        loginButton: 'Войти',
        signupButton: 'Регистрация',
        showSignup: 'Регистрация',
        showLogin: 'Войти',
        testAccount: 'Тестовый аккаунт:',
        testAdmin: 'Админ: admin / admin123',
        testUser: 'Пользователь: user / user123',
        needAccount: 'Нужен новый аккаунт?',
        haveAccount: 'Уже есть аккаунт?',
        dashboardTitle: 'Панель управления',
        featuredTitle: 'Система AI-OCR 2026, Вот Что Изменится',
        featuredItem1: '○ (Улучшение точности) Точность OCR 95% → 98%',
        featuredItem2: '○ (Повышение доверия) Внедрена система проверки в реальном времени',
        featuredItem3: '○ (Усиление производительности) Скорость обработки удвоена',
        featuredDescription: 'Расширена многоязычная поддержка, расширена бесплатная услуга для малоимущих',
        featuredLink: 'Подробнее >>',
        btnIndividual: 'Индивидуальный',
        btnWorkplace: 'Рабочее место ↗',
        newsInfo: 'Новости и Информация',
        btnMore: 'Больше +',
        tabNews: 'Новости',
        tabPress: 'Пресс-релиз',
        tabPromo: 'Промо-центр',
        tabJobs: 'Вакансии',
        newsUpdate: 'Уведомление об обновлении системы AI-OCR 2026',
        newsNewFeature: 'Добавлена новая функция распознавания документов',
        newsService: 'Руководство по услугам через дистанционные каналы',
        frequentServices: 'Часто используемые услуги',
        serviceMyDocs: 'Мои документы',
        serviceBranch: 'Найти филиал',
        serviceForm: 'Найти форму',
        serviceCalc: 'Калькулятор',
        serviceGuide: 'Простое руководство',
        serviceWebfax: 'Запрос веб-факса',
        serviceStats: 'Статистика',
        serviceChat: 'Чат-консультация',
        documentsTitle: 'Документы',
        btnNewDoc: '+ Новый документ',
        docId: 'ID',
        docFileType: 'Тип файла',
        docStatus: 'Статус',
        docConfidence: 'Уверенность',
        docCreated: 'Создан',
        docAction: 'Действие',
        docView: 'Просмотр',
        docNotFound: 'Документы не найдены',
        docBack: '← Назад',
        docBasicInfo: 'Основная информация',
        docTableData: 'Данные таблицы',
        docDate: 'Дата',
        docIron: 'Железо',
        docCopper: 'Медь',
        docTotal: 'Итого',
        docFlags: 'Флаги',
        docRawText: 'Исходный текст (только для админа)',
        docFullJson: 'Полные JSON данные (только для админа)',
        docNoData: '⚠️ Извлеченные данные недоступны',
        uploadTitle: 'Загрузка документа',
        uploadFile: 'Файл',
        uploadFileType: 'Тип файла',
        uploadLanguage: 'Язык',
        fileTypeOther: 'Другое',
        fileTypePassport: 'Паспорт',
        fileTypeId: 'ID карта',
        fileTypeApplication: 'Заявление',
        langAuto: 'Авто',
        langUzb: 'Узбекский',
        langEng: 'Английский',
        langKor: 'Корейский',
        uploadBtn: 'Загрузить',
        uploadSuccess: 'Документ успешно загружен!',
        uploadSelectFile: 'Пожалуйста, выберите файл!',
        myPageTitle: 'Моя страница',
        myInfo: 'Моя информация',
        welcomeBack: 'С возвращением!',
        profilePhoto: 'Фото',
        uploadPhoto: 'Загрузить фото профиля',
        photoHint: 'Фото должно быть в формате JPG, JPEG, PNG или WebP!',
        userInfo: 'Информация о пользователе',
        phone: 'Номер телефона',
        email: 'Email',
        address: 'Адрес',
        myProfile: 'Мой профиль',
        weGladToSeeYou: 'Рады снова видеть вас!',
        updateProfile: 'Обновить профиль',
        myDocuments: 'Мои документы',
        myFavorites: 'Мои избранные',
        recentlyVisited: 'Недавно посещённые',
        myFollowers: 'Мои подписчики',
        myFollowings: 'Мои подписки',
        pageBranchTitle: 'Найти филиал',
        pageBranchDesc: 'Найдите филиал рядом с вами.',
        pageBranchMapPlaceholder: 'Карта будет отображена здесь',
        pageFormsTitle: 'Найти форму',
        pageFormsDesc: 'Скачайте нужные формы.',
        formPassportTitle: 'Форма перевода паспорта',
        formPassportDesc: 'Официальная форма для перевода паспорта',
        formPensionTitle: 'Заявление на пенсию',
        formPensionDesc: 'Форма заявления на пенсию',
        formIdTitle: 'Форма перевода ID',
        formIdDesc: 'Официальная форма для перевода ID',
        btnPdfDownload: 'Скачать PDF',
        pageCalcTitle: 'Калькулятор пенсии',
        pageCalcDesc: 'Введите возраст и ежемесячный взнос для расчёта предполагаемой пенсии.',
        calcLabelAge: 'Возраст',
        calcLabelPayment: 'Ежемесячный взнос',
        calcPlaceholder: 'напр. 35',
        calcBtn: 'Рассчитать',
        pageGuideTitle: 'Простое руководство',
        guideSection1Title: 'Как подать документы',
        guideSection1Text: 'Подготовьте необходимые документы и подайте их онлайн.',
        guideSection2Title: 'Срок обработки',
        guideSection2Text: 'Обычно 3-5 рабочих дней.',
        guideSection3Title: 'Контакты',
        guideSection3Text: 'Обратитесь в службу поддержки за помощью.',
        pageWebfaxTitle: 'Запрос веб-факса',
        pageWebfaxSubtitle: 'Просмотрите историю веб-факсов.',
        webfaxDocLabel: 'Документ',
        webfaxProcessed: 'Обработано',
        pageStatsTitle: 'Статистика',
        pageStatsSubtitle: 'Просмотр месячной статистики.',
        statsChartPlaceholder: 'График статистики будет отображён здесь',
        pageChatTitle: 'Чат-консультация',
        chatWelcome: 'Здравствуйте! Чем могу помочь?',
        chatPlaceholder: 'Введите сообщение...',
        chatSendBtn: 'Отправить',
        loading: 'Загрузка...',
        error: 'Ошибка',
        success: 'Успешно',
        logout: 'Выход',
        passportInfo: 'Информация о паспорте',
        clickToEnlarge: 'Нажмите для увеличения',
        imageLoadError: 'Не удалось загрузить изображение',
        noImagePath: 'Путь к файлу',
        labelSurname: 'Фамилия',
        labelGivenName: 'Имя',
        labelPatronymic: 'Отчество',
        labelDateOfBirth: 'Дата рождения',
        labelPassportNo: 'Номер паспорта',
        labelDateOfIssue: 'Дата выдачи',
        labelDateOfExpiry: 'Срок действия',
        labelNationality: 'Национальность',
        labelSex: 'Пол',
        labelPlaceOfBirth: 'Место рождения',
        labelAuthority: 'Орган выдачи',
        expired: 'Истёк',
        selectPlaceholder: 'Выберите',
        maleOption: 'Мужской (M)',
        femaleOption: 'Женский (F)',
        partialDataWarning: 'Извлечены только частичные данные. Проверьте изображение.',
        confirmButton: 'Подтвердить (Tasdiqlayman)',
        rescanButton: 'Повторное сканирование (Qayta skanerlash)',
        docConfirmedMsg: 'Документ подтверждён. (Hujjat tasdiqlandi.)',
        confirmDialogTitle: 'Вся информация верна? (Barcha ma\'lumotlar to\'g\'riligiga ishonch hosil qildingizmi?)',
        confirmDialogSent: 'Документ будет отправлен администратору. (Hujjat admin\'ga yuboriladi.)',
        confirmSuccessAlert: 'Документ успешно подтверждён! Ожидайте проверки администратором.',
        confirmErrorAlert: 'Ошибка при подтверждении',
        rescanConfirm: 'Повторно отсканировать этот документ? (Bu hujjatni qayta skanerlashni xohlaysizmi?)',
        rescanSuccessAlert: 'Документ отсканирован повторно! Страница обновится.',
        rescanErrorAlert: 'Ошибка при повторной обработке',
        confirmErr: 'Ошибка подтверждения',
        btnEdit: 'Изменить (Tahrirlash)',
        btnDelete: 'Удалить (O\'chirish)',
        docLoadError: 'Ошибка загрузки документа',
        saveErrorAlert: 'Ошибка при сохранении',
        statusMatch: 'Совпадает',
        statusMismatch: 'Не совпадает',
        statusPartial: 'Частично',
        statusNone: 'Нет',
        statusExpired: 'Истёк',
        extraFieldsTitle: 'Дополнительные поля (как в документе)'
    },
    mn: {
        navHome: 'Нүүр',
        navDocuments: 'Баримт бичиг',
        navUpload: 'Байршуулах',
        navMyPage: 'Миний хуудас',
        loginTitle: 'AI-OCR Систем',
        loginSubtitle: 'Нэвтрэх',
        username: 'Хэрэглэгчийн нэр',
        password: 'Нууц үг',
        loginButton: 'Нэвтрэх',
        signupButton: 'Бүртгүүлэх',
        showSignup: 'Бүртгүүлэх',
        showLogin: 'Нэвтрэх',
        testAccount: 'Туршилтын данс:',
        testAdmin: 'Админ: admin / admin123',
        testUser: 'Хэрэглэгч: user / user123',
        needAccount: 'Шинэ данс хэрэгтэй юу?',
        haveAccount: 'Данстай байна уу?',
        dashboardTitle: 'Хяналтын самбар',
        featuredTitle: '2026 AI-OCR Систем, Энэ Нь Хэрхэн Өөрчлөгдөнө',
        featuredItem1: '○ (Нарийвчлал сайжруулах) OCR нарийвчлал 95% → 98%',
        featuredItem2: '○ (Хэрэглэгчийн итгэл нэмэх) Бодит цагт баталгаажуулах систем нэвтрүүлсэн',
        featuredItem3: '○ (Гүйцэтгэл бэхжүүлэх) Боловсруулах хурд 2 дахин нэмэгдсэн',
        featuredDescription: 'Олон хэлний дэмжлэг өргөжүүлсэн, бага орлоготой иргэдэд үнэгүй үйлчилгээ өргөжүүлсэн',
        featuredLink: 'Дэлгэрэнгүй >>',
        btnIndividual: 'Хувь хүн',
        btnWorkplace: 'Ажлын байр ↗',
        newsInfo: 'Мэдээ, Мэдээлэл',
        btnMore: 'Илүү +',
        tabNews: 'Мэдээ',
        tabPress: 'Хэвлэлийн мэдээ',
        tabPromo: 'Сурталчилгааны төв',
        tabJobs: 'Ажлын байр',
        newsUpdate: '2026 AI-OCR Систем шинэчлэл',
        newsNewFeature: 'Шинэ баримт бичгийн таних функц нэмэгдсэн',
        newsService: 'Харилцан биш сувгаар үйлчилгээний заавар',
        frequentServices: 'Түгээмэл ашигладаг үйлчилгээ',
        serviceMyDocs: 'Миний баримт бичиг',
        serviceBranch: 'Салбар олох',
        serviceForm: 'Хэлбэр олох',
        serviceCalc: 'Тооцоолуур',
        serviceGuide: 'Ойлгомжтой заавар',
        serviceWebfax: 'Веб-факс асуулт',
        serviceStats: 'Статистик',
        serviceChat: 'Чат зөвлөгөө',
        documentsTitle: 'Баримт бичиг',
        btnNewDoc: '+ Шинэ баримт бичиг',
        docId: 'ID',
        docFileType: 'Файлын төрөл',
        docStatus: 'Төлөв',
        docConfidence: 'Итгэл',
        docCreated: 'Үүсгэсэн',
        docAction: 'Үйлдэл',
        docView: 'Харах',
        docNotFound: 'Баримт бичиг олдсонгүй',
        docBack: '← Буцах',
        docBasicInfo: 'Үндсэн мэдээлэл',
        docTableData: 'Хүснэгтийн өгөгдөл',
        docDate: 'Огноо',
        docIron: 'Төмөр',
        docCopper: 'Зэс',
        docTotal: 'Нийт',
        docFlags: 'Туг',
        docRawText: 'Түүхийн текст (зөвхөн админ)',
        docFullJson: 'Бүтэн JSON өгөгдөл (зөвхөн админ)',
        docNoData: '⚠️ Олборлосон өгөгдөл байхгүй',
        uploadTitle: 'Баримт бичиг байршуулах',
        uploadFile: 'Файл',
        uploadFileType: 'Файлын төрөл',
        uploadLanguage: 'Хэл',
        fileTypeOther: 'Бусад',
        fileTypePassport: 'Паспорт',
        fileTypeId: 'ID карт',
        fileTypeApplication: 'Өргөдөл',
        langAuto: 'Авто',
        langUzb: 'Узбек',
        langEng: 'Англи',
        langKor: 'Солонгос',
        uploadBtn: 'Байршуулах',
        uploadSuccess: 'Баримт бичиг амжилттай байршуулсан!',
        uploadSelectFile: 'Файл сонгоно уу!',
        myPageTitle: 'Миний хуудас',
        myInfo: 'Миний мэдээлэл',
        welcomeBack: 'Дахин уулзсанд баяртай!',
        profilePhoto: 'Зураг',
        uploadPhoto: 'Профайл зураг байршуулах',
        photoHint: 'Зураг JPG, JPEG, PNG эсвэл WebP форматтай байх ёстой!',
        userInfo: 'Хэрэглэгчийн мэдээлэл',
        phone: 'Утасны дугаар',
        email: 'Email',
        address: 'Хаяг',
        myProfile: 'Миний профайл',
        weGladToSeeYou: 'Дахин уулзсанд баярлая!',
        updateProfile: 'Профайл шинэчлэх',
        myDocuments: 'Миний баримтууд',
        myFavorites: 'Миний дуртай',
        recentlyVisited: 'Сүүлийн үзсэн',
        myFollowers: 'Миний дагагчид',
        myFollowings: 'Дагасан',
        pageBranchTitle: 'Салбар олох',
        pageBranchDesc: 'Ойролцоо салбар олоорой.',
        pageBranchMapPlaceholder: 'Газрын зураг энд харагдана',
        pageFormsTitle: 'Хэлбэр олох',
        pageFormsDesc: 'Хэрэгтэй хэлбэрээ татаж аваарай.',
        formPassportTitle: 'Паспорт орчуулгын хэлбэр',
        formPassportDesc: 'Паспорт орчуулгад зориулсан албан хэлбэр',
        formPensionTitle: 'Пенсийн өргөдөл',
        formPensionDesc: 'Пенсийн өргөдлийн хэлбэр',
        formIdTitle: 'ID орчуулгын хэлбэр',
        formIdDesc: 'ID орчуулгад зориулсан албан хэлбэр',
        btnPdfDownload: 'PDF татах',
        pageCalcTitle: 'Пенсийн тооцоолуур',
        pageCalcDesc: 'Нас, сарын төлбөрийг оруулаад сарын пенсийг тооцоолно.',
        calcLabelAge: 'Нас',
        calcLabelPayment: 'Сарын төлбөр',
        calcPlaceholder: 'жишээ: 35',
        calcBtn: 'Тооцоолох',
        pageGuideTitle: 'Ойлгомжтой заавар',
        guideSection1Title: 'Баримт яаж өгөх вэ',
        guideSection1Text: 'Шаардлагатай баримтуудаа бэлтгээд онлайнаар өгнө үү.',
        guideSection2Title: 'Боловсруулах хугацаа',
        guideSection2Text: 'Ихэвчлэн 3-5 ажлын өдөр.',
        guideSection3Title: 'Холбоо барих',
        guideSection3Text: 'Тусламж авахын тулд үйлчилгээний төвтэй холбогдоно уу.',
        pageWebfaxTitle: 'Веб-факс асуулт',
        pageWebfaxSubtitle: 'Веб-факсын түүхийг үзнэ үү.',
        webfaxDocLabel: 'Баримт',
        webfaxProcessed: 'Боловсруулсан',
        pageStatsTitle: 'Статистик',
        pageStatsSubtitle: 'Сарын статистик үзнэ үү.',
        statsChartPlaceholder: 'Статистикийн график энд харагдана',
        pageChatTitle: 'Чат зөвлөгөө',
        chatWelcome: 'Сайн байна уу! Чим яаж туслаж болох вэ?',
        chatPlaceholder: 'Мессежээ бичнэ үү...',
        chatSendBtn: 'Илгээх',
        loading: 'Ачааллаж байна...',
        error: 'Алдаа',
        success: 'Амжилттай',
        logout: 'Гарах',
        passportInfo: 'Паспортын мэдээлэл',
        clickToEnlarge: 'Томруулах',
        imageLoadError: 'Зураг ачааллахад алдаа',
        noImagePath: 'Файлын зам',
        labelSurname: 'Овог',
        labelGivenName: 'Нэр',
        labelPatronymic: 'Эцгийн нэр',
        labelDateOfBirth: 'Төрсөн огноо',
        labelPassportNo: 'Паспортын дугаар',
        labelDateOfIssue: 'Огноо',
        labelDateOfExpiry: 'Хүчинтэй хугацаа',
        labelNationality: 'Иргэншил',
        labelSex: 'Хүйс',
        labelPlaceOfBirth: 'Төрсөн газар',
        labelAuthority: 'Олгосон байгууллага',
        expired: 'Хугацаа дууссан',
        selectPlaceholder: 'Сонгоно уу',
        maleOption: 'Эрэгтэй (M)',
        femaleOption: 'Эмэгтэй (F)',
        partialDataWarning: 'Зөвхөн хэсэгчилсэн өгөгдөл олдлоо. Зургийг шалгана уу.',
        confirmButton: 'Баталгаажуулах (Tasdiqlayman)',
        rescanButton: 'Дахин скан хийх (Qayta skanerlash)',
        docConfirmedMsg: 'Баримт баталгаажлаа. (Hujjat tasdiqlandi.)',
        confirmDialogTitle: 'Бүх мэдээлэл зөв үү? (Barcha ma\'lumotlar to\'g\'riligiga ishonch hosil qildingizmi?)',
        confirmDialogSent: 'Баримт админ руу илгээгдэнэ. (Hujjat admin\'ga yuboriladi.)',
        confirmSuccessAlert: 'Баримт амжилттай баталгаажлаа! Админы шалгалтыг хүлээнэ үү.',
        confirmErrorAlert: 'Баталгаажуулахад алдаа гарлаа',
        rescanConfirm: 'Энэ баримтыг дахин скан хийх үү? (Bu hujjatni qayta skanerlashni xohlaysizmi?)',
        rescanSuccessAlert: 'Баримт дахин скан хийгдлээ! Уудсан дараа шинэчлэгдэнэ.',
        rescanErrorAlert: 'Дахин боловсруулахад алдаа гарлаа',
        confirmErr: 'Баталгаажуулалтын алдаа',
        btnEdit: 'Засах (Tahrirlash)',
        btnDelete: 'Устгах (O\'chirish)',
        docLoadError: 'Баримт ачааллах алдаа',
        saveErrorAlert: 'Хадгалахад алдаа гарлаа',
        statusMatch: 'Таарна',
        statusMismatch: 'Таарахгүй',
        statusPartial: 'Хэсэгчлэн',
        statusNone: 'Байхгүй',
        statusExpired: 'Хугацаа дууссан',
        extraFieldsTitle: 'Нэмэлт талбарууд'
    },
    zh: {
        navHome: '首页',
        navDocuments: '文档',
        navUpload: '上传',
        navMyPage: '我的页面',
        loginTitle: 'AI-OCR 系统',
        loginSubtitle: '登录',
        username: '用户名',
        password: '密码',
        loginButton: '登录',
        signupButton: '注册',
        showSignup: '注册',
        showLogin: '登录',
        testAccount: '测试账户:',
        testAdmin: '管理员: admin / admin123',
        testUser: '用户: user / user123',
        needAccount: '需要新账户？',
        haveAccount: '已有账户？',
        dashboardTitle: '仪表板',
        featuredTitle: '2026 AI-OCR 系统，变化如下',
        featuredItem1: '○ (准确度提升) OCR 准确度 95% → 98%',
        featuredItem2: '○ (用户信任提升) 引入实时验证系统',
        featuredItem3: '○ (性能增强) 处理速度提高2倍',
        featuredDescription: '扩大多语言支持，扩大低收入人群免费服务范围',
        featuredLink: '查看详情 >>',
        btnIndividual: '个人',
        btnWorkplace: '工作场所 ↗',
        newsInfo: '新闻与信息',
        btnMore: '更多 +',
        tabNews: '新闻',
        tabPress: '新闻稿',
        tabPromo: '宣传中心',
        tabJobs: '招聘公告',
        newsUpdate: '2026 AI-OCR 系统更新通知',
        newsNewFeature: '新增文档识别功能',
        newsService: '通过非面对面渠道的服务指南',
        frequentServices: '常用服务',
        serviceMyDocs: '我的文档',
        serviceBranch: '查找分支机构',
        serviceForm: '查找表格',
        serviceCalc: '计算器',
        serviceGuide: '简单指南',
        serviceWebfax: '网络传真查询',
        serviceStats: '统计',
        serviceChat: '聊天咨询',
        documentsTitle: '文档',
        btnNewDoc: '+ 新文档',
        docId: 'ID',
        docFileType: '文件类型',
        docStatus: '状态',
        docConfidence: '置信度',
        docCreated: '创建日期',
        docAction: '操作',
        docView: '查看',
        docNotFound: '未找到文档',
        docBack: '← 返回',
        docBasicInfo: '基本信息',
        docTableData: '表格数据',
        docDate: '日期',
        docIron: '铁',
        docCopper: '铜',
        docTotal: '总计',
        docFlags: '标志',
        docRawText: '原始文本（仅管理员）',
        docFullJson: '完整 JSON 数据（仅管理员）',
        docNoData: '⚠️ 无提取的数据',
        uploadTitle: '文档上传',
        uploadFile: '文件',
        uploadFileType: '文件类型',
        uploadLanguage: '语言',
        fileTypeOther: '其他',
        fileTypePassport: '护照',
        fileTypeId: '身份证',
        fileTypeApplication: '申请表',
        langAuto: '自动',
        langUzb: '乌兹别克语',
        langEng: '英语',
        langKor: '韩语',
        uploadBtn: '上传',
        uploadSuccess: '文档上传成功！',
        uploadSelectFile: '请选择文件！',
        myPageTitle: '我的页面',
        myInfo: '我的信息',
        welcomeBack: '欢迎回来！',
        profilePhoto: '照片',
        uploadPhoto: '上传个人资料照片',
        photoHint: '照片必须是 JPG、JPEG、PNG 或 WebP 格式！',
        userInfo: '用户信息',
        phone: '电话号码',
        email: '电子邮件',
        address: '地址',
        myProfile: '我的资料',
        weGladToSeeYou: '很高兴再次见到您！',
        updateProfile: '更新资料',
        myDocuments: '我的文件',
        myFavorites: '我的收藏',
        recentlyVisited: '最近访问',
        myFollowers: '我的粉丝',
        myFollowings: '我的关注',
        pageBranchTitle: '查找分支机构',
        pageBranchDesc: '查找您附近的分支机构。',
        pageBranchMapPlaceholder: '地图将在此显示',
        pageFormsTitle: '查找表格',
        pageFormsDesc: '下载所需的表格。',
        formPassportTitle: '护照翻译表格',
        formPassportDesc: '护照翻译用正式表格',
        formPensionTitle: '养老金申请表',
        formPensionDesc: '养老金申请用表格',
        formIdTitle: '身份证翻译表格',
        formIdDesc: '身份证翻译用正式表格',
        btnPdfDownload: '下载 PDF',
        pageCalcTitle: '养老金计算器',
        pageCalcDesc: '输入年龄和月缴金额以估算月养老金。',
        calcLabelAge: '年龄',
        calcLabelPayment: '月缴金额',
        calcPlaceholder: '例如：35',
        calcBtn: '计算',
        pageGuideTitle: '简单指南',
        guideSection1Title: '如何提交文件',
        guideSection1Text: '准备所需文件并在线提交。',
        guideSection2Title: '处理时间',
        guideSection2Text: '通常需要 3-5 个工作日。',
        guideSection3Title: '联系方式',
        guideSection3Text: '如需帮助请联系客服。',
        pageWebfaxTitle: '网络传真查询',
        pageWebfaxSubtitle: '查看网络传真历史记录。',
        webfaxDocLabel: '文件',
        webfaxProcessed: '已处理',
        pageStatsTitle: '统计',
        pageStatsSubtitle: '查看月度统计。',
        statsChartPlaceholder: '统计图表将在此显示',
        pageChatTitle: '聊天咨询',
        chatWelcome: '您好！有什么可以帮您？',
        chatPlaceholder: '输入消息...',
        chatSendBtn: '发送',
        loading: '加载中...',
        error: '错误',
        success: '成功',
        logout: '退出',
        passportInfo: '护照信息',
        clickToEnlarge: '点击放大',
        imageLoadError: '无法加载图片',
        noImagePath: '文件路径',
        labelSurname: '姓',
        labelGivenName: '名',
        labelPatronymic: '父称',
        labelDateOfBirth: '出生日期',
        labelPassportNo: '护照号码',
        labelDateOfIssue: '签发日期',
        labelDateOfExpiry: '有效期',
        labelNationality: '国籍',
        labelSex: '性别',
        labelPlaceOfBirth: '出生地',
        labelAuthority: '签发机关',
        expired: '已过期',
        selectPlaceholder: '请选择',
        maleOption: '男 (M)',
        femaleOption: '女 (F)',
        partialDataWarning: '仅提取了部分信息，请重新核对图片。',
        confirmButton: '确认 (Tasdiqlayman)',
        rescanButton: '重新扫描 (Qayta skanerlash)',
        docConfirmedMsg: '文档已确认。(Hujjat tasdiqlandi.)',
        confirmDialogTitle: '您是否已核实全部信息？(Barcha ma\'lumotlar to\'g\'riligiga ishonch hosil qildingizmi?)',
        confirmDialogSent: '文档将发送给管理员。(Hujjat admin\'ga yuboriladi.)',
        confirmSuccessAlert: '文档确认成功！请等待管理员审核。',
        confirmErrorAlert: '确认时发生错误',
        rescanConfirm: '是否要重新扫描此文档？(Bu hujjatni qayta skanerlashni xohlaysizmi?)',
        rescanSuccessAlert: '文档已重新扫描！页面即将刷新。',
        rescanErrorAlert: '重新处理时发生错误',
        confirmErr: '确认错误',
        btnEdit: '编辑 (Tahrirlash)',
        btnDelete: '删除 (O\'chirish)',
        docLoadError: '文档加载错误',
        saveErrorAlert: '保存时发生错误',
        statusMatch: '匹配',
        statusMismatch: '不匹配',
        statusPartial: '部分',
        statusNone: '无',
        statusExpired: '已过期',
        extraFieldsTitle: '其他栏目（按文档显示）'
    },
    vi: {
        navHome: 'Trang chủ',
        navDocuments: 'Tài liệu',
        navUpload: 'Tải lên',
        navMyPage: 'Trang của tôi',
        loginTitle: 'Hệ thống AI-OCR',
        loginSubtitle: 'Đăng nhập',
        username: 'Tên người dùng',
        password: 'Mật khẩu',
        loginButton: 'Đăng nhập',
        signupButton: 'Đăng ký',
        showSignup: 'Đăng ký',
        showLogin: 'Đăng nhập',
        testAccount: 'Tài khoản thử nghiệm:',
        testAdmin: 'Quản trị viên: admin / admin123',
        testUser: 'Người dùng: user / user123',
        needAccount: 'Cần tài khoản mới?',
        haveAccount: 'Đã có tài khoản?',
        dashboardTitle: 'Bảng điều khiển',
        featuredTitle: 'Hệ thống AI-OCR 2026, Đây Là Những Gì Thay Đổi',
        featuredItem1: '○ (Cải thiện độ chính xác) Độ chính xác OCR 95% → 98%',
        featuredItem2: '○ (Nâng cao niềm tin người dùng) Hệ thống xác minh thời gian thực được giới thiệu',
        featuredItem3: '○ (Tăng cường hiệu suất) Tốc độ xử lý tăng gấp đôi',
        featuredDescription: 'Mở rộng hỗ trợ đa ngôn ngữ, mở rộng dịch vụ miễn phí cho người thu nhập thấp',
        featuredLink: 'Xem chi tiết >>',
        btnIndividual: 'Cá nhân',
        btnWorkplace: 'Nơi làm việc ↗',
        newsInfo: 'Tin tức & Thông tin',
        btnMore: 'Thêm +',
        tabNews: 'Tin tức',
        tabPress: 'Thông cáo báo chí',
        tabPromo: 'Trung tâm quảng bá',
        tabJobs: 'Tuyển dụng',
        newsUpdate: 'Thông báo cập nhật Hệ thống AI-OCR 2026',
        newsNewFeature: 'Tính năng nhận dạng tài liệu mới được thêm vào',
        newsService: 'Hướng dẫn dịch vụ qua các kênh không tiếp xúc',
        frequentServices: 'Dịch vụ thường dùng',
        serviceMyDocs: 'Tài liệu của tôi',
        serviceBranch: 'Tìm chi nhánh',
        serviceForm: 'Tìm biểu mẫu',
        serviceCalc: 'Máy tính',
        serviceGuide: 'Hướng dẫn dễ hiểu',
        serviceWebfax: 'Tra cứu Web Fax',
        serviceStats: 'Thống kê',
        serviceChat: 'Tư vấn chat',
        documentsTitle: 'Tài liệu',
        btnNewDoc: '+ Tài liệu mới',
        docId: 'ID',
        docFileType: 'Loại tệp',
        docStatus: 'Trạng thái',
        docConfidence: 'Độ tin cậy',
        docCreated: 'Đã tạo',
        docAction: 'Hành động',
        docView: 'Xem',
        docNotFound: 'Không tìm thấy tài liệu',
        docBack: '← Quay lại',
        docBasicInfo: 'Thông tin cơ bản',
        docTableData: 'Dữ liệu bảng',
        docDate: 'Ngày',
        docIron: 'Sắt',
        docCopper: 'Đồng',
        docTotal: 'Tổng',
        docFlags: 'Cờ',
        docRawText: 'Văn bản gốc (Chỉ quản trị viên)',
        docFullJson: 'Dữ liệu JSON đầy đủ (Chỉ quản trị viên)',
        docNoData: '⚠️ Không có dữ liệu được trích xuất',
        uploadTitle: 'Tải lên tài liệu',
        uploadFile: 'Tệp',
        uploadFileType: 'Loại tệp',
        uploadLanguage: 'Ngôn ngữ',
        fileTypeOther: 'Khác',
        fileTypePassport: 'Hộ chiếu',
        fileTypeId: 'Thẻ căn cước',
        fileTypeApplication: 'Đơn đăng ký',
        langAuto: 'Tự động',
        langUzb: 'Tiếng Uzbek',
        langEng: 'Tiếng Anh',
        langKor: 'Tiếng Hàn',
        uploadBtn: 'Tải lên',
        uploadSuccess: 'Tài liệu đã được tải lên thành công!',
        uploadSelectFile: 'Vui lòng chọn tệp!',
        myPageTitle: 'Trang của tôi',
        myInfo: 'Thông tin của tôi',
        welcomeBack: 'Chào mừng trở lại!',
        profilePhoto: 'Ảnh',
        uploadPhoto: 'Tải lên ảnh đại diện',
        photoHint: 'Ảnh phải ở định dạng JPG, JPEG, PNG hoặc WebP!',
        userInfo: 'Thông tin người dùng',
        phone: 'Số điện thoại',
        email: 'Email',
        address: 'Địa chỉ',
        myProfile: 'Hồ sơ của tôi',
        weGladToSeeYou: 'Rất vui được gặp lại bạn!',
        updateProfile: 'Cập nhật hồ sơ',
        myDocuments: 'Tài liệu của tôi',
        myFavorites: 'Yêu thích của tôi',
        recentlyVisited: 'Đã truy cập gần đây',
        myFollowers: 'Người theo dõi',
        myFollowings: 'Đang theo dõi',
        pageBranchTitle: 'Tìm chi nhánh',
        pageBranchDesc: 'Tìm chi nhánh gần bạn.',
        pageBranchMapPlaceholder: 'Bản đồ sẽ hiển thị ở đây',
        pageFormsTitle: 'Tìm biểu mẫu',
        pageFormsDesc: 'Tải các biểu mẫu bạn cần.',
        formPassportTitle: 'Biểu mẫu dịch hộ chiếu',
        formPassportDesc: 'Biểu mẫu chính thức cho dịch hộ chiếu',
        formPensionTitle: 'Đơn xin lương hưu',
        formPensionDesc: 'Biểu mẫu đơn xin lương hưu',
        formIdTitle: 'Biểu mẫu dịch ID',
        formIdDesc: 'Biểu mẫu chính thức cho dịch ID',
        btnPdfDownload: 'Tải PDF',
        pageCalcTitle: 'Máy tính lương hưu',
        pageCalcDesc: 'Nhập tuổi và đóng góp hàng tháng để ước tính lương hưu.',
        calcLabelAge: 'Tuổi',
        calcLabelPayment: 'Đóng góp hàng tháng',
        calcPlaceholder: 'vd: 35',
        calcBtn: 'Tính',
        pageGuideTitle: 'Hướng dẫn dễ hiểu',
        guideSection1Title: 'Cách nộp tài liệu',
        guideSection1Text: 'Chuẩn bị tài liệu cần thiết và nộp trực tuyến.',
        guideSection2Title: 'Thời gian xử lý',
        guideSection2Text: 'Thường 3-5 ngày làm việc.',
        guideSection3Title: 'Liên hệ',
        guideSection3Text: 'Liên hệ dịch vụ khách hàng để được hỗ trợ.',
        pageWebfaxTitle: 'Tra cứu Web Fax',
        pageWebfaxSubtitle: 'Xem lịch sử web fax.',
        webfaxDocLabel: 'Tài liệu',
        webfaxProcessed: 'Đã xử lý',
        pageStatsTitle: 'Thống kê',
        pageStatsSubtitle: 'Xem thống kê theo tháng.',
        statsChartPlaceholder: 'Biểu đồ thống kê sẽ hiển thị ở đây',
        pageChatTitle: 'Tư vấn chat',
        chatWelcome: 'Xin chào! Tôi có thể giúp gì cho bạn?',
        chatPlaceholder: 'Nhập tin nhắn...',
        chatSendBtn: 'Gửi',
        loading: 'Đang tải...',
        error: 'Lỗi',
        success: 'Thành công',
        logout: 'Đăng xuất',
        passportInfo: 'Thông tin hộ chiếu',
        clickToEnlarge: 'Nhấp để phóng to',
        imageLoadError: 'Không tải được ảnh',
        noImagePath: 'Đường dẫn tệp',
        labelSurname: 'Họ',
        labelGivenName: 'Tên',
        labelPatronymic: 'Tên đệm',
        labelDateOfBirth: 'Ngày sinh',
        labelPassportNo: 'Số hộ chiếu',
        labelDateOfIssue: 'Ngày cấp',
        labelDateOfExpiry: 'Ngày hết hạn',
        labelNationality: 'Quốc tịch',
        labelSex: 'Giới tính',
        labelPlaceOfBirth: 'Nơi sinh',
        labelAuthority: 'Cơ quan cấp',
        expired: 'Đã hết hạn',
        selectPlaceholder: 'Chọn',
        maleOption: 'Nam (M)',
        femaleOption: 'Nữ (F)',
        partialDataWarning: 'Chỉ trích xuất được một phần. Vui lòng kiểm tra lại ảnh.',
        confirmButton: 'Xác nhận (Tasdiqlayman)',
        rescanButton: 'Quét lại (Qayta skanerlash)',
        docConfirmedMsg: 'Tài liệu đã được xác nhận. (Hujjat tasdiqlandi.)',
        confirmDialogTitle: 'Bạn đã xác minh tất cả thông tin chưa? (Barcha ma\'lumotlar to\'g\'riligiga ishonch hosil qildingizmi?)',
        confirmDialogSent: 'Tài liệu sẽ được gửi cho quản trị viên. (Hujjat admin\'ga yuboriladi.)',
        confirmSuccessAlert: 'Xác nhận tài liệu thành công! Vui lòng chờ quản trị viên xem xét.',
        confirmErrorAlert: 'Lỗi khi xác nhận',
        rescanConfirm: 'Bạn có muốn quét lại tài liệu này? (Bu hujjatni qayta skanerlashni xohlaysizmi?)',
        rescanSuccessAlert: 'Tài liệu đã được quét lại! Trang sẽ làm mới.',
        rescanErrorAlert: 'Lỗi khi xử lý lại',
        confirmErr: 'Lỗi xác nhận',
        btnEdit: 'Chỉnh sửa (Tahrirlash)',
        btnDelete: 'Xóa (O\'chirish)',
        docLoadError: 'Lỗi tải tài liệu',
        saveErrorAlert: 'Lỗi khi lưu',
        statusMatch: 'Khớp',
        statusMismatch: 'Không khớp',
        statusPartial: 'Một phần',
        statusNone: 'Không',
        statusExpired: 'Hết hạn',
        extraFieldsTitle: 'Các trường khác (theo tài liệu)'
    },
    th: {
        navHome: 'หน้าแรก',
        navDocuments: 'เอกสาร',
        navUpload: 'อัปโหลด',
        navMyPage: 'หน้าของฉัน',
        loginTitle: 'ระบบ AI-OCR',
        loginSubtitle: 'เข้าสู่ระบบ',
        username: 'ชื่อผู้ใช้',
        password: 'รหัสผ่าน',
        loginButton: 'เข้าสู่ระบบ',
        signupButton: 'สมัครสมาชิก',
        showSignup: 'สมัครสมาชิก',
        showLogin: 'เข้าสู่ระบบ',
        testAccount: 'บัญชีทดสอบ:',
        testAdmin: 'ผู้ดูแลระบบ: admin / admin123',
        testUser: 'ผู้ใช้: user / user123',
        needAccount: 'ต้องการบัญชีใหม่?',
        haveAccount: 'มีบัญชีอยู่แล้ว?',
        dashboardTitle: 'แดชบอร์ด',
        featuredTitle: 'ระบบ AI-OCR 2026 นี่คือสิ่งที่เปลี่ยนแปลง',
        featuredItem1: '○ (ปรับปรุงความแม่นยำ) ความแม่นยำ OCR 95% → 98%',
        featuredItem2: '○ (เพิ่มความน่าเชื่อถือของผู้ใช้) ระบบตรวจสอบแบบเรียลไทม์ถูกนำมาใช้',
        featuredItem3: '○ (เพิ่มประสิทธิภาพ) ความเร็วในการประมวลผลเพิ่มขึ้น 2 เท่า',
        featuredDescription: 'ขยายการสนับสนุนหลายภาษา ขยายบริการฟรีสำหรับผู้มีรายได้น้อย',
        featuredLink: 'ดูรายละเอียด >>',
        btnIndividual: 'บุคคล',
        btnWorkplace: 'สถานที่ทำงาน ↗',
        newsInfo: 'ข่าวสารและข้อมูล',
        btnMore: 'เพิ่มเติม +',
        tabNews: 'ข่าวสาร',
        tabPress: 'ข่าวประชาสัมพันธ์',
        tabPromo: 'ศูนย์ส่งเสริมการขาย',
        tabJobs: 'ประกาศรับสมัครงาน',
        newsUpdate: 'ประกาศอัปเดตระบบ AI-OCR 2026',
        newsNewFeature: 'เพิ่มฟีเจอร์การจดจำเอกสารใหม่',
        newsService: 'คู่มือบริการผ่านช่องทางที่ไม่ต้องพบหน้ากัน',
        frequentServices: 'บริการที่ใช้บ่อย',
        serviceMyDocs: 'เอกสารของฉัน',
        serviceBranch: 'ค้นหาสาขา',
        serviceForm: 'ค้นหาแบบฟอร์ม',
        serviceCalc: 'เครื่องคิดเลข',
        serviceGuide: 'คู่มือง่ายๆ',
        serviceWebfax: 'สอบถาม Web Fax',
        serviceStats: 'สถิติ',
        serviceChat: 'ปรึกษาผ่านแชท',
        documentsTitle: 'เอกสาร',
        btnNewDoc: '+ เอกสารใหม่',
        docId: 'ID',
        docFileType: 'ประเภทไฟล์',
        docStatus: 'สถานะ',
        docConfidence: 'ความมั่นใจ',
        docCreated: 'สร้างเมื่อ',
        docAction: 'การดำเนินการ',
        docView: 'ดู',
        docNotFound: 'ไม่พบเอกสาร',
        docBack: '← กลับ',
        docBasicInfo: 'ข้อมูลพื้นฐาน',
        docTableData: 'ข้อมูลตาราง',
        docDate: 'วันที่',
        docIron: 'เหล็ก',
        docCopper: 'ทองแดง',
        docTotal: 'รวม',
        docFlags: 'ธง',
        docRawText: 'ข้อความดิบ (สำหรับผู้ดูแลระบบเท่านั้น)',
        docFullJson: 'ข้อมูล JSON เต็มรูปแบบ (สำหรับผู้ดูแลระบบเท่านั้น)',
        docNoData: '⚠️ ไม่มีข้อมูลที่สกัดได้',
        uploadTitle: 'อัปโหลดเอกสาร',
        uploadFile: 'ไฟล์',
        uploadFileType: 'ประเภทไฟล์',
        uploadLanguage: 'ภาษา',
        fileTypeOther: 'อื่นๆ',
        fileTypePassport: 'หนังสือเดินทาง',
        fileTypeId: 'บัตรประจำตัวประชาชน',
        fileTypeApplication: 'ใบสมัคร',
        langAuto: 'อัตโนมัติ',
        langUzb: 'อุซเบก',
        langEng: 'อังกฤษ',
        langKor: 'เกาหลี',
        uploadBtn: 'อัปโหลด',
        uploadSuccess: 'อัปโหลดเอกสารสำเร็จ!',
        uploadSelectFile: 'กรุณาเลือกไฟล์!',
        myPageTitle: 'หน้าของฉัน',
        myInfo: 'ข้อมูลของฉัน',
        welcomeBack: 'ยินดีต้อนรับกลับ!',
        profilePhoto: 'รูป照片',
        uploadPhoto: 'อัปโหลดรูปโปรไฟล์',
        photoHint: 'รูปภาพต้องเป็นรูปแบบ JPG, JPEG, PNG หรือ WebP!',
        userInfo: 'ข้อมูลผู้ใช้',
        phone: 'หมายเลขโทรศัพท์',
        email: 'อีเมล',
        address: 'ที่อยู่',
        myProfile: 'โปรไฟล์ของฉัน',
        weGladToSeeYou: 'ยินดีที่ได้พบคุณอีกครั้ง!',
        updateProfile: 'อัปเดตโปรไฟล์',
        myDocuments: 'เอกสารของฉัน',
        myFavorites: 'รายการโปรด',
        recentlyVisited: 'เข้าชมล่าสุด',
        myFollowers: 'ผู้ติดตาม',
        myFollowings: 'กำลังติดตาม',
        pageBranchTitle: 'ค้นหาสาขา',
        pageBranchDesc: 'ค้นหาสาขาใกล้คุณ',
        pageBranchMapPlaceholder: 'แผนที่จะแสดงที่นี่',
        pageFormsTitle: 'ค้นหาแบบฟอร์ม',
        pageFormsDesc: 'ดาวน์โหลดแบบฟอร์มที่ต้องการ',
        formPassportTitle: 'แบบฟอร์มแปลหนังสือเดินทาง',
        formPassportDesc: 'แบบฟอร์มทางราชการสำหรับแปลหนังสือเดินทาง',
        formPensionTitle: 'ใบสมัครบำนาญ',
        formPensionDesc: 'แบบฟอร์มสมัครบำนาญ',
        formIdTitle: 'แบบฟอร์มแปลบัตรประชาชน',
        formIdDesc: 'แบบฟอร์มทางราชการสำหรับแปลบัตร',
        btnPdfDownload: 'ดาวน์โหลด PDF',
        pageCalcTitle: 'เครื่องคิดเลขบำนาญ',
        pageCalcDesc: 'ใส่อายุและเงินสมทบต่อเดือนเพื่อประมาณบำนาญรายเดือน',
        calcLabelAge: 'อายุ',
        calcLabelPayment: 'เงินสมทบรายเดือน',
        calcPlaceholder: 'เช่น 35',
        calcBtn: 'คำนวณ',
        pageGuideTitle: 'คู่มือง่ายๆ',
        guideSection1Title: 'วิธียื่นเอกสาร',
        guideSection1Text: 'เตรียมเอกสารที่ต้องการและยื่นออนไลน์',
        guideSection2Title: 'ระยะเวลาดำเนินการ',
        guideSection2Text: 'ปกติ 3-5 วันทำการ',
        guideSection3Title: 'ติดต่อ',
        guideSection3Text: 'ติดต่อฝ่ายบริการลูกค้าสำหรับความช่วยเหลือ',
        pageWebfaxTitle: 'สอบถาม Web Fax',
        pageWebfaxSubtitle: 'ดูประวัติเว็บแฟกซ์',
        webfaxDocLabel: 'เอกสาร',
        webfaxProcessed: 'ดำเนินการแล้ว',
        pageStatsTitle: 'สถิติ',
        pageStatsSubtitle: 'ดูสถิติรายเดือน',
        statsChartPlaceholder: 'กราฟสถิติจะแสดงที่นี่',
        pageChatTitle: 'ปรึกษาผ่านแชท',
        chatWelcome: 'สวัสดี! มีอะไรให้ช่วยไหมคะ?',
        chatPlaceholder: 'พิมพ์ข้อความ...',
        chatSendBtn: 'ส่ง',
        loading: 'กำลังโหลด...',
        error: 'ข้อผิดพลาด',
        success: 'สำเร็จ',
        logout: 'ออกจากระบบ',
        passportInfo: 'ข้อมูลหนังสือเดินทาง',
        clickToEnlarge: 'คลิกเพื่อขยาย',
        imageLoadError: 'โหลดรูปภาพไม่ได้',
        noImagePath: 'เส้นทางไฟล์',
        labelSurname: 'นามสกุล',
        labelGivenName: 'ชื่อ',
        labelPatronymic: 'ชื่อพ่อ',
        labelDateOfBirth: 'วันเกิด',
        labelPassportNo: 'เลขหนังสือเดินทาง',
        labelDateOfIssue: 'วันออกเอกสาร',
        labelDateOfExpiry: 'วันหมดอายุ',
        labelNationality: 'สัญชาติ',
        labelSex: 'เพศ',
        labelPlaceOfBirth: 'สถานที่เกิด',
        labelAuthority: 'หน่วยงานออกเอกสาร',
        expired: 'หมดอายุ',
        selectPlaceholder: 'เลือก',
        maleOption: 'ชาย (M)',
        femaleOption: 'หญิง (F)',
        partialDataWarning: 'ดึงข้อมูลได้เพียงบางส่วน กรุณาตรวจสอบรูปอีกครั้ง',
        confirmButton: 'ยืนยัน (Tasdiqlayman)',
        rescanButton: 'สแกนใหม่ (Qayta skanerlash)',
        docConfirmedMsg: 'ยืนยันเอกสารแล้ว (Hujjat tasdiqlandi.)',
        confirmDialogTitle: 'คุณได้ตรวจสอบข้อมูลทั้งหมดแล้วหรือยัง? (Barcha ma\'lumotlar to\'g\'riligiga ishonch hosil qildingizmi?)',
        confirmDialogSent: 'เอกสารจะถูกส่งถึงผู้ดูแล (Hujjat admin\'ga yuboriladi.)',
        confirmSuccessAlert: 'ยืนยันเอกสารสำเร็จ! รอผู้ดูแลตรวจสอบ',
        confirmErrorAlert: 'เกิดข้อผิดพลาดในการยืนยัน',
        rescanConfirm: 'ต้องการสแกนเอกสารนี้อีกครั้ง? (Bu hujjatni qayta skanerlashni xohlaysizmi?)',
        rescanSuccessAlert: 'สแกนเอกสารใหม่แล้ว! หน้าจะรีเฟรช',
        rescanErrorAlert: 'เกิดข้อผิดพลาดในการประมวลผลใหม่',
        confirmErr: 'ข้อผิดพลาดการยืนยัน',
        btnEdit: 'แก้ไข (Tahrirlash)',
        btnDelete: 'ลบ (O\'chirish)',
        docLoadError: 'ข้อผิดพลาดโหลดเอกสาร',
        saveErrorAlert: 'เกิดข้อผิดพลาดในการบันทึก',
        statusMatch: 'ตรงกัน',
        statusMismatch: 'ไม่ตรงกัน',
        statusPartial: 'บางส่วน',
        statusNone: 'ไม่มี',
        statusExpired: 'หมดอายุ',
        extraFieldsTitle: 'ฟิลด์เพิ่มเติม (ตามในเอกสาร)'
    }
};

// Get current language from localStorage or default to Korean
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ko';
}

// Set language – butun sayt (jumladan hujjat detali) tanlangan tilga o'tsin
function setLanguage(lang) {
    console.log('🌐 Setting language to:', lang);
    localStorage.setItem('language', lang);
    
    // DOM uchun tarjimalarni qo'llash
    setTimeout(() => {
        applyTranslations(lang);
    }, 50);
    
    setTimeout(() => {
        const homeLinks = document.querySelectorAll('[data-page="dashboard"]');
        if (homeLinks.length > 0) {
            applyTranslations(lang);
        }
        // Hujjat detali sahifasida bo'lsak – kontentni yangi til bilan qayta chizish (Pasport ma'lumoti, label'lar, tugmalar)
        const savedPage = localStorage.getItem('currentPage');
        const docId = localStorage.getItem('documentDetailId');
        const viewDoc = typeof window.viewDocument === 'function' ? window.viewDocument : (typeof viewDocument === 'function' ? viewDocument : null);
        if (savedPage === 'documentDetail' && docId && viewDoc) {
            viewDoc(docId);
        }
    }, 300);
}

// Apply translations to the page
function applyTranslations(lang) {
    const t = translations[lang] || translations.ko;
    
    // Navigation links - barcha navigation link'larni topish (top nav va sidebar)
    const homeLinks = document.querySelectorAll('[data-page="dashboard"]');
    homeLinks.forEach(link => {
        if (link) link.textContent = t.navHome;
    });
    
    const documentsLinks = document.querySelectorAll('[data-page="documents"]');
    documentsLinks.forEach(link => {
        if (link) link.textContent = t.navDocuments;
    });
    
    const uploadLinks = document.querySelectorAll('[data-page="upload"]');
    uploadLinks.forEach(link => {
        if (link) link.textContent = t.navUpload;
    });
    
    const myPageLinks = document.querySelectorAll('[data-page="admin"]');
    myPageLinks.forEach(link => {
        if (link) link.textContent = t.navMyPage;
    });
    
    // Debug: navigation link'larni tekshirish
    console.log('🌐 Language changed to:', lang, {
        homeLinks: homeLinks.length,
        documentsLinks: documentsLinks.length,
        uploadLinks: uploadLinks.length,
        myPageLinks: myPageLinks.length,
        translations: {
            navHome: t.navHome,
            navDocuments: t.navDocuments,
            navUpload: t.navUpload,
            navMyPage: t.navMyPage
        }
    });
    
    // Login screen
    const loginTitle = document.querySelector('#loginScreen h1');
    if (loginTitle) loginTitle.textContent = t.loginTitle;
    
    const loginSubtitle = document.querySelector('#loginScreen .subtitle');
    if (loginSubtitle) loginSubtitle.textContent = t.loginSubtitle;
    
    const usernameLabel = document.querySelector('#loginForm label[for="username"], #loginForm .form-group:first-child label');
    if (usernameLabel) usernameLabel.textContent = t.username;
    
    const passwordLabel = document.querySelector('#loginForm label[for="password"], #loginForm .form-group:nth-child(2) label');
    if (passwordLabel) passwordLabel.textContent = t.password;
    
    const loginButton = document.querySelector('#loginForm button[type="submit"]');
    if (loginButton) loginButton.textContent = t.loginButton;
    
    const showSignupLink = document.getElementById('showSignup');
    if (showSignupLink) showSignupLink.textContent = t.showSignup;
    
    const showLoginLink = document.getElementById('showLogin');
    if (showLoginLink) showLoginLink.textContent = t.showLogin;
    
    // Test account hints
    const testAccountEl = document.querySelector('.login-hint p strong');
    if (testAccountEl) testAccountEl.textContent = t.testAccount;
    
    const testAdminEl = document.querySelector('.login-hint p:nth-child(2)');
    if (testAdminEl && testAdminEl.textContent.includes('관리자')) {
        testAdminEl.textContent = t.testAdmin;
    }
    
    const testUserEl = document.querySelector('.login-hint p:nth-child(3)');
    if (testUserEl && testUserEl.textContent.includes('사용자')) {
        testUserEl.textContent = t.testUser;
    }
    
    // Dashboard page
    const featuredTitle = document.querySelector('.featured-title');
    if (featuredTitle) featuredTitle.textContent = t.featuredTitle;
    
    const featuredList = document.querySelectorAll('.featured-list li');
    if (featuredList.length >= 3) {
        featuredList[0].textContent = t.featuredItem1;
        featuredList[1].textContent = t.featuredItem2;
        featuredList[2].textContent = t.featuredItem3;
    }
    
    const featuredDescription = document.querySelector('.featured-description');
    if (featuredDescription) featuredDescription.textContent = t.featuredDescription;
    
    const featuredLink = document.querySelector('.featured-link');
    if (featuredLink) featuredLink.textContent = t.featuredLink;
    
    const btnIndividual = document.querySelector('.btn-individual');
    if (btnIndividual) btnIndividual.textContent = t.btnIndividual;
    
    const btnWorkplace = document.querySelector('.btn-workplace');
    if (btnWorkplace) btnWorkplace.textContent = t.btnWorkplace;
    
    // News & Information
    const newsInfo = document.querySelector('.news-box h2');
    if (newsInfo) newsInfo.textContent = t.newsInfo;
    
    const btnMore = document.querySelector('.btn-more');
    if (btnMore) btnMore.textContent = t.btnMore;
    
    const tabs = document.querySelectorAll('.box-tabs .tab');
    if (tabs.length >= 4) {
        tabs[0].textContent = t.tabNews;
        tabs[1].textContent = t.tabPress;
        tabs[2].textContent = t.tabPromo;
        tabs[3].textContent = t.tabJobs;
    }
    
    // News items (static ones)
    const newsItems = document.querySelectorAll('.news-list .news-item .news-title');
    if (newsItems.length >= 3) {
        newsItems[0].textContent = t.newsUpdate;
        newsItems[1].textContent = t.newsNewFeature;
        newsItems[2].textContent = t.newsService;
    }
    
    // Services
    const servicesTitle = document.querySelector('.services-box h2');
    if (servicesTitle) servicesTitle.textContent = t.frequentServices;
    
    const serviceItems = document.querySelectorAll('.service-item span');
    if (serviceItems.length >= 8) {
        serviceItems[0].textContent = t.serviceMyDocs;
        serviceItems[1].textContent = t.serviceBranch;
        serviceItems[2].textContent = t.serviceForm;
        serviceItems[3].textContent = t.serviceCalc;
        serviceItems[4].textContent = t.serviceGuide;
        serviceItems[5].textContent = t.serviceWebfax;
        serviceItems[6].textContent = t.serviceStats;
        serviceItems[7].textContent = t.serviceChat;
    }
    
    // Documents page
    const documentsTitle = document.querySelector('#documentsPage .page-header h1');
    if (documentsTitle) documentsTitle.textContent = t.documentsTitle;
    
    const btnNewDoc = document.querySelector('#documentsPage .btn-primary');
    if (btnNewDoc) btnNewDoc.textContent = t.btnNewDoc;
    
    const docHeaders = document.querySelectorAll('#documentsPage thead th');
    if (docHeaders.length >= 6) {
        docHeaders[0].textContent = t.docId;
        docHeaders[1].textContent = t.docFileType;
        docHeaders[2].textContent = t.docStatus;
        docHeaders[3].textContent = t.docConfidence;
        docHeaders[4].textContent = t.docCreated;
        docHeaders[5].textContent = t.docAction;
    }
    
    // Upload page
    const uploadTitle = document.querySelector('#uploadPage h1');
    if (uploadTitle) uploadTitle.textContent = t.uploadTitle;
    
    const uploadLabels = document.querySelectorAll('#uploadForm label');
    if (uploadLabels.length >= 3) {
        uploadLabels[0].textContent = t.uploadFile;
        uploadLabels[1].textContent = t.uploadFileType;
        uploadLabels[2].textContent = t.uploadLanguage;
    }
    
    const fileTypeOptions = document.querySelectorAll('#fileType option');
    if (fileTypeOptions.length >= 4) {
        fileTypeOptions[0].textContent = t.fileTypeOther;
        fileTypeOptions[1].textContent = t.fileTypePassport;
        fileTypeOptions[2].textContent = t.fileTypeId;
        fileTypeOptions[3].textContent = t.fileTypeApplication;
    }
    
    const langOptions = document.querySelectorAll('#language option');
    if (langOptions.length >= 4) {
        langOptions[0].textContent = t.langAuto;
        langOptions[1].textContent = t.langUzb;
        langOptions[2].textContent = t.langEng;
        langOptions[3].textContent = t.langKor;
    }
    
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) uploadBtn.textContent = t.uploadBtn;
    
    // Admin/My Page
    const myInfoTitle = document.querySelector('#adminPage .profile-header-section h1');
    if (myInfoTitle) myInfoTitle.textContent = t.myInfo;
    
    const welcomeText = document.querySelector('#adminPage .welcome-text');
    if (welcomeText) welcomeText.textContent = t.welcomeBack;
    
    const profilePhotoTitle = document.querySelector('#adminPage .profile-section h2:first-of-type');
    if (profilePhotoTitle) profilePhotoTitle.textContent = t.profilePhoto;
    
    const uploadPhotoBtn = document.querySelector('#adminPage .btn-upload');
    if (uploadPhotoBtn) uploadPhotoBtn.textContent = t.uploadPhoto;
    
    const photoHint = document.querySelector('#adminPage .photo-hint');
    if (photoHint) photoHint.textContent = t.photoHint;
    
    const userInfoTitle = document.querySelector('#adminPage .profile-section h2:last-of-type');
    if (userInfoTitle) userInfoTitle.textContent = t.userInfo;
    
    const userInfoLabels = document.querySelectorAll('#adminPage .profile-section .form-group label');
    if (userInfoLabels.length >= 3) {
        userInfoLabels[0].textContent = t.username;
        userInfoLabels[1].textContent = t.phone;
        userInfoLabels[2].textContent = t.email;
    }
    
    // Service pages: Branch, Forms, Calculator, Guide, Webfax, Statistics, Chat
    const branchTitle = document.querySelector('#branchPage .page-header h1');
    if (branchTitle) branchTitle.textContent = t.pageBranchTitle;
    const branchDesc = document.querySelector('#branchPage .service-content > p');
    if (branchDesc) branchDesc.textContent = t.pageBranchDesc;
    const branchMap = document.getElementById('branchMap');
    if (branchMap) branchMap.textContent = t.pageBranchMapPlaceholder;
    
    const formsTitle = document.querySelector('#formsPage .page-header h1');
    if (formsTitle) formsTitle.textContent = t.pageFormsTitle;
    const formsDesc = document.querySelector('#formsPage .service-content > p');
    if (formsDesc) formsDesc.textContent = t.pageFormsDesc;
    const formItems = document.querySelectorAll('#formsPage .form-item');
    if (formItems.length >= 3) {
        formItems[0].querySelector('h3').textContent = t.formPassportTitle;
        formItems[0].querySelector('p').textContent = t.formPassportDesc;
        formItems[0].querySelector('button').textContent = t.btnPdfDownload;
        formItems[1].querySelector('h3').textContent = t.formPensionTitle;
        formItems[1].querySelector('p').textContent = t.formPensionDesc;
        formItems[1].querySelector('button').textContent = t.btnPdfDownload;
        formItems[2].querySelector('h3').textContent = t.formIdTitle;
        formItems[2].querySelector('p').textContent = t.formIdDesc;
        formItems[2].querySelector('button').textContent = t.btnPdfDownload;
    }
    
    const calcTitle = document.querySelector('#calculatorPage .page-header h1');
    if (calcTitle) calcTitle.textContent = t.pageCalcTitle;
    const calcDesc = document.querySelector('#calculatorPage .service-content > p');
    if (calcDesc) calcDesc.textContent = t.pageCalcDesc;
    const calcLabels = document.querySelectorAll('#calculatorPage .form-group label');
    if (calcLabels.length >= 2) {
        calcLabels[0].textContent = t.calcLabelAge;
        calcLabels[1].textContent = t.calcLabelPayment;
    }
    const calcPlaceholder = document.querySelector('#calculatorPage #calcAge');
    if (calcPlaceholder) calcPlaceholder.placeholder = t.calcPlaceholder;
    const calcBtn = document.getElementById('calcBtn');
    if (calcBtn) calcBtn.textContent = t.calcBtn;
    
    const guideTitle = document.querySelector('#guidePage .page-header h1');
    if (guideTitle) guideTitle.textContent = t.pageGuideTitle;
    const guideSections = document.querySelectorAll('#guidePage .guide-section');
    if (guideSections.length >= 3) {
        guideSections[0].querySelector('h2').textContent = t.guideSection1Title;
        guideSections[0].querySelector('p').textContent = t.guideSection1Text;
        guideSections[1].querySelector('h2').textContent = t.guideSection2Title;
        guideSections[1].querySelector('p').textContent = t.guideSection2Text;
        guideSections[2].querySelector('h2').textContent = t.guideSection3Title;
        guideSections[2].querySelector('p').textContent = t.guideSection3Text;
    }
    
    const webfaxTitle = document.querySelector('#webfaxPage .page-header h1');
    if (webfaxTitle) webfaxTitle.textContent = t.pageWebfaxTitle;
    const webfaxDesc = document.querySelector('#webfaxPage .service-content > p');
    if (webfaxDesc) webfaxDesc.textContent = t.pageWebfaxSubtitle;
    document.querySelectorAll('#webfaxPage .webfax-item').forEach((item, idx) => {
        const spans = item.querySelectorAll('span');
        if (spans.length >= 3) {
            spans[1].textContent = t.webfaxDocLabel + ' #' + (idx + 1);
            spans[2].textContent = t.webfaxProcessed;
        }
    });
    
    const statsTitle = document.querySelector('#statisticsPage .page-header h1');
    if (statsTitle) statsTitle.textContent = t.pageStatsTitle;
    const statsDesc = document.querySelector('#statisticsPage .service-content > p');
    if (statsDesc) statsDesc.textContent = t.pageStatsSubtitle;
    const statsChart = document.getElementById('statisticsChart');
    if (statsChart) statsChart.textContent = t.statsChartPlaceholder;
    
    const chatTitle = document.querySelector('#chatPage .page-header h1');
    if (chatTitle) chatTitle.textContent = t.pageChatTitle;
    const chatWelcomeEl = document.querySelector('#chatPage .chat-message.bot p');
    if (chatWelcomeEl) chatWelcomeEl.textContent = t.chatWelcome;
    const chatInput = document.getElementById('chatInput');
    if (chatInput) chatInput.placeholder = t.chatPlaceholder;
    const chatSendBtn = document.getElementById('chatSendBtn');
    if (chatSendBtn) chatSendBtn.textContent = t.chatSendBtn;
    
    // Back button(s) on sub-pages
    const backBtns = document.querySelectorAll('.btn-back');
    backBtns.forEach(btn => { if (btn) btn.textContent = '← ' + t.docBack.replace(/^←\s*/, ''); });
    
    // Common elements
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => {
        if (el.textContent.includes('로딩') || el.textContent.includes('Loading')) {
            el.textContent = t.loading;
        }
    });
}

// Initialize language on page load (will be called from app.js after DOM is ready)
function initializeLanguage() {
    const currentLang = getCurrentLanguage();
    console.log('🌐 Initializing language:', currentLang);
    
    // DOM to'liq yuklanguncha kutish (navigation link'lar uchun)
    setTimeout(() => {
        applyTranslations(currentLang);
    }, 100);
    
    // Qo'shimcha tekshirish - agar navigation link'lar hali yuklanmagan bo'lsa
    setTimeout(() => {
        const homeLinks = document.querySelectorAll('[data-page="dashboard"]');
        if (homeLinks.length === 0) {
            console.warn('⚠️ Navigation links not found, retrying...');
            applyTranslations(currentLang);
        }
    }, 500);
}
