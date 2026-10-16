# Waiting for Eat 專案指令

本文件以目前的 `package.json`、Vite 與 Firebase 設定為準。

## 環境需求

- Node.js（建議使用目前的 LTS 版本）
- npm
- Git

確認工具版本：

```bash
node --version
npm --version
git --version
```

專案目前沒有在 `package.json` 設定 `engines`，因此沒有鎖定特定 Node.js 版本。

## 初次安裝

```bash
git clone <repository-url>
cd waiting-for-eat
npm ci
```

- 一般開發與 CI 建議使用 `npm ci`，依 `package-lock.json` 安裝固定版本。
- 需要新增或升級套件並更新 lock file 時，才使用 `npm install`。

## 環境變數

在專案根目錄建立 `.env`：

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_GOOGLE_API_KEY=your-google-api-key
```

目前程式實際讀取的變數只有以上兩項：

- `VITE_FIREBASE_API_KEY`：Firebase Web App API key。
- `VITE_GOOGLE_API_KEY`：Google Maps JavaScript API key，搜尋、店家資料編輯與店家註冊會使用。

`.env` 已由 `.gitignore` 排除，不應提交真實金鑰。修改環境變數後須重新啟動 Vite。

## npm scripts

| 指令                 | 實際執行                                                                    | 用途                                           |
| -------------------- | --------------------------------------------------------------------------- | ---------------------------------------------- |
| `npm run dev`        | `vite`                                                                      | 啟動開發伺服器，預設為 `http://localhost:5173` |
| `npm run build`      | `vite build`                                                                | 建立 production bundle 至 `dist/`              |
| `npm run preview`    | `vite preview`                                                              | 在本機預覽已建立的 `dist/`                     |
| `npm test`           | `vitest run`                                                                | 執行全部測試一次                               |
| `npm run test:watch` | `vitest`                                                                    | 以 watch mode 執行測試                         |
| `npm run lint`       | `eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0` | 檢查 JavaScript 與 JSX；warning 也會使指令失敗 |

執行單一測試檔：

```bash
npx vitest run src/features/search/searchModel.test.js
```

依測試名稱篩選：

```bash
npx vitest run -t "排序搜尋結果"
```

## 格式化與完整檢查

格式化全部支援的檔案：

```bash
npx prettier --write .
```

只檢查、不修改：

```bash
npx prettier --check .
```

提交前建議依序執行：

```bash
npx prettier --check .
npm test
npm run lint
npm run build
```

專案目前沒有 Husky、pre-commit hook 或 CI 設定，上述檢查不會由 Git 自動執行。

## Firebase Hosting 部署

`firebase.json` 將 `dist/` 發布至 Firebase Hosting，並把所有路由 rewrite 到 `/index.html`，以支援 React Router。

安裝 CLI、登入與部署：

```bash
npm install --global firebase-tools
firebase login
npm test
npm run lint
npm run build
firebase deploy --only hosting
```

目前 `.firebaserc` 的預設 Firebase project 是 `project-fire-6a02f`，Hosting site 是 `waiting-for-eat`。部署前應先用下列指令確認目前專案：

```bash
firebase use
```

## 套件管理

```bash
npm install <package-name>
npm install --save-dev <package-name>
npm uninstall <package-name>
npm list --depth=0
npm outdated
```

升級套件後至少重新執行 test、lint 與 build。
