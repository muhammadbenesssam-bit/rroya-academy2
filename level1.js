// js/level1.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. تعريف بيانات الدروس (استخدام الروابط التي زودتنا بها)
    const SUBJECT_DATA = {
        fiqh: {
            title: 'الفقه',
            color: 'raaya-green',
            lessons: [
                'FdXl6jjCxP4', 'QjNxtAGUJio', 'Y1-fpaSZl54', 'DM_SWIiDD4E', 'Y_ZsDrHmves', 
                'lYR2bs_60pY', 'heMSVcPu9-A', 'M_4SBZodQ_o', 'dH6iAWN7xzE', 'W1VflF7YyKU', 
                'K4IS3T6U9sQ', 'wj8PzrDjaCQ', 'WfKibTjH0fk', 'ljj6NZA_iUw', 'njiYrAcV-90', 
                'FIz-3mKLAj8', 'H8mlg7wTd5Y', 'yq_6e7tjgww', '3rCqkOCSmss', 'E-edxN9jpJI', 
                'tOEL8jgV7q0' // 21 درس
            ]
        },
        seerah: {
            title: 'السيرة',
            color: 'raaya-sky',
            lessons: [
                'DH0vF7DsiE8', 'Ys2W-xsyw2M', '0nCBMsZvxdw', '0ay8j32yS0U', 'KkMt_SM9gYY', 
                'giE6Mt-IYm4', 'HkX6PpoS6w', 'aFDR9wpUXXE', '9xt4XUgOzZ0', 'VN3y6HZp9Nc', 
                '2eDmPFZbHSU', '_5VpSC-lM7g', 't0xXsBy2jaM', 'IwenOooQzEA', 'gLriOZ-UILE', 
                '-eXPo4U4bG4', 'swLse-J5YD0', 'E5Ay-oD-h88', '4A_rvW2bU-4', 'BQ8HnykBMP0', 
                '78MJ1J5WZWw' // 21 درس
            ]
        },
        aqeedah: {
            title: 'العقيدة',
            color: 'raaya-babyblue',
            lessons: [
                'TZHeTaOavdI', 'vPl0TqkWpKc', 'dAZ9QOYedT8', 'QudujV8DS_s', 'lmwkTa_QoGo', 
                '0faif6KiddY', 'g6c8KQSFRas', 'kMrTd9QMQG8', 'myzh6RgoI0A', 'melfqDwR7fI', 
                'ty4dd5UepJ4', 'QRjV1uJ8yBY', '7yVTmrPGYrw' // 13 درس
            ]
        }
    };
    
    // حفظ بيانات الدروس في localStorage لاستخدامها في صفحات المواد
    localStorage.setItem('subjectData', JSON.stringify(SUBJECT_DATA));

    // 2. دالة لحساب تقدم المادة
    function calculateSubjectProgress(subjectKey) {
        const totalLessons = SUBJECT_DATA[subjectKey].lessons.length;
        
        // استرجاع تقدم المستخدم
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!storedUser || !storedUser.progress[subjectKey]) {
            return 0; // 0%
        }
        
        const completedLessons = Object.values(storedUser.progress[subjectKey]).filter(isCompleted => isCompleted).length;
        
        if (totalLessons === 0) return 0;
        
        const percentage = Math.floor((completedLessons / totalLessons) * 100);
        return percentage;
    }

    // 3. تحديث واجهة تقدم المواد
    let totalProgressSum = 0;
    let allSubjectsCompleted = true;
    const subjectKeys = Object.keys(SUBJECT_DATA);

    subjectKeys.forEach(key => {
        const progress = calculateSubjectProgress(key);
        totalProgressSum += progress;

        const progressElement = document.getElementById(`progress-${key}`);
        const progressTextElement = document.getElementById(`progress-text-${key}`);

        if (progressElement) {
            progressElement.style.width = `${progress}%`;
        }
        if (progressTextElement) {
            progressTextElement.textContent = `التقدم: ${progress}%`;
        }
        
        // التحقق مما إذا كانت جميع المواد مكتملة
        if (progress < 100) {
            allSubjectsCompleted = false;
        }
    });

    // 4. منطق الامتحان النهائي للمستوى
    const examCard = document.getElementById('exam-card');
    const examStatus = document.getElementById('exam-status');
    const startExamBtn = document.getElementById('start-exam-btn');

    if (allSubjectsCompleted) {
        // تفعيل الامتحان
        examCard.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-red-100', 'dark:bg-red-900/50', 'border-red-500');
        examCard.classList.add('bg-raaya-babyblue/50', 'dark:bg-raaya-babyblue/20', 'border-raaya-sky', 'cursor-pointer');
        examStatus.textContent = '🎉 تهانينا! يمكنك الآن بدء الامتحان النهائي.';
        examStatus.classList.remove('text-red-700', 'dark:text-red-400');
        examStatus.classList.add('text-green-800', 'dark:text-raaya-green');
        startExamBtn.disabled = false;
        startExamBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
        startExamBtn.classList.add('bg-raaya-sky', 'hover:bg-raaya-green');
        
        // محاكاة بدء الامتحان
        startExamBtn.addEventListener('click', () => {
             // هنا يتم النقل لصفحة الامتحان (exam.html)
             alert('بدء الامتحان... (محاكاة: في التطبيق الحقيقي سيتم نقلك لصفحة الأسئلة)');
             // window.location.href = 'exam.html'; 
        });

    } else {
        // الإبقاء على حالة الإغلاق
        // يمكن إضافة منطق لإظهار النسبة الإجمالية للتقدم إذا أردت
    }
    
    // 5. محاكاة نتيجة الامتحان والترقية للمستوى التالي (يتم استدعاؤها بعد نجاح الامتحان)
    /*
    function handleExamSuccess() {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (storedUser) {
            storedUser.currentLevel += 1; // الترقية للمستوى التالي
            alert('تم فتح المستوى الثاني!');
            localStorage.setItem('currentUser', JSON.stringify(storedUser));
            window.location.href = 'levels.html';
        }
    }
    */
});