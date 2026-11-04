# Capability Map и Build/Buy/Partner

Возможность описывает устойчивую способность бизнеса, а не экран или отдельный сервис. Основания: [A1/A4/A5/A6](../sources/README.md), конфликты [C01/C02/C04/C07/C08](../Task1/contradictions.md); [экономика](../Task2/tco-methodology.md). Все суммы — план, не дополнительная сумма поверх TCO.

| L1 / L2 capability | Решение | Обоснование / стоимость | Риск |
|---|---|---|---|
| C1 Market access / C1.1 Identity, C1.2 Consent | Build domain + Buy auth libraries | Собственные country/consent правила; 1 engineer-month≈$4k внутри T0 | Ошибка доступа, неподтверждённое основание |
| C2 Merchandising / C2.1 Catalog, C2.2 Discovery | Build; Buy CDN | 5000SKU не требуют search cluster; 1.5 engineer-month≈$6k; CDN в$270network | Поиск пяти языков отложен |
| C3 Commerce / C3.1 Order, C3.2 Inventory reservation | Build | Конкурентное резервирование — ядро; 2.5 engineer-month≈$10k | Oversell, общий blast radius |
| C4 Money movement / C4.1 Collection, C4.2 Reconciliation/refund | Partner licensed PSP; Build thin adapter/ledger | 2 engineer-month≈$8k; 2.16%GMV blended all-in, gate<2.5%/rail | Settlement, лицензия, FX, unknown charge |
| C5 Fulfilment / C5.1 Dispatch, C5.2 Track/receive | Partner; Build adapter | 2 engineer-month≈$8k и$2/order; своё ПО≥$96k/6 мес плюс операции | Партнёр не работает; Sendy требует проверки |
| C6 Engagement / C6.1 Transactional notify, C6.2 Marketing consent | Partner SMS/WA; Build policy | 0.5 engineer-month≈$2k; $0.05/order вместе с OTP/retries | Цена сообщений/доставка/transfer |
| C7 Seller operations / C7.1 Onboarding/KYC, C7.2 Dispute/return | Build minimal back-office; Partner compliance/legal | 0.5 engineer-month≈$2k; legal/setup входит$25kT0 | Ручная работа, локальная экспертиза |
| C8 Insight / C8.1 Operational KPI, C8.2 Seller analytics | Build SQL aggregates; Buy open-source BI tooling | Внутри Commerce/QA работ, без отдельного warehouse на MVP | PII export, тяжелые запросы |
| C9 Platform / C9.1 Delivery/recovery, C9.2 Security/observability | Buy IaaS/support; Build IaC/pipelines | 2 platform-month≈$10k внутри T0; $2850infra+$150SaaS/мес | Отсутствие готовых локальных SLA/Net45 |

Аллокация разработки $50k T0 в A. Это 10 product engineer-month +2 platform-month; за 8 недель у 6 человек около 12 person-month, поэтому scope и договоры критичны. Административные и legal роли CEO/CFO/CTO не добавлены к шести контракторам; management allocation учтён отдельно. Стоимость сообщений, платежей и доставки в TCO одинаковая для A/B/C, не скрывает дорогую разработку.

## Assumptions

Для M6/M12 новые capabilities B2B, trust/video, seller analytics появляются после бюджета и юридических gates. Buy open-source означает оплаченные hosting/support, а не бесплатную эксплуатацию. Самостоятельная лицензия PSP не укладывается в 8 недель; собственная логистика не заменяет курьеров. [Value stream](value-stream.png) показывает порядок реализации ценности.
