# Waiting for Eat

Waiting for Eat 是一個以 React 與 Firebase 打造的餐廳探索及線上訂位平台。使用者可以搜尋餐廳、查看菜單與評論、收藏店家並進行訂位；餐廳業者則可以管理店家資料、照片、營業時間、活動、桌位與訂位行程。

## 主要功能

### 食客

- 使用 Email 或 Google 帳號註冊、登入
- 依餐廳名稱、地區及餐廳類別搜尋店家
- 透過 Google Maps 查看餐廳位置
- 瀏覽餐廳資料、菜單、活動與其他使用者的評論
- 收藏喜歡或不喜歡的餐廳，並管理已用餐清單
- 選擇日期、時段與人數進行線上訂位
- 撰寫、編輯食記及星級評論
- 在個人中心管理個人資料、訂位及貼文

### 餐廳業者

- 建立及編輯餐廳基本資料
- 上傳店家照片與菜單
- 設定營業時間與可預約桌位
- 建立及編輯店家活動
- 使用行事曆查看訂位排程

## 使用技術

- React 18、React Router 6
- Vite 5
- Firebase Authentication、Cloud Firestore、Cloud Storage、Hosting
- Zustand、Immer
- Tailwind CSS、DaisyUI
- NextUI、Ant Design
- Google Maps JavaScript API
- FullCalendar
- React Draft WYSIWYG
- Framer Motion、React Hot Toast
- ESLint、Prettier

## 開始使用

### 環境需求

- Node.js 18 以上版本
- npm
- Firebase 專案
- 已啟用 Maps JavaScript API 與 Places API 的 Google Maps API Key

### 安裝套件

```bash
npm install
```

### 設定環境變數

在專案根目錄建立 `.env`，並加入以下內容：

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_GOOGLE_API_KEY=your_google_maps_api_key
```

Firebase 的其餘專案設定目前位於 `src/firebase.js`。若要使用自己的 Firebase 專案，請一併更新該檔案中的 `authDomain`、`projectId`、`storageBucket`、`messagingSenderId`、`appId` 與 `measurementId`。

> `.env` 已列入 `.gitignore`，請勿將 API Key 或其他敏感資訊提交至版本控制。

### 啟動開發伺服器

```bash
npm run dev
```

啟動後，依終端機顯示的網址開啟應用程式；Vite 預設為 `http://localhost:5173`。

## 常用指令

```bash
# 啟動開發環境
npm run dev

# 執行 ESLint 檢查
npm run lint

# 建立正式環境檔案
npm run build

# 在本機預覽正式版本
npm run preview
```

## 部署至 Firebase Hosting

專案已將 Firebase Hosting 輸出目錄設定為 `dist`，並設定 SPA 路由重新導向至 `index.html`。

1. 安裝並登入 Firebase CLI：

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. 建置並部署：

   ```bash
   npm run build
   firebase deploy --only hosting
   ```

若要部署至其他 Firebase 專案，請先更新 `.firebaserc` 與 `firebase.json` 中的專案及 Hosting site 設定。

## 專案結構

```text
waiting-for-eat/
├── public/                  # 公開靜態資源
├── src/
│   ├── components/         # 共用元件（Header、Loading、提示訊息等）
│   ├── pages/
│   │   ├── Homepage/       # 首頁
│   │   ├── Login/          # 登入
│   │   ├── SignUp/         # 多步驟註冊流程
│   │   ├── Search/         # 餐廳搜尋與 Google Maps
│   │   ├── Restaurant/     # 餐廳詳細資料
│   │   ├── Reserve/        # 線上訂位
│   │   ├── Post/           # 食記內容
│   │   ├── Diner/          # 食客個人中心
│   │   └── Boss/           # 店家管理後台
│   ├── stores/             # Zustand 全域狀態
│   ├── utils/              # Firestore 共用工具
│   ├── App.jsx             # 共用版面及登入權限處理
│   ├── firebase.js         # Firebase 初始化設定
│   ├── index.css           # 全域樣式與 Tailwind
│   └── main.jsx            # 應用程式入口及路由
├── firebase.json           # Firebase Hosting 設定
├── tailwind.config.js      # Tailwind CSS 設定
├── vite.config.js          # Vite 設定
└── package.json            # 套件與 npm scripts
```

## 主要路由

| 路由 | 說明 |
| --- | --- |
| `/` | 首頁 |
| `/signup` | 註冊流程 |
| `/login` | 登入頁面 |
| `/search` | 餐廳搜尋與地圖 |
| `/restaurant/:companyId` | 餐廳詳細資料 |
| `/reserve/:companyId` | 餐廳訂位 |
| `/post/:postId` | 食記內容 |
| `/diner/*` | 食客個人中心（需登入） |
| `/boss/*` | 餐廳業者後台（需登入且具店家身分） |

## 注意事項

- 本專案依賴 Firebase Authentication、Firestore 與 Storage，需在 Firebase Console 啟用對應服務並設定安全規則。
- Google 登入需在 Firebase Authentication 啟用 Google 登入供應商，並設定授權網域。
- Google Maps 功能需使用有效的 API Key，並啟用 Maps JavaScript API 與 Places API。
- 部署正式環境時，請在 Hosting 平台設定相同的環境變數後重新建置。
