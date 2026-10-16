# 後端工程師能力矩陣與正式公司工作流程

這份文件整理一位能參與正式產品開發的 Junior Backend Engineer 應具備的知識、工具與交付能力。它不是要求一次精通所有技術；重點是先掌握核心能力，再用一個可部署、可測試、可維護的專案證明自己。

## 能力等級

| 等級 | 定義 |
| --- | --- |
| 必備 | Junior 求職前應能實作並解釋 |
| 重要 | 進入正式團隊後經常使用，作品最好涵蓋 |
| 進階 | 視公司規模與系統需求學習，不必為了作品硬加 |

## 1. 程式語言與基礎能力

| 能力 | 等級 | 至少應該會什麼 | 可驗收成果 |
| --- | --- | --- | --- |
| TypeScript / 後端語言 | 必備 | 型別、函式、class、module、async/await、錯誤處理 | 能獨立完成 API，不依賴複製教學 |
| 資料結構 | 必備 | array、object/map、set、queue、stack 的使用情境 | 能選擇合理結構處理資料 |
| 非同步程式 | 必備 | Promise、並行與循序、timeout、錯誤傳遞 | 不產生未處理 Promise 或無限等待 |
| Clean Code | 重要 | 命名、單一責任、避免重複、控制函式大小 | Code Review 時能解釋拆分方式 |
| Design Patterns | 進階 | Repository、Strategy、Adapter、Dependency Injection | 只在能降低耦合時使用，不過度設計 |

## 2. HTTP、REST 與 API 設計

| 能力 | 等級 | 至少應該會什麼 | 可驗收成果 |
| --- | --- | --- | --- |
| HTTP | 必備 | method、header、body、cookie、cache、status code | 能說明 400/401/403/404/409/422/500 |
| REST API | 必備 | 資源命名、CRUD、巢狀資源、分頁、篩選、排序 | API URL 與 response 格式一致 |
| API 契約 | 必備 | request/response schema、錯誤格式 | 提供 OpenAPI/Swagger 文件 |
| 輸入驗證 | 必備 | 型別、長度、範圍、enum、未知欄位、檔案限制 | 使用 Zod 等 schema 在後端驗證 |
| API 版本 | 重要 | `/api/v1`、相容性、deprecation | 說明如何修改 API 而不破壞舊前端 |
| Idempotency | 重要 | 防止重複訂位、付款或 webhook | 重送相同 request 不會重複寫入 |
| Realtime | 重要 | WebSocket、SSE、polling 的差異 | 依需求實作即時訂位更新 |
| GraphQL/gRPC | 進階 | 適用情境與 REST 的取捨 | 非本專案必要，不必為履歷硬加 |

## 3. 後端框架與架構

| 能力 | 等級 | 至少應該會什麼 | 可驗收成果 |
| --- | --- | --- | --- |
| Node.js Runtime | 必備 | event loop、環境變數、process、signal | 能正確啟動與 graceful shutdown |
| Express/Fastify/NestJS | 必備 | routing、middleware、error handler、plugin/module | API 有清楚的模組邊界 |
| 分層架構 | 必備 | controller、service、repository 的責任 | controller 不直接塞商業規則與 SQL |
| 模組化單體 | 重要 | 依業務模組切分、限制依賴方向 | 使用者、店家、訂位等模組獨立 |
| Dependency Injection | 重要 | 替換 repository/外部服務、方便測試 | service 可使用 fake repository 測試 |
| Microservices | 進階 | 邊界、網路失敗、分散式資料問題 | Junior 作品通常不需要 |

## 4. SQL 與資料庫

| 能力 | 等級 | 至少應該會什麼 | 可驗收成果 |
| --- | --- | --- | --- |
| SQL | 必備 | SELECT、JOIN、GROUP BY、INSERT、UPDATE、DELETE | 能自行撰寫與閱讀查詢 |
| 關聯式設計 | 必備 | PK、FK、1:1、1:N、N:M、正規化 | ERD 與 schema 能表達業務關係 |
| Constraints | 必備 | NOT NULL、UNIQUE、CHECK、FK | 關鍵規則不只依賴程式碼 |
| Transaction | 必備 | atomicity、rollback、隔離與競爭條件 | 訂位建立與容量控制在同一 transaction |
| Index | 必備 | index 成本、複合索引順序、查詢計畫 | 能用 EXPLAIN 檢查常用查詢 |
| Migration | 必備 | schema 版本、up/down 或 forward-only | 部署時能安全更新資料庫 |
| ORM | 重要 | Prisma/Drizzle、relation、transaction、raw SQL | 知道 ORM 方便之處與限制 |
| PostgreSQL 維運 | 重要 | connection pool、慢查詢、備份、還原 | 能說明連線耗盡與恢復方式 |
| NoSQL | 重要 | document model、適用情境與限制 | 能解釋 Firestore 搬到 PostgreSQL 的取捨 |
| Redis | 進階 | cache、TTL、distributed lock、queue | 有明確需求才加入 |

## 5. Authentication、Authorization 與安全

| 能力 | 等級 | 至少應該會什麼 | 可驗收成果 |
| --- | --- | --- | --- |
| Authentication | 必備 | session/JWT、access/refresh token、token 驗證 | 後端驗證簽章、issuer、audience、expiry |
| Authorization | 必備 | RBAC、資源所有權、deny by default | diner 不能操作別人的資料，boss 只能管理自己的店 |
| 密碼安全 | 必備 | Argon2id/bcrypt、reset、暴力登入防護 | 若自建 Auth，不保存明文或可逆密碼 |
| OWASP 基礎 | 必備 | injection、XSS、CSRF、SSRF、broken access control | 有威脅清單與相應測試 |
| Secrets | 必備 | 不進 Git、不送前端、定期輪替 | 使用 secrets manager 或部署平台 secrets |
| CORS | 必備 | 瀏覽器同源限制與允許來源 | 知道 CORS 不是 Authentication |
| Rate Limiting | 重要 | 依 IP、帳號、endpoint 限流 | 登入、搜尋、上傳有不同限制 |
| Security Headers | 重要 | HSTS、CSP、X-Content-Type-Options 等 | 依前後端架構正確配置 |
| Threat Modeling | 重要 | asset、actor、trust boundary、abuse case | 開發前列出訂位、權限、上傳風險 |
| Audit Log | 重要 | 誰在何時修改什麼 | 店家變更訂位狀態可追查 |

## 6. 測試與品質

| 能力 | 等級 | 至少應該會什麼 | 可驗收成果 |
| --- | --- | --- | --- |
| Unit Test | 必備 | 商業規則、邊界值、錯誤分支 | service/model 有快速測試 |
| Integration Test | 必備 | API + 真實測試資料庫 | 測試 status、response 與 DB 結果 |
| Authorization Test | 必備 | 未登入、錯誤角色、跨帳號存取 | A 使用者不能存取 B 使用者資料 |
| E2E Test | 重要 | 核心使用者流程 | 註冊、搜尋、訂位、店家管理可驗收 |
| Test Data | 重要 | factory、seed、測試隔離與清理 | 測試可重複且不依賴執行順序 |
| Static Analysis | 重要 | lint、type check、format | CI 中自動執行 |
| Load Test | 重要 | latency、throughput、error rate | 能測試熱門時段訂位與搜尋 |
| Contract Test | 進階 | consumer/provider 相容性 | 多服務或多前端時再加入 |

## 7. Git 與團隊協作

| 能力 | 等級 | 至少應該會什麼 | 可驗收成果 |
| --- | --- | --- | --- |
| Git | 必備 | branch、commit、merge/rebase、conflict | commit 小而清楚，不提交 secrets |
| Issue | 必備 | 問題、範圍、驗收條件 | 每項功能可追蹤 |
| Pull Request | 必備 | 說明、測試證據、風險與 migration | 讓 reviewer 能快速驗收 |
| Code Review | 重要 | 正確性、安全、可讀性與測試 | 能接受並回應 review 意見 |
| ADR | 重要 | 記錄重要架構決策與取捨 | 說明為何選 PostgreSQL、SSE、模組化單體 |

## 8. Docker 與容器

| 能力 | 等級 | 至少應該會什麼 | 可驗收成果 |
| --- | --- | --- | --- |
| Dockerfile | 必備 | image、layer、cache、CMD、multi-stage build | 產生小且可重現的 production image |
| Docker Compose | 必備 | API、PostgreSQL、Redis 等本機依賴 | 一個指令啟動開發環境 |
| Container Security | 重要 | non-root、固定版本、掃描、不要包 secrets | production container 不用 root 執行 |
| Health Check | 重要 | liveness/readiness 差異 | 容器與部署平台能判斷是否可接流量 |
| Registry | 重要 | tag、push、immutable artifact | CI 推送至 ECR/GHCR |
| Kubernetes | 進階 | deployment、service、config、autoscaling | 本專案與 Junior 求職不是必要條件 |

## 9. CI/CD

| 能力 | 等級 | 至少應該會什麼 | 可驗收成果 |
| --- | --- | --- | --- |
| CI | 必備 | install、lint、type check、test、build | PR 無法繞過必要檢查 |
| Security Scan | 重要 | dependency、secret、SAST、container scan | 高風險問題阻擋發布 |
| CD | 重要 | staging、production、approval、rollback | 使用同一份 image 逐環境發布 |
| Database Deploy | 重要 | migration 順序、向下相容 | 新舊程式短暫並存時仍可運作 |
| Deployment Strategy | 進階 | rolling、blue-green、canary | 依風險選擇，不必全部實作 |

## 10. AWS 與雲端基礎

| AWS 能力 | 等級 | 在本專案的用途 | 應理解的重點 |
| --- | --- | --- | --- |
| IAM | 必備 | 控制服務與部署權限 | user/role/policy、least privilege，避免長效 access key |
| VPC | 重要 | 分隔 public/private network | subnet、route、security group、NAT 成本 |
| RDS PostgreSQL | 必備 | 正式資料庫 | private access、backup、Multi-AZ、connection limit |
| S3 | 必備 | 餐廳、使用者與文章圖片 | bucket policy、presigned URL、檔案限制 |
| CloudFront | 重要 | 前端與圖片 CDN | cache、HTTPS、S3 private origin |
| ECR | 重要 | 儲存 API Docker image | image tag、掃描與生命週期 |
| ECS Fargate | 重要 | 執行 API container | task、service、autoscaling、health check |
| ALB | 重要 | HTTPS、路由與 health check | target group、timeout、ACM certificate |
| Route 53 / ACM | 重要 | 網域、DNS、TLS 憑證 | HTTPS 與憑證更新 |
| Secrets Manager/SSM | 必備 | DB URL、Firebase Admin 等秘密 | runtime 注入與輪替 |
| CloudWatch | 必備 | logs、metrics、alarms | error rate、latency、CPU、memory、DB connections |
| SQS | 進階 | Email、圖片處理等背景任務 | retry、visibility timeout、dead-letter queue |
| Lambda | 進階 | 排程或事件型小任務 | cold start、timeout、權限與適用範圍 |
| WAF | 進階 | 常見攻擊與流量防護 | 規則、誤判、成本；不能取代程式權限檢查 |

### 本專案建議 AWS 架構

```text
使用者
  ├─ CloudFront ── S3（React 靜態網站）
  └─ Route 53 / ACM
          ↓ HTTPS
         ALB
          ↓
     ECS Fargate（Node.js API）
       ├─ RDS PostgreSQL（private subnet）
       ├─ S3（圖片，presigned upload）
       ├─ Secrets Manager
       └─ CloudWatch
```

作品初期若要控制 AWS 費用，可以先使用單一 ECS service、較小的 RDS，並設定 billing alarm。不要為了展示而建立不需要的 NAT Gateway、Kubernetes 或多區域架構。

## 11. Linux、網路與系統知識

| 能力 | 等級 | 至少應該會什麼 | 可驗收成果 |
| --- | --- | --- | --- |
| Linux | 必備 | process、port、file permission、signal、log | 能調查程式未啟動與連線問題 |
| DNS/TLS | 必備 | domain resolution、HTTPS、certificate | 能說明瀏覽器如何連到 API |
| TCP 基礎 | 重要 | connection、timeout、keep-alive | 能理解連線池與網路錯誤 |
| Reverse Proxy/LB | 重要 | proxy header、health check、load balancing | API 在 ALB/proxy 後能取得正確資訊 |

## 12. Observability 與維運

| 能力 | 等級 | 至少應該會什麼 | 可驗收成果 |
| --- | --- | --- | --- |
| Structured Logging | 必備 | level、request ID、context、敏感資訊遮蔽 | 能依 request ID 追查問題 |
| Metrics | 重要 | traffic、error、latency、saturation | dashboard 顯示 API 與 DB 健康度 |
| Tracing | 進階 | 跨服務追蹤與 span | 單體初期可不做完整 tracing |
| Alerting | 重要 | 可行動的 threshold、去除雜訊 | 5xx 或 latency 異常會通知 |
| Incident Response | 重要 | triage、mitigation、rollback、postmortem | 有簡單 runbook 與事故紀錄模板 |
| Backup/Restore | 必備 | RPO、RTO、備份與還原演練 | 不只「有備份」，也驗證能還原 |

## 13. 正式公司的標準交付流程

| 階段 | 工作 | 必要產出／驗收門檻 |
| --- | --- | --- |
| 需求 | 定義使用者、流程、商業規則、非功能需求 | Issue、acceptance criteria、資料敏感度 |
| 設計 | API、ERD、權限矩陣、失敗情境 | OpenAPI、ERD、ADR、threat model |
| 開發 | branch、migration、程式與測試 | 小型 commits、無 secrets、可本機執行 |
| Review | Pull Request 與 code review | 正確性、安全性、測試與相容性通過 |
| CI | 自動品質與安全檢查 | lint、type check、test、build、scan 全綠 |
| Staging | 與正式環境相近的驗收 | migration、E2E、效能與權限驗收 |
| Release | 版本、發布、回復計畫 | release note、rollback 條件、approval |
| Production | 部署並觀察 | health、error rate、latency、資料正確 |
| Operation | 告警、事故、備份、漏洞修補 | runbook、restore test、postmortem |
| Retirement | 停用 API/資料/secret | deprecation、資料保存與安全刪除 |

## 14. Junior 求職作品完成標準

- [ ] 一個真實業務主題，而不是只有 Todo CRUD
- [ ] TypeScript 後端與清楚的模組化架構
- [ ] PostgreSQL、ERD、constraints、indexes、migration
- [ ] Authentication、Authorization 與跨使用者存取測試
- [ ] OpenAPI/Swagger 與一致的錯誤格式
- [ ] Unit、integration、至少一條 E2E 核心流程
- [ ] Dockerfile 與 Docker Compose
- [ ] CI 自動執行 lint、type check、test、build
- [ ] Staging 或 production 實際部署
- [ ] Structured logs、health check 與基本監控
- [ ] README 說明架構、啟動、測試、部署與取捨
- [ ] 能口頭解釋 transaction、index、401/403、token、權限與 rollback

## 15. 不必一開始就做的事情

- 不必為了履歷將系統拆成微服務。
- 不必先學 Kubernetes 才能部署後端。
- 不必自行實作密碼學或 token 格式。
- 不必同時使用多種資料庫、queue 與 cache。
- 不必追求 100% 測試覆蓋率；優先測試高風險商業規則。
- 不必一次達到大型企業的多區域、高可用架構。

先把一個模組化單體做到安全、可測、可部署、可觀察，比堆疊大量無法解釋的工具更能證明後端能力。
