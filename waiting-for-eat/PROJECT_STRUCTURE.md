# Waiting for Eat 專案結構

Waiting for Eat 是以 React 18、React Router、Vite、Firebase、Zustand 與 Tailwind CSS 建置的餐廳搜尋及訂位前端。程式採 page、feature、service/repository 分層。

## 根目錄

```text
waiting-for-eat/
├─ docs/                       # 架構與重構紀錄
├─ public/                     # 不經 import、由 Vite 原樣提供的靜態檔案（目前為空）
├─ scripts/                    # 專案輔助腳本（目前為空）
├─ src/                        # 應用程式原始碼
├─ .env                        # 本機環境變數，不提交 Git
├─ .eslintrc.cjs              # ESLint 設定
├─ .firebaserc                # Firebase project alias
├─ firebase.json              # Firebase Hosting 設定
├─ index.html                 # Vite HTML 入口
├─ package.json               # npm scripts 與相依套件
├─ package-lock.json          # 固定套件版本
├─ postcss.config.js          # PostCSS 設定
├─ prettier.config.cjs        # Prettier 設定
├─ tailwind.config.js         # Tailwind/DaisyUI 設定
└─ vite.config.js             # Vite/React 與 build 設定
```

`dist/` 與 `node_modules/` 是產生內容，不屬於原始碼結構。

## `src/` 總覽

```text
src/
├─ assets/                    # 跨頁共用圖片
│  ├─ auth/
│  ├─ backgrounds/
│  ├─ placeholders/
│  └─ roles/
├─ components/                # 跨 feature/page 共用 UI
│  ├─ Alert/
│  ├─ Comment/
│  ├─ DashboardSidebar/
│  ├─ ErrorState/
│  ├─ Header/
│  ├─ IsLoading/
│  ├─ NoItem/
│  └─ ScrollToTop/
├─ constants/                 # 共用常數
├─ features/                  # 依業務功能組織的 model、hook 與 UI
│  ├─ auth/
│  ├─ boss/
│  ├─ diner/
│  ├─ editor/
│  ├─ favorite/
│  ├─ reservation/
│  └─ search/
├─ hooks/                     # 跨頁共用 React hooks
├─ pages/                     # React Router route pages 與頁面區域元件
│  ├─ Boss/
│  ├─ Diner/
│  ├─ Homepage/
│  ├─ Login/
│  ├─ Post/
│  ├─ Reserve/
│  ├─ Restaurant/
│  ├─ Search/
│  └─ SignUp/
├─ router/                    # 路由存取規則
├─ services/                  # 外部系統存取及資料層
│  ├─ auth/
│  ├─ firebase/
│  ├─ maps/
│  ├─ repositories/
│  └─ storage/
├─ stores/                    # Zustand stores
├─ App.jsx                    # 共用 layout、Header、Outlet 與 route guard
├─ index.css                  # Tailwind directives 與全域樣式
└─ main.jsx                   # React 入口與完整 route table
```

目前沒有 `src/utils/`；通用轉換函式依責任放在 feature model 或 service，例如 `firestoreMappers.js`。

## 分層職責

### Pages

`src/pages/` 內的元件對應路由或特定 dashboard 區域，負責組合 UI 與呼叫 hook。只由單一頁面使用的元件、hook、CSS 或圖片放在該頁面資料夾中。

範例：

```text
pages/Boss/OpenTime/
├─ OpenTime.jsx
├─ OpeningTimeSchedule.jsx
└─ OpenTime.css
```

### Features

`src/features/` 放可跨頁重用的業務流程：

- `*Model.js`：純資料轉換與業務規則，適合單元測試。
- `use*.js`：協調 React state、repository、store 或 router。
- `components/`：該 feature 專用的 UI。
- `*Service.js`：feature 範圍內的流程協調，例如搜尋或訂位服務。

### Services 與 repositories

- `services/firebase/`：Firebase client 初始化與 Firestore snapshot mapper。
- `services/auth/`：Firebase Authentication 包裝。
- `services/repositories/`：Firestore collection 的查詢與寫入。
- `services/maps/`：Google Maps geocoding。
- `services/storage/`：Firebase Storage 圖片上傳。

這一層不應 import `pages/` 或依賴 JSX。

### Stores

`src/stores/` 是跨元件共享的 Zustand 狀態。目前包含 header、login、search、signup、star 與 user stores。只在單一元件內使用的暫時狀態應留在 `useState`。

### Components 與 assets

- 多個 page/feature 共用：`src/components/`、`src/assets/`。
- 同一 page group 共用：`pages/{Group}/components/`。
- 單一頁面使用：與頁面同層或該頁面的 `assets/`。
- 單一 feature 使用：`features/{feature}/components/` 或 feature 的 `assets/`。

## 資料流與依賴方向

```text
Page / Component
       ↓
Hook / Feature service ──→ Zustand store
       ↓
Model / Repository
       ↓
Firebase client / Google Maps / Firebase Storage
```

- UI 可依賴 hook、feature、store 與 service。
- Hook 協調 repository、model、store 與 router。
- Repository 依賴 Firebase client 與 mapper。
- 純 model、mapper 與 constants 不應依賴 React page。
- 不要讓 service、feature 或共用 component 反向 import `pages/`。

## 路由

路由定義在 `src/main.jsx`，`src/App.jsx` 提供共用 layout 與存取控制。

### 公開與內容路由

```text
/
/signup
/login
/search
/restaurant/:companyId
/reserve/:companyId
/post/:postId
/textEditor/:orderId
/postedEdit/:postId
```

### 用餐者 dashboard

```text
/diner/dinerInfo/:userId
/diner/dinerInfoEdit/:userId
/diner/reservedShop/:userId
/diner/eatenShop/:userId
/diner/likeShop/:userId
/diner/dislikeShop/:userId
/diner/posted/:userId
/diner/commented/:userId
/diner/addStar/:userId
/diner/starEdit/:userId
```

### 店家 dashboard

```text
/boss/bossInfo/:companyId
/boss/bossInfoEdit/:companyId
/boss/photo/:companyId
/boss/photoUpload/:companyId
/boss/openTime/:companyId
/boss/activity/:companyId
/boss/activityEdit/:companyId
/boss/table/:companyId
/boss/schedule/:companyId
```

`useRouteAccessGuard.js` 依登入狀態、角色、`userId` 與 `companyId` 限制 dashboard 存取。

## 測試位置

測試與被測模組放在同一資料夾，使用 `*.test.js`：

```text
features/reservation/
├─ reservationModel.js
└─ reservationModel.test.js

services/repositories/
├─ favoriteRepository.js
└─ favoriteRepository.test.js
```

目前的測試清單與執行方式請見 [PROJECT_TESTS.md](./PROJECT_TESTS.md)。

## 命名規則

| 類型                                     | 規則                          | 範例                                 |
| ---------------------------------------- | ----------------------------- | ------------------------------------ |
| React component / component file         | PascalCase                    | `BossSidebar.jsx`                    |
| React hook                               | `use` + PascalCase            | `useRestaurantSearch.js`             |
| function、變數、service/model/store file | camelCase                     | `allocateTables`, `scheduleModel.js` |
| 固定常數                                 | UPPER_SNAKE_CASE              | `SEARCH_FIELDS`                      |
| CSS class、route segment                 | kebab-case（既有 route 除外） | `map-container`                      |
| 圖片檔                                   | kebab-case                    | `no-schedule.png`                    |

既有 dashboard route 使用 camelCase（例如 `bossInfoEdit`）；修改既有路徑時需同步檢查 Sidebar navigation、redirect 與測試。

## 新增功能檢查

1. Route page 放在 `pages/`，並在 `main.jsx` 註冊。
2. 可重用業務規則放在 `features/` 的 model/hook/service。
3. Firebase 存取集中在 `services/`，不要在 page 直接操作 SDK。
4. 跨頁狀態才加入 Zustand；單頁暫時狀態留在元件或 hook。
5. 純業務邏輯與 repository 變更應新增或更新相鄰的 `*.test.js`。
6. 完成後執行 `npm test`、`npm run lint` 與 `npm run build`。
