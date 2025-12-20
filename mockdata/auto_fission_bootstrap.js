(function(window){
    'use strict';
    
    // 1. 取得引擎實例
    const G = window.RigorousGenerator || (window.global && window.global.RigorousGenerator);
    
    if (!G) {
        console.error("❌ [Bootstrap] 嚴重錯誤：Generator Engine 未載入！裂變失敗。");
        return;
    }

    // 2. 檢查工廠是否存在
    if (!G.autoFissionRegister) {
        console.error("❌ [Bootstrap] 嚴重錯誤：AutoTemplateFissionFactory 未載入！無法裂變。");
        return;
    }

    // 3. 備份原始註冊函數 (Raw Register)
    // 加上防止重複備份的機制
    if (!G._rawRegister) {
        G._rawRegister = G.registerTemplate;
    }

    // 4. 覆寫註冊函數 (The Interceptor)
    // 這是魔法發生的地方：當 templates 呼叫 registerTemplate 時，其實是呼叫這個函式
    G.registerTemplate = function(name, func, tags = []) {
        
        // Debug: 在 Console 顯示正在處理哪個題目
        // console.log(`⚡ [Bootstrap] 正在裂變題目: ${name}`);

        // A. 呼叫裂變工廠 (產生 記憶/理解/應用/分析 4種變體)
        // 注意：我們傳入 G._rawRegister，讓工廠用「原始通道」把裂變後的題目寫入資料庫
        try {
            G.autoFissionRegister(name, func, tags, G._rawRegister);
        } catch (e) {
            console.error(`⚠️ [Bootstrap] 題目 ${name} 裂變失敗:`, e);
            // 如果裂變失敗，至少註冊原始版本，避免題目消失
            G._rawRegister.call(G, name, func, tags);
        }
    };

    console.log("🚀 [Bootstrap] 自動裂變攔截器已啟動 (Interceptor Active)");
    console.log("👉 接下來載入的題目都會自動生成 4 種認知題型。");

})(window);
