# Сравнение регионов и бюджета

Источники: [A3/A5/A6 и E07–E10](../sources/README.md), [C03/C05/C07](../Task1/contradictions.md). Цены просмотрены 02.11.2026; расчёт по 730 часам/месяц, без налогов, egress и support. SKU различаются, поэтому цена VM **не доказывает равную производительность**. RTT ниже — оценки, измерения не проводились.

| Регион | Сервисы, доступность конкретного SKU проверить | Индикативная VM / месяц | Корзина cell, оценка / месяц | RTT, ms: NG / KE / ZA | SLA / вывод |
|---|---|---|---|---|---|
| AWS af-south-1, Cape Town | EC2, RDS, S3, EKS, KMS | t3.medium, 2vCPU/4GiB: $0.0542/h ≈ $39.57 | $1800–2800 | 90–170 / 70–130 / 15–45 | Multi-AZ compute 99.99% при условиях; кандидат ZA, не PII NG/KE |
| GCP africa-south1, Johannesburg | Compute, GKE, Cloud SQL, Storage, KMS | e2-standard-2, 2vCPU/8GiB: $0.0737/h ≈ $53.80 | $1700–2700 | 85–165 / 60–120 / 5–25 | Multi-zone compute 99.99% при условиях; тот же residency gap |
| Azure South Africa North | VM, AKS, PostgreSQL, Blob, Key Vault | B2ms, 2vCPU/8GiB: $0.108/h ≈ $78.84 | $1900–3000 | 85–165 / 60–120 / 5–25 | VM в ≥2 AZ: 99.99% при условиях; нужна оферта |
| Layer3, Nigeria; DC уточнить | VM, storage, network; DB/Redis на VM или support contract | 2vCPU/4GB/64GB: NGN37 621.45 ≈ $25.08 при NGN1500/USD | $1200–1800 | 5–35 / 80–160 / 90–170 | Опубликовано 99.9%, scope/credits уточнить; соответствует географии NG |
| Kenyan local IaaS, RFP | VM, local storage; поддержка DB в RFP | Нет оферты; план $35–70/VM | $1200–1800 | 80–160 / 5–35 / 60–120 | SLA и независимость DC не подтверждены; procurement gate |

Источники VM-индикаторов: [AWS](https://calculator.holori.com/aws/ec2/t3.medium?region=af-south-1), [GCP](https://instances.usage.ai/gcp/compute/region/africa-south1), [Azure](https://pcr.cloud-mercato.com/providers/azure/flavors/standard_b2ms) — вторичные ценовые агрегаторы, не коммерческие предложения. Layer3 публикует локальный тариф. Корзины — оценки архитектора: 2 API, worker, DB HA, local DR, сеть и telemetry. SLA compute не равен доступности приложения.

## Выбор и аллокация бюджета A

NG/KE требуют местных контуров до legal approval. Три региона ZA не заменяют персональные хранилища этих стран. Для ZA после M6 выбран AWS при приемлемых договоре и компетенциях; GCP/Azure остаются альтернативами. Managed подходит только при выполнении residency, цены и Net45, иначе PostgreSQL на VM с оплаченной поддержкой.

| Fixed infra A, обе страны | USD/мес |
|---|---|
| API и worker VM | 480 |
| PostgreSQL primary + sync standby, диски | 760 |
| Local DR capacity + backup/WAL | 460 |
| Redis | 100 |
| Локальные metrics/logs/traces | 180 |
| Network/LB/CDN/egress | 270 |
| 24/7 поддержка инфраструктуры поставщиком | 600 |
| **Fixed infra** | **2850** |
| Repo/CI/security SaaS | 150 |
| SMS/WA при 10k заказов | 500 |
| Резерв 15% от $3500 | 525 |
| **Технические расходы на старте** | **4025** |

При 25k заказов: (2850+150+1250)×1.15=$4887.50 — максимум первых шести месяцев. Поддержка $600 и любой агрегированный счёт DC >$500 требуют письменного CFO approval. Дробление счетов не обходит правило. Оплата помесячно Net45; при требовании годовой предоплаты выбираем другого поставщика или согласуем исключение.

## Assumptions

Аллокации не означают закупленную инфраструктуру. Два DC должны иметь независимые power/network failure domains; два зала недостаточны. До GO: семь дней RTT-проб из Lagos/Nairobi/Johannesburg (P50/P95/P99), нагрузочный тест, оферта с IOPS/egress/FX/tax, SLA и support, проверка restore. Если вместимости или бюджета не хватает, gate не пройден. [Схема](deployment-diagram.png).
