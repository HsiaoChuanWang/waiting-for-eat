# Waiting for Eat 現況架構

本文件記錄重構前的專案架構、功能邊界、路由、狀態、資料來源及主要資料流。內容描述目前實作，不代表重構後的目標架構，也不在此階段修改既有行為。

## 技術組成

| 類型 | 目前使用項目 |
| --- | --- |
| Application | React 18、Vite |
| Routing | React Router 6 |
| Global state | Zustand、Immer |
| Backend | Firebase Authentication、Cloud Firestore、Cloud Storage |
| Maps | Google Maps JavaScript API、`@react-google-maps/api` |
| UI | NextUI、Ant Design、Tailwind CSS、React Icons |
| Rich text | Draft.js、React Draft WYSIWYG |
| Calendar | FullCalendar |

## Application Shell

`src/main.jsx` 建立以下根層結構：

```text
NextUIProvider
└── BrowserRouter
    ├── ScrollToTop
    └── Routes
        └── App
            ├── Header
            └── Outlet
```

`src/App.jsx` 目前同時負責：

- Ant Design 全域 theme。
- Firebase Auth session 監聽。
- 將登入使用者資料寫入 `userStore`。
- 判斷食客或老闆身份。
- 更新 Header 狀態。
- 根據身份與 URL 執行存取限制及重新導向。

## 路由

### 公開及一般路由

| Route | Page | 主要用途 |
| --- | --- | --- |
| `/` | `Homepage` | 首頁與餐廳搜尋入口 |
| `/signup` | `SignUp` | 食客／老闆註冊流程 |
| `/login` | `Login` | 一般與 Google 登入 |
| `/search` | `Search` | 搜尋結果與地圖 |
| `/restaurant/:companyId` | `Restaurant` | 餐廳資訊、菜單、活動、評論與食記 |
| `/reserve/:companyId` | `Reserve` | 建立餐廳訂位 |
| `/post/:postId` | `Post` | 食記詳細內容 |
| `/textEditor/:orderId` | `TextEditor` | 新增食記 |
| `/postedEdit/:postId` | `PostedEdit` | 修改食記 |

### 食客路由

父路由為 `/diner`，由 `Diner` 提供版面與 `Outlet`。

| Child route | Page | 主要用途 |
| --- | --- | --- |
| `dinerInfo/:userId` | `DinerInfo` | 個人資料 |
| `dinerInfoEdit/:userId` | `DinerInfoEdit` | 編輯個人資料 |
| `reservedShop/:userId` | `ReservedShop` | 訂位紀錄 |
| `eatenShop/:userId` | `EatenShop` | 已用餐紀錄 |
| `likeShop/:userId` | `LikeShop` | 喜歡的餐廳 |
| `dislikeShop/:userId` | `DislikeShop` | 不喜歡的餐廳 |
| `posted/:userId` | `Posted` | 已發表食記 |
| `commented/:userId` | `Commented` | 已發表評論 |
| `addStar/:userId` | `AddStar` | 新增評論與評分 |
| `starEdit/:userId` | `StarEdit` | 修改評論與評分 |

### 老闆路由

父路由為 `/boss`，由 `Boss` 提供版面與 `Outlet`。

| Child route | Page | 主要用途 |
| --- | --- | --- |
| `bossInfo/:companyId` | `BossInfo` | 老闆及餐廳資料 |
| `bossInfoEdit/:companyId` | `BossInfoEdit` | 編輯老闆及餐廳資料 |
| `photo/:companyId` | `Photo` | 餐廳主圖與菜單 |
| `photoUpload/:companyId` | `PhotoUpload` | 上傳主圖與菜單 |
| `openTime/:companyId` | `OpenTime` | 營業時間管理 |
| `activity/:companyId` | `Activity` | 餐廳活動內容 |
| `activityEdit/:companyId` | `ActivityEdit` | 編輯活動內容 |
| `table/:companyId` | `Table` | 桌位管理 |
| `schedule/:companyId` | `Schedule` | 訂單與排程管理 |

## 現有功能邊界

| 範圍 | 目前主要檔案 | 主要責任 |
| --- | --- | --- |
| Application/Auth | `App.jsx`、`Header`、`Login` | Session、身份、導航與存取限制 |
| Homepage | `pages/Homepage` | 首頁內容、搜尋與分類入口 |
| Search | `pages/Search`、`searchStore` | 搜尋、結果清單、favorite 狀態與地圖 |
| SignUp | `pages/SignUp`、`userStore` | 多步驟註冊、使用者與餐廳建立 |
| Restaurant | `pages/Restaurant`、`Comment` | 餐廳資訊、菜單、活動、評論、食記與 favorite |
| Reservation | `pages/Reserve` | 營業時間、桌位、訂單衝突檢查與訂位 |
| Diner | `pages/Diner` | 個人資料及各類使用紀錄 |
| Boss | `pages/Boss` | 餐廳後台、營業時間、桌位與排程 |
| Post | `Post`、`TextEditor`、`PostedEdit` | 食記讀取、新增、修改與圖片 |
| Infrastructure | `firebase.js`、`utils/fireStore.js` | Firebase 初始化及少量資料存取函式 |

目前 Feature 邊界尚未落實在目錄層級，多數頁面直接呼叫 Firebase，且部分業務流程分散於 pages、components 及 stores。

## Zustand Stores

| Store | State | 目前用途 |
| --- | --- | --- |
| `userStore` | `userId`、`detailInfo`、`companyInfo` | 使用者與餐廳全域資料；同時直接讀寫 Firestore |
| `searchStore` | `searchArray` | 首頁與搜尋頁之間傳遞搜尋結果 |
| `headerStore` | `loginStatus` | Header 顯示身份狀態 |
| `dinerStore` | `selectedDinerBar` | 食客側欄選取狀態 |
| `bossStore` | `selectedBossBar` | 老闆側欄選取狀態 |
| `starStore` | `starId`、`companyName`、`companyId`、`orderId` | 評論頁面之間傳遞編輯上下文 |
| `testStore` | 測試帳號與登入身份 | 測試登入面板及測試帳密 |

## Firebase 與外部服務

### Firebase 初始化

`src/firebase.js` 目前輸出：

- default export：Firestore `db`。
- named export `auth`：Firebase Authentication。
- named export `provider`：Google Auth provider。
- named export `storage`：Cloud Storage for Firebase。

Firebase project ID 為 `project-fire-6a02f`，Storage bucket 為 `project-fire-6a02f.appspot.com`。

### 環境變數

| 變數 | 使用位置 | 用途 |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | `src/firebase.js` | Firebase Web client 設定 |
| `VITE_GOOGLE_API_KEY` | Search、BossInfoEdit、StepThreeBoss | Google Maps 載入、地址搜尋與座標 |

### Firestore collections

| Collection／Path | 主要關聯欄位 | 目前用途 |
| --- | --- | --- |
| `user/{userId}` | `companyId` | 使用者資料及身份關聯 |
| `company/{companyId}` | `category`、`picture`、`menu`、`totalStar` | 餐廳資料、主圖、菜單、活動內容與評分 |
| `category/{categoryId}` | 類別資料 | 類別名稱顯示 |
| `favorite/{favoriteId}` | `userId`、`companyId`、`orderId`、`status` | like、dislike、eaten 狀態 |
| `order/{orderId}` | `userId`、`companyId`、時間與桌號 | 訂位、出席及店家排程 |
| `post/{postId}` | `userId`、`companyId`、`orderId` | 食記內容及主圖 |
| `star/{starId}` | `userId`、`companyId`、`orderId`、`star` | 評論與評分 |
| `company/{companyId}/openTime/{timeId}` | `day`、`start`、`end` | 餐廳營業時間 |
| `company/{companyId}/table/{tableId}` | `number`、`people` | 餐廳桌位資料 |

### Firebase 使用方式

- 多數頁面直接 import Firestore SDK 並建立 query。
- `utils/fireStore.js` 只封裝單筆 user/company 讀取。
- `userStore` 同時管理 state 與執行 user/company 寫入。
- 多個頁面以 `onSnapshot` 建立即時訂閱。
- 圖片上傳分散在註冊、個人資料、餐廳照片、食記及活動編輯器。

## 主要資料流

### 登入與身份導向

```text
Firebase Auth state
→ App.onAuthStateChanged
→ userStore.userId
→ 讀取 user document
→ companyId 空字串：食客身份
→ companyId 有值：老闆身份並讀取 company document
→ headerStore.loginStatus
→ 視身份限制 diner／boss 路由
```

### 首頁搜尋到搜尋結果

```text
Homepage 搜尋條件
→ 直接查詢 company collection
→ 逐間查詢 favorite
→ 排序結果
→ searchStore.searchArray
→ navigate('/search')
→ Search 結果清單與 MyGoogleMaps markers
```

`Search` 頁面也包含一套相近的名稱、地區、類別搜尋流程。

### 註冊

```text
SignUp 步驟與身份選擇
→ Firebase Auth／Google Auth
→ userStore 暫存 user 與 company 資料
→ 上傳頭像至 Firebase Storage
→ 食客：建立 user document
→ 老闆：建立 company document，再將 companyId 寫入 user document
```

### 訂位與完成用餐

```text
Reserve 讀取 company/openTime/table
→ 查詢既有 order 避免衝突
→ 建立 order
→ Boss Schedule 更新訂單與出席狀態
→ 完成用餐時建立 favorite(status='eaten')
→ Diner EatenShop 顯示紀錄
→ 可進入 AddStar 或 TextEditor
```

### 評論與評分

```text
AddStar／StarEdit／Commented
→ 新增、修改或刪除 star document
→ 重新計算評分
→ 更新 company.totalStar
→ Restaurant／Comment 顯示評論
```

### 食記

```text
EatenShop 選擇 order
→ TextEditor 上傳主圖與內文圖片
→ 建立 post document
→ Posted／Restaurant 顯示食記清單
→ Post 顯示內容
→ PostedEdit 修改內容
```

### 老闆營運管理

```text
Boss sidebar
├── BossInfo／BossInfoEdit：使用者與餐廳資料
├── Photo／PhotoUpload：主圖與菜單
├── Activity／ActivityEdit：活動內容
├── OpenTime：營業時間 subcollection
├── Table：桌位 subcollection
└── Schedule：order、table、attend 與 eaten 狀態
```

## 跨模組依賴摘要

- `App`、`Header`、Login、SignUp、Diner 與 Boss 都依賴 `userStore`。
- Homepage、Search 及 MyGoogleMaps 透過 `searchStore` 共享搜尋結果。
- AddStar、StarEdit、Commented 與 EatenShop 透過 `starStore` 傳遞評論上下文。
- Reserve、Schedule、EatenShop、AddStar、TextEditor、Posted 與 Commented 透過 `orderId` 形成跨 Feature 流程。
- `company` document 同時承載餐廳基本資料、圖片、菜單、活動與總評分。
- Restaurant、Homepage、Search、Diner 與 Boss 都直接依賴 Firestore company 資料。
- 圖片 URL 儲存在 user、company、post 或富文字 HTML 中；圖片檔案本身由 Firebase Storage 提供。

## 架構盤點邊界

本文件不包含：

- 目標目錄結構或最終 API 設計。
- 對現有資料 schema 正確性的保證。
- Firestore Security Rules、indexes 或正式環境資料盤點。
- 重構優先順序以外的產品需求。
- 既有 bug 修正。

這些項目應在後續 Baseline、目標架構或各 Feature 重構階段處理。
