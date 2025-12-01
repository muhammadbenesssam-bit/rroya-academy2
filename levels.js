// js/levels.js

document.addEventListener('DOMContentLoaded', () => {
    // التحقق من حالة تسجيل الدخول، إذا لم يكن مسجلاً، يجب إعادته لصفحة الدخول
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('🚫 يجب تسجيل الدخول للوصول إلى المستويات.');
        window.location.href = 'login.html';
        return; 
    }
    
    // استرجاع بيانات المستخدم لتحديد المستوى الحالي
    const storedUser = localStorage.getItem('currentUser');
    const userData = storedUser ? JSON.parse(storedUser) : { currentLevel: 1 }; 
    const currentLevel = userData.currentLevel || 1;

    const levelsContainer = document.getElementById('levels-container');

    // تعريف جميع المستويات (يمكن توسيعها مستقبلاً)
    const levelsData = [
        { id: 1, name: 'المستوى الأول: أساسيات الشريعة', description: 'بداية رحلة التعلم: الفقه، السيرة، العقيدة.', link: 'level1.html', icon: '⭐' },
        { id: 2, name: 'المستوى الثاني: فقه العبادات', description: 'تعميق في أبواب الطهارة والصلاة.', link: 'level2.html', icon: '🌙' },
        { id: 3, name: 'المستوى الثالث: فقه المعاملات', description: 'دراسة البيوع والمعاملات المالية.', link: 'level3.html', icon: '⚖️' },
        { id: 4, name: 'المستوى الرابع: علوم الحديث والتفسير', description: 'مدخل إلى علوم الآلة.', link: 'level4.html', icon: '💡' }
    ];

    levelsData.forEach(level => {
        const isLevelActive = level.id <= currentLevel;
        const isDisabled = !isLevelActive;
        
        // تطبيق الألوان والأنماط بناءً على حالة المستوى (مفتوح/مغلق)
        const bgColor = isLevelActive ? 'bg-raaya-green/70 dark:bg-raaya-green/20' : 'bg-gray-200 dark:bg-gray-700';
        const ringColor = isLevelActive ? 'ring-raaya-sky' : 'ring-gray-400';
        const cursorStyle = isLevelActive ? 'cursor-pointer hover:shadow-xl' : 'cursor-not-allowed opacity-70';
        const linkHref = isLevelActive ? level.link : '#';
        const statusText = isLevelActive ? 'مفعل حالياً' : 'مغلق';
        const statusClass = isLevelActive ? 'text-green-700 dark:text-raaya-green' : 'text-red-500 dark:text-red-400';
        const statusIcon = isLevelActive ? '✅' : '🔒';


        const levelCard = document.createElement('a');
        levelCard.href = linkHref;
        levelCard.className = `block p-6 rounded-xl shadow-lg transition-all duration-300 ${bgColor} ${cursorStyle} ring-4 ${ringColor} transform hover:-translate-y-1`;
        
        if (isDisabled) {
             levelCard.onclick = (e) => {
                e.preventDefault();
                alert(`هذا المستوى (${level.name}) مغلق حالياً. يرجى إكمال المستوى السابق.`);
            };
        }

        levelCard.innerHTML = `
            <div class="flex items-start space-x-4 space-x-reverse">
                <span class="text-4xl">${level.icon}</span>
                <div>
                    <h3 class="text-2xl font-bold mb-1 dark:text-raaya-light">${level.name}</h3>
                    <p class="text-gray-700 dark:text-gray-300 mb-3">${level.description}</p>
                    <span class="text-sm font-semibold ${statusClass}">
                        ${statusIcon} ${statusText}
                    </span>
                </div>
            </div>
        `;
        levelsContainer.appendChild(levelCard);
    });
});