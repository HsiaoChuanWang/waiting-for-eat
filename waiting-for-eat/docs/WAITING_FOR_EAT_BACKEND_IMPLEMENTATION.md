# Waiting for Eat 後端實作計畫

這份文件規劃在保留現有 Firebase Firestore、Firebase Authentication 與 Supabase Storage 功能的前提下，另外實作可測試、可部署、可觀察的自建後端。前端提供 Firebase／自建 API 切換，供作品展示兩種後端；現有服務維持預設，自建後端作為可選方案與備案，不強制遷移或拔除既有功能。

本文為實作計畫，勾選項目不代表功能已完成。切換方式與實作步驟見第 14 節。

## 0. 從零建立自建後端：執行總清單

以下依實作順序執行，細節參照後續章節。所有項目先保持未勾選；文件準備完成不代表程式已實作。第一版先完成一種語言的自建 API，Toggle 展示的是 Firebase 與自建 API 兩種模式。

### A. 決定專案與語言

- [ ] 建立獨立的 `waiting-for-eat-backend` 專案與 Git repository，與前端各自管理依賴、測試、CI 與部署。此為待辦，目前尚未建立。
- [ ] 在兩個專案 README 互相連結，說明如何一起啟動，以及相容的 API 版本。
- [ ] 選擇 Python + FastAPI 或 Java + Spring Boot；若沿用 Node.js + TypeScript 也可以，但第一版只選一套。
- [ ] 若主要目標是先完成可運作的 API，可考慮 Python；若希望練習 Java 與 Spring 生態，可選 Java。選擇依學習與求職方向決定，不影響前端 Toggle 設計。
- [ ] 鎖定所選 runtime、框架、資料庫與依賴版本，記錄選擇原因及啟動指令。
- [ ] Python 路線：建立虛擬環境與依賴鎖定，使用 FastAPI、Pydantic、SQLAlchemy、Alembic、PostgreSQL driver、Firebase Admin、pytest 與 HTTP 測試 client。
- [ ] Java 路線：用 Spring Initializr 建立 Spring Boot 專案，選定 Maven 或 Gradle 並提交 wrapper；加入 Web、Validation、Security、Data JPA、PostgreSQL driver、Flyway、Firebase Admin、OpenAPI 文件與 JUnit 整合測試工具。
- [ ] 兩條路線擇一完成即可；未選路線標示「不適用」，不需為完成清單而實作兩套 API。

### B. 建立可啟動的開發環境

- [ ] 建立 config、routes/controllers、schemas/DTO、services、repositories、database、auth 與 tests 分層，依所選框架使用慣用目錄。
- [ ] 加入 `.gitignore`、`.env.example`、格式化、靜態檢查與測試指令，排除 credentials、真實 `.env`、虛擬環境及建置產物。
- [ ] 設定 local／test／staging／production 組態、連接埠、資料庫連線、允許的前端 origin 與 Firebase project ID。
- [ ] 用 Docker Compose 啟動本機 PostgreSQL，設定 volume、healthcheck 與測試用獨立資料庫。
- [ ] 完成最小 API、`/health/live`、`/health/ready`、結構化日誌、request ID、一致錯誤格式與 OpenAPI。
- [ ] 設定 CORS 允許指定的前端來源與 Authorization header，驗證瀏覽器 preflight。
- [ ] 確認從全新 checkout 能依 README 安裝、啟動資料庫、執行 migration 並開啟 API 文件。

### C. 固定前後端契約與身分驗證

- [ ] 盤點現有 repositories，定義 `/api/v1` 路徑、參數、回應、分頁、日期時區、ID、空值與錯誤碼，更新 OpenAPI。
- [ ] 使用 Firebase Admin 驗證 ID token，拒絕無效、過期或不屬於指定 project 的 token。
- [ ] 用 Firebase UID 對應資料庫使用者；實作 `/me`、首次建立 profile 與角色權限，不接受前端自行指定管理權限。
- [ ] 明確定義 guest、diner、boss 的操作，實作店家 ownership 與使用者資料隔離。
- [ ] 測試未登入 `401`、無權限 `403`、不存在資源及驗證錯誤，不回傳 secrets 或內部堆疊。

### D. 建立資料模型與核心功能

- [ ] 依第 6 節確認 ERD、外鍵、唯一限制、索引、狀態與時區，建立可重現的 schema migrations。
- [ ] 製作合成 seed：兩種角色、店家、桌位、營業時段、訂位、收藏、評論與文章，記錄 ID 關聯。
- [ ] 完成使用者讀取與更新，限制可修改欄位。
- [ ] 完成分類、店家列表／詳情、搜尋與分頁，以及 owner 店家管理。
- [ ] 完成營業時段與桌位管理，驗證時間區間、容量與 ownership。
- [ ] 完成可預訂時段查詢、建立／查看／取消訂位與店家排程更新，定義合法狀態轉換。
- [ ] 用資料庫 transaction、鎖或約束處理同時訂位與重複請求，測試不會超額或重複建立。
- [ ] 完成收藏唯一限制、評論資格與評分更新 transaction、文章 ownership 與富文字 sanitize。
- [ ] 先保留共用 Supabase 圖片流程並驗證既有權限；若另做 S3，完成 presigned URL、檔案限制與孤兒檔案清理。
- [ ] API 模式先完成 polling 與取消機制；SSE 為後續選配，Firebase 模式保留 onSnapshot。

### E. 接回前端與 Toggle

- [ ] 依第 14 節保留 repository 介面，加入 Firebase／API adapters，統一資料格式。
- [ ] 建立 API client，設定 `VITE_API_BASE_URL` 並附上 Firebase ID token；集中處理失敗與取消請求。
- [ ] 新增 backend store 與 Header Toggle，預設 Firebase、保存模式、重新載入切換；API 未完成時停用選項。
- [ ] 清除或隔離跨模式快取、持久化業務資料與即時監聽，保留共用登入 session。
- [ ] 有未儲存表單或進行中的寫入時阻止切換；API 失敗不自動改寫另一套資料庫。
- [ ] 以相同 Firebase 帳號準備兩邊 profile 與權限，提示兩種模式使用獨立展示資料。
- [ ] 驗證 Firebase 原有功能與 API 完整展示流程，再開放 Toggle。

### F. 驗證、部署與展示

- [ ] 執行商業規則單元測試、真實 PostgreSQL 整合測試、權限與併發訂位測試。
- [ ] 完成兩種模式的搜尋 → 訂位 → 查看／取消訂位，以及收藏／評論／文章操作的 E2E 驗證。
- [ ] 驗證重新整理、跨頁、API 中斷、失效 token、切回 Firebase 與手機操作。
- [ ] 建立所選語言的 CI：格式／靜態檢查、測試、建置與容器映像；前後端各自執行。
- [ ] 選定部署平台與 PostgreSQL 服務；AWS 詳細方案見第 13 節，非完成本機 demo 的必要前提。
- [ ] 在部署環境設定 HTTPS、CORS、資料庫 migrations、secrets、最小權限、日誌與 readiness。
- [ ] 執行 staging smoke test，再設定前端 API URL 並重新建置，驗證公開展示網址。
- [ ] 驗證資料庫備份與還原、部署回退流程；記錄成本與展示環境限制。
- [ ] 補齊兩個專案 README、架構圖、ERD、API 文件、測試方式與 demo 操作稿。
- [ ] 展示 Firebase／自建 API 切換、請求流向、PostgreSQL 寫入與權限防護，說明共用 Auth／Storage 及不自動同步的範圍。

官方參考：[FastAPI 功能與 OpenAPI](https://fastapi.tiangolo.com/features/)、[Spring REST 指南](https://spring.io/guides/gs/rest-service/)、[Spring Boot SQL 整合](https://docs.spring.io/spring-boot/reference/data/sql.html)。

## 1. 現況摘要

目前專案是 React 18 + Vite SPA，主要外部服務如下：

| 現有服務 | 目前用途 | 相關程式位置 | 後端化方向 |
| --- | --- | --- | --- |
| Firebase Authentication | Email/password、Google 登入、session | `src/services/auth/` | 第一階段保留，API 驗證 Firebase ID token |
| Firestore | 使用者、店家、分類、訂位、桌位、營業時間、收藏、評論、文章 | `src/services/repositories/` | 保留；自建 API 模式另外使用 PostgreSQL |
| Firestore `onSnapshot` | 店家排程、使用者訂位等即時更新 | repositories 中的 `subscribe*` | Firebase 模式保留；API 模式先重新抓取/短輪詢，再加入 SSE |
| Supabase Storage | 使用者、店家、文章圖片 | `src/services/storage/imageStorage.js` | 初期兩種模式共用；S3 作為後續選配 |
| Firebase Hosting | React SPA | `firebase.json` | 可暫時保留；AWS 版改用 S3 + CloudFront |
| Google Maps APIs | 地址、地圖與搜尋顯示 | `src/services/maps/` | 瀏覽器需要的 Maps API 保留；需保護 key 與限制來源 |

目前沒有發現 Supabase Database；Supabase 只負責圖片儲存。

## 2. 目標與非目標

### 目標

- [ ] 保留 Firebase 模式，透過統一 repository 介面切換至自建 API 模式。
- [ ] 自建 API 的商業規則、輸入驗證與權限判斷在後端執行；Firebase 模式仍須由 security rules 保護資料。
- [ ] 使用 PostgreSQL constraints 與 transactions 保護資料一致性。
- [ ] 提供 OpenAPI 文件、一致錯誤格式與自動化測試。
- [ ] 使用 Docker 建立一致的本機及部署環境。
- [ ] 可部署到 AWS，具備日誌、監控、備份與回復方案。
- [ ] 同一套前端展示兩種後端，逐功能完成 API adapter，保留原有功能。

### 第一版非目標

- [ ] 不拆微服務。
- [ ] 不導入 Kubernetes。
- [ ] 不一開始重寫 Firebase Authentication。
- [ ] 不立即加入 Redis、Kafka 等沒有明確需求的元件。
- [ ] 不保證大型平台等級的多區域容錯。

## 3. 建議技術決策

| 項目 | 建議 | 原因 |
| --- | --- | --- |
| 架構 | 模組化單體 Modular Monolith | 適合目前規模，交易與除錯較簡單，也能展示清楚邊界 |
| Runtime | Node.js LTS | 與前端技術一致 |
| 語言 | TypeScript strict mode | 提前發現型別錯誤，適合作品與團隊協作 |
| Framework | Fastify 或 NestJS | Fastify 輕量；NestJS 結構明確。擇一，不要並用 |
| Database | PostgreSQL | 適合訂位、關聯、交易與唯一性限制 |
| ORM | Prisma 或 Drizzle | 提供 migration 與型別；仍需理解 SQL |
| Validation | Zod（Fastify）或 DTO/class-validator（NestJS） | 後端執行時驗證 request |
| API | REST + OpenAPI | 符合目前前端需求，易測試與展示 |
| Realtime | 第一版 polling，第二版 SSE | 店家排程多為 server-to-client 更新，SSE 足夠且比 WebSocket 簡單 |
| Auth | Firebase Admin 驗證 ID token | 先降低自建密碼與 token 的安全風險 |
| Image | S3 presigned URL | 前端不取得 AWS secret，圖片不必經過 API server 轉傳 |
| Test | Vitest/Jest + HTTP test client + 測試 PostgreSQL | 驗證真實 API、權限與 transaction |
| API docs | OpenAPI/Swagger | 作為前後端契約及履歷證據 |

建議獨立建立 `waiting-for-eat-backend` repository；前端透過 HTTP 呼叫，因此 Python、Java 或 Node.js 都能使用。上表與下方 TypeScript 目錄是 Node.js 路線的參考範例，不是必須採用的技術。Python／Java 路線以第 0 節對應工具替換 runtime、ORM、validation、test 與建置指令，沿用相同 API 與資料模型。

後文 `backend/` 代表獨立後端專案根目錄，不表示必須在本前端 repository 建立子目錄。兩個專案應各自有 `.git`，不要在未確認 Git 根目錄前建立巢狀 repository；前端既有 `src/` 結構保留。

## 4. 目標架構

```text
React / Vite
    │ HTTPS + JSON + Firebase ID token
    ▼
Node.js TypeScript API
    ├─ Auth middleware（Firebase Admin）
    ├─ Validation / Authorization
    ├─ Users module
    ├─ Restaurants module
    ├─ Reservations module
    ├─ Favorites module
    ├─ Reviews module
    ├─ Posts module
    ├─ Uploads module
    └─ PostgreSQL
          │
          └─ Outbox / event（需要即時通知時）

圖片：React ── presigned URL ──> S3
即時：React <── SSE / polling ── API
```

### 建議目錄

```text
backend/
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ config/
│  ├─ common/
│  │  ├─ errors/
│  │  ├─ auth/
│  │  ├─ validation/
│  │  ├─ logging/
│  │  └─ pagination/
│  ├─ modules/
│  │  ├─ users/
│  │  ├─ restaurants/
│  │  ├─ reservations/
│  │  ├─ favorites/
│  │  ├─ reviews/
│  │  ├─ posts/
│  │  └─ uploads/
│  └─ infrastructure/
│     ├─ database/
│     ├─ firebase/
│     ├─ storage/
│     └─ observability/
├─ migrations/
├─ test/
│  ├─ factories/
│  ├─ integration/
│  └─ e2e/
├─ Dockerfile
├─ package.json
├─ tsconfig.json
└─ .env.example
```

每個業務模組可包含：

```text
reservations/
├─ reservation.routes.ts
├─ reservation.controller.ts
├─ reservation.schemas.ts
├─ reservation.service.ts
├─ reservation.repository.ts
├─ reservation.types.ts
└─ reservation.service.test.ts
```

責任分配：

- [ ] Route/controller：HTTP input/output，不放主要商業規則。
- [ ] Schema：驗證 path、query、body 與 response。
- [ ] Service：權限、交易與商業規則。
- [ ] Repository：SQL/ORM 存取，不處理 HTTP。
- [ ] Infrastructure：Firebase、S3、log 等外部系統 adapter。

## 5. 身分與權限模型

### 第一階段登入流程

- [ ] React 繼續使用 Firebase Authentication 登入。
- [ ] 前端取得 Firebase ID token。
- [ ] API client 傳送 `Authorization: Bearer <id-token>`。
- [ ] 後端使用 Firebase Admin SDK 驗證 token。
- [ ] 後端以 token 的 `uid` 查詢 `users.firebase_uid`。
- [ ] Request context 只使用後端取得的 user ID 與 role。

不可相信前端傳入的 `userId`、`companyId` 或 `role` 來判斷權限。

### 角色

| 角色 | 主要權限 |
| --- | --- |
| Guest | 搜尋、讀取公開店家、公開文章及評論 |
| Diner | 管理本人資料、收藏、建立/取消本人訂位、撰寫本人評論與文章 |
| Boss | 管理自己擁有的店家、桌位、營業時間及該店訂位 |
| Admin（選用） | 稽核與處理違規內容；第一版可不提供 UI |

### 關鍵授權規則

- [ ] `users.id` 必須等於目前登入使用者，除非是允許公開的 profile 欄位。
- [ ] boss 必須存在 `restaurant_owners(user_id, restaurant_id)` 才能管理店家。
- [ ] diner 只能讀取、取消自己的 reservation。
- [ ] boss 只能更新自己店家的 reservation 狀態與排程。
- [ ] review/post 的作者才能修改或刪除內容。
- [ ] review 必須對應已完成且屬於該 diner 的 reservation。
- [ ] 每個 reservation 最多一則 review 與一篇 food diary（若業務規則如此）。
- [ ] 上傳路徑由後端依目前使用者與用途產生，不能讓前端任意指定 bucket key。

## 6. PostgreSQL 資料模型草案

正式實作前，需先匯出 Firestore 樣本資料確認所有欄位與型別。以下是根據現有 repository 與頁面功能提出的關聯式模型。

| Table | 關鍵欄位 | 重要限制／索引 |
| --- | --- | --- |
| `users` | `id`, `firebase_uid`, `email`, `name`, `gender`, `phone`, `avatar_url`, `role` | `firebase_uid UNIQUE`, `email UNIQUE`, role CHECK |
| `restaurants` | `id`, `name`, `city`, `district`, `address`, `phone`, `category_id`, `description`, `menu`, `rating_average`, `rating_count` | 搜尋欄位 indexes；名稱不一定要全域唯一 |
| `restaurant_owners` | `restaurant_id`, `user_id` | 複合 PK/UNIQUE，兩個 FK |
| `categories` | `id`, `name`, `type` | `name UNIQUE` |
| `opening_times` | `id`, `restaurant_id`, `weekday/date`, `start_time`, `end_time`, `capacity` | FK；時間範圍 CHECK |
| `restaurant_tables` | `id`, `restaurant_id`, `table_number`, `capacity`, `active` | `(restaurant_id, table_number) UNIQUE` |
| `reservations` | `id`, `restaurant_id`, `diner_id`, `table_id`, `start_at`, `end_at`, `party_size`, `status`, `version` | 時間與狀態 indexes；status CHECK；用 transaction 防超額 |
| `favorites` | `id`, `user_id`, `restaurant_id`, `status` | `(user_id, restaurant_id) UNIQUE`, status CHECK |
| `reviews` | `id`, `reservation_id`, `restaurant_id`, `author_id`, `rating`, `comment`, timestamps | `reservation_id UNIQUE`, rating CHECK 1–5 |
| `posts` | `id`, `reservation_id`, `restaurant_id`, `author_id`, `title`, `content`, timestamps | 視規則設定 `reservation_id UNIQUE`；作者與店家 indexes |
| `media_objects` | `id`, `owner_id`, `purpose`, `object_key`, `mime_type`, `size`, `status` | `object_key UNIQUE`，追蹤待上傳/完成/刪除 |
| `audit_logs` | `id`, `actor_id`, `action`, `resource_type`, `resource_id`, `metadata`, `created_at` | actor/resource/time indexes；只新增不修改 |

### Firestore 到 PostgreSQL 對照

| Firestore | PostgreSQL |
| --- | --- |
| `user/{userId}` | `users` |
| `company/{companyId}` | `restaurants` + `restaurant_owners` |
| `category/{categoryId}` | `categories` |
| `company/{companyId}/openTime/{timeId}` | `opening_times` |
| `company/{companyId}/table/{tableId}` | `restaurant_tables` |
| `order/{orderId}` | `reservations` |
| `favorite/{favoriteId}` | `favorites` |
| `star/{starId}` | `reviews` |
| `post/{postId}` | `posts` |

### 資料模型需改善的地方

- [ ] 將現有 `attend: "yes"/"no"` 改為明確狀態：`pending`、`confirmed`、`completed`、`cancelled`、`no_show`。
- [ ] 日期與時間改成有時區的 timestamp；API 使用 ISO 8601，資料庫使用 `timestamptz`。
- [ ] `rating_average` 與 `rating_count` 必須在同一 transaction 更新，或由查詢/背景工作重新計算。
- [ ] favorite 的 `like/dislike/eaten` 若可同時成立，應拆成欄位或獨立關係；若互斥才保留單一 status。
- [ ] menu 若需查詢、排序或管理單品，應拆成 `menu_items`；若只是整份展示，可先用 JSONB。
- [ ] 所有 table 都使用 server 產生的 `created_at`、`updated_at`。

## 7. REST API 草案

Base path：`/api/v1`

### System

| Method | Endpoint | Auth | 用途 |
| --- | --- | --- | --- |
| GET | `/health/live` | Public | process 是否存活 |
| GET | `/health/ready` | Internal/LB | DB 等依賴是否可服務 |
| GET | `/docs` | 依環境限制 | Swagger UI |

### Current user

| Method | Endpoint | Auth | 用途 |
| --- | --- | --- | --- |
| GET | `/me` | Login | 取得本人資料與角色 |
| POST | `/me/profile` | Login | Firebase 首次登入後建立 application profile |
| PATCH | `/me/profile` | Login | 修改本人允許欄位 |

不要設計成前端任意操作 `/users/:userId`；本人資源優先使用 `/me`。

### Restaurants and search

| Method | Endpoint | Auth | 用途 |
| --- | --- | --- | --- |
| GET | `/restaurants` | Public | 搜尋、篩選、排序、cursor/page 分頁 |
| GET | `/restaurants/:restaurantId` | Public | 店家公開資訊 |
| POST | `/restaurants` | Boss | 建立店家並建立 owner 關係 |
| PATCH | `/restaurants/:restaurantId` | Owner | 修改店家資料 |
| GET | `/categories` | Public | 取得分類 |

Query 範例：

```http
GET /api/v1/restaurants?city=台北市&category=火鍋&q=王&page=1&pageSize=20
```

### Opening times and tables

| Method | Endpoint | Auth | 用途 |
| --- | --- | --- | --- |
| GET | `/restaurants/:id/opening-times` | Public | 顯示可訂時間 |
| POST | `/restaurants/:id/opening-times` | Owner | 新增營業/可訂時段 |
| PATCH | `/restaurants/:id/opening-times/:timeId` | Owner | 修改時段 |
| DELETE | `/restaurants/:id/opening-times/:timeId` | Owner | 刪除未被使用的時段 |
| GET | `/restaurants/:id/tables` | Owner | 店家桌位列表 |
| POST | `/restaurants/:id/tables` | Owner | 新增桌位 |
| PATCH | `/restaurants/:id/tables/:tableId` | Owner | 修改桌位或停用 |
| DELETE | `/restaurants/:id/tables/:tableId` | Owner | 刪除未被引用的桌位；否則改停用 |

### Reservations

| Method | Endpoint | Auth | 用途 |
| --- | --- | --- | --- |
| GET | `/restaurants/:id/availability` | Public | 查詢日期、人數的可訂時段 |
| POST | `/reservations` | Diner | 建立訂位 |
| GET | `/me/reservations` | Diner | 本人的訂位列表 |
| GET | `/restaurants/:id/reservations` | Owner | 店家訂位排程 |
| GET | `/reservations/:id` | Diner/Owner | 依資源關係取得訂位 |
| PATCH | `/reservations/:id/schedule` | Owner | 調整時間與桌位，使用 version 防覆蓋 |
| PATCH | `/reservations/:id/status` | Diner/Owner | 依狀態機執行確認、取消、完成等動作 |
| GET | `/restaurants/:id/reservations/stream` | Owner | 第二階段 SSE 排程更新 |

建立訂位必須在 transaction 中完成：

- [ ] 驗證店家、時間、人數與使用者。
- [ ] 鎖定或以一致性策略讀取該時段容量。
- [ ] 檢查桌位/容量與重疊訂位。
- [ ] 建立 reservation。
- [ ] 寫入必要 audit/outbox event。
- [ ] Commit 後回傳 `201 Created`。

不能採用「先查有空位，再在另一個獨立 request 寫入」的方式，否則併發時會超額。

### Favorites

| Method | Endpoint | Auth | 用途 |
| --- | --- | --- | --- |
| GET | `/me/favorites?status=like` | Diner | 取得本人收藏/不喜歡/吃過列表 |
| PUT | `/me/favorites/:restaurantId` | Diner | 建立或更新狀態，可安全重送 |
| DELETE | `/me/favorites/:restaurantId` | Diner | 移除狀態 |

### Reviews

| Method | Endpoint | Auth | 用途 |
| --- | --- | --- | --- |
| GET | `/restaurants/:id/reviews` | Public | 店家評論分頁 |
| GET | `/me/reviews` | Diner | 本人的評論 |
| POST | `/reservations/:reservationId/review` | Diner | 對已完成的本人訂位建立評論 |
| PATCH | `/reviews/:reviewId` | Author | 修改本人評論 |
| DELETE | `/reviews/:reviewId` | Author/Admin | 刪除並重新計算評分 |

### Posts / food diary

| Method | Endpoint | Auth | 用途 |
| --- | --- | --- | --- |
| GET | `/posts/:postId` | Public | 公開文章 |
| GET | `/restaurants/:id/posts` | Public | 店家相關文章 |
| GET | `/me/posts` | Diner | 本人的文章 |
| POST | `/reservations/:reservationId/post` | Diner | 對本人已完成訂位建立文章 |
| PATCH | `/posts/:postId` | Author | 修改文章 |
| DELETE | `/posts/:postId` | Author/Admin | 刪除文章 |

富文字必須決定保存格式，並在顯示前消毒，避免 stored XSS。

### Uploads

| Method | Endpoint | Auth | 用途 |
| --- | --- | --- | --- |
| POST | `/uploads/presign` | Login | 驗證用途、MIME、大小後產生短效 presigned URL |
| POST | `/uploads/:uploadId/complete` | Owner | 驗證 S3 object 後標記完成 |
| DELETE | `/uploads/:uploadId` | Owner | 移除本人未被使用的圖片 |

後端需產生 object key，例如 `users/{userId}/avatar/{uuid}.webp`，而不是讓前端任意指定路徑。

## 8. Response、錯誤與分頁規格

成功：

```json
{
  "data": {
    "id": "..."
  }
}
```

錯誤：

```json
{
  "error": {
    "code": "RESERVATION_SLOT_FULL",
    "message": "此時段已額滿",
    "requestId": "req_...",
    "fields": {}
  }
}
```

列表：

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 0
  }
}
```

規則：

- [ ] 只回傳前端需要的欄位，避免直接 serialize 完整 DB record。
- [ ] 錯誤 code 穩定，message 可以本地化。
- [ ] production 不回傳 stack trace、SQL、secret 或第三方原始錯誤。
- [ ] 每個 response 帶 request ID header，方便查 log。

## 9. 安全要求

- [ ] HTTPS only；proxy 後正確處理 forwarded headers。
- [ ] Firebase ID token 完整驗證，不只 decode。
- [ ] 所有非公開 endpoint 採 deny-by-default。
- [ ] 每個 `:id` 都做 object-level authorization。
- [ ] Request body 使用 allowlist schema，拒絕 mass assignment。
- [ ] Search、login、reservation、upload 分別設定 rate limit。
- [ ] CORS 只允許已知前端 origin；但不把 CORS 當 Auth。
- [ ] ORM/parameterized SQL，禁止拼接使用者輸入。
- [ ] 富文字 sanitize，避免 stored XSS。
- [ ] 上傳檢查 MIME、magic bytes、大小、數量及副檔名。
- [ ] S3 bucket private，以 presigned URL/CloudFront 存取。
- [ ] Secrets 不進 Git、image、前端或 log。
- [ ] Log 遮蔽 token、email、phone 等敏感資料。
- [ ] Dependency、secret、SAST、container image 定期掃描。
- [ ] 關鍵管理操作寫入 audit log。

## 10. 測試計畫

### Unit tests

- [ ] 訂位狀態轉換。
- [ ] 時間範圍與營業時間驗證。
- [ ] 桌位與容量計算。
- [ ] 權限 policy。
- [ ] 評分重新計算。
- [ ] 上傳用途、MIME 與大小驗證。

### Integration tests

- [ ] API 使用獨立 PostgreSQL 測試資料庫。
- [ ] Migration 能從空資料庫完整執行。
- [ ] 每個 endpoint 測成功、輸入錯誤、未登入、無權限與不存在。
- [ ] Diner A 無法讀寫 Diner B 的 profile、訂位、收藏、評論或文章。
- [ ] Boss A 無法管理 Boss B 的餐廳、桌位、時段與訂位。
- [ ] 重複 favorite 不產生兩筆資料。
- [ ] 同一 reservation 不能建立兩則 review。
- [ ] 兩個並發訂位不會超過容量。
- [ ] 更新 review 失敗時，restaurant rating 不會留下半套資料。

### E2E tests

至少完成：

- [ ] Diner 登入 → 搜尋店家 → 查詢空位 → 建立/取消訂位。
- [ ] Boss 登入 → 管理時段與桌位 → 查看/更新訂位。
- [ ] Diner 完成用餐 → 建立評論與 food diary → 店家頁顯示。
- [ ] 圖片 presign → 上傳 → complete → 顯示。

### 非功能測試

- [ ] 對店家搜尋與熱門時段建立訂位進行 load test。
- [ ] 測試 DB 中斷、S3 失敗與 Firebase 驗證失敗。
- [ ] 測試 graceful shutdown 不接受新 request，並完成進行中的 request。
- [ ] 執行備份還原演練，不只確認備份檔存在。

## 11. Docker 本機環境

### 必要容器

```text
docker compose
├─ api
└─ postgres
```

Redis、Mailpit 等等只有加入對應功能時才新增。

### Dockerfile 要求

- [ ] Multi-stage build。
- [ ] 固定 Node major/minor 或 digest 策略。
- [ ] 只複製 production 必要檔案。
- [ ] 使用 non-root user。
- [ ] 設定 production `NODE_ENV`。
- [ ] 提供 health check 或交由平台呼叫 readiness endpoint。
- [ ] 不將 `.env` 或 secrets COPY 進 image。
- [ ] 正確處理 `SIGTERM` 與 graceful shutdown。

### Docker Compose 驗收

- [ ] `docker compose up` 可啟動 API 與 PostgreSQL。
- [ ] migration 與 seed 有明確指令。
- [ ] `.env.example` 列出必要變數但沒有真實秘密。
- [ ] volume 保存本機資料；測試環境可建立乾淨 DB。
- [ ] API readiness 在 DB 可用後才成功。

## 12. CI/CD 流程

### Pull Request CI

- [ ] 安裝固定版本 dependencies。
- [ ] Format check。
- [ ] ESLint。
- [ ] TypeScript type check。
- [ ] Unit tests。
- [ ] 啟動測試 PostgreSQL並執行 migrations。
- [ ] Integration tests。
- [ ] Build application。
- [ ] Dependency、secret 與 SAST scan。
- [ ] Build Docker image 並進行 image scan。

### 部署流程

```text
PR merge
  ↓
建立不可變 Docker image（commit SHA tag）
  ↓
Push ECR
  ↓
部署 Staging
  ↓
執行 migration + smoke/E2E test
  ↓
人工 approval
  ↓
部署 Production
  ↓
觀察 health、5xx、latency、DB connections
  ↓
成功完成，或符合條件時 rollback
```

Database migration 應盡量向下相容，例如先新增 nullable 欄位、部署可同時讀新舊 schema 的程式、回填資料，最後才移除舊欄位。

## 13. AWS 部署藍圖

### 元件

| 元件 | AWS 服務 | 設定重點 |
| --- | --- | --- |
| React 靜態網站 | S3 + CloudFront | S3 private origin、HTTPS、SPA fallback |
| DNS/憑證 | Route 53 + ACM | `app` 與 `api` 子網域 |
| API ingress | ALB | HTTPS、target health check、合理 idle timeout |
| API runtime | ECS Fargate | Private subnet、non-root container、autoscaling |
| Container registry | ECR | SHA tag、scan、lifecycle policy |
| Database | RDS PostgreSQL | Private subnet、automated backup、encryption、connection limit |
| Images | S3 + CloudFront | private bucket、presigned upload、lifecycle rule |
| Secrets | Secrets Manager/SSM | DB credential、Firebase Admin 設定、rotation |
| Logs/metrics | CloudWatch | JSON logs、dashboard、alarms、retention |
| Email/background work（後續） | SQS + worker/SES | retry、DLQ、idempotency |

### 網路與權限

- [ ] ALB 在 public subnets，API tasks 與 RDS 在 private subnets。
- [ ] RDS security group 只允許 API task security group。
- [ ] ECS task 使用 IAM role 存取指定 S3 path、Secrets 與 logs。
- [ ] CI 使用 OIDC assume role，避免保存長效 AWS access key。
- [ ] 開發者不要直接公開連接 production RDS；使用受控通道或管理流程。
- [ ] 開啟 encryption at rest 與 in transit。

### 監控與告警

- [ ] API request count、p50/p95/p99 latency、4xx、5xx。
- [ ] ECS CPU、memory、task restart、unhealthy target。
- [ ] RDS CPU、storage、connections、slow queries、replication/backup 狀態。
- [ ] S3 upload errors 與異常流量。
- [ ] Firebase token verification error rate。
- [ ] 告警要附 runbook，說明如何確認、緩解與回復。

### 成本控制

- [ ] 建立 AWS Budget/Billing alarm。
- [ ] 開發環境不用模擬大型高可用架構。
- [ ] 先估算 ALB、NAT Gateway、RDS 的固定成本。
- [ ] Staging 可設定排程停止非必要資源，但 production 不可隨意停止。
- [ ] 若作品預算有限，可先在其他容器平台部署 API；文件仍保留 AWS 架構與取捨說明。

## 14. 雙後端 Toggle 與展示實作步驟

本節優先於後續階段中的「改走 API」描述：所有 API 整合只套用在自建 API 模式，Firebase 模式與原有功能必須保留。自建後端同時作為展示與備案，不強制遷移。

### 按鈕位置與程式職責

在全站共用 `src/components/Header/index.jsx` 的登入／會員選單旁，掛載新的 `src/components/BackendToggle/index.jsx`，顯示「後端：Firebase ｜ 自建 API」，桌面與手機版都應清楚顯示目前模式。

| 規劃位置 | 職責 |
| --- | --- |
| `src/components/BackendToggle/index.jsx` | 顯示模式與處理切換操作 |
| `src/stores/backendStore.js` | 使用 Zustand 保存 `firebase`／`api`，預設 Firebase |
| `src/services/api/apiClient.js` | 統一 API URL、Firebase ID token 與 HTTP 錯誤處理 |
| `src/services/repositories/` | 保留頁面既有介面，依模式選擇 adapter |
| `src/services/repositories/firebase/` | 保存現有 Firestore 實作 |
| `src/services/repositories/api/` | 呼叫自建 API，轉換為頁面既有資料格式 |

資料流：頁面 → repository 統一介面 → Firebase／API adapter → Firestore／自建 API + PostgreSQL。

按鈕只選擇模式，資料來源判斷集中在 services 層。初期兩種模式共用 Firebase Authentication 與 Supabase Storage；切換的是業務資料來源，不代表登入與圖片服務一起更換。

### Toggle 實作順序

- [ ] 盤點所有 repository 方法，記錄參數、回傳格式、錯誤與訂閱取消方式，包含 ID、日期、空值等資料契約。
- [ ] 將既有實作整理至 Firebase adapter，保留原匯出介面，先驗證原功能正常。
- [ ] 建立自建 API、PostgreSQL 與 Firebase token 驗證，再依功能加入 API adapter。後端自行驗證使用者身分與資料權限。
- [ ] 建立 API client，以 `VITE_API_BASE_URL` 設定網址；瀏覽器環境變數不可放後端 secrets。
- [ ] 為兩個資料庫建立內容相近的合成展示資料；以相同 Firebase UID 對應帳號，準備各自的 profile、角色與店家／訂位關聯 ID。
- [ ] 建立 backend store，預設 `firebase`，以 localStorage 記住選擇；未知值回到 Firebase。必須在開始查詢前讀取模式。
- [ ] 建立 Toggle 並掛入 Header，提供文字標籤與鍵盤操作。API 尚未完成完整展示流程前，選項停用並標示「開發中」。可用 `VITE_ENABLE_BACKEND_TOGGLE` 控制展示入口，但不可將此旗標當成權限保護。
- [ ] 第一版採「保存模式後重新載入頁面」，重新建立請求與監聽；切換期間禁止連點。有未儲存表單或送出中的寫入時，阻止切換並說明原因。
- [ ] 盤點 Zustand persist、localStorage 與其他快取，清除業務資料或按模式分開保存，保留共用登入 session。載入新模式前不可顯示舊模式資料。
- [ ] 依序完成使用者與店家、時段與桌位、訂位、收藏、評論與文章的 API adapter，再補 polling／SSE。每個訂閱方法提供取消函式，頁面卸載時解除監聽與計時器。
- [ ] 兩種模式完整驗證後才開放切換。API 無法連線時顯示錯誤，提供手動切回 Firebase 的操作；不可自動將失敗寫入重送到另一套後端。

### 展示與備案範圍

第一版兩套資料庫獨立，不做雙寫或自動同步。在 Firebase 建立的訂位不會自動出現在 PostgreSQL，反向亦然；切換區應提示「兩種模式使用獨立展示資料」。尚未完成的 API 功能不可悄悄回到 Firebase，避免混用資料來源。

備案不等於故障時能立即接手正式流量。若未來要正式接手，需另行完成資料同步、ID 對照、校驗、切換與回復演練。本計畫不停止 Firestore／Supabase 寫入，也不移除既有 SDK。

### Toggle 完成檢查

- [ ] 首次開啟預設 Firebase，重新整理後記住選擇。
- [ ] 桌面與手機 Header 均顯示正確模式。
- [ ] Firebase 原有功能完整保留。
- [ ] 兩種模式都能完成搜尋、訂位、查看訂位與收藏等展示流程。
- [ ] 切換後沒有舊模式快取、持久化資料或監聽混入。
- [ ] 切換不會造成表單遺失或重複送出寫入。
- [ ] API 中斷可顯示明確錯誤並手動切回 Firebase。
- [ ] 兩種模式均驗證未登入、無權限與跨店家操作；API 訂位通過併發測試。
- [ ] Demo 說明共用 Auth／Storage 與獨立資料庫的範圍。

### 展示資料準備

以下為準備自建 API 資料的參考步驟；匯出真實資料時須先去識別化，展示以合成資料為主。

- [ ] 匯出 Firestore 所有 collections/subcollections。
- [ ] 保存文件 ID，建立舊 ID 到新 UUID 的 mapping。
- [ ] 統計每個 collection 筆數、空值、型別差異與孤兒 reference。
- [ ] 備份 Supabase object list 與必要 metadata。
- [ ] 為現有 Firebase/Supabase 設定加上正確 security rules。
- [ ] 在 frontend 建立統一 API client 與 feature flag。

### 建議 API 功能實作順序

- [ ] Health、logging、error format、OpenAPI。
- [ ] Auth middleware 與 `/me`。
- [ ] Categories 與 restaurants 公開唯讀搜尋。
- [ ] Users/profile。
- [ ] Boss restaurant 管理。
- [ ] Opening times 與 tables。
- [ ] Reservations；這是最高風險，需要 transaction 與 concurrency tests。
- [ ] Favorites。
- [ ] Reviews 與 rating transaction。
- [ ] Posts/food diary 與富文字安全。
- [ ] 保留共用 Supabase Storage，S3 為後續選配。
- [ ] Realtime subscriptions 改為 polling/SSE。
- [ ] 驗證兩種模式的完整展示流程。
- [ ] 保留現有 SDK 與 Firebase／Supabase 讀寫路徑。

### 每個功能的切換方式

- [ ] 先完成新 DB schema、API 與 tests。
- [ ] 建立該功能的展示資料與關聯 ID。
- [ ] 在 staging 比對新舊查詢結果。
- [ ] 前端以 feature flag 切換新 API。
- [ ] 小範圍觀察錯誤與資料差異。
- [ ] 確認兩種模式均可正常操作，寫入各自的資料庫。
- [ ] 保留 Firebase 路徑，確認可以手動切回。

第一版不做雙寫；將來需要同步時再獨立設計失敗補償與資料一致性策略。

## 15. 分階段實作與完成條件

### Phase 0：設計與專案骨架

- [ ] 建立 `backend/` TypeScript 專案。
- [ ] 選定 Fastify 或 NestJS、Prisma 或 Drizzle。
- [ ] 建立 Dockerfile、Compose PostgreSQL 與 `.env.example`。
- [ ] 完成 `/health/live`、`/health/ready`。
- [ ] 加入 structured logger、request ID、global error handler。
- [ ] 建立 CI 的 lint、type check、test、build。
- [ ] 建立 OpenAPI。

完成定義：新開發者依 README 能在乾淨環境一個指令啟動並呼叫 health API。

### Phase 1：Auth 與 Users

- [ ] Firebase Admin middleware。
- [ ] `/me` profile API。
- [ ] users migration 與 repository/service。
- [ ] Authentication/authorization integration tests。
- [ ] 前端 profile 改走 API。

完成定義：偽造、過期或缺少 token 會被拒絕；A 無法修改 B。

### Phase 2：Restaurants 與 Search

- [ ] categories、restaurants、owners schema。
- [ ] 公開搜尋、篩選、排序與分頁。
- [ ] Boss 建立/修改本人店家。
- [ ] 常用查詢 indexes 與 EXPLAIN 紀錄。
- [ ] 前端 Search/Restaurant/Boss Info 改走 API。

完成定義：公開資料無敏感欄位；只有 owner 能修改店家。

### Phase 3：Opening Times、Tables、Reservations

- [ ] 時段、桌位、訂位 schema 與狀態機。
- [ ] Availability API。
- [ ] Transactional reservation creation。
- [ ] Owner schedule update + optimistic locking/version。
- [ ] Concurrent integration/load tests。
- [ ] 前端 Reserve、ReservedShop、Boss Schedule 改走 API。

完成定義：併發 request 不會超額；所有跨使用者與跨店家操作被拒絕。

### Phase 4：Favorites、Reviews、Posts

- [ ] 唯一限制與 owner policies。
- [ ] 評論與店家平均評分 transaction。
- [ ] 完成訂位才能評論/發文的規則。
- [ ] 富文字 sanitize。
- [ ] 對應前端頁面改走 API。

完成定義：重送不產生重複資料；評分與內容資料保持一致。

### Phase 5：Images 與 Realtime

- [ ] S3 private bucket 與 presigned upload flow。
- [ ] media metadata、完成確認與孤兒檔案清理。
- [ ] 先 polling，再視需要實作 SSE。
- [ ] 驗證檔案型別、大小、用途與 ownership。
- [ ] 保留共用 Supabase upload；S3 為選配，不移除既有圖片功能。

完成定義：前端沒有 AWS secret，使用者不能覆寫或刪除別人的圖片。

### Phase 6：AWS 與營運

- [ ] ECR、ECS Fargate、ALB、RDS、S3、CloudFront。
- [ ] Secrets Manager/SSM 與 IAM least privilege。
- [ ] Staging/production pipeline。
- [ ] CloudWatch dashboard、alarms 與 log retention。
- [ ] DB automated backup 與 restore drill。
- [ ] Runbook、rollback 與 incident template。

完成定義：可以從 Git commit 追到 image 與部署版本；故障時能告警、查 log、rollback 並還原資料。

## 16. 公司級 Definition of Done

任何後端功能只有同時符合以下條件才算完成：

- [ ] Acceptance criteria 通過。
- [ ] API/DB/權限設計已 review。
- [ ] Request、response 與錯誤都寫入 OpenAPI。
- [ ] 所有輸入經 schema 驗證。
- [ ] Authentication 與 object/function-level authorization 完成。
- [ ] Migration、constraints 與 indexes 完成。
- [ ] 正常、邊界、未登入、無權限與失敗測試完成。
- [ ] Logs 不含 secrets 或敏感資料。
- [ ] Lint、type check、tests、build、security scans 全部通過。
- [ ] Staging migration 與 smoke/E2E tests 通過。
- [ ] 監控、告警、rollback 與資料回復方式已確認。
- [ ] README/runbook/ADR 等必要文件更新。
- [ ] Production 部署後觀察關鍵 metrics，確認沒有資料差異。

## 17. 求職作品應展示的證據

- [ ] 系統架構圖與 ERD。
- [ ] OpenAPI/Swagger 可操作文件。
- [ ] GitHub Issues、PR 與 code review 紀錄。
- [ ] CI pipeline 執行結果。
- [ ] Unit/integration/E2E 與併發訂位測試。
- [ ] Docker Compose 本機啟動方式。
- [ ] AWS 部署圖、IAM 與網路設計說明。
- [ ] CloudWatch dashboard 或匿名化截圖。
- [ ] 一次 migration/rollback 或 incident 演練紀錄。
- [ ] ADR：為什麼選模組化單體、PostgreSQL、Firebase Auth 過渡、SSE。
- [ ] README 清楚說明限制、未來工作與成本取捨。

面試時必須能解釋：

- [ ] 為什麼不能相信前端傳來的 user ID/role。
- [ ] 為什麼訂位需要 transaction 與 concurrency control。
- [ ] 為什麼使用 unique constraint，而不只先查詢是否存在。
- [ ] 401 與 403 的差異。
- [ ] index 如何加速查詢，以及它的寫入成本。
- [ ] 兩種模式各自負責的資料與權限，以及共用 Firebase Auth／Supabase Storage 的範圍。
- [ ] API、DB 或部署失敗時如何定位、緩解與回復。

## 18. 第一個實作切片

第一個切片不要從最複雜的訂位開始。建議順序：

- [ ] 建立 `backend/`、PostgreSQL、Docker Compose。
- [ ] 實作 health、logger、error handler、OpenAPI。
- [ ] 實作 Firebase token middleware。
- [ ] 建立 `users`、`categories`、`restaurants`、`restaurant_owners`。
- [ ] 實作 `/me`、公開 restaurant list/detail、owner update。
- [ ] 寫 integration tests，包含跨 owner 的 `403`。
- [ ] 將前端 restaurant 搜尋與店家基本資料改走 API。
- [ ] 建立 CI 並部署 staging。

這個切片完成後，再進入訂位模組。這樣能先建立完整交付流程，又不會一開始就同時處理即時更新與高風險併發問題。
