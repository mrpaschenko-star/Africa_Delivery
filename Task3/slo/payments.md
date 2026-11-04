# OpenSLO-style contract: payments

## Metadata

name: payments-country; owner: Payments lead; version: 1; window: rolling30d; NG/KE отдельно, дополнительно срез по PSP. Основание [A1/A3](../../sources/README.md), [N02/N03/N14](../nfr-registry.md), [ADR-004](../../Task5/adr-004-payment-provider.md).

## SLI

Acceptance = durable payment-intent acknowledgements≤800ms / eligible authenticated requests. ACK допускается только после commit intent+idempotency key+outbox. Ошибки и тайм-ауты нашей системы в знаменателе, в том числе fail-closed при неизвестном состоянии. Validation4xx исключены; capacity429 включены. Повтор с тем же ключом и payload возвращает прежний intent; конфликт payload409 не создаёт второй платёж.

Outcome = intents с подтверждённым terminal success либо authoritative declined≤15min / intents, требующие решения PSP, после завершения 15min observation lag. Pending/unknown и provider unavailable — bad, локально сфабрикованный decline не улучшает показатель. Customer abandonment до согласия на платёж исключён и измеряется отдельно; бизнес declined входит в resolved outcome, но не в conversion-success metric. Unknown reconciled/age, duplicate-charge count и successful-payment rate публикуются отдельно. Synthetic transaction ежедневно дополняет реальные данные; нулевой знаменатель=unknown.

## SLO и error budget

Acceptance≥99.9%, outcome≥99.5%, double debit=0. Для 1M eligible budgets1000 и 5000 соответственно, разные знаменатели не складываются. Временные эквиваленты 30d:43.2 и 216min при равномерной нагрузке. Синхронный запрос не ждёт внешний PSP; клиент получает pending и опрашивает статус. Внешний PSP может нарушить outcome при здоровом API — это видно в SLI.

## SLA и действия

SLA-предложение: durable acceptance99.9%, возврат статуса pending с безопасной сверкой; срок settlement/refund по договору rail, а не «мгновенно». Outcome99.5% — внутренний SLO до согласования партнёра; не обещание всех платежей успешными. При unknown>15min alert, при любой duplicate ledger — P1, stop affected rail, сверка и финансовый разбор. Burn alerts как у каталога, freeze при исчерпании бюджета. Компенсации/ответственность требуют CFO/PSP agreement; SLA99.99 ещё не принят.

## Assumptions

PSP поддерживает merchant reference/idempotency и запрос статуса; неподдерживающий маршрут отключается. Callback inbox дедуплицируется по PSP+eventID, ledger по operationID, корректировка — новой обратной записью. HTTP timeout не разрешает автоматически списать через другой PSP. Outage DC RPO≤5min может потерять intent: checkout замораживается до сверки, RPO0 денег не объявляется. [Failover](../../Task4/failover-plan.md).
