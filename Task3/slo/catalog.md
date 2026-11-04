# OpenSLO-style contract: catalog

## Metadata

name: catalog-country; owner: Commerce lead; version: 1; window: rolling 30 days; scope: NG и KE отдельно. Источники: [A1](../../sources/artifact-01.md), [A2](../../sources/artifact-02.md), [N01/N05](../nfr-registry.md). Это Markdown по модели OpenSLO, не исполняемый YAML.

## SLI

Availability = good / eligible. Eligible — валидные GET каталога на country ingress, включая внутренние 5xx, тайм-ауты и capacity429. Good — 2xx/304 с валидным ответом за ≤1s и допустимой свежестью ≤5min. Исключаются только auth/validation4xx и доказанные abuse429 по контрактной квоте; planned maintenance не исключается. Статический CDN hit считается через edge telemetry без PII; отдельный synthetic probe на страну каждые 30s выявляет недоступность до ingress. Пустое окно не считается 100%: статус unknown.

Latency SLI — P99 server duration≤500ms на тех же eligible, отдельно cache-hit/miss; failed responses остаются в error SLI. UX first product P75≤2s проверяется отдельно на заданном 3G-профиле.

## SLO и error budget

Availability≥99.9% за 30d на страну. Бюджет 0.1% eligible requests (10k errors на 10M запросов). 43.2 минуты за 30d — только временной эквивалент при равномерном трафике, не фактический request budget. При отсутствии трафика доступность определяет синтетика, не деление 0/0.

## SLA и действия

Предложенное договорное обязательство пилота 99.9% после письменного исключения инвестора из 99.99%; пока подписи нет, публичного SLA нет. При исчерпании бюджета freeze feature releases, incident review≤2 дней, CEO уведомляет клиентов по договору. Компенсация/credits согласуются CFO отдельно, в модели не выдуманы. Burn rate14.4× в 1h+5min или 6× в 6h+30min вызывает page.

## Assumptions

Catalog stale допустим только для просмотра. Checkout перепроверяет цену/остаток в primary; маркировка «обновлено» не является гарантией наличия. Offline-кеш не засчитывается как успешная серверная операция. [C01/C07](../../Task1/contradictions.md) объясняют ограниченный пилот.
