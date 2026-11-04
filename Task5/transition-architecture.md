# Переходная архитектура

Основания: [A1/A4/A5/A6](../sources/README.md), [C01/C02/C03/C07](../Task1/contradictions.md), [ADR-001](../Task2/adr-001-architecture-style.md). Это greenfield Africa Delivery: предыдущие спринты и монолит AdScale относятся к другому кейсу.

| Состояние | Код / данные | Переход и критерий | Обратимость |
|---|---|---|---|
| Сейчас | Нет production, противоречивые требования | Scope, договоры, country routing, API contracts | Изменение конфигурации до приёма данных |
| MVP | Go-модули, 2 cells, PostgreSQL schemas, Redis, API/worker | Измерить P99/cost/errors, запретить чужие записи, проверять денежные инварианты | Canary и app rollback; DB expand/contract |
| M6 | Подготовка ZA; кандидат на выделение Payments/Notifications | >70%CPU или P99 breach после оптимизации; >2 независимых релизов Payments в неделю; расчёт миграции$60k | Shadow reads, сверка, один writer; остановка cutover при расхождении |
| M12 | 5 cells; Commerce/Payments/Notifications/Fulfilment разделены по обоснованию | Новый штат/бюджет; legal gates B2B/ПВЗ; K8s при готовности эксплуатации | Versioned contracts, независимое владение данными, exit plan адаптеров |

Выделение Payments: стабилизировать module API и ledger invariants; создать местную service DB; snapshot + CDC/outbox catch-up; сравнить количества, checksums и суммы по валютам; выполнить shadow reads и canary без двойных списаний. Затем кратко остановить writes, дождаться drain, переключить единственный writer. Старый модуль обращается к новому через API; старую копию удалить после контрольного срока.

До смены writer rollback выполняется маршрутизацией. После новых записей требуется обратный catch-up и сверка; простой flip DNS недопустим. Dual write в две БД не вводим. Outbox доставляет at-least-once, consumer дедуплицирует eventID. Однократность денег обеспечивается уникальной бизнес-операцией, а не обещанием exactly-once сети.

PostgreSQL jobs заменяется брокером при необходимости нескольких изолированных consumer groups/replay либо когда измеренная нагрузка очереди после настройки мешает OLTP. Kafka требует отдельной сметы и компетенций. Mesh не появляется автоматически вместе с первым сервисом.

## Assumptions

Будущие сервисы — кандидатные границы, не обязательство создать 40 сервисов. 10M concurrent требует отдельной модели: 10M зарегистрированных в TCO это не доказывает. Поздний выбор сохраняет цену миграции, поэтому $60k underbuild явно учтены как сценарий. [Roadmap](roadmap.md) определяет gates расширения.
