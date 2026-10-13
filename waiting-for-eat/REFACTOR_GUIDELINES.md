# 專案重構規範

本文件定義整個 React 專案的重構原則與執行流程。適用範圍包含 Component、Feature、狀態管理、API／Firebase 存取、路由、共用模組、Assets 與樣式。目標是提升程式碼的可讀性、可維護性與可測試性，同時降低模組之間的耦合。

本文件中的六步「模組重構流程」不是整個專案只執行一次的六個工作或六個 commit。專案應先依 Feature 分階段處理，再對每個 Feature 或模組重複套用該流程。

## 適用範圍與重構單位

整個專案以 Feature／Domain 作為主要重構單位，而不是一次全面搬動所有檔案。目前專案至少應區分以下範圍：

- Application shell：路由、Header、全域 Provider 與身份導向。
- Authentication：登入、註冊、使用者身份與個人資料。
- Homepage：首頁內容與搜尋入口。
- Search：搜尋條件、搜尋結果、favorite 狀態與地圖。
- Restaurant：餐廳資訊、照片、菜單、活動與評論。
- Reservation：訂位、營業時間、桌位與訂單管理。
- Diner：食客資料、收藏、用餐紀錄、訂位紀錄與評論。
- Boss：店家資料、照片、活動、營業時間、桌位與排程。
- Post：食記新增、編輯、顯示及文章圖片。
- Infrastructure：Firebase、外部服務、環境設定與資料存取。
- Shared UI：經確認確實跨 Feature 共用的 UI、hook、utility、constant 與 asset。

Feature 邊界可在盤點後調整，但必須記錄原因。每次只處理一個可驗證的範圍，並保持專案可執行。

## 核心原則

1. **單一職責**：一個 Component 應專注於一項主要功能。
2. **就近放置（Colocation）**：僅由特定 Component 或功能使用的程式碼，應放在該模組附近。
3. **從局部開始共用**：確認程式碼真的被不同模組重複使用後，再提升至共用層。
4. **依功能邊界組織**：優先按照 Feature 或 Domain 分類，而非將所有檔案集中到 `common`、`global` 或 `helpers`。
5. **保持既有行為**：重構主要改善內部結構，不應在未明確規劃時改變使用者行為。
6. **避免過度抽象**：不要只因為未來「可能」重用，就預先建立複雜的共用介面。

## Component 拆分

當一個 Component 同時負責多項工作時，應考慮拆分：

- 畫面呈現
- API 請求
- 複雜狀態管理
- 商業規則
- 資料格式轉換
- 大型且獨立的 UI 區塊，例如 Form、Modal 或 Table

各類模組的建議職責：

| 類型              | 職責                                    |
| ----------------- | --------------------------------------- |
| UI Component      | 呈現畫面與接收使用者操作                |
| Feature Component | 組合 UI 並處理特定功能流程              |
| Custom Hook       | 管理 React 狀態、副作用及可重用互動邏輯 |
| API / Service     | 處理後端請求、認證、錯誤與回傳資料      |
| Utility           | 執行無副作用的資料處理或格式轉換        |
| Store             | 管理確實需要跨模組共享的狀態            |

小型且容易理解的 Component 不需要為了符合形式而強制拆分。

## 檔案放置原則

### Component 專用內容

只由單一 Component 使用的 type、style、hook、測試、圖片或 helper，應放在該 Component 的資料夾內：

```text
components/
└─ UserCard/
   ├─ UserCard.jsx
   ├─ UserCard.types.js
   ├─ UserCard.styles.js
   ├─ UserCard.module.css
   ├─ UserCard.test.jsx
   ├─ useUserCard.js
   └─ index.js
```

不需要建立未被使用的空檔案；只有在內容確實存在時才新增對應檔案。

### Feature 專用內容

同一功能內的多個模組會使用、但其他功能不需要的內容，應放在 Feature 內：

```text
features/
└─ orders/
   ├─ api/
   ├─ components/
   ├─ hooks/
   ├─ types/
   ├─ utils/
   └─ index.js
```

### 全專案共用內容

只有跨越多個 Feature，且用途與語意一致的內容，才放到全域共用目錄：

```text
src/
├─ assets/
├─ components/
├─ features/
├─ hooks/
├─ services/
├─ stores/
├─ types/
├─ utils/
├─ constants/
└─ styles/
```

不要將所有可疑似共用的內容直接放進 `common` 或 `global`，以免資料夾逐漸失去明確用途。

## 共用與抽象時機

符合下列條件時，可以考慮抽成共用模組：

- 已經有兩個以上的實際使用位置。
- 各使用位置的行為與語意相同。
- 抽出後能明顯降低重複或維護成本。
- 對外介面相對穩定。
- 不需要大量條件或參數才能支援不同情境。

外觀相似不代表職責相同。若兩個 Component 的商業意義或未來變化方向不同，可以保留為獨立實作。

應避免建立依賴大量 boolean props 的萬用 Component：

```jsx
<Card isUser isCompact showImage enableAdminMode />
```

遇到這類情況，應優先考慮拆分 Component、使用 composition，或建立語意清楚的不同變體。

## Type 管理

Type 應放在最小必要範圍：

- Component 專用：放在 Component 資料夾。
- Feature 共用：放在該 Feature 的 `types/`。
- 全專案共用：放在 `src/types/`。
- API request/response：放在對應的 API 或 Feature 內。
- 自動產生的資料型別：放在獨立的 generated 或 database types 目錄。

API 資料結構與 UI 使用的資料結構不必完全相同。必要時使用 mapper 或 adapter 轉換資料，避免畫面直接依賴後端欄位。

目前使用 JavaScript 的檔案，可用 JSDoc 表達必要型別；若未來導入 TypeScript，則使用 `.ts` 或 `.tsx` 及對應的 type 檔案。

## 邏輯分類

不要將所有邏輯都放進名稱模糊的 `helpers.js`。應依性質使用具體名稱與位置：

| 邏輯               | 建議位置或命名                                 |
| ------------------ | ---------------------------------------------- |
| 純函式、格式轉換   | `utils/formatPrice.js`                         |
| React 狀態或副作用 | `hooks/useOrderForm.js`                        |
| 商業規則           | `features/orders/utils/calculateOrderTotal.js` |
| 後端請求           | `features/orders/api/getOrders.js`             |
| API 資料轉換       | `features/orders/api/mapOrderResponse.js`      |
| 固定設定值         | `constants/` 或 Feature 內的 constants         |

純 utility 應盡量保持無副作用，以利測試與重複使用。

## Props 與資料流

- Props 應保持精簡，名稱需清楚表達用途。
- Callback prop 使用 `onXxx`，Component 內部處理函式使用 `handleXxx`。
- 子 Component 只接收它實際需要的資料。
- 避免不必要地傳遞完整大型物件。
- 避免透過過多 boolean props 控制完全不同的行為。
- 適合時使用 `children` 或 composition 組合 UI。
- 狀態應盡可能靠近使用位置，只有確實跨模組共享時才提升至 Store。

```jsx
// 依賴範圍不明確
<UserName user={user} />

// 依賴範圍清楚
<UserName name={user.name} />
```

## API 與後端程式碼

共用的 HTTP 或 Firebase 初始化可集中於 `services/`，各功能的請求則放在對應 Feature：

```text
services/
└─ firebaseClient.js

features/
└─ orders/
   └─ api/
      ├─ getOrders.js
      ├─ createOrder.js
      └─ mapOrderResponse.js
```

API 層負責：

- 請求位置與方法
- 認證及共用設定
- 請求與回傳資料格式
- 錯誤正規化
- 必要的資料轉換

Component 內不應散落 API URL、Firebase 查詢細節或後端欄位轉換邏輯。

## Assets 管理

跨功能使用的靜態資源放在 `src/assets/`：

```text
assets/
├─ images/
├─ icons/
├─ fonts/
└─ illustrations/
```

僅由單一 Component 使用的圖片，可以與該 Component 放在一起。其他原則如下：

- 使用能表達用途的檔名，避免 `image1.png` 等名稱。
- 可重複使用的 icon 應透過統一的 Icon Component 或 icon library 管理。
- 避免在 Component 中散落硬編碼圖片路徑。
- 注意圖片尺寸、壓縮、lazy loading 與替代文字。

## 命名規範

| 類型             | 規範                  | 範例                   |
| ---------------- | --------------------- | ---------------------- |
| React Component  | PascalCase            | `UserCard`             |
| Component 檔案   | PascalCase            | `UserCard.jsx`         |
| Custom Hook      | `use` + PascalCase    | `useUserCard.js`       |
| 一般函式與變數   | camelCase             | `formatPrice`          |
| Type / Interface | PascalCase            | `UserCardProps`        |
| CSS Module       | Component 名稱        | `UserCard.module.css`  |
| 測試檔案         | 對應檔名 + `.test`    | `UserCard.test.jsx`    |
| Storybook        | 對應檔名 + `.stories` | `UserCard.stories.jsx` |

資料夾與檔案命名應在整個專案中保持一致。

## 公開介面

可使用 `index.js` 明確控制模組允許外部使用的內容：

```js
export { default as UserCard } from "./UserCard";
```

其他模組應優先從公開介面引入，避免依賴內部目錄結構。`index.js` 不應無限制匯出所有內部實作，以免產生循環依賴或模糊模組邊界。

## UI 品質與效能

重構時也應確認：

- 使用語意化 HTML。
- 支援鍵盤操作與正確的 focus 管理。
- 圖片具有適當的 `alt`。
- 必要時提供 `aria-*` 屬性。
- 完整處理 Loading、Empty、Error 與 Success 狀態。
- 維持 Responsive 行為。
- 避免不必要的 re-render。
- 不要在沒有實際效能問題時，過早加入大量 `memo`、`useMemo` 或 `useCallback`。

## 全專案重構流程

### 第一階段：建立全專案 Baseline

在修改架構前，先記錄：

- 現有路由與主要使用流程。
- 各頁面、Store、Firebase collection 與外部服務的關係。
- 現有 lint、test 與 build 結果，包括重構前已存在的錯誤。
- 必須維持的使用者行為、Responsive 行為與資料格式。
- 缺少自動測試時，需要執行的手動驗證清單。

Baseline 是後續判斷 regression 的依據，不應在此階段順便修改功能。

### 第二階段：盤點 Feature 與依賴

以 Feature 為單位列出：

- 責任、輸入、輸出與使用位置。
- 依賴的 Component、Store、API、Firebase collection、環境變數與第三方服務。
- 跨 Feature 的資料流與導航流程。
- 重複邏輯、過長區塊、循環依賴及責任不清的模組。

此階段應先完成全專案地圖，再決定目標目錄；不可只盤點單一頁面後就視為全專案盤點完成。

### 第三階段：定義目標架構與遷移順序

- 依業務邊界確認 Feature／Domain。
- 定義 `features/`、`services/`、`components/`、`stores/`、`assets/` 等目錄責任。
- 排定 Feature 的處理順序及相依關係。
- 優先處理會被多個 Feature 使用的基礎設施，但避免先建立尚未證實需要的抽象。
- 決定每個階段的驗收條件與 rollback 邊界。

### 第四階段：逐一重構 Feature

依排定順序逐一處理 Feature。每個 Feature 都必須重複套用下列六步模組流程：

1. 確認 Component／模組現有責任、輸入、輸出與使用位置。
2. 找出重複邏輯、過長區塊與不清楚的資料流。
3. 判斷內容應留在 Component、提升到 Feature，或成為全域共用。
4. 以小步驟拆分，每次維持可執行狀態。
5. 保留既有對外介面，或同步更新所有使用位置。
6. 驗證功能、型別、程式碼品質與建置結果。

一個 Feature 可以包含多個小步驟與多個 commit，不應為了對應六步流程而合併成大型 commit。

### 第五階段：整合與全專案清理

所有 Feature 完成後再進行：

- 確認跨 Feature 共用內容是否真的值得提升至全域層。
- 移除遷移後未使用的舊程式碼、檔案與依賴。
- 統一命名、錯誤處理、資料型態、Loading／Empty／Error／Success 狀態。
- 檢查路由、權限、環境設定與第三方服務整合。
- 檢查無障礙、Responsive 與效能是否退化。

### 第六階段：最終驗證

- 執行 lint、test 與 production build。
- 執行主要使用流程的手動或端對端驗證。
- 比對 Baseline，確認沒有非預期的行為變更。
- 記錄仍保留的技術債及後續工作，避免混入本次重構範圍。

## Commit 原則

- 一個 commit 只處理一個可描述、可驗證的變更。
- 每個 commit 完成後，專案應保持可執行；若受既有問題影響，需明確記錄。
- 不將純搬檔、行為修改與無關格式化混在同一個 commit。
- 先完成所有使用位置的更新，再移除舊介面。
- Commit message 應描述目的，例如 `refactor(search): extract Firestore queries`，而不是只寫 `update files`。
- 分析步驟不強制建立文件或 commit；只有具長期價值的架構決策、Baseline 或驗證紀錄才應提交。
- Feature 大小不同，commit 數量也應不同；不得將「六步模組流程」解讀為每個 Feature 固定六個 commit。

## 本專案 Commit 執行計畫

本專案預計以 42 個小型 commit 完成重構。前 36 個 commit 完成後重新執行全專案架構稽核，確認仍有資料層洩漏、依賴方向反轉、重複導覽狀態與大型 UI 元件等問題，因此追加 6 個收斂 commit。若後續執行時再發現隱藏依賴、必要修復或原計畫範圍不合理，必須先說明原因與影響，經確認後才能調整 commit 數量或順序。

每個 commit 採用以下人工確認流程：

1. Codex 只修改當前 commit 定義的範圍。
2. Codex 執行該範圍可行的 lint、test、build 或手動檢查。
3. Codex 停下並回報修改檔案、行為影響、驗證結果及建議的 commit message。
4. 使用者檢查並手動建立 commit。
5. 使用者確認繼續後，Codex 才進行下一個 commit。

不得在使用者尚未提交當前修改時，自行進入下一個 commit 的修改範圍。

### 第一階段：規範與 Baseline

- [x] 1. `docs: define project refactor strategy`
  - 更新全專案重構規範、執行階段與 commit 原則。
- [x] 2. `docs: document current application architecture`
  - 記錄路由、頁面、Stores、Firebase collections、外部服務與主要資料流。
- [x] 3. `docs: record refactor verification baseline`
  - 記錄重構前的 lint、test、build 結果及主要功能手動驗證清單。

### 第二階段：基礎設施

- [x] 4. `refactor(firebase): centralize Firebase client initialization`
  - 整理 Firebase Auth、Firestore 與 Storage 的初始化及 exports。
- [x] 5. `refactor(data): add Firestore document mappers`
  - 統一 Firestore document ID 與資料轉換方式。
- [x] 6. `refactor(data): extract user and company repositories`
  - 抽離 user 與 company collections 的讀寫操作。
- [x] 7. `refactor(storage): centralize image upload operations`
  - 建立共用圖片上傳介面；此 commit 只集中現有行為，不自行更換儲存供應商。
- [x] 8. `refactor(store): remove Firebase operations from user store`
  - 讓 Zustand Store 專注於狀態管理，不直接存取 Firebase。

### 第三階段：Application 與身份驗證

- [x] 9. `refactor(auth): extract authentication session hook`
  - 從 `App.jsx` 抽離登入狀態監聽與 session 初始化。
- [x] 10. `refactor(router): extract route access guards`
  - 將食客、老闆與未登入使用者的路由限制移出 `App.jsx`。
- [x] 11. `refactor(header): separate header state and navigation`
  - 拆分 Header 的登入狀態、導航資料與畫面責任。
- [x] 12. `refactor(auth): simplify login flow`
  - 整理一般登入、Google 登入與測試帳號流程。

### 第四階段：註冊流程

- [x] 13. `refactor(signup): centralize signup state and constants`
  - 統一註冊步驟、角色、選項與表單資料。
- [x] 14. `refactor(signup): extract diner registration flow`
  - 整理食客註冊、驗證與頭像上傳流程。
- [x] 15. `refactor(signup): extract boss registration flow`
  - 整理老闆、餐廳、地址與地圖資料流程。

### 第五階段：搜尋

- [x] 16. `refactor(search): define search constants and data model`
  - 集中分類選項、預設地圖位置與搜尋資料格式。
- [x] 17. `refactor(search): extract Firestore search repository`
  - 抽離依名稱、地區與類別執行的 Firestore 查詢。
- [x] 18. `refactor(search): consolidate result enrichment and sorting`
  - 統一 favorite 補充、結果排序與非同步處理。
- [x] 19. `refactor(search): extract search controls`
  - 拆出搜尋條件與操作表單元件。
- [x] 20. `refactor(search): extract result list components`
  - 拆出結果清單、餐廳卡片與 favorite 狀態元件。
- [x] 21. `refactor(search): simplify map integration`
  - 統一地圖 props、marker 清理與搜尋資料來源。

### 第六階段：首頁與搜尋整合

- [x] 22. `refactor(homepage): reuse shared restaurant search flow`
  - 移除首頁與搜尋頁重複的 Firestore 搜尋及結果處理程式。

### 第七階段：餐廳與 Favorite

- [x] 23. `refactor(restaurant): extract restaurant data repository`
  - 集中餐廳、菜單、活動與食記資料取得。
- [x] 24. `refactor(restaurant): split restaurant page sections`
  - 拆分餐廳資訊、菜單、活動與評論區塊。
- [x] 25. `refactor(favorite): centralize favorite operations`
  - 統一 like、dislike 與 eaten 的查詢及更新。

### 第八階段：食記與評論

- [x] 26. `refactor(post): extract post repository and data mapping`
  - 集中食記查詢、新增、修改、刪除與資料轉換。
- [x] 27. `refactor(editor): share post editor image handling`
  - 整合新增食記、修改食記與活動編輯器的圖片處理邏輯。
- [x] 28. `refactor(review): centralize rating and comment operations`
  - 整理新增評分、修改評分、刪除評論與餐廳總評分更新。

### 第九階段：食客後台

- [x] 29. `refactor(diner): simplify diner profile flow`
  - 整理食客資料顯示與編輯流程。
- [x] 30. `refactor(diner): consolidate diner record lists`
  - 整合收藏、不喜歡、吃過、訂位、評論與食記清單的共用流程。

### 第十階段：老闆後台

- [x] 31. `refactor(boss): simplify company profile and media flows`
  - 整理店家資料、圖片、菜單與活動流程。
- [x] 32. `refactor(boss): extract opening time and table operations`
  - 整理營業時間與桌位管理操作。
- [x] 33. `refactor(boss): split schedule and order management`
  - 拆分排程、訂單狀態與座位處理邏輯。

### 第十一階段：訂位

- [x] 34. `refactor(reservation): separate reservation data and UI flow`
  - 拆分餐廳資料、營業時間、桌位、訂單檢查與送出流程。

### 第十二階段：全專案整理與驗證

- [x] 35. `refactor(shared): organize shared UI assets and remove dead code`
  - 整理確實共用的 UI、Assets 與 Stores，並移除確認未使用的程式碼及依賴。
- [x] 36. `chore: complete accessibility and project verification`
  - 補齊圖片 `alt`、必要的 Loading／Empty／Error 狀態，執行 lint、test、build 與主要流程驗證。
  - 驗證結果：lint 與 production build 通過，搜尋／排程／訂位 model smoke checks 通過；目前專案尚未配置自動化 test script。

### 第十三階段：架構收斂

- [x] 37. `refactor(data): remove direct Firebase access from UI`
  - 移除註冊、食客紀錄、食記編輯與 Header 對 Firebase client 的直接操作。
  - 統一資料流為 UI → feature hook/service → repository/auth service → Firebase。
- [x] 38. `refactor(architecture): enforce feature and service boundaries`
  - 修正 service 依賴 feature、store 依賴 page，以及 feature 引用 page asset 的反向依賴。
  - 將跨 Feature 使用的 constants、model 與 assets 移到穩定且語意一致的位置。
- [x] 39. `refactor(navigation): derive sidebar state from routes`
  - 由目前 route 推導 Boss 與 Diner sidebar 的選取狀態。
  - 移除與 URL 重複、可能不同步的 `bossStore` 與 `dinerStore` 導覽狀態。
- [x] 40. `refactor(ui): split remaining large page components`
  - 依職責拆分仍混合表單狀態、業務規則與多區塊 UI 的大型頁面。
  - 優先處理 OpenTime、BossInfoEdit、Homepage、Reserve、Schedule、Post 與 EatenShop，避免僅為縮短行數而過度拆分。
- [x] 41. `refactor(ui): unify dashboard navigation and record cards`
  - 以設定資料與共用元件統一 Boss／Diner 後台導覽。
  - 整理食客收藏、用餐、訂位、評論與食記清單中重複的 card、list 與 empty layout。
- [x] 42. `test: add model and flow regression coverage`
  - 建立 test script 與測試環境。
  - 覆蓋搜尋、訂位桌位分配、排程移動、路由權限、repository mapper、登入註冊，以及 favorite／review 狀態操作。

## 完成檢查清單

- [ ] 已建立並保留可比較的重構前 Baseline。
- [ ] 所有 Feature、跨 Feature 依賴與主要資料流均已盤點。
- [ ] 每個 Feature 都已依模組重構流程處理及驗證。
- [ ] 路由、權限、Store、Firebase 與外部服務的整合行為維持正常。
- [ ] 每個 Component 的主要職責清楚。
- [ ] Component 名稱與檔名使用 PascalCase。
- [ ] 專用 type、style、hook、測試與 asset 已就近放置。
- [ ] 共用內容確實有多個使用位置，且語意一致。
- [ ] 沒有將大量不相關內容堆入 `common`、`global` 或 `helpers`。
- [ ] API 與後端細節沒有散落在 UI Component 中。
- [ ] Props 精簡，資料流容易追蹤。
- [ ] Loading、Empty、Error 與邊界情況行為維持正常。
- [ ] 無障礙與 Responsive 行為未被破壞。
- [ ] 已執行 lint、測試與 build。
- [ ] 已手動驗證主要使用流程。
- [ ] 已移除確認不再使用的舊程式碼與依賴。
- [ ] 尚未處理的技術債已記錄，且沒有被誤列為本次完成項目。

## 快速判斷方式

遇到一段準備抽離的程式碼時，依序詢問：

1. 只由目前 Component 使用嗎？放在 Component 資料夾。
2. 由同一 Feature 的多個模組使用嗎？放在 Feature 內。
3. 跨多個 Feature 使用，而且語意一致嗎？提升到全域共用層。
4. 抽出後是否需要更多條件與參數才能運作？若是，可能還不適合共用。

> 總結：從局部開始放置，確認真正共用後再向上提升；依照功能與業務邊界組織程式碼，並避免過早抽象。
