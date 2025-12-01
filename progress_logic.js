// js/progress_logic.js - إدارة حالة التقدم والمستخدمين (محدث للسماح بفتح الدروس بدون تسجيل)

// الثوابت - عدد الدروس
const LESSON_COUNTS = { fiqh: 20, seerah: 21, aqidah: 20 };
const REQUIRED_COMPLETION = 0.95; // نسبة الإكمال المطلوبة لفتح الامتحان (95%)

// مفاتيح التخزين
const USERS_KEY = 'raaya_users';
const CURRENT_USER_KEY = 'raaya_current_user';
const PROGRESS_KEY_PREFIX = 'raaya_progress_';
const GUEST_PROGRESS_KEY = 'raaya_guest_progress'; // مفتاح تخزين مؤقت للزوار

// ------------------------------------------------------------------
// 1. منطق المستخدمين والمصادقة (Authentication)
// ------------------------------------------------------------------

const getUsers = () => {
    const usersData = localStorage.getItem(USERS_KEY);
    return usersData ? JSON.parse(usersData) : {};
};
const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};
export const registerUser = (username, password, extraData) => {
    const users = getUsers();
    if (users[username]) {
        return false; 
    }
    users[username] = { 
        password: password, 
        progressKey: PROGRESS_KEY_PREFIX + username,
        ...extraData 
    }; 
    saveUsers(users);
    return true;
};
export const loginUser = (username, password) => {
    const users = getUsers();
    if (users[username] && users[username].password === password) {
        localStorage.setItem(CURRENT_USER_KEY, username);
        return true; 
    }
    return false; 
};
export const logoutUser = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};
export const getCurrentUser = () => {
    return localStorage.getItem(CURRENT_USER_KEY);
};

// ------------------------------------------------------------------
// 2. منطق حفظ التقدم (Persistence)
// ------------------------------------------------------------------

const getCurrentProgressKey = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const users = getUsers();
        return users[currentUser] ? users[currentUser].progressKey : null;
    }
    return GUEST_PROGRESS_KEY; 
};

const getProgress = () => {
    const progressKey = getCurrentProgressKey();
    if (!progressKey) return {}; 
    
    const progressData = localStorage.getItem(progressKey);
    return progressData ? JSON.parse(progressData) : {};
};

const saveProgressState = (progressState) => {
    const progressKey = getCurrentProgressKey();
    if (!progressKey) return;

    localStorage.setItem(progressKey, JSON.stringify(progressState));
};

export const saveProgress = (subjectName, lessonId) => {
    const progress = getProgress();
    if (!progress[subjectName]) {
        progress[subjectName] = [];
    }
    if (!progress[subjectName].includes(lessonId)) {
        progress[subjectName].push(lessonId);
        saveProgressState(progress);
    }
};

export const isLessonCompleted = (subjectName, lessonId) => {
    const progress = getProgress();
    return progress[subjectName] && progress[subjectName].includes(lessonId);
};

/**
 * 💡 هذا هو المنطق الذي يفتح الدرس الأول للجميع 💡
 */
export const isLessonOpen = (subjectName, lessonNumber) => {
    // 1. الدرس الأول مفتوح دائمًا للجميع
    if (lessonNumber === 1) {
        return true;
    }
    
    // 2. التحقق من إكمال الدرس السابق
    const prevLessonId = `${subjectName}-${lessonNumber - 1}`;
    
    return isLessonCompleted(subjectName, prevLessonId);
};


// ------------------------------------------------------------------
// 3. منطق عرض التقدم (UI Logic)
// ------------------------------------------------------------------

export const calculateSubjectProgress = (subjectName) => {
    const completedLessons = getProgress()[subjectName] ? getProgress()[subjectName].length : 0;
    const totalLessons = LESSON_COUNTS[subjectName] || 1; 

    return completedLessons / totalLessons;
};

export const updateSubjectProgressBar = (subjectName) => {
    const progressBar = document.getElementById('subject-progress-bar');
    const progressText = document.getElementById('subject-progress-text');

    if (!progressBar || !progressText) return;

    const progressRatio = calculateSubjectProgress(subjectName);
    const completedCount = getProgress()[subjectName] ? getProgress()[subjectName].length : 0;
    const totalCount = LESSON_COUNTS[subjectName];

    const percentage = Math.floor(progressRatio * 100);

    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% (${completedCount}/${totalCount} درس)`;
};

export const updateExamStatus = () => {
    const examButton = document.getElementById('exam-button');
    const completionStatus = document.getElementById('completion-status');

    if (!examButton || !completionStatus) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
         examButton.textContent = 'الامتحان مغلق (يجب تسجيل الدخول لفتح الامتحان)';
         examButton.classList.add('bg-gray-400', 'cursor-not-allowed');
         examButton.disabled = true;
         completionStatus.textContent = 'يمكنك دراسة الدروس كزائر، ولكن يجب التسجيل لفتح الامتحان.';
         return;
    }

    let completedSubjects = 0;
    const totalSubjects = Object.keys(LESSON_COUNTS).length;
    let subjectsRemaining = [];

    for (const subject in LESSON_COUNTS) {
        const progress = calculateSubjectProgress(subject);
        if (progress >= REQUIRED_COMPLETION) {
            completedSubjects++;
        } else {
            subjectsRemaining.push(subject);
        }
    }
    
    if (completedSubjects === totalSubjects) {
        examButton.textContent = '🎉 ابدأ الامتحان النهائي للمستوى الأول';
        examButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
        examButton.classList.add('bg-raaya-green', 'hover:bg-raaya-sky', 'cursor-pointer');
        examButton.disabled = false;
        examButton.onclick = () => { 
            window.location.href = 'exam.html'; 
        };
        completionStatus.textContent = 'مبارك! تم إكمال جميع المواد. الامتحان جاهز.';

    } else {
        examButton.textContent = 'الامتحان مغلق (أكمل جميع الدروس)';
        examButton.classList.add('bg-gray-400', 'cursor-not-allowed');
        examButton.classList.remove('bg-raaya-green', 'hover:bg-raaya-sky', 'cursor-pointer');
        examButton.disabled = true;

        const remainingText = subjectsRemaining.map(s => {
            if (s === 'fiqh') return 'الفقه';
            if (s === 'aqidah') return 'العقيدة';
            if (s === 'seerah') return 'السيرة';
            return s;
        }).join('، ');

        completionStatus.textContent = `متبقي لديك ${totalSubjects - completedSubjects} مواد لإكمالها: (${remainingText}).`;
    }
};