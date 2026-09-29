# Waiting for Eat

Waiting for Eat（痴吃等待）是一個以 React 建置的餐廳探索與訂位平台。系統分為「食客」與「餐廳業者」兩種使用者：食客可以搜尋餐廳、查看餐廳與食記、訂位及管理個人美食紀錄；餐廳業者則可維護店家資訊、照片、菜單、活動、營業時間、桌位與預約排程。

## 開發環境與主要技術

- React 18、React DOM
- Vite 5
- React Router DOM 6
- Firebase Authentication、Cloud Firestore、Cloud Storage、Firebase Hosting
- Zustand、Immer（全域狀態管理）
- Tailwind CSS、DaisyUI
- NextUI、Ant Design（介面元件）
- Framer Motion、Popmotion（動畫）
- FullCalendar（餐廳預約排程）
- Google Maps React API（餐廳地圖）
- React Draft WYSIWYG（食記編輯器）
- ESLint、Prettier

## 核心功能

- **會員系統**：支援 Email／密碼及 Google 登入，並依食客或業者身份顯示對應功能。
- **分步註冊**：依使用者身份引導填寫會員資料或餐廳資料。
- **餐廳探索**：可依店名、地區或餐廳類別搜尋，並依評分呈現結果。
- **餐廳詳情**：顯示店家基本資訊、地圖、菜單、活動、評論及相關食記。
- **線上訂位**：食客可選擇餐廳與時段完成預約，並在會員中心追蹤訂位紀錄。
- **食客會員中心**：管理個人資料、收藏／不喜歡的餐廳、吃過的餐廳、訂位、食記、評論與評分。
- **食記系統**：提供富文字編輯器建立及修改食記，並可瀏覽單篇內容。
- **業者管理中心**：編輯餐廳資訊、照片、菜單、活動、營業時間及桌位設定。
- **預約排程**：業者可透過日曆檢視餐廳訂位狀況。
- **響應式介面**：使用 Tailwind CSS 自訂斷點，支援不同尺寸的畫面。

## 應用程式架構

- `main.jsx` 是應用程式入口，掛載 React，設定 NextUI、BrowserRouter 與所有頁面路由。
- `App.jsx` 是共用版面與身份驗證層，監聽 Firebase 登入狀態、切換 Header，並限制食客與業者後台路由。
- `pages/` 依功能劃分主要頁面；`Diner` 與 `Boss` 使用巢狀路由呈現各自的會員中心。
- `components/` 放置 Header、載入畫面、通知訊息、留言等跨頁面共用元件。
- `stores/` 使用 Zustand 與 Immer 保存會員、搜尋結果、導覽列及評分流程等跨元件狀態。
- `firebase.js` 初始化 Firebase Authentication、Firestore 與 Storage；`utils/fireStore.js` 封裝常用資料讀取操作。
- 畫面元件直接透過 Firebase SDK 存取後端資料，沒有獨立的自建 API Server。

## 專案目錄結構

```text
waiting-for-eat/
├── index.html                         # Vite HTML 入口
├── package.json                       # 套件、版本與 npm scripts
├── package-lock.json                  # npm 套件鎖定檔
├── vite.config.js                     # Vite 與 React 外掛設定
├── tailwind.config.js                 # Tailwind 掃描路徑、主題與斷點設定
├── postcss.config.js                  # PostCSS 設定
├── prettier.config.cjs                # Prettier 與 Tailwind 排序設定
├── .eslintrc.cjs                      # ESLint 規則
├── firebase.json                      # Firebase Hosting 設定
├── .firebaserc                        # Firebase 專案別名
├── README.md                          # 專案說明
├── PROJECT_STRUCTURE.md               # 專案功能與結構文件
│
├── public/
│   └── vite.svg                       # 公開靜態資源
│
└── src/
    ├── main.jsx                       # React 入口與路由表
    ├── App.jsx                        # 共用版面、登入監聽與路由權限
    ├── index.css                      # Tailwind 指令與全域樣式
    ├── firebase.js                    # Firebase 初始化與服務匯出
    │
    ├── utils/
    │   └── fireStore.js               # 使用者與餐廳資料查詢工具
    │
    ├── stores/
    │   ├── userStore.js               # 登入者、會員及餐廳資料狀態
    │   ├── searchStore.js             # 餐廳搜尋結果
    │   ├── starStore.js               # 評分流程相關資料
    │   ├── headerStore.js             # Header 登入顯示狀態
    │   ├── dinerStore.js              # 食客側邊欄選取狀態
    │   ├── bossStore.js               # 業者側邊欄選取狀態
    │   └── testStore.js               # 登入身份與測試帳號狀態
    │
    ├── components/
    │   ├── Header/                    # 全站導覽列與 Logo
    │   ├── Alert/                     # Toast 通知容器
    │   ├── Comment/                   # 評論列表
    │   ├── IsLoading/                 # 載入中畫面
    │   ├── NoItem/                    # 無資料提示
    │   ├── RwdWarning/                # 響應式畫面提示
    │   ├── ScrollToTop/               # 路由切換後回到頁面頂端
    │   └── Test/                      # 測試帳號相關元件
    │
    └── pages/
        ├── Homepage/
        │   ├── index.jsx              # 首頁、餐廳搜尋與分類入口
        │   ├── Carousel.jsx           # 首頁輪播圖
        │   └── homepagePictures/      # 首頁 Banner、分類及身份圖片
        │
        ├── Login/
        │   ├── index.jsx              # 食客／業者登入及 Google 登入
        │   └── loginBackground.jpg
        │
        ├── SignUp/
        │   ├── index.jsx              # 分步註冊流程控制
        │   ├── StepOne.jsx            # 身份選擇
        │   ├── StepTwo.jsx            # 帳號建立
        │   ├── StepThreeDiner.jsx      # 食客資料填寫
        │   ├── StepThreeBoss.jsx       # 業者／餐廳資料填寫
        │   ├── StepFourDiner.jsx       # 食客註冊完成頁
        │   ├── StepFourBoss.jsx        # 業者註冊完成頁
        │   └── signUpPictures/         # 註冊流程圖片
        │
        ├── Search/
        │   ├── index.jsx              # 餐廳搜尋結果
        │   ├── MyGoogleMaps.jsx        # Google 地圖
        │   ├── _map.css                # 地圖樣式
        │   └── tasty.jpg
        │
        ├── Restaurant/
        │   ├── index.jsx              # 餐廳詳細資料、評論與食記
        │   ├── Like.jsx               # 收藏／不喜歡狀態操作
        │   ├── Menu.jsx               # 餐廳菜單
        │   └── restaurantPictures/    # 無菜單、無活動提示圖片
        │
        ├── Reserve/
        │   ├── index.jsx              # 餐廳訂位流程
        │   └── success.png             # 訂位成功圖片
        │
        ├── Post/
        │   └── index.jsx              # 單篇食記內容與相關食記
        │
        ├── Diner/
        │   ├── index.jsx              # 食客會員中心巢狀版面
        │   ├── DinerSidebar.jsx       # 食客功能選單
        │   ├── DinerInfo.jsx          # 個人資料
        │   ├── DinerInfoEdit.jsx      # 編輯個人資料
        │   ├── ReservedShop.jsx       # 已預約餐廳
        │   ├── EatenShop.jsx          # 吃過的餐廳
        │   ├── LikeShop.jsx           # 收藏餐廳
        │   ├── DislikeShop.jsx        # 不喜歡的餐廳
        │   ├── Posted.jsx             # 已發佈食記
        │   ├── PostedEdit.jsx         # 編輯食記
        │   ├── Commented.jsx          # 已發表評論
        │   ├── AddStar.jsx            # 新增評分
        │   ├── StarEdit.jsx           # 修改評分
        │   ├── TextEditor.jsx         # 富文字食記編輯器
        │   └── *.png                  # 食客中心背景及空資料圖片
        │
        └── Boss/
            ├── index.jsx              # 業者管理中心巢狀版面
            ├── BossSidebar.jsx        # 業者功能選單
            ├── BossInfo.jsx           # 餐廳基本資料
            ├── BossInfoEdit.jsx       # 編輯餐廳資料與菜單
            ├── Photo.jsx              # 餐廳照片管理
            ├── PhotoUpload.jsx        # 上傳餐廳照片
            ├── OpenTime.jsx           # 營業時間設定
            ├── Activity.jsx           # 餐廳活動
            ├── ActivityEdit.jsx       # 編輯餐廳活動
            ├── Table.jsx              # 桌位與可預約人數設定
            ├── Schedule.jsx           # FullCalendar 訂位排程
            ├── openTime.css           # 營業時間頁樣式
            ├── schedule.css           # 排程日曆樣式
            └── *.png                  # 無桌位、無排程提示圖片
```

## 主要路由

```text
/                               首頁
/signup                         註冊
/login                          登入
/search                         餐廳搜尋結果
/restaurant/:companyId          餐廳詳情
/reserve/:companyId             餐廳訂位
/post/:postId                   單篇食記
/textEditor/:orderId            新增食記
/postedEdit/:postId             編輯食記
/diner/*                        食客會員中心
/boss/*                         餐廳業者管理中心
```

## 執行與建置

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

啟動前需在環境變數中提供 `VITE_FIREBASE_API_KEY`。Firebase 其餘專案識別資訊目前定義於 `src/firebase.js`。
