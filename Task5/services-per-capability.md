# Реализация capabilities и владельцы

Источники: [capability map](capability-map.md), [ADR-001](../Task2/adr-001-architecture-style.md), [A5](../sources/artifact-05.md), [C01/C02/C07](../Task1/contradictions.md). «Сервис» в MVP может означать модуль одного приложения, а не отдельный сетевой процесс.

| Capability | Продукт / модуль MVP → возможный сервис | Владелец | Внешняя зависимость |
|---|---|---|---|
| C1.1 Identity | Account module → Identity country service | Backend Commerce | OTP gateway, local IdP library |
| C1.2 Consent | Versioned consent registry → Consent service | CEO accountable, Backend Payments implements | Юрист, processor DPA |
| C2.1/2.2 Catalog/Discovery | Catalog module+Redis+PWA → Catalog/search | Frontend + Backend Commerce | Public CDN после legal review |
| C3.1/3.2 Order/reservation | Orders/Inventory transaction → Commerce service | Backend Commerce | Seller stock, authoritative PostgreSQL |
| C4.1/4.2 Payments | Intent/inbox/ledger module+worker → Payments service | Backend Payments; CFO accountable | FlutterwaveNG, PaystackKE→M-Pesa |
| C5.1/5.2 Fulfilment | Dispatch adapter → Fulfilment service | Integrations; CEO operational owner | SendboxNG, approved KE carrier; Sendy unconfirmed |
| C6.1/6.2 Engagement | Notify module+outbox worker → Notifications service | Integrations | SMS/USSD aggregator, WhatsApp Business |
| C7.1/7.2 Seller/trust | Minimal back-office → Seller/Trust products | CEO; QA workflows | Local legal/KYC/operations partner |
| C8.1/8.2 Insight | Incremental SQL aggregate→Reporting service | Commerce; CEO KPI owner | Local BI, no raw cross-country data |
| C9.1/9.2 Platform | CI/IaC, local telemetry/recovery | Platform; CTO accountable | Country IaaS/support, registry |

## Assumptions

Все шесть контракторов имеют основную и резервную область; [расписание](team-and-on-call.md). Границы выделения определяются владением данными и частотой изменений, а не правилом «одна capability = один микросервис». В MVP отдельные DBroles/schemas ограничивают модули, но physicalDB общий; после выделения единственный writer принадлежит новому сервису.
