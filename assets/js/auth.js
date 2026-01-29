// assets/js/auth.js
const Auth = {
    dbKey: 'system_users_db',

    initDB: function() {
        const currentData = localStorage.getItem(this.dbKey);
        let users = currentData ? JSON.parse(currentData) : [];

        // 檢查是否已存在預設資料，若無則載入 window.UserDB
        if (users.length === 0 && window.UserDB) {
            users = window.UserDB;
        }

        // 【強制需求】確保唯一的老師帳號存在
        const teacherIndex = users.findIndex(u => u.username === 'teacher');
        const specificTeacher = { 
            username: "teacher", 
            password: "steve", // 密碼設定為 steve
            name: "Steve Teacher", 
            role: "teacher", 
            grade: "資深教師" 
        };

        if (teacherIndex !== -1) {
            // 如果存在，強制更新密碼為 steve (確保符合您的需求)
            users[teacherIndex] = specificTeacher;
        } else {
            // 不存在則新增
            users.push(specificTeacher);
        }

        localStorage.setItem(this.dbKey, JSON.stringify(users));
    },

    getAllUsers: function() {
        this.initDB();
        return JSON.parse(localStorage.getItem(this.dbKey));
    },

    // 【修改】註冊功能：強制只能註冊學生
    register: function(userData) {
        this.initDB();
        let users = this.getAllUsers();

        // 檢查帳號重複
        if (users.find(u => u.username === userData.username)) {
            return { success: false, message: "帳號已存在！" };
        }

        // 強制設定為學生
        userData.role = "student";
        // 如果沒有填年級，預設高一
        if (!userData.grade) userData.grade = "高一";

        users.push(userData);
        localStorage.setItem(this.dbKey, JSON.stringify(users));
        return { success: true, message: "註冊成功！歡迎加入雲端學院。" };
    },

    login: function(username, password) {
        this.initDB(); // 確保資料庫已初始化
        const users = this.getAllUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // 儲存當前使用者
            localStorage.setItem("currentUser", JSON.stringify(user));
            return { success: true, role: user.role };
        } else {
            return { success: false, message: "帳號或密碼錯誤" };
        }
    },

    // ★★★ 關鍵修改：登出時清除敏感資料 ★★★
    logout: function() {
        // 1. 移除登入狀態
        localStorage.removeItem("currentUser");

        // 2. 清除考試相關的暫存 (防止資料外洩給下一個使用者)
        localStorage.removeItem("examResult");      // 清除上一位的成績單
        localStorage.removeItem("last_exam_user");  // 清除上一位的考試身分紀錄
        localStorage.removeItem("temp_answers");    // 清除暫存答案(若有的話)

        // 3. 跳轉回登入頁
        window.location.href = "index.html";
    },

    requireLogin: function() {
        const userStr = localStorage.getItem("currentUser");
        if (!userStr) {
            window.location.href = "index.html";
            return null;
        }
        return JSON.parse(userStr);
    },

    requireRole: function(allowedRole) {
        const user = this.requireLogin();
        if (user && user.role !== allowedRole) {
             alert(`權限不足！此頁面僅限 ${allowedRole} 存取。`);
             window.location.href = "index.html";
             return null;
        }
        return user;
    },

    updateUser: function(field, value) {
        let current = this.requireLogin();
        if (!current) return;
        
        current[field] = value;
        localStorage.setItem("currentUser", JSON.stringify(current));

        let allUsers = this.getAllUsers();
        let idx = allUsers.findIndex(u => u.username === current.username);
        if (idx !== -1) {
            allUsers[idx][field] = value;
            localStorage.setItem(this.dbKey, JSON.stringify(allUsers));
        }
    },
    
    getCurrentUser: function() {
        const userStr = localStorage.getItem("currentUser");
        return userStr ? JSON.parse(userStr) : null;
    }
        // ... (保留原本的 getCurrentUser, login, logout, requireLogin 等) ...

    getCurrentUser: function() {
        const userStr = localStorage.getItem('cloud_academy_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    updateUser: function(key, value) {
        const user = this.getCurrentUser();
        if (user) {
            user[key] = value;
            localStorage.setItem('cloud_academy_user', JSON.stringify(user));
            return user;
        }
        return null;
    },
    // ==========================================
    // 🎮 Gamification (新增的經驗值系統)
    // ==========================================
    
    // 獲得經驗值 (回傳是否升級)
    addXP: function(amount) {
        let user = this.getCurrentUser();
        if (!user) return false;

        // 初始化 XP
        if (!user.xp) user.xp = 0;
        
        const oldLevel = this.calculateLevel(user.xp);
        user.xp += amount;
        const newLevel = this.calculateLevel(user.xp);

        // 存檔
        this.updateUser('xp', user.xp);
        
        // 如果等級變高了，回傳 true
        return newLevel > oldLevel;
    },

    // 計算等級 (每 100 XP 升一級)
    calculateLevel: function(xp) {
        return Math.floor((xp || 0) / 100) + 1;
    },

    // 取得當前等級進度 (0% - 100%)
    getLevelProgress: function() {
        const user = this.getCurrentUser();
        const xp = user.xp || 0;
        return (xp % 100); // 因為每 100 升一級，餘數就是當前進度
    }
};

// 初始化
Auth.initDB();
