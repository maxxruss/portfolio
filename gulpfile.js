
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: {
        html: '../build/portfolio/',
        // js: 'build/js/',
        css: '../build/portfolio/style/',
        img: '../build/portfolio/img/',
        // fonts: 'build/portfolio/fonts/'
    },
    src: {
        html: '*.html',
        // js: 'src/js/main.js',
        style: 'style/main.scss',
        img: 'img/**/*.*',
        // fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: '**/*.html',
        // js: 'src/js/**/*.js',
        style: 'style/**/*.scss',
        img: 'img/**/*.*',
        // fonts: 'src/fonts/**/*.*'
    },
    clean: '../buildportfolio'
};

var config = {
    server: {
        baseDir: "../build/portfolio"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "max_server"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

// gulp.task('js:build', function () {
//     gulp.src(path.src.js)
//         .pipe(rigger())
//         .pipe(sourcemaps.init())
//         .pipe(uglify())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(path.build.js))
//         .pipe(reload({stream: true}));
// });

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(gulp.dest('style/'))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

// gulp.task('fonts:build', function() {
//     gulp.src(path.src.fonts)
//         .pipe(gulp.dest(path.build.fonts))
// });

gulp.task('build', [
    'html:build',
    // 'js:build',
    'style:build',
    // 'fonts:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    // watch([path.watch.js], function(event, cb) {
    //     gulp.start('js:build');
    // });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    // watch([path.watch.fonts], function(event, cb) {
    //     gulp.start('fonts:build');
    // });
});


gulp.task('default', ['build', 'webserver', 'watch']);