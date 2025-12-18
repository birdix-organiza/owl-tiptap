const gulp = require('gulp');
const ts = require('gulp-typescript');
const sass = require('gulp-sass')(require('sass'));
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const merge = require('merge2');
const fs = require('fs');

// TypeScript 配置
const tsProject = ts.createProject('tsconfig.json');

// 清理构建目录
gulp.task('clean', function () {
  return gulp.src('es', { read: false, allowEmpty: true }).pipe(clean());
});

// 编译并移动TypeScript和js代码
gulp.task('compile-scripts', function () {
  const tsResult = gulp
    .src('src/**/*.ts')
    .pipe(replace(/\.scss/g, '.css')) // 将scss路径替换为css路径
    .pipe(tsProject());
  const jsResult = gulp.src('src/**/*.js').pipe(replace(/\.scss/g, '.css')); // 将scss路径替换为css路径

  return merge(tsResult.pipe(gulp.dest('es')), jsResult.pipe(gulp.dest('es')));
});

// 编译 SCSS
gulp.task('sass', function () {
  return gulp
    .src('src/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('es'));
});

// 复制资源文件
gulp.task('copy-assets', function (done) {
  const srcDir = 'src/assets';
  // 检查源目录是否存在
  if (!fs.existsSync(srcDir)) {
    return done(); // 完成任务而不执行复制
  }
  return gulp.src('src/assets/**/*').pipe(gulp.dest('es/assets'));
});

// 默认构建任务
gulp.task('build', gulp.series('clean', 'compile-scripts', 'sass', 'copy-assets'));
