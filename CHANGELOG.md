﻿### Версия 1.5 (2017.05.12)

* Изменены имена параметров minppi и maxppi на min_ppi и max_ppi соответственно.
* Добавлен параметр need_ppi (целое число).
* Кодировка для исполняемого файла CP866 назначается только, если операционной системой является Windows.
* Добавлен параметр language, принимающий два значения: ru (русский язык) и en (английский язык).
* Изменен принцип локализации.
* Добавлен диалог выбора файла waifu2x-caffe-cui.exe, если таковой не обнаружен по пути указанному в конфигурационном файле.
* Добавлена проверка параметров min_ppi, max_ppi, need_ppi, noise на то, являются ли они числом. Если проверка не прошла, параметр принимает значение по умолчанию.
* Добавлена проверка параметров processor, language на допустимость значений. Если проверка не прошла, параметр принимает значение по умолчанию.

### Версия 1.4 (2017.05.10)

* Если в названии файла присутствует суффикс ".wai.", при обработке всех изображений такие изображения игнорируются, при обработке выделенного изображения обрабатывается в том случае, если пользователь подтвердил свое желание обработать изображение заново
* В конфигурационный файл добавлен параметр processor с двумя возможными значениями: cpu (по умолчанию) и gpu
* Файл iwai.jsx оформлен как модуль. Для запуска обработки используются два скрипта: iWai_dlg.jsxbin и iWai_quiet.jsxbin.

### Версия 1.3 (2017.05.08)

* Добавлена локализация (русский и английский), включается в зависимости от языка интерфейса InDesign

### Версия 1.2 (2017.05.06)

* Добавлен конфигурационный файл
* Исправлен диалог
* Рефакторинг