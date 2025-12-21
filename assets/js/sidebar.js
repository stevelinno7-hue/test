/**
 * 統一側邊欄渲染組件
 */
const Sidebar = {
    render: function(activeNav) {
        const currentUser = JSON.parse(localStorage.getItem('user')) || { name: '--', grade: '--' };
        
        const html = `
        <aside class="w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col z-20 shrink-0 h-screen">
            <div class="h-16 flex items-center px-6 border-b border-slate-50">
                <div class="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm mr-2 shadow-sm">翰</div>
                <span class="text-lg font-bold text-slate-800 tracking-tight">雲端學院</span>
            </div>

            <div class="px-4 py-6">
                <div class="bg-white border border-slate-50 rounded-2xl p-6 text-center shadow-sm">
                    <div class="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-2xl text-blue-500 mb-3 border-2 border-white shadow-sm">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <h3 class="font-bold text-slate-800 text-base">${currentUser.name}</h3>
                    <div class="text-[11px] text-slate-400 mt-1 mb-3 font-medium uppercase tracking-wider">${currentUser.grade}</div>
                    <button onclick="openProfileModal()" class="text-[10px] font-bold text-slate-400 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 hover:text-slate-600 transition-all">
                        <i class="fas fa-pen mr-1"></i> 編輯年級
                    </button>
                </div>
            </div>

            <nav class="flex-grow px-3 space-y-1 overflow-y-auto no-scrollbar">
                ${this.createNavItem('dashboard', 'dashboard.html', 'fa-th-large', '課程總覽', activeNav)}
                ${this.createNavItem('remedial', 'remedial.html', 'fa-book-medical', '錯題補救', activeNav)}
                ${this.createNavItem('analysis', 'analysis.html', 'fa-chart-pie', '學習分析', activeNav)}
                ${this.createNavItem('forum', 'forum.html', 'fa-comments', '解題論壇', activeNav)}
            </nav>

            <div class="p-4 border-t border-slate-50">
                <button onclick="Auth.logout()" class="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 py-3 transition-colors font-bold text-xs">
                    <i class="fas fa-sign-out-alt"></i> 登出系統
                </button>
            </div>
        </aside>`;
        
        // 將內容插入到頁面中具有 id="sidebarContainer" 的標籤內
        const container = document.getElementById('sidebarContainer');
        if (container) container.innerHTML = html;
    },

    createNavItem: function(id, url, icon, text, activeNav) {
        const isActive = id === activeNav;
        const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium";
        const activeClass = "bg-blue-50 text-blue-600 font-bold";
        const inactiveClass = "text-slate-500 hover:bg-slate-50 hover:text-slate-800";
        
        return `
            <a href="${url}" class="${baseClass} ${isActive ? activeClass : inactiveClass}">
                <i class="fas ${icon} w-5 text-center"></i> ${text}
            </a>
        `;
    }
};
