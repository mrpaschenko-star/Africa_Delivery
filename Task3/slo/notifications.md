# OpenSLO-style contract: notifications

## Metadata

name: notifications-country; owner: Integrations lead; version: 1; window: rolling30d; отдельно страна/канал. Источники: [A2](../../sources/artifact-02.md), [A3](../../sources/artifact-03.md), [N04](../nfr-registry.md).

## SLI

Delivery = valid delivered receipts≤5min / committed notification intents с истёкшим 5min observation lag. Intent атомарно создаётся с outbox бизнес-события, provider acceptance не заменяет delivery receipt. Если канал не предоставляет delivery receipts, его метрика отдельно называется handoff и не выдаётся за доставку. Bad: отсутствие receipt, provider timeout, внутренний backlog. Исключены только opt-out/невалидный адрес до создания intent; эти отказы учитываются отдельным счётчиком. Provider invalid-destination после acceptance остаётся bad. Traffic-zero=unknown.

## SLO и error budget

≥99% delivered за 5min; бюджет 1% intents,1000 на 100k; 432min/30d лишь эквивалент равномерной нагрузки. Queue oldest age<60s, retry count и цена/SMS отслеживаются отдельно. Transactional traffic имеет отдельный pool и приоритет выше marketing. Нет базовой рекламы по купленным 410k номерам ([C06](../../Task1/contradictions.md)).

## SLA и действия

Предложение SLA пилота — статус заказа доступен в кабинете, доставка сообщений best effort с внутренним SLO99%; SLA внешнего канала и credits согласуются отдельно. Превышение 5min запускает backoff, при>15min или burn14.4× page дежурному; support сообщает клиенту при обращении. Retry: 1/2/4/8/16/32s с jitter, затем durable delay≤24h, max10 attempts; устаревшие OTP не отправлять. SMS fallback только при разрешённой цели, исключая двойной маркетинг. Факт недоставки не отменяет заказ и не меняет ledger.

## Assumptions

$0.05/заказ покрывает средние 2SMS+1WA, включая OTP/retries; лимит месячных расходов контролируется. На аномальном OTP abuse — rate limit по устройству/телефону, не неограниченный оплачиваемый retry. Raw phone/log остаются in-country, внешняя передача требует legal gate. [ADR-003](../../Task4/adr-003-data-residency.md).
