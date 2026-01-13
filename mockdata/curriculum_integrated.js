(function(global){
    'use strict';

    global.CurriculumLibrary = global.CurriculumLibrary || {};
    global.CurriculumLibrary.version = "3.1.0-Expanded";
    global.CurriculumLibrary.lastUpdated = "2026-01-14";

    // ==========================================
    //  FULL CURRICULUM DATABASE (Expanded based on TW 108 Curriculum)
    // ==========================================
    const fullData = {
        
        // --- 數學 (Math) ---
        math: [
            // Junior High (Books 1-6)
            {
                id: "math_j1", name: "國七數學 (上)", stage: "junior_high", subject: "math", book: "Book 1",
                units: [
                    { name: "單元 1：整數的運算", topics: ["正負數與絕對值", "整數的加減", "整數的乘除", "指數與科學記號"] },
                    { name: "單元 2：分數的運算", topics: ["因數與倍數", "最大公因數與最小公倍數", "分數的加減乘除", "指數律"] },
                    { name: "單元 3：一元一次方程式", topics: ["以符號代表數", "一元一次式的運算", "解一元一次方程式", "應用問題"] }
                ]
            },
            {
                id: "math_j2", name: "國七數學 (下)", stage: "junior_high", subject: "math", book: "Book 2",
                units: [
                    { name: "單元 1：二元一次聯立方程式", topics: ["二元一次方程式", "解聯立方程式(代入/加減)", "應用問題"] },
                    { name: "單元 2：直角坐標與圖形", topics: ["直角坐標平面", "二元一次方程式的圖形"] },
                    { name: "單元 3：比與比例", topics: ["比例式與連比例", "正比與反比"] },
                    { name: "單元 4：一元一次不等式", topics: ["不等式的解與圖示", "不等式的應用"] }
                ]
            },
            {
                id: "math_j3", name: "國八數學 (上)", stage: "junior_high", subject: "math", book: "Book 3",
                units: [
                    { name: "單元 1：乘法公式與多項式", topics: ["乘法公式", "多項式的加減乘除"] },
                    { name: "單元 2：平方根與畢氏定理", topics: ["平方根與近似值", "根式的運算", "畢氏定理"] },
                    { name: "單元 3：因式分解", topics: ["提公因式", "乘法公式因式分解", "十字交乘法"] }
                ]
            },
            {
                id: "math_j4", name: "國八數學 (下)", stage: "junior_high", subject: "math", book: "Book 4",
                units: [
                    { name: "單元 1：等差數列與級數", topics: ["等差數列", "等差級數"] },
                    { name: "單元 2：幾何圖形與尺規作圖", topics: ["平面圖形", "垂直、平分與線對稱", "尺規作圖"] },
                    { name: "單元 3：三角形的性質", topics: ["三角形的內角與外角", "三角形的全等性質(SAS, AAS...)", "邊角不等等關係"] },
                    { name: "單元 4：平行與四邊形", topics: ["平行線截角性質", "平行四邊形與特殊四邊形"] }
                ]
            },
            {
                id: "math_j5", name: "國九數學 (上)", stage: "junior_high", subject: "math", book: "Book 5",
                units: [
                    { name: "單元 1：相似形", topics: ["連比例", "相似三角形", "相似形的應用"] },
                    { name: "單元 2：圓形", topics: ["點、直線與圓的關係", "圓心角、圓周角與弦切角"] },
                    { name: "單元 3：幾何證明與三角形的心", topics: ["幾何推理證明", "三角形的外心、內心與重心"] }
                ]
            },
            {
                id: "math_j6", name: "國九數學 (下)", stage: "junior_high", subject: "math", book: "Book 6",
                units: [
                    { name: "單元 1：二次函數", topics: ["二次函數的圖形(拋物線)", "配方法與頂點", "最大值與最小值"] },
                    { name: "單元 2：統計與機率", topics: ["統計圖表與數據分析(四分位數/盒狀圖)", "機率入門"] },
                    { name: "單元 3：立體幾何圖形", topics: ["角柱與圓柱", "角錐與圓錐", "展開圖"] }
                ]
            },
            // Senior High (Books 1-6) - Math A/B Split usually happens in Book 3
            {
                id: "math_s1", name: "高一數學 (上)", stage: "high_school", subject: "math", book: "Book 1",
                units: [
                    { name: "單元 1：數與式", topics: ["數系與絕對值", "算幾不等式", "指數與對數基本運算"] },
                    { name: "單元 2：直線與圓", topics: ["直線方程式與斜率", "圓方程式", "直線與圓的關係"] },
                    { name: "單元 3：多項式函數", topics: ["多項式的除法原理", "餘式定理與因式定理", "二次函數與不等式"] }
                ]
            },
            {
                id: "math_s2", name: "高一數學 (下)", stage: "high_school", subject: "math", book: "Book 2",
                units: [
                    { name: "單元 1：數列與級數", topics: ["等差與等比", "Σ運算", "數學歸納法"] },
                    { name: "單元 2：排列組合", topics: ["計數原理", "排列", "組合", "二項式定理"] },
                    { name: "單元 3：機率", topics: ["古典機率", "期望值"] },
                    { name: "單元 4：數據分析", topics: ["一維數據分析(標準差)", "二維數據分析(相關係數/迴歸直線)"] }
                ]
            },
            {
                id: "math_s3a", name: "高二數學 A (上)", stage: "high_school", subject: "math", book: "Book 3A",
                units: [
                    { name: "單元 1：三角函數", topics: ["弧度量", "三角函數圖形", "和差角公式", "正餘弦定理"] },
                    { name: "單元 2：指數與對數函數", topics: ["指數函數圖形", "對數函數圖形", "方程式與不等式"] },
                    { name: "單元 3：平面向量", topics: ["向量運算", "內積", "柯西不等式", "面積與行列式"] }
                ]
            },
            {
                id: "math_s4a", name: "高二數學 A (下)", stage: "high_school", subject: "math", book: "Book 4A",
                units: [
                    { name: "單元 1：空間向量", topics: ["空間坐標系", "空間向量運算", "外積", "平面方程式"] },
                    { name: "單元 2：空間中的直線與平面", topics: ["直線方程式", "距離公式", "夾角"] },
                    { name: "單元 3：矩陣", topics: ["矩陣運算", "矩陣的乘法", "反方陣", "平面上的線性變換"] },
                    { name: "單元 4：二次曲線", topics: ["拋物線", "橢圓", "雙曲線"] }
                ]
            },
            {
                id: "math_s5a", name: "高三數學甲 (上)", stage: "high_school", subject: "math", book: "Book 5 (Calc)",
                units: [
                    { name: "單元 1：極限與函數", topics: ["數列的極限", "函數的極限", "連續函數"] },
                    { name: "單元 2：微分", topics: ["導數與導函數", "微分公式(連鎖律)", "微分應用(極值、切線、凹凸性)"] },
                    { name: "單元 3：積分", topics: ["黎曼和與定積分", "微積分基本定理", "積分應用(面積、體積)"] }
                ]
            },
            {
                id: "math_s6a", name: "高三數學甲 (下)", stage: "high_school", subject: "math", book: "Book 6",
                units: [
                    { name: "單元 1：複數與多項式方程式", topics: ["複數極式", "棣美弗定理"] },
                    { name: "單元 2：隨機變數", topics: ["隨機變數", "二項分佈", "幾何分佈", "常態分佈"] }
                ]
            }
        ],

        // --- 英文 (English) ---
        english: [
            // Junior High
            {
                id: "eng_j1", name: "國七英文 (上)", stage: "junior_high", subject: "english", book: "Book 1",
                units: [
                    { name: "Unit 1: Be Verbs", topics: ["Am/Is/Are", "Subject Pronouns"] },
                    { name: "Unit 2: Nouns", topics: ["Singular/Plural", "This/That/These/Those"] },
                    { name: "Unit 3: Imperatives", topics: ["Don't/Let's", "Prepositions of Place"] }
                ]
            },
            {
                id: "eng_j2", name: "國七英文 (下)", stage: "junior_high", subject: "english", book: "Book 2",
                units: [
                    { name: "Unit 1: Present Progressive", topics: ["V-ing rules", "What are you doing?"] },
                    { name: "Unit 2: Quantifiers", topics: ["How many/much", "Some/Any"] },
                    { name: "Unit 3: Past Tense (Be)", topics: ["Was/Were", "Time expressions"] }
                ]
            },
            {
                id: "eng_j3", name: "國八英文 (上)", stage: "junior_high", subject: "english", book: "Book 3",
                units: [
                    { name: "Unit 1: Past Simple", topics: ["Regular/Irregular Verbs", "Did questions"] },
                    { name: "Unit 2: Future Tense", topics: ["Will", "Be going to"] },
                    { name: "Unit 3: Patterns", topics: ["Give/Buy (Dative verbs)", "Imperatives with if"] }
                ]
            },
            {
                id: "eng_j4", name: "國八英文 (下)", stage: "junior_high", subject: "english", book: "Book 4",
                units: [
                    { name: "Unit 1: Comparison", topics: ["Comparative adj.", "Superlative adj."] },
                    { name: "Unit 2: Verbs Pattern", topics: ["Spend/Cost/Take/Pay", "Gerund vs Infinitive"] },
                    { name: "Unit 3: Conjunctions", topics: ["Although/Though", "Before/After/When"] }
                ]
            },
            {
                id: "eng_j5", name: "國九英文 (上)", stage: "junior_high", subject: "english", book: "Book 5",
                units: [
                    { name: "Unit 1: Present Perfect", topics: ["Have/Has + p.p.", "Since/For"] },
                    { name: "Unit 2: Passive Voice", topics: ["Be + p.p.", "By agent"] },
                    { name: "Unit 3: Relative Clause I", topics: ["Who/Which/That", "Subject relative pronouns"] }
                ]
            },
            {
                id: "eng_j6", name: "國九英文 (下)", stage: "junior_high", subject: "english", book: "Book 6",
                units: [
                    { name: "Unit 1: Relative Clause II", topics: ["Object relative pronouns", "Preposition placement"] },
                    { name: "Unit 2: Noun Clauses", topics: ["That clause", "Wh- clause"] },
                    { name: "Unit 3: Review", topics: ["Tag Questions", "Make/Have/Let (Causative)"] }
                ]
            },
            // Senior High
            {
                id: "eng_s1", name: "高一英文 (上)", stage: "high_school", subject: "english", book: "Book 1",
                units: [
                    { name: "Unit 1: Sentence Structure", topics: ["Five sentence patterns", "S+V+O+OC"] },
                    { name: "Unit 2: Perfect Tenses", topics: ["Present/Past/Future Perfect"] },
                    { name: "Unit 3: Relative Clauses", topics: ["Defining vs Non-defining", "Quantifiers in RC"] }
                ]
            },
            {
                id: "eng_s2", name: "高一英文 (下)", stage: "high_school", subject: "english", book: "Book 2",
                units: [
                    { name: "Unit 1: Participles", topics: ["V-ing/V-pp as Adjectives", "Participle Construction"] },
                    { name: "Unit 2: Infinitives", topics: ["To V as subject/object", "Too...to / Enough to"] },
                    { name: "Unit 3: Comparison Adv.", topics: ["The more...the more", "Multiplier comparison"] }
                ]
            },
            {
                id: "eng_s3", name: "高二英文 (上)", stage: "high_school", subject: "english", book: "Book 3",
                units: [
                    { name: "Unit 1: Subjunctive Mood", topics: ["If I were you", "Past perfect subjunctive"] },
                    { name: "Unit 2: Inversion", topics: ["Negative adverbs", "Only + prep phrase"] },
                    { name: "Unit 3: Reduced Clauses", topics: ["Adjective clause reduction", "Adverbial clause reduction"] }
                ]
            },
            {
                id: "eng_s4", name: "高二英文 (下)", stage: "high_school", subject: "english", book: "Book 4",
                units: [
                    { name: "Unit 1: Advanced Passive", topics: ["It is said that...", "Passive with modals"] },
                    { name: "Unit 2: Compound Adj.", topics: ["N-Ving", "Adj-Noun-ed"] },
                    { name: "Unit 3: Rhetoric", topics: ["Metaphor", "Simile", "Personification"] }
                ]
            },
            {
                id: "eng_s5", name: "高三英文 (全)", stage: "high_school", subject: "english", book: "Book 5",
                units: [
                    { name: "Unit 1: News English", topics: ["Headlines", "Journalistic vocabulary"] },
                    { name: "Unit 2: Literature", topics: ["Short stories", "Poetry appreciation"] },
                    { name: "Unit 3: Academic Writing", topics: ["Topic sentences", "Transitions"] }
                ]
            }
        ],

        // --- 物理 (Physics) ---
        physics: [
            // Junior High (Integrated in Science)
            {
                id: "phy_j3", name: "國八理化 (上)", stage: "junior_high", subject: "physics", book: "Book 3",
                units: [
                    { name: "單元 1：基本測量", topics: ["長度與體積", "質量與密度", "估計值"] },
                    { name: "單元 2：波動與聲音", topics: ["波的性質", "聲波與樂音", "回聲"] },
                    { name: "單元 3：光", topics: ["光的反射與面鏡", "光的折射與透鏡", "色散與顏色"] },
                    { name: "單元 4：熱", topics: ["溫度與熱量", "熱的傳播(傳導/對流/輻射)", "比熱"] }
                ]
            },
            {
                id: "phy_j5", name: "國九理化 (上-物理篇)", stage: "junior_high", subject: "physics", book: "Book 5",
                units: [
                    { name: "單元 1：直線運動", topics: ["位置與位移", "速度與速率", "加速度"] },
                    { name: "單元 2：力與運動", topics: ["牛頓第一運動定律", "牛頓第二運動定律", "牛頓第三運動定律", "圓周運動"] },
                    { name: "單元 3：功與能", topics: ["功與功率", "動能與位能", "力學能守恆", "簡單機械"] }
                ]
            },
            {
                id: "phy_j6", name: "國九理化 (下-物理篇)", stage: "junior_high", subject: "physics", book: "Book 6",
                units: [
                    { name: "單元 1：電與生活", topics: ["電流與電壓", "電阻與歐姆定律", "電路連接"] },
                    { name: "單元 2：電流磁效應", topics: ["磁鐵與磁場", "電流磁效應", "電磁鐵"] },
                    { name: "單元 3：電磁感應", topics: ["法拉第定律", "發電機與馬達", "變壓器"] }
                ]
            },
            // Senior High
            {
                id: "phy_s1", name: "高一物理 (必修)", stage: "high_school", subject: "physics", book: "Book 1 (Compulsory)",
                units: [
                    { name: "單元 1：科學態度", topics: ["SI單位", "測量不確定度"] },
                    { name: "單元 2：物質組成", topics: ["原子模型演變", "基本交互作用(四大力)"] },
                    { name: "單元 3：物體運動", topics: ["直線運動分析", "牛頓定律應用"] },
                    { name: "單元 4：電與磁", topics: ["電流磁效應", "電磁感應", "波與光粒二象性"] },
                    { name: "單元 5：能量", topics: ["能量形式", "能源與核能", "量子現象初探"] }
                ]
            },
            {
                id: "phy_s2", name: "高二物理 (選修 I)", stage: "high_school", subject: "physics", book: "Book 2 (Elective-Mechanics)",
                units: [
                    { name: "單元 1：平面運動", topics: ["拋體運動", "圓周運動"] },
                    { name: "單元 2：牛頓定律應用", topics: ["慣性力", "摩擦力分析"] },
                    { name: "單元 3：動量與衝量", topics: ["動量守恆", "質心運動", "碰撞"] },
                    { name: "單元 4：萬有引力", topics: ["克卜勒定律", "萬有引力定律"] }
                ]
            },
            {
                id: "phy_s3", name: "高二物理 (選修 II)", stage: "high_school", subject: "physics", book: "Book 3 (Elective-Energy)",
                units: [
                    { name: "單元 1：功與能量", topics: ["變力作功", "保守力與位能"] },
                    { name: "單元 2：熱學", topics: ["理想氣體方程式", "氣體動力論", "熱容量"] }
                ]
            },
            {
                id: "phy_s4", name: "高三物理 (選修 III)", stage: "high_school", subject: "physics", book: "Book 4 (Elective-Wave/Light)",
                units: [
                    { name: "單元 1：波動", topics: ["波的疊加", "駐波", "都卜勒效應"] },
                    { name: "單元 2：聲波", topics: ["空氣柱共鳴"] },
                    { name: "單元 3：幾何光學", topics: ["折射定律", "透鏡成像公式"] },
                    { name: "單元 4：物理光學", topics: ["干涉(雙狹縫)", "繞射(單狹縫)"] }
                ]
            },
            {
                id: "phy_s5", name: "高三物理 (選修 IV)", stage: "high_school", subject: "physics", book: "Book 5 (Elective-EM)",
                units: [
                    { name: "單元 1：靜電學", topics: ["庫侖定律", "電場與電位", "高斯定律(定性)"] },
                    { name: "單元 2：電流電路", topics: ["克希荷夫定律", "電容"] },
                    { name: "單元 3：電流磁效應", topics: ["必歐-沙伐定律", "安培定律"] },
                    { name: "單元 4：電磁感應", topics: ["冷次定律", "電感", "馬克士威方程式(概念)"] }
                ]
            },
            {
                id: "phy_s6", name: "高三物理 (選修 V)", stage: "high_school", subject: "physics", book: "Book 6 (Elective-Modern)",
                units: [
                    { name: "單元 1：量子現象", topics: ["光電效應", "波耳氫原子模型"] },
                    { name: "單元 2：原子核與粒子", topics: ["放射性衰變", "標準模型簡介"] }
                ]
            }
        ],

        // --- 化學 (Chemistry) ---
        chemistry: [
            // Junior High
            {
                id: "chem_j4", name: "國八理化 (下)", stage: "junior_high", subject: "chemistry", book: "Book 4",
                units: [
                    { name: "單元 1：物質的組成", topics: ["元素與化合物", "原子結構", "週期表"] },
                    { name: "單元 2：化學反應", topics: ["化學式", "化學反應式", "原子量與分子量", "莫耳數"] },
                    { name: "單元 3：常見的化學反應", topics: ["氧化與還原", "酸鹼定義", "pH值", "酸鹼中和"] },
                    { name: "單元 4：有機化合物", topics: ["烴類", "醇/酸/酯", "聚合物", "肥皂與清潔劑"] }
                ]
            },
            // Senior High
            {
                id: "chem_s1", name: "高一化學 (必修)", stage: "high_school", subject: "chemistry", book: "Book 1 (Compulsory)",
                units: [
                    { name: "單元 1：物質的組成", topics: ["原子結構", "週期表規律", "八隅體規則", "化學鍵(離子/共價/金屬)"] },
                    { name: "單元 2：化學反應", topics: ["化學計量", "反應熱(吸放熱)", "溶解度與濃度"] },
                    { name: "單元 3：生活化學", topics: ["生物分子(醣/蛋白/脂/核酸)", "藥物", "水資源與環境污染"] }
                ]
            },
            {
                id: "chem_s2", name: "高二化學 (選修 I)", stage: "high_school", subject: "chemistry", book: "Book 2 (Elective-Structure)",
                units: [
                    { name: "單元 1：原子構造", topics: ["原子軌域(s,p,d,f)", "電子組態"] },
                    { name: "單元 2：化學鍵結", topics: ["路易斯結構", "VSEPR模型", "混成軌域"] },
                    { name: "單元 3：物質狀態", topics: ["氣體定律", "分子間作用力", "相圖"] }
                ]
            },
            {
                id: "chem_s3", name: "高二化學 (選修 II)", stage: "high_school", subject: "chemistry", book: "Book 3 (Elective-Reaction)",
                units: [
                    { name: "單元 1：化學反應速率", topics: ["速率定律", "碰撞學說", "催化劑"] },
                    { name: "單元 2：化學平衡", topics: ["平衡常數(Kc, Kp)", "勒沙特列原理"] }
                ]
            },
            {
                id: "chem_s4", name: "高三化學 (選修 III)", stage: "high_school", subject: "chemistry", book: "Book 4 (Elective-Solution)",
                units: [
                    { name: "單元 1：溶液性質", topics: ["拉午耳定律", "依數性質(沸點上升/凝固點下降)"] },
                    { name: "單元 2：酸鹼鹽平衡", topics: ["布-洛酸鹼", "Ka/Kb/Kw", "緩衝溶液", "滴定曲線"] }
                ]
            },
            {
                id: "chem_s5", name: "高三化學 (選修 IV)", stage: "high_school", subject: "chemistry", book: "Book 5 (Elective-Electro/Organic)",
                units: [
                    { name: "單元 1：氧化還原與電化學", topics: ["氧化數", "電池電位", "電解與電鍍"] },
                    { name: "單元 2：有機化學 (一)", topics: ["有機官能基", "異構物", "烷/烯/炔反應"] },
                    { name: "單元 3：有機化學 (二)", topics: ["芳香烴", "醇/醚/醛/酮/酸/酯", "胺/醯胺"] }
                ]
            }
        ],

        // --- 生物 (Biology) ---
        biology: [
            // Junior High
            {
                id: "bio_j1", name: "國七生物 (上)", stage: "junior_high", subject: "biology", book: "Book 1",
                units: [
                    { name: "單元 1：生命的特性", topics: ["科學方法", "細胞構造", "物質進出細胞(滲透/擴散)"] },
                    { name: "單元 2：養分", topics: ["食物中的養分", "酵素", "光合作用", "消化系統"] },
                    { name: "單元 3：運輸與防禦", topics: ["維管束", "蒸散作用", "血液循環", "淋巴與免疫"] },
                    { name: "單元 4：協調作用", topics: ["神經系統", "內分泌系統", "動物行為", "植物感應"] },
                    { name: "單元 5：恆定性", topics: ["體溫調節", "呼吸作用與氣體恆定", "血糖恆定", "排泄與水分恆定"] }
                ]
            },
            {
                id: "bio_j2", name: "國七生物 (下)", stage: "junior_high", subject: "biology", book: "Book 2",
                units: [
                    { name: "單元 1：生殖", topics: ["細胞分裂與減數分裂", "無性生殖", "有性生殖"] },
                    { name: "單元 2：遺傳", topics: ["孟德爾遺傳法則", "人類的遺傳", "突變與遺傳諮詢"] },
                    { name: "單元 3：演化", topics: ["化石", "天擇說", "生物分類系統"] },
                    { name: "單元 4：生態", topics: ["族群與群集", "生態系", "能量流動與物質循環", "生物多樣性"] }
                ]
            },
            // Senior High
            {
                id: "bio_s1", name: "高一生物 (必修)", stage: "high_school", subject: "biology", book: "Book 1 (Compulsory)",
                units: [
                    { name: "單元 1：細胞", topics: ["細胞學說", "細胞構造", "細胞能量(ATP/光合/呼吸)"] },
                    { name: "單元 2：遺傳", topics: ["染色體", "DNA結構與複製", "基因轉錄與轉譯", "基改科技"] },
                    { name: "單元 3：演化與多樣性", topics: ["演化證據", "親緣關係重建", "病毒與生物五界"] }
                ]
            },
            {
                id: "bio_s2", name: "高二生物 (選修 I)", stage: "high_school", subject: "biology", book: "Book 2 (Elective-Cell/Genetics)",
                units: [
                    { name: "單元 1：細胞與能量", topics: ["酵素動力學", "細胞呼吸細節", "光反應與固碳反應"] },
                    { name: "單元 2：遺傳與分子生物", topics: ["基因調控(Operon)", "生物技術(PCR, 電泳)"] }
                ]
            },
            {
                id: "bio_s3", name: "高三生物 (選修 II)", stage: "high_school", subject: "biology", book: "Book 3 (Elective-Physiology/Ecology)",
                units: [
                    { name: "單元 1：動物生理", topics: ["循環", "消化", "呼吸", "排泄", "神經", "內分泌", "免疫"] },
                    { name: "單元 2：植物生理", topics: ["根莖葉構造", "物質運輸機制", "植物荷爾蒙"] },
                    { name: "單元 3：生態學", topics: ["族群成長曲線", "演替", "生質能"] }
                ]
            }
        ],

        // --- 地科 (Earth Science) ---
        earth: [
            // Junior High
            {
                id: "earth_j5", name: "國九地科 (全)", stage: "junior_high", subject: "earth", book: "Book 5",
                units: [
                    { name: "單元 1：變動的地球", topics: ["地球分層構造", "板塊構造學說", "地震與火山"] },
                    { name: "單元 2：地貌與岩石", topics: ["岩石循環", "沉積岩/火成岩/變質岩", "地質營力(風化/侵蝕/沉積)"] },
                    { name: "單元 3：天氣變化", topics: ["大氣垂直結構", "氣團與鋒面", "氣象觀測", "台灣的氣候災害"] },
                    { name: "單元 4：天文", topics: ["晝夜與四季", "月相盈虧", "日食月食", "潮汐", "太陽系與宇宙"] }
                ]
            },
            // Senior High
            {
                id: "earth_s1", name: "高一地科 (必修)", stage: "high_school", subject: "earth", book: "Book 1 (Compulsory)",
                units: [
                    { name: "單元 1：地球環境", topics: ["地球系統", "固體地球結構", "大氣與海洋結構"] },
                    { name: "單元 2：地球變動", topics: ["板塊運動", "天氣系統(高低氣壓/颱風)", "洋流與波浪"] },
                    { name: "單元 3：永續發展", topics: ["氣候變遷(聖嬰/全球暖化)", "能源資源", "天然災害防制"] }
                ]
            },
            {
                id: "earth_s2", name: "高二地科 (選修 I)", stage: "high_school", subject: "earth", book: "Book 2 (Elective-Geology/Atmos)",
                units: [
                    { name: "單元 1：地質學", topics: ["地質圖判讀", "台灣地質", "礦物學"] },
                    { name: "單元 2：大氣科學", topics: ["大氣熱力學", "大氣運動(地轉風)", "氣象預報原理"] },
                    { name: "單元 3：海洋科學", topics: ["海水性質", "潮汐力學", "艾克曼傳送"] }
                ]
            },
            {
                id: "earth_s3", name: "高三地科 (選修 II)", stage: "high_school", subject: "earth", book: "Book 3 (Elective-Astro)",
                units: [
                    { name: "單元 1：天文學", topics: ["天球坐標", "恆星演化 (H-R圖)", "星系與宇宙論(哈伯定律)"] }
                ]
            }
        ],

        // --- 歷史 (History) ---
        history: [
            // Junior High
            {
                id: "hist_j1", name: "國七歷史 (臺灣史-上)", stage: "junior_high", subject: "history", book: "Book 1",
                units: [
                    { name: "單元 1：史前與原住民", topics: ["長濱/大坌坑/十三行文化", "南島語族"] },
                    { name: "單元 2：大航海時代", topics: ["荷蘭與西班牙統治", "鄭氏政權"] },
                    { name: "單元 3：清帝國時期(上)", topics: ["開港通商前", "渡台禁令", "漢番關係"] }
                ]
            },
            {
                id: "hist_j2", name: "國七歷史 (臺灣史-下)", stage: "junior_high", subject: "history", book: "Book 2",
                units: [
                    { name: "單元 1：清帝國時期(下)", topics: ["開港通商後", "沈葆楨/丁日昌/劉銘傳"] },
                    { name: "單元 2：日治時期", topics: ["殖民統治體制", "皇民化運動", "經濟建設"] },
                    { name: "單元 3：戰後臺灣", topics: ["二二八事件", "白色恐怖", "經濟奇蹟", "民主化"] }
                ]
            },
            {
                id: "hist_j3", name: "國八歷史 (東亞史-上)", stage: "junior_high", subject: "history", book: "Book 3",
                units: [
                    { name: "單元 1：商周至隋唐", topics: ["封建與郡縣", "儒家思想", "絲路與文化交流"] },
                    { name: "單元 2：宋元明清", topics: ["科舉士大夫", "經濟重心南移", "天朝體制"] }
                ]
            },
            {
                id: "hist_j4", name: "國八歷史 (東亞史-下)", stage: "junior_high", subject: "history", book: "Book 4",
                units: [
                    { name: "單元 1：晚清變局", topics: ["鴉片戰爭", "自強運動", "甲午戰爭"] },
                    { name: "單元 2：中華民國與共產中國", topics: ["辛亥革命", "五四運動", "國共內戰", "文化大革命", "改革開放"] },
                    { name: "單元 3：日本與朝鮮半島", topics: ["明治維新", "日本帝國主義", "韓戰"] }
                ]
            },
            {
                id: "hist_j5", name: "國九歷史 (世界史-上)", stage: "junior_high", subject: "history", book: "Book 5",
                units: [
                    { name: "單元 1：古文明", topics: ["西亞", "埃及", "印度", "希臘", "羅馬"] },
                    { name: "單元 2：普世宗教", topics: ["基督教", "伊斯蘭教", "佛教"] },
                    { name: "單元 3：近代歐洲興起", topics: ["文藝復興", "宗教改革", "地理大發現"] }
                ]
            },
            {
                id: "hist_j6", name: "國九歷史 (世界史-下)", stage: "junior_high", subject: "history", book: "Book 6",
                units: [
                    { name: "單元 1：革命時代", topics: ["科學革命", "啟蒙運動", "工業革命", "法國大革命"] },
                    { name: "單元 2：帝國主義與戰爭", topics: ["新帝國主義", "一次大戰", "二次大戰"] },
                    { name: "單元 3：戰後世界", topics: ["冷戰", "區域統合", "全球化"] }
                ]
            },
            // Senior High (Thematic History)
            {
                id: "hist_s1", name: "高一歷史 (臺灣史)", stage: "high_school", subject: "history", book: "Book 1",
                units: [
                    { name: "單元 1：如何認識過去", topics: ["歷史思維", "史料分析"] },
                    { name: "單元 2：多元族群", topics: ["原住民族", "移民社會", "新住民"] },
                    { name: "單元 3：現代國家形塑", topics: ["殖民統治", "威權體制", "民主轉型"] }
                ]
            },
            {
                id: "hist_s2", name: "高一歷史 (東亞史)", stage: "high_school", subject: "history", book: "Book 2",
                units: [
                    { name: "單元 1：人群移動與交流", topics: ["漢人移民", "華商與華工"] },
                    { name: "單元 2：國家與社會", topics: ["傳統政治權威", "近代國家轉型"] },
                    { name: "單元 3：文化交會", topics: ["儒家文化圈", "西方文化衝擊"] }
                ]
            },
            {
                id: "hist_s3", name: "高二歷史 (世界史)", stage: "high_school", subject: "history", book: "Book 3",
                units: [
                    { name: "單元 1：歐洲文化與現代性", topics: ["基督教文化", "個人主義", "現代性擴張"] },
                    { name: "單元 2：文化接觸與交流", topics: ["伊斯蘭世界", "美洲古文明", "帝國主義"] },
                    { name: "單元 3：世界大戰與當代", topics: ["總體戰", "冷戰", "人權議題"] }
                ]
            }
        ],

        // --- 地理 (Geography) ---
        geography: [
            // Junior High
            {
                id: "geo_j1", name: "國七地理 (臺灣)", stage: "junior_high", subject: "geography", book: "Book 1",
                units: [
                    { name: "單元 1：位置與範圍", topics: ["絕對位置與相對位置", "經緯度", "時區"] },
                    { name: "單元 2：地形", topics: ["內營力與外營力", "五大地形", "海岸地形"] },
                    { name: "單元 3：氣候與水文", topics: ["天氣與氣候", "降雨類型", "水循環", "河川特性"] }
                ]
            },
            {
                id: "geo_j2", name: "國七地理 (臺灣/區域)", stage: "junior_high", subject: "geography", book: "Book 2",
                units: [
                    { name: "單元 1：人口與聚落", topics: ["人口成長與分布", "人口金字塔", "城鄉差異"] },
                    { name: "單元 2：產業", topics: ["農業類型", "工業區位", "高科技產業", "服務業"] },
                    { name: "單元 3：區域特色", topics: ["北中南東區域發展", "離島特色"] }
                ]
            },
            {
                id: "geo_j3", name: "國八地理 (中國/東亞)", stage: "junior_high", subject: "geography", book: "Book 3",
                units: [
                    { name: "單元 1：中國的自然環境", topics: ["地形階梯", "氣候類型"] },
                    { name: "單元 2：中國的人文發展", topics: ["人口問題", "經濟改革開放", "一帶一路"] },
                    { name: "單元 3：東北亞與東南亞", topics: ["日本", "韓國", "東協各國"] }
                ]
            },
            {
                id: "geo_j4", name: "國八地理 (區域地理)", stage: "junior_high", subject: "geography", book: "Book 4",
                units: [
                    { name: "單元 1：南亞", topics: ["印度季風", "宗教文化", "軟體產業"] },
                    { name: "單元 2：西亞與北非", topics: ["乾燥氣候", "伊斯蘭文化", "石油經濟"] },
                    { name: "單元 3：漠南非洲", topics: ["熱帶氣候", "殖民遺產"] }
                ]
            },
            {
                id: "geo_j5", name: "國九地理 (區域地理)", stage: "junior_high", subject: "geography", book: "Book 5",
                units: [
                    { name: "單元 1：歐洲", topics: ["地形與氣候", "歐盟", "西歐/南歐/東歐/北歐"] },
                    { name: "單元 2：俄羅斯", topics: ["高緯度氣候", "資源開發"] },
                    { name: "單元 3：北美洲", topics: ["商業性農業", "多元文化", "全球經濟核心"] }
                ]
            },
            {
                id: "geo_j6", name: "國九地理 (全球議題)", stage: "junior_high", subject: "geography", book: "Book 6",
                units: [
                    { name: "單元 1：中南美洲", topics: ["拉丁文化", "貧富差距"] },
                    { name: "單元 2：大洋洲與兩極", topics: ["澳洲與紐西蘭", "全球暖化影響"] },
                    { name: "單元 3：全球議題", topics: ["能源危機", "糧食問題", "國際分工"] }
                ]
            },
            // Senior High
            {
                id: "geo_s1", name: "高一地理 (通論)", stage: "high_school", subject: "geography", book: "Book 1",
                units: [
                    { name: "單元 1：地理技能", topics: ["地圖投影", "GIS地理資訊系統"] },
                    { name: "單元 2：自然地理", topics: ["地形系統", "氣候系統", "水文與土壤"] },
                    { name: "單元 3：自然災害", topics: ["坡地災害", "洪患", "災害管理"] }
                ]
            },
            {
                id: "geo_s2", name: "高一地理 (人文/區域)", stage: "high_school", subject: "geography", book: "Book 2",
                units: [
                    { name: "單元 1：人文地理", topics: ["人口轉型", "都市階層", "產業區位"] },
                    { name: "單元 2：世界體系", topics: ["核心與邊陲", "全球化與在地化"] },
                    { name: "單元 3：東亞文化圈", topics: ["儒家文化", "人口老化問題"] }
                ]
            },
            {
                id: "geo_s3", name: "高二地理 (區域/議題)", stage: "high_school", subject: "geography", book: "Book 3",
                units: [
                    { name: "單元 1：歐美區域", topics: ["歐盟整合", "北美都市發展"] },
                    { name: "單元 2：開發中國家", topics: ["東南亞發展", "非洲資源詛咒"] },
                    { name: "單元 3：全球議題", topics: ["氣候變遷對策", "糧食安全", "傳染病擴散"] }
                ]
            }
        ],

        // --- 公民 (Civics) ---
        civics: [
            // Junior High
            {
                id: "civ_j1", name: "國七公民 (個人與社會)", stage: "junior_high", subject: "civics", book: "Book 1",
                units: [
                    { name: "單元 1：自我發展", topics: ["馬斯洛需求理論", "性別平等"] },
                    { name: "單元 2：生活中的團體", topics: ["家庭功能與變遷", "同儕關係", "部落與社區"] },
                    { name: "單元 3：社會規範", topics: ["風俗習慣/倫理道德/宗教信仰/法律"] }
                ]
            },
            {
                id: "civ_j2", name: "國七公民 (社會與文化)", stage: "junior_high", subject: "civics", book: "Book 2",
                units: [
                    { name: "單元 1：文化", topics: ["主流與次文化", "文化位階", "多元文化"] },
                    { name: "單元 2：社會變遷", topics: ["社會運動", "社會福利"] },
                    { name: "單元 3：民主素養", topics: ["會議規範", "學生自治"] }
                ]
            },
            {
                id: "civ_j3", name: "國八公民 (政治)", stage: "junior_high", subject: "civics", book: "Book 3",
                units: [
                    { name: "單元 1：國家與政府", topics: ["國家組成要素", "民主與獨裁", "五權分立"] },
                    { name: "單元 2：政黨與選舉", topics: ["政黨功能", "選舉制度", "公民投票"] },
                    { name: "單元 3：中央與地方", topics: ["中央政府體制", "地方自治"] }
                ]
            },
            {
                id: "civ_j4", name: "國八公民 (法律)", stage: "junior_high", subject: "civics", book: "Book 4",
                units: [
                    { name: "單元 1：法律基本概念", topics: ["憲法位階", "權利與義務"] },
                    { name: "單元 2：民法", topics: ["行為能力", "契約自由", "侵權行為"] },
                    { name: "單元 3：刑法", topics: ["罪刑法定主義", "責任能力", "刑罰種類"] },
                    { name: "單元 4：行政法", topics: ["行政處分", "權利救濟(請願/訴願/訴訟)"] }
                ]
            },
            {
                id: "civ_j5", name: "國九公民 (經濟)", stage: "junior_high", subject: "civics", book: "Book 5",
                units: [
                    { name: "單元 1：選擇與機會成本", topics: ["資源稀少性", "機會成本", "生產可能曲線"] },
                    { name: "單元 2：市場機能", topics: ["需求與供給", "均衡價格", "看不見的手"] },
                    { name: "單元 3：貨幣與金融", topics: ["貨幣功能", "通貨膨脹", "投資理財"] }
                ]
            },
            {
                id: "civ_j6", name: "國九公民 (全球關連)", stage: "junior_high", subject: "civics", book: "Book 6",
                units: [
                    { name: "單元 1：勞動與企業", topics: ["分工與貿易", "企業社會責任", "勞動權益"] },
                    { name: "單元 2：科技與資訊", topics: ["媒體識讀", "智慧財產權"] },
                    { name: "單元 3：全球化", topics: ["國際組織(UN, WTO)", "全球議題"] }
                ]
            },
            // Senior High
            {
                id: "civ_s1", name: "高一公民 (社/政/法)", stage: "high_school", subject: "civics", book: "Book 1",
                units: [
                    { name: "單元 1：公民身分與人權", topics: ["人權演進", "公民權"] },
                    { name: "單元 2：社會與文化", topics: ["性別多樣性", "媒體公共性"] },
                    { name: "單元 3：民主治理", topics: ["內閣制/總統制/雙首長制", "轉型正義"] }
                ]
            },
            {
                id: "civ_s2", name: "高一公民 (法律/經濟)", stage: "high_school", subject: "civics", book: "Book 2",
                units: [
                    { name: "單元 1：法律與生活", topics: ["憲法基本權", "民法修正(18歲成年)", "勞動基準法"] },
                    { name: "單元 2：市場與經濟", topics: ["供需變動", "市場失靈(外部性/公共財)", "GDP"] },
                    { name: "單元 3：貿易與整合", topics: ["比較利益", "貿易障礙", "匯率"] }
                ]
            },
            {
                id: "civ_s3", name: "高二公民 (選修 I)", stage: "high_school", subject: "civics", book: "Book 3 (Elective-Modern Society)",
                units: [
                    { name: "單元 1：社會不平等", topics: ["階級", "種族", "性別"] },
                    { name: "單元 2：風險社會", topics: ["科技風險", "隱私權"] }
                ]
            },
            {
                id: "civ_s4", name: "高二公民 (選修 II)", stage: "high_school", subject: "civics", book: "Book 4 (Elective-Democracy/Law)",
                units: [
                    { name: "單元 1：民主審議", topics: ["審議式民主", "公民不服從"] },
                    { name: "單元 2：司法制度", topics: ["國民法官", "大法官釋憲", "修復式司法"] }
                ]
            }
        ]
    };

    // Mount to global scope
    global.CurriculumLibrary.data = fullData;
    console.log("✅ V3.1.0 完整擴充課綱 (108課綱版) 已載入");

})(typeof window !== 'undefined' ? window : global);
