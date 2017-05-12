/*
* @Author: Vitaly Batushev
* @Date: 2017-05-01 21:42:43
 * @Last Modified by: Vitaly Batushev
 * @Last Modified time: 2017-05-12 11:21:33
 */

/**
 * Класс для работы с конфигом
 * @method  read    Чтение файла конфигурации
 * @method  write   Запись файла конфигурации
 */
var ConfigClass = (function(){
    var default_config = {
        waifu2x_path: Folder.myDocuments.absoluteURI + "/waifu2x-caffe/waifu2x-caffe-cui.exe",
        max_ppi: 200,
        min_ppi: 50,
        need_ppi: 300,
        mode: "auto_scale",
        noise: 0,
        profiles: "upconv_7_anime_style_art_rgb",
        block: 64,
        processor: "cpu",
        language: "ru"
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
            if (param == "max_ppi" || param = "min_ppi" || param == "need_ppi") {
                var ppi = parseInt(config_json[param]);
                if (isNaN(ppi)) {
                    ppi = default_config[param];
                }
                config_json[param] = ppi;
            }
            if (param == "noise") {
                var noise = parseInt(config_json[param]);
                if (isNaN(noise) || noise > 4 || noise < 0) {
                    noise = default_config[param];
                }
                config_json[param] = noise;
            }
            if (param == "processor") {
                if (config_json[param] != "cpu" && config_json[param] != "gpu") {
                    config_json[param] = default_config[param];
                }
            }
            if (param == "language") {
                if (config_json[param] != "ru" && config_json[param] != "en") {
                    config_json[param] = default_config[param];
                }
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