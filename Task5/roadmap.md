# Roadmap: четыре контрольные точки

[Диаграмма](roadmap.png), [PlantUML](roadmap.puml). Общий финальный критерий требует PlantUML, поэтому он выбран вместо разрешённого отдельным пунктом Mermaid. Учебный календарь: старт архитектора 12.08.2026, реализация 17.08–11.10, запуск 15.10. **M1/M2 — разработка; M6/M12 — после запуска. В TCO M1 — первый месяц эксплуатации**, не август.

| Точка | Scope / gate | Команда | Инфраструктура и технические recurring |
|---|---|---|---|
| M1, 13.09.2026 | Country cells, CI/CD, каталог, account/consent, sandbox PSP, shortlist договоров; проверка 100 продавцов | 6; CEO Product Owner; local advisors по договору | План$2850infra+$150SaaS; production только с Net45/legal gates |
| M2, 15.10.2026 | 5000SKU/100sellers, заказ/резерв, rails, SMS/WA, PWA, back-office/KPI; load/DR/security/settlement tests | Те же 6 | $2850infra; $4025 all technical при 10korders/мес, включая резерв 15% |
| M6, 15.04.2027 | Решение о ZA, seller sales/track&trace, USSD pilot; выделение Payments по измерениям; Kubernetes review | 6 до конца M6, запрос 8 с M7 | $2850infra; max$4887.50 all technical при 25korders; расширение только после нового бюджета |
| M12, 15.10.2027 | 5 стран, >1M зарегистрированных, B2B/returns, ПВЗ-video после DPIA; сервисы по доказанной необходимости | 8 во втором полугодии: 6product+2platform | $6000infra+$300SaaS; $12995 all technical при 100korders, включая резерв |

M6 — решение об expansion; production ZA активируется с новым бюджетом с M7. Пять cells не помещаем искусственно в бюджет двух. Две дополнительные страны M12 выбирают CEO/юрист на M6 по спросу, PSP и локализации; названий в кейсе нет.

## Восемь недель реализации

1–2: procurement/legal/PSP как критический путь; архитектура, CI и PWA параллельно. 3–4: каталог, заказ/stock, hosted payment, inbox и сверка. 5–6: partner dispatch/notify, consent, back-office/refund. 7–8: onboarding100sellers, нагрузочные и аварийные тесты, restore, операционная репетиция, canary. 12–14 октября — финальный GO и резерв времени, не новые функции.

[Отбор 29 функций](feature-triage.md): шесть включены частично; native/live/ML/wallet/credit отложены. Late binding: search cluster после измерения каталога, Kafka при потребности в replay/независимых consumers, mesh после зрелой SOA, Oracle только при доказанной необходимости и лицензии.

## Go / No-Go

Нужны письменные scope/SLO/CN исключения, DPA/processing locations NG/KE, работающие PSP и all-in fee<2.5%, replay tests stock/payment, load gate, restore и fencing drill, законный refund process, договор курьера и местная операционная поддержка. Без PSP или legal gate страны допустимы demo без денег или новое согласование географии. Это **не считается полным пилотом NG+KE**. Без бюджета не размещается заказ поставщику.

## Assumptions

Дедлайны [пяти вопросов](../Task1/open-questions.md) — план, не полученные ответы. Будущие 8FTE и$12995 ещё не утверждены. [Риски](risk-register.md) содержат триггеры остановки, [NFR](../Task3/nfr-registry.md) — обязательные испытания.
