$.global.FrameFlowCEP = (function () {
/* Shared ES3 diagnostic catalog. Snapshot names and native values are never localized. */
var FFText = (function () {
    var pairs = [["Frames: enter a positive whole number.","Кадры: введите положительное целое число."],["Frames: expected 1 to 1000000.","Кадры: допустимо от 1 до 1000000."],["Range: enter a frame number, e.g. 24 or 24.5.","Диапазон: нужен номер кадра, например 24 или 24.5."],["Range: number is outside the allowed limits.","Диапазон: число вне допустимого предела."],["Direction is required","Не задано направление"],["Invalid shift interval","Некорректный интервал сдвига"],["Place the cursor inside the composition","Курсор должен быть внутри композиции"],["There are no layers in this scope","В выбранной области нет слоёв"],["Invalid layer time bounds","У слоя некорректные границы времени"],["The cursor overlaps a layer; there is no empty gap","Курсор находится на слое; пустого промежутка нет"],["There is no next layer inside the composition","После курсора нет следующего слоя внутри композиции"],["There is no gap between the layers","Между слоями нет паузы"],["A layer after the gap is locked","После паузы есть заблокированный слой (Locked)"],["Version","Версия"],["Format","Формат"],["Scope","Область"],["Markers","Маркеры"],["Unknown field","Неизвестное поле"],["Saved panel preferences were not recognized and were preserved. Changes apply to this session.","Сохранённые параметры панели не распознаны и оставлены без изменений. Значения действуют в этой сессии."],["Unknown scope","Неизвестная область"],["Mode","Режим"],["Strict preflight","Строгая проверка"],["Saved mode preferences were not recognized and were preserved. Session values are in use.","Параметры режимов не распознаны и сохранены без изменений. Используются значения этой сессии."],["Unknown mode parameters","Неизвестные параметры режима"],["Invalid layer bounds","Некорректные границы слоя"],["Layer bounds would exceed AE limits of ±10800 s","Границы слоя выйдут за диапазон AE ±10800 s"],["Choose a cursor side","Выберите сторону курсора"],["The shift would reverse or empty a layer","Сдвиг обнулит или перевернёт длительность слоя"],["Roving: all keys of this property must move uniformly","Roving: требуется равномерный перенос всех ключей свойства"],["Key time is outside AE bounds","Время ключа вне границ AE"],["Key collision: operation blocked","Коллизия ключей: операция заблокирована"],["Key order would change: operation blocked","Меняется порядок ключей: операция заблокирована"],["Favorites: at most 8 values.","Избранное: максимум 8 значений."],["Unknown settings version preserved. New settings apply to this session only.","Неизвестная версия настроек сохранена. Новые настройки действуют только в этой сессии."],["Invalid format","Повреждённый формат"],["Unknown parameter","Неизвестный параметр"],["Invalid settings preserved. Session defaults are in use.","Повреждённые настройки сохранены. Используются сессионные значения по умолчанию."],["Source Text: CharacterRange is required to verify formatting","Source Text: требуется CharacterRange для проверки форматирования"],["Source Text: over 2000 characters in a key; property excluded to bound verification cost","Source Text: более 2000 символов в ключе; свойство исключено для ограниченной стоимости проверки"],["Source Text: ParagraphRange is required to verify paragraphs","Source Text: требуется ParagraphRange для проверки абзацев"],["Unexpected Temporal Ease dimensions","Неожиданная размерность Temporal Ease"],["Time Remap: no key available for safe writing","Time Remap: нет ключа для безопасной записи"],["Time Remap: no free time for a temporary key","Time Remap: нет свободного времени для временного ключа"],["Expression text changed outside the operation","Текст Expression изменился вне операции"],["AE merged keys during the write","AE объединил ключи при записи"],["Key type or count changed","Изменились тип или число ключей"],["Expression changed","Изменился Expression"],["Key time ","Время ключа "],[" differs from the plan"," не совпадает с расчётом"],["Key value ","Значение ключа "],[" was not preserved"," не сохранилось"],["Key interpolation ","Interpolation ключа "],[" was not preserved"," не сохранилась"],[" key "," ключа "],["Cannot resolve property path","Не удалось определить путь свойства"],["Property unavailable: ","Свойство недоступно: "],["Too many properties; narrow the scope.","Слишком большой набор свойств; сузьте область."],["layer","слой"],["Open a composition in AE.","Откройте композицию в AE."],["Native key count changed","Изменилось число нативных ключей"],["Native key movement differs from the plan","Нативный перенос ключей не совпал с расчётом"],["Select layers or choose Auto / All layers.","Выделите слои или выберите Авто / Всю композицию."],["A composition marker is inside the gap. Disable marker movement or edit the markers.","В удаляемой паузе есть маркер композиции. Отключите их перенос или измените маркеры."],["Gap not removed: some targets are unavailable. See skipped targets for details.","Пауза не удалена: не все цели доступны. Причины — в пропусках."],["No available targets after the gap.","После паузы нет доступных целей."],["The cursor or gap scope changed; try again","Курсор или область паузы изменились; повторите действие"],["Layers around the gap changed; try again","Слои около паузы изменились; повторите действие"],["Source media limit: requested Out ","Предел исходного медиа: Out запрошен "],[" s, available until "," s, доступен до "],[" s. Entire layer skipped."," s. Весь слой пропущен."],["Source media limit: requested In ","Предел исходного медиа: In запрошен "],[" s, available from "," s, доступен от "],["Special property keys ","Специальные ключи свойства "],[" are not supported yet"," пока не поддержаны"],["Essential Properties: key movement is not supported yet","Essential Properties: перенос ключей пока не поддержан"],["Over 50000 keys: narrow the scope.","Более 50000 ключей: сузьте область."],["Protected Region: marker movement skipped","Protected Region: перенос маркера пропущен"],["Composition markers","Маркеры композиции"],[": entire layer skipped — ",": весь слой пропущен — "],["Composition markers: ","Маркеры композиции: "],["Strict preflight: some targets were skipped. Entire operation cancelled before writing.","Строгая проверка: есть пропуски. Вся операция отменена до записи."],["Only keys move; Start/In/Out remain unchanged. Expressions are preserved, but their visual results depend on time and external objects.","Переносятся только ключи; Start/In/Out не меняются. Expressions сохранены, но их визуальный результат зависит от времени и внешних объектов."],["Cursor side is required","Не задана сторона курсора"],["Unknown operation mode","Неизвестный режим операции"],["Invalid strict preflight setting","Некорректная строгая проверка"],["Unknown source media limit policy","Неизвестное правило предела исходника"],["Protected Region: partial layer movement skipped","Protected Region: перенос этой части слоя пропущен"],["Key time would exceed AE bounds","Время ключа выйдет за диапазон AE"],["Essential Properties: partial movement is not supported yet","Essential Properties: частичный перенос пока не поддержан"],["Layer bounds differ from the plan","Границы слоя не совпадают с расчётом"],["Failure: phase=","Сбой: phase="],["before target selection","до выбора цели"],["Before operation","До операции"],["Expected","Ожидалось"],["Actual at failure, BEFORE recovery","Фактически в момент сбоя, ДО отката"],["Deviation ","Отклонение "],["Layer structure changed","Состав слоёв изменился"],["Layer selection differs from the original","Выделение слоя не совпало с исходным"],["Active composition changed; try again","Активная композиция изменилась; повторите действие"],["Layer unavailable or locked","Слой недоступен или заблокирован"],["FrameFlow AE 2.4.0 — Close Gap","FrameFlow AE 2.4.0 — Убрать паузу"],["Date: ","Дата: "],[": unknown",": неизвестно"],["Planned changes: ","К изменению: "],["; Skipped: ","; Пропуски: "],["; Blockers: ","; Блокировки: "],["Insufficient source handles: ","Без запаса исходника: "],["These layers and all their keys remain unchanged; other targets pass strict preflight.","Эти слои и все их ключи оставлены без изменений; остальные цели проходят строгую проверку."],["Entire operation cancelled before writing.","Вся операция отменяется до записи."],["Close gap [","Удаление паузы ["],[") s; cursor before operation=",") s; курсор до операции="],["Range [","Диапазон ["],[") s; frames from the internal composition start",") s; кадры от внутреннего начала композиции"],["Shift plan — Layers: ","План сдвига — Слоёв: "],["; keys: ","; ключей: "],["; layers in scope: ","; слоёв в области: "],["Scene unchanged. Panel actions verify the current scene again before writing.","Сцена не изменена. Действие в панели заново проверит текущую сцену перед записью."],["Error: ","Ошибка: "],["unknown","неизвестно"],["Original data passed recovery readback verification.","Восстановление исходных данных прошло readback-проверку."],["Layer selection preserved.","Выделение слоёв сохранено."],["SELECTION NOT RESTORED: ","ВЫДЕЛЕНИЕ НЕ ВОССТАНОВЛЕНО: "],["Undo Group close error: ","Ошибка закрытия Undo Group: "],["RECOVERY NOT CONFIRMED: ","ВОССТАНОВЛЕНИЕ НЕ ПОДТВЕРЖДЕНО: "],["Target: ","Цель: "],["; keys ","; ключей "],["BLOCK: ","БЛОК: "],["SKIP: ","ПРОПУСК: "],["Details limited to 300 lines; narrow the scope for a full list.","Подробности ограничены 300 строками; сузьте область для полного списка."],["Readback verifies available data; visual results, unavailable attributes and external Expressions require a separate test in AE.","Readback проверяет доступные данные; визуальный результат, недоступные атрибуты и внешние Expressions требуют отдельного теста в AE."],["Invalid numeric value.","Некорректное числовое значение."],["Invalid layer list.","Некорректный список слоёв."],["Duplicate target.","Повтор цели."],["Open a composition in After Effects.","Откройте композицию в After Effects."],["Over 2000 layers: open a smaller composition.","Более 2000 слоёв: откройте меньшую композицию."],["Composition changed. Refresh the panel and try again.","Композиция изменилась. Обновите панель и повторите действие."],["Select at least one layer.","Выделите хотя бы один слой."],["Target layer no longer exists.","Целевой слой больше не существует."],["Locked layer: #","Заблокированный слой: #"],[". Unlock it in AE.",". Снимите блокировку в AE."],["Write verification differs from the plan.","Проверка записи не совпала с расчётом."],["Over 20000 properties: narrow the scope.","Более 20000 свойств: сузьте область."],["Choose In or Out.","Укажите In или Out."],["Reversed layer bounds are not supported yet.","Обратные границы слоя пока не поддержаны."],["Keep at least one frame of the layer.","Оставьте не менее одного кадра слоя."],["Time Remap and reverse Stretch only support shortening.","Для Time Remap и обратного Stretch доступно только укорачивание."],["The edge exceeds available source media.","Край выходит за доступное исходное медиа."],["Split: the cursor must leave at least one frame on each side of each selected layer.","Split: курсор должен оставлять хотя бы кадр с обеих сторон каждого выбранного слоя."],["Split: Parent and Track Matte relationships require a manual split in AE.","Split: связи Parent и Track Matte требуют ручного разделения в AE."],["Split: a selected layer has child layers.","Split: у выбранного слоя есть дочерние слои."],["Scope not recognized.","Область не распознана."],["Shift equals zero.","Сдвиг равен нулю."],["Mode not recognized.","Режим не распознан."],["Side not recognized.","Сторона не распознана."],["Direction not recognized.","Направление не распознано."],["Choose Auto, Selected or All layers.","Выберите Авто, выделенные слои или всю композицию."],["Unknown source media limit policy.","Неизвестное правило предела исходника."],["Selection updated","Выделение обновлено"],["Plan expired or changed. Run a new preview before applying.","План устарел. Повторите проверку перед применением."],["Apply checked plan","Применить проверенный план"],["PREVIEW","ПРОВЕРКА"],["Plan: ","План: "],["; skipped: ","; пропусков: "],[" · no handles: "," · без запаса: "],["Unknown operation.","Неизвестная операция."],["Write verification could not complete. Open the report.","Не удалось завершить проверку записи. Откройте отчёт."],["Done · changes: ","Готово · изменений: "],["Scene unchanged","Сцена не изменена"],[" · no matching targets"," · подходящих целей нет"],["Host busy. Wait for the operation to finish.","Host занят. Дождитесь завершения операции."],["Incompatible request version.","Несовместимая версия запроса."],["Panel closed.","Панель закрыта."],["Wait for the operation to finish.","Дождитесь завершения операции."],["The previous action has an unknown result. Click Refresh.","Результат предыдущего действия неизвестен. Нажмите «Обновить»."],["AE read timed out. No changes were sent. Click Refresh.","AE не ответил на чтение вовремя. Изменения не отправлялись. Нажмите «Обновить»."],["AE timed out. The operation may have completed. Click Refresh before the next action.","AE не ответил вовремя. Операция могла выполниться. Нажмите «Обновить» перед следующим действием."],["AE returned no FrameFlow data. Click Refresh to check the host loader.","AE не вернул данные FrameFlow. Нажмите «Обновить» для проверки загрузки ядра."],["AE returned a response outside the FrameFlow protocol (length ","AE вернул ответ вне протокола FrameFlow (длина "],["). Click Refresh.","). Нажмите «Обновить»."],["AE response does not match the request.","Ответ AE не соответствует запросу."],["AE error","Ошибка AE"],["AE response contains no data.","В ответе AE нет данных."],["CEP did not provide the extension folder.","CEP не сообщил папку расширения."],["CEP returned a relative extension path.","CEP вернул относительный путь расширения."],["not received","не получен"],["not received","не получена"],["AE loader check timed out. Scene unchanged. Close modal dialogs in AE and click Refresh.","AE не ответил на проверку загрузчика. Сцена не изменялась. Закройте модальные окна AE и нажмите «Обновить»."],["AE did not execute the FrameFlow loader. Click Refresh.","AE не выполнил загрузчик FrameFlow. Нажмите «Обновить»."],["AE returned an invalid loader response (length ","AE вернул некорректный ответ загрузчика (длина "],["Unknown AE loader response.","Неизвестный ответ загрузчика AE."],["Could not load the AE core: ","Не удалось загрузить ядро AE: "],["Panel and core versions differ. Reinstall FrameFlow ","Версии панели и ядра различаются. Переустановите FrameFlow "],["Click Refresh to connect to AE first.","Сначала нажмите «Обновить» для подключения к AE."],["Settings version unsupported. Original data preserved.","Версия настроек не поддерживается. Исходные данные сохранены."],["Unknown parameter: ","Неизвестный параметр: "],["Value out of range: ","Значение вне диапазона: "],["Invalid choice: ","Недопустимый вариант: "],["Choose a lighter accent color.","Выберите более светлый акцентный цвет."],["Invalid type: ","Неверный тип: "],["Quick steps: 1 to 8 whole numbers, each from 1 to 1000000.","Быстрые шаги: от 1 до 8 целых чисел, каждое от 1 до 1000000."],["Unknown scope.","Неизвестная область."],["Saved settings were not recognized; changes apply to this session. Export them to keep a copy.","Сохранённые настройки не распознаны; изменения действуют в этой сессии. Экспортируйте их для сохранения."],["Settings changed in another window. Restart the panel; current values apply to this session.","Настройки изменились в другом окне. Перезапустите панель; текущие значения действуют в этой сессии."],["Storage did not confirm the settings write.","Хранилище не подтвердило запись настроек."],["Time: HH:MM:SS:FF or a number of ","Время: HH:MM:SS:FF или число "],["frames","кадров"],["seconds","секунд"],["Choose Insert Time or Remove Time.","Выберите вставку или удаление времени."],["Choose a crossing-layer policy.","Выберите правило пересекающих слоёв."],["The interval must fit inside the composition.","Интервал должен помещаться в композицию."],["Composition duration is unchanged. No layers or keys are deleted. Kept crossing layers: ","Длительность композиции не меняется. Слои и ключи не удаляются. Оставлено пересекающих слоёв: "],["The interval or scope changed. Preview again.","Интервал или область изменились. Повторите проверку."],["An interval target changed. Preview again.","Цель интервала изменилась. Повторите проверку."],["Keyed properties changed after preview. Preview again.","Свойства с ключами изменились после проверки. Проверьте заново."],["Composition markers changed. Preview again.","Маркеры композиции изменились. Повторите проверку."],["A key lies inside the removed interval. No keys are deleted; move it or keep crossing layers.","Ключ внутри удаляемого интервала. Ключи не удаляются: перенесите его или оставьте пересекающие слои."],["A duration marker overlaps the interval. Adjust it in AE first.","Маркер с длительностью пересекает интервал. Сначала измените его в AE."],["Unknown interface language.","Неизвестный язык интерфейса."],["A layer boundary lies inside the removed interval. Split it in AE or keep crossing layers.","Граница слоя внутри удаляемого интервала. Разделите его в AE или оставьте пересекающие слои."],["Crossing video, audio, precomp, Time Remap or reverse-stretch layers require a manual split in AE.","Пересекающие видео, аудио, прекомпозиции, Time Remap или обратный Stretch требуют ручного разделения в AE."],["Layer is locked.","Слой заблокирован."],["Invalid interval layer bounds.","Некорректные границы слоя интервала."],["The interval would empty or reverse a layer.","Интервал обнулит или перевернёт длительность слоя."],["Interval actions require a preview.","Для интервала требуется план изменений."],["Interval","Интервал"],["originalCTI","исходный курсор"],["Layers + Keys","Слои и ключи"],["Whole Layers","Слои целиком"],["All Keys","Все ключи"],["Selected Keys","Выделенные ключи"],["Whole layers on the chosen side; edge and keys for layers crossing the cursor.","Слой целиком на выбранной стороне; край и ключи у пересекающего курсор слоя."],["Move the entire layer with all keys. The side is determined by its In point.","Перенос целого слоя со всеми ключами. Сторона определяется по In."],["Move keys on the chosen side. Layer bounds stay unchanged.","Перенос ключей выбранной стороны без изменения границ слоя."],["Only selected AE keys on the chosen side.","Только выделенные в AE ключи на выбранной стороне."],["Auto","Авто"],["Selected","Выделенные"],["All Layers","Все слои"],["DEMO · AE disconnected\n","ДЕМО · AE не подключён\n"],["AE: no confirmed connection\n","AE: нет подтверждённого соединения\n"],["Scope: ","Область: "],["mode: ","режим: "],["step: ","шаг: "],["media: ","исходник: "],["Loader: ","Загрузчик: "],[" / core: "," / ядро: "],["unconfirmed","не подтверждено"],["Auto refresh paused until Refresh.\n","Автообновление приостановлено до «Обновить».\n"],["Recent events:\n","Последние события:\n"],["Settings saved.","Настройки сохранены."],["Invalid composition state from AE.","Некорректное состояние композиции от AE."],["Invalid layer data.","Некорректные данные слоя."],["frames","кадров"],["Enter 1–1000000 whole frames.","Введите от 1 до 1000000 целых кадров."],["Before cursor","До курсора"],["After cursor","После курсора"],["frames","кадров"],["Quick range: 1–120 frames. Current step: ","Быстрый диапазон: 1–120 кадров. Текущий шаг: "],["Selected AE layers, or all layers if none are selected.","Выделенные в AE слои; без выделения — все слои."],["All composition layers.","Все слои композиции."],["Selected AE layers.","Выделенные в AE слои."],["No selected layers. Select them in AE or choose Auto.","Нет выделенных слоёв. Выделите их в AE или выберите Авто."],["Scope: ","Область: "],["Move: ","Переносить: "],["Demo","Демо"],["Offline","Сбой связи"],["No AE","Нет AE"],["No composition","Нет композиции"],["Click Refresh to connect to AE.","Нажмите «Обновить» для подключения к AE."],["Reading AE…","Читаем AE…"],["Checking AE…","Проверяем AE…"],["Demo · AE disconnected","Демо · AE не подключён"],["Synced with AE","Синхронизировано с AE"],["confirmed","подтверждено"],["FrameFlow Report","Отчёт FrameFlow"],["The report stays on your computer. Review it before sharing.","Отчёт остаётся на вашем компьютере. Просмотрите его перед отправкой."],["Report text","Текст отчёта"],["Copy","Скопировать"],["Save TXT","Сохранить TXT"],["Copied","Скопировано"],["Copied","Скопировано"],["Copy blocked. Text selected: Ctrl/Cmd+C.","Копирование заблокировано. Текст выделен: Ctrl/Cmd+C."],["Preview","Предпросмотр"],["Interface demo. Connect After Effects to calculate a real plan.","Демо интерфейса. Подключите After Effects для расчёта плана."],["AE returned no plan. Try again.","AE не вернул план. Повторите проверку."],["frames","кадров"],["Whole layer","Слой целиком"],["Edge + keys","Край и ключи"],["Keys","Ключи"],["Close Gap","Убрать паузу"],["Insert Time","Вставить время"],["Remove Time","Удалить время"],["Before cursor","До курсора"],["After cursor","После курсора"],["Composition markers","Маркеры композиции"],["keys","кл."],["Keep crossing layers","Оставить пересекающие слои"],["Retime crossing animation","Изменить тайминг анимации"],["Composition duration unchanged. No layers or keys are deleted.","Длительность композиции не меняется. Слои и ключи не удаляются."],["Change Plan","План изменений"],["layers","слоёв"],["keys","ключей"],["skipped","пропусков"],["kept","оставлено"],["Writing blocked. See the reasons below.","Запись заблокирована. Причины ниже."],["Nothing changed yet.","Пока ничего не изменено."],["No matching changes. Scene stays unchanged.","Подходящих изменений нет. Сцена останется прежней."],["Insufficient source handles: ","Без запаса исходника: "],["These layers and their keys stay in place.","Эти слои и все их ключи останутся на месте."],["More targets: ","Ещё целей: "],["See the report.","Подробности — в отчёте."],["Reasons & skipped targets","Причины и пропуски"],["More skipped: ","Ещё пропусков: "],["Apply Plan","Применить план"],["Technical Report","Технический отчёт"],["Valid for 2 minutes. AE rechecks the same targets before writing. Changes require a new preview.","План действует 2 минуты. AE повторно проверит те же цели перед записью. При изменениях потребуется новая проверка."],["Insert Time","Вставить время"],["Remove Time","Удалить время"],["frames at the AE cursor","кадров от курсора AE"],["Layers crossing the interval","Слои на пересечении интервала"],["Keep","Оставить"],["Retime Animation","Изменить анимацию"],["Later layers move with all their keys. Composition duration stays unchanged. No layers or keys are deleted.","Слои после интервала сдвигаются со всеми ключами. Длительность композиции не меняется. Слои и ключи не удаляются."],["Preview Changes","Показать план"],["Crossing layers and their keys remain entirely in place.","Пересекающие слои и все их ключи остаются на месте."],["Extends or shortens crossing animation. Video, audio, precomps and Time Remap need a manual split in AE. Keys inside a removed interval block writing.","Удлиняет или сокращает пересекающую анимацию. Видео, аудио, прекомпозиции и Time Remap требуют ручного разделения в AE. Ключи внутри удаляемого интервала блокируют запись."],["Settings","Настройки"],["Language","Язык"],["Workflow","Работа"],["Remember scope and mode","Запоминать область и режим"],["Refresh from AE automatically","Обновлять сведения из AE"],["Move composition markers","Переносить маркеры композиции"],["Starts in Auto · Layers + Keys unless remembered. Step and appearance are always saved.","Без запоминания открывается Авто · Слои и ключи. Шаг и внешний вид сохраняются всегда."],["When video source handles run out","Если закончились исходные кадры видео"],["Keep This Layer","Оставить этот слой"],["Cancel All","Отменить всё"],["Skipped layers keep all their keys. Other available targets move.","Пропущенный слой и все его ключи остаются на месте. Остальные доступные цели сдвигаются."],["Appearance","Внешний вид"],["Theme","Тема"],["Dark","Тёмная"],["Light","Светлая"],["Follow AE","Как в AE"],["Font","Шрифт"],["System","Системный"],["Mono","Моно"],["Text size","Размер текста"],["Shift button height","Размер кнопок сдвига"],["Button spacing","Интервал кнопок"],["Corner radius","Скругление"],["Accent","Акцент"],["Window animation","Анимация окон"],["High contrast","Повышенный контраст"],["Density","Плотность"],["Compact","Компактно"],["Balanced","Обычно"],["Large","Крупнее"],["Quick Steps","Быстрые шаги"],["Up to 8 frame values, separated by commas","До 8 значений в кадрах, через запятую"],["Changes save automatically.","Изменения сохраняются автоматически."],["Export JSON","Экспорт JSON"],["Import","Импорт"],["Reset Appearance","Сбросить вид"],["How FrameFlow Works","Как работает FrameFlow"],["1. Place the cursor in AE.","1. Поставьте курсор в таймлайне AE."],["Choose a frame step using presets, slider or − / +. Shift changes it by 10; the wheel works over the focused number.","Выберите шаг кнопкой, ползунком или − / +. Shift меняет шаг на 10 кадров; колесо работает над активным числом."],["2. Scope defaults to Auto.","2. По умолчанию — Авто."],["Auto uses selected AE layers, or all layers when none are selected. Selected never expands an empty selection.","Авто использует выделенные в AE слои; без выделения — всю композицию. «Выделенные» без выделения не расширяет область."],["3. Choose Before or After cursor, then an arrow.","3. Выберите До или После курсора и стрелку."],["Left moves earlier; right moves later. Before excludes a key at the cursor; After includes it. Each action reads the current AE cursor and selection.","Влево — раньше, вправо — позже. «До» не включает ключ на курсоре; «После» включает. Перед действием курсор и выделение перечитываются из AE."],["Close Gap","Убрать паузу"],["removes the empty gap under the cursor, independent of step and mode. Plan offers a preview for any direction or Close Gap. Apply Plan executes only the checked targets.","удаляет пустой промежуток под курсором независимо от шага и режима. Меню «План» проверяет любое направление или удаление паузы. «Применить план» выполняет только проверенные изменения."],["Time → Insert / Remove","Время → Вставить / Удалить"],["shifts later layers by the frame step. Keep leaves crossing layers intact; Retime Animation changes eligible animation only. Footage crossings need a manual AE split. No layers or keys are deleted; composition duration stays unchanged. Always preview the interval before applying.","сдвигает последующие слои на выбранный шаг. «Оставить» сохраняет пересекающие слои целиком. «Изменить анимацию» меняет только доступную анимацию. Видео и аудио на пересечении требуют ручного разделения в AE. Слои и ключи не удаляются; длительность композиции не меняется. Перед применением всегда показывается план."],["Insufficient video handles keep that entire layer in place by default. Settings can cancel the entire operation instead. Locked targets and key collisions block writing. Undo / Redo in AE. R refreshes; ? opens Help. Report opens and copies the diagnostics.","Если исходных кадров не хватает, весь этот слой по умолчанию остаётся на месте. В настройках можно выбрать «Отменить всё». Блокировки и коллизии ключей запрещают запись. Undo / Redo выполняйте в AE. R обновляет сведения; ? открывает справку. «Отчёт» открывает и копирует диагностику."],["Storage unavailable. Settings apply to this session.","Хранилище недоступно. Настройки действуют в этой сессии."],["Open FrameFlow via Window → Extensions in After Effects.","Откройте FrameFlow через Window → Extensions в After Effects."],["Open the panel in After Effects","Откройте панель в After Effects"],["Enter 1–1000000 whole frames.","Введите от 1 до 1000000 целых кадров."],["Close Gap","Убрать паузу"],["Insert Time","Вставить время"],["Remove Time","Удалить время"],["Settings file exceeds 20 KB.","Файл настроек превышает 20 KB."],["A layer starts or ends inside the interval. Trim/split it in AE or keep crossing layers.","Слой начинается или заканчивается внутри интервала. Разделите его в AE или оставьте пересекающие слои."],["Crossing video, audio, precomps, Time Remap and reverse Stretch require a split in AE. Choose Keep crossing layers to leave them unchanged.","Видео, аудио, прекомпозиции, Time Remap и обратный Stretch на пересечении требуют разделения в AE. Выберите «Оставить», чтобы сохранить их целиком."],["The interval would create invalid layer bounds.","Интервал создаст недопустимые границы слоя."],["Locked layer","Слой заблокирован"]];
    pairs.push(["Choose a supported arrangement.", "Выберите поддержанную раскладку."],["Choose a layer order.", "Выберите порядок слоёв."],["Choose a layout anchor.", "Выберите начало раскладки."],["Align uses the AE cursor.", "Выравнивание использует курсор AE."],["Invalid arrangement frame count.", "Недопустимое число кадров раскладки."],["Invalid composition timing.", "Некорректные параметры времени композиции."],["Choose at least two layers for Stagger or Sequence.", "Выберите минимум два слоя для лесенки или последовательности."],["Invalid arrangement layer data.", "Некорректные данные слоя для раскладки."],["Arrangement exceeds AE time limits.", "Раскладка выходит за временные границы AE."],["Arrangement targets changed. Preview again.", "Цели раскладки изменились. Повторите проверку."],["Keyed properties changed after preview. Preview again.", "Набор свойств с ключами изменился. Повторите проверку."],["Arrange requires a preview before applying.", "Перед применением раскладки нужен предпросмотр."]);
    pairs.push(["Choose a scope with 1 to 2000 layers.","Выберите область от 1 до 2000 слоёв."]);
    var cache = {};
    function message(value, language) {
        var text = String(value), code = language === "ru" ? "ru" : "en";
        if (cache[code]) return text.replace(cache[code].regex,function(s){return cache[code].map[s];});
        var from = language === "ru" ? 0 : 1, to = 1-from, keys = [], map = {}, i;
        for (i=0;i<pairs.length;i++) { if (!map[pairs[i][from]]) { keys.push(pairs[i][from]); map[pairs[i][from]]=pairs[i][to]; } }
        keys.sort(function(a,b){return b.length-a.length;});
        var escaped=[];
        for(i=0;i<keys.length;i++)escaped.push(keys[i].replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));
        cache[code] = {regex:new RegExp(escaped.join("|"),"g"),map:map};
        return text.replace(cache[code].regex,function(s){return map[s];});
    }
    return {message:message};
}());
if (typeof module === "object" && module.exports) module.exports = FFText;


var FFCore = (function () {
    function trim(v) { return String(v).replace(/^\s+|\s+$/g, ""); }
    function frames(v) {
        var s = trim(v), n;
        if (!/^\d+$/.test(s)) throw new Error("Кадры: введите положительное целое число.");
        n = Number(s);
        if (!isFinite(n) || n < 1 || n > 1000000) throw new Error("Кадры: допустимо от 1 до 1000000.");
        return n;
    }
    function decimal(v) {
        var s = trim(v).replace(",", "."), n;
        if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(s)) throw new Error("Диапазон: нужен номер кадра, например 24 или 24.5.");
        n = Number(s);
        if (!isFinite(n)) throw new Error("Диапазон: число вне допустимого предела.");
        return n;
    }
    function inRegion(t, r) {
        if (r.region === "before") return t < r.cti;
        if (r.region === "after") return t >= r.cti;
        if (r.region === "range") return t >= r.from && t < r.to;
        return true;
    }
    function offsetSeconds(c, r) {
        var d;
        if (r.direction !== 1 && r.direction !== -1) throw new Error("Не задано направление");
        if (typeof r.deltaSeconds !== "undefined") {
            d = r.deltaSeconds;
            if (typeof d !== "number" || !isFinite(d) || d === 0 || Math.abs(d) > 10800 || d * r.direction <= 0) throw new Error("Некорректный интервал сдвига");
            return d;
        }
        return frames(r.frames) * c.frameDuration * r.direction;
    }
    /* Pure whole-layer layout. Order is explicit and never depends on selection click order. */
    function arrangement(models, c, r) {
        var ordered = models.slice(0), slots = [], seen = {}, i, m, at, delta, step;
        if (r.action !== "alignIn" && r.action !== "alignOut" && r.action !== "stagger" && r.action !== "sequence") throw new Error("Choose a supported arrangement.");
        if (r.order !== "top" && r.order !== "bottom" && r.order !== "time") throw new Error("Choose a layer order.");
        if (r.anchor !== "cursor" && r.anchor !== "first") throw new Error("Choose a layout anchor.");
        if ((r.action === "alignIn" || r.action === "alignOut") && r.anchor !== "cursor") throw new Error("Align uses the AE cursor.");
        if (typeof r.frames !== "number" || !isFinite(r.frames) || Math.floor(r.frames) !== r.frames || r.frames < (r.action === "sequence" ? 0 : 1) || r.frames > 1000000) throw new Error("Invalid arrangement frame count.");
        if (!isFinite(c.cti) || !isFinite(c.frameDuration) || c.frameDuration <= 0) throw new Error("Invalid composition timing.");
        if (!ordered.length || ordered.length > 2000) throw new Error("Choose a scope with 1 to 2000 layers.");
        if ((r.action === "stagger" || r.action === "sequence") && ordered.length < 2) throw new Error("Choose at least two layers for Stagger or Sequence.");
        for (i = 0; i < ordered.length; i++) {
            m = ordered[i];
            if (typeof m.id !== "number" || !isFinite(m.id) || seen["k"+m.id] || !isFinite(m.index) || !isFinite(m.start) || !isFinite(m.inPoint) || !isFinite(m.outPoint) || m.inPoint >= m.outPoint) throw new Error("Invalid arrangement layer data.");
            seen["k"+m.id] = true;
        }
        ordered.sort(function (a,b) { return r.order === "time" ? a.inPoint-b.inPoint || a.index-b.index : r.order === "bottom" ? b.index-a.index : a.index-b.index; });
        at = r.anchor === "cursor" ? c.cti : ordered[0].inPoint; step = r.frames*c.frameDuration;
        for (i = 0; i < ordered.length; i++) {
            m = ordered[i]; delta = r.action === "alignOut" ? c.cti-m.outPoint : r.action === "alignIn" ? c.cti-m.inPoint : at-m.inPoint;
            if (!isFinite(delta) || Math.abs(delta) > 10800 || Math.abs(m.start+delta) > 10800 || Math.abs(m.inPoint+delta) > 10800 || Math.abs(m.outPoint+delta) > 10800) throw new Error("Arrangement exceeds AE time limits.");
            slots.push({id:m.id,delta:delta});
            if (r.action === "sequence") at += m.outPoint-m.inPoint+step;
            else if (r.action === "stagger") at += step;
        }
        return slots;
    }
    function gapPlan(layers, c) {
        var a = 0, b = null, i, l, d, eps = c.frameDuration * 0.000001;
        function no(why) { return {ok:false,reason:why}; }
        if (!isFinite(c.cti) || c.cti < 0 || c.cti >= c.duration || !(c.frameDuration > 0)) return no("Курсор должен быть внутри композиции");
        if (!layers.length) return no("В выбранной области нет слоёв");
        for (i = 0; i < layers.length; i++) {
            l = layers[i];
            if (!isFinite(l.inPoint) || !isFinite(l.outPoint) || l.inPoint >= l.outPoint) return no("У слоя некорректные границы времени");
            if (l.inPoint <= c.cti && l.outPoint > c.cti) return no("Курсор находится на слое; пустого промежутка нет");
            if (l.outPoint <= c.cti && l.outPoint > a) a = l.outPoint;
            if (l.inPoint > c.cti && (b === null || l.inPoint < b)) b = l.inPoint;
        }
        if (b === null || b >= c.duration) return no("После курсора нет следующего слоя внутри композиции");
        d = b-a;
        if (d <= eps) return no("Между слоями нет паузы");
        for (i = 0; i < layers.length; i++) if (layers[i].inPoint >= b && layers[i].locked) return no("После паузы есть заблокированный слой (Locked)");
        return {ok:true,start:a,end:b,duration:d,frames:d/c.frameDuration};
    }
    function parsePanelState(raw) {
        var result = {settings:{frames:1,scope:"auto",compMarkers:false},storageProtected:false,note:""}, parts, pair, seen = {}, i;
        if (raw === null || typeof raw === "undefined" || raw === "") return result;
        try {
            parts = String(raw).split("|"); if (parts[0] !== "v1") throw new Error("Версия");
            for (i = 1; i < parts.length; i++) {
                pair = parts[i].split("=");
                if (pair.length !== 2 || seen["k:"+pair[0]]) throw new Error("Формат");
                seen["k:"+pair[0]] = true;
                if (pair[0] === "frames") result.settings.frames = frames(pair[1]);
                else if (pair[0] === "scope") {
                    if (pair[1] !== "auto" && pair[1] !== "all" && pair[1] !== "selected") throw new Error("Область");
                    result.settings.scope = pair[1];
                } else if (pair[0] === "compMarkers") {
                    if (pair[1] !== "0" && pair[1] !== "1") throw new Error("Маркеры");
                    result.settings.compMarkers = pair[1] === "1";
                } else throw new Error("Неизвестное поле");
            }
        } catch (e) {
            result.settings = {frames:1,scope:"auto",compMarkers:false}; result.storageProtected = true;
            result.note = "Сохранённые параметры панели не распознаны и оставлены без изменений. Значения действуют в этой сессии.";
        }
        return result;
    }
    function encodePanelState(s) {
        if (s.scope !== "auto" && s.scope !== "all" && s.scope !== "selected") throw new Error("Неизвестная область");
        return "v1|frames="+frames(s.frames)+"|scope="+s.scope+"|compMarkers="+(s.compMarkers ? "1" : "0");
    }
    function validMode(mode) { return mode === "offset" || mode === "keys" || mode === "selectedKeys" || mode === "layers"; }
    function parseAdvancedState(raw) {
        var result = {settings:{mode:"offset",strict:false},storageProtected:false,note:""}, parts, pair, seen = {}, i;
        if (raw === null || typeof raw === "undefined" || raw === "") return result;
        try {
            parts = String(raw).split("|"); if (parts[0] !== "v1") throw new Error("Версия");
            for (i = 1; i < parts.length; i++) {
                pair = parts[i].split("=");
                if (pair.length !== 2 || seen["k:"+pair[0]]) throw new Error("Формат");
                seen["k:"+pair[0]] = true;
                if (pair[0] === "mode") { if (!validMode(pair[1])) throw new Error("Режим"); result.settings.mode = pair[1]; }
                else if (pair[0] === "strict") {
                    if (pair[1] !== "0" && pair[1] !== "1") throw new Error("Строгая проверка");
                    result.settings.strict = pair[1] === "1";
                } else throw new Error("Неизвестное поле");
            }
        } catch (e) {
            result.settings = {mode:"offset",strict:false}; result.storageProtected = true;
            result.note = "Параметры режимов не распознаны и сохранены без изменений. Используются значения этой сессии.";
        }
        return result;
    }
    function encodeAdvancedState(s) {
        if (!validMode(s.mode) || typeof s.strict !== "boolean") throw new Error("Неизвестные параметры режима");
        return "v1|mode="+s.mode+"|strict="+(s.strict ? "1" : "0");
    }
    function wholeLayerPlan(m,c,r) {
        var d = offsetSeconds(c,r), a = m.inPoint, b = m.outPoint, st = m.start;
        if (!inRegion(a,{region:r.region,cti:c.cti})) return {kind:"none"};
        if (m.locked) return {skip:"Locked layer"};
        if (a >= b) return {skip:"Некорректные границы слоя"};
        if (Math.abs(st+d) > 10800 || Math.abs(a+d) > 10800 || Math.abs(b+d) > 10800) return {skip:"Границы слоя выйдут за диапазон AE ±10800 s"};
        return {kind:"layer",delta:d,start:st+d,inPoint:a+d,outPoint:b+d};
    }
    function intervalLayerPlan(m, c, r) {
        var a = r.interval.start, b = r.interval.end, d = offsetSeconds(c,r), remove = r.operation === "removeTime", edge;
        if (m.outPoint <= a) return {kind:"none"};
        if (m.inPoint >= (remove ? b : a)) return wholeLayerPlan(m,c,{region:"all",direction:r.direction,deltaSeconds:d,frames:r.frames});
        if (r.interval.crossing === "keep") return {kind:"none",kept:true};
        if (m.locked) return {skip:"Locked layer"};
        if (remove && (m.inPoint >= a || m.outPoint < b)) return {skip:"A layer starts or ends inside the interval. Trim/split it in AE or keep crossing layers."};
        if (m.movingSource || m.remap || m.stretch <= 0) return {skip:"Crossing video, audio, precomps, Time Remap and reverse Stretch require a split in AE. Choose Keep crossing layers to leave them unchanged."};
        edge = {kind:"edge",delta:d,start:m.start,inPoint:m.inPoint,outPoint:m.outPoint+d};
        if (edge.inPoint >= edge.outPoint || Math.abs(edge.outPoint) > 10800) return {skip:"The interval would create invalid layer bounds."};
        return edge;
    }
    function offsetLayerPlan(m, c, r) {
        var d = offsetSeconds(c,r), kind = "none", a = m.inPoint, b = m.outPoint, st = m.start;
        if (r.direction !== 1 && r.direction !== -1) throw new Error("Не задано направление");
        if (r.region !== "before" && r.region !== "after") throw new Error("Выберите сторону курсора");
        if (r.region === "before") {
            if (b <= c.cti) kind = "layer";
            else if (a < c.cti) kind = "edge";
        } else {
            if (a >= c.cti) kind = "layer";
            else if (b > c.cti) kind = "edge";
        }
        if (kind === "none") return {kind:"none"};
        if (m.locked) return {skip:"Locked layer"};
        if (kind === "layer") { st += d; a += d; b += d; }
        else if (kind === "edge") { if (r.region === "before") a += d; else b += d; }
        if (kind !== "none" && (a >= b || b - a < c.frameDuration * 0.000001)) return {skip:"Сдвиг обнулит или перевернёт длительность слоя"};
        if (Math.abs(st) > 10800 || Math.abs(a) > 10800 || Math.abs(b) > 10800) return {skip:"Границы слоя выйдут за диапазон AE ±10800 s"};
        return {kind:kind,delta:d,start:st,inPoint:a,outPoint:b};
    }
    function keyPlan(keys, c, r, selectedOnly) {
        var times = [], i, moved = 0, d = offsetSeconds(c,r);
        var filter = {region:r.region, cti:c.cti, from:r.from, to:r.to};
        var roving = false, epsilon = c.frameDuration * 0.000001;
        for (i = 0; i < keys.length; i++) {
            times[i] = keys[i].time;
            if ((!selectedOnly || keys[i].selected) && inRegion(keys[i].time, filter)) {
                times[i] += d;
                moved++;
            }
            if (keys[i].roving) roving = true;
        }
        if (moved === 0) return {times:times, moved:0};
        if (moved !== keys.length && roving) return {times:times, moved:0, skip:"Roving: требуется равномерный перенос всех ключей свойства"};
        for (i = 0; i < times.length; i++) {
            if (!isFinite(times[i]) || Math.abs(times[i]) > 10800) return {error:"Время ключа вне границ AE",moved:0};
            if (i > 0 && Math.abs(times[i] - times[i-1]) <= epsilon) return {error:"Коллизия ключей: операция заблокирована",moved:0};
            if (i > 0 && times[i] < times[i-1]) return {error:"Меняется порядок ключей: операция заблокирована",moved:0};
        }
        return {times:times, moved:moved};
    }
    function favorites(v) {
        var parts = trim(v).split(","), out = [], i, j, n, found;
        if (parts.length > 8) throw new Error("Избранное: максимум 8 значений.");
        for (i = 0; i < parts.length; i++) {
            n = frames(parts[i]); found = false;
            for (j = 0; j < out.length; j++) if (out[j] === n) found = true;
            if (!found) out.push(n);
        }
        return out;
    }
    function defaults() { return {density:0, spacing:6, logging:false, favorites:[1,5,12,24]}; }
    function parseSettings(raw) {
        var result = {settings:defaults(), storageProtected:false, note:""}, parts, i, pair, n;
        if (raw === null || typeof raw === "undefined" || raw === "") return result;
        parts = String(raw).split("|");
        if (parts[0] !== "v1") {
            result.storageProtected = true; result.note = "Неизвестная версия настроек сохранена. Новые настройки действуют только в этой сессии."; return result;
        }
        try {
            for (i = 1; i < parts.length; i++) {
                pair = parts[i].split("=");
                if (pair.length !== 2) throw new Error("Повреждённый формат");
                if (pair[0] === "density") {
                    n = Number(pair[1]); if (!/^[01]$/.test(pair[1])) throw new Error("density"); result.settings.density = n;
                } else if (pair[0] === "spacing") {
                    n = Number(pair[1]); if (!/^\d+$/.test(pair[1]) || n < 3 || n > 16) throw new Error("spacing"); result.settings.spacing = n;
                } else if (pair[0] === "logging") {
                    if (!/^[01]$/.test(pair[1])) throw new Error("logging"); result.settings.logging = pair[1] === "1";
                } else if (pair[0] === "favorites") result.settings.favorites = favorites(pair[1]);
                else throw new Error("Неизвестный параметр");
            }
        } catch (e) {
            result.settings = defaults(); result.storageProtected = true;
            result.note = "Повреждённые настройки сохранены. Используются сессионные значения по умолчанию.";
        }
        return result;
    }
    function encodeSettings(s) {
        return "v1|density=" + s.density + "|spacing=" + s.spacing + "|logging=" + (s.logging ? "1" : "0") + "|favorites=" + s.favorites.join(",");
    }
    return {arrangement:arrangement,validMode:validMode,wholeLayerPlan:wholeLayerPlan,intervalLayerPlan:intervalLayerPlan,parseAdvancedState:parseAdvancedState,encodeAdvancedState:encodeAdvancedState,
        offsetSeconds:offsetSeconds,gapPlan:gapPlan,parsePanelState:parsePanelState,encodePanelState:encodePanelState,parseFrames:frames, parseDecimal:decimal, inRegion:inRegion, offsetLayerPlan:offsetLayerPlan, keyPlan:keyPlan,
        parseFavorites:favorites, defaults:defaults, parseSettings:parseSettings, encodeSettings:encodeSettings};
}());

/* FrameFlow AE 2.4.0. AE adapter; native values never pass through JSON. */
var FFHost = (function () {
    var LIMITS = {properties:20000, keys:50000, reportLines:300, textCharacters:2000};
    var ROOTS = ["ADBE Transform Group", "ADBE Mask Parade", "ADBE Effect Parade", "ADBE MTrackers",
        "ADBE Audio Group", "ADBE Text Properties", "ADBE Root Vectors Group", "ADBE Layer Styles",
        "ADBE Material Options Group", "ADBE Extrsn Options Group", "ADBE Plane Options Group",
        "ADBE Camera Options Group", "ADBE Light Options Group", "ADBE Layer Overrides",
        "ADBE Time Remapping", "ADBE Marker"];
    function copy(v) {
        var a, i;
        if (v && typeof v === "object" && typeof v.length === "number") {
            a = []; for (i = 0; i < v.length; i++) a[i] = copy(v[i]); return a;
        }
        return v;
    }
    function equal(a, b, tolerance) {
        var i, k, countA = 0, countB = 0;
        if (typeof a === "number" && typeof b === "number") return Math.abs(a-b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));
        if (a === b) return true;
        if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
        if (typeof a.length === "number" || typeof b.length === "number") {
            if (a.length !== b.length) return false;
            for (i = 0; i < a.length; i++) if (!equal(a[i],b[i],tolerance)) return false;
            return true;
        }
        for (k in a) if (a.hasOwnProperty(k)) { countA++; if (!b.hasOwnProperty(k) || !equal(a[k], b[k], tolerance)) return false; }
        for (k in b) if (b.hasOwnProperty(k)) countB++;
        return countA === countB;
    }
    function readableTextFields(value, fallback) {
        var out = {}, names = {}, i, name, v, reflected;
        function simple(a) {
            var j, t = typeof a;
            if (a === null || t === "string" || t === "boolean" || t === "number") return true;
            if (a && t === "object" && typeof a.length === "number") {
                for (j = 0; j < a.length; j++) if (!simple(a[j])) return false;
                return true;
            }
            return false;
        }
        for (i = 0; i < fallback.length; i++) names[fallback[i]] = true;
        /* Reflection is documented ExtendScript; include readable new attributes rather than a frozen subset. */
        try {
            reflected = value.reflect.properties;
            for (i = 0; i < reflected.length; i++) names[String(reflected[i].name)] = true;
        } catch (noReflection) { }
        for (name in value) names[name] = true;
        for (name in names) if (names.hasOwnProperty(name) && name !== "reflect" && name !== "__proto__") {
            try {
                v = value[name];
                if (typeof v === "undefined") out[name] = {state:"undefined"};
                else if (simple(v)) out[name] = {state:"value",value:copy(v)};
                else if (typeof v !== "function") {
                    /* Enumerators are immutable native values; keep their stable text identity. */
                    if (typeof v === "object" && typeof v.reflect !== "undefined" && String(v.reflect.name) === "Enumerator") out[name] = {state:"enum",value:String(v)};
                }
            } catch (unreadable) { out[name] = {state:"unreadable"}; }
        }
        return out;
    }
    function signature(v, type) {
        var s = {}, fields, i, name;
        if (type === PropertyValueType.SHAPE) {
            fields = ["closed","vertices","inTangents","outTangents","featherSegLocs","featherRelSegLocs","featherRadii",
                "featherInterps","featherTensions","featherTypes","featherRelCornerAngles"];
        } else if (type === PropertyValueType.TEXT_DOCUMENT) {
            fields = ["text","font","fontSize","applyFill","applyStroke","fillColor","strokeColor","strokeWidth",
                "strokeOverFill","justification","tracking","leading","autoLeading","baselineShift","horizontalScale",
                "verticalScale","fauxBold","fauxItalic","allCaps","smallCaps","superscript","subscript",
                "boxText","boxTextSize","boxTextPos","pointText"];
        } else if (type === PropertyValueType.MARKER) {
            fields = ["comment","chapter","url","frameTarget","cuePointName","duration","eventCuePoint","label","protectedRegion"];
        } else return copy(v);
        for (i = 0; i < fields.length; i++) {
            name = fields[i];
            try { if (typeof v[name] !== "undefined") s[name] = copy(v[name]); } catch (ignored) { /* conditional native attribute */ }
        }
        if (type === PropertyValueType.TEXT_DOCUMENT) {
            if (typeof v.characterRange !== "function") throw new Error("Source Text: требуется CharacterRange для проверки форматирования");
            if (v.text.length > LIMITS.textCharacters) throw new Error("Source Text: более 2000 символов в ключе; свойство исключено для ограниченной стоимости проверки");
            s.document = readableTextFields(v,fields);
            s.characters = [];
            for (i = 0; i < v.text.length; i++) s.characters.push(readableTextFields(v.characterRange(i,i+1),fields));
            s.paragraphs = [];
            if (typeof v.paragraphCount === "number" && v.paragraphCount > 1) {
                if (typeof v.paragraphRange !== "function") throw new Error("Source Text: требуется ParagraphRange для проверки абзацев");
                for (i = 0; i < v.paragraphCount; i++) s.paragraphs.push(readableTextFields(v.paragraphRange(i,i+1),fields));
            }
        }
        if (type === PropertyValueType.MARKER) s.parameters = copyParameters(v.getParameters());
        return s;
    }
    function copyParameters(v) {
        var s = {}, k; for (k in v) if (v.hasOwnProperty(k)) s[k] = v[k]; return s;
    }
    function easeList(a) {
        var b = [], i; for (i = 0; i < a.length; i++) b.push({speed:a[i].speed, influence:a[i].influence}); return b;
    }
    function nativeEase(a) {
        var b = [], i; for (i = 0; i < a.length; i++) b.push(new KeyframeEase(a[i].speed,a[i].influence)); return b;
    }
    function sourceState(p) {
        if (!p.canSetExpression) return {text:"", enabled:false};
        return {text:p.expression, enabled:p.expressionEnabled};
    }
    function snapshotProperty(p) {
        var s = {type:p.propertyValueType, spatial:p.isSpatial === true, marker:p.propertyValueType === PropertyValueType.MARKER,
            expression:sourceState(p), keys:[], hasLabels:false}, k, v, i, easeCount;
        s.hasLabels = !s.marker && typeof p.keyLabel === "function" && typeof p.setLabelAtKey === "function";
        for (i = 1; i <= p.numKeys; i++) {
            v = p.keyValue(i);
            k = {time:p.keyTime(i), value:copy(v), signature:signature(v,s.type), selected:p.keySelected(i)};
            if (!s.marker) {
                k.inType = p.keyInInterpolationType(i); k.outType = p.keyOutInterpolationType(i);
                k.inEase = easeList(p.keyInTemporalEase(i)); k.outEase = easeList(p.keyOutTemporalEase(i));
                easeCount = s.type === PropertyValueType.TwoD ? 2 : (s.type === PropertyValueType.ThreeD ? 3 : 1);
                if (k.inEase.length !== easeCount || k.outEase.length !== easeCount) throw new Error("Неожиданная размерность Temporal Ease");
                k.temporalAuto = p.keyTemporalAutoBezier(i); k.temporalContinuous = p.keyTemporalContinuous(i);
                if (s.hasLabels) k.label = p.keyLabel(i);
                if (s.spatial) {
                    k.inTangent = copy(p.keyInSpatialTangent(i)); k.outTangent = copy(p.keyOutSpatialTangent(i));
                    k.spatialAuto = p.keySpatialAutoBezier(i); k.spatialContinuous = p.keySpatialContinuous(i); k.roving = p.keyRoving(i);
                }
            }
            s.keys.push(k);
        }
        return s;
    }
    function remapAnchor(p, times) {
        var all = [], i, high, low, gap = 0, anchor;
        for (i = 1; i <= p.numKeys; i++) all.push(p.keyTime(i));
        for (i = 0; i < times.length; i++) all.push(times[i]);
        if (!all.length) throw new Error("Time Remap: нет ключа для безопасной записи");
        all.sort(function (a,b) { return a-b; }); low = all[0]; high = all[all.length-1];
        if (high + 1 <= 10800) return high + 1;
        if (low - 1 >= -10800) return low - 1;
        for (i = 1; i < all.length; i++) if (all[i]-all[i-1] > gap) { gap = all[i]-all[i-1]; anchor = (all[i]+all[i-1])/2; }
        if (gap < 0.001) throw new Error("Time Remap: нет свободного времени для временного ключа");
        return anchor;
    }
    function restoreExpressionState(p, s) {
        if (!p.canSetExpression || !s.expression) return;
        if (p.expression !== s.expression.text) throw new Error("Текст Expression изменился вне операции");
        if (p.expressionEnabled !== s.expression.enabled) p.expressionEnabled = s.expression.enabled;
    }
    function restoreProperty(p, s, times) {
        var i, k, anchor, remap = p.matchName === "ADBE Time Remapping";
        /* Removing the last Time Remap key can disable its host property. Keep a temporary key throughout writing. */
        if (remap) {
            anchor = remapAnchor(p,times);
            p.setValueAtTime(anchor,s.keys[0].value);
        }
        for (i = p.numKeys; i >= 1; i--) if (!remap || Math.abs(p.keyTime(i)-anchor) > 0.000001) p.removeKey(i);
        for (i = 0; i < s.keys.length; i++) p.setValueAtTime(times[i],s.keys[i].value);
        if (remap) {
            for (i = p.numKeys; i >= 1; i--) if (Math.abs(p.keyTime(i)-anchor) <= 0.000001) { p.removeKey(i); break; }
        }
        if (p.numKeys !== s.keys.length) throw new Error("AE объединил ключи при записи");
        for (i = 0; i < s.keys.length; i++) {
            k = s.keys[i];
            if (!s.marker) {
                p.setInterpolationTypeAtKey(i+1,k.inType,k.outType);
                p.setTemporalAutoBezierAtKey(i+1,false); p.setTemporalContinuousAtKey(i+1,false);
                if (k.inType === KeyframeInterpolationType.BEZIER || k.outType === KeyframeInterpolationType.BEZIER) {
                    p.setTemporalEaseAtKey(i+1,nativeEase(k.inEase),nativeEase(k.outEase));
                }
                p.setInterpolationTypeAtKey(i+1,k.inType,k.outType);
                p.setTemporalContinuousAtKey(i+1,k.temporalContinuous);
                p.setTemporalAutoBezierAtKey(i+1,k.temporalAuto);
                if (s.spatial) {
                    p.setRovingAtKey(i+1,false); p.setSpatialAutoBezierAtKey(i+1,false); p.setSpatialContinuousAtKey(i+1,false);
                    p.setSpatialTangentsAtKey(i+1,k.inTangent,k.outTangent);
                    p.setSpatialContinuousAtKey(i+1,k.spatialContinuous); p.setSpatialAutoBezierAtKey(i+1,k.spatialAuto);
                }
                if (s.hasLabels) p.setLabelAtKey(i+1,k.label);
            }
        }
        /* Roving only after all values/tangents/endpoints exist. */
        if (s.spatial) for (i = 0; i < s.keys.length; i++) if (s.keys[i].roving) p.setRovingAtKey(i+1,true);
        for (i = 0; i < s.keys.length; i++) p.setSelectedAtKey(i+1,s.keys[i].selected);
        restoreExpressionState(p,s);
    }
    function verifyProperty(p, s, times, timeTolerance) {
        var now = snapshotProperty(p), i, k, actual, field, names;
        if (now.type !== s.type || now.keys.length !== s.keys.length) throw new Error("Изменились тип или число ключей");
        if (!equal(now.expression,s.expression,0)) throw new Error("Изменился Expression");
        for (i = 0; i < s.keys.length; i++) {
            k = s.keys[i]; actual = now.keys[i];
            if (Math.abs(actual.time-times[i]) > timeTolerance) throw new Error("Время ключа " + (i+1) + " не совпадает с расчётом");
            if (!equal(k.signature,actual.signature,0.000001)) throw new Error("Значение ключа " + (i+1) + " не сохранилось");
            names = ["selected"];
            if (!s.marker) {
                if (actual.inType !== k.inType || actual.outType !== k.outType) throw new Error("Interpolation ключа " + (i+1) + " не сохранилась");
                names = names.concat(["temporalAuto","temporalContinuous"]);
                if (!k.temporalAuto && (k.inType === KeyframeInterpolationType.BEZIER || k.outType === KeyframeInterpolationType.BEZIER)) names = names.concat(["inEase","outEase"]);
                if (s.hasLabels) names.push("label");
                if (s.spatial) names = names.concat(["inTangent","outTangent","spatialAuto","spatialContinuous","roving"]);
            }
            for (field = 0; field < names.length; field++) if (!equal(k[names[field]],actual[names[field]],0.000001)) {
                throw new Error(names[field] + " ключа " + (i+1) + " не сохранилось");
            }
        }
    }
    function originalTimes(s) { var a = [], i; for (i = 0; i < s.keys.length; i++) a.push(s.keys[i].time); return a; }
    function pathOf(p, layer) {
        var path = [], n = p, steps = 0;
        while (n && n !== layer && steps < 40) {
            path.unshift({index:n.propertyIndex, match:n.matchName}); n = n.propertyGroup(1); steps++;
        }
        if (n !== layer) throw new Error("Не удалось определить путь свойства");
        return path;
    }
    function pathKey(path) {
        var a = [], i; for (i = 0; i < path.length; i++) a.push(path[i].index + ":" + path[i].match); return a.join("/");
    }
    function resolve(layer, path) {
        var node = layer, next, i;
        for (i = 0; i < path.length; i++) {
            next = null;
            try { next = node.property(path[i].index); } catch (ignored) { }
            if (!next || next.matchName !== path[i].match) next = node.property(path[i].match);
            if (!next || next.matchName !== path[i].match) throw new Error("Свойство недоступно: " + path[i].match);
            node = next;
        }
        return node;
    }
    function scanLayer(layer) {
        var out = [], seen = {}, visited = 0, i, root;
        function walk(node, depth) {
            var key, j;
            if (!node) return;
            visited++; if (visited > LIMITS.properties || depth > 40) throw new Error("Слишком большой набор свойств; сузьте область.");
            if (node.propertyType === PropertyType.PROPERTY) {
                key = pathKey(pathOf(node,layer));
                if (!seen["p:"+key]) { seen["p:"+key] = true; out.push(node); }
                return;
            }
            for (j = 1; j <= node.numProperties; j++) walk(node.property(j),depth+1);
        }
        for (i = 1; i <= layer.numProperties; i++) walk(layer.property(i),0);
        for (i = 0; i < ROOTS.length; i++) {
            root = null; try { root = layer.property(ROOTS[i]); } catch (ignored) { }
            if (root) walk(root,0);
        }
        /* Selected properties include user/plugin groups not in the common root catalogue. */
        for (i = 0; i < layer.selectedProperties.length; i++) walk(layer.selectedProperties[i],0);
        return out;
    }
    function allowedType(t) {
        return t === PropertyValueType.OneD || t === PropertyValueType.TwoD || t === PropertyValueType.ThreeD ||
            t === PropertyValueType.TwoD_SPATIAL || t === PropertyValueType.ThreeD_SPATIAL || t === PropertyValueType.COLOR ||
            t === PropertyValueType.LAYER_INDEX || t === PropertyValueType.MASK_INDEX || t === PropertyValueType.SHAPE || t === PropertyValueType.TEXT_DOCUMENT;
    }
    function labelFor(layer, path) {
        return "Layer #" + layer.index + " (id " + layer.id + ") / " + (path.length ? path[path.length-1].match : "слой");
    }
    function errorInfo(e) {
        var info = {message:String(e && e.message ? e.message : e)};
        try { if (e.line) info.line = e.line; } catch (ignored1) { }
        try { if (e.fileName) info.file = String(e.fileName).replace(/^.*[\\\/]/, ""); } catch (ignored2) { }
        try { if (e.stack) info.stack = String(e.stack).substring(0,2000); } catch (ignored3) { }
        return info;
    }
    function readContext() {
        var comp = app.project ? app.project.activeItem : null;
        if (!(comp instanceof CompItem)) throw new Error("Откройте композицию в AE.");
        return {comp:comp, cti:comp.time, duration:comp.duration, frameDuration:comp.frameDuration};
    }
    function captureNative(p) {
        var s = {nativeOnly:true,keys:[],expression:null}, i;
        if (p.canSetExpression) s.expression = {text:p.expression,enabled:p.expressionEnabled};
        for (i = 1; i <= p.numKeys; i++) s.keys.push({time:p.keyTime(i),selected:p.keySelected(i)});
        return s;
    }
    function verifyNative(p, s, times, tolerance) {
        var i;
        if (p.numKeys !== s.keys.length) throw new Error("Изменилось число нативных ключей");
        if (s.expression && (p.expression !== s.expression.text || p.expressionEnabled !== s.expression.enabled)) throw new Error("Изменился Expression");
        for (i = 0; i < times.length; i++) {
            if (Math.abs(p.keyTime(i+1)-times[i]) > tolerance || p.keySelected(i+1) !== s.keys[i].selected) throw new Error("Нативный перенос ключей не совпал с расчётом");
        }
    }
    function selectedLayers(comp, scope, layerIds) {
        var layers = [], i, j;
        if (layerIds) {
            for (i = 1; i <= comp.numLayers; i++) for (j = 0; j < layerIds.length; j++) {
                if (comp.layer(i).id === layerIds[j]) { layers.push(comp.layer(i)); break; }
            }
            if (layers.length !== layerIds.length) throw new Error("Target layers changed; refresh the panel.");
            return layers;
        }
        if (scope !== "auto" && scope !== "all" && scope !== "selected") throw new Error("Неизвестная область");
        if (scope === "all" || (scope === "auto" && !comp.selectedLayers.length)) {
            for (i = 1; i <= comp.numLayers; i++) layers.push(comp.layer(i));
        } else layers = comp.selectedLayers;
        if (!layers.length && scope === "selected") throw new Error("Выделите слои или выберите Авто / Всю композицию.");
        return layers;
    }
    function inspectGap(scope) {
        var context = readContext(), layers = selectedLayers(context.comp,scope), models = [], i, l;
        for (i = 0; i < layers.length; i++) {
            l = layers[i]; models.push({inPoint:l.inPoint,outPoint:l.outPoint,locked:l.locked,start:l.startTime});
        }
        return {context:context,layers:layers,models:models,gap:FFCore.gapPlan(models,context)};
    }
    function prepareGap(options) {
        var inspected = inspectGap(options.scope), gap = inspected.gap, p, t, duration, i, plan;
        if (!gap.ok) throw new Error(gap.reason);
        if (options.compMarkers && inspected.context.comp.markerProperty) {
            p = inspected.context.comp.markerProperty;
            for (i = 1; i <= p.numKeys; i++) {
                t = p.keyTime(i); duration = p.keyValue(i).duration;
                if ((t >= gap.start && t < gap.end) || (t < gap.end && t+duration > gap.start)) throw new Error("В удаляемой паузе есть маркер композиции. Отключите их перенос или измените маркеры.");
            }
        }
        plan = prepare({scope:options.scope,compMarkers:options.compMarkers === true,operation:"closeGap",frames:1,
            direction:-1,region:"after",deltaSeconds:-gap.duration,gap:gap,originalCTI:inspected.context.cti});
        plan.gapScope = inspected.layers; plan.gapModels = inspected.models;
        if (plan.skips.length) plan.errors.push("Пауза не удалена: не все цели доступны. Причины — в пропусках.");
        if (!plan.changes.length) plan.errors.push("После паузы нет доступных целей.");
        return plan;
    }
    function validateGapPlan(plan) {
        var now = inspectGap(plan.request.scope), i, a, b, eps = plan.context.frameDuration * 0.000001;
        if (now.context.comp !== plan.comp || Math.abs(now.context.cti-plan.request.originalCTI) > eps || now.layers.length !== plan.gapScope.length) throw new Error("Курсор или область паузы изменились; повторите действие");
        for (i = 0; i < now.layers.length; i++) {
            a = now.models[i]; b = plan.gapModels[i];
            if (now.layers[i] !== plan.gapScope[i] || a.locked !== b.locked || Math.abs(a.start-b.start) > eps || Math.abs(a.inPoint-b.inPoint) > eps || Math.abs(a.outPoint-b.outPoint) > eps) throw new Error("Слои около паузы изменились; повторите действие");
        }
    }
    function mediaBoundaryLimit(layer, after, context) {
        var source, duration, stretch, start, end, eps = context.frameDuration * 0.000001, limit = null;
        try {
            /* This rule concerns native finite footage only. Stills, precomps and remapped layers keep their existing behavior. */
            if (layer.timeRemapEnabled !== false) return null;
            source = layer.source;
            if (!source || !source.mainSource || source.mainSource.isStill !== false) return null;
            duration = source.duration; stretch = layer.stretch;
            if (typeof duration !== "number" || !isFinite(duration) || duration <= 0 || typeof stretch !== "number" || !isFinite(stretch) || stretch <= 0) return null;
            start = layer.startTime; end = start+duration*stretch/100;
            if (after.outPoint > layer.outPoint+eps && after.outPoint > end+eps) {
                limit = {field:"Out",requested:after.outPoint,available:end};
                limit.message = "Предел исходного медиа: Out запрошен "+after.outPoint+" s, доступен до "+end+" s. Весь слой пропущен.";
            } else if (after.inPoint < layer.inPoint-eps && after.inPoint < start-eps) {
                limit = {field:"In",requested:after.inPoint,available:start};
                limit.message = "Предел исходного медиа: In запрошен "+after.inPoint+" s, доступен от "+start+" s. Весь слой пропущен.";
            }
            if (limit) { limit.layerIndex = layer.index; limit.layerId = layer.id; limit.sourceDuration = duration; limit.stretch = stretch; }
        } catch (unavailableMediaMetadata) { return null; }
        return limit;
    }
    function prepareKeys(request,context) {
        var comp = context.comp, layers = selectedLayers(comp,request.scope,request.layerIds), selectedOnly = request.mode === "selectedKeys";
        var plan = {comp:comp,context:context,request:request,changes:[],skips:[],errors:[],notes:[],layerCount:layers.length,mediaLimits:[]};
        var i, j, layer, props, pending, p, path, failed, count = 0;
        function entry(prop,owner,propertyPath) {
            var k, t, s, kp, relevant = false;
            for (k = 1; k <= prop.numKeys; k++) {
                t = prop.keyTime(k);
                if ((!selectedOnly || prop.keySelected(k)) && FFCore.inRegion(t,{region:request.region,cti:context.cti})) { relevant = true; break; }
            }
            if (!relevant) return null;
            if (prop.isSeparationLeader && prop.dimensionsSeparated) return null;
            if (prop.propertyValueType !== PropertyValueType.MARKER && !allowedType(prop.propertyValueType)) throw new Error("Специальные ключи свойства "+prop.matchName+" пока не поддержаны");
            for (k = 0; k < propertyPath.length; k++) if (propertyPath[k].match === "ADBE Layer Overrides") throw new Error("Essential Properties: перенос ключей пока не поддержан");
            s = snapshotProperty(prop); count += s.keys.length;
            if (count > LIMITS.keys) throw new Error("Более 50000 ключей: сузьте область.");
            if (s.marker) for (k = 0; k < s.keys.length; k++) {
                if ((!selectedOnly || s.keys[k].selected) && s.keys[k].value.protectedRegion && FFCore.inRegion(s.keys[k].time,{region:request.region,cti:context.cti})) throw new Error("Protected Region: перенос маркера пропущен");
            }
            kp = FFCore.keyPlan(s.keys,context,request,selectedOnly);
            if (kp.error) { plan.errors.push(labelFor(owner || {index:"comp",id:comp.id},propertyPath)+": "+kp.error); throw new Error(kp.error); }
            if (kp.skip) throw new Error(kp.skip);
            if (!kp.moved) return null;
            return {kind:"property",layer:owner,path:propertyPath,snapshot:s,times:kp.times,moved:kp.moved,
                label:owner ? labelFor(owner,propertyPath) : "Маркеры композиции"};
        }
        for (i = 0; i < layers.length; i++) {
            layer = layers[i]; pending = []; failed = "";
            try {
                props = scanLayer(layer);
                if (layer.locked) {
                    var hasTarget = false, pi, ki, candidate;
                    for (pi = 0; pi < props.length && !hasTarget; pi++) {
                        candidate = props[pi];
                        for (ki = 1; ki <= candidate.numKeys; ki++) if ((!selectedOnly || candidate.keySelected(ki)) && FFCore.inRegion(candidate.keyTime(ki),{region:request.region,cti:context.cti})) { hasTarget = true; break; }
                    }
                    if (hasTarget) plan.skips.push(labelFor(layer,[])+": Locked layer");
                    continue;
                }
                for (j = 0; j < props.length; j++) {
                    p = props[j]; if (!p.numKeys) continue;
                    path = pathOf(p,layer); p = entry(p,layer,path); if (p) pending.push(p);
                }
            } catch (captureError) { failed = errorInfo(captureError).message; }
            if (failed) plan.skips.push(labelFor(layer,[])+": весь слой пропущен — "+failed);
            else for (j = 0; j < pending.length; j++) plan.changes.push(pending[j]);
        }
        if (request.compMarkers && comp.markerProperty && comp.markerProperty.numKeys) {
            try { p = entry(comp.markerProperty,null,[]); if (p) plan.changes.push(p); }
            catch (markerError) { plan.skips.push("Маркеры композиции: "+errorInfo(markerError).message); }
        }
        if (request.strict === true && plan.skips.length) plan.errors.push("Строгая проверка: есть пропуски. Вся операция отменена до записи.");
        plan.notes.push("Переносятся только ключи; Start/In/Out не меняются. Expressions сохранены, но их визуальный результат зависит от времени и внешних объектов.");
        return plan;
    }
    function intervalModel(layer) {
        var source = layer.source || null;
        return {layer:layer,start:layer.startTime,inPoint:layer.inPoint,outPoint:layer.outPoint,locked:layer.locked,
            stretch:layer.stretch,remap:layer.timeRemapEnabled === true,source:source,
            sourceDuration:source ? source.duration : null,still:source && source.mainSource ? source.mainSource.isStill === true : false,
            movingSource:layer.hasAudio === true || !!(source && !(source.mainSource && source.mainSource.isStill === true))};
    }
    function intervalSignature(layer, props) {
        var parts = [], i, total = 0; props = props || scanLayer(layer);
        for (i = 0; i < props.length; i++) if (props[i].numKeys) {
            total += props[i].numKeys; if (total > LIMITS.keys) throw new Error("More than 50000 keys: narrow the scope.");
            parts.push(pathKey(pathOf(props[i],layer))+":"+props[i].numKeys);
        }
        return parts.join("|");
    }
    function prepareInterval(options) {
        var context = readContext(), frames = FFCore.parseFrames(String(options.frames)), amount = frames*context.frameDuration;
        var a = context.cti, remove = options.action === "remove", plan, layers, i, marker;
        if (options.action !== "insert" && options.action !== "remove") throw new Error("Choose Insert Time or Remove Time.");
        if (options.crossing !== "keep" && options.crossing !== "retime") throw new Error("Choose a crossing-layer policy.");
        if (a < 0 || a >= context.duration || remove && a+amount > context.duration+context.frameDuration*0.000001) throw new Error("The interval must fit inside the composition.");
        plan = prepare({operation:remove ? "removeTime" : "insertTime",scope:options.scope,mode:"offset",region:"after",
            frames:frames,direction:remove ? -1 : 1,deltaSeconds:remove ? -amount : amount,strict:true,compMarkers:options.compMarkers === true,
            originalCTI:a,interval:{start:a,end:a+amount,crossing:options.crossing}});
        layers = selectedLayers(context.comp,options.scope); plan.intervalState = [];
        for (i = 0; i < layers.length; i++) plan.intervalState.push(intervalModel(layers[i]));
        marker = options.compMarkers === true ? context.comp.markerProperty || null : null;
        plan.intervalMarker = marker; plan.intervalMarkerSnapshot = marker ? snapshotProperty(marker) : null;
        plan.notes.push("Composition duration is unchanged. No layers or keys are deleted. Kept crossing layers: "+plan.keptCrossing.length+".");
        return plan;
    }
    function validateIntervalPlan(plan) {
        var context = readContext(), layers = selectedLayers(context.comp,plan.request.scope), i, a, b, field;
        var names = ["start","inPoint","outPoint","locked","stretch","remap","source","sourceDuration","still","movingSource"];
        if (context.comp !== plan.comp || context.cti !== plan.request.originalCTI || context.duration !== plan.context.duration || layers.length !== plan.intervalState.length) throw new Error("The interval or scope changed. Preview again.");
        for (i = 0; i < layers.length; i++) {
            a = intervalModel(layers[i]); b = plan.intervalState[i];
            if (a.layer !== b.layer) throw new Error("The interval or scope changed. Preview again.");
            for (field = 0; field < names.length; field++) if (a[names[field]] !== b[names[field]]) throw new Error("An interval target changed. Preview again.");
        }
        for (i = 0; i < plan.changes.length; i++) if (plan.changes[i].layer && intervalSignature(plan.changes[i].layer) !== plan.changes[i].intervalSignature) throw new Error("Keyed properties changed after preview. Preview again.");
        if (plan.request.compMarkers) {
            if ((plan.comp.markerProperty || null) !== plan.intervalMarker) throw new Error("Composition markers changed. Preview again.");
            if (plan.intervalMarker) verifyProperty(plan.intervalMarker,plan.intervalMarkerSnapshot,originalTimes(plan.intervalMarkerSnapshot),context.frameDuration*0.000001);
        }
    }
    function prepareArrange(options) {
        var context = readContext(), layers = selectedLayers(context.comp,options.scope), models = [], state = [], deltas = {}, i, slots, plan, byId = {}, orderedChanges = [];
        for (i = 0; i < layers.length; i++) {
            models.push({id:layers[i].id,index:layers[i].index,start:layers[i].startTime,inPoint:layers[i].inPoint,outPoint:layers[i].outPoint});
            state.push(intervalModel(layers[i]));
        }
        slots = FFCore.arrangement(models,context,options);
        for (i = 0; i < slots.length; i++) deltas["k"+slots[i].id] = slots[i].delta;
        plan = prepare({operation:"arrange",scope:options.scope,mode:"layers",region:"all",frames:1,direction:1,strict:true,layerDeltas:deltas});
        plan.arrangeState = state; plan.arrangeIndexes = [];
        for (i = 0; i < layers.length; i++) plan.arrangeIndexes.push(layers[i].index);
        plan.arrangement = {action:options.action,order:options.order,anchor:options.anchor,frames:options.frames,slots:slots};
        for (i = 0; i < plan.changes.length; i++) byId["k"+plan.changes[i].layer.id] = plan.changes[i];
        for (i = 0; i < slots.length; i++) if (byId["k"+slots[i].id]) orderedChanges.push(byId["k"+slots[i].id]);
        plan.changes = orderedChanges;
        return plan;
    }
    function validateArrangePlan(plan) {
        var context = readContext(), layers = selectedLayers(context.comp,plan.request.scope), i, j, a, b;
        var names = ["start","inPoint","outPoint","locked","stretch","remap","source","sourceDuration","still","movingSource"];
        if (context.comp !== plan.comp || context.cti !== plan.context.cti || context.frameDuration !== plan.context.frameDuration || context.duration !== plan.context.duration || layers.length !== plan.arrangeState.length) throw new Error("Arrangement targets changed. Preview again.");
        for (i = 0; i < layers.length; i++) {
            a = intervalModel(layers[i]); b = plan.arrangeState[i];
            if (a.layer !== b.layer || a.layer.index !== plan.arrangeIndexes[i]) throw new Error("Arrangement targets changed. Preview again.");
            for (j = 0; j < names.length; j++) if (a[names[j]] !== b[names[j]]) throw new Error("Arrangement targets changed. Preview again.");
        }
        for (i = 0; i < plan.changes.length; i++) if (intervalSignature(plan.changes[i].layer) !== plan.changes[i].intervalSignature) throw new Error("Keyed properties changed after preview. Preview again.");
    }
    function prepare(request) {
        var context = readContext(), comp = context.comp, layers = [], i, j, k, layer, props, p, path, s, kp, lp, count = 0;
        var plan = {comp:comp,context:context,request:request,changes:[],skips:[],errors:[],notes:[],layerCount:0,mediaLimits:[],keptCrossing:[]};
        var interval = request.operation === "insertTime" || request.operation === "removeTime";
        FFCore.offsetSeconds(context,request);
        if (request.direction !== 1 && request.direction !== -1) throw new Error("Не задано направление");
        if (request.region !== "before" && request.region !== "after" && request.region !== "all") throw new Error("Не задана сторона курсора");
        if (request.scope !== "auto" && request.scope !== "all" && request.scope !== "selected") throw new Error("Неизвестная область");
        if (typeof request.mode !== "undefined" && !FFCore.validMode(request.mode)) throw new Error("Неизвестный режим операции");
        if (typeof request.strict !== "undefined" && typeof request.strict !== "boolean") throw new Error("Некорректная строгая проверка");
        if (typeof request.mediaPolicy !== "undefined" && request.mediaPolicy !== "skip" && request.mediaPolicy !== "stop") throw new Error("Неизвестное правило предела исходника");
        if (request.mode === "keys" || request.mode === "selectedKeys") return prepareKeys(request,context);
        layers = selectedLayers(comp,request.scope,request.layerIds);
        plan.layerCount = layers.length;
        if (request.operation === "closeGap") context.cti = request.gap.end;
        if (interval && request.operation === "removeTime") context.cti = request.interval.end;
        function addCount(n) { count += n; if (count > LIMITS.keys) throw new Error("Более 50000 ключей: сузьте область."); }
        function relevant(prop) {
            var q;
            for (q = 1; q <= prop.numKeys; q++) if (FFCore.inRegion(prop.keyTime(q),{region:request.region,cti:context.cti})) return true;
            return false;
        }
        function partial(prop) {
            var snap = snapshotProperty(prop), info;
            addCount(snap.keys.length);
            if (snap.marker) for (var m = 0; m < snap.keys.length; m++) {
                if (snap.keys[m].value.protectedRegion && FFCore.inRegion(snap.keys[m].time,{region:request.region,cti:context.cti})) throw new Error("Protected Region: перенос этой части слоя пропущен");
            }
            info = FFCore.keyPlan(snap.keys,context,request,false);
            if (info.error) { plan.errors.push("Layer #"+(layer ? layer.index : "comp")+": "+info.error); throw new Error(info.error); }
            if (info.skip) throw new Error(info.skip);
            return {snapshot:snap,times:info.times,moved:info.moved};
        }
        function guardInterval(prop) {
            var q, t, v, r = request.interval;
            if (!interval) return;
            for (q = 1; q <= prop.numKeys; q++) {
                t = prop.keyTime(q);
                if (request.operation === "removeTime" && t >= r.start && t < r.end) throw new Error("A key lies inside the removed interval. No keys are deleted; move it or keep crossing layers.");
                if (prop.propertyValueType === PropertyValueType.MARKER) {
                    v = prop.keyValue(q);
                    if (v.duration > 0 && t < (request.operation === "removeTime" ? r.end : r.start) && t+v.duration > r.start) throw new Error("A duration marker overlaps the interval. Adjust it in AE first.");
                }
            }
        }
        for (i = 0; i < layers.length; i++) {
            layer = layers[i];
            if (request.operation === "closeGap" && layer.inPoint < context.cti) continue;
            if (request.layerDeltas) {
                var layerDelta = request.layerDeltas["k"+layer.id];
                if (Math.abs(layerDelta) <= context.frameDuration*0.000001) continue;
                lp = FFCore.wholeLayerPlan({start:layer.startTime,inPoint:layer.inPoint,outPoint:layer.outPoint,locked:layer.locked},context,{region:"all",frames:1,direction:layerDelta > 0 ? 1 : -1,deltaSeconds:layerDelta});
            } else lp = interval ? FFCore.intervalLayerPlan(intervalModel(layer),context,request) : (request.mode === "layers" ? FFCore.wholeLayerPlan : FFCore.offsetLayerPlan)({start:layer.startTime,inPoint:layer.inPoint,outPoint:layer.outPoint,locked:layer.locked},context,request);
            if (lp.kept) plan.keptCrossing.push(layer.id);
            if (lp.skip) { plan.skips.push(labelFor(layer,[])+": "+lp.skip); continue; }
            if (lp.kind === "none") continue;
            if (lp.kind === "edge") {
                var mediaLimit = mediaBoundaryLimit(layer,lp,context);
                if (mediaLimit) {
                    plan.mediaLimits.push(mediaLimit); plan.skips.push(labelFor(layer,[])+": "+mediaLimit.message); continue;
                }
            }
            var entries = [], failed = "", moved = 0;
            try {
                props = scanLayer(layer);
                for (j = 0; j < props.length; j++) {
                    p = props[j]; if (!p.numKeys) continue;
                    path = pathOf(p,layer);
                    if (lp.kind === "layer") {
                        /* Native startTime moves even custom/plugin keys without reconstructing their values. */
                        try { s = snapshotProperty(p); } catch (unreadableValue) { s = captureNative(p); }
                        addCount(s.keys.length); kp = {snapshot:s,times:originalTimes(s),moved:s.keys.length};
                        for (k = 0; k < kp.times.length; k++) {
                            kp.times[k] += lp.delta;
                            if (Math.abs(kp.times[k]) > 10800) throw new Error("Время ключа выйдет за диапазон AE");
                        }
                    } else {
                        guardInterval(p);
                        if (!interval && !relevant(p)) continue;
                        if (p.isSeparationLeader && p.dimensionsSeparated) continue;
                        if (p.propertyValueType !== PropertyValueType.MARKER && !allowedType(p.propertyValueType)) throw new Error("Специальные ключи свойства "+p.matchName+" пока не поддержаны");
                        for (k = 0; k < path.length; k++) if (path[k].match === "ADBE Layer Overrides") throw new Error("Essential Properties: частичный перенос пока не поддержан");
                        kp = partial(p);
                        if (!interval && !kp.moved) continue;
                    }
                    entries.push({path:path,snapshot:kp.snapshot,times:kp.times,moved:kp.moved}); moved += kp.moved;
                }
            } catch (captureError) { failed = errorInfo(captureError).message; }
            if (failed) { plan.skips.push(labelFor(layer,[])+": весь слой пропущен — "+failed); continue; }
            plan.changes.push({kind:lp.kind,layer:layer,before:{start:layer.startTime,inPoint:layer.inPoint,outPoint:layer.outPoint},
                after:{start:lp.start,inPoint:lp.inPoint,outPoint:lp.outPoint},properties:entries,delta:lp.delta,moved:moved,label:labelFor(layer,[]),intervalSignature:interval || request.layerDeltas ? intervalSignature(layer,props) : null});
        }
        if (request.compMarkers && comp.markerProperty && comp.markerProperty.numKeys && (interval || relevant(comp.markerProperty))) {
            layer = null;
            try {
                guardInterval(comp.markerProperty);
                kp = partial(comp.markerProperty);
                if (kp.moved) plan.changes.push({kind:"property",layer:null,path:[],snapshot:kp.snapshot,times:kp.times,moved:kp.moved,label:"Маркеры композиции"});
            } catch (markerError) { plan.skips.push("Маркеры композиции: "+errorInfo(markerError).message); }
        }
        /* Only finite-media limits may be intentionally left unchanged. All other skips stay atomic. */
        if (request.strict === true && plan.skips.length > (request.mediaPolicy === "skip" ? plan.mediaLimits.length : 0)) plan.errors.push("Строгая проверка: есть пропуски. Вся операция отменена до записи.");
        return plan;
    }
    function target(change, comp) { return change.layer ? resolve(change.layer,change.path) : comp.markerProperty; }
    function checkLayer(change, after, tolerance) {
        var v = after ? change.after : change.before, l = change.layer;
        if (Math.abs(l.startTime-v.start) > tolerance || Math.abs(l.inPoint-v.inPoint) > tolerance || Math.abs(l.outPoint-v.outPoint) > tolerance) {
            throw new Error("Границы слоя не совпадают с расчётом");
        }
    }
    function verifyEntry(layer, entry, times, tolerance) {
        var p = resolve(layer,entry.path);
        if (entry.snapshot.nativeOnly) verifyNative(p,entry.snapshot,times,tolerance);
        else verifyProperty(p,entry.snapshot,times,tolerance);
    }
    function verifyLayerProperties(change, after, tolerance) {
        var i, entry;
        for (i = 0; i < change.properties.length; i++) {
            entry = change.properties[i];
            verifyEntry(change.layer,entry,after ? entry.times : originalTimes(entry.snapshot),tolerance);
        }
    }
    function setBounds(layer, bounds, moveStart) {
        if (moveStart && layer.startTime !== bounds.start) layer.startTime = bounds.start;
        /* Expand before trimming to avoid a transient reversed interval during a large whole-layer move. */
        if (bounds.outPoint > layer.outPoint) layer.outPoint = bounds.outPoint;
        if (bounds.inPoint < layer.inPoint) layer.inPoint = bounds.inPoint;
        if (layer.inPoint !== bounds.inPoint) layer.inPoint = bounds.inPoint;
        if (layer.outPoint !== bounds.outPoint) layer.outPoint = bounds.outPoint;
    }
    function restoreChangeExpressions(change, comp) {
        var j, entry;
        if (change.kind === "property") restoreExpressionState(target(change,comp),change.snapshot);
        else for (j = 0; j < change.properties.length; j++) {
            entry = change.properties[j]; restoreExpressionState(resolve(change.layer,entry.path),entry.snapshot);
        }
    }
    function verifyChange(change, comp, after, tolerance) {
        if (change.kind !== "property") { checkLayer(change,after,tolerance); verifyLayerProperties(change,after,tolerance); }
        else verifyProperty(target(change,comp),change.snapshot,after ? change.times : originalTimes(change.snapshot),tolerance);
    }
    function diagnosticRead(fn) {
        try { var value = fn(); return typeof value === "undefined" ? "unknown" : value; }
        catch (unreadableDiagnostic) { return "unavailable"; }
    }
    function diagnosticBounds(layer) {
        return {start:diagnosticRead(function () { return layer.startTime; }),
            inPoint:diagnosticRead(function () { return layer.inPoint; }),
            outPoint:diagnosticRead(function () { return layer.outPoint; })};
    }
    function diagnosticSource(layer) {
        var source = null, result = {}, markers, i, protectedCount = 0;
        result.stretch = diagnosticRead(function () { return layer.stretch; });
        result.timeRemapEnabled = diagnosticRead(function () { return layer.timeRemapEnabled; });
        result.hasTrackMatte = diagnosticRead(function () { return layer.hasTrackMatte; });
        result.isTrackMatte = diagnosticRead(function () { return layer.isTrackMatte; });
        result.parented = diagnosticRead(function () { return layer.parent ? true : false; });
        try { source = layer.source; } catch (missingSource) { }
        if (!source) { result.kind = "none or unavailable"; return result; }
        result.kind = source instanceof CompItem ? "CompItem" : "FootageItem";
        result.duration = diagnosticRead(function () { return source.duration; });
        result.frameDuration = diagnosticRead(function () { return source.frameDuration; });
        result.isStill = diagnosticRead(function () { return source.mainSource ? source.mainSource.isStill : "not footage"; });
        result.protectedRegions = diagnosticRead(function () {
            markers = source.markerProperty;
            if (!markers) return 0;
            for (i = 1; i <= markers.numKeys && i <= 1000; i++) if (markers.keyValue(i).protectedRegion) protectedCount++;
            return markers.numKeys > 1000 ? "at least "+protectedCount+" (scan limited)" : protectedCount;
        });
        return result;
    }
    function captureFailure(change, phase) {
        var failure = {phase:phase};
        if (!change) return failure;
        failure.kind = change.kind; failure.target = change.label;
        if (change.layer) {
            failure.layerIndex = diagnosticRead(function () { return change.layer.index; });
            failure.layerId = diagnosticRead(function () { return change.layer.id; });
            if (change.before) {
                failure.before = {start:change.before.start,inPoint:change.before.inPoint,outPoint:change.before.outPoint};
                var expected = phase === "preflight" ? change.before : change.after;
                failure.expected = {start:expected.start,inPoint:expected.inPoint,outPoint:expected.outPoint};
            }
            failure.actual = diagnosticBounds(change.layer); failure.source = diagnosticSource(change.layer);
        }
        return failure;
    }
    function reportFailure(failure, frameDuration) {
        var lines = [], names = ["start","inPoint","outPoint"], labels = ["Start","In","Out"], i, delta, source;
        lines.push("Сбой: phase="+failure.phase+"; target="+(failure.target || "до выбора цели")+"; kind="+(failure.kind || "unknown"));
        function bounds(label,b) { return label+" (s): Start="+b.start+"; In="+b.inPoint+"; Out="+b.outPoint; }
        if (failure.actual && failure.expected) {
            lines.push(bounds("До операции",failure.before),bounds("Ожидалось",failure.expected),bounds("Фактически в момент сбоя, ДО отката",failure.actual));
            for (i = 0; i < names.length; i++) if (typeof failure.actual[names[i]] === "number") {
                delta = failure.actual[names[i]]-failure.expected[names[i]];
                lines.push("Отклонение "+labels[i]+": "+delta+" s / "+(delta/frameDuration)+" fr");
            }
        }
        source = failure.source;
        if (source) {
            lines.push("Layer: stretch="+source.stretch+"; timeRemap="+source.timeRemapEnabled+"; parented="+source.parented+"; hasTrackMatte="+source.hasTrackMatte+"; isTrackMatte="+source.isTrackMatte);
            lines.push("Source duration="+source.duration+" s; type="+source.kind+"; frameDuration="+source.frameDuration+"; isStill="+source.isStill+"; protectedRegions="+source.protectedRegions);
        }
        return lines;
    }
    function captureLayerSelection(comp) {
        var state = [], i, layer;
        for (i = 1; i <= comp.numLayers; i++) {
            layer = comp.layer(i); state.push({layer:layer,selected:layer.selected === true});
        }
        return state;
    }
    function restoreLayerSelection(comp, state) {
        var pass, i, entry, failures = [];
        /* Key setters may activate their owner. Restore deselected layers first,
           then the user's selected set; never unlock or blanket-deselect the scene. */
        for (pass = 0; pass < 2; pass++) for (i = 0; i < state.length; i++) {
            entry = state[i]; if (entry.selected !== (pass === 1)) continue;
            try {
                if (comp.layer(entry.layer.index) !== entry.layer) throw new Error("Состав слоёв изменился");
                if (entry.layer.selected !== entry.selected) entry.layer.selected = entry.selected;
            } catch (selectionWriteError) { failures.push("Layer #"+entry.layer.index+": "+errorInfo(selectionWriteError).message); }
        }
        for (i = 0; i < state.length; i++) {
            try { if (state[i].layer.selected !== state[i].selected) throw new Error("Выделение слоя не совпало с исходным"); }
            catch (selectionReadError) { failures.push("Layer #"+state[i].layer.index+": "+errorInfo(selectionReadError).message); }
        }
        if (failures.length) throw new Error(failures.join("\n"));
    }
    function applyPlan(plan) {
        var result = {ok:false,partial:false,selectionRestored:null,changed:0,changedLayers:0,movedKeys:0,attempted:0,restored:false,recoveryErrors:[],skipped:plan.skips.length,mediaSkipped:plan.mediaLimits ? plan.mediaLimits.length : 0};
        var phase = "preflight", currentChange = null, layerSelection = null, recovering = false;
        var opened = false, touched = [], tolerance = plan.context.frameDuration * 0.000001, i, j, c, p, entry;
        try {
            if (plan.errors.length) throw new Error(plan.errors.join("\n"));
            if (app.project.activeItem !== plan.comp) throw new Error("Активная композиция изменилась; повторите действие");
            if (plan.request.operation === "closeGap") validateGapPlan(plan);
            if (plan.intervalState) validateIntervalPlan(plan);
            if (plan.arrangeState) validateArrangePlan(plan);
            if (!plan.changes.length) { result.ok = true; return result; }
            phase = "captureSelection"; layerSelection = captureLayerSelection(plan.comp); phase = "preflight";
            for (i = 0; i < plan.changes.length; i++) {
                c = plan.changes[i]; currentChange = c;
                if (c.layer && (c.layer.locked || plan.comp.layer(c.layer.index) !== c.layer)) throw new Error("Слой недоступен или заблокирован");
                if (c.kind !== "property") { checkLayer(c,false,tolerance); verifyLayerProperties(c,false,tolerance); }
                else verifyProperty(target(c,plan.comp),c.snapshot,originalTimes(c.snapshot),tolerance);
            }
            app.beginUndoGroup(plan.arrangement ? "FrameFlow AE 2.4.0 — "+plan.arrangement.action : plan.request.operation === "closeGap" ? "FrameFlow AE 2.4.0 — Убрать паузу" : "FrameFlow AE 2.4.0 — Time Offset"); opened = true;
            for (i = 0; i < plan.changes.length; i++) {
                phase = "apply"; c = plan.changes[i]; currentChange = c; touched.push(c); result.attempted++;
                if (c.kind === "layer") {
                    setBounds(c.layer,c.after,true);
                } else if (c.kind === "edge") {
                    for (j = 0; j < c.properties.length; j++) {
                        entry = c.properties[j]; if (entry.moved) restoreProperty(resolve(c.layer,entry.path),entry.snapshot,entry.times);
                    }
                    setBounds(c.layer,c.after,false);
                } else {
                    p = target(c,plan.comp); restoreProperty(p,c.snapshot,c.times);
                    verifyProperty(target(c,plan.comp),c.snapshot,c.times,tolerance);
                }
                if (c.kind !== "property") { checkLayer(c,true,tolerance); verifyLayerProperties(c,true,tolerance); result.changedLayers++; }
                result.movedKeys += c.moved; result.changed++;
            }
            /* A later layer may have expressions that reference an earlier one: validate the stable final scene. */
            for (i = 0; i < touched.length; i++) { phase = "restoreExpressions"; currentChange = touched[i]; restoreChangeExpressions(touched[i],plan.comp); }
            phase = "restoreSelection"; currentChange = null; restoreLayerSelection(plan.comp,layerSelection); result.selectionRestored = true;
            for (i = 0; i < touched.length; i++) { phase = "finalVerify"; currentChange = touched[i]; verifyChange(touched[i],plan.comp,true,tolerance); }
            result.partial = result.changed > 0 && result.skipped > 0;
            result.ok = true;
        } catch (e) {
            recovering = true; result.error = errorInfo(e);
            try { result.failure = captureFailure(currentChange,phase); } catch (diagnosticFailure) { /* Preserve the original failure. */ }
            for (i = touched.length-1; i >= 0; i--) {
                c = touched[i];
                if (c.kind !== "property") {
                    try { setBounds(c.layer,c.before,c.kind === "layer"); checkLayer(c,false,tolerance); }
                    catch (boundaryRecoveryError) { result.recoveryErrors.push(c.label+": "+errorInfo(boundaryRecoveryError).message); }
                    /* One failed boundary/property recovery must not prevent the remaining recoveries. */
                    for (j = 0; j < c.properties.length; j++) {
                        entry = c.properties[j];
                        try {
                            try { verifyEntry(c.layer,entry,originalTimes(entry.snapshot),tolerance); }
                            catch (needsRepair) {
                                if (entry.snapshot.nativeOnly) throw needsRepair;
                                restoreProperty(resolve(c.layer,entry.path),entry.snapshot,originalTimes(entry.snapshot));
                            }
                            verifyEntry(c.layer,entry,originalTimes(entry.snapshot),tolerance);
                        } catch (propertyRecoveryError) { result.recoveryErrors.push(labelFor(c.layer,entry.path)+": "+errorInfo(propertyRecoveryError).message); }
                    }
                } else {
                    try {
                        restoreProperty(target(c,plan.comp),c.snapshot,originalTimes(c.snapshot));
                        verifyProperty(target(c,plan.comp),c.snapshot,originalTimes(c.snapshot),tolerance);
                    } catch (recoverError) { result.recoveryErrors.push(c.label+": "+errorInfo(recoverError).message); }
                }
            }
            for (i = 0; i < touched.length; i++) {
                try { restoreChangeExpressions(touched[i],plan.comp); }
                catch (expressionRecoveryError) { result.recoveryErrors.push(touched[i].label+": "+errorInfo(expressionRecoveryError).message); }
            }
        } finally {
            if (opened && layerSelection && !result.ok) {
                try { restoreLayerSelection(plan.comp,layerSelection); result.selectionRestored = true; }
                catch (selectionCleanupError) { result.selectionRestored = false; result.selectionError = errorInfo(selectionCleanupError); result.ok = false; }
            }
            if (recovering) {
                for (i = 0; i < touched.length; i++) {
                    try { verifyChange(touched[i],plan.comp,false,tolerance); }
                    catch (finalRecoveryError) { result.recoveryErrors.push(touched[i].label+": "+errorInfo(finalRecoveryError).message); }
                }
                if (touched.length && !result.recoveryErrors.length) { result.restored = true; result.changed = 0; result.changedLayers = 0; result.movedKeys = 0; }
            }
            if (opened) try { app.endUndoGroup(); } catch (cleanup) { result.cleanupError = errorInfo(cleanup); result.ok = false; }
        }
        return result;
    }
    function environment() {
        var lines = ["FrameFlow AE 2.4.0", "Дата: " + new Date().toString()];
        function read(label,fn) { try { lines.push(label+": "+fn()); } catch (ignored) { lines.push(label+": неизвестно"); } }
        read("AE",function(){return app.version;}); read("Build",function(){return app.buildNumber;});
        read("OS",function(){return $.os;}); read("ExtendScript",function(){return $.version;});
        return lines;
    }
    function report(plan, result, heading) {
        var lines = environment(), i, r = plan.request, c = plan.context;
        lines.push(heading, "Scope="+r.scope+"; Region="+r.region,
            "Mode="+(r.mode || "offset")+"; Strict="+(r.strict === true)+"; MediaPolicy="+(r.mediaPolicy || "stop"),
            plan.arrangement ? "Arrange="+plan.arrangement.action+"; Order="+plan.arrangement.order+"; Anchor="+plan.arrangement.anchor+"; Frames="+plan.arrangement.frames : "Frames="+(r.operation === "closeGap" ? r.gap.frames : r.frames)+"; Direction="+r.direction+"; Delta="+FFCore.offsetSeconds(c,r)+" s",
            "Comp id="+plan.comp.id+"; FPS="+(1/c.frameDuration)+"; CTI="+c.cti+" s; Duration="+c.duration+" s",
            "К изменению: "+plan.changes.length+"; Пропуски: "+plan.skips.length+"; Блокировки: "+plan.errors.length);
        if (plan.mediaLimits && plan.mediaLimits.length) lines.push("Без запаса исходника: "+plan.mediaLimits.length+". "+(r.mediaPolicy === "skip" ? "Эти слои и все их ключи оставлены без изменений; остальные цели проходят строгую проверку." : "Вся операция отменяется до записи."));
        if (r.operation === "closeGap") lines.push("Удаление паузы ["+r.gap.start+", "+r.gap.end+") s; курсор до операции="+r.originalCTI+" s");
        if (r.interval) lines.push("Interval ["+r.interval.start+", "+r.interval.end+") s; operation="+r.operation+"; crossing="+r.interval.crossing+"; kept="+plan.keptCrossing.length+"; originalCTI="+r.originalCTI+" s");
        if (r.region === "range") lines.push("Диапазон ["+r.from+", "+r.to+") s; кадры от внутреннего начала композиции");
        if (!result) {
            var plannedLayers = 0, plannedKeys = 0;
            for (i = 0; i < plan.changes.length; i++) {
                if (plan.changes[i].kind !== "property") plannedLayers++;
                plannedKeys += plan.changes[i].moved;
            }
            lines.push("План сдвига — Слоёв: "+plannedLayers+"; ключей: "+plannedKeys+"; слоёв в области: "+plan.layerCount);
            lines.push("Сцена не изменена. Действие в панели заново проверит текущую сцену перед записью.");
        }
        if (result) {
            lines.push("ok="+result.ok+"; changed="+result.changed+"; movedKeys="+result.movedKeys+"; attempted="+result.attempted+"; skipped="+result.skipped+"; partial="+result.partial);
            if (result.error) lines.push("Ошибка: "+result.error.message, "Line: "+(result.error.line || "неизвестно"), "File: "+(result.error.file || "неизвестно"));
            if (result.error && result.error.stack) lines.push("Stack: "+result.error.stack);
            if (result.failure) lines = lines.concat(reportFailure(result.failure,c.frameDuration));
            if (result.restored) lines.push("Восстановление исходных данных прошло readback-проверку.");
            if (result.selectionRestored === true) lines.push("Выделение слоёв сохранено.");
            if (result.selectionError) lines.push("ВЫДЕЛЕНИЕ НЕ ВОССТАНОВЛЕНО: "+result.selectionError.message);
            if (result.cleanupError) lines.push("Ошибка закрытия Undo Group: "+result.cleanupError.message);
            for (i = 0; i < result.recoveryErrors.length; i++) lines.push("ВОССТАНОВЛЕНИЕ НЕ ПОДТВЕРЖДЕНО: "+result.recoveryErrors[i]);
        }
        for (i = 0; i < plan.changes.length && lines.length < LIMITS.reportLines; i++) {
            lines.push("Цель: "+plan.changes[i].label+(plan.changes[i].kind !== "property" ? "; kind="+plan.changes[i].kind+"; Delta="+plan.changes[i].delta+" s; Start/In/Out "+plan.changes[i].after.start+" / "+plan.changes[i].after.inPoint+" / "+plan.changes[i].after.outPoint : "; ключей "+plan.changes[i].moved));
        }
        for (i = 0; i < plan.errors.length && lines.length < LIMITS.reportLines; i++) lines.push("БЛОК: "+plan.errors[i]);
        for (i = 0; i < plan.skips.length && lines.length < LIMITS.reportLines; i++) lines.push("ПРОПУСК: "+plan.skips[i]);
        if (lines.length >= LIMITS.reportLines) lines.push("Подробности ограничены 300 строками; сузьте область для полного списка.");
        if (plan.notes.length) lines.push(plan.notes[0]);
        lines.push("Readback проверяет доступные данные; визуальный результат, недоступные атрибуты и внешние Expressions требуют отдельного теста в AE.");
        return lines.join("\n");
    }
    return {readContext:readContext,inspectGap:inspectGap,prepareGap:prepareGap,prepareInterval:prepareInterval,prepareArrange:prepareArrange, prepare:prepare, applyPlan:applyPlan, report:report, environment:environment,
        snapshotProperty:snapshotProperty, restoreProperty:restoreProperty, verifyProperty:verifyProperty,
        scanLayer:scanLayer, pathOf:pathOf, errorInfo:errorInfo, originalTimes:originalTimes};
}());



/* FrameFlow CEP host. Data-only RPC; no eval, command IDs, network or file writes. */
var FFCEP = (function () {
    var VERSION = "2.4.0", serial = 0, session = String(new Date().getTime()) + "-" + String(Math.random());
    var saved = null, recent = [], busy = false, prepared = null, planSerial = 0;
    function fail(message) { throw new Error(message); }
    function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
    function quote(s) {
        return '"' + String(s).replace(/["\\\x00-\x1f\u2028\u2029]/g, function (c) {
            var h = c.charCodeAt(0).toString(16);
            return c === '"' ? '\\"' : c === "\\" ? "\\\\" : "\\u" + ("0000" + h).slice(-4);
        }) + '"';
    }
    function stringify(v, depth) {
        var a = [], i, k, t = typeof v;
        depth = depth || 0; if (depth > 32) fail("RPC nesting limit");
        if (v === null || t === "undefined") return "null";
        if (t === "string") return quote(v);
        if (t === "boolean") return v ? "true" : "false";
        if (t === "number") { if (!isFinite(v)) fail("Non-finite RPC number"); return String(v); }
        if (v instanceof Array) { for (i = 0; i < v.length; i++) a.push(stringify(v[i], depth + 1)); return "[" + a.join(",") + "]"; }
        if (t !== "object") fail("Unsupported RPC value");
        for (k in v) if (own(v, k)) a.push(quote(k) + ":" + stringify(v[k], depth + 1));
        return "{" + a.join(",") + "}";
    }
    /* Strict bounded JSON parser: never uses eval or assumes native JSON exists. */
    function parse(s) {
        var at = 0, nodes = 0;
        if (typeof s !== "string" || s.length > 65536) fail("RPC size limit");
        function ws() { while (at < s.length && /[\x20\t\r\n]/.test(s.charAt(at))) at++; }
        function str() {
            var out = "", c, h;
            if (s.charAt(at++) !== '"') fail("JSON string expected");
            while (at < s.length) {
                c = s.charAt(at++);
                if (c === '"') return out;
                if (c === "\\") {
                    c = s.charAt(at++);
                    if (c === "u") { h = s.substr(at, 4); if (!/^[0-9a-fA-F]{4}$/.test(h)) fail("Invalid JSON escape"); out += String.fromCharCode(parseInt(h, 16)); at += 4; }
                    else if (c === '"' || c === "\\" || c === "/") out += c;
                    else if (c === "b") out += "\b";
                    else if (c === "f") out += "\f";
                    else if (c === "n") out += "\n";
                    else if (c === "r") out += "\r";
                    else if (c === "t") out += "\t";
                    else fail("Invalid JSON escape");
                } else { if (c.charCodeAt(0) < 32) fail("Invalid JSON control"); out += c; }
            }
            fail("Unclosed JSON string");
        }
        function value(depth) {
            var c, out, key, match;
            if (++nodes > 10000 || depth > 12) fail("RPC complexity limit");
            ws(); c = s.charAt(at);
            if (c === '"') return str();
            if (c === "{" || c === "[") {
                at++; out = c === "{" ? {} : []; ws();
                if (s.charAt(at) === (c === "{" ? "}" : "]")) { at++; return out; }
                for (;;) {
                    ws();
                    if (c === "{") {
                        key = str();
                        if (key === "__proto__" || key === "constructor" || key === "prototype" || own(out, key)) fail("Invalid JSON key");
                        ws(); if (s.charAt(at++) !== ":") fail("JSON colon expected"); out[key] = value(depth + 1);
                    } else out.push(value(depth + 1));
                    ws(); key = s.charAt(at++);
                    if (key === (c === "{" ? "}" : "]")) return out;
                    if (key !== ",") fail("JSON separator expected");
                }
            }
            match = s.slice(at).match(/^(true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/);
            if (!match) fail("Invalid JSON value"); at += match[0].length;
            if (match[0] === "true") return true;
            if (match[0] === "false") return false;
            if (match[0] === "null") return null;
            out = Number(match[0]); if (!isFinite(out)) fail("Invalid JSON number"); return out;
        }
        var result = value(0); ws(); if (at !== s.length) fail("Trailing JSON data"); return result;
    }
    function number(v, min, max, integer) {
        if (typeof v !== "number" || !isFinite(v) || v < min || v > max || (integer && Math.floor(v) !== v)) fail("Некорректное числовое значение.");
        return v;
    }
    function schema(o, fields) {
        var k; if (!o || typeof o !== "object" || o instanceof Array) fail("RPC object expected");
        for (k in o) if (own(o, k) && fields.indexOf("|" + k + "|") < 0) fail("Unknown RPC field: " + k);
    }
    function bool(v) { if (typeof v !== "boolean") fail("Boolean expected"); return v; }
    function ids(v) {
        var seen = {}, i; if (!(v instanceof Array) || v.length > 2000) fail("Некорректный список слоёв.");
        for (i = 0; i < v.length; i++) { number(v[i], 1, 2147483647, true); if (seen["k" + v[i]]) fail("Повтор цели."); seen["k" + v[i]] = true; }
        return v;
    }
    function getComp() {
        var c = app.project ? app.project.activeItem : null;
        if (!(c instanceof CompItem)) fail("Откройте композицию в After Effects.");
        if (c.numLayers > 2000) fail("Более 2000 слоёв: откройте меньшую композицию.");
        return c;
    }
    function typeOfLayer(l) {
        if (l.nullLayer) return "null";
        if (l.matchName === "ADBE Text Layer") return "text";
        if (l.matchName === "ADBE Vector Layer") return "shape";
        if (l.matchName === "ADBE Camera Layer") return "camera";
        if (l.matchName === "ADBE Light Layer") return "light";
        if (l.source instanceof CompItem) return "comp";
        if (l.hasAudio && !l.hasVideo) return "audio";
        return "media";
    }
    function model(c) {
        var layers = [], i, l, source, m;
        for (i = 1; i <= c.numLayers; i++) {
            l = c.layer(i); source = l.source || null;
            m = {id:l.id, index:i, name:l.name, kind:typeOfLayer(l), start:l.startTime, inPoint:l.inPoint, outPoint:l.outPoint,
                stretch:l.stretch, locked:l.locked, selected:l.selected, enabled:l.enabled, label:l.label,
                parentId:l.parent ? l.parent.id : null, remap:l.timeRemapEnabled === true,
                matte:l.hasTrackMatte === true || l.isTrackMatte === true, audio:l.hasAudio === true,
                sourceId:source ? source.id : null, sourceDuration:source ? source.duration : null,
                still:source && source.mainSource ? source.mainSource.isStill === true : false};
            layers.push(m);
        }
        return {compId:c.id, name:c.name, duration:c.duration, frameDuration:c.frameDuration, displayStart:c.displayStartTime,
            time:c.time, workStart:c.workAreaStart, workDuration:c.workAreaDuration, layers:layers};
    }
    function snapshot() {
        var c = getComp(), state = model(c), signature = stringify(state);
        if (!saved || saved.project !== app.project || saved.comp !== c || saved.signature !== signature) {
            saved = {project:app.project, comp:c, signature:signature, token:session + ":" + (++serial)};
            prepared = null;
        }
        state.token = saved.token; state.version = VERSION;
        state.environment = {ae:String(app.version), build:String(app.buildNumber), os:String($.os)};
        return state;
    }
    function current(token) {
        var s = snapshot(); if (typeof token !== "string" || token !== s.token) fail("Композиция изменилась. Обновите панель и повторите действие."); return saved.comp;
    }
    function targets(c, list, allowEmpty) {
        var result = [], i, j; ids(list);
        if (!list.length && !allowEmpty) fail("Выделите хотя бы один слой.");
        for (i = 0; i < list.length; i++) {
            for (j = 1; j <= c.numLayers; j++) if (c.layer(j).id === list[i]) { result.push(c.layer(j)); break; }
            if (j > c.numLayers) fail("Целевой слой больше не существует.");
        }
        return result;
    }
    function unlocked(layers) { var i; for (i = 0; i < layers.length; i++) if (layers[i].locked) fail("Заблокированный слой: #" + layers[i].index + ". Снимите блокировку в AE."); }
    function selection(c) { var a = [], i; for (i = 1; i <= c.numLayers; i++) a.push({layer:c.layer(i), value:c.layer(i).selected}); return a; }
    function restoreSelection(a) { var i; for (i = 0; i < a.length; i++) if (a[i].layer.selected !== a[i].value) a[i].layer.selected = a[i].value; }
    function verifyNear(a, b, eps) { if (Math.abs(a - b) > eps) fail("Проверка записи не совпала с расчётом."); }
    function capture(l, budget) {
        var props = FFHost.scanLayer(l), a = [], i, count = 0;
        budget = budget || {keys:0, properties:0}; budget.properties += props.length;
        if (budget.properties > 20000) fail("Более 20000 свойств: сузьте область.");
        for (i = 0; i < props.length; i++) if (props[i].numKeys) {
            count += props[i].numKeys; budget.keys += props[i].numKeys; if (count > 50000 || budget.keys > 50000) fail("Более 50000 ключей: сузьте область.");
            a.push({p:props[i], s:FFHost.snapshotProperty(props[i])});
        }
        return a;
    }
    function verifyKeys(a, eps) { var i; for (i = 0; i < a.length; i++) FFHost.verifyProperty(a[i].p, a[i].s, FFHost.originalTimes(a[i].s), eps); }
    function trimPlan(c, layers, r, budget) {
        var out = [], i, l, t = number(r.time, -10800, 10800, false), eps = c.frameDuration * 0.000001, edge = r.edge, limit;
        if (edge !== "in" && edge !== "out") fail("Укажите In или Out."); unlocked(layers);
        for (i = 0; i < layers.length; i++) {
            l = layers[i];
            if (l.inPoint >= l.outPoint) fail("Обратные границы слоя пока не поддержаны.");
            if (edge === "in" && t > l.outPoint - c.frameDuration + eps || edge === "out" && t < l.inPoint + c.frameDuration - eps) fail("Оставьте не менее одного кадра слоя.");
            if ((edge === "in" && t < l.inPoint - eps) || (edge === "out" && t > l.outPoint + eps)) {
                if (l.timeRemapEnabled === true || l.stretch <= 0) fail("Для Time Remap и обратного Stretch доступно только укорачивание.");
                if (l.source && !(l.source.mainSource && l.source.mainSource.isStill)) {
                    limit = edge === "in" ? l.startTime : l.startTime + l.source.duration * l.stretch / 100;
                    if (edge === "in" && t < limit - eps || edge === "out" && t > limit + eps) fail("Край выходит за доступное исходное медиа.");
                }
            }
            if (Math.abs(t - (edge === "in" ? l.inPoint : l.outPoint)) > eps) out.push({layer:l, before:{start:l.startTime, inPoint:l.inPoint, outPoint:l.outPoint}, time:t, keys:capture(l, budget)});
        }
        return out;
    }
    function bounds(l, s) { l.outPoint = Math.max(l.outPoint, s.outPoint); l.inPoint = s.inPoint; l.outPoint = s.outPoint; }
    function directEdit(c, layers, r) {
        var plans = [], touched = [], made = [], originalSelection = selection(c), opened = false, i, l, p, d;
        var budget = {keys:0, properties:0};
        var result = {ok:false, changed:0, recoveryErrors:[]}, eps = c.frameDuration * 0.000001;
        unlocked(layers);
        if (r.op === "trim") plans = trimPlan(c, layers, r, budget);
        else {
            number(r.time, 0, c.duration, false);
            for (i = 0; i < layers.length; i++) {
                l = layers[i];
                if (r.time < l.inPoint + c.frameDuration - eps || r.time > l.outPoint - c.frameDuration + eps) fail("Split: курсор должен оставлять хотя бы кадр с обеих сторон каждого выбранного слоя.");
                if (l.hasTrackMatte === true || l.isTrackMatte === true || l.parent !== null) fail("Split: связи Parent и Track Matte требуют ручного разделения в AE.");
                for (var j = 1; j <= c.numLayers; j++) if (c.layer(j).parent === l) fail("Split: у выбранного слоя есть дочерние слои.");
                plans.push({layer:l, before:{start:l.startTime, inPoint:l.inPoint, outPoint:l.outPoint}, keys:capture(l, budget)});
            }
        }
        if (!plans.length) { result.ok = true; return result; }
        try {
            app.beginUndoGroup("FrameFlow 2.0 — " + (r.op === "split" ? "Split" : "Trim " + r.edge)); opened = true;
            for (i = 0; i < plans.length; i++) {
                p = plans[i]; l = p.layer; touched.push(p);
                if (r.op === "split") {
                    d = l.duplicate(); made.push(d); d.selected = false; d.inPoint = r.time; l.outPoint = r.time;
                    verifyNear(d.inPoint, r.time, eps); verifyNear(d.outPoint, p.before.outPoint, eps); verifyNear(d.startTime, p.before.start, eps);
                    verifyNear(l.outPoint, r.time, eps);
                    /* Native duplicate carries values; compare the duplicate's captured property paths. */
                    for (var q = 0; q < p.keys.length; q++) {
                        var path = FFHost.pathOf(p.keys[q].p, l), prop = d;
                        for (var z = 0; z < path.length; z++) prop = prop.property(path[z].index);
                        FFHost.verifyProperty(prop, p.keys[q].s, FFHost.originalTimes(p.keys[q].s), eps);
                    }
                } else {
                    if (r.edge === "in") l.inPoint = r.time; else l.outPoint = r.time;
                    verifyNear(r.edge === "in" ? l.inPoint : l.outPoint, r.time, eps);
                    verifyNear(r.edge === "in" ? l.outPoint : l.inPoint, r.edge === "in" ? p.before.outPoint : p.before.inPoint, eps);
                }
                verifyNear(l.startTime, p.before.start, eps); verifyKeys(p.keys, eps); result.changed++;
            }
            restoreSelection(originalSelection); result.ok = true;
        } catch (e) {
            result.error = FFHost.errorInfo(e);
            for (i = made.length - 1; i >= 0; i--) try { made[i].remove(); } catch (removeError) { result.recoveryErrors.push(FFHost.errorInfo(removeError).message); }
            for (i = touched.length - 1; i >= 0; i--) try {
                p = touched[i]; bounds(p.layer, p.before); verifyNear(p.layer.inPoint, p.before.inPoint, eps); verifyNear(p.layer.outPoint, p.before.outPoint, eps); verifyKeys(p.keys, eps);
            } catch (recoverError) { result.recoveryErrors.push(FFHost.errorInfo(recoverError).message); }
            try { restoreSelection(originalSelection); } catch (selectError) { result.recoveryErrors.push(FFHost.errorInfo(selectError).message); }
            result.restored = result.recoveryErrors.length === 0;
            if (result.restored) result.changed = 0;
        } finally {
            if (opened) try { app.endUndoGroup(); } catch (closeError) { result.ok = false; result.cleanupError = FFHost.errorInfo(closeError); }
        }
        return result;
    }
    function corePlan(c, r) {
        var request, plan;
        if (r.op === "arrange") {
            schema(r,"|op||token||action||scope||order||anchor||frames||preview|");
            if (r.preview !== true) fail("Arrange requires a preview before applying.");
            return FFHost.prepareArrange(r);
        }
        if (r.op === "interval") {
            schema(r,"|op||token||action||frames||scope||crossing||compMarkers||preview|");
            if (r.preview !== true) fail("Interval operations require a preview before applying.");
            if (r.scope !== "auto" && r.scope !== "all" && r.scope !== "selected") fail("Choose Auto, Selected or All layers.");
            bool(r.compMarkers); return FFHost.prepareInterval(r);
        }
        if (r.op === "gap") { schema(r, "|op||token||scope||compMarkers||preview|"); if (r.scope !== "auto" && r.scope !== "all" && r.scope !== "selected") fail("Область не распознана."); bool(r.compMarkers); return FFHost.prepareGap(r); }
        schema(r, "|op||token||ids||scope||deltaFrames||mode||frames||region||direction||compMarkers||mediaPolicy||preview|");
        if (r.op === "move") {
            targets(c, r.ids, false);
            number(r.deltaFrames, -1000000, 1000000, false); if (r.deltaFrames === 0) fail("Сдвиг равен нулю.");
            request = {mode:"layers", region:"all", scope:"selected", layerIds:r.ids, direction:r.deltaFrames > 0 ? 1 : -1, deltaSeconds:r.deltaFrames * c.frameDuration, frames:1, strict:true};
        } else {
            if (!FFCore.validMode(r.mode)) fail("Режим не распознан."); FFCore.parseFrames(String(r.frames));
            if (r.region !== "before" && r.region !== "after") fail("Сторона не распознана.");
            if (r.direction !== 1 && r.direction !== -1) fail("Направление не распознано."); bool(r.compMarkers);
            if (own(r, "ids")) { targets(c, r.ids, false); request = {scope:"selected",layerIds:r.ids}; }
            else {
                if (r.scope !== "auto" && r.scope !== "all" && r.scope !== "selected") fail("Выберите Авто, выделенные слои или всю композицию.");
                request = {scope:r.scope};
            }
            request.mode = r.mode; request.region = r.region; request.direction = r.direction;
            if (typeof r.mediaPolicy !== "undefined" && r.mediaPolicy !== "skip" && r.mediaPolicy !== "stop") fail("Неизвестное правило предела исходника.");
            request.mediaPolicy = r.mediaPolicy || "stop";
            request.frames = r.frames; request.strict = true; request.compMarkers = r.compMarkers;
        }
        plan = FFHost.prepare(request); return plan;
    }
    function planSummary(plan, id) {
        var r = plan.request, c = plan.context, targets = [], seen = {}, positions = {}, layers = 0, keys = 0, properties = 0, outside = 0, i, change, item;
        if (plan.arrangement) for (i = 0; i < plan.arrangement.slots.length; i++) positions["k"+plan.arrangement.slots[i].id] = i+1;
        for (i = 0; i < plan.changes.length; i++) {
            change = plan.changes[i]; keys += change.moved || 0;
            if (plan.arrangement && (change.after.inPoint < 0 || change.after.outPoint > c.duration)) outside++;
            if (change.kind === "property") properties++;
            if (change.layer && !seen["k"+change.layer.id]) { seen["k"+change.layer.id] = true; layers++; }
            if (targets.length >= 100) continue;
            item = {layerId:change.layer ? change.layer.id : null,index:change.layer ? change.layer.index : null,
                kind:change.kind,label:String(change.label).slice(0,500),keys:change.moved || 0,delta:typeof change.delta === "number" ? change.delta : FFCore.offsetSeconds(c,r)};
            if (change.kind !== "property") { item.before = change.before; item.after = change.after; }
            if (plan.arrangement) item.position = positions["k"+item.layerId];
            targets.push(item);
        }
        return {id:id,operation:plan.arrangement ? "arrange" : r.interval ? r.operation : r.operation === "closeGap" ? "gap" : "offset",scope:r.scope,mode:r.mode || "offset",arrangement:plan.arrangement ? {action:plan.arrangement.action,order:plan.arrangement.order,anchor:plan.arrangement.anchor,frames:plan.arrangement.frames,total:plan.arrangement.slots.length} : null,
            region:r.region,direction:r.direction,frames:plan.arrangement ? plan.arrangement.frames : Math.abs(FFCore.offsetSeconds(c,r)/c.frameDuration),
            delta:plan.arrangement ? 0 : FFCore.offsetSeconds(c,r),cti:r.operation === "closeGap" || r.interval ? r.originalCTI : c.cti,
            frameDuration:c.frameDuration,displayStart:plan.comp.displayStartTime,blocked:plan.errors.length > 0,
            counts:{layers:layers,keys:keys,properties:properties,changes:plan.changes.length,skipped:plan.skips.length,
                outsideComposition:outside,mediaSkipped:plan.mediaLimits ? plan.mediaLimits.length : 0,errors:plan.errors.length,keptCrossing:plan.keptCrossing ? plan.keptCrossing.length : 0},targets:targets,
            targetsOmitted:Math.max(0,plan.changes.length-targets.length),skips:plan.skips.slice(0,40),errors:plan.errors.slice(0,20),
            skipsOmitted:Math.max(0,plan.skips.length-40),gap:r.operation === "closeGap" ? {start:r.gap.start,end:r.gap.end} : null,
            interval:r.interval || null,keptTargets:plan.keptCrossing ? plan.keptCrossing.slice(0,100) : []};
    }
    function action(r) {
        var c, layers, i, on = {}, plan, result, report, state, id, pending;
        if (prepared && new Date().getTime()-prepared.created > 120000) prepared = null;
        if (r.op === "read") { schema(r, "|op|"); return {state:snapshot()}; }
        c = current(r.token);
        if (r.op !== "applyPreview") prepared = null;
        if (r.op === "select") {
            schema(r, "|op||token||ids|"); layers = targets(c, r.ids, true);
            for (i = 0; i < layers.length; i++) on["k" + layers[i].id] = true;
            var prior = selection(c);
            try { for (i = 1; i <= c.numLayers; i++) if (c.layer(i).selected !== (on["k" + c.layer(i).id] === true)) c.layer(i).selected = on["k" + c.layer(i).id] === true; }
            catch (selectionFailure) { try { restoreSelection(prior); } catch (ignored) { } throw selectionFailure; }
            return {state:snapshot(), message:"Выделение обновлено"};
        }
        if (r.op === "seek") {
            schema(r, "|op||token||time|"); c.time = number(r.time, 0, Math.max(0, c.duration - c.frameDuration), false); return {state:snapshot()};
        }
        if (r.op === "applyPreview") {
            schema(r, "|op||token||previewId|"); pending = prepared; prepared = null;
            if (!pending || typeof r.previewId !== "string" || pending.id !== r.previewId || pending.token !== r.token) fail("План устарел. Повторите проверку перед применением.");
            plan = pending.plan; result = FFHost.applyPlan(plan); report = FFHost.report(plan,result,"Применить проверенный план");
        } else if (r.op === "move" || r.op === "offset" || r.op === "gap" || r.op === "interval" || r.op === "arrange") {
            if (typeof r.preview !== "undefined") bool(r.preview);
            plan = corePlan(c, r); report = FFHost.report(plan, null, "ПРОВЕРКА");
            if (r.preview) {
                state = snapshot(); id = session + ":plan:" + (++planSerial);
                prepared = {id:id,token:state.token,created:new Date().getTime(),plan:plan};
                return {state:state,preview:planSummary(plan,id),report:report,blocked:plan.errors.length > 0,
                    message:"План: " + plan.changes.length + "; пропусков: " + plan.skips.length + (plan.mediaLimits && plan.mediaLimits.length ? " · без запаса: " + plan.mediaLimits.length : "")};
            }
            result = FFHost.applyPlan(plan); report = FFHost.report(plan, result, r.op);
        } else if (r.op === "trim" || r.op === "split") {
            schema(r, "|op||token||ids||time||edge|"); layers = targets(c, r.ids, false);
            if (typeof r.preview !== "undefined") bool(r.preview);
            result = directEdit(c, layers, r); report = stringify(result);
        } else fail("Неизвестная операция.");
        if (!result.ok) return {state:snapshot(), failure:result, report:report, message:(result.error ? result.error.message : plan && plan.errors.length ? plan.errors[0] : "Не удалось завершить проверку записи. Откройте отчёт.") + (plan && plan.errors.length && plan.skips.length ? " " + plan.skips[0] : "")};
        return {state:snapshot(), result:result, report:report, warning:result.mediaSkipped > 0, message:(result.changed ? "Готово · изменений: " + result.changed : "Сцена не изменена") + (result.mediaSkipped ? " · без запаса: " + result.mediaSkipped : result.changed ? "" : " · подходящих целей нет")};
    }
    // Localize diagnostics only. Artist-authored names and native values in state stay intact.
    function localized(output, language) {
        var data = output.data, i, p;
        function text(v) { return FFText.message(v,language); }
        function error(e) { if (e && typeof e.message === "string") e.message = text(e.message); }
        error(output.error);
        if (data) {
            if (typeof data.message === "string") data.message = text(data.message);
            if (typeof data.report === "string") data.report = text(data.report);
            p = data.preview;
            if (p) {
                for (i=0;i<p.errors.length;i++) p.errors[i]=text(p.errors[i]);
                for (i=0;i<p.skips.length;i++) p.skips[i]=text(p.skips[i]);
                for (i=0;i<p.targets.length;i++) p.targets[i].label=text(p.targets[i].label);
            }
        }
        return output;
    }
    function dispatch(encoded) {
        var request, output, raw, i;
        try {
            if (busy) fail("Host занят. Дождитесь завершения операции.");
            if (typeof encoded !== "string" || encoded.length > 262144) fail("RPC size limit");
            raw = decodeURIComponent(encoded); request = parse(raw); schema(request, "|id||version||data||language|");
            if (request.version !== VERSION || typeof request.id !== "string" || !/^[A-Za-z0-9:_-]{1,100}$/.test(request.id)) fail("Несовместимая версия запроса.");
            if (own(request,"language") && request.language !== "en" && request.language !== "ru") fail("Unknown interface language.");
            for (i = 0; i < recent.length; i++) if (recent[i].id === request.id) {
                if (recent[i].raw !== raw) fail("RPC id collision"); return recent[i].output;
            }
            busy = true;
            try { output = {id:request.id, ok:true, data:action(request.data)}; }
            catch (e) { output = {id:request.id, ok:false, error:FFHost.errorInfo(e)}; }
            finally { busy = false; }
            if (request.language) output = localized(output,request.language);
            output = stringify(output); recent.push({id:request.id, raw:raw, output:output}); if (recent.length > 16) recent.shift(); return output;
        } catch (outer) { return stringify(localized({id:request ? request.id : null, ok:false, error:FFHost.errorInfo(outer)},request && request.language === "en" ? "en" : "ru")); }
    }
    return {dispatch:dispatch, version:VERSION};
}());


return FFCEP;
}());
