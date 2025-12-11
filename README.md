# 圖書館管理系統 Library System

一個現代化的圖書館管理系統前端應用，採用 Vue 3 + Vite 構建。

## 📋 專案狀態

目前專案處於**原型轉換階段**：
- ✅ HTML 原型已完成（位於 `html樣板/` 資料夾）
- ⚠️ Vue 3 架構整合中

## 🚀 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 📚 文件指南

為了幫助開發，我們準備了以下文件：

1. **[專案分析總結.md](./專案分析總結.md)** - 📊 快速了解專案現況和建議
2. **[PROJECT_IMPROVEMENTS.md](./PROJECT_IMPROVEMENTS.md)** - 🎯 詳細的改進建議
3. **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - 🏃 手把手實作指南
4. **[DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md)** - ✅ 開發檢核表

### 建議閱讀順序

1. 先閱讀 **專案分析總結.md** 了解整體狀況
2. 查看 **QUICK_START_GUIDE.md** 開始實作
3. 使用 **DEVELOPMENT_CHECKLIST.md** 追蹤進度
4. 需要詳細技術資訊時參考 **PROJECT_IMPROVEMENTS.md**

## 🎨 專案特色

- 🎨 現代簡約的黑白設計風格
- 📱 響應式設計（進行中）
- 🔍 強大的搜尋和篩選功能
- 👤 完整的個人中心管理
- 📚 書籍借閱、預約、收藏系統
- 💬 評論和社交功能（規劃中）

## 🛠️ 技術棧

### 當前
- Vue 3 - 前端框架
- Vite - 構建工具

### 計劃整合
- Vue Router 4 - 路由管理
- Pinia - 狀態管理
- Axios - HTTP 請求
- @vueuse/core - 實用工具庫

## 📁 專案結構

```
library_v3_front/
├── html樣板/              # HTML 原型（參考用）
│   ├── index.html         # 首頁
│   ├── search.html        # 搜尋頁
│   ├── oneBook.html       # 書籍詳情
│   ├── myPage.html        # 個人中心
│   └── js/
│       ├── db.js          # Mock 資料庫
│       └── api.js         # Mock API
├── src/                   # Vue 應用程式碼
│   ├── components/        # Vue 組件（待建立）
│   ├── views/            # 頁面組件（待建立）
│   ├── router/           # 路由配置（待建立）
│   ├── stores/           # Pinia stores（待建立）
│   └── services/         # API 服務（待建立）
└── public/               # 靜態資源
```

## 🎯 開發路線圖

### Phase 1: 基礎架構（當前）
- [ ] 整合 Vue Router
- [ ] 設置 Pinia
- [ ] 建立基礎組件
- [ ] 轉換首頁

### Phase 2: 核心功能
- [ ] 完成所有頁面組件化
- [ ] 實作認證系統
- [ ] 完善 API 層

### Phase 3: 進階功能
- [ ] 社交互動
- [ ] 推薦系統
- [ ] 即時通知

### Phase 4: 優化與部署
- [ ] 測試覆蓋
- [ ] 效能優化
- [ ] 部署上線

詳細檢核表請參考 [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md)

## 💡 開發建議

1. **先看文件** - 了解整體規劃再開始
2. **循序漸進** - 按照 Phase 順序開發
3. **追蹤進度** - 使用 checklist 記錄完成項目
4. **常常測試** - 每完成一個功能就測試
5. **保持整潔** - 遵循程式碼規範

## 🤝 需要協助？

遇到問題時：
1. 先查看相關文件
2. 檢查 console 錯誤訊息
3. 查看 Vue/Vite 官方文檔
4. 歡迎提出 Issue

## 📄 授權

本專案僅供學習和參考使用。

---

**開發愉快！** 🚀
