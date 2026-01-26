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
        // Common
        loading: '로딩 중...',
        error: '오류',
        success: '성공',
        logout: '로그아웃'
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
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        logout: 'Logout'
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
        loading: 'Yuklanmoqda...',
        error: 'Xato',
        success: 'Muvaffaqiyatli',
        logout: 'Chiqish'
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
        loading: 'Загрузка...',
        error: 'Ошибка',
        success: 'Успешно',
        logout: 'Выход'
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
        loading: 'Ачааллаж байна...',
        error: 'Алдаа',
        success: 'Амжилттай',
        logout: 'Гарах'
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
        loading: '加载中...',
        error: '错误',
        success: '成功',
        logout: '退出'
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
        loading: 'Đang tải...',
        error: 'Lỗi',
        success: 'Thành công',
        logout: 'Đăng xuất'
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
        loading: 'กำลังโหลด...',
        error: 'ข้อผิดพลาด',
        success: 'สำเร็จ',
        logout: 'ออกจากระบบ'
    }
};

// Get current language from localStorage or default to Korean
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ko';
}

// Set language
function setLanguage(lang) {
    console.log('🌐 Setting language to:', lang);
    localStorage.setItem('language', lang);
    
    // DOM to'liq yuklanguncha kutish (navigation link'lar uchun)
    setTimeout(() => {
        applyTranslations(lang);
    }, 50);
    
    // Qo'shimcha tekshirish - agar navigation link'lar hali yuklanmagan bo'lsa
    setTimeout(() => {
        const homeLinks = document.querySelectorAll('[data-page="dashboard"]');
        if (homeLinks.length > 0) {
            console.log('✅ Navigation links found, applying translations again...');
            applyTranslations(lang);
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
