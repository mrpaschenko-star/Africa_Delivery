# FMEA — Africa Delivery, версия 1

Дата 02.11.2026, автор Solution Architect. Основание [исходный шаблон](../sources/fmea-source-template.md), [A1/A3/A5](../sources/README.md), [C03/C07](../Task1/contradictions.md). S:1 незначительно…10 катастрофа; O:1 редко…10 часто; D:1 легко обнаружить…10 невозможно. RPN=S×O×D; **>100 требует первоочередной митигации**. Оценки до мер экспертные; после теста пересчитать, а не выдумывать остаточную вероятность.

| ID | Компонент/отказ | Эффект и причина | S | O | D | RPN | Обнаружение/текущий план контроля | Мера / паттерн | Владелец / статус |
|---|---|---|---|---|---|---|---|---|---|
| F01 | PostgreSQL primary down | Checkout/ledger недоступны; node failure | 9 | 4 | 2 | 72 | probes, replication lag | Sync standby, fencing, restore drill | Platform / до GO |
| F02 | PSP timeout после debit | Риск второго списания; unknown response | 10 | 6 | 5 | 300 | unknown age, settlement reconcile | Durable intent, идемпотентность; no blind retry, CB | Payments / приоритет |
| F03 | SMS/WA5xx | Клиент не знает статус | 6 | 7 | 3 | 126 | receipt latency, backlog | Bulkhead, bounded retry+jitter, consent-aware fallback | Integrations / приоритет |
| F04 | Курьер API/Sendy недоступен | Нет доставки оплаченного заказа | 8 | 6 | 4 | 192 | stale shipment state, partner poll | CB, contractual manual dispatch, зона закрыта без партнёра | CEO+Integrations / приоритет |
| F05 | Redis down/stampede | DB saturation/рост P99 | 7 | 5 | 2 | 70 | hitrate, pools,CPU | Cache-aside, single-flight, jitterTTL, ограниченный fallback в DB | Commerce / до GO |
| F06 | DC потерян | Остановка страны, WAL gap | 10 | 3 | 3 | 90 | external probes, lag, DC contact | In-country DR, fence, financial hold | CTO+Platform / до GO |
| F07 | Ошибочная release/migration | Общий blast radius монолита | 9 | 5 | 3 | 135 | canary metrics, schema checks | Expand/contract, rollback app, backup | Tech lead / приоритет |
| F08 | Consent bypass/PII export | Штрафы, остановка бизнеса | 10 | 4 | 7 | 280 | policy test, egress/audit review | Default deny, masked logs, legal gate, keys local | Legal+Security owner / приоритет |
| F09 | Шторм OTP/очереди | Срыв$5000 и starvation | 8 | 6 | 3 | 144 | spend forecast, queue age | Rate limit, budgets, separate transaction pool | Platform+CFO / приоритет |

До pilot: fault/replay tests F02/F03/F07, договорный маршрут F04, residency review F08 и budget test F09. Даже RPN≤100 не отменяет обязательные меры для S9–10: primary/DR остаются release gates. Контроли пока спроектированы, не внедрены. Следующий review — перед GO 12.10 в учебном календаре, затем после инцидента/ежемесячно.

## Assumptions

O — порядковая оценка, не процент отказа. Не используем RPN как денежное математическое ожидание. CB threshold50% ошибок в≥20 вызовах/30s, half-open после 30s; connect200ms, total3s у PSP worker, не удерживая HTTP checkout. Retry GET/status с full-jitter; debit только с тем же подтверждённо поддерживаемым idempotency key.
