/*
* @Author: Vitaly Batushev
* @Date: 2017-05-01 22:18:34
 * @Last Modified by: Vitaly Batushev
 * @Last Modified time: 2017-05-12 10:58:27
 */

/**
 *  Класс диалога
 *
 * @param {String} title    Заголовок диалога
 */
function dlgPreferences(title) {
    var res = "dialog { \
            properties: {resizeable: false, maximizeButton: false, bounds: [100,100,380,245] }, \
            dlg: Group { orientation: 'column', alignChildren: ['fill', 'fill'], spacing:10, \
                transform: Panel { orientation: 'row', alignChildren:['left', 'top'], text: 'Параметры обработки изображения', margins:[10, 20, 10, 20], \
                    left: Group { orientation: 'column', alignChildren:['left', 'top'], \
                        mode_label: StaticText { text: 'Режим преобразования' }, \
                        mode: DropDownList {bounds: [40, 15, 245, 40]}, \
                        profiles_label: StaticText { text: 'Профиль' }, \
                        profiles: DropDownList {bounds: [40, 15, 245, 40]}, \
                    } \
                    right: Group { orientation: 'column', alignChildren:['left', 'top'], \
                        noise_label: StaticText { text: 'Уровень удаления шума' }, \
                        noise: DropDownList {bounds: [40, 15, 180, 40]}, \
                        block_label: StaticText { text: 'Размер блока' }, \
                        block: DropDownList {bounds: [40, 15, 180, 40]}, \
                    } \
                }, \
            }, \
            btns: Group { orientation: 'row', alignChildren: ['fill', 'fill'], spacing:10, \
                ok: Button { name: 'ok', helpTip:'Запуск', text:'Запуск', alignment:'center', enabled:true }, \
                cancel: Button { text:'Отменить', name: 'cancel', alignment:'center' }, \
            }, \
            info: Group { orientation: 'row', alignChildren: ['center', 'fill'], spacing:10, \
                info: StaticText { text: 'Vitaly Batushev, 2017 | https://szam5.com' } \
            } \
        }";

    var win = new Window(res);
    win.text = title;
    win.defaultElement = win.btns.ok;

    win.info.info.text = _localize(Locale.batushev) + ", 2017 | https://szam5.com";

    win.dlg.transform.text = _localize(Locale.transform);

    win.dlg.transform.left.mode_label.text = _localize(Locale.mode);
    win.dlg.transform.left.mode.add("item", _localize(Locale.mode_auto));
    win.dlg.transform.left.mode.add("item", _localize(Locale.mode_noise_resize));
    win.dlg.transform.left.mode.add("item", _localize(Locale.mode_resize));
    win.dlg.transform.left.mode.add("item", _localize(Locale.mode_noise));
    switch (Config.mode) {
        case "noise_scale":
            win.dlg.transform.left.mode.selection = 1;
            break;
        case "scale":
            win.dlg.transform.left.mode.selection = 2;
            break;
        case "noise":
            win.dlg.transform.left.mode.selection = 3;
            break;
        default:
            win.dlg.transform.left.mode.selection = 0;
    }

    win.dlg.transform.left.profiles_label.text = _localize(Locale.profiles);
    win.dlg.transform.left.profiles.add("item", _localize(Locale.profiles_1));
    win.dlg.transform.left.profiles.add("item", _localize(Locale.profiles_2));
    win.dlg.transform.left.profiles.add("item", _localize(Locale.profiles_3));
    win.dlg.transform.left.profiles.add("item", _localize(Locale.profiles_4));
    win.dlg.transform.left.profiles.add("item", _localize(Locale.profiles_5));
    switch (Config.profiles) {
        case "upconv_7_photo":
            win.dlg.transform.left.profiles.selection = 1;
            break;
        case "anime_style_art_rgb":
            win.dlg.transform.left.profiles.selection = 2;
            break;
        case "photo":
            win.dlg.transform.left.profiles.selection = 3;
            break;
        case "anime_style_art":
            win.dlg.transform.left.profiles.selection = 4;
            break;
        case "upconv_7_anime_style_art_rgb":
        default:
            win.dlg.transform.left.profiles.selection = 0;
    }

    win.dlg.transform.right.noise_label.text = _localize(Locale.noise);
    win.dlg.transform.right.noise.add("item", 0);
    win.dlg.transform.right.noise.add("item", 1);
    win.dlg.transform.right.noise.add("item", 2);
    win.dlg.transform.right.noise.add("item", 3);
    win.dlg.transform.right.noise.selection = parseInt(Config.noise);

    win.dlg.transform.right.block_label.text = _localize(Locale.block);
    win.dlg.transform.right.block.add("item", 64);
    win.dlg.transform.right.block.add("item", 100);
    win.dlg.transform.right.block.add("item", 128);
    win.dlg.transform.right.block.add("item", 240);
    win.dlg.transform.right.block.add("item", 256);
    win.dlg.transform.right.block.add("item", 384);
    win.dlg.transform.right.block.add("item", 432);
    win.dlg.transform.right.block.add("item", 480);
    win.dlg.transform.right.block.add("item", 512);
    switch(parseInt(Config.block)) {
        case 100:
            win.dlg.transform.right.block.selection = 1;
            break;
        case 128:
            win.dlg.transform.right.block.selection = 2;
            break;
        case 240:
            win.dlg.transform.right.block.selection = 3;
            break;
        case 256:
            win.dlg.transform.right.block.selection = 4;
            break;
        case 384:
            win.dlg.transform.right.block.selection = 4;
            break;
        case 432:
            win.dlg.transform.right.block.selection = 5;
            break;
        case 480:
            win.dlg.transform.right.block.selection = 6;
            break;
        case 512:
            win.dlg.transform.right.block.selection = 7;
            break;
        default:
            win.dlg.transform.right.block.selection = 0;
    }

    win.btns.ok.text = _localize(Locale.ok);
    win.btns.cancel.text = _localize(Locale.cancel);

    win.btns.cancel.onClick = function () {
        win.close();
        exit();
    };

    win.center();
    var result = win.show();
    if (result !== 1) {
        exit();
    } else {
        switch (+win.dlg.transform.left.mode.selection.index) {
            case 1:
                Config.mode = "noise_scale";
                break;
            case 2:
                Config.mode = "scale";
                break;
            case 3:
                Config.mode = "noise";
                break;
            default:
                Config.mode = "auto_scale";
        }
        switch (+win.dlg.transform.left.profiles.selection.index) {
            case 0:
                // win.dlg.transform.profiles.add("item", "2D изображ. (Профиль UpRGB)");
                Config.profiles = "upconv_7_anime_style_art_rgb";
                break;
            case 1:
                // win.dlg.transform.profiles.add("item", "Фото (Профиль UpPhoto)");
                Config.profiles = "upconv_7_photo";
                break;
            case 2:
                // win.dlg.transform.profiles.add("item", "2D изображ. (Профиль RGB)");
                Config.profiles = "anime_style_art_rgb";
                break;
            case 3:
                // win.dlg.transform.profiles.add("item", "Фотография, Аниме");
                Config.profiles = "photo";
                break;
            default:
                // win.dlg.transform.profiles.add("item", "2D изображ. (Профиль Y)");
                Config.profiles = "anime_style_art";
        }
        Config.block = +win.dlg.transform.right.block.selection.text;
        Config.noise = +win.dlg.transform.right.noise.selection.index;
        ConfigClass.write();
    }
}
