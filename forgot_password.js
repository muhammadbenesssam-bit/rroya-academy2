// js/forgot_password.js

document.addEventListener('DOMContentLoaded', () => {
    const step1Form = document.getElementById('forgot-step-1');
    const step2Form = document.getElementById('forgot-step-2');
    const stepDescription = document.getElementById('step-description');

    // الرمز الثابت للمحاكاة
    const MOCK_RECOVERY_CODE = '1234';

    let recoveryUsername = '';

    // --- الخطوة الأولى: إرسال الرمز ---
    step1Form.addEventListener('submit', (event) => {
        event.preventDefault();

        const usernameInput = document.getElementById('recovery_username').value;
        const storedUser = localStorage.getItem('currentUser');

        if (!storedUser) {
            alert('⚠️ خطأ: لا يوجد حساب مسجل بهذا البريد/الرقم في النظام (محاكاة).');
            return;
        }
        
        const userData = JSON.parse(storedUser);
        
        // التحقق من أن المستخدم موجود (نستخدم البريد/الرقم للمطابقة)
        if (userData.username === usernameInput) {
            recoveryUsername = usernameInput;
            
            // محاكاة إرسال ناجح للرمز (في تطبيق حقيقي يتم إرسال الرمز عبر SMS/Email)
            alert(`✅ تم إرسال رمز الاستعادة (المحاكاة: ${MOCK_RECOVERY_CODE}) إلى ${recoveryUsername}. يرجى إدخاله في الخطوة التالية.`);
            
            // إظهار الخطوة الثانية وإخفاء الأولى
            step1Form.classList.add('hidden');
            step2Form.classList.remove('hidden');
            stepDescription.textContent = 'أدخل رمز الاستعادة وكلمة المرور الجديدة.';
            
        } else {
             alert('⚠️ خطأ: لا يوجد حساب مسجل بهذا البريد/الرقم في النظام (محاكاة).');
        }
    });


    // --- الخطوة الثانية: إدخال الرمز وتغيير كلمة المرور ---
    step2Form.addEventListener('submit', (event) => {
        event.preventDefault();

        const codeInput = document.getElementById('recovery_code').value;
        const newPasswordInput = document.getElementById('new_password').value;

        // 1. التحقق من صحة الرمز
        if (codeInput === MOCK_RECOVERY_CODE) {
            
            // 2. تحديث كلمة المرور في localStorage
            const storedUser = localStorage.getItem('currentUser');
            let userData = JSON.parse(storedUser);
            
            // التأكد من أننا نغير الحساب الصحيح (لأننا في المحاكاة نستخدم حساب واحد)
            if (userData && userData.username === recoveryUsername) {
                userData.password = newPasswordInput;
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                alert('🎉 تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بالكلمة الجديدة.');
                window.location.href = 'login.html'; // الانتقال لصفحة الدخول
            } else {
                alert('❌ حدث خطأ في النظام الداخلي. يرجى المحاولة لاحقاً.');
            }

        } else {
            alert('❌ رمز الاستعادة غير صحيح. يرجى التأكد من الرمز والمحاولة مجدداً.');
        }
    });
});