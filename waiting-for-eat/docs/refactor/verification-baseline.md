# 重構前驗證 Baseline

本文件記錄重構開始前的自動檢查結果與主要功能驗證清單。Baseline 的目的不是宣告目前專案沒有問題，而是區分既有問題與後續重構造成的 regression。

記錄日期：2026-10-12

## Package Scripts

目前 `package.json` 提供：

| Script | Command | 狀態 |
| --- | --- | --- |
| `dev` | `vite` | 可用於本機開發伺服器 |
| `build` | `vite build` | 本次執行受環境權限阻擋 |
| `lint` | `eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0` | 執行完成但未通過 |
| `preview` | `vite preview` | 需先成功 build |
| `test` | 無 | 專案目前沒有自動測試 script |

## Lint Baseline

執行：

```bash
npm run lint
```

結果：失敗，exit code `1`。

```text
150 problems
119 errors
31 warnings
```

主要既有問題類型：

- 未使用的 React imports、變數及函式。
- React Hooks dependency array 不完整。
- Component props 缺少 `prop-types` 驗證。
- JSX 文字包含未 escape 的字元。
- iterator element 缺少 `key`。
- `Restaurant/Menu.jsx` 條件式呼叫 Hook。
- `Boss/Photo.jsx` 使用未定義的 `setPosition`、`setDisplay`。
- `tailwind.config.js` 的 CommonJS `require` 被目前 ESLint 設定判定為未定義。

Lint 尚未通過是重構前已存在的狀態。後續每個 commit 不得無故增加問題數；相關 Feature 被重構時應逐步處理其範圍內的問題。

## Build Baseline

執行：

```bash
npm run build
```

結果：尚未取得可信的專案編譯結果。

目前執行環境在 esbuild 尋找設定時無法讀取工作區上層目錄：

```text
Cannot read directory "../../../..": Access is denied.
failed to load config from .../vite.config.js
Error: The service was stopped
```

這次失敗發生在載入 Vite config 階段，不能據此判定應用程式原始碼能否成功編譯。曾請求在沙箱外重跑，但該次執行未獲完成，因此 Build 狀態記為：

```text
BLOCKED BY EXECUTION ENVIRONMENT / NOT VERIFIED
```

後續在可正常讀取專案路徑的本機環境中，仍需手動執行 `npm run build`。

## 自動測試 Baseline

專案目前沒有：

- `test` package script。
- 單元測試設定。
- Component 測試設定。
- E2E 測試設定。
- 現有測試檔案。

因此目前主要依賴 lint、build 與手動流程驗證。新增測試若會擴大既定 commit 範圍，應另行調整計畫後執行。

## 手動驗證前置條件

- `.env` 已設定 Firebase API key 與 Google Maps API key。
- Firebase Authentication、Firestore 及圖片來源可存取。
- 測試資料至少包含食客帳號、老闆帳號、餐廳、營業時間、桌位及訂單。
- 瀏覽器允許 Google Maps 載入。
- 若 Firebase Storage 因方案限制無法使用，應將圖片上傳標記為外部依賴阻擋，不與其他流程混為同一失敗。

## 主要手動驗證清單

以下項目建立行為基準；本文件只定義清單，不宣告所有項目已實際通過。

### 公開流程

- [ ] 首頁可以正常載入 Banner、搜尋欄與分類卡片。
- [ ] 可以依餐廳名稱搜尋並前往 `/search`。
- [ ] 可以依地區搜尋並前往 `/search`。
- [ ] 可以依類別搜尋並前往 `/search`。
- [ ] 搜尋結果可以顯示餐廳資料及地圖 markers。
- [ ] 點擊搜尋結果可以進入正確餐廳頁。
- [ ] 餐廳頁可以顯示基本資料、菜單、活動、評論與食記。
- [ ] 食記詳細頁可以顯示文章、作者與餐廳資訊。

### Authentication 與身份

- [ ] 未登入使用者可以瀏覽公開頁面。
- [ ] 未登入使用者不能進入 diner、boss 或 reserve 限制頁面。
- [ ] 一般帳密登入可以識別食客身份。
- [ ] 一般帳密登入可以識別老闆身份。
- [ ] Google 登入流程可以完成或顯示正確錯誤。
- [ ] 登出後清除使用者狀態並返回公開狀態。
- [ ] 食客不能進入老闆後台。
- [ ] 老闆會被導向自己的餐廳後台。

### 註冊

- [ ] 食客可以完成全部註冊步驟。
- [ ] 老闆可以完成全部註冊步驟。
- [ ] 老闆地址可以取得有效座標。
- [ ] user document 可以正確建立。
- [ ] 老闆註冊時 company document 可以建立並回寫 `companyId`。
- [ ] 圖片服務可用時，頭像上傳後能保存圖片 URL。

### 食客流程

- [ ] 可以查看及修改個人資料。
- [ ] 可以查看訂位紀錄。
- [ ] 可以取消尚未完成的訂位。
- [ ] 可以查看 eaten、like 與 dislike 餐廳。
- [ ] 可以新增、修改及刪除評論。
- [ ] 評論變更後餐廳總評分維持正確。
- [ ] 可以新增、修改及刪除食記。
- [ ] 圖片服務可用時，食記主圖與內文圖片可以上傳。

### 訂位流程

- [ ] 可以讀取餐廳營業時間與桌位。
- [ ] 過去日期不可選擇。
- [ ] 必填欄位不完整時不可送出。
- [ ] 衝突時段或不可用桌位不會建立重複訂位。
- [ ] 成功訂位後可以在食客訂位紀錄中看到訂單。

### 老闆流程

- [ ] 可以查看及修改老闆與餐廳資料。
- [ ] 圖片服務可用時，可以更新餐廳主圖及菜單圖片。
- [ ] 可以查看及編輯活動內容。
- [ ] 可以新增及刪除營業時間。
- [ ] 可以新增及刪除桌位。
- [ ] 可以在排程中查看訂單。
- [ ] 可以調整訂單時間與桌號。
- [ ] 標記出席後可以建立 `eaten` 狀態。

### UI 與 Responsive

- [ ] 桌面版 Header、頁面與側欄正常顯示。
- [ ] 行動版搜尋欄及結果列可以顯示／隱藏。
- [ ] Diner 與 Boss 側欄在支援的 viewport 正常操作。
- [ ] Loading 與 Empty 狀態不會造成頁面崩潰。

## Baseline 判定規則

- Lint：既有基準為 119 errors、31 warnings；不得無故增加。
- Build：目前未驗證，後續取得可執行環境後必須補跑。
- Tests：目前不存在，不能宣稱自動測試通過。
- 手動流程：只有實際執行並確認後才能勾選，不因程式碼閱讀而視為通過。
- 外部 Firebase／Google Maps／Storage 問題需與前端 regression 分開記錄。
