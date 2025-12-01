// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const body = document.getElementById('body-container');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const levelsButton = document.getElementById('levels-button');
    const accountLink = document.getElementById('account-link');
    const loginNavBtn = document.getElementById('login-nav-btn');
    const registerNavBtn = document.getElementById('register-nav-btn');

    // --- 1. منطق الوضع الليلي (Dark Mode) ---
    
    // التحقق من الإعدادات المحفوظة
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // تطبيق الوضع الليلي عند التحميل
    if (isDarkMode) {
        body.classList.add('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        body.classList.remove('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
    
    // دالة التبديل
    function toggleDarkMode() {
        if (body.classList.contains('dark')) {
            // التحويل إلى الوضع الفاتح
            body.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            // التحويل إلى الوضع الداكن
            body.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);


    // --- 2. منطق حالة تسجيل الدخول ---

    // محاكاة التحقق من حالة تسجيل الدخول
    // يتم تخزين حالة الدخول واسم المستخدم في localStorage بعد تسجيل الدخول بنجاح
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    function updateUIForAuthStatus() {
        if (isLoggedIn) {
            // للمستخدم المسجل دخوله
            levelsButton.classList.remove('hidden'); // إظهار زر المستويات العلوي
            accountLink.classList.remove('hidden'); // إظهار رابط حسابي
            
            // إخفاء أزرار تسجيل الدخول والتسجيل الجديد في الشريط السفلي
            if (loginNavBtn) loginNavBtn.classList.add('hidden');
            if (registerNavBtn) registerNavBtn.classList.add('hidden');
            
            // إضافة زر "تسجيل خروج" بدلاً من الدخول/التسجيل (في صفحات أخرى أو يتم إضافته هنا)

        } else {
            // للمستخدم غير المسجل دخوله
            levelsButton.classList.add('hidden');
            accountLink.classList.add('hidden');
            
            // إظهار أزرار تسجيل الدخول والتسجيل الجديد في الشريط السفلي
            if (loginNavBtn) loginNavBtn.classList.remove('hidden');
            if (registerNavBtn) registerNavBtn.classList.remove('hidden');
        }
    }

    updateUIForAuthStatus();
});

// هذا ملف سيتم توسيعه لاحقًا ليشمل منطق تسجيل الدخول وحفظ التقدم