# ADR-002 — Стратегия кеширования

## Статус и дата

Предложено; 02.11.2026. Учебное решение для старта 12.08.2026. Подписанных согласований нет.

## Контекст и источники

[A2](../sources/artifact-02.md) требует первый товар<2s на нестабильной сети; [A6](../sources/artifact-06.md) ограничивает compute, [A3](../sources/artifact-03.md) запрещает нерассмотренные потоки PII. [C03/C06](../Task1/contradictions.md) требуют отделить публичное чтение от персональных данных.

## Решение

Кешируем публичный каталог cache-aside в Redis каждой страны: product TTL60s±20%, category240s±20%, negative10s. In-process L1≤5s для популярных публичных товаров. Public CDN изображений immutable/versioned TTL1 день; cache-control account/checkout=no-store. PWA публичный browse≤24h с отметкой offline, не персональные заказы/платёжные реквизиты. Цена/stock в кеше ориентировочны; checkout атомарно проверяет authoritative PostgreSQL. Баланс, reservation и состояние оплаты в Redis не храним как источник истины.

## Альтернативы

Только PostgreSQL дешевле на старте, но burst чтения отнимает capacity у checkout. Redis для всего состояния быстрее, но усложняет корректность и восстановление денег. Глобальный Redis с PII нарушает консервативную country policy. Выбран локальный восстанавливаемый кеш, допустимо потерять его содержимое.

## Последствия

Catalog write пишет row/version+outbox одной транзакцией. Worker удаляет/обновляет кеш по monotonic version; старое событие не откатывает новую версию. TTL ограничивает stale при потере invalidation; max допустимого catalog stale5min, после этого 503. Single-flight и jitter против stampede; при падении Redis ограниченный fallback в DB, load shedding и CB, чтобы не уронить checkout.

## Обратимость и пересмотр

Прогрев top500 товаров из безопасного snapshot до readiness, rate≤20reads/s; полная база 5000SKU асинхронно. Версионированный namespace позволяет переключить формат и удалить старое после TTL. Пересмотр в M6 либо hitrate<80%/P99>500ms: сначала профиль/индексы, затем capacity. CDN/Redis заменяются через adapter без изменения доменной модели.

## Assumptions

Локальный Redis входит в$2850 fixed infra. TTL/прогрев — исходные параметры для load test. При полной недоступности DB допускается только marked browse, нельзя подтвердить заказ из offline кеша. Это согласованная деградация только после sponsor waiver, пока его нет.

## Связанные артефакты

[NFR](nfr-registry.md), [Q02/Q03/Q08](quality-attribute-scenarios.md), [C4](../Task4/c4-container.png).
