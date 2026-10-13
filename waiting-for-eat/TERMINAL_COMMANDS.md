# Waiting for Eat 安裝與 Terminal 指令

這份文件整理本專案在本機安裝、開發、測試、程式碼檢查、建置與部署時會用到的 Terminal 指令。

## 環境需求

開始前請先安裝：

- [Node.js](https://nodejs.org/)（建議使用目前的 LTS 版本）
- npm（安裝 Node.js 時會一併安裝）
- Git（只有下載原始碼與版本控制時需要）

確認工具是否已安裝：

```bash
node --version
npm --version
git --version
```

## 第一次安裝

### 1. 取得專案並進入資料夾

若尚未下載專案，先使用 Git clone 專案的 repository，再進入專案資料夾：

```bash
git clone <repository-url>
cd waiting-for-eat
```

如果已經有專案檔案，只需要在 Terminal 進入 `waiting-for-eat` 根目錄。

### 2. 安裝 dependencies

一般本機開發使用：

```bash
npm install
```

若要完全依照 `package-lock.json` 進行乾淨且可重現的安裝，可改用：

```bash
npm ci
```

`npm ci` 會先重新建立 `node_modules`，適合 CI 或確認 lock file 安裝結果；平常新增或更新套件時使用 `npm install`。

### 3. 設定環境變數

在專案根目錄建立 `.env`：

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_GOOGLE_API_KEY=your-google-api-key
```

- `VITE_FIREBASE_API_KEY`：Firebase Web App 使用的 API key。
- `VITE_GOOGLE_API_KEY`：Google Maps、Places 與地址搜尋功能使用的 API key。
- `.env` 已被 Git 忽略，不要把真實金鑰提交到 repository。
- 修改 `.env` 後，請重新啟動開發伺服器。

### 4. 啟動專案

```bash
npm run dev
```

Terminal 會顯示本機網址，通常是 `http://localhost:5173`。請使用 Terminal 實際顯示的網址為準。

## npm 指令一覽

| 指令                 | 用途                                                     |
| -------------------- | -------------------------------------------------------- |
| `npm install`        | 安裝 dependencies，並允許更新 `package-lock.json`        |
| `npm ci`             | 完全依照 `package-lock.json` 重新安裝 dependencies       |
| `npm run dev`        | 啟動 Vite 開發伺服器與 hot reload                        |
| `npm test`           | 執行全部 Vitest unit tests 一次後結束                    |
| `npm run test:watch` | 以 watch mode 執行 Vitest，檔案變動時自動重跑相關測試    |
| `npm run lint`       | 使用 ESLint 檢查全部 `.js` 與 `.jsx`，warning 也視為失敗 |
| `npm run build`      | 建立 production 版本至 `dist/`                           |
| `npm run preview`    | 在本機預覽已建置的 `dist/`                               |

## 測試

執行全部 unit tests：

```bash
npm test
```

開發時持續監看測試：

```bash
npm run test:watch
```

只執行指定測試檔案：

```bash
npx vitest run src/features/search/searchModel.test.js
```

更完整的測試範圍與測試案例說明請參考 [`TESTING.md`](./TESTING.md)。

## 程式碼格式與品質檢查

使用 Prettier 自動格式化專案檔案：

```bash
npx prettier --write .
```

只檢查格式、不修改檔案：

```bash
npx prettier --check .
```

執行 ESLint：

```bash
npm run lint
```

目前專案沒有安裝或設定 Husky，因此 `git commit` 與 `git push` 不會自動執行上述檢查。建議每次 commit 前依序執行：

```bash
npx prettier --write .
npm test
npm run lint
npm run build
```

## Production build 與本機預覽

建立 production 版本：

```bash
npm run build
```

成功後，輸出檔案會放在 `dist/`。預覽建置結果：

```bash
npm run preview
```

`npm run preview` 不是正式的 production server，只用於本機檢查建置結果。

## Firebase Hosting 部署

本專案的 `firebase.json` 已設定將 `dist/` 部署到 Firebase Hosting，且 SPA route 會 rewrite 到 `index.html`。

第一次使用 Firebase CLI 時，可全域安裝：

```bash
npm install --global firebase-tools
```

登入 Firebase：

```bash
firebase login
```

確認目前 Firebase project：

```bash
firebase use
```

部署前先完成檢查與 production build：

```bash
npm test
npm run lint
npm run build
firebase deploy --only hosting
```

目前 `.firebaserc` 的預設 Firebase project 是 `project-fire-6a02f`，Hosting site 是 `waiting-for-eat`。必須登入具有該 Firebase project 權限的 Google 帳號才能部署。

## 套件管理

安裝 production dependency：

```bash
npm install <package-name>
```

安裝 development dependency：

```bash
npm install --save-dev <package-name>
```

移除套件：

```bash
npm uninstall <package-name>
```

查看目前直接安裝的套件：

```bash
npm list --depth=0
```

檢查可更新的套件：

```bash
npm outdated
```

更新套件前應先確認 breaking changes，更新後重新執行 test、lint 與 build。

## 常見問題

### `npm run dev` 後地圖無法載入

確認 `.env` 中有正確的 `VITE_GOOGLE_API_KEY`，相關 Google Maps API 已啟用，而且修改環境變數後已重新啟動開發伺服器。

### Firebase 登入或資料讀寫失敗

確認 `VITE_FIREBASE_API_KEY` 正確，並檢查 Firebase Authentication、Firestore 規則與目前使用者權限。

### 指令顯示 `Missing script`

先確認 Terminal 位於包含 `package.json` 的專案根目錄，再確認指令名稱是否與本文件及 `package.json` 一致。

### 安裝結果異常

先確認 Node.js 與 npm 版本，再使用 lock file 重新安裝：

```bash
npm ci
```

這個指令會重建 `node_modules`，本機尚未提交的程式碼不會被刪除。
