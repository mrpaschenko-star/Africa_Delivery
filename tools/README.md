# Воспроизведение и проверка

| Файл | Назначение |
|---|---|
| [model-inputs.json](model-inputs.json) | Допущения и независимые контрольные результаты экономики |
| [calculate-tco.py](calculate-tco.py) | Независимый Python-пересчёт базового сценария |
| [build-tco.mjs](build-tco.mjs) | Формульный XLSX через @oai/artifact-tool; тест изменения комиссии |
| [build-slide.mjs](build-slide.mjs) | Редактируемый PPTX и PNG; проверка структуры/геометрии/шрифта |
| [render-diagrams.py](render-diagrams.py) | Локальный PlantUML → PNG, без GitHub и Graphviz |
| [check-pages.py](check-pages.py) | Полный Markdown → временный A4 → PNG; проверка лимитов |
| [validate.py](validate.py) | Состав, ссылки/якоря, числа, XLSX/PPTX, ADR, критерии; обновление JSON-отчёта |

Python: стандартная библиотека, Pillow, openpyxl только для чтения, reportlab, pypdf, pypdfium2. Node: @oai/artifact-tool из bundled runtime. Установки зависимостей в репозиторий не требуются. Java и plantuml.jar передаются явно:

```sh
python3 tools/render-diagrams.py --java /path/to/java --jar /path/to/plantuml.jar
python3 tools/calculate-tco.py
python3 tools/check-pages.py
python3 tools/validate.py
```

Команды запускаются из каталога `Africa_Delivery`. PNG/MD открываются без Java. C4 v2.12.0 лежит в vendor/C4-PlantUML, лицензия сохранена. Источники используют Smetana и относительные include.

Для Node скопируйте builder в отдельный временный build-каталог, подключите в нём node_modules bundled runtime и передайте абсолютный путь Africa_Delivery первым аргументом. AF_BUILD_DIR задаёт временные превью. Для PPTX дополнительно нужны PRESENTATION_SKILL_DIR, RUNTIME_PYTHON и RUNTIME_NODE_MODULES из установленного presentation runtime. Finalizer пишет новый output и не перезаписывает существующий: используйте свежий AF_BUILD_DIR. После проверки builder копирует окончательный файл в Task2. Никаких ключей/API-вызовов для сборки не требуется.

Проверка страниц использует A4 portrait, Arial10.5pt/14pt, таблицы9pt/11.5pt, поля42pt слева/справа. PDF временный и удаляется автоматически; PNG остаются в review/page-previews. Markdown не имеет фиксированной пагинации, поэтому профиль указан явно. Это контроль объёма полного текста, а не уменьшенный шрифт для обхода лимитов.

Контрольная модель зафиксирована на базовом сценарии: при изменении допущений обновляйте независимые results и документы вместе. Автоматическая проверка не подтверждает тарифные договоры, производительность, юридическое соответствие или30-дневный SLO.

`validate.py` проверяет текущий комплект проекта и записывает результат в [review/validation-results.json](../review/validation-results.json). Проверка целостности PPTX использует [отчёт сборки слайда](../review/slide-validation.json).
