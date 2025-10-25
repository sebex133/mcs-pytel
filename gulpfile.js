const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

// HTML to dist
gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// Assets
// gulp.task('assets', () => {
//   return gulp.src('src/assets/**/*.*')
//     .pipe(gulp.dest('dist/assets/'));
// });

// Compile SCSS
gulp.task('scss', () => {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// Minify JS
gulp.task('js', () => {
  return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

// gulp.task('js', () => {
//   return gulp.src('src/js/**/*.js')
//     .pipe(babel({ presets: ['@babel/preset-env'] }))
//     .pipe(terser())
//     .pipe(gulp.dest('dist/js'))
//     .pipe(browserSync.stream());
// });

// Serve and watch
gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });

  // gulp.watch('src/assets/**/*.*', gulp.series('assets'));
  gulp.watch('src/scss/**/*.scss', gulp.series('scss'));
  gulp.watch('src/js/**/*.js', gulp.series('js'));
  gulp.watch('src/*.html', gulp.series('html'));
  gulp.watch('src/*.html').on('change', browserSync.reload);
});

// Default task
gulp.task('default', gulp.series('scss', 'js', 'html', 'serve'));
// gulp.task('default', gulp.series('assets', 'scss', 'js', 'html', 'serve'));
