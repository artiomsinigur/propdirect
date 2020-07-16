const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass");
const gulpStylelint = require("gulp-stylelint");
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const del = require("del");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const webpack = require("webpack-stream");
// const svgSprite = require('gulp-svg-sprite');

// Compile sass into css
function style() {
  return (
    src("./src/sass/style.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(concat("style.css"))
      .pipe(dest("./src/css"))
      // Stream changes to all browser
      .pipe(browserSync.stream())
  );
}

// Linter that helps to avoid errors and enforce conventions in styles
function styleLint() {
  return src("./src/sass/**/*.scss").pipe(
    gulpStylelint({
      failAfterError: false,
      reporters: [
        {
          formatter: "string",
          console: true,
        },
      ],
    })
  );
}

// Watch sass files when change
function watcher() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  watch("./src/sass/**/*.scss", styleLint);
  watch("./src/sass/**/*.scss", { delay: 500 }, style);
  watch("./*.html").on("change", browserSync.reload);
  watch("./src/js/*.js").on("change", browserSync.reload);
}

// Add vendor prefixes to CSS
function cssAutoprefixer() {
  return src("./src/css/style.css")
    .pipe(autoprefixer())
    .pipe(dest("./src/css"));
}

// Minify the js files
function jsMinify() {
  return (
    src([
      "./src/js/*.js",
      "!src/js/vendor/*.js",
      "!src/js/keycode.js",
      "!src/js/handleMenu.js",
    ])
      // .pipe(webpack())
      .pipe(concat("production.js"))
      .pipe(uglify())
      .pipe(rename("production.min.js"))
      .pipe(dest("./src/js/"))
  );
}

// Optimize the images
function imgMinify() {
  return src("./src/img/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("./src/img/compressed"));
}

// Clean old folders and files
function clean() {
  return del([
    "./src/css/style.css",
    "./src/js/build",
    // "./src/img/compressed",
  ]);
}

module.exports = {
  style,
  clean,
  watch: watcher,
  imageMin: series(clean, imgMinify),
  build: series(clean, parallel(jsMinify, series(style, cssAutoprefixer))),
};
