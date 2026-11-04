# Наблюдаемость и реакция

[Схема сбора](observability.png), [исходник](observability.puml). Источник [A1/A5](../sources/README.md), ограничения [C03/C06/C07](../Task1/contradictions.md). По стране: Prometheus+Alertmanager+Grafana, OpenTelemetry Collector, Loki, Tempo; retention metrics30d, masked logs14d, traces7d. Компоненты небольшие, лимитированные, размещены в country cell. Структурированный audit денег хранится отдельно от debug logs. Global view только агрегаты без phone/IP/orderID; incident notification содержит country/service/incidentID, не payload заказа.

| Golden signal | Метрики | Связь с SLI / действие |
|---|---|---|
| Latency | histogram HTTP, order commit, PSP terminal latency, notification receipt age | N05P99 и три SLO; slow PSP не маскируется быстрым 202 |
| Traffic | eligible requests, intents, callbacks, delivery intents | Знаменатели SLI, профиль 100+10RPS; country/provider срезы |
| Errors | HTTP5xx/timeouts/capacity429, unknown, duplicate-ledger, missing receipt | Числители bad; double debit page сразу |
| Saturation | CPU/RAM, DB connections/locks/IO, disk/WAL, oldest outbox, replication lag | CPU>70%15min, disk>80%, lag>60s warn/>300scritical |

Ingress и CDN публикуют counters; приложение связывает span traceID с masked structured log и async outbox causationID. Sampling traces1% successful,100%error с cap; высококардинальные orderID не metric labels. Phone/email/address/token никогда не пишутся в telemetry; traceID сам по себе псевдоним, доступ только дежурным. На общем dashboard нет raw IP, user agent или customer IDs. Публичный CDN требует договорного контроля своих access logs/processing, не только удаления PII из origin payload.

SLO вычисляется отдельно по NG/KE и каждому rail; good/eligible из ingress+business events, без averages percentiles. Ошибки самого экспортера дают alert telemetry missing≤2min, не ложные 100%. Синтетика каждые 30s тестирует публичный путь; paid canary ежедневно с тестовым merchant согласно PSP. Burn14.4× в 1h+5min и 6× в 6h+30min вызывает page; уведомления>15min и payment unknown>15min имеют отдельные alerts.

Runbook: primary ack≤5min, secondary при 5min, CTO incident commander≤15min; остановить опасный rail, сохранить evidence, инициировать сверку. Слабый сигнал→ticket, P1→page, не каждый warning будит шестерых. Weekly SLO/cost review, postmortem≤2 рабочих дней. Release freeze при исчерпании budget, кроме security/reliability fixes. [Дежурства](../Task5/team-and-on-call.md) и [failover](../Task4/failover-plan.md) задают владельцев.

## Экономика дополнительной девятки

Расчёт [Availability в TCO](../Task2/tco-model.xlsx) — оценка fixed infra для одной и той же продуктовой системы, без людей/сообщений; это не оферта поставщика и не гарантия SLO.

| Цель | Бюджет минут/год | Fixed infra/мес | Доплата к предыдущей/год | Сокращение минут/год | Break-even$/мин |
|---|---|---|---|---|---|
| 99% | 5256 | $1600 | — | — | — |
| 99.9% | 525.6 | $2850 | $15000 | 4730.4 | $3.17 |
| 99.99% | 52.56 | $12000 | $109800 | 473.04 | $232.12 |

При$12000/мин исчерпание каждого budget означает stress выручки$63.072M/$6.3072M/$0.63072M. Поэтому дополнительная девятка экономически разумна в пике, но peak revenue не постоянный денежный убыток и вероятность не равна budget. Нет оснований включать этот stress в ожидаемый TCO. Денежный лимит$5000 всё равно не позволяет купить предложенную$12000 конфигурацию; нужны финансирование и подтверждение аварийные испытания, либо явное снижение обязательства. Поставщик compute99.99% не делает end-to-end99.99%.

Один DC-инцидент с RTO60min превышает временной эквивалент месячного бюджета99.9% (43.2min). Поэтому такой отказ может нарушить даже SLO пилота: нельзя исключать его из знаменателя. Приоритет восстановления внутри страны и финансовая корректность сохраняются; CEO принимает риск нарушения, а для более строгого обязательства нужны сокращение RTO/дополнительная local redundancy и новый бюджет.

## Assumptions

Инструменты входят в infra/SaaS allocation, retention — предложение до legal. Метрики финансов не содержат сырых реквизитов; debug access JIT+MFA. Наблюдаемость и DR проверяются отдельно; настоящее 30dSLO появится только после эксплуатации.
