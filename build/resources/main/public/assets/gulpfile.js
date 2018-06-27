'use strict';
const gulp     = require('gulp');
const concat   = require('gulp-concat');
const uglify   = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const clear    = require('clear');
const gulpy    = require('gulp-notify');

const PACK = {
	login: {
		js: [
			'js/libs/angular.min.js',
			'js/libs/jQuery-2.1.4.min.js',
			'js/libs/bootstrap.min.js',
			'js/libs/icheck.min.js',
			'js/libs/polyfill.js',
			'js/Angular.app.login.js'
		],
		css: [
			'css/bootstrap.css',
			'css/font-awesome.min.css',
			'css/google.fonts.css',
			'css/AdminLTE.css',
			'css/blue.css'
		],
		info: {
			js: {
				route: 'js/', name: 'login.min.js', task: 'login_js'
			}, css: {
				route: 'css/', name: 'login.min.css', task: 'login_css'
			}
		}
	},
	dashboard: {
		js: [
			'js/libs/tinymce.min.js',
			'js/libs/themes/modern/theme.min.js',
			'js/plugins/table/plugin.min.js',
			'js/plugins/lists/plugin.min.js',
			'js/plugins/link/plugin.min.js',
			'js/langs/es_MX.js',
			'js/libs/angular.min.js',
			'js/libs/ui-bootstrap-custom-2.5.0.js',
			'js/libs/ui-bootstrap-custom-tpls-2.5.0.js',
			'js/libs/angular-animate.min.js',
			'js/libs/angular-route.min.js',
			'js/libs/angular-tinymce.js',
			'js/libs/jQuery-2.1.4.min.js',
			'js/libs/bootstrap.min.js',
			'js/libs/jquery.dataTables.js',
			'js/libs/dataTables.bootstrap.min.js',
			'js/libs/jquery.slimscroll.min.js',
			'js/libs/fastclick.min.js',
			'js/libs/AdminLTE.js',
			'js/libs/AdminLTE.settings.js',
			'js/libs/polyfill.js',
			'js/libs/pnotify.custom.min.js',
			'js/libs/select2.min.js',
			'js/libs/fileinput.js',
			'js/Angular.app.dashboard.js',
			'js/dashboard.controllers/*_ctrl.js'],
		css: [
			'css/bootstrap.css',
			'css/font-awesome.min.css',
			'css/ionicons.min.css',
			'css/dataTables.bootstrap.css',
			'css/select2.min.css',
			'css/fileinput.css',
			'css/google.fonts.css',
			'css/AdminLTE.css',
			'css/skins/_all-skins.css',
			'css/pnotify.custom.min.css'
		], info: {
			js: {
				route: 'js/', name: 'dashboard.min.js', task: 'dashboard_js'
			}, css: {
				route: 'css/', name: 'dashboard.min.css', task: 'dashboard_css'
			}
		}
	}, search: {
		js: [
			'js/libs/jQuery-2.1.4.min.js',
			'js/libs/bootstrap.min.js',
			'js/libs/AdminLTE.js',
			'js/libs/select2.min.js',
			'js/libs/polyfill.js',
			'js/App.doodle.js'
		], css: [
			'css/bootstrap.css',
			'css/font-awesome.min.css',
			'css/ionicons.min.css',
			'css/select2.min.css',
			'css/AdminLTE.css',
			'css/skins/_all-skins.css'
		], info: {
			js: {
				route: 'js/', name: 'search.min.js', task: 'search_js'
			}, css: {
				route: 'css/', name: 'search.min.css', task: 'search_css'
			}
		}
	}, result: {
		js: [
			'js/libs/jQuery-2.1.4.min.js',
			'js/libs/bootstrap.min.js',
			'js/libs/AdminLTE.js',
			'js/libs/select2.min.js',
			'js/libs/polyfill.js',
			'js/App.result.js'
		], css: [
			'css/bootstrap.css',
			'css/font-awesome.min.css',
			'css/ionicons.min.css',
			'css/select2.min.css',
			'css/AdminLTE.css',
			'css/skins/_all-skins.css'
		], info: {
			js: {
				route: 'js/', name: 'result.min.js', task: 'result_js'
			}, css: {
				route: 'css/', name: 'result.min.css', task: 'result_css'
			}
		}
	}
};

/*TASK LOGIN*/
gulp.task(PACK.login.info.js.task, function () {
	clear();
	gulp.src(PACK.login.js)
		.pipe(concat(PACK.login.info.js.name))
		.pipe(uglify())
		.pipe(gulp.dest(PACK.login.info.js.route))
		.pipe(gulpy({ message: "Se ha compilado: "+PACK.login.info.js.task, onLast: true }));
});

gulp.task(PACK.login.info.css.task, function () {
	clear();
	gulp.src(PACK.login.css)
		.pipe(concat(PACK.login.info.css.name))
		.pipe(cleanCSS())
		.pipe(gulp.dest(PACK.login.info.css.route))
		.pipe(gulpy({ message: "Se ha compilado: "+PACK.login.info.css.task, onLast: true }));
});
/*#TASK LOGIN#*/

/*TASK DASHBOARD*/
gulp.task(PACK.dashboard.info.js.task, function () {
	clear();
	gulp.src(PACK.dashboard.js)
		.pipe(concat(PACK.dashboard.info.js.name))
		.pipe(uglify())
		.pipe(gulp.dest(PACK.dashboard.info.js.route))
		.pipe(gulpy({ message: "Se ha compilado: "+PACK.dashboard.info.js.task, onLast: true }));
});

gulp.task(PACK.dashboard.info.css.task, function () {
	clear();
	gulp.src(PACK.dashboard.css)
		.pipe(concat(PACK.dashboard.info.css.name))
		.pipe(cleanCSS())
		.pipe(gulp.dest(PACK.dashboard.info.css.route))
		.pipe(gulpy({ message: "Se ha compilado: "+PACK.dashboard.info.css.task, onLast: true }));
});
/*#TASK DASHBOARD#*/

/*TASK SEARCH*/
gulp.task(PACK.search.info.js.task, function () {
	clear();
	gulp.src(PACK.search.js)
		.pipe(concat(PACK.search.info.js.name))
		.pipe(uglify())
		.pipe(gulp.dest(PACK.search.info.js.route))
		.pipe(gulpy({ message: "Se ha compilado: "+PACK.search.info.js.task, onLast: true }));
});

gulp.task(PACK.search.info.css.task, function () {
	clear();
	gulp.src(PACK.search.css)
		.pipe(concat(PACK.search.info.css.name))
		.pipe(cleanCSS())
		.pipe(gulp.dest(PACK.search.info.css.route))
		.pipe(gulpy({ message: "Se ha compilado: "+PACK.search.info.css.task, onLast: true }));
});
/*#TASK SEARCH#*/

/*TASK RESULT*/
gulp.task(PACK.result.info.js.task, function () {
	clear();
	gulp.src(PACK.result.js)
		.pipe(concat(PACK.result.info.js.name))
		.pipe(uglify())
		.pipe(gulp.dest(PACK.result.info.js.route))
		.pipe(gulpy({ message: "Se ha compilado: "+PACK.result.info.js.task, onLast: true }));
});

gulp.task(PACK.result.info.css.task, function () {
	clear();
	gulp.src(PACK.result.css)
		.pipe(concat(PACK.result.info.css.name))
		.pipe(cleanCSS())
		.pipe(gulp.dest(PACK.result.info.css.route))
		.pipe(gulpy({ message: "Se ha compilado: "+PACK.result.info.css.task, onLast: true }));
});
/*#TASK RESULT#*/

gulp.task('compile', function () {
	for (var i in PACK) {
		console.info(i, 'observando:', PACK[i].info.js.task);
		gulp.watch(PACK[i].js, [PACK[i].info.js.task]);
		
		console.info(i, 'observando:', PACK[i].info.css.task);
		gulp.watch(PACK[i].css, [PACK[i].info.css.task]);
	}
});