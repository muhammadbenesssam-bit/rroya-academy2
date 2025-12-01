// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const usernameInput = document.getElementById('login_username').value;
            const passwordInput = document.getElementById('login_password').value;
            
            // 1. استرجاع بيانات المستخدم من localStorage (التي تم حفظها من صفحة register.js)
            const storedUser = localStorage.getItem('currentUser');

            if (!storedUser) {
                alert('⚠️ خطأ: لا يوجد حساب مسجل بهذه البيانات. يرجى التسجيل أولاً.');
                return;
            }

            const userData = JSON.parse(storedUser);

            // 2. محاكاة التحقق من اسم المستخدم وكلمة المرور
            if (userData.username === usernameInput && userData.password === passwordInput) {
                
                // 3. تحديث حالة تسجيل الدخول
                localStorage.setItem('isLoggedIn', 'true');
                
                // 4. محاكاة تنبيه وظيفي
                alert(`👋 تم تسجيل الدخول بنجاح، مرحباً بك يا ${userData.fullName.split(' ')[0]}!`);
                
                // 5. عند تسجيل الدخول بنجاح، ينتقل المستخدم إلى الواجهة الرئيسية
                window.location.href = 'index.html';
                
            } else {
                alert('❌ خطأ في اسم المستخدم أو كلمة المرور. يرجى المحاولة مرة أخرى.');
            }
        });
    }
});