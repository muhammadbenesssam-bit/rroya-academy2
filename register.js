// js/register.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const fullName = document.getElementById('full_name').value;
            const username = document.getElementById('username').value; // رقم الهاتف أو البريد
            const password = document.getElementById('password').value;
            const gender = document.querySelector('input[name="gender"]:checked').value;

            // 1. محاكاة حفظ البيانات في localStorage
            const userData = {
                fullName: fullName,
                username: username,
                password: password, // يجب تشفيرها في تطبيق حقيقي، لكن نحفظها كنص للمحاكاة
                gender: gender,
                currentLevel: 1,      // يبدأ من المستوى الأول
                progress: {},         // لحفظ تقدم الدروس
                isLoggedIn: true      // لتمثيل حالة الدخول
            };

            // نحفظ بيانات المستخدم الحالي ومحاكاة حالة تسجيل الدخول
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            // محاكاة تنبيه إيجابي (يمكن استبداله بـ Toast Notification)
            alert('🎉 تم إنشاء الحساب بنجاح! سيتم نقلك إلى الواجهة الرئيسية.');
            
            // 2. عند التسجيل يتم نقله تلقائيًّا للواجهة الرئيسية
            window.location.href = 'index.html';
        });
    }
    
    // لضمان عمل Dark Mode من ملف main.js
    // يجب أن تكون الدالة التي تتعامل مع الوضع الليلي في ملف main.js أو يتم استيرادها بشكل صحيح
});