
// Mock Database for Library System with LocalStorage Persistence

(function() {
    // 1. Default Data
    const defaultCategories = {
        "文學小說": ["現代文學", "推理懸疑", "科幻奇幻", "愛情", "歷史小說", "詩集"],
        "商業理財": ["投資理財", "管理", "經濟", "自我成長"],
        "藝術設計": ["設計理論", "攝影", "音樂"],
        "人文社科": ["心理學", "哲學", "社會議題"],
        "自然科普": ["電腦科學", "數學", "物理"],
        "漫畫圖文": ["少年漫畫", "少女漫畫"]
    };

    const defaultBooks = [
        { id: "B001", title: "挪威的森林 (30週年紀念版)", author: "村上春樹", publisher: "時報出版", isbn: "9789571368688", categoryMain: "文學小說", categorySub: "現代文學", cover: "https://placehold.co/300x400/eee/333?text=Book+1", description: "一部描寫青春、愛情與失落的經典小說。", tags: ["村上春樹", "現代文學", "愛情"], rating: 4.5, reviews: [{ user: "saber123", stars: 4, comment: "好看!非常立志!" },{ user: "lancer123", stars: 5, comment: "牛媽牛啊！" }], holdings: [{ id: "SP001A", location: "中文書庫 (B1)", status: "available" },{ id: "SP001B", location: "中文書庫 (B1)", status: "loaned", dueDate: "2025-12-31" }] },
        { id: "B010", title: "1Q84", author: "村上春樹", publisher: "時報出版", isbn: "9789571351000", categoryMain: "文學小說", categorySub: "現代文學", cover: "https://placehold.co/300x400/ccc/333?text=Book+10", description: "兩個不同的世界，一個共同的月亮。", tags: ["村上春樹", "奇幻", "愛情"], rating: 4.7, reviews: [], holdings: [ { id: "SP010A", location: "中文書庫 (B1)", status: "available" } ] },
        { id: "B002", title: "被討厭的勇氣", author: "岸見一郎", publisher: "究竟出版", isbn: "9789861371989", categoryMain: "人文社科", categorySub: "心理學", cover: "https://placehold.co/300x400/e0e0e0/333?text=Book+2", description: "探討阿德勒心理學，教你如何活出自己的人生。", tags: ["心理成長", "阿德勒"], rating: 4.7, reviews: [], holdings: [ { id: "SP002A", location: "中文書庫 (B1)", status: "available" } ] },
        { id: "B003", title: "原子習慣", author: "James Clear", publisher: "方智出版", isbn: "9789861755267", categoryMain: "商業理財", categorySub: "自我成長", cover: "https://placehold.co/100x140?text=Atom", description: "建立微小習慣，帶來巨大改變。", tags: ["習慣", "自我成長", "暢銷榜"], rating: 4.9, reviews: [], holdings: [ { id: "SP003A", location: "中文書庫 (B1)", status: "available" } ] },
        { id: "B004", title: "三體 II：黑暗森林", author: "劉慈欣", publisher: "貓頭鷹", isbn: "9789862621944", categoryMain: "文學小說", categorySub: "科幻奇幻", cover: "https://placehold.co/100x140?text=3Body", description: "一部宏大的科幻史詩，探討宇宙文明的黑暗森林法則。", tags: ["科幻", "劉慈欣", "影視改編"], rating: 4.8, reviews: [], holdings: [{ id: "SP004A", location: "中文書庫 (B1)", status: "loaned", dueDate: "2026-01-15" },{ id: "SP004B", location: "中文書庫 (B1)", status: "loaned", dueDate: "2026-01-20" }] },
        { id: "B005", title: "哈利波特：消失的密室", author: "J.K. Rowling", publisher: "皇冠", isbn: "9789573317241", categoryMain: "文學小說", categorySub: "科幻奇幻", cover: "https://placehold.co/100x140?text=Harry", description: "一個男孩發現自己是巫師，並前往魔法學校就讀的故事。", tags: ["奇幻", "J.K. Rowling", "影視改編"], rating: 4.9, reviews: [], holdings: [ { id: "SP005A", location: "兒童書庫 (2F)", status: "available" } ] },
        { id: "B006", title: "鋼之鍊金術師 (完全版) Vol.1", author: "荒川弘", publisher: "東立出版社", isbn: "9789861234567", categoryMain: "漫畫圖文", categorySub: "少年漫畫", cover: "https://placehold.co/400x600/eee/333?text=FMA", description: "愛德華與阿爾馮斯兩兄弟，為了讓死去的母親復活而使用鍊金術最大禁忌「人體鍊金」。然而鍊成失敗，愛德華失去了左腳，阿爾馮斯則失去了全身。為了取回失去的一切，兩人踏上了尋找「賢者之石」的旅程...", tags: ["奇幻冒險", "等價交換", "神作", "哲學"], rating: 4.8, reviews: [{ user: "saber123", stars: 4, comment: "好看!非常立志! 雖然中間有一點虐，但結局非常完美。" },{ user: "lancer123", stars: 5, comment: "牛媽牛啊！這是我看過結構最完整的漫畫，沒有之一。" }], holdings: [{ id: "SP001A", location: "中文書庫 (B1)", status: "available" },{ id: "SP001B", location: "中文書庫 (B1)", status: "loaned", dueDate: "2025-12-31" }] },
        { id: "B007", title: "Python 資料分析實戰", author: "Wes McKinney", publisher: "歐萊禮", isbn: "9789864764812", categoryMain: "自然科普", categorySub: "電腦科學", cover: "https://placehold.co/100x140?text=Python", description: "學習使用 Python 進行資料處理、分析與視覺化。", tags: ["Python", "資料科學"], rating: 4.6, reviews: [], holdings: [ { id: "C00112233", location: "西文圖書區 (3F)", status: "available" } ] },
        { id: "B008", title: "微積分之神", author: "Steven Strogatz", publisher: "天下文化", isbn: "9789864798961", categoryMain: "自然科普", categorySub: "數學", cover: "https://placehold.co/100x140?text=Math", description: "從生活中的例子理解微積分的奧秘。", tags: ["數學", "科普"], rating: 4.7, reviews: [], holdings: [ { id: "M998877", location: "西文圖書區 (3F)", status: "available" } ] },
        { id: "B009", title: "設計的心理學", author: "Don Norman", publisher: "遠流", isbn: "9789573276423", categoryMain: "藝術設計", categorySub: "設計理論", cover: "https://placehold.co/100x140?text=Design", description: "探討設計如何影響使用者的心理與行為。", tags: ["設計", "使用者體驗"], rating: 4.8, reviews: [], holdings: [ { id: "D556677", location: "藝術設計區 (4F)", status: "available" } ] }
    ];

    const defaultUser = {
        profile: { name: "陳小明", cardId: "LIB202500123", username: "ming_chen", email: "ming.test@example.com", phone: "0912-345-678", address: "台北市信義區測試路100號", identity: "市民" },
        notifications: [{ id: "N01", type: "arrival", bookId: "B003", date: "2025-12-10", read: false, content: "您預約的《原子習慣》已送達 中文書庫(B1)，請於 2025-12-15 前取書。" },{ id: "N02", type: "system", date: "2025-12-08", read: true, content: "本系統將於 2025-12-20 00:00 - 04:00 進行例行性維護。" }],
        reservations: [{ bookId: "B003", reservationDate: "2025-12-01", status: "ready", pickupBy: "2025-12-15" },{ bookId: "B004", reservationDate: "2025-12-05", status: "waiting", queuePosition: 3 }],
        loans: [{ bookId: "B007", loanDate: "2025-12-01", dueDate: "2025-12-31", holdingId: "C00112233" }],
        overdue: [{ bookId: "B008", loanDate: "2025-11-01", dueDate: "2025-12-01", overdueDays: 9 }],
        history: [{ bookId: "B005", loanDate: "2025-10-01", returnDate: "2025-10-28" }],
        favorites: [{ bookId: "B009", addedDate: "2025-08-15" }]
    };

    const DB_KEY = 'library_v3_data';

    let data = {
        books: defaultBooks,
        currentUser: defaultUser,
        categories: defaultCategories // Add categories to the data object
    };

    const savedData = localStorage.getItem(DB_KEY);
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            if (parsed && Array.isArray(parsed.books) && parsed.currentUser && parsed.currentUser.profile && parsed.categories) {
                data = parsed;
            } else {
                console.warn("LocalStorage data is invalid or incomplete. Resetting to default.");
            }
        } catch (e) {
            console.error("Failed to parse data from LocalStorage, using default data.", e);
        }
    }

    window.mockDB = {
        data: data,

        save: function() {
            try {
                localStorage.setItem(DB_KEY, JSON.stringify(this.data));
                console.log('Database saved to LocalStorage');
            } catch (e) {
                console.error("Failed to save data to LocalStorage.", e);
            }
        },

        reset: function() {
            localStorage.removeItem(DB_KEY);
            window.location.reload();
        },
        
        get books() { return this.data.books; },
        get currentUser() { return this.data.currentUser; },
        get categories() { return this.data.categories; },
        get authors() { return [...new Set(this.data.books.map(b => b.author))]; },
        get publishers() { return [...new Set(this.data.books.map(b => b.publisher))]; }
    };

    if (!savedData) {
        window.mockDB.save();
    }

})();
