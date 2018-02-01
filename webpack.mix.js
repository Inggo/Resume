let mix = require('laravel-mix');

mix.sass('src/assets/sass/style.scss', 'public/css');
mix.js('src/assets/js/app.js', 'public/js');
mix.copyDirectory('src/assets/fontello/font', 'public/fonts');
