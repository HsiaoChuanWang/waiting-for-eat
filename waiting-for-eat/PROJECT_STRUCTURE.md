# Waiting for Eat 專案架構

Waiting for Eat（痴吃等待）是以 React 建置的餐廳探索、訂位與店家管理平台。系統分為食客與餐廳業者兩種角色：食客可以搜尋餐廳、訂位、撰寫食記與評論；業者可以管理餐廳資訊、營業時間、桌位及預約排程。

## 目錄結構

```text
waiting-for-eat/
├─ docs/                                      # 補充文件
├─ public/                                    # 不經 Vite import 的公開靜態資源
├─ src/
│  ├─ assets/                                 # 跨頁面、跨功能共用的圖片
│  │  ├─ auth/
│  │  ├─ backgrounds/
│  │  ├─ placeholders/
│  │  └─ roles/
│  ├─ components/                             # 跨頁面共用的 React 元件
│  │  ├─ Alert/
│  │  ├─ Comment/
│  │  ├─ DashboardSidebar/
│  │  ├─ ErrorState/
│  │  ├─ Header/
│  │  ├─ IsLoading/
│  │  ├─ NoItem/
│  │  └─ ScrollToTop/
│  ├─ constants/                              # 跨模組使用的固定選項與業務常數
│  │  ├─ restaurant.js
│  │  └─ signup.js
│  ├─ features/                               # 可跨頁使用的業務功能
│  │  ├─ auth/
│  │  │  ├─ assets/
│  │  │  └─ components/
│  │  ├─ boss/
│  │  │  ├─ scheduleModel.js
│  │  │  ├─ scheduleModel.test.js
│  │  │  ├─ useCompanyProfile.js
│  │  │  └─ useScheduleData.js
│  │  ├─ diner/
│  │  │  ├─ components/
│  │  │  ├─ useDinerProfile.js
│  │  │  └─ useDinerRecordList.js
│  │  ├─ editor/
│  │  ├─ favorite/
│  │  │  └─ components/
│  │  ├─ reservation/
│  │  │  ├─ reservationModel.js
│  │  │  ├─ reservationModel.test.js
│  │  │  ├─ reservationService.js
│  │  │  └─ useReservationData.js
│  │  └─ search/
│  │     ├─ components/
│  │     ├─ searchConstants.js
│  │     ├─ searchModel.js
│  │     ├─ searchModel.test.js
│  │     ├─ searchResultService.js
│  │     └─ useRestaurantSearch.js
│  ├─ hooks/                                  # 跨頁面共用的 React hooks
│  │  ├─ useAuthSession.js
│  │  └─ useHeaderStatus.js
│  ├─ pages/                                  # Route page 與其專屬檔案
│  │  ├─ Boss/
│  │  │  ├─ Activity/
│  │  │  │  ├─ Activity.jsx
│  │  │  │  └─ ActivityEdit.jsx
│  │  │  ├─ BossInfo/
│  │  │  │  ├─ BossInfo.jsx
│  │  │  │  └─ BossInfoEdit.jsx
│  │  │  ├─ components/
│  │  │  │  └─ BossSidebar.jsx
│  │  │  ├─ OpenTime/
│  │  │  │  ├─ OpenTime.jsx
│  │  │  │  ├─ OpeningTimeSchedule.jsx
│  │  │  │  └─ OpenTime.css
│  │  │  ├─ Photo/
│  │  │  │  ├─ Photo.jsx
│  │  │  │  └─ PhotoUpload.jsx
│  │  │  ├─ Schedule/
│  │  │  │  ├─ Schedule.jsx
│  │  │  │  ├─ Schedule.css
│  │  │  │  └─ no-schedule.png
│  │  │  ├─ Table/
│  │  │  │  ├─ Table.jsx
│  │  │  │  └─ no-table.png
│  │  │  └─ index.jsx                        # Boss layout 與 Outlet
│  │  ├─ Diner/
│  │  │  ├─ components/                      # 多個 Diner route 共用
│  │  │  ├─ Dining/                          # 吃過的餐廳與專屬 card
│  │  │  ├─ Favorites/                       # 喜歡／不喜歡餐廳
│  │  │  ├─ Posts/                           # 食記清單、編輯器與編輯頁
│  │  │  ├─ Profile/                         # 食客資料與編輯頁
│  │  │  ├─ Reservations/                    # 食客訂位紀錄
│  │  │  ├─ Reviews/                         # 評論新增、清單與編輯頁
│  │  │  └─ index.jsx                        # Diner layout 與 Outlet
│  │  ├─ Homepage/
│  │  │  ├─ assets/
│  │  │  ├─ components/
│  │  │  └─ index.jsx
│  │  ├─ Login/
│  │  │  ├─ assets/
│  │  │  ├─ hooks/
│  │  │  └─ index.jsx
│  │  ├─ Post/
│  │  │  └─ index.jsx
│  │  ├─ Reserve/
│  │  │  ├─ assets/
│  │  │  └─ index.jsx
│  │  ├─ Restaurant/
│  │  │  ├─ components/
│  │  │  └─ index.jsx
│  │  ├─ Search/
│  │  │  └─ index.jsx
│  │  └─ SignUp/
│  │     ├─ assets/
│  │     ├─ components/
│  │     ├─ hooks/
│  │     ├─ registration/
│  │     └─ index.jsx
│  ├─ router/                                 # 路由權限與測試
│  │  ├─ useRouteAccessGuard.js
│  │  └─ useRouteAccessGuard.test.js
│  ├─ services/                               # Firebase 與外部服務存取
│  │  ├─ auth/
│  │  ├─ firebase/
│  │  ├─ maps/
│  │  ├─ repositories/
│  │  └─ storage/
│  ├─ stores/                                 # Zustand 跨頁共享狀態
│  ├─ utils/                                  # 不依賴 React 或外部服務的共用工具
│  ├─ App.jsx                                 # 全站 layout 與權限 guard
│  ├─ index.css                               # Tailwind 與全域樣式
│  └─ main.jsx                                # React 掛載與 route table
├─ .eslintrc.cjs
├─ firebase.json
├─ package.json
├─ PROJECT_STRUCTURE.md                       # 本文件
├─ REFACTOR_GUIDELINES.md
├─ PROJECT_TESTS.md                           # Unit test 與品質檢查說明
├─ tailwind.config.js
└─ vite.config.js
```

## Page、Component 與功能資料夾

React page 本身也是 component，但在專案架構中應依「角色」分類，而不是因為副檔名同為 `.jsx` 就全部放進 `components/`。

### Route page

由 React Router 直接載入的畫面，例如：

- `Boss/Schedule/Schedule.jsx`
- `Diner/Profile/DinerInfo.jsx`
- `Restaurant/index.jsx`

包含多個相關 route 的功能會使用同一個功能資料夾，例如 `Activity.jsx` 與 `ActivityEdit.jsx` 一起放在 `Boss/Activity/`。

### Page-local component

只服務單一 route 或功能的元件，放在該功能資料夾旁邊：

```text
Boss/OpenTime/
├─ OpenTime.jsx                 # Route page
├─ OpeningTimeSchedule.jsx      # 只服務 OpenTime
└─ OpenTime.css
```

這類元件不放進 `Boss/components/`，避免讓人誤以為其他 Boss route 也會共用。

### Page group 共用 component

同一組 route 中有多個頁面使用的元件，放在該 page group 的 `components/`：

```text
Boss/components/BossSidebar.jsx
Diner/components/DinerSidebar.jsx
```

### Feature component

跨 page 使用，但仍屬於特定業務功能的元件，放在 `features/{feature}/components/`：

```text
features/favorite/components/FavoriteStatusButtons.jsx
features/search/components/SearchResultList.jsx
features/diner/components/DinerRecordListLayout.jsx
```

### 全站共用 component

不屬於特定業務功能，且由多個 page 或 feature 使用的基礎元件，放在 `src/components/`，例如 `Alert`、`ErrorState`、`Header` 與 `IsLoading`。

## 圖片與 CSS 放置規則

依使用範圍由近到遠放置：

1. 只由單一功能使用：放在功能資料夾，或功能內的 `assets/`。
2. 同一 page group 多個功能共用：放在該 page group 的 `assets/`。
3. 跨 page／feature 共用：放在 `src/assets` 的語意分類中。

範例：

- `Boss/Schedule/no-schedule.png` 只服務 Schedule，與頁面放在一起。
- `Homepage/assets/` 只服務首頁。
- `assets/placeholders/no-activity.png` 同時由 Boss 與 Restaurant 使用，因此放在共用 placeholders。

CSS 採相同規則：

- `Boss/Schedule/Schedule.css` 只覆寫 FullCalendar 在 Schedule 的樣式。
- `features/search/components/SearchMap.css` 只服務 SearchMap。
- `src/index.css` 只放 Tailwind directives 與全站樣式。

能使用 Tailwind class 清楚表達的樣式不另外建立 CSS；第三方元件深層 selector、全域規則或複雜動畫才使用 CSS 檔。

## 各層職責

### Page / Component

負責：

- JSX 畫面結構與樣式。
- 組合子元件。
- 顯示 loading、empty 與 error 狀態。
- 接收使用者操作，將流程交給 hook 或 service。
- 少量只服務目前畫面的事件轉接。

不應直接包含大量 Firebase query、資料轉換或可跨頁重用的業務規則。

### Hook

負責 React 狀態、生命週期與畫面流程組織：

- `useState`、`useEffect` 等 React 狀態與生命週期。
- 建立及清除 Firebase subscription。
- 組合多個 repository 完成畫面流程。
- 更新 Zustand store。
- 控制 Router 導頁。

只服務單一 page 的 hook 放在該 page 的 `hooks/`；跨頁共用的 hook 放在 `src/hooks/` 或對應 `features/`。

### Feature model

負責不依賴 React UI 的業務規則與資料計算，例如：

- `reservationModel.allocateTables()` 分配訂位桌位。
- `scheduleModel.recordScheduleMove()` 記錄排程移動。
- `searchModel.sortSearchResults()` 排序搜尋結果。

Model 應維持純函式並與 unit test 並置。

### Service / Repository

負責與外部資料來源溝通：

- `services/auth/`：Firebase Authentication。
- `services/repositories/`：Firestore collection 的查詢與寫入。
- `services/storage/`：圖片上傳。
- `services/maps/`：Google Maps geocoding。
- `services/firebase/`：Firebase client 與 snapshot mapper。

Service 不應渲染 JSX、控制 React component 或直接操作 Router。

### Store

Zustand store 只保存跨 component 或跨 page 需要共享的前端狀態，例如目前使用者、搜尋結果及評論流程資料。

只在單一 component 使用的暫時狀態應使用 `useState`，不要為了縮短 component 而放入 store。可由 URL 推導的導航狀態也不應重複存入 store。

### Utils

放置不依賴 React、Router、Firebase 或特定業務 feature 的共用純函式。只被單一模組使用的 helper 保留在該模組，不為了縮短檔案而移入 `utils/`。

### Constants

放置跨模組使用且不會改變的選項或業務常數。只服務單一模組的常數保留在該模組中。

## Function 放置判斷

```text
這個 function 是否負責 Firebase、Storage、Maps 或其他外部資料存取？
├─ 是 → services/ 或 services/repositories/
└─ 否
   ├─ 是否依賴 React state、effect、Router 或組織畫面流程？
   │  ├─ 是 → 單一 page 使用時放 page/hooks/；跨頁時放 hooks/ 或 features/
   │  └─ 否
   │     ├─ 是否為特定業務規則？
   │     │  ├─ 是 → features/{feature}/*Model.js
   │     │  └─ 否
   │     │     ├─ 是否跨模組共用？
   │     │     │  ├─ 是 → utils/
   │     │     │  └─ 否 → 留在使用它的模組
```

| Function                    | 放置位置                                     | 原因                          |
| --------------------------- | -------------------------------------------- | ----------------------------- |
| `findCompaniesByCategory()` | `services/repositories/searchRepository.js`  | 查詢 Firestore                |
| `allocateTables()`          | `features/reservation/reservationModel.js`   | 純訂位業務規則                |
| `useReservationData()`      | `features/reservation/useReservationData.js` | 組織訂位頁狀態與 subscription |
| `getRouteRedirect()`        | `router/useRouteAccessGuard.js`              | 路由權限規則                  |
| `handleCategory()`          | `pages/Homepage/index.jsx`                   | 只轉接首頁使用者操作          |

## 依賴方向

```text
Page / Component
        ↓
  Hook / Feature flow
      ↓       ↓
 Repository  Store
      ↓
Firebase Client / Mapper / External API
```

- Page 可以使用 component、hook、feature、store 與 service 暴露的操作。
- Hook 可以組合 repository、store、model 與 Router。
- Repository 可以使用 Firebase client 與 mapper。
- Model、mapper、constants 與 utils 不應依賴 React page。
- Service、feature 與全域 component 不應反向 import `pages/`。
- Page A 不應 import Page B 的私有 asset 或 component；需要共用時移至 `features/`、`components/` 或 `assets/`。

## 測試放置規則

Unit test 與被測模組放在一起，不建立集中式 `tests/` 資料夾：

```text
features/reservation/
├─ reservationModel.js
└─ reservationModel.test.js

services/repositories/
├─ favoriteRepository.js
└─ favoriteRepository.test.js
```

這樣移動或刪除模組時，能一起處理測試，不需要在另一個目錄重建相同結構。完整測試項目與執行方式記錄於 [`PROJECT_TESTS.md`](./PROJECT_TESTS.md)。

## 一致性規則

1. `main.jsx` 是 route table；`App.jsx` 是全站 layout 與 route guard 的使用入口。
2. Route page 依功能聚合；相關的查看、編輯或上傳頁面放在同一功能資料夾。
3. 只服務單一 route 的 component、圖片及 CSS 留在該功能附近。
4. Page group 共用元件放在 `pages/{PageGroup}/components/`。
5. 跨 page 的業務元件與流程放在 `features/`。
6. 真正跨功能的 UI 與圖片才放在 `src/components`、`src/assets`。
7. Firebase 存取只放在 `services/`，Page 與 Component 不直接 import Firebase SDK。
8. 可由 route 推導的狀態不重複存入 Zustand。
9. 不建立只做單一 default re-export 的 `index.js`；現有 `index.jsx` 用於單頁入口或巢狀 route layout。
10. 不為只有幾行且沒有獨立責任的程式過度拆檔。
11. 測試使用 `*.test.js` 並與被測模組並置。
12. 移動檔案時必須同步更新 import，並執行 test、lint 與 build。

## 命名規則

| 類型                       | 規則               | 範例                                           |
| -------------------------- | ------------------ | ---------------------------------------------- |
| React component 與檔名     | PascalCase         | `BossSidebar.jsx`、`FavoriteStatusButtons.jsx` |
| React hook                 | `use` + PascalCase | `useAuthSession()`、`useRestaurantSearch()`    |
| 一般變數、參數與 function  | camelCase          | `companyId`、`handleCategory()`                |
| Service／model／store 模組 | camelCase          | `favoriteRepository.js`、`scheduleModel.js`    |
| 共享固定業務常數           | UPPER_SNAKE_CASE   | `FAVORITE_STATUS`、`SEARCH_FIELDS`             |
| CSS class、route path      | kebab-case         | `map-container`、`reserved-shop`               |
| 圖片與一般靜態檔案         | kebab-case         | `no-schedule.png`、`login-background.jpg`      |

`const` 只代表 binding 不重新賦值，不表示名稱一定使用 UPPER_SNAKE_CASE。Component 內的 state、handler、計算結果與 function 仍使用 camelCase。

## 主要路由

```text
/                                      首頁
/signup                                註冊
/login                                 登入
/search                                餐廳搜尋結果與地圖
/restaurant/:companyId                 餐廳詳情
/reserve/:companyId                    餐廳訂位
/post/:postId                          單篇食記
/textEditor/:orderId                   新增食記
/postedEdit/:postId                    編輯食記
/diner/*                               食客會員中心
/boss/*                                餐廳業者管理中心
```

## 品質檢查

```bash
npx prettier --write .
npm test
npm run lint
npm run build
```

- Vitest 執行 model、route guard、mapper、authentication 與 repository unit tests。
- ESLint 檢查所有 `.js`、`.jsx`，並將 warning 視為失敗。
- Vite production build 驗證所有 import、CSS 與圖片路徑。
- 專案目前沒有設定 Husky 或 CI，因此 commit／push 不會自動執行上述檢查。
