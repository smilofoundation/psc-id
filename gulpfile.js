var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var less = require('gulp-less');
var path = require('path');


var buildProperties = {
    publicDir: require('path').resolve('./public/static/css'),
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || 'DEVELOP',
    cssFiles: [
        './dist/static/styles/main.css',
    ],
    assetFiles: [
    ],
    imageFiles: [
    ]
};

gulp.task('sourcemaps', function () {
    return gulp.src(buildProperties.cssFiles)
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist'));
});

gulp.task('css', ['sass'], function () {
    return gulp.src(buildProperties.cssFiles)
        .pipe(concat('all.css'))
        .pipe(gulp.dest(buildProperties.publicDir + "/static/"))
        .on('error', function (error) {
            console.log(error);
        })
        .on('end', function () {
            console.log('Done css concat dependencies.');
        }).pipe(rename('all.min.css'))
        .pipe(cleanCSS({keepSpecialComments: 0, sourceMap: true,inline: ['none'],compatibility: 'ie8'}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(buildProperties.publicDir + "/static/"))
        .on('end', function () {
            console.log('Done css minify dependencies.');
        })
});

gulp.task('css:watch', function () {
    gulp.watch('./app/styles/*', ['css']);
    gulp.watch('./app/css/*', ['css']);
    gulp.watch('./app/styles/*', ['css']);
});

gulp.task('sass', function () {
 return gulp.src(['./app/**/*.scss'])
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest(buildProperties.publicDir + "/static/"))
});

gulp.task('fonts', function () {
    gulp.src(
        [
            "./bower_components/components-font-awesome/fonts/**/*",
            "./bower_components/bootstrap/fonts/**/*"
        ])
        .pipe(gulp.dest(buildProperties.publicDir + '/fonts/'))
        .on('error', function (error) {
            console.log(error);
        })
        .on('end', function () {
            console.log('Done copying fonts dependencies.');
        });
});

gulp.task('default', ['css','fonts', 'css:watch']);

gulp.task('prod', ['css', 'fonts', 'css:watch']);
