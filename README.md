﻿# iWai

Скрипт для Adobe InDesign для обработки изображений с помощью [waifu2x-caffe](https://github.com/lltcggie/waifu2x-caffe/)

*Только для Windows*

Пример улучшения изображения с помощью waifu2x-caffe:

![Sample Image](/assets/image.png)


## Настройка скрипта

Настройки скрипта хранятся в файле config.json, лежащем в той же директории, что и скрипт.

Если файла настроек нет, он создается из значений по умолчанию, указанных в самом скрипте.

### Параметры файла config.json

1. waifu2x_path — путь к исполняемому файлу waifu2x-caffe-cui.exe. По умолчанию, считается, что файл лежит в папке \~/Documents/waifu2x-caffe (\~/Documents — это путь к папке Документы/Documents данного пользователя). Если Вы хотите указать собственный путь к файлу, необходимо указывать его а) в кавычках, б) либо в абсолютном формате (например, "/c/Work/waifu", либо предохраняя слэши, например, "C:\\\\Work\\\\waifu").
2. minppi — минимальное значение ppi. По умолчанию, 50.
3. maxppi — минимальное значение ppi. По умолчанию, 200.
4. mode — режим преобразования. Их четыре (в круглых скобках даны значения параметра): убрать шум и увеличить (noise_scale), только увеличить (scale), только убрать шум (noise), авто-убрать шум и увеличить (auto_scale). Параметр автоматически устанавливается согласно значению в диалоге после начала выполнения обработки изображений.
5. noise — удаление шума. Четыре уровня. Параметр автоматически устанавливается согласно значению в диалоге после начала выполнения обработки изображений.
6. profiles — профиль (модель) обработки. Значением профиля обработки является название папки, хранящей профиль. Предполагается, что папки с профилями находятся в папке models внутри папки с waifu2x-caffe. Параметр автоматически устанавливается согласно значению в диалоге после начала выполнения обработки изображений.
7. block — размер блока. Влияет на скорость обработки. Значения: 64, 100, 128, 240, 256, 384, 432, 480, 512. Параметр автоматически устанавливается согласно значению в диалоге после начала выполнения обработки изображений.
