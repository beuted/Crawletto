declare var requirejs: any;
declare var require: any;

(<any>requirejs).config({
    paths: {
        'lodash': 'bower_components/lodash/lodash',
        'easystarjs': 'bower_components/easystarjs/bin/easystar-0.2.3.min',
        'phaser': 'vendors/phaser/phaser.min',
        'phaserPluginIsometric': 'vendors/phaser/phaser-plugin-isometric.min',
        'text': 'bower_components/requirejs-plugins/lib/text',
        'json': 'bower_components/requirejs-plugins/src/json'
    },
    shim: {
        'easystarjs': {
            deps: ['lodash']
        },
        'phaser': {
            exports: 'Phaser'
        },
        'phaserPluginIsometric': {
            deps: ['phaser']
        }
    }
});

(<any>require)(['json!shared/config.json', 'phaser', 'easystarjs', 'phaserPluginIsometric', 'app']);
