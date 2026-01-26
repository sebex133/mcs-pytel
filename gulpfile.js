const gulp = require("gulp");

const plumber = require("gulp-plumber");
const through = require("through2");

const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cleanCSS = require("gulp-clean-css");

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const terser = require('gulp-terser');

function sleep(ms) {
  return through.obj(function (file, enc, cb) {
    setTimeout(() => cb(null, file), ms);
  });
}

// Assets
// gulp.task('assets', () => {
//   return gulp.src('src/assets/**/*.*')
//     .pipe(gulp.dest('dist/assets/'));
// });

// HTML to dist
gulp.task("html", () => {
  return gulp
    .src("src/index.html")
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

// Minify JS
gulp.task("js", () => {
  return gulp
    .src("src/js/**/*.js")
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
});

// Paths
const jsPaths = {
  jsEntry: 'src/js/main.js',
  jsWatch: 'src/js/**/*.js',
  jsOutputDir: 'dist/js',
  jsOutputFile: 'bundle.js',
};

// JS task: bundle + transpile + minify + stream
gulp.task('js-es6', () => {
  return browserify({ entries: jsPaths.jsEntry, debug: true })
    .transform(babelify, { presets: ['@babel/preset-env'], sourceMaps: true })
    .bundle()
    .pipe(source(jsPaths.jsOutputFile))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest(jsPaths.jsOutputDir))
    .pipe(browserSync.stream());
});

// stylesPaths
const stylesPaths = {
  scss: 'src/scss/**/*.scss',
  css: 'dist/css'
};

// Compile SCSS → CSS + Autoprefixer + Minify
gulp.task("styles", () => {
  return (
    gulp.src(stylesPaths.scss)
      .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([
        autoprefixer({ overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'] })
      ]))
      .pipe(cleanCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(stylesPaths.css))
      .pipe(browserSync.stream())
  )
});

// Serve and watch
gulp.task("serve", () => {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
    // files: [stylesPaths, jsPaths]
    // files: [
    //   './app/index.html',
    //   './app/assets/styles/**/*.css'
    // ]
  });

  gulp.watch("src/*.html", gulp.series("html"));
  gulp.watch(jsPaths.jsWatch, gulp.series("js-es6"));
  gulp.watch(stylesPaths.scss, gulp.series("styles"));
  // gulp.watch('src/*.html').on('change', browserSync.reload);
  // gulp.watch('src/assets/**/*.*', gulp.series('assets'));
});

// Default task
gulp.task("default", gulp.series("html", "js-es6", "styles", "serve"));
// gulp.task('default', gulp.series('assets', 'scss', 'js', 'html', 'serve'));
