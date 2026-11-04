# ADR-003 — Стратегия размещения данных

## Статус и дата

Предложено; 02.11.2026. Учебное решение для старта 12.08.2026. Подписанных согласований нет.

## Контекст и источники

[A3](../sources/artifact-03.md) обещает детали через 4–6 недель; [A7](../sources/artifact-07.md) усиливает локализацию, [A5](../sources/artifact-05.md) предлагает межрегиональный active-active. [C03/C06](../Task1/contradictions.md) требуют устранить foreign PII fallback и рассылку без основания.

## Решение

Country cells NG/KE, затем ZA: PII, orders, ledger, logs, backup и ключи внутри страны. Публичный каталог может быть глобальным после очистки PII. Страна определяется верифицированным профилем, общей customer DB нет. Общий образ приложения, IaC provider adapter и таблица разрешённых locations. PostgreSQL sync standby локально; async WAL в другой DC той же страны, lag≤5min. DR вручную с fencing; при потере страны checkout останавливается.

## Альтернативы

Централизация в ZA упрощает эксплуатацию, но не соответствует консервативной NG/KE policy. Global active-active экспортирует PII и увеличивает стоимость/сложность. Ожидание юриста без разработки срывает восемь недель. Разрабатываем переносимые контуры и безопасные модули до разрешения production flows.

## Последствия

TLS1.2+, AES256, местный keystore, rotation90d, JIT/MFA и dual control восстановления. Phone/address маскируются; hash ID остаётся псевдонимом. Предложенная retention: финансовые данные 7 лет, logs14d, traces7d, backup35d+12monthly. Внешние PSP/CDN/WhatsApp/support требуют DPA и legal transfer approval; до этого маршрут закрыт. Это ограничивает географию и каналы запуска.

## Обратимость и пересмотр

**Обратимость:** ответ юриста меняет policy, retention и allowlist процессоров, а не доменную модель. Разрешённый перенос: encrypted export → restore → checksums/row counts → shadow reads → единственный writer → старая копия read-only → удаление по retention. До cutover возможен возврат маршрута; после новых записей нужны обратная репликация и сверка. Пересмотр 19.09 до GO; перенос за 2 дня — цель для заранее подготовленного compute, не обещание межстранового failover.

## Assumptions

In-country — политика проекта, не универсальный запрет закона; [E11–E13](../sources/README.md) требуют юридической интерпретации. Местные независимые DC ещё не подтверждены. Без них RTO/RPO не обещаем. Все сроки хранения утверждает юрист.

## Связанные артефакты

[Residency map](data-residency-map.md), [регионы](cloud-regions-comparison.md), [failover](failover-plan.md), [контейнеры](c4-container.png).
