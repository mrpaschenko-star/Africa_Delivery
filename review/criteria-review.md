# Проверка Sprint 9 по всем критериям

Дата: **02.11.2026**. Проверен комплект Africa Delivery, подготовленный с нуля по заданию и [приложениям](../sources/README.md). «Выполнено» ниже означает наличие и содержательное покрытие учебного артефакта. Это **не** подтверждение работы production, подписанных договоров или достигнутого SLA.

## Общие требования

| Критерий | Результат / свидетельство |
|---|---|
| Пять директорий с README-инвентарём | Выполнено: [Task1](../Task1/README.md), [Task2](../Task2/README.md), [Task3](../Task3/README.md), [Task4](../Task4/README.md), [Task5](../Task5/README.md) |
| Краткий заглавный README | [Обзор](../README.md), 1 страница в фиксированном профиле A4 |
| Русский Markdown, kebab-case, разрешённые форматы | MD, PlantUML/PNG; XLSX/PPTX — прямо требуемые исключения. SVG/PDF/DOCX среди результатов нет |
| Диаграммы diagram-as-code и PNG | 8 пар, локально скомпилированы; C4-библиотека локальная, интернет для рендера не нужен |
| Ссылки | Локальные пути и Markdown-якоря проверены [валидатором](validation-results.json); веб-URL — источники, не гарантия их будущей доступности |
| Единый шаблон и нумерация ADR | ADR-001…004, одинаковые 8 разделов [шаблона](../templates/adr-template.md) |
| Источники и реальные противоречия | [C01–C08](../Task1/contradictions.md), источники A1–A7 с пунктами; трассировка решений ниже |
| Явные допущения | Раздел Assumptions во всех содержательных документах Task1–Task5 |
| Объём | [Проверка страниц](page-checks.json): Canvas1, stakeholder1, ADR по1, Vision2≤3; полный текст без обрезки |
| Приложения А/Б/В | В переданных файлах отсутствуют; использованы открыто обозначенные [рабочие шаблоны](../templates/README.md), без выдуманной ссылки на отсутствующий оригинал |

## Task 1 — анализ заинтересованных сторон

| Критерий | Результат / свидетельство |
|---|---|
| Интерес, влияние, приоритет конфликта, коммуникация | [11 групп стейкхолдеров](../Task1/stakeholder-matrix.md); полномочия CFO/юриста и инвестора разделены |
| Диаграмма influence-interest | [PNG](../Task1/stakeholder-map.png) / [PlantUML](../Task1/stakeholder-map.puml) |
| ≥5 настоящих противоречий | [8 строк](../Task1/contradictions.md), обе стороны, риск, владелец и рекомендация; условные конфликты явно обозначены |
| Canvas на1странице | [Цели, ценность, ограничения, риски, драйверы и допущения](../Task1/architecture-canvas.md) |
| Ровно5 вопросов | [Адресат, блокируемое решение, дедлайн, fallback](../Task1/open-questions.md); ответы не выдуманы |
| Понятность без чтения исходников | Указаны несовместимые наборы: срок/своя логистика, freeze/допнайм, foreign replication/in-country; цифры пользователей не названы самостоятельным противоречием |

## Task 2 — решение и экономика

| Критерий | Результат / свидетельство |
|---|---|
| 2–3 разных варианта, единые числовые критерии | [A монолит, B SOA, C CTO](../Task2/options-comparison.md): сроки, люди, стоимость, сложность, риск; заключение4строки |
| TCO5лет на каждый вариант, включая людей | [7-листовая модель](../Task2/tco-model.xlsx), отдельные TCO-A/B/C, ФОТ, platform, дежурства, management, T0, audit |
| CPO старт иM12 | A $6.72/$3.50, B $6.72/$3.57, C $14.31/$4.47; определение состава в [методике](../Task2/tco-methodology.md) |
| Стоимость overbuild и underbuild | C−A=$759k за6месяцев при50kregistered/10korders; underbuild$60k ($69k с резервом), формулы в XLSX |
| Бюджет CFO без ошибки шаблона | $5000 вместо$9000; каждый из первых6месяцев, SaaS/сообщения/резерв включены; [ошибка исходника](../sources/tco-template-extract.md) |
| ADR-001 по шаблону,1–2страницы | [Выбор стиля](../Task2/adr-001-architecture-style.md), альтернативы и негативные последствия |
| C4 Context с обязательными системами и подписями | [Диаграмма](../Task2/c4-context.png): M-Pesa, Flutterwave, Paystack, Sendbox, Sendy, WhatsApp, SMS/USSD; Sendy не считается подтверждённым поставщиком |
| Use Case Diagram | [Сценарии MVP](../Task2/use-cases.png), внешние роли и включаемые проверки |
| Architecture Vision≤3страниц | [2страницы](../Task2/architecture-vision.md): проблема, scope, решение, качество, экономика, переход, gates |
| Один слайд | [PPTX](../Task2/nairobi-slide.pptx), [PNG](../Task2/nairobi-slide.png); редактируемые текстовые элементы,16:9 |
| Речь1200–1500слов,8–10минут | [1212слов](../Task2/nairobi-script.md) в теле речи; при 125–150 слов/мин ≈8.1–9.7 минуты |
| Позиция CTO рассмотрена по существу / late binding | Расчёт24недели/14человек/$39 675tech против8недель/6/$4025; преимущества SOA/микросервисов признаны; триггеры выделения модулей заданы |

## Task 3 — качество и доступность

| Критерий | Результат / свидетельство |
|---|---|
| Реестр с ID/category/metric/target/test/source | [14 НФТ](../Task3/nfr-registry.md), приоритеты и способы проверки |
| Полный CN checklist | Все16ID сопоставлены; Kubernetes/namespace/Secrets gaps и частичная независимость модулей обозначены, сертификат marketplace не заявлен; добавлены12-factor controls |
| Три OpenSLO-style контракта в Markdown | [Catalog](../Task3/slo/catalog.md), [Payments](../Task3/slo/payments.md), [Notifications](../Task3/slo/notifications.md); SLI, denominator, target, window, SLA и последствия |
| Разделение внутренней и внешней надёжности | Durable acceptance99.9% отдельно от terminal outcome99.5%; receipt не подменён provider acceptance; maintenance/capacity errors не скрыты |
| ≥5 QAS по6полей | [8сценариев](../Task3/quality-attribute-scenarios.md), availability, P99, throughput, RTO/RPO, privacy и денежная корректность |
| ≥5 FMEA с внешними отказами | [9строк](../Task3/fmea.md); S/O/D1–10 и RPN; все произведения проверены, >100 приоритетны |
| ADR-002: что/где/TTL/invalidation | [Локальный кеш](../Task3/adr-002-caching-strategy.md): cache-aside, версии/outbox, jitter, warming, цена/остаток проверяются в checkout |
| Наблюдаемость и диаграмма сбора | [4 golden signals](../Task3/observability.md), metrics/logs/traces, tools, country/PSP SLIs, alerts; [схема](../Task3/observability.png) |
| Экономика девяток / error budget | 99→99.9→99.99: доплата$15k/$109.8k вгод; break-even$3.17/$232.12 за минуту; stress выручки отдельно от base TCO |
| Честное отношение к требованию99.99% | Не выполнено системой и не объявлено выполненным: предложение пилота требует waiver. RTO60min может исчерпать месячный budget99.9%; риск явно отмечен |

## Task 4 — размещение и право

| Критерий | Результат / свидетельство |
|---|---|
| NG/KE/ZA и категории данных | [Residency map](../Task4/data-residency-map.md): subject country, storage, processing, providers, basis, controls, transfer |
| Достоверное против предположенного | Правовые нормы не отождествлены с безусловной локализацией; in-country — консервативная политика до заключения |
| Consent/410k/партнёрские потоки | Карантин базы, цель/основание, PSP/WA/CDN/support DPA; local origin не скрывает внешнюю обработку |
| Четыре требуемых cloud-варианта, числа | [AWS/GCP/Azure/Layer3](../Task4/cloud-regions-comparison.md), SKU/корзина, RTT, SLA; оценки и вторичные цены помечены; дополнительно Kenyan RFP |
| ADR-003, маскирование/шифрование/ключи/replication/retention | [Единый ADR](../Task4/adr-003-data-residency.md); шифрование не является разрешением экспорта |
| Явная обратимость | Policy/IaC/adapter, controlled migration с единственным writer и сверкой, пересмотр после юриста |
| C4 Container по регионам | [NG/KE/ZA](../Task4/c4-container.png), источники данных и внешние flows |
| Deployment и failover | [Deployment](../Task4/deployment-diagram.png), [runbook](../Task4/failover-plan.md): владелец, fencing, время, RPO, финансовая сверка, no foreign fallback |
| Отказ всей страны / logical corruption | Отдельные сценарии; нет обещания ограниченного RTO при отсутствии законной местной ёмкости |

## Task 5 — возможности и реализация

| Критерий | Результат / свидетельство |
|---|---|
| Capability Map L1/L2, не список экранов | [9L1 и L2](../Task5/capability-map.md), Build/Buy/Partner, стоимость, риск |
| Value Stream с capabilities | [Диаграмма](../Task5/value-stream.png), C1–C8 по потоку, C9 поддерживает весь поток; доставка только после подтверждения оплаты |
| Capability→service→owner→dependency | [Таблица](../Task5/services-per-capability.md); модуль MVP не выдаётся за отдельный микросервис |
| Числовое обоснование Build/Buy/Partner | Своя логистика≥$96k против$8kадаптера, экономия$88k не отменяет физическую стоимость доставки; direct M-Pesa payback≈26.7мес при допущениях |
| Все29функций и сокращение scope | [Таблица29строк](../Task5/feature-triage.md): 6частично,22отложены,1исключена; причины/сроки указаны |
| Roadmap M1/M2/M6/M12 | [Scope/команда/стоимость](../Task5/roadmap.md) и [PNG](../Task5/roadmap.png); ось разработки отделена от TCOмесяцев эксплуатации |
| ADR-004 с географией/комиссией | [NG Flutterwave, KE Paystack→M-Pesa, ZA conditional](../Task5/adr-004-payment-provider.md); all-in gate<2.5%, tax/FX/payout учтены как оценки |
| Transition сейчас→MVP→M6→M12 | [Переход](../Task5/transition-architecture.md), ownership, outbox, backfill, shadow, single writer, rollback limits |
| Реестр рисков со всеми полями | [13рисков](../Task5/risk-register.md), вероятность, влияние, мера, владелец, наблюдаемый триггер |
| Организация и24/7 при6контракторах | [Роли/таймзоны/6-недельная ротация](../Task5/team-and-on-call.md), primary+secondary, компенсация, отсутствие/перегрузка, supplier escalation |
| Найроби: содержательная готовность | Один слайд/речь, цифры для CFO, trade-offs для CTO/инвестора, пять вопросов; решения не объявлены полученными |

## Трассировка ключевых решений

| Решение | Конфликт / точный источник | Артефакт и проверка |
|---|---|---|
| Монолит, шесть человек, PostgreSQL | C01/C02/C08; A5 P21/P22/P24 против A6 P15/P17 | ADR-001, TCO, capability allocation10product+2platform person-month |
| Ограниченный scope и отложенная криптолояльность | C04; A4 P20/P37 против A1 P26 | Vision, feature29, roadmap |
| $5000 и помесячный cap | C05; ячейки шаблона против A6 P11–P14 | Monthly, cost sensitivity, procurement gates |
| Локальный кеш только публичных данных | C03/C06; A2 P27, A3 P10/P11, A5 P23 | ADR-002, Q02/Q03, N05/N09, checkout invariant |
| Country cells / запрет foreign failover | C03; A5 P19/P23 против A3 P10/A7 P09 | ADR-003, residency, Q05, DR fencing |
| Купленная база не активируется | C06; A2 P28 против A3 P11 | Consent map, Q07, F08, R11 |
| Managed допускается, K8s временно отложен | C07; A5 P20 против CN.MSV.01; C01/A6 | CN gap table, ADR-001, M6 review |
| PSP Partner, без своего custody | C01/C02; A5 P22, A3, A6 P16 | ADR-004, fee gate, SLO payments, R04/R05 |

## Необходимые согласования и пределы результата

Комплект документации готов к учебной защите. **Производственный запуск остаётся условным**: нужны scope/SLO/CN waiver, local DC/Net45 оферты, legal processing/transfer assessment, лицензии и комиссии PSP, funding выплат, договоры курьеров, измеренный load/DR/security gate. Требование инвестора99.99% и буквальное выполнение всего CN-чек-листа не достигаются автоматически выбранным бюджетом. Не выдаём это за полное соответствие эксплуатационным обещаниям.

Проверены формулы, кешированные значения XLSX, изменение входа и независимый Python-пересчёт; PPTX прошёл package/layout/font/import проверки и визуальный просмотр. Excel/PowerPoint нативно не запускались. Тарифы не являются коммерческими офертами; RTT — не измерения. Проверка источников выполнена текущей датой и не доказывает историческую доступность услуг в августе2026.

Результаты автоматизации: [структура и арифметика](validation-results.json), [TCO engine](tco-checks.json), [PPTX](slide-validation.json), [страницы](page-checks.json). [Инструменты](../tools/README.md) позволяют повторить проверки.
