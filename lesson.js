// js/lesson_viewer.js

document.addEventListener('DOMContentLoaded', () => {
    const videoEmbed = document.getElementById('video-embed');
    const lessonTitle = document.getElementById('lesson-title');
    const backLink = document.getElementById('back-link');
    const completeBtn = document.getElementById('complete-lesson-btn');
    const completionMessage = document.getElementById('completion-message');

    // 1. استخلاص بيانات الدرس من الـ URL
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id'); // مثلاً: fiqh-1
    const videoId = urlParams.get('vid'); // مثلاً: kYJv9eU7W0E
    const subjectName = lessonId ? lessonId.split('-')[0] : '';
    
    // 2. التحقق من البيانات وتعيين روابط الفيديو
    if (lessonId && videoId) {
        
        // تعيين رابط الفيديو المدمج
        videoEmbed.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        
        // تعيين العنوان (يمكن تخصيصه لاحقاً)
        lessonTitle.textContent = `الدرس: ${lessonId.toUpperCase()}`;
        
        // تعيين رابط العودة
        backLink.href = `subject_${subjectName}.html`;

        // 3. التحقق من حالة الإكمال الحالية
        const progressData = JSON.parse(localStorage.getItem('raaya_progress') || '{}');
        const isCompleted = progressData[subjectName] && progressData[subjectName][lessonId];
        
        if (isCompleted) {
            completeBtn.disabled = true;
            completeBtn.textContent = '✅ تم إكمال هذا الدرس مسبقاً';
            completionMessage.textContent = 'تم حفظ تقدمك مسبقاً.';
            completionMessage.classList.remove('hidden');
        }

        // 4. منطق إكمال الدرس
        completeBtn.addEventListener('click', () => {
            if (isCompleted) return;

            let currentProgress = JSON.parse(localStorage.getItem('raaya_progress'));
            
            if (currentProgress[subjectName] && currentProgress[subjectName][lessonId] !== true) {
                currentProgress[subjectName][lessonId] = true;
                localStorage.setItem('raaya_progress', JSON.stringify(currentProgress));
                
                // تحديث الواجهة
                completeBtn.disabled = true;
                completeBtn.textContent = '✅ تم حفظ التقدم بنجاح!';
                completionMessage.classList.remove('hidden');

                alert('🎉 تم حفظ تقدمك بنجاح! سيتم فتح الدرس التالي في قائمة المواد.');
                
                // العودة لصفحة المادة لرؤية الدرس التالي مفتوحاً
                setTimeout(() => {
                    window.location.href = backLink.href;
                }, 1500); 
            }
        });

    } else {
        lessonTitle.textContent = '⚠️ خطأ في تحميل الدرس';
        videoEmbed.src = '';
        completionMessage.textContent = 'يرجى العودة إلى قائمة المواد واختيار درس صحيح.';
        completionMessage.classList.remove('hidden');
        completeBtn.classList.add('hidden');
    }
});