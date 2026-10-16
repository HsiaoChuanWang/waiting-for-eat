# 自建後端 API 學習與遷移路線圖

## 目標

建立自己的後端 API，逐步取代前端直接串接 Supabase 與 Firebase 的資料功能，並學會 HTTP、REST API、資料庫、驗證、授權、測試與部署。

> `headers` 只是傳遞資料的位置，本身不是安全機制。真正的保護包含 HTTPS、token 驗證、權限檢查、輸入驗證、資料庫限制與 rate limiting。

## 建議技術

此專案是 JavaScript 前端，可先採用：

- Node.js + TypeScript
- Express 或 Fastify
- PostgreSQL
- Prisma 或 Drizzle ORM
- Zod 輸入驗證
- Vitest/Jest + Supertest

初期建議保留 Firebase/Supabase Auth，只把資料讀寫搬到自己的 API。熟悉後端安全性後，再評估是否自行維護登入系統。

## 執行步驟

### 1. 盤點現有功能

- [ ] 找出 Supabase/Firebase 初始化檔案與環境變數
- [ ] 列出登入、查詢、CRUD、Storage、Realtime、通知等功能
- [ ] 整理資料表或 collection 的欄位、關聯、索引與權限規則
- [ ] 先遷移簡單 CRUD，登入、檔案與即時功能較晚處理

### 2. 學會 HTTP request/response

- [ ] URL 與 endpoint
- [ ] `GET`、`POST`、`PATCH`、`DELETE`
- [ ] path params、query params、JSON body
- [ ] `Content-Type` 與 `Authorization` headers
- [ ] `200`、`201`、`400`、`401`、`403`、`404`、`409`、`500`

第一個 API：

```http
GET /api/health
```

```json
{ "ok": true }
```

### 3. 建立後端骨架

- [ ] 設定 TypeScript 與環境變數
- [ ] 建立 routes、controllers、services、repositories、database
- [ ] 建立統一錯誤格式與 request logging
- [ ] 設定 CORS，只允許需要的前端來源
- [ ] secrets 不可提交至 Git，也不可放在前端

### 4. 建立 PostgreSQL 資料庫

- [ ] 設計 primary key、foreign key、unique constraint 與 index
- [ ] 加入 `created_at`、`updated_at`
- [ ] 使用 migration 管理 schema 變更
- [ ] 建立本機 seed 測試資料
- [ ] 規劃備份與還原

### 5. 實作第一組 CRUD API

選擇一個簡單且不敏感的資源：

```text
GET    /api/items
GET    /api/items/:id
POST   /api/items
PATCH  /api/items/:id
DELETE /api/items/:id
```

每個 endpoint 都要處理：

- [ ] 輸入 schema 驗證
- [ ] 身分與權限檢查
- [ ] 正確 status code
- [ ] 一致的錯誤回應
- [ ] 分頁與查詢數量上限
- [ ] 自動化測試

### 6. 加入 Authentication 與 Authorization

- Authentication：確認「你是誰」
- Authorization：確認「你能做什麼」

建議第一階段流程：

1. 前端使用 Firebase/Supabase 登入並取得 access token。
2. 前端以 `Authorization: Bearer <token>` 呼叫自建 API。
3. 後端驗證 token 的簽章、issuer、audience 與有效期限。
4. 後端從 token 取得可信任的 user ID。
5. 後端依角色或資料所有權判斷是否允許操作。

不要相信前端 body 傳來的 `userId` 或 `role`。

### 7. 建立 API 契約

- [ ] 使用 OpenAPI/Swagger 描述 endpoints
- [ ] 定義 request/response schema
- [ ] 定義錯誤 code 與 status code
- [ ] 統一日期、時區、nullable 與 enum 格式
- [ ] 後端執行時驗證所有輸入欄位

### 8. 修改前端串接

- [ ] 建立統一 API client
- [ ] base URL 放在環境變數
- [ ] 自動附加 access token
- [ ] 統一處理 `401`、逾時與網路錯誤
- [ ] 一次替換一組 Supabase/Firebase SDK 呼叫
- [ ] 遷移期間保留回退方式

### 9. 測試

- [ ] 測試正常 CRUD
- [ ] 測試未登入、token 過期與錯誤輸入
- [ ] 測試使用者 A 無法存取使用者 B 的資料
- [ ] 測試一般使用者無法呼叫管理員 API
- [ ] 確認日誌不記錄密碼、token 或敏感資料

### 10. 部署與維運

- [ ] 使用 HTTPS
- [ ] 安全保存 secrets
- [ ] CI 執行 lint、type check、test 與 build
- [ ] 設定 health check、日誌、錯誤追蹤與告警
- [ ] 設定資料庫備份並實際測試還原
- [ ] 設定 CORS、rate limit、request body 大小與 timeout

### 11. 資料遷移與切換

- [ ] 備份 Supabase/Firebase 原始資料
- [ ] 撰寫可重複執行的 migration script
- [ ] 驗證資料筆數、關聯與抽樣內容
- [ ] 決定停機遷移或短期雙寫
- [ ] 先讓少量功能使用新 API
- [ ] 穩定後停止舊系統寫入
- [ ] 保留回復期限，最後才移除舊服務與金鑰

## 建議完成順序

1. `/api/health`
2. 一個公開唯讀 API
3. 連接本機 PostgreSQL
4. 第一組 CRUD API
5. 輸入驗證與統一錯誤
6. 驗證 Firebase/Supabase token
7. 限制使用者只能操作自己的資料
8. 前端替換第一組 SDK 呼叫
9. 自動化測試
10. 部署測試環境
11. 逐功能遷移
12. 最後才評估自建登入系統

## 第一個里程碑

- [ ] 前端能呼叫自建 API
- [ ] API 能驗證現有登入 token
- [ ] API 能從 PostgreSQL 讀寫一種資源
- [ ] 使用者只能操作自己的資料
- [ ] request body 有 schema 驗證
- [ ] 有成功、錯誤輸入與無權限測試
- [ ] 已部署至測試環境
- [ ] secrets 沒有出現在前端或 Git 中

## 下一階段

掃描本專案內的 Supabase/Firebase 呼叫，建立：

1. 現有功能與資料模型清單
2. SDK 呼叫至 REST endpoint 的對照表
3. 每個 endpoint 的身分與權限規則
4. 建議的後端目錄結構
5. 第一個可實作的垂直功能切片
6. 不影響現有功能的逐步遷移順序

---

## 什麼才算合格的後端

合格的後端不只是 API 能回傳資料，而是能在不信任前端的前提下，安全、正確、穩定地執行商業規則與管理資料。

### 標準請求流程

```text
前端送出 HTTPS Request
        ↓
解析 request、限制大小、建立 request ID
        ↓
驗證身分 Authentication
        ↓
驗證輸入 Validation
        ↓
檢查權限 Authorization
        ↓
執行商業規則 Service
        ↓
透過 Repository / ORM 操作資料庫
        ↓
Transaction / Constraint 確保一致性
        ↓
回傳固定格式的 Response
        ↓
記錄 log、錯誤與效能資訊
```

### 1. API 契約清楚

每個 endpoint 都要定義：

- HTTP method 與 URL
- path、query、body 欄位
- 欄位型別、必填、長度與允許值
- 哪些身分與角色可以呼叫
- 成功與錯誤 response
- 是否允許安全重試

可使用 OpenAPI/Swagger 管理契約。錯誤格式應保持一致，例如：

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "輸入資料不正確",
    "fields": {}
  }
}
```

### 2. 後端驗證所有輸入

任何人都可以跳過前端直接呼叫 API，因此不能依賴表單驗證。後端需要檢查：

- 必填欄位與資料型別
- 字串長度與數字範圍
- enum、日期與陣列大小
- 分頁與查詢數量上限
- 檔案大小及類型
- 未知或不允許修改的欄位

不可直接把整個 `request body` 傳給 ORM，否則攻擊者可能自行加入 `role: "admin"`。應驗證後明確挑選允許的欄位。

### 3. 正確處理身分與權限

- Authentication：確認呼叫者是誰
- Authorization：確認呼叫者能做什麼

後端應驗證 token 的簽章、issuer、audience、有效期限與撤銷狀態，再依使用者角色、群組或資源所有權決定是否允許操作。

「已登入」不等於「可以操作所有資料」。必須測試使用者 A 無法讀取或修改使用者 B 的資料。

### 4. 商業規則放在後端

例如下列規則不能只靠前端按鈕控制：

- 每人每天只能投票一次
- 已結束的聚餐不能再加入
- 只有建立者可以刪除房間
- 滿額後不能再接受預約

前端可以改善操作體驗，但後端必須重新判斷，避免使用者自行組 request 繞過限制。

### 5. 資料庫保證資料一致

重要規則應同時由資料庫保護：

- Primary key
- Foreign key
- Unique constraint
- Not null / Check constraint
- 合理的 index
- Transaction

例如「同一位使用者對一場活動只能投票一次」，可建立 `UNIQUE(event_id, user_id)`，避免兩個同時到達的 request 產生重複資料。

涉及多筆資料的操作應使用 transaction；其中一步失敗時，整組操作都要回復。

### 6. 錯誤處理可預期

- `200`：成功
- `201`：建立成功
- `204`：成功但沒有 response body
- `400`：輸入錯誤
- `401`：未登入或 token 無效
- `403`：已登入但沒有權限
- `404`：資源不存在
- `409`：資料衝突或重複
- `429`：呼叫過於頻繁
- `500`：未預期的伺服器錯誤

不可將資料庫錯誤或 stack trace 直接交給前端。詳細錯誤留在伺服器日誌，對外只提供安全且穩定的錯誤格式。

### 7. 具備基本安全性

- [ ] 全程使用 HTTPS
- [ ] secrets 與管理員金鑰只存在後端
- [ ] 密碼使用 Argon2id 或 bcrypt 等適合的雜湊方式
- [ ] 使用 ORM 或參數化查詢避免 SQL injection
- [ ] 限制 body、query 與上傳檔案大小
- [ ] 設定 CORS、rate limiting 與 timeout
- [ ] 防止 XSS、CSRF、暴力登入與權限繞過
- [ ] 日誌不記錄密碼、token 或敏感個資
- [ ] 定期更新有漏洞的依賴
- [ ] 資料庫使用最小權限帳號

CORS 不是身分驗證；非瀏覽器程式不受 CORS 限制，API 仍須驗證 token 與權限。

### 8. 能處理重複與併發請求

真實環境會發生連點、網路重試、同時更新及重複 webhook，因此需要依情境使用：

- Idempotency key
- Unique constraint
- Transaction
- Optimistic locking
- 資料版本或狀態檢查

付款、訂單與預約等操作尤其不能因為重試而執行兩次。

### 9. 測試正常與失敗情況

至少包含 service 單元測試、API integration test、資料庫整合測試，以及核心流程的端到端測試。

除了正常成功，也要測試：

- 沒有 token 或 token 過期
- 欄位缺少或格式錯誤
- 沒有權限
- 資源不存在
- 重複資料
- 同時送出兩次
- 資料庫或外部服務失敗

### 10. 可以被觀察與維護

正式後端至少需要：

- 結構化日誌
- 每個 request 的 request ID
- 錯誤追蹤
- 回應時間與錯誤率
- 慢查詢與資料庫連線監控
- Health check 與告警
- 重要管理操作的 audit log

發生問題時，應能查出是哪位使用者、何時呼叫哪個 API、在哪一步失敗，以及是否影響資料。

### 11. 可以安全部署與復原

- [ ] 開發、測試與正式環境分離
- [ ] CI 執行 lint、type check、test、build
- [ ] 使用 database migration
- [ ] 準備部署失敗的回復策略
- [ ] 定期備份並實際測試還原
- [ ] 妥善管理 secrets
- [ ] 支援 graceful shutdown
- [ ] 設定 timeout 與 database connection pool

只有備份、但從未測試能否還原，不能算具備復原能力。

## 本專案的合格第一版標準

第一版不需要微服務，也不需要立刻自建登入。先完成一個完整的垂直功能：

1. 前端使用既有 Firebase/Supabase Auth 登入。
2. 前端帶 access token 呼叫自建 API。
3. API 驗證 token、body 與操作權限。
4. API 透過 transaction 安全讀寫 PostgreSQL。
5. 使用者只能操作自己的資料。
6. 有測試證明正常流程、錯誤輸入與跨使用者存取都被正確處理。
7. 測試環境具備 HTTPS、日誌、監控與資料庫備份。

完成這個端到端流程，比一次建立許多只有 CRUD、沒有權限與測試的 endpoints，更接近一個真正合格的後端。
