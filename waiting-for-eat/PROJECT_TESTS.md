# Waiting for Eat 測試與品質檢查

## Vitest 單元測試

執行全部測試一次：

```bash
npm test
```

開發時持續監看：

```bash
npm run test:watch
```

執行單一測試檔：

```bash
npx vitest run src/features/reservation/reservationModel.test.js
```

目前共有 8 個測試檔、45 個 test cases：

| 測試檔                                                 | Cases | 覆蓋重點                                             |
| ------------------------------------------------------ | ----: | ---------------------------------------------------- |
| `src/features/search/searchModel.test.js`              |     5 | 搜尋選項去重、結果排序、收藏狀態合併與不可變性       |
| `src/features/reservation/reservationModel.test.js`    |     7 | 可預約時段、餐桌分配、容量不足、日期格式與資料完整性 |
| `src/features/boss/scheduleModel.test.js`              |     5 | FullCalendar resource/event 轉換、排程移動與不可變性 |
| `src/router/useRouteAccessGuard.test.js`               |    11 | 載入中、訪客、用餐者與店家帳號的路由權限及 redirect  |
| `src/services/firebase/firestoreMappers.test.js`       |     5 | DocumentSnapshot、QuerySnapshot 與 document ID 轉換  |
| `src/services/auth/authenticationService.test.js`      |     5 | Email/Google 登入、登出與 auth state subscription    |
| `src/services/repositories/favoriteRepository.test.js` |     3 | 收藏狀態讀取、更新與完成訂單寫入                     |
| `src/services/repositories/reviewRepository.test.js`   |     4 | 評論查詢、新增、更新、刪除與平均評分刷新             |

測試與被測模組放在相同資料夾，命名為 `*.test.js`。目前沒有獨立的 Vitest config；Vitest 透過 `vite.config.js` 載入 Vite/React 設定，測試環境採預設的 Node 環境。

Firebase Authentication 與 Firestore repository 測試均使用 `vi.mock()`，不會連線至真實 Firebase，也不要求 `.env`。

目前沒有設定 coverage script 或最低覆蓋率門檻。若要臨時產生 coverage，需先安裝相容版本的 `@vitest/coverage-v8`（或其他 Vitest coverage provider），再設定對應 script。

## ESLint

```bash
npm run lint
```

實際指令：

```text
eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
```

檢查範圍包含專案中的 `.js`、`.jsx`，`dist` 與 `.eslintrc.cjs` 依設定排除。因為有 `--max-warnings 0`，warning 也會使檢查失敗。

## Prettier

專案沒有 npm script 封裝 Prettier，直接使用：

```bash
npx prettier --check .
npx prettier --write .
```

## Production build

```bash
npm run build
```

build 可驗證模組 import、JSX 轉譯、CSS 處理與 production bundle。成功後輸出至 `dist/`。

## 提交前檢查

```bash
npx prettier --check .
npm test
npm run lint
npm run build
```

專案目前未設定 Husky 或 CI，因此這些檢查需手動執行。
