(function(global) {
    'use strict';

    // 1. 取得核心引擎
    const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
    
    // 2. 定義科目映射表：解決 HTML 請求與 JS 標籤不一致的問題
    const SUBJECT_MAP = {
        'social': ['history', 'geography', 'civics', '歷史', '地理', '公民', '社會'],
        'natural': ['physics', 'chemistry', 'biology', 'earth_science', '物理', '化學', '生物', '地科', '自然'],
        'math': ['math', '數學'],
        'chinese': ['chinese', '國文'],
        'english': ['english', '英文']
    };

    const PaperGeneratorV2 = {
        /**
         * 主生成函式
         * @param {string} subjectReq - HTML 傳入的科目 (如: "social")
         * @param {string} gradeReq - HTML 傳入的年級 (如: "國七")
         */
        generate: function(subjectReq, gradeReq) {
            if (!G) return this.createFallbackQuestion("引擎未就緒", "請檢查核心 JS 是否載入");

            // A. 轉換搜尋標籤
            const targetTags = SUBJECT_MAP[subjectReq] || [subjectReq];
            
            // B. 在註冊過的模板中尋找符合標籤的 ID
            const allIds = Object.keys(G._templates);
            let candidates = allIds.filter(id => {
                const qTags = G._templateTags[id] || [];
                // 檢查標籤中是否含有要求的科目關鍵字
                const hasSub = qTags.some(t => targetTags.some(target => t.toLowerCase().includes(target.toLowerCase())));
                // 檢查標籤中是否含有要求的年級
                const hasGrade = !gradeReq || qTags.some(t => t.includes(gradeReq));
                return hasSub && hasGrade;
            });

            // C. 找不到題目時的降級策略：忽略年級限制，只找科目
            if (candidates.length === 0) {
                candidates = allIds.filter(id => {
                    const qTags = G._templateTags[id] || [];
                    return qTags.some(t => targetTags.some(target => t.toLowerCase().includes(target.toLowerCase())));
                });
            }

            // D. 最終檢查與生成
            if (candidates.length === 0) {
                return this.createFallbackQuestion(subjectReq, gradeReq, "題庫中無符合標籤之題目");
            }

            const templateId = candidates[Math.floor(Math.random() * candidates.length)];
            const questionData = G.generateQuestion(templateId);

            return {
                ...questionData,
                subject: subjectReq,
                grade: gradeReq
            };
        },

        // 保底機制：讓畫面不留白，顯示錯誤原因
        createFallbackQuestion: function(sub, grd, reason) {
            return {
                question: `<div style="color:red">【系統訊息：${reason}】</div>
                           請確認 <b>templates_${sub}_core.js</b> 是否正確載入。<br>
                           目前尋找標籤：${sub}, ${grd}`,
                options: ["請檢查檔案路徑", "請確認標籤定義", "請確認 Adapter 註冊狀態", "重新整理"],
                answer: 0,
                concept: "除錯提示"
            };
        }
    };

    // 導出模組
    global.PaperGeneratorV2 = PaperGeneratorV2;
    console.log("✅ [PaperGenerator] V2 引擎已就緒，支援自動標籤映射。");
    
    // 觸發就緒事件
    document.dispatchEvent(new CustomEvent("PaperGeneratorReady"));

})(this);
