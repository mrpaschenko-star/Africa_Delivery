# Реестр нефункциональных требований

Статус всех target: **предложено, подлежит измерению**. Основание: [A1](../sources/artifact-01.md), [A2](../sources/artifact-02.md), [A3](../sources/artifact-03.md), [A5](../sources/artifact-05.md), [A6](../sources/artifact-06.md), [C01/C03/C06/C07](../Task1/contradictions.md). Приоритет P0 блокирует GO, P1 — следующий этап; это не означает уже достигнутое соответствие.

| ID | Категория | Требование | Метрика | Target | Проверка | Источник |
|---|---|---|---|---|---|---|
| N01 P0 | Доступность | Каталог в каждой стране | Good/eligible requests, 30d | ≥99.9%; 99.99% инвестора остаётся gap | Synthetic + ingress; chaos test | A1; [контракт](slo/catalog.md) |
| N02 P0 | Платежи | Durable acceptance без дублей | Good/eligible, duplicate ledger | ≥99.9%; дублей 0 | Retry/callback replay, DB kill | A1/A3; [контракт](slo/payments.md) |
| N03 P0 | Внешний результат | Resolve payment outcome | Terminal≤15min/eligible | ≥99.5% | PSP sandbox fault injection + production SLI | A1/A3 |
| N04 P0 | Уведомления | Доставка сообщений | Receipt≤5min/accepted | ≥99%; unknown не success | Webhook replay и шлюз недоступен | A2; [контракт](slo/notifications.md) |
| N05 P0 | Latency | API catalog/order | P99 server duration | ≤500/800ms; order без PSP wait | 60min load, минимум 100k samples | A2 |
| N06 P0 | UX | Первый товар на 3G | P75 field FCP/product visible | ≤2s на 1.6Mbps/RTT150ms/1%loss | WebPageTest profile + RUM opt-in | A2 |
| N07 P0 | Capacity | Работа после потери API | RPS / error / queue lag | 100read+10order RPS/country, errors<1%, oldest job<60s | k6 60min, burst×2 5min | A5, допущение |
| N08 P0 | Recovery | Отказ узла / DC | RTO / RPO | ≤5min/0; DC≤60min/≤5min | Kill primary; restore+fence drill | A1/A3 |
| N09 P0 | Residency | PII/keys/backups локально | Unauthorized transfers | 0; список процессоров проверен | Egress deny tests, log/backups scan | A3/A7; C03 |
| N10 P0 | Security | Auth/consent/финансы | Critical vulnerabilities; privileged MFA; audit coverage | 0 critical; 100% MFA; 100% проводок | SAST/SCA, pentest, role tests | A3; C06 |
| N11 P0 | Cost | Все технические recurring | USD/month incl.SaaS,msg,reserve | ≤5000 каждый M1–M6 | Invoice forecast weekly | A6; C05 |
| N12 P1 | Portability | Развернуть cell у другого провайдера | Restore time + regression | ≤2 рабочих дней на заранее подготовленном compute | IaC restore в той же стране | A5, C03/C07 |
| N13 P0 | Operability | Восстановление релиза | Rollback time | ≤10min для app, expand/contract DB | Canary rollback exercise | A5 |
| N14 P0 | Consistency | Заказ/резерв/платёж | Double charge / negative stock | 0; 100% unknown reconciled | Concurrent checkout+PSP timeout tests | A1/A4 |

## Cloud Native: полный supplied checklist

Источник — [16 критериев](../sources/cloud-native-checklist.md). MVP на VM-контейнерах **не соответствует буквально всему чек-листу**. Функциональный аналог не объявляется прохождением Kubernetes-критерия. Без подписанного waiver нельзя заявлять «CNCF-certified marketplace»; [E06](../sources/README.md) относится к Kubernetes offerings.

| ID | MVP: план контроля / статус | Проверка и M6 |
|---|---|---|
| CN.RPL.01 | GAP: Kubernetes отсутствует | CTO waiver; M6 certified distribution + deployment test |
| CN.RPL.03 | GAP буквальный K8s; cgroups CPU/RAM на VM | Exhaustion test; M6 requests/limits manifest |
| CN.SEL.01 | GAP в части Kubernetes; 2 API replicas, local standby, worker restart | Kill replica + 60min load; M6 replicas/HPA |
| CN.FTL.02 | /live и /ready; процесс supervisor, /ready без зависания PSP | Kill/health tests; M6 K8s probes |
| CN.LCP.03 | GAP частично: доменные модули имеют общий релиз; API/worker независимы | Contract tests; выделение Payments по триггеру |
| CN.LCP.05 | API/модульные контракты; нет чтения чужих таблиц, sync допустим | Dependency lint + DB role tests; M6 API ownership |
| CN.MSV.01 | Managed допустим при residency/exit/price | Supplier checklist; запрет CTO снят только после решения |
| CN.ADL.01 | Git→tests→registry→canary | Reproducible pipeline; immutable image digest |
| CN.ADL.04 | Terraform/Ansible, versioned config | Clean environment deployment; secrets отдельно |
| CN.ADL.05 | 1 API за раз, readiness gate; jobs drain | Rolling deployment under load |
| CN.ADL.06 | Image rollback, совместимые DB migrations | Rollback drill; destructive schema rollback не обещан |
| CN.SEC.02 | Private registry/repo, подписанные образы | Unauthorized pull denied; SBOM scan |
| CN.SEC.03 | GAP K8s Secrets: country-local encrypted secret store | Rotation test; M6 Secrets encrypted at rest/RBAC |
| CN.SEC.04 | GAP namespaces: VM/network/DB роли | Tenant isolation test; M6 namespace+network policy |
| CN.OBS.01 | Prometheus metrics per country | Alert/SLI verification |
| CN.OBS.02 | Структурированные masked logs per country | Correlation/redaction tests |

## Assumptions

Окно SLO — rolling30d отдельно NG/KE; низкая нагрузка дополнена синтетикой. Capacity не выведена из числа зарегистрированных пользователей: это стартовая гипотеза, которую CEO/маркетинг уточняют на M1. Load gate не доказывает 50k live viewers или 10M concurrent. Такие кампании не активируются до отдельного нагрузочного профиля/бюджета. Контроли описывают проект, не текущий deployment.

## 12-factor: дополнительные проверки переносимости

Одна кодовая база и версионированные зависимости; конфигурация отделена от образа, секреты поступают из защищённого хранилища страны. Build/release/run разделены, артефакт неизменяемый. БД/PSP/Redis подключаются как ресурсы через конфигурацию. API stateless, порт явно объявлен, горизонтальная конкуренция ограничивается pool/lease. Быстрый старт и graceful shutdown завершают jobs без потери. Dev/prod имеют одинаковые версии движков и миграций; логи идут потоком в местный collector; административные задачи запускаются одноразовыми контролируемыми процессами. Проверка: clean deploy, SIGTERM/retry test, rollback и поиск секретов в image. Это не заменяет непокрытые Kubernetes-пункты чек-листа.
