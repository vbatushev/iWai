/*
 * @Author: Vitaly Batushev
 * @Date: 2017-03-23 22:48:53
 * @Last Modified by: Vitaly Batushev
 * @Last Modified time: 2017-04-25 22:38:37
 */
var scriptVersion = "1.0";

var iWai = (function(){
    var cuipath = File(Folder.myDocuments.absoluteURI+ "/waifu2x-caffe/waifu2x-caffe-cui.exe");

    var config = {
        regime: 0,
        noise: 0,
        profiles: 0,
        block: 0,
        resize: 0
    }

    var images = [], common_keys = "";

    var main = function() {
        if (!cuipath.exists) { exit(); }
        var dlg = new dlgPreferences("waifu2x-caffe для Adobe InDesign " + scriptVersion);
        common_keys = " -p cpu -m " + config.regime + " -n " + config.noise + " -q 100 --crop_size " + config.block;
        var model_dir = Folder(cuipath.parent.absoluteURI + "/models/" + config.profiles);
        if (model_dir.exists) {
            common_keys += " --model_dir " + "\"" + model_dir.fsName + "\"";
        }

        if (!app.activeDocument.selection.length || app.activeDocument.selection.length > 1) {
            find();
        } else {
            if (app.activeDocument.selection[0].images.length == 1) {
                imageProcess(app.activeDocument.selection[0].images[0]);
            } else {
                find();
            }
        }

    }

    function find() {
        for (var a = 0, l = app.activeDocument.allGraphics.length; a < l; a++) {
            var current = app.activeDocument.allGraphics[a];
            if (current instanceof Image) {
                if (parseFloat(current.effectivePpi) < 300 && current.itemLink.status == LinkStatus.NORMAL) {
                    images.push(current);
                }
            }
        }
        process();
    }

    function process(){
        for (var a = 0, l = images.length; a < l; a++) {
            imageProcess(images[a]);
        }
    }

    function imageProcess(image) {
        var scale = 300 / parseFloat(image.effectivePpi);
        var input_file = File(image.itemLink.filePath);
        var extension = getExtension(input_file.absoluteURI);
        var output_file = File(input_file.absoluteURI.replace(RegExp("\." + extension + "$"), ".wai." + extension));
        var lock = File(Folder.temp.absoluteURI + "/lock.wai");
        lock.open("w"); lock.write(""); lock.close();
        var keys = common_keys + " -s " + scale + " -i " + "\"" + input_file.fsName  + "\"" + " -o " + "\"" + output_file.fsName + "\"";
        var cmd_string = "\"" + cuipath.fsName + "\"" + keys + "\ndel " + "\"" + lock.fsName + "\"\n";
        var cmd_file = File(Folder.temp.fsName + "/wai.cmd");
        cmd_file.open("w"); cmd_file.write(cmd_string); cmd_file.close();
        cmd_file.execute();
        while (lock.exists) {
            $.sleep(100);
        }
        image.itemLink.relink(output_file);
    }

    function getExtension(str) {
        var array = str.split(".");
        return array.pop();
    }

    function dlgPreferences(title) {
        var res = "dialog { \
            properties: {resizeable: false, maximizeButton: false, bounds: [100,100,380,245] }, \
            dlg: Group { orientation: 'column', alignChildren: ['fill', 'fill'], spacing:10, \
                prefs: Group { orientation: 'row', alignChildren:['left', 'top'], \
                    transform: Panel { orientation: 'column', alignChildren:['left', 'top'], text: 'Параметры обработки изображения', margins:[10, 20, 10, 20], \
                        regime_label: StaticText { text: 'Режим преобразования' }, \
                        regime: DropDownList {bounds: [40, 15, 240, 40]}, \
                        noise_label: StaticText { text: 'Уровень удаления шума' }, \
                        noise: DropDownList {bounds: [40, 15, 240, 40]}, \
                        profiles_label: StaticText { text: 'Профиль' }, \
                        profiles: DropDownList {bounds: [40, 15, 240, 40]}, \
                        block_label: StaticText { text: 'Размер блока' }, \
                        block: DropDownList {bounds: [40, 15, 240, 40]}, \
                    }, \
                    resize: Panel { orientation: 'row', alignChildren:['left', 'top'], text: 'Режим преобразования', margins:[10, 20, 10, 20], \
                        types: Group { orientation: 'column', alignChildren: ['fill', 'fill'], spacing:10, \
                            both: RadioButton { text:'По величине', value: true, bounds: [40, 15, 150, 40] }, \
                            width: RadioButton { text:'По ширине', value: false, bounds: [40, 15, 150, 40] }, \
                            height: RadioButton { text:'По высоте', value: false, bounds: [40, 15, 150, 40] }, \
                        }, \
                    }, \
                }, \
            }, \
            btns: Group { orientation: 'row', alignChildren: ['fill', 'fill'], spacing:10, \
                ok: Button { name: 'ok', helpTip:'Запуск', text:'Запуск', alignment:'center', enabled:true }, \
                cancel: Button { text:'Отменить', name: 'cancel', alignment:'center' }, \
            } \
        }";

        var win = new Window(res);
        win.text = title;
        win.defaultElement = win.btns.ok;

        win.dlg.prefs.transform.regime.add("item", "Авто-убрать шум и увеличить");
        win.dlg.prefs.transform.regime.add("item", "Убрать шум и увеличить");
        win.dlg.prefs.transform.regime.add("item", "Только увеличить");
        win.dlg.prefs.transform.regime.add("item", "Только убрать шум");
        win.dlg.prefs.transform.regime.selection = 0;

        win.dlg.prefs.transform.noise.add("item", 0);
        win.dlg.prefs.transform.noise.add("item", 1);
        win.dlg.prefs.transform.noise.add("item", 2);
        win.dlg.prefs.transform.noise.add("item", 3);
        win.dlg.prefs.transform.noise.selection = 0;

        win.dlg.prefs.transform.profiles.add("item", "2D изображ. (Профиль UpRGB)");
        win.dlg.prefs.transform.profiles.add("item", "Фото (Профиль UpPhoto)");
        win.dlg.prefs.transform.profiles.add("item", "2D изображ. (Профиль RGB)");
        win.dlg.prefs.transform.profiles.add("item", "Фотография, Аниме");
        win.dlg.prefs.transform.profiles.add("item", "2D изображ. (Профиль Y)");
        win.dlg.prefs.transform.profiles.selection = 0;

        win.dlg.prefs.transform.block.add("item", 64);
        win.dlg.prefs.transform.block.add("item", 100);
        win.dlg.prefs.transform.block.add("item", 128);
        win.dlg.prefs.transform.block.add("item", 240);
        win.dlg.prefs.transform.block.add("item", 256);
        win.dlg.prefs.transform.block.add("item", 384);
        win.dlg.prefs.transform.block.add("item", 432);
        win.dlg.prefs.transform.block.add("item", 480);
        win.dlg.prefs.transform.block.add("item", 512);
        win.dlg.prefs.transform.block.selection = 0;

        win.btns.cancel.onClick = function() {
            win.close();
            exit();
        };

        win.center();
        var result = win.show();
        if (result !== 1) {
            exit();
        } else {
            switch (++win.dlg.prefs.transform.regime.selection.index) {
                case 1:
                    config.regime = "noise_scale";
                    break;
                case 2:
                    config.regime = "scale";
                    break;
                case 3:
                    config.regime = "noise";
                    break;
                default:
                    config.regime = "auto_scale";
            }
            switch (++win.dlg.prefs.transform.profiles.selection.index) {
                case 0:
                    // win.dlg.prefs.transform.profiles.add("item", "2D изображ. (Профиль UpRGB)");
                    config.profiles = "upconv_7_anime_style_art_rgb";
                    break;
                case 1:
                    // win.dlg.prefs.transform.profiles.add("item", "Фото (Профиль UpPhoto)");
                    config.profiles = "upconv_7_photo";
                    break;
                case 2:
                    // win.dlg.prefs.transform.profiles.add("item", "2D изображ. (Профиль RGB)");
                    config.profiles = "anime_style_art_rgb";
                    break;
                case 3:
                    // win.dlg.prefs.transform.profiles.add("item", "Фотография, Аниме");
                    config.profiles = "photo";
                    break;
                default:
                    // win.dlg.prefs.transform.profiles.add("item", "2D изображ. (Профиль Y)");
                    config.profiles = "anime_style_art";
            }
            config.block = ++win.dlg.prefs.transform.block.selection.text;
            config.noise = ++win.dlg.prefs.transform.noise.selection.index;
        }

    }

    return {
        run: main,
        cuipath: cuipath
    }
})();

iWai.run();
