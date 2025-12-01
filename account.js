// js/account_progress.js

document.addEventListener('DOMContentLoaded', () => {
    
    // عدد الدروس الكلي لكل مادة
    const LESSON_COUNTS = {
        fiqh: 21,
        seerah: 21,
        aqidah: 13
    };
    
    const TOTAL_LESSONS = LESSON_COUNTS.fiqh + LESSON_COUNTS.seerah + LESSON_COUNTS.aqidah;

    // عناصر الواجهة (DOM Elements)
    const overallProgressPercentage = document.getElementById('overall-progress-percentage');
    const overallProgressBar = document.getElementById('overall-progress-bar');
    const completedLessonsCount = document.getElementById('completed-lessons-count');
    const totalLessonsCountElement = document.getElementById('total-lessons-count');
    const examStatus = document.getElementById('exam-status');
    const examLink = document.getElementById('exam-link');

    // تحديث إجمالي الدروس في الواجهة
    totalLessonsCountElement.textContent = TOTAL_LESSONS;

    // دالة حساب التقدم
    const calculateOverallProgress = () => {
        const progressData = JSON.parse(localStorage.getItem('raaya_progress') || '{}');
        let totalCompletedLessons = 0;

        for (const subject in LESSON_COUNTS) {
            const subjectLessonsCount = LESSON_COUNTS[subject];
            let completedInSubject = 0;

            if (progressData[subject]) {
                // حساب الدروس المكتملة في كل مادة
                for (const lessonId in progressData[subject]) {
                    if (progressData[subject][lessonId] === true) {
                        completedInSubject++;
                    }
                }
            }

            totalCompletedLessons += completedInSubject;

            // تحديث تقدم المادة الفردي
            const subjectProgress = (completedInSubject / subjectLessonsCount) * 100;
            const subjectProgressElement = document.getElementById(`${subject}-progress`);
            if (subjectProgressElement) {
                subjectProgressElement.textContent = `${subjectProgress.toFixed(0)}% (${completedInSubject}/${subjectLessonsCount})`;
            }
        }

        const overallProgress = (totalCompletedLessons / TOTAL_LESSONS) * 100;

        // تحديث الواجهة الكلية
        overallProgressPercentage.textContent = `${overallProgress.toFixed(1)}%`;
        overallProgressBar.style.width = `${overallProgress.toFixed(1)}%`;
        completedLessonsCount.textContent = totalCompletedLessons;

        // التحقق من حالة الامتحان
        if (totalCompletedLessons === TOTAL_LESSONS) {
            examStatus.textContent = '✅ جاهز! يمكنك الآن بدء الامتحان.';
            examStatus.classList.remove('text-red-500');
            examStatus.classList.add('text-green-500');

            examLink.href = 'exam.html'; // توجيه لصفحة الامتحان
            examLink.classList.remove('bg-gray-400', 'cursor-not-allowed');
            examLink.classList.add('bg-raaya-green', 'text-gray-900', 'hover:bg-raaya-sky');
        } else {
            examStatus.textContent = `مغلق - تبقى لك ${TOTAL_LESSONS - totalCompletedLessons} درسًا.`;
        }
    };

    // تشغيل الدالة عند تحميل الصفحة
    calculateOverallProgress();
});