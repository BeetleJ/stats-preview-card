const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const livereload = require('gulp-livereload');

// HTML
gulp.task('html', function(cb) {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(livereload());
    cb();
});

// Sass
gulp.task('sass', function(cb) {
    return gulp.src('./src/sass/app.scss')
        .pipe(sourcemaps.init({largeFile: true}))
        .pipe(autoprefixer())
        .pipe(sass({outputStyle: "compressed"}).on('error', sass.logError))
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(livereload());
    cb();
});

// Javascript
gulp.task('vendorJs', function(cb) {
    return gulp.src([
        './node_modules/@fortawesome/fontawesome-pro/js/all.min.js',
    ])
        .pipe(sourcemaps.init({largeFile: true}))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('vendors.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(livereload());
    cb();
});

gulp.task('appJs', function(cb) {
    return gulp.src('./src/js/app.js')
        .pipe(sourcemaps.init({largeFile: true}))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(livereload());
    cb();
});

// Images
gulp.task('imagemin', function(cb) {
    return gulp.src('./src/images/**/*.+(jpeg|jpg|svg|png|gif)')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('./dist/images'))
        .pipe(livereload());
    cb();
});

gulp.task('default', function() {
    livereload.listen();
    gulp.watch('./src/**/*.html', gulp.series('html'));
    gulp.watch('./src/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('./src/js/app.js', gulp.series('appJs'));
    // gulp.watch([
    //     './node_modules/@fortawesome/fontawesome-pro/js/all.min.js'
    // ], gulp.series('vendorJs'));
    gulp.watch('./src/images/**/*.+(jpeg|jpg|svg|png|gif)', gulp.series('imagemin'));
});