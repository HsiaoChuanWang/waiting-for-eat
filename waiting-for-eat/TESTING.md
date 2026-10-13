# 測試與程式碼品質檢查

## Unit Test

本專案使用 Vitest。執行全部測試：

```bash
npm test
```

開發時持續監看檔案並自動重新測試：

```bash
npm run test:watch
```

目前共有 8 個測試檔案、45 個測試案例。

### 搜尋邏輯

測試檔案：`src/features/search/searchModel.test.js`

- 建立餐廳名稱或地區選項時，移除重複值與空值。
- 依照餐廳評分由高到低排序。
- 排序時不修改原始搜尋結果陣列。
- 評分相同時，可選擇使用餐廳 ID 作為第二排序條件。
- 將使用者的 `like`、`dislike` 或 `eaten` 狀態合併到搜尋結果。
- 確認每一筆搜尋結果都有查詢對應的 favorite 狀態。

### 訂位與桌位分配

測試檔案：`src/features/reservation/reservationModel.test.js`

- 只保留符合指定星期的營業時段。
- 排除所有桌位都已被預約的時段。
- 排除目前時段已被預約的桌位。
- 優先選擇容量足夠且最小的單張桌位。
- 單桌不足時，自動組合多張桌位。
- 總容量不足或訂位人數無效時回傳 `null`。
- 將日期物件轉換成訂位使用的日期格式。
- 判斷訂位資料是否完整。

### 業者排程

測試檔案：`src/features/boss/scheduleModel.test.js`

- 將桌位資料轉換並排序成 FullCalendar resources。
- 一筆訂單使用多張桌位時，為每張桌位建立一個 calendar event。
- 第一次移動排程時，記錄原始桌位索引與新時段。
- 再次移動同一個 event 時，更新原紀錄而不是新增重複紀錄。
- 將排程異動套用回訂單。
- 套用異動時不修改原始訂單資料。

### 路由權限

測試檔案：`src/router/useRouteAccessGuard.test.js`

- 認證資料仍在載入時不提前導頁。
- 未登入使用者不能進入訂位、食客與業者頁面。
- 未登入使用者仍可瀏覽公開頁面。
- 已登入但使用者資料尚未載入時不誤導頁。
- 食客不能進入業者後台。
- 食客只能查看自己的後台資料。
- 業者只能管理自己的餐廳。
- 業者進入其他公司的路徑時，導回自己的公司後台。

### Firestore 資料轉換

測試檔案：`src/services/firebase/firestoreMappers.test.js`

- Firestore 文件不存在時回傳 `undefined`。
- 未指定 ID 欄位時，只回傳文件資料。
- 指定 ID 欄位時，將 document ID 合併到應用程式資料。
- 將 QuerySnapshot 中的所有文件轉換成陣列。
- 空的 QuerySnapshot 回傳空陣列。
- 轉換時不修改原始文件資料。

### 登入與註冊

測試檔案：`src/services/auth/authenticationService.test.js`

- 使用 Email 與密碼建立帳號。
- 使用 Email 與密碼登入。
- 使用設定好的 Google provider 登入。
- 登出目前使用者。
- 訂閱 Firebase Authentication 的登入狀態變化。

Firebase Authentication 已被 mock；測試不會真的建立帳號、登入或登出。

### Favorite 狀態

測試檔案：`src/services/repositories/favoriteRepository.test.js`

- 取得已存在的 favorite 狀態。
- 沒有 favorite 紀錄時回傳空字串。
- 更新指定 favorite 的 `like`、`dislike` 或 `eaten` 狀態。
- 完成用餐時建立 favorite 紀錄，初始狀態為 `eaten`。

Firestore 已被 mock；測試不會讀寫真實的 favorite 資料。

### Review 評論

測試檔案：`src/services/repositories/reviewRepository.test.js`

- 判斷指定訂單是否已經建立評論。
- 計算餐廳所有評論的平均星等。
- 將最新平均星等寫回餐廳資料。
- 建立評論時加入 Firestore server timestamp。
- 修改或刪除評論後，重新計算餐廳平均星等。

Firestore 已被 mock；測試不會讀寫真實的評論或餐廳資料。

## ESLint

執行 ESLint：

```bash
npm run lint
```

實際執行的指令為：

```text
eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
```

它會檢查專案中的所有 `.js` 與 `.jsx` 檔案，包含：

- ESLint 建議的 JavaScript 正確性規則。
- React component 與 props 規則。
- React JSX runtime 規則。
- React Hooks 使用方式與 dependency 規則。
- React Fast Refresh component export 規則。
- 未使用的 ESLint disable 註解。

因為使用 `--max-warnings 0`，任何 warning 都會讓指令失敗。

以下內容不在 ESLint 檢查範圍：

- `dist` 建置輸出目錄。
- `.eslintrc.cjs` 設定檔本身。
- CSS、圖片、Markdown 與其他非 `.js`／`.jsx` 檔案。
- Prettier 排版；格式化需要另外執行。

執行 Prettier：

```bash
npx prettier --write .
```

## Husky

目前專案尚未安裝或設定 Husky：

- `package.json` 沒有 `husky` dependency。
- Git repository root 沒有 `.husky` 目錄。
- Git 沒有設定自訂的 `core.hooksPath`。

因此執行 `git commit` 或 `git push` 時，不會自動執行 Vitest、ESLint、Prettier 或 production build。

目前 commit 前需要手動執行：

```bash
npx prettier --write .
npm test
npm run lint
npm run build
```

如果未來加入 Husky，應在這份文件補上 `pre-commit` 與 `pre-push` 實際執行的檢查。
