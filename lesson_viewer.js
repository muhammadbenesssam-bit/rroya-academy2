// js/lesson_viewer.js - منطق تشغيل الفيديو وحفظ التقدم

let player;
let lessonId;
let videoId;
let subjectName;

const COMPLETE_BTN = document.getElementById('complete-lesson-btn');
const PROGRESS_MESSAGE = document.getElementById('progress-message');

// 1. استخلاص بيانات الدرس من الرابط (URL)
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); // مثلاً: fiqh-1
    videoId = urlParams.get('vid'); // مثلاً: 4oBcd4-dJdo

    if (id && videoId) {
        lessonId = id;
        // استخلاص اسم المادة (fiqh, seerah, aqidah)
        subjectName = id.substring(0, id.indexOf('-')); 

        const lessonNumber = id.substring(id.indexOf('-') + 1);
        
        // تحديث العنوان وزر العودة
        document.getElementById('lesson-title').textContent = `الدرس رقم ${lessonNumber} في مادة ${subjectName === 'fiqh' ? 'الفقه' : subjectName === 'aqidah' ? 'العقيدة' : 'السيرة'}`;
        
        const backLink = document.getElementById('back-to-subject');
        if (backLink) {
             backLink.href = `subject_${subjectName}.html`;
        }
        
        // التحقق من حالة الإكمال الحالية
        updateProgressUI();
        
    } else {
        document.getElementById('lesson-title').textContent = 'خطأ: لم يتم تحديد الدرس.';
    }
});

// 2. دالة جاهزية مشغل اليوتيوب (يتم استدعاؤها تلقائياً بواسطة Youtube API)
function onYouTubeIframeAPIReady() {
    if (!videoId) return;

    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'controls': 1,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 3. دالة عند جاهزية المشغل
function onPlayerReady(event) {
    // يمكن بدء التشغيل إذا كنت لا تريد التشغيل التلقائي
    // event.target.playVideo();
}

// 4. دالة معالجة تغيير حالة التشغيل (الأهم: حالة الإكمال)
function onPlayerStateChange(event) {
    // حالة: الفيديو انتهى
    if (event.data === YT.PlayerState.ENDED) {
        markLessonCompleted(true);
    }
}

// 5. دالة تحديث حالة الإكمال في الواجهة
const updateProgressUI = () => {
    // دالة isLessonCompleted موجودة في progress_logic.js
    if (isLessonCompleted(subjectName, lessonId)) {
        PROGRESS_MESSAGE.classList.remove('hidden');
        PROGRESS_MESSAGE.classList.remove('bg-raaya-green/50');
        PROGRESS_MESSAGE.classList.add('bg-green-200', 'dark:bg-green-800');
        PROGRESS_MESSAGE.textContent = '✅ تم إكمال هذا الدرس مسبقاً.';
        COMPLETE_BTN.classList.add('hidden'); // إخفاء زر الإكمال اليدوي
    }
};

// 6. دالة حفظ التقدم (تُستخدم عند انتهاء الفيديو أو الضغط على الزر اليدوي)
const markLessonCompleted = (autoCompleted = false) => {
    if (isLessonCompleted(subjectName, lessonId)) {
        // إذا كان مكتملًا بالفعل، لا تفعل شيئًا
        return; 
    }
    
    // دالة saveProgress موجودة في progress_logic.js
    saveProgress(subjectName, lessonId);

    PROGRESS_MESSAGE.classList.remove('hidden');
    PROGRESS_MESSAGE.classList.add('bg-raaya-green/50', 'dark:bg-green-800');
    PROGRESS_MESSAGE.textContent = autoCompleted 
        ? '🎉 تم إكمال الدرس تلقائياً.'
        : '✅ تم وضع علامة "مكتمل" يدوياً.';
        
    COMPLETE_BTN.classList.add('hidden');
    
    // الانتظار قليلاً ثم العودة لصفحة المادة (اختياري)
    setTimeout(() => {
         window.location.href = `subject_${subjectName}.html`;
    }, 1500);
};

// 7. ربط زر الإكمال اليدوي
COMPLETE_BTN.addEventListener('click', () => {
    markLessonCompleted(false);
});