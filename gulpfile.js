require('harmonize')(['harmony-proxies']);
require('babel/register');

var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');
var uglifier = require("node-uglifier");

var path = require('path');

gulp.task('build', ['babel'], function() {
	var u = new uglifier("./build-reference.js")
	
	return u 
		.merge()
		.uglify()
		.exportToFile("./main.js");
});

gulp.task('babel', function () { 
    return gulp.src(['src/**/*.js', 'test/**/*.js'])
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

gulp.task('test', ['babel'], function () {
	return gulp.src('dist/**/*.spec.js', { read: false})
		.pipe(mocha());
});

gulp.task('watch', function() { 
    gulp.watch(["src/**/*.js", "test/**/*.spec.js", "dist/**/*.js"], ['babel', 'test']);
});

gulp.task('default', ['watch']); 