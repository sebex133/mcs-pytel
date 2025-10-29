const gulp = require("gulp");

const plumber = require("gulp-plumber");
const through = require("through2");

const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cleanCSS = require("gulp-clean-css");

const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const terser = require("gulp-terser");

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
    .src("src/*.html")
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

// gulp.task('js', () => {
//   return gulp.src('src/js/**/*.js')
//     .pipe(babel({ presets: ['@babel/preset-env'] }))
//     .pipe(terser())
//     .pipe(gulp.dest('dist/js'))
//     .pipe(browserSync.stream());
// });

// Compile SCSS
// gulp.task("scss", () => {
//   return (
//     gulp
//       .src("src/scss/**/*.scss")
//       .pipe(plumber())
//       .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
//       // .pipe(sleep(100))
//       .pipe(gulp.dest("dist/css"))
//       .pipe(browserSync.stream())
//   );
// });

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
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({ overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'] })
    ]))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(stylesPaths.css))
  )
});


// Serve and watch
gulp.task("serve", () => {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
    // files: [
    //   './app/index.html',
    //   './app/assets/styles/**/*.css'
    // ]
  });

  // gulp.watch('src/assets/**/*.*', gulp.series('assets'));
  gulp.watch("src/*.html", gulp.series("html"));
  gulp.watch("src/js/**/*.js", gulp.series("js"));
  gulp.watch(stylesPaths.scss, gulp.series("styles"));
  // gulp.watch("src/scss/**/*.scss", gulp.series("scss"));
  // gulp.watch('src/*.html').on('change', browserSync.reload);
});

// Default task
gulp.task("default", gulp.series("html", "js", "styles", "serve"));
// gulp.task('default', gulp.series('assets', 'scss', 'js', 'html', 'serve'));
