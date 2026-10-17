# Waiting for Eat 後端實作指南

依下面順序實作，每一步達到「完成標準」再往下。工具、設定、資料與功能依使用時機安排；最後才使用驗收清單。詳細 schema、API 與部署設計保留在可展開的參考區，遇到對應步驟再查。

本次固定走 Java 21 + Spring Boot + Maven + PostgreSQL。保留 Firebase 模式，另做自建 API 模式；兩種模式共用 Firebase Authentication 與 Supabase Storage，業務資料獨立，不做雙寫或自動同步。

## 目前進度與操作位置

截至 2026-10-18，後端已存在 `.git`、`pom.xml`、Maven Wrapper 與 Spring Boot 程式骨架，pom 設定 Java 21；你已回報 Docker 引擎與 Compose 正常。尚未看到 `compose.yaml`，`application.properties` 只有專案名稱，尚未設定資料庫。

**目前下一步是步驟 3：建立 PostgreSQL。** 步驟 1、2 未確認的工具與版本仍要補驗證；有 `target/` 不代表測試或啟動成功。

- 前端：`C:\Users\user\OneDrive\桌面\Waiting for Eat\waiting-for-eat`
- 後端：`C:\Users\user\OneDrive\桌面\waiting-for-eat-backend`

以下 Maven 與 Docker 指令均在後端根目錄執行。`npm run dev` 是前端指令，不適用於 Java 後端。資料夾已有專案時，不要重新初始化覆蓋。

## 按順序實作

### [ ] 步驟 1：確認開發工具

準備 Git、Temurin JDK 21、IntelliJ IDEA 與 Docker Desktop（Windows 使用 WSL 2）。DBeaver Community 在步驟 3 查資料時使用；Postman 在步驟 5 測 API 時使用。

```powershell
java -version
git --version
docker version
docker compose version
```

完成標準：Java 顯示 21，Git 與 Compose 可執行，Docker 能連到 Server。下載完成不等於 API 已啟動。

### [ ] 步驟 2：初始化並固定後端專案

先確認前端實際 Git 根目錄，在其外建立獨立後端 repository。用 Spring Initializr 選 Java 21、Maven、Jar，group 為 `com.waitingforeat`，package 為 `com.waitingforeat.backend`。選與 Java 21 相容、受支援的 Spring Boot 穩定版，記錄精確版本。

加入 Web MVC、Validation、Security、Data JPA、PostgreSQL Driver、Flyway（含 PostgreSQL 支援）及 Actuator。保留 `mvnw`、`mvnw.cmd`、`.mvn/`；設定 `.gitignore` 排除憑證、真實 `.env`、建置產物與 IDE 個人設定。前後端 README 互連，先寫工具版本與啟動位置。

```powershell
.\mvnw.cmd -v
```

完成標準：有 `pom.xml`、Wrapper、`src/`，Wrapper 使用 Java 21；依賴版本由 Boot 管理，額外函式庫鎖版並確認相容。你已有骨架，從檢查現有內容開始。

### [ ] 步驟 3：建立並啟動 PostgreSQL（目前下一步）

在後端新增 `compose.yaml`，先只放 PostgreSQL 17，設定資料庫名稱、開發帳密、連接埠、持久化 volume 與 `pg_isready` healthcheck。加入不含真實秘密的 `.env.example`，本機 `.env` 不提交 Git；測試資料庫與開發資料庫分開。

```powershell
docker compose up -d
docker compose ps
```

用 DBeaver 依相同連線資訊連線。此時先啟動資料庫；API 容器到步驟 12 再加入。

完成標準：PostgreSQL healthy，能連線並執行查詢；重啟保留資料。失敗時先看 `docker compose logs`，不要先重跑 Spring Boot。

### [ ] 步驟 4：設定資料庫連線與第一次啟動

在 Spring Boot 設定 local／test profile、連接埠與資料庫連線。使用環境變數 `SPRING_PROFILES_ACTIVE`、`SPRING_DATASOURCE_URL`、`SPRING_DATASOURCE_USERNAME`、`SPRING_DATASOURCE_PASSWORD`；本機由 IDE 或 PowerShell 提供。

Spring Boot 不會自動載入一般 `.env`；Compose 的 env file 也只依其注入規則生效。自訂環境變數必須映射到應用程式屬性。準備 Flyway migration 目錄，以版本化 SQL 管理 schema；Hibernate 設定 `ddl-auto=validate`。

保持 PostgreSQL 運作後執行：

```powershell
.\mvnw.cmd spring-boot:run
```

完成標準：看到 `Started WaitingForEatBackendApplication`，程序持續執行，無連線或 migration 錯誤。`BUILD FAILURE` 時找前面的 Description／Caused by；預設 Security 的 401 不代表程序啟動失敗。

### [ ] 步驟 5：完成 API 基礎與測試工具

建立 config、common exception、security 與 modules 分層；功能模組包含 Controller、DTO、Service、Repository、Entity。Controller 處理 HTTP，Service 管商業規則與 transaction，Repository 管資料存取，不直接公開 Entity。

加入相容版本的 springdoc，提供 `/docs` 與 OpenAPI；設定 Actuator probes 及 `/health/live`、`/health/ready`。加入 request ID、結構化日誌、統一錯誤格式與集中例外處理。設定無狀態 Security、公開路徑、401／403 handler，避免預設登入頁干擾 API。

加入 Spring Boot Test、JUnit、Mockito、MockMvc、Spring Security Test、Testcontainers PostgreSQL、Spotless、JaCoCo。設定 Surefire 跑 `*Test`、Failsafe 跑 `*IT`，讓 `verify` 包含整合測試；測試使用獨立 DB，不用 H2 代替 PostgreSQL 行為。

設定 `APP_CORS_ALLOWED_ORIGINS` 並映射屬性，只允許指定前端 origin、必要 methods 與 Authorization header。使用 Postman 保存不含秘密的 collection。

完成標準：健康檢查與 API 文件可用；DB 中斷時 readiness 不成功；瀏覽器 preflight 通過；錯誤與日誌不洩漏 token、密碼、內部堆疊。基本測試及 `verify` 可執行。

### [ ] 步驟 6：固定契約與資料模型

盤點 `src/services/repositories/` 的方法、參數、回傳值及訂閱取消方式，對照下方參考第 6～8 節，固定 `/api/v1` endpoints、DTO、ID、空值、日期／時區、分頁、錯誤碼與狀態轉換。

整理 ERD、外鍵、唯一限制、check constraints 與索引。由 users、categories、restaurants、restaurant_owners 開始寫 `V1__initial_schema.sql`，其餘模組在對應步驟加入新 migration。合成 seed 僅用於 local／demo，記錄關聯 ID，不在正式環境自動灌入。

完成標準：API 契約與 OpenAPI 一致，空資料庫可經 migration 建立 schema；日期、ID 與前端格式有明確對照。

### [ ] 步驟 7：完成身分驗證與使用者

加入 Firebase Admin SDK，設定 `FIREBASE_PROJECT_ID`、`GOOGLE_APPLICATION_CREDENTIALS`，憑證放 Git 外；不要放進前端或 image。前端傳 Bearer ID token，後端驗證簽章、有效期限及指定 project，再以 UID 對應資料庫使用者。

實作 `/me`、首次建立 profile、本人資料讀取與更新；限制可修改欄位，不接受前端自行指定管理角色。定義 guest、diner、boss 與 restaurant ownership。

完成標準：有效 token 可取本人資料；未登入／無效 token 回 401；無權限回 403；使用者不能操作別人資料。正常、錯誤輸入、失效 token 與資料隔離測試通過。

### [ ] 步驟 8：完成店家 API 並接上前端

依序實作分類、店家列表／詳情、搜尋、分頁及 owner 管理，更新 OpenAPI、seed 與 PostgreSQL 整合測試，包含跨 owner 的 403。

前端保留 repository 介面，整理 Firebase adapter，再新增 API client 與店家 API adapter。以 `VITE_API_BASE_URL` 設定網址，需要登入時附 Firebase ID token，集中處理失敗及 AbortController 取消請求，統一資料格式。

開發期間以明確模式設定測 API；API 尚未完整時停用正式 Toggle，不把未完成的 API 功能偷偷接回 Firebase。此時建立基本 CI，執行格式、測試與建置。

完成標準：前端能顯示 API 店家列表與詳情；owner 更新與權限測試通過；Firebase 原有功能正常。這是第一個可展示的小里程碑。

### [ ] 步驟 9：完成營業時段、桌位與訂位

先做營業時段、桌位管理，驗證時間區間、容量、ownership；再做可預訂時段、建立／查看／取消訂位及店家排程更新，明確限制合法狀態轉換。

使用 transaction、鎖或資料庫約束防超額，處理重複請求與競爭更新。以真實 PostgreSQL 測試兩人搶最後名額及重送請求。完成對應前端 API adapters；API 模式先採 polling，提供取消函式，頁面卸載時停止，Firebase 保留 onSnapshot。

完成標準：不超額、不重複；diner 只能管理本人訂位，boss 只能管理自己店家的訂位；排程與併發測試通過。

### [ ] 步驟 10：完成收藏、評論、文章及圖片

依序加入收藏唯一限制、評論資格與評分更新 transaction、文章 ownership 與富文字 sanitize，補 migrations、API、測試及前端 adapters。保留 Supabase Storage，上傳需驗證檔案類型、大小、用途與 ownership，確認不能改刪他人圖片。

完成標準：重送不重複收藏，評分一致，評論資格有效，他人內容不能修改，原有圖片流程正常。S3 presigned upload 與 SSE 是後續選配；採用時再完成參考區的對應安全與清理要求。

### [ ] 步驟 11：完成並開放 Toggle

在 Header 加入 Firebase／自建 API 選擇，Zustand 保存模式，預設 Firebase，未知值回 Firebase；查詢前讀取模式。第一版保存模式後重新載入，阻止切換連點、未儲存表單及進行中寫入。

清除或依模式隔離 persist、localStorage 與快取，解除舊監聽和計時器，保留共用登入 session。兩邊用相同 Firebase UID 建立各自 profile、角色及關聯展示資料，提示資料獨立。API 失敗顯示錯誤並提供手動切回，不自動將寫入重送另一後端。

完成標準：兩種模式搜尋→訂位→查看／取消、收藏、評論與文章流程都通過，再開放 Toggle。驗證重新整理、跨頁、手機、鍵盤操作、token 失效與 API 中斷。

### [ ] 步驟 12：完成本機交付及 CI

新增多階段 API Dockerfile，使用固定版本／digest、Java 21、非 root 使用者；不 COPY secrets，支援 SIGTERM 與正常關閉。Compose 加入 API、readiness 與 DB 啟動依賴；提供 migration、seed、測試及資料保存的明確說明。

擴充 GitHub Actions：格式／靜態檢查、單元與整合測試、前端檢查、容器建置、Gitleaks secrets 掃描及 Trivy image 掃描。檢查重要商業規則測試覆蓋，不追求無意義的 100%。

```powershell
.\mvnw.cmd verify
docker compose up --build
```

完成標準：全新 checkout 可依 README 設定環境、啟動 DB/API、執行 migration、載入 seed、開啟文件及跑測試。完整 E2E 與本機驗收通過，即完成本機作品里程碑；不必先部署 AWS。

### [ ] 步驟 13：部署展示環境

本機完成後再選平台與 PostgreSQL 服務，先確認成本。若採 AWS，依參考第 13 節配置 ECR、ECS Fargate、ALB、RDS、IAM、Secrets Manager／SSM、CloudWatch；S3／CloudFront 依前端與圖片方案需求配置。

補 staging／production 組態，隔離網路、帳號與資料。設定 HTTPS、正式 CORS、secrets、最小權限、DB migrations、readiness、日誌保存、監控告警、預算告警及備份。

先執行 staging migration 與 smoke/E2E test，再設定前端 API URL 重新建置。實際演練資料庫備份還原、部署失敗回退及故障排查，記錄指令與限制。

完成標準：公開網址完整流程通過，能從 Git commit 追到 image／部署版本，故障能查日誌、告警並復原。

### [ ] 步驟 14：整理展示與交付文件

更新前後端 README 互連、相容 API 版本、工具版本、啟動／測試／部署指令，整理架構圖、ERD、OpenAPI、CI 與測試證據、關鍵技術決策、runbook、回退／還原紀錄與 demo 操作稿。

說明 Firebase／API 切換、請求流向、PostgreSQL 寫入、權限與併發防護，以及共用 Auth／Storage、獨立資料、選配功能、成本與限制。

完成標準：別人不需要本次聊天也能啟動並理解作品；能解釋交易、唯一限制、索引、401／403 與 ownership。

## 技術參考（用到時再展開）

保留原始第 1～18 節的設計資料，編號只供查閱，不代表另一套執行順序。原有核取框改為規格條列，不代表已完成。AWS 營運要求在部署階段驗收，S3／SSE 僅在採用時適用。

<details>
<summary>展開資料模型、API、權限、測試、Toggle 與部署規格</summary>

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

- 保留 Firebase 模式，透過統一 repository 介面切換至自建 API 模式。
- 自建 API 的商業規則、輸入驗證與權限判斷在後端執行；Firebase 模式仍須由 security rules 保護資料。
- 使用 PostgreSQL constraints 與 transactions 保護資料一致性。
- 提供 OpenAPI 文件、一致錯誤格式與自動化測試。
- 使用 Docker 建立一致的本機及部署環境。
- 可部署到 AWS，具備日誌、監控、備份與回復方案。
- 同一套前端展示兩種後端，逐功能完成 API adapter，保留原有功能。

### 第一版非目標

- 不拆微服務。
- 不導入 Kubernetes。
- 不一開始重寫 Firebase Authentication。
- 不立即加入 Redis、Kafka 等沒有明確需求的元件。
- 不保證大型平台等級的多區域容錯。

## 3. 建議技術決策：Java 求職路線

第一版固定使用以下組合，集中完成一套可展示、可測試的後端。Python 是未來可選技能，不列入本次必要待辦。

| 項目 | 建議工具 | 用途與取捨 |
| --- | --- | --- |
| 專案管理 | 獨立 Git repository：`waiting-for-eat-backend` | 與 React 分開管理依賴、CI、版本及部署 |
| JDK | Eclipse Temurin Java 21 LTS | 本機、CI 與容器統一版本 |
| IDE | IntelliJ IDEA，使用免費功能即可 | 撰寫、除錯與執行 Java；不要求付費 Spring 功能 |
| 初始化 | Spring Initializr | Maven、Java、Jar、Java 21；artifact 為 `waiting-for-eat-backend` |
| Framework | Spring Boot 穩定版 + Spring Web MVC | 建立 REST API；不使用 snapshot、milestone 或 WebFlux |
| 建置 | Maven Wrapper | 提交 `mvnw`、`mvnw.cmd` 與 `.mvn/`，避免依賴全域 Maven |
| Database | PostgreSQL 17 | 學習 SQL、外鍵、索引、交易與併發控制；各環境統一 major |
| ORM | Spring Data JPA + Hibernate | Repository 存取與 transaction；仍需讀懂產生的 SQL |
| Migration | Flyway + PostgreSQL 支援模組 | SQL 版本管理；Hibernate 設 `ddl-auto=validate`，不用 `update` 管正式 schema |
| Validation | Jakarta Bean Validation | 使用 DTO 與 `@Valid`，不直接將 Entity 當公開 API 回應 |
| Security | Spring Security + Firebase Admin Java SDK | 驗證 Firebase ID token，建立 principal，再檢查角色與 ownership |
| API 文件 | springdoc-openapi + Swagger UI | 選與 Boot major 相容的版本，文件路徑依第 7 節設定 |
| 日誌與健康檢查 | SLF4J／Logback + Spring Boot Actuator | request ID、結構化日誌與 readiness；只公開必要健康資訊 |
| 單元測試 | Spring Boot Test、JUnit Jupiter、Mockito | 版本交由 Boot dependency management 管理 |
| 整合測試 | MockMvc + Testcontainers PostgreSQL | 使用真實 PostgreSQL，不以 H2 取代交易與 SQL 行為 |
| 前端 E2E | Playwright | 驗證兩種模式的完整使用流程 |
| 格式與品質 | Spotless + JaCoCo | 統一 Java 格式並檢視關鍵規則測試覆蓋，不追求無意義的 100% |
| API 手動測試 | Postman | 保存測試 collection 與無 secrets 的環境範本 |
| SQL 工具 | DBeaver Community | 查資料、檢視 schema 與練習 SQL |
| 本機容器 | Docker Desktop + Docker Compose | Windows 使用 WSL 2；確認硬體、授權與 Docker 可正常啟動 |
| CI | GitHub Actions | 執行 Maven verify、整合測試、容器建置與掃描 |
| Secrets／映像掃描 | Gitleaks + Trivy | 檢查誤提交 secrets 與映像弱點 |
| 圖片 | 先沿用 Supabase Storage | S3 是第二階段選配，保留既有上傳功能 |
| 前端資料來源 | 原生 fetch + AbortController、既有 Zustand | 不為 Toggle 額外引入第二套狀態管理工具 |
| 部署 | 先本機 Docker Compose，再 AWS ECS Fargate + RDS | 本機完整 demo 為第一里程碑，AWS 成本與架構見第 13 節 |

### 安裝、初始化與版本驗收 checklist

- 安裝 Git、Temurin JDK 21、IntelliJ IDEA、Docker Desktop、DBeaver 與 Postman；以 `java -version`、`git --version`、`docker version` 驗證。
- 先練習 Java class／interface、collections、exceptions、generics、時間處理與基本測試，再接 Spring 的依賴注入、Controller、Service 與 Repository。
- 在目前前端 Git 根目錄之外建立後端 repository；先確認實際 Git 根目錄，避免巢狀 repository。後文 `backend/` 只是獨立專案根目錄的代稱。
- 使用 Spring Initializr，設定 group `com.waitingforeat`、package `com.waitingforeat.backend`，選 Spring Web MVC、Validation、Security、Data JPA、PostgreSQL Driver、Flyway 與 Actuator。
- 初始化時查看官方 system requirements，選與 Java 21 相容且仍受支援的 Boot 穩定版本，記錄精確版本；不要只因教學版本相同就選過期版本。
- 依 springdoc 相容表選 dependency major；JUnit、Hibernate、PostgreSQL driver 等優先沿用 Boot 管理的版本，額外函式庫明確鎖版。
- 加入 Firebase Admin SDK、springdoc、Testcontainers PostgreSQL、Spring Security Test、Spotless 與 JaCoCo；依所選版本確認 Testcontainers 與 Flyway 的模組名稱。
- 在 `pom.xml` 設 Java release 21、測試及品質 plugin；Surefire 執行 `*Test`，Failsafe 執行 `*IT`，讓 `verify` 包含整合測試。
- 執行 `.\mvnw.cmd -v`、`.\mvnw.cmd verify`；其他系統使用 `./mvnw verify`。Testcontainers 測試需先啟動 Docker。
- 設定 profile 與環境變數：`SPRING_PROFILES_ACTIVE`、`SPRING_DATASOURCE_URL`、`SPRING_DATASOURCE_USERNAME`、`SPRING_DATASOURCE_PASSWORD`、`FIREBASE_PROJECT_ID`、`GOOGLE_APPLICATION_CREDENTIALS`、`APP_CORS_ALLOWED_ORIGINS`。
- 在設定檔明確將自訂環境變數映射到應用程式屬性；Spring Boot 不會自動讀取一般 `.env`，本機使用 IDE 環境變數或 shell，Compose 的 env file 只依其注入規則使用。
- 本機 Firebase credentials 放在 Git 外並透過環境變數指定；部署使用 secret／工作負載身分機制，不將 JSON 金鑰寫入 image。
- 建立 `compose.yaml`，先啟動 PostgreSQL，再執行 `.\mvnw.cmd spring-boot:run`；完整容器流程再用 `docker compose up --build`。
- Flyway 建立第一個 `V1__initial_schema.sql`，由版本化 SQL 管 schema；展示 seed 僅在 local／demo profile 執行，不自動灌入正式資料。
- 設定 Actuator probes，再映射 `/health/live`、`/health/ready`；Swagger UI 映射 `/docs`，API 文件與 security allowlist 一起驗證。
- 用 Spring Security filter 呼叫 Firebase Admin 驗證 Bearer token，建立 authenticated principal；設定無狀態 API、CORS、401／403 handler，避免預設登入頁與 redirect 干擾前端。
- 先完成公開店家查詢與 `/me`，再完成 owner 更新與跨 owner 的 403 測試，最後進入訂位交易。

### 版本與官方參考

版本在真正建立後端時鎖定，不在規劃文件中猜測各套件的最新 patch。Boot、springdoc、Testcontainers 與 Java 需一起驗證相容性。

[Spring Initializr](https://start.spring.io/)、[Boot 系統需求](https://docs.spring.io/spring-boot/system-requirements.html)、[Spring SQL／JPA](https://docs.spring.io/spring-boot/reference/data/sql.html)、[springdoc 相容資訊](https://springdoc.org/)、[Testcontainers PostgreSQL](https://java.testcontainers.org/modules/databases/postgres/)、[Firebase token 驗證](https://firebase.google.com/docs/auth/admin/verify-id-tokens)。

## 4. 目標架構

```text
React / Vite（Header Toggle）
    ├─ Firebase 模式 → Firestore（保留現有功能）
    └─ API 模式 → HTTPS + JSON + Firebase ID token
                    ↓
                Spring Boot / Java
                    ├─ Spring Security + Firebase Admin
                    ├─ Controller + DTO / Validation
                    ├─ Service：權限、商業規則、交易
                    ├─ JPA Repository
                    └─ PostgreSQL（Flyway 管理 schema）

共用登入：Firebase Authentication
共用圖片：Supabase Storage；S3 為後續選配
即時更新：Firebase 使用 onSnapshot，API 先 polling，後續選配 SSE
```

### 建議獨立後端目錄

```text
waiting-for-eat-backend/
├─ pom.xml
├─ mvnw
├─ mvnw.cmd
├─ .mvn/wrapper/
├─ compose.yaml
├─ Dockerfile
├─ .env.example
├─ .github/workflows/ci.yml
└─ src/
   ├─ main/
   │  ├─ java/com/waitingforeat/backend/
   │  │  ├─ WaitingForEatApplication.java
   │  │  ├─ config/
   │  │  ├─ common/exception/
   │  │  ├─ security/
   │  │  └─ modules/
   │  │     ├─ users/
   │  │     ├─ restaurants/
   │  │     ├─ reservations/
   │  │     ├─ favorites/
   │  │     ├─ reviews/
   │  │     └─ posts/
   │  └─ resources/
   │     ├─ application.yml
   │     ├─ application-local.yml
   │     ├─ application-test.yml
   │     └─ db/migration/V1__initial_schema.sql
   └─ test/java/com/waitingforeat/backend/
      ├─ unit/
      └─ integration/
```

每個模組以訂位為例包含 `ReservationController.java`、request／response DTO、`ReservationService.java`、`ReservationRepository.java`、`Reservation.java` 與 `ReservationStatus.java`；測試放在 `src/test/java` 的對應 package。

- Controller 處理 HTTP 與 DTO，不放主要商業規則。
- Service 用 `@Transactional` 保護需要共同提交的商業操作；設計 transaction 邊界與鎖定策略。
- Repository 使用 JPA／參數化 SQL，Entity 管資料映射，公開回應使用 DTO。
- 以 `@RestControllerAdvice` 集中處理驗證、權限、衝突與其他錯誤。
- 模組間以明確的 Service 介面協作，避免到處直接操作別的模組 Repository。

## 5. 身分與權限模型

### 第一階段登入流程

- React 繼續使用 Firebase Authentication 登入。
- 前端取得 Firebase ID token。
- API client 傳送 `Authorization: Bearer <id-token>`。
- 後端使用 Firebase Admin SDK 驗證 token。
- 後端以 token 的 `uid` 查詢 `users.firebase_uid`。
- Request context 只使用後端取得的 user ID 與 role。

不可相信前端傳入的 `userId`、`companyId` 或 `role` 來判斷權限。

### 角色

| 角色 | 主要權限 |
| --- | --- |
| Guest | 搜尋、讀取公開店家、公開文章及評論 |
| Diner | 管理本人資料、收藏、建立/取消本人訂位、撰寫本人評論與文章 |
| Boss | 管理自己擁有的店家、桌位、營業時間及該店訂位 |
| Admin（選用） | 稽核與處理違規內容；第一版可不提供 UI |

### 關鍵授權規則

- `users.id` 必須等於目前登入使用者，除非是允許公開的 profile 欄位。
- boss 必須存在 `restaurant_owners(user_id, restaurant_id)` 才能管理店家。
- diner 只能讀取、取消自己的 reservation。
- boss 只能更新自己店家的 reservation 狀態與排程。
- review/post 的作者才能修改或刪除內容。
- review 必須對應已完成且屬於該 diner 的 reservation。
- 每個 reservation 最多一則 review 與一篇 food diary（若業務規則如此）。
- 上傳路徑由後端依目前使用者與用途產生，不能讓前端任意指定 bucket key。

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

- 將現有 `attend: "yes"/"no"` 改為明確狀態：`pending`、`confirmed`、`completed`、`cancelled`、`no_show`。
- 日期與時間改成有時區的 timestamp；API 使用 ISO 8601，資料庫使用 `timestamptz`。
- `rating_average` 與 `rating_count` 必須在同一 transaction 更新，或由查詢/背景工作重新計算。
- favorite 的 `like/dislike/eaten` 若可同時成立，應拆成欄位或獨立關係；若互斥才保留單一 status。
- menu 若需查詢、排序或管理單品，應拆成 `menu_items`；若只是整份展示，可先用 JSONB。
- 所有 table 都使用 server 產生的 `created_at`、`updated_at`。

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

- 驗證店家、時間、人數與使用者。
- 鎖定或以一致性策略讀取該時段容量。
- 檢查桌位/容量與重疊訂位。
- 建立 reservation。
- 寫入必要 audit/outbox event。
- Commit 後回傳 `201 Created`。

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

- 只回傳前端需要的欄位，避免直接 serialize 完整 DB record。
- 錯誤 code 穩定，message 可以本地化。
- production 不回傳 stack trace、SQL、secret 或第三方原始錯誤。
- 每個 response 帶 request ID header，方便查 log。

## 9. 安全要求

- HTTPS only；proxy 後正確處理 forwarded headers。
- Firebase ID token 完整驗證，不只 decode。
- 所有非公開 endpoint 採 deny-by-default。
- 每個 `:id` 都做 object-level authorization。
- Request body 使用 allowlist schema，拒絕 mass assignment。
- Search、login、reservation、upload 分別設定 rate limit。
- CORS 只允許已知前端 origin；但不把 CORS 當 Auth。
- ORM/parameterized SQL，禁止拼接使用者輸入。
- 富文字 sanitize，避免 stored XSS。
- 上傳檢查 MIME、magic bytes、大小、數量及副檔名。
- S3 bucket private，以 presigned URL/CloudFront 存取。
- Secrets 不進 Git、image、前端或 log。
- Log 遮蔽 token、email、phone 等敏感資料。
- Dependency、secret、SAST、container image 定期掃描。
- 關鍵管理操作寫入 audit log。

## 10. 測試計畫

### Unit tests

- 訂位狀態轉換。
- 時間範圍與營業時間驗證。
- 桌位與容量計算。
- 權限 policy。
- 評分重新計算。
- 上傳用途、MIME 與大小驗證。

### Integration tests

- API 使用獨立 PostgreSQL 測試資料庫。
- Migration 能從空資料庫完整執行。
- 每個 endpoint 測成功、輸入錯誤、未登入、無權限與不存在。
- Diner A 無法讀寫 Diner B 的 profile、訂位、收藏、評論或文章。
- Boss A 無法管理 Boss B 的餐廳、桌位、時段與訂位。
- 重複 favorite 不產生兩筆資料。
- 同一 reservation 不能建立兩則 review。
- 兩個並發訂位不會超過容量。
- 更新 review 失敗時，restaurant rating 不會留下半套資料。

### E2E tests

至少完成：

- Diner 登入 → 搜尋店家 → 查詢空位 → 建立/取消訂位。
- Boss 登入 → 管理時段與桌位 → 查看/更新訂位。
- Diner 完成用餐 → 建立評論與 food diary → 店家頁顯示。
- 圖片 presign → 上傳 → complete → 顯示。

### 非功能測試

- 對店家搜尋與熱門時段建立訂位進行 load test。
- 測試 DB 中斷、S3 失敗與 Firebase 驗證失敗。
- 測試 graceful shutdown 不接受新 request，並完成進行中的 request。
- 執行備份還原演練，不只確認備份檔存在。

## 11. Docker 本機環境

### 必要容器

```text
docker compose
├─ api
└─ postgres
```

Redis、Mailpit 等等只有加入對應功能時才新增。

### Dockerfile 要求

- Multi-stage build。
- 使用固定版本／digest 的 Maven + Temurin 21 建置 image，以及 Temurin 21 JRE runtime image。
- 只複製 production 必要檔案。
- 使用 non-root user。
- 以 `SPRING_PROFILES_ACTIVE=production` 啟用正式組態，環境變數注入資料庫與 Firebase 設定。
- 提供 health check 或交由平台呼叫 readiness endpoint。
- 不將 `.env` 或 secrets COPY 進 image。
- 正確處理 `SIGTERM` 與 graceful shutdown。

### Docker Compose 驗收

- `docker compose up` 可啟動 API 與 PostgreSQL。
- migration 與 seed 有明確指令。
- `.env.example` 列出必要變數但沒有真實秘密。
- volume 保存本機資料；測試環境可建立乾淨 DB。
- API readiness 在 DB 可用後才成功。

## 12. CI/CD 流程

### Pull Request CI

- 安裝固定版本 dependencies。
- Format check。
- 後端執行 Spotless 格式檢查；前端 ESLint 在前端 repository 執行。
- Maven compile／testCompile 檢查 Java 原始碼與測試可編譯。
- Unit tests。
- 啟動測試 PostgreSQL並執行 migrations。
- Integration tests。
- Build application。
- Dependency、secret 與 SAST scan。
- Build Docker image 並進行 image scan。

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

- ALB 在 public subnets，API tasks 與 RDS 在 private subnets。
- RDS security group 只允許 API task security group。
- ECS task 使用 IAM role 存取指定 S3 path、Secrets 與 logs。
- CI 使用 OIDC assume role，避免保存長效 AWS access key。
- 開發者不要直接公開連接 production RDS；使用受控通道或管理流程。
- 開啟 encryption at rest 與 in transit。

### 監控與告警

- API request count、p50/p95/p99 latency、4xx、5xx。
- ECS CPU、memory、task restart、unhealthy target。
- RDS CPU、storage、connections、slow queries、replication/backup 狀態。
- S3 upload errors 與異常流量。
- Firebase token verification error rate。
- 告警要附 runbook，說明如何確認、緩解與回復。

### 成本控制

- 建立 AWS Budget/Billing alarm。
- 開發環境不用模擬大型高可用架構。
- 先估算 ALB、NAT Gateway、RDS 的固定成本。
- Staging 可設定排程停止非必要資源，但 production 不可隨意停止。
- 若作品預算有限，可先在其他容器平台部署 API；文件仍保留 AWS 架構與取捨說明。

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

- 盤點所有 repository 方法，記錄參數、回傳格式、錯誤與訂閱取消方式，包含 ID、日期、空值等資料契約。
- 將既有實作整理至 Firebase adapter，保留原匯出介面，先驗證原功能正常。
- 建立自建 API、PostgreSQL 與 Firebase token 驗證，再依功能加入 API adapter。後端自行驗證使用者身分與資料權限。
- 建立 API client，以 `VITE_API_BASE_URL` 設定網址；瀏覽器環境變數不可放後端 secrets。
- 為兩個資料庫建立內容相近的合成展示資料；以相同 Firebase UID 對應帳號，準備各自的 profile、角色與店家／訂位關聯 ID。
- 建立 backend store，預設 `firebase`，以 localStorage 記住選擇；未知值回到 Firebase。必須在開始查詢前讀取模式。
- 建立 Toggle 並掛入 Header，提供文字標籤與鍵盤操作。API 尚未完成完整展示流程前，選項停用並標示「開發中」。可用 `VITE_ENABLE_BACKEND_TOGGLE` 控制展示入口，但不可將此旗標當成權限保護。
- 第一版採「保存模式後重新載入頁面」，重新建立請求與監聽；切換期間禁止連點。有未儲存表單或送出中的寫入時，阻止切換並說明原因。
- 盤點 Zustand persist、localStorage 與其他快取，清除業務資料或按模式分開保存，保留共用登入 session。載入新模式前不可顯示舊模式資料。
- 依序完成使用者與店家、時段與桌位、訂位、收藏、評論與文章的 API adapter，再補 polling／SSE。每個訂閱方法提供取消函式，頁面卸載時解除監聽與計時器。
- 兩種模式完整驗證後才開放切換。API 無法連線時顯示錯誤，提供手動切回 Firebase 的操作；不可自動將失敗寫入重送到另一套後端。

### 展示與備案範圍

第一版兩套資料庫獨立，不做雙寫或自動同步。在 Firebase 建立的訂位不會自動出現在 PostgreSQL，反向亦然；切換區應提示「兩種模式使用獨立展示資料」。尚未完成的 API 功能不可悄悄回到 Firebase，避免混用資料來源。

備案不等於故障時能立即接手正式流量。若未來要正式接手，需另行完成資料同步、ID 對照、校驗、切換與回復演練。本計畫不停止 Firestore／Supabase 寫入，也不移除既有 SDK。

### Toggle 完成檢查

- 首次開啟預設 Firebase，重新整理後記住選擇。
- 桌面與手機 Header 均顯示正確模式。
- Firebase 原有功能完整保留。
- 兩種模式都能完成搜尋、訂位、查看訂位與收藏等展示流程。
- 切換後沒有舊模式快取、持久化資料或監聽混入。
- 切換不會造成表單遺失或重複送出寫入。
- API 中斷可顯示明確錯誤並手動切回 Firebase。
- 兩種模式均驗證未登入、無權限與跨店家操作；API 訂位通過併發測試。
- Demo 說明共用 Auth／Storage 與獨立資料庫的範圍。

### 展示資料準備

以下為準備自建 API 資料的參考步驟；匯出真實資料時須先去識別化，展示以合成資料為主。

- 匯出 Firestore 所有 collections/subcollections。
- 保存文件 ID，建立舊 ID 到新 UUID 的 mapping。
- 統計每個 collection 筆數、空值、型別差異與孤兒 reference。
- 備份 Supabase object list 與必要 metadata。
- 為現有 Firebase/Supabase 設定加上正確 security rules。
- 在 frontend 建立統一 API client 與 feature flag。

### 建議 API 功能實作順序

- Health、logging、error format、OpenAPI。
- Auth middleware 與 `/me`。
- Categories 與 restaurants 公開唯讀搜尋。
- Users/profile。
- Boss restaurant 管理。
- Opening times 與 tables。
- Reservations；這是最高風險，需要 transaction 與 concurrency tests。
- Favorites。
- Reviews 與 rating transaction。
- Posts/food diary 與富文字安全。
- 保留共用 Supabase Storage，S3 為後續選配。
- Realtime subscriptions 改為 polling/SSE。
- 驗證兩種模式的完整展示流程。
- 保留現有 SDK 與 Firebase／Supabase 讀寫路徑。

### 每個功能的切換方式

- 先完成新 DB schema、API 與 tests。
- 建立該功能的展示資料與關聯 ID。
- 在 staging 比對新舊查詢結果。
- 前端以 feature flag 切換新 API。
- 小範圍觀察錯誤與資料差異。
- 確認兩種模式均可正常操作，寫入各自的資料庫。
- 保留 Firebase 路徑，確認可以手動切回。

第一版不做雙寫；將來需要同步時再獨立設計失敗補償與資料一致性策略。

## 15. 分階段實作與完成條件

### Phase 0：設計與專案骨架

- 建立獨立 Java 21／Spring Boot 後端 repository 與 Maven Wrapper。
- 設定 Spring Web MVC、Security、Data JPA、PostgreSQL、Flyway 與第 3 節指定工具。
- 建立 Dockerfile、Compose PostgreSQL 與 `.env.example`。
- 完成 `/health/live`、`/health/ready`。
- 加入 structured logger、request ID、global error handler。
- 建立 CI 的 lint、type check、test、build。
- 建立 OpenAPI。

完成定義：新開發者依 README 能在乾淨環境一個指令啟動並呼叫 health API。

### Phase 1：Auth 與 Users

- Firebase Admin middleware。
- `/me` profile API。
- users migration 與 repository/service。
- Authentication/authorization integration tests。
- 前端 profile 改走 API。

完成定義：偽造、過期或缺少 token 會被拒絕；A 無法修改 B。

### Phase 2：Restaurants 與 Search

- categories、restaurants、owners schema。
- 公開搜尋、篩選、排序與分頁。
- Boss 建立/修改本人店家。
- 常用查詢 indexes 與 EXPLAIN 紀錄。
- 前端 Search/Restaurant/Boss Info 改走 API。

完成定義：公開資料無敏感欄位；只有 owner 能修改店家。

### Phase 3：Opening Times、Tables、Reservations

- 時段、桌位、訂位 schema 與狀態機。
- Availability API。
- Transactional reservation creation。
- Owner schedule update + optimistic locking/version。
- Concurrent integration/load tests。
- 前端 Reserve、ReservedShop、Boss Schedule 改走 API。

完成定義：併發 request 不會超額；所有跨使用者與跨店家操作被拒絕。

### Phase 4：Favorites、Reviews、Posts

- 唯一限制與 owner policies。
- 評論與店家平均評分 transaction。
- 完成訂位才能評論/發文的規則。
- 富文字 sanitize。
- 對應前端頁面改走 API。

完成定義：重送不產生重複資料；評分與內容資料保持一致。

### Phase 5：共用圖片與 Realtime（S3 為選配）

- 驗證共用 Supabase 上傳與顯示；以下 S3 相關項目僅在啟用選配時執行，否則標示不適用。
- （選配）S3 private bucket 與 presigned upload flow。
- media metadata、完成確認與孤兒檔案清理。
- 先 polling，再視需要實作 SSE。
- 驗證檔案型別、大小、用途與 ownership。
- 保留共用 Supabase upload；S3 為選配，不移除既有圖片功能。

完成定義：前端沒有 AWS secret，使用者不能覆寫或刪除別人的圖片。

### Phase 6：AWS 與營運

- ECR、ECS Fargate、ALB、RDS、S3、CloudFront。
- Secrets Manager/SSM 與 IAM least privilege。
- Staging/production pipeline。
- CloudWatch dashboard、alarms 與 log retention。
- DB automated backup 與 restore drill。
- Runbook、rollback 與 incident template。

完成定義：可以從 Git commit 追到 image 與部署版本；故障時能告警、查 log、rollback 並還原資料。

## 16. 公司級 Definition of Done

任何後端功能只有同時符合以下條件才算完成：

- Acceptance criteria 通過。
- API/DB/權限設計已 review。
- Request、response 與錯誤都寫入 OpenAPI。
- 所有輸入經 schema 驗證。
- Authentication 與 object/function-level authorization 完成。
- Migration、constraints 與 indexes 完成。
- 正常、邊界、未登入、無權限與失敗測試完成。
- Logs 不含 secrets 或敏感資料。
- Lint、type check、tests、build、security scans 全部通過。
- Staging migration 與 smoke/E2E tests 通過。
- 監控、告警、rollback 與資料回復方式已確認。
- README/runbook/ADR 等必要文件更新。
- Production 部署後觀察關鍵 metrics，確認沒有資料差異。

## 17. 求職作品應展示的證據

- 系統架構圖與 ERD。
- OpenAPI/Swagger 可操作文件。
- GitHub Issues、PR 與 code review 紀錄。
- CI pipeline 執行結果。
- Unit/integration/E2E 與併發訂位測試。
- Docker Compose 本機啟動方式。
- AWS 部署圖、IAM 與網路設計說明。
- CloudWatch dashboard 或匿名化截圖。
- 一次 migration/rollback 或 incident 演練紀錄。
- ADR：為什麼選模組化單體、PostgreSQL、Firebase Auth 過渡、SSE。
- README 清楚說明限制、未來工作與成本取捨。

面試時必須能解釋：

- 為什麼不能相信前端傳來的 user ID/role。
- 為什麼訂位需要 transaction 與 concurrency control。
- 為什麼使用 unique constraint，而不只先查詢是否存在。
- 401 與 403 的差異。
- index 如何加速查詢，以及它的寫入成本。
- 兩種模式各自負責的資料與權限，以及共用 Firebase Auth／Supabase Storage 的範圍。
- API、DB 或部署失敗時如何定位、緩解與回復。

## 18. 第一個實作切片

第一個切片不要從最複雜的訂位開始。建議順序：

- 建立 `backend/`、PostgreSQL、Docker Compose。
- 實作 health、logger、error handler、OpenAPI。
- 實作 Firebase token middleware。
- 建立 `users`、`categories`、`restaurants`、`restaurant_owners`。
- 實作 `/me`、公開 restaurant list/detail、owner update。
- 寫 integration tests，包含跨 owner 的 `403`。
- 將前端 restaurant 搜尋與店家基本資料改走 API。
- 建立 CI 並部署 staging。

這個切片完成後，再進入訂位模組。這樣能先建立完整交付流程，又不會一開始就同時處理即時更新與高風險併發問題。

</details>

## 最後驗收清單

依實際執行結果勾選。本機完成可先驗收第一組；部署項目在步驟 13、14 後確認。未採用的選配標示不適用，不要求為了勾選而實作。

### 本機必要項目

- [ ] Java 21、Wrapper 與依賴版本已確認；前後端獨立管理，README 互連。
- [ ] 全新 checkout 可依文件啟動 PostgreSQL、API、migration、seed 與 API 文件。
- [ ] 環境範本完整，真實 secrets 不在 Git、前端、image 或日誌中。
- [ ] Local／test 隔離，migrations 可重現，DB constraints／indexes 與合成 seed 完整。
- [ ] Health、readiness、OpenAPI、CORS、request ID 與統一錯誤格式正常。
- [ ] Token、角色、ownership、401／403、輸入驗證與跨使用者測試通過。
- [ ] 店家、營業時段、桌位、訂位、收藏、評論、文章與圖片流程可用。
- [ ] 併發不超額、重送不重複，訂位狀態轉換與評分交易正確。
- [ ] Firebase 與 API 各自完整 E2E 通過；共用 Auth／Storage 功能保留。
- [ ] Toggle 預設與保存正常，快取隔離、取消監聽、表單與寫入保護有效。
- [ ] API 中斷顯示錯誤，可手動切回，不自動跨後端重送寫入。
- [ ] 手機、鍵盤、重新整理、跨頁、token 失效與錯誤輸入情境通過。
- [ ] Maven verify、前端檢查、格式／靜態檢查、容器建置、CI 與安全掃描通過。
- [ ] 選配 S3／SSE 若採用，對應上傳權限、清理與取消訂閱要求已驗證；否則標示不適用。

### 部署與交付項目

- [ ] Staging／production 隔離，HTTPS、正式 CORS、secrets 與最小權限完成。
- [ ] Staging migration、smoke/E2E 與公開展示網址完整流程通過。
- [ ] 版本可追蹤；監控、告警、日誌保存與成本限制已設定。
- [ ] 實際演練備份還原、部署回退，runbook 記錄可用。
- [ ] 架構圖、ERD、OpenAPI、測試證據、README 與 demo 操作稿齊全。
- [ ] 展示說明共用服務、獨立資料、權限／併發設計、選配與成本限制。

