# Источники

План реконструируется из позиции 12.08.2026 с запуском 15.10.2026; текущая дата не сдвигает дедлайн кейса. Современная проверка источников — дополнительный аудит, не доказательство исторической доступности тарифа в августе.

## Входные материалы

[A1 — инвестор](artifact-01.md), [A2 — маркетинг](artifact-02.md), [A3 — юрист](artifact-03.md), [A4 — 29 функций](artifact-04.md), [A5 — CTO](artifact-05.md), [A6 — CFO](artifact-06.md), [A7 — записка](artifact-07.md). Пункты P01… воспроизводят исходные абзацы без изменения содержания. [A8 — схема CTO](source-system.png).

[CN-чек-лист](cloud-native-checklist.md) и [его второй файл](cloud-native-checklist-en.md) прочитаны по ссылкам исходных материалов. Второй файл также содержит русский текст. Приложения А/Б/В с обещанными шаблонами ADR/Vision/QAS отсутствуют в материалах: вместо выдуманной цитаты используем явные [рабочие шаблоны](../templates/README.md). Четыре ADR имеют одинаковые разделы; QAS — стандартные шесть полей.

## Внешние источники

| ID | Источник | Что подтверждает / чего не подтверждает |
|---|---|---|
| E01 | [Flutterwave Nigeria pricing](https://flutterwave.com/ng/pricing/) | 2% локальные платежи, 4.8% международные; это collection fee, не вся стоимость выплат/FX/налогов |
| E02 | [Paystack transaction pricing](https://support.paystack.com/en/articles/2130306) | Кения M-Pesa 1.5%, карты 2.9%; Нигерия 1.5% + NGN100, cap NGN2000 и порог отмены фиксированной части; ЮАР карты 2.9%+ZAR1 без VAT, EFT2% |
| E03 | [Safaricom Buy Goods guide](https://www.safaricom.co.ke/images/Downloads/Buy-goods-guides.pdf) | Till collection до 0.55%, cap KES200; не тариф всего marketplace API/платёжной оркестрации |
| E04 | [Paystack transfer pricing](https://support.paystack.com/en/articles/2130370) | Выплаты тарифицируются отдельно; тариф и налоги проверяются под конкретный маршрут |
| E05 | [Flutterwave payment methods](https://developer.flutterwave.com/v3.0.0/docs/payment-methods) | Связка страна/валюта/rail. Не подтверждает наличие договора marketplace или локализацию всех субпроцессоров |
| E06 | [CNCF conformance](https://www.cncf.io/training/certification/software-conformance/) | Сертификация Kubernetes offerings; не универсальный сертификат интернет-магазина |
| E07 | [AWS Compute SLA](https://aws.amazon.com/compute/sla/) | Region-level 99.99% при нескольких AZ и условиях договора; не end-to-end SLA приложения |
| E08 | [GCP Compute SLA](https://cloud.google.com/compute/sla) и [регионы](https://docs.cloud.google.com/compute/docs/regions-zones) | Multi-zone compute SLA и Johannesburg africa-south1; параметры управляемых сервисов проверяются отдельно |
| E09 | [Azure regions](https://learn.microsoft.com/en-us/azure/reliability/regions-list) и [SLA](https://azure.microsoft.com/en-us/support/legal/sla/virtual-machines/) | South Africa North и зональное размещение; VM SLA не складывается в SLA продукта |
| E10 | [Layer3 pricing](https://www.layer3.cloud/pricing) | 2 vCPU/4GB/64GB — NGN37 621.45/мес; опубликован 99.9%. Точный DC, независимость площадок, support и Net45 требуют оферты |
| E11 | [NDPC FAQs](https://ndpc.gov.ng/faqs/) | NDPA 2023 предусматривает трансграничную передачу при условиях. Консервативное in-country в работе — политика проекта по A3/A7, а не утверждение об абсолютном запрете любого экспорта законом |
| E12 | [Kenya General Regulations 2021](https://www.odpc.go.ke/wp-content/uploads/2024/03/THE-DATA-PROTECTION-GENERAL-REGULATIONS-2021-1.pdf) | Регулирование обработки/передачи; категории и применимость к marketplace подтверждает местный юрист |
| E13 | [Information Regulator: direct marketing](https://inforegulator.org.za/wp-content/uploads/2020/07/GUIDANCE-NOTE-ON-DIRECT-MARKETING-IN-TERMS-OF-THE-PROTECTION-OF-PERSONAL-INFORMATION-ACT-4-OF-2013-POPIA.pdf) | Условия прямого маркетинга; купленная база без доказанного основания не активируется |
| E14 | [Sendy administration, 26.09.2023](https://techcabal.com/2023/09/26/sendy-has-entered-into-administration/) | Сигнал риска контрагента: требуется повторная due diligence; одноимённый status page не подтверждает нужное юрлицо |

## Ошибки, которые нельзя переносить из шаблонов

TCO заменяет $9000 на $5000 и проверяет каждый из первых шести месяцев, включая SaaS и технические сообщения. Одноразовые расходы не повторяются пять лет. Стоимость downtime из SLO — сценарий исчерпания бюджета ошибок, а не математическое ожидание; она выключена в базовом cash TCO.

[Исходный residency-шаблон](residency-source-template.md) содержит зарубежный fallback для Нигерии и некорректное отождествление шифрования с разрешением передачи. Сохраняем его как входной материал, но не как решение. [FMEA-шаблон](fmea-source-template.md) используется с исходной шкалой S/O/D и RPN.

Расчётные цены в USD, latency и staffing — оценки архитектора, не коммерческие предложения или измеренные результаты. Дата просмотра страницы не гарантирует актуальность договора. Перед закупкой нужны письменные условия, лицензии/права, локализация, счета Net45 и согласование CFO для строки >$500/мес.

Ссылки: [CN original](https://code.s3.yandex.net/solution-architect/CN_check-list.docx), [CN второй файл](https://code.s3.yandex.net/solution-architect/CN_check_list_en.docx), [TCO template](https://code.s3.yandex.net/solution-architect/TCO_model_Africa_Delivery_template.xlsx), [TCO model](https://code.s3.yandex.net/solution-architect/TCO_model_Africa_Delivery.xlsx). [Зафиксированные ячейки TCO-шаблона](tco-template-extract.md) подтверждают C05. Ценовые индикаторы VM и их ограничения приведены непосредственно в [cloud comparison](../Task4/cloud-regions-comparison.md).
