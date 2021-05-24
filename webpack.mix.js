let mix = require('laravel-mix');

mix.sass('src/assets/sass/style.scss', 'public/css');
mix.js('src/assets/js/app.js', 'public/js').vue({version: 2});
mix.copyDirectory('src/assets/fontello/font', 'public/fonts');

mix.disableNotifications();
