# ADR-004 — Выбор платёжного провайдера

## Статус и дата

Предложено; 02.11.2026. Учебное решение для старта 12.08.2026. Подписанных согласований нет.

## Контекст и источники

[A1/A4](../sources/README.md) требуют M-Pesa/Flutterwave, [A3](../sources/artifact-03.md) исключает собственную лицензию за 8 недель. [A5](../sources/artifact-05.md) предлагает свою оркестрацию. [C01/C02](../Task1/contradictions.md) ограничивают инженерное время; [A6](../sources/artifact-06.md) требует комиссию ниже 2.5% GMV.

## Решение

NG: licensed Flutterwave local collection. KE: M-Pesa через licensed Paystack. Строим тонкий adapter/ledger/reconciliation, не custody/wallet. [E01–E04](../sources/README.md): collection NG2%, KE M-Pesa1.5%. Модель all-in: NG2.30% (2+.15 налог+.15 payout), KE1.95% (1.5+.30 налог+.15 payout); mix60/40=2.16%. **Надбавки — оценки, не оферты. GO только после письменного all-in<2.5% по каждому rail**, включая фиксированные fees, налоги, FX, payouts и refunds. Международные карты/FX в MVP исключены.

## Альтернативы

NG Paystack1.5%+NGN100 с cap NGN2000/threshold может быть дешевле; MVP требует Flutterwave, резервный адаптер отложен. Прямой M-Pesa: Buy Goods до 0.55% не равен полному marketplace тарифу. План direct all-in0.90%, реализация$12k, поддержка$600/мес. При KE GMV$100k экономия$1050/мес, после поддержки$450; окупаемость≈26.7 месяца. Пересмотреть M6. ZA: Paystack EFT2% потенциально проходит с надбавками; карты 2.9%+ZAR1 без VAT уже не проходят — до оферты маршрут не активировать.

## Последствия

Выплаты продавцу после settlement; same-day требует отдельной ликвидности и CFO. Локальный settlement Flutterwave по pricing обычно next day, но решает договор. Refund остаётся pending до подтверждения PSP. Fixed fees при низком AOV могут нарушить cap; средняя комиссия не скрывает дорогой rail. Защита: durable intent, inbox/outbox, уникальный operationID, server-side verification и ежедневная сверка.

## Обратимость и пересмотр

Provider adapter и merchant reference отделены от домена; callback schemas версионированы. Новый rail: sandbox → canary → settlement reconciliation → рост трафика. Один active attempt на intent; unknown сохраняет резерв и не разрешает автоматический повтор у другого PSP. На M6 пересмотреть стоимость/качество; ledger экспортируется в стандартном формате.

## Assumptions

Лицензии, API, DPA, processing locations и Net45 не подтверждены. Тарифы просмотрены 02.11.2026, не являются исторической офертой августа. Без fee/legal gates — NO-GO. Две дополнительные страны M12 не выбраны. CFO строже учебного≤2.5%, поэтому применяем<2.5%.

## Связанные артефакты

[TCO](../Task2/tco-model.xlsx), [payments SLO](../Task3/slo/payments.md), [residency](../Task4/data-residency-map.md).
