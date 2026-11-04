# Quality Attribute Scenarios

Шесть полей на сценарий по [шаблону](../templates/qas-template.md). Источники: [A1/A2/A3/A5](../sources/README.md), [NFR](nfr-registry.md); решения ограничивают [C03/C07](../Task1/contradictions.md).

| ID | Источник стимула | Стимул | Среда | Артефакт | Реакция | Мера реакции |
|---|---|---|---|---|---|---|
| Q01 availability | Отказ оборудования | Упал один API | Пик 100read+10order RPS/country | LB/API pool | Readiness удаляет экземпляр, второй обслуживает | Failover≤30s; errors<1% в 60min тесте;30d99.9% проверяется отдельно |
| Q02 latency | Покупатель | GET товара | 3G1.6Mbps,RTT150ms,1%loss; прогретый/холодный кеш | PWA/API/catalog | Возвращает компактный товар и adaptive image | ServerP99≤500ms; first productP75≤2s; минимум 100k samples |
| Q03 throughput | Рекламная кампания | Burst×2 на 5min | Одна страна, PSP slow | API/worker/Postgres | Bounded queues, bulkheadPSP, 202pending | 200read+20order RPS; errors<1%, backlog возвращается<60s за 10min |
| Q04 recovery node | Primary DB | Процесс/узел недоступен | Два локальных синхронных узла | Orders/ledger | Fence, promote synchronous standby | RTO≤5min, RPO0 подтверждённых commit; тест ledger invariants |
| Q05 recovery DC | DC/network | Потеря основного DC | Локальный DR доступен, WAL lag≤5min | Country cell | Manual fence+restore, сверка неизвестных платежей | RTO≤60min для safe service; RPO≤5min; оплата frozen до reconcile |
| Q06 integrity | PSP | Callback дублируется 10 раз, затем out of order | Сеть нестабильна | Inbox/payment ledger | Unique event/operation IDs, monotonic state machine | Ровно 1 проводка,0 повторных списаний,100% следов в audit |
| Q07 privacy | Маркетолог | Импорт 410k номеров без evidence | Production | Consent/notification policy | Карантин, запрет campaign до legal approval | 0 отправок; audit denial≤1s; тест export/access rules |
| Q08 dependency | SMS/PSP | Тайм-аут и 5xx | Пик, другой канал исправен | Provider adapter | CB/bulkhead, retry только безопасных операций | CB opens при 50% fail из≥20/30s; half-open30s;catalogP99≤500ms |

## Assumptions

Пороги — приемочные цели, не результаты проведённого k6/chaos-теста. DC recovery оплаченных intents может требовать более долгой сверки, поэтому RTO safe service не обещает автоматическое возобновление списаний без финансового разрешения. Для Q02 фиксируется модель устройства, browser и холодный/тёплый профиль отдельно.
