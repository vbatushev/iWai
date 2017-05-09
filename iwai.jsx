/*
 * @Author: Vitaly Batushev
 * @Date: 2017-03-23 22:48:53
 * @Last Modified by: Vitaly Batushev
 * @Last Modified time: 2017-05-09 13:26:39
 */
#target indesign
#include "include/json2.jsx"
$.localization = true;

var scriptVersion = "1.4";

var iWai = (function(){
    #include "include/Localization.jsx"
    #include "include/ConfigClass.jsx"
    #include "include/Dialog.jsx"

    var cuipath, Config = {}, images = [], common_keys = "";
    var config_file = File(File($.fileName).parent.absoluteURI + '/config.json');

    /**
     * Основная функция скрипта
     * @param {Boolean} quiet   Скрывать ли диалоговое окно
     */
    var main = function (quiet) {
        var quiet = !!quiet || false;
        ConfigClass.read();
        cuipath = File(Config.waifu2x_path);
        if (!cuipath.exists) { alert("waifu2x-caffe не найден!"); exit(); }
        if (!quiet) {
            var dlg = new dlgPreferences("  waifu2x-caffe для Adobe InDesign " + scriptVersion);
        } else {
            ConfigClass.write();
        }
        common_keys = " -p " + Config.processor + " -m " + Config.mode + " -n " + Config.noise + " -q 100 --crop_size " + Config.block;
        var model_dir = Folder(cuipath.parent.absoluteURI + "/models/" + Config.profiles);
        if (model_dir.exists) {
            common_keys += " --model_dir " + "\"" + model_dir.fsName + "\"";
        }

        if (!app.activeDocument.selection.length || app.activeDocument.selection.length > 1) {
            find();
        } else {
            if (app.activeDocument.selection[0].images.length == 1) {
                if (testImage(app.activeDocument.selection[0].images[0], true)) {
                    imageProcess(app.activeDocument.selection[0].images[0]);
                }
            } else {
                find();
            }
        }
    }

    /**
     * Проверка имени изображения на наличие в нем суффикса .wai
     *
     * @param {any} image
     * @returns
     */
    function testImage(image, question) {
        if (image.itemLink.name.indexOf(".wai.") > -1) {
            if (question) {
                return confirm(localize(Locale.waireplace), false, localize(Locale.attention));
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * Поиск подходящих объектов Image и помещение их в глобальный массив images
     * Обрабатываются изображения, где ppi больше максимального значения ppi в конфигурации,
     * меньше минимального значения ppi и статус прилинкованного изображения является нормальным
     */
    function find() {
        for (var a = 0, l = app.activeDocument.allGraphics.length; a < l; a++) {
            var current = app.activeDocument.allGraphics[a];
            if (current instanceof Image) {
                var effectivePpi = parseFloat(current.effectivePpi);
                if (effectivePpi < Config.maxppi && effectivePpi > Config.minppi && current.itemLink.status == LinkStatus.NORMAL) {
                    images.push(current);
                }
            }
        }
        process();
    }

    /**
     * Обработка объектов Image, находящихся в глобальном массиве images
     */
    function process(){
        for (var a = 0, l = images.length; a < l; a++) {
            if (testImage(images[a], false)) {
                imageProcess(images[a]);
            }
        }
    }

    /**
     * Обработка конкретного изображения
     *
     * @param {Image} image     Обрабатываемый объект Image в публикации Adobe InDesign
     */
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
        cmd_file.encoding = "CP866";
        cmd_file.open("w"); cmd_file.write(cmd_string); cmd_file.close();
        cmd_file.execute();
        while (lock.exists) {
            $.sleep(100);
        }
        if (output_file.exists) {
            image.itemLink.relink(output_file);
        }
    }

    /**
     * Получение расширения из имени файла
     *
     * @param {String} file_name    Имя файла
     * @returns String              Расширение файла
     */
    function getExtension(file_name) {
        var array = file_name.split(".");
        return array.pop();
    }

    return {
        run: main,
        cuipath: cuipath
    }
})();