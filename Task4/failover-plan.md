# План отказоустойчивости и восстановления

Основания: [A1/A3/A5](../sources/README.md), [C03](../Task1/contradictions.md), [ADR-003](adr-003-data-residency.md). CTO управляет инцидентом; Platform primary исполняет, secondary проверяет fencing, Payments lead разрешает возобновление оплаты. Инцидент не разрешает нарушить границу страны.

| Сценарий | Решение / действия | RTO / RPO, цель | Ограничение |
|---|---|---|---|
| API/worker узел | Readiness удаляет backend; другой API принимает запросы; jobs повторяются после lease | ≤30s / 0 committed jobs | Идемпотентность; API на разных узлах |
| DB primary узел | Platform: fence старый writer, promote local sync standby, сменить pool | ≤5min / 0 подтверждённых commit | synchronous_commit=on; при потере standby остановить writes, без скрытого async downgrade |
| Основной DC | CTO: остановить checkout, fence, восстановить местный DR, проверить и перенаправить | ≤60min safe service / ≤5min | Нельзя проверить fencing — нельзя promote; деньги frozen до сверки |
| Вся страна / оба DC | CTO+CEO: закрыть checkout страны; другая cell работает | RTO не гарантирован; цель ≤24h после возврата местной ёмкости / ≤5min при доступном backup | Иностранный PII restore запрещён |
| Redis | Автоматически: L1, ограниченный DB fallback, single-flight, прогрев | ≤15min / кеш восстанавливается | Балансы не зависят от Redis |
| PSP/SMS/курьер | Integrations: CB, bulkhead, durable pending, запрос статуса, договорный manual dispatch | Внешний RTO не подконтролен; наш RPO0 при живой DB | PSP success нельзя подменить нашим 202 |
| Логическая порча | CTO: freeze, PITR в новый local cluster, reconcile | ≤4h / точка до порчи + replay валидных событий | Сохранить evidence; отдельный сценарий от DC 60min |

## DC-runbook на 60 минут

0–5: primary подтверждает отказ по независимым probes/DB, secondary определяет область. 5–10: CTO объявляет инцидент страны, останавливает новые списания и изменение остатков. 10–20: отключить старый writer через power/network и credentials, зафиксировать WAL position/lag. Без проверяемого fence остановиться: два writer опаснее простоя.

20–40: восстановить заранее подготовленный местный DR, применить WAL, проверить schema, row counts, audit sequence и reservations. Фактический RPO измерить по last durable LSN. 40–50: выполнить synthetic browse/order без реального списания, переключить местный LB/DNS с TTL60s. 50–60: контролировать ошибки и очереди. Каталог/история возвращаются; безопасный checkout — только после проверки.

Payments lead сверяет PSP transactions вокруг потерянного окна, не освобождает неизвестные резервы автоматически, восстанавливает ledger корректирующими записями. Незавершённая сверка оставляет деньги frozen и после 60 минут; это ограничение сообщается CEO. RTO safe service не означает автоматическое восстановление всех финансовых операций.

Failback — отдельная операция после синхронизации и тестов. После первого нового commit простого возврата DNS недостаточно: нужен обратный перенос и сверка. Ежемесячно tabletop, ежеквартально DC drill, обязательно перед GO. RTO измеряется от начала отказа, не от первой команды оператора.

## Backup и RPO по данным

| Набор | RPO при отказе DC | Хранение / проверка |
|---|---|---|
| Identity/consent/orders/ledger | ≤5min; при node failure RPO0 | Daily base + continuous WAL, 35d +12 monthly; restore ежемесячно |
| Каталог | ≤5min через WAL; public snapshot ежечасно | Rebuild ≤30min; checkout читает DB |
| Outbox/inbox/notification intents | ≤5min, в той же DB | Replay с dedupe; внешние эффекты проверяются у PSP |
| CEO aggregates | ≤24h | Daily backup, rebuild из orders ≤4h |
| Logs/traces | ≤15min допустимой потери | 14d/7d; финансовый audit хранится в DB отдельно |
| Media | ≤24h | Версионированный local object store, daily replica/checksum |
| Keys/config | 0 для активированных версий | Local encrypted escrow до активации ключа; dual-control restore |

Backup immutable; credentials отдельно от production, ключ отдельно от bucket. Restore в закрытую сеть; применить deletion tombstones перед открытием доступа. Аллокации DR/support включены в бюджет, оферты пока отсутствуют.

## Assumptions

Независимые NG/KE DC и WAL lag≤5min подлежат проверке. Без них заявленные RTO/RPO не подтверждены и GO заблокирован либо требуется пересмотр. PSP-сверка восстанавливает сведения о платежах, но не гарантирует автоматическое восстановление каждого утраченного заказа.
