/*
* @Author: Vitaly Batushev
* @Date: 2017-05-01 21:42:43
 * @Last Modified by: Vitaly Batushev
 * @Last Modified time: 2017-05-05 19:26:11
 */

/**
 * Класс для работы с конфигом
 * @method  read    Чтение файла конфигурации
 * @method  write   Запись файла конфигурации
 */
var ConfigClass = (function(){
    var default_config = {
        waifu2x_path: Folder.myDocuments.absoluteURI + "/waifu2x-caffe/waifu2x-caffe-cui.exe",
        maxppi: 200,
        minppi: 50,
        mode: "auto_scale",
        noise: 0,
        profiles: "anime_style_art",
        block: 64
    }

    /**
     * Чтение конфигурации из файла ./config.js
     * При отсутствии файла config.js значения берутся из переменной default_config
     */
    var read = function() {
        if (!config_file.exists) { Config = default_config; return; }
        config_file.encoding = "UTF8";
        config_file.open("r");
        var content = config_file.read()
        config_file.close();
        config_json = JSON.parse(content);
        for (var param in default_config) {
            if (typeof config_json[param] == "undefined") {
                config_json[param] = default_config[param];
            }
        }
        Config = config_json;
    }

    /**
     * Запись файла ./config.js
     */
    var write = function() {
        config_file.encoding = "UTF8";
        config_file.open("w");
        config_file.write(JSON.stringify(Config, undefined,4));
        config_file.close();
    }

    return {
        read: read,
        write: write
    }
})();