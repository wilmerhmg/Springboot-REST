var dashboardApp = angular.module('dashboardApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap','ui.tinymce']);

dashboardApp.config(['$routeProvider', '$locationProvider', RUTAS]);

function RUTAS($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: CONST.URL('principal/view/resumen')
	}).when('/personas', {
		templateUrl: CONST.URL('principal/view/adm_persona'), controller: 'personas_ctrl'
	}).when('/usuarios', {
		templateUrl: CONST.URL('principal/view/adm_usuario'), controller: 'usuarios_ctrl'
	}).when('/divipol/pais', {
		templateUrl: CONST.URL('principal/view/adm_pais'), controller: 'paises_ctrl'
	}).when('/divipol/departamento', {
		templateUrl: CONST.URL('principal/view/adm_depto'), controller: 'deptos_ctrl'
	}).when('/divipol/municipio', {
		templateUrl: CONST.URL('principal/view/adm_mpio'), controller: 'mpios_ctrl'
	}).when('/identificacion', {
		templateUrl: CONST.URL('principal/view/adm_tipo_doc'), controller: 'tpdoc_ctrl'
	}).when('/sedes', {
		templateUrl: CONST.URL('principal/view/adm_sede'), controller: 'sedes_ctrl'
	}).when('/ciclos', {
		templateUrl: CONST.URL('principal/view/adm_ciclo'), controller: 'ciclos_ctrl'
	}).when('/programas', {
		templateUrl: CONST.URL('principal/view/adm_programa'), controller: 'programas_ctrl'
	}).when('/modalidades', {
		templateUrl: CONST.URL('principal/view/adm_modalidad'), controller: 'modalidades_ctrl'
	}).when('/calificaciones', {
		templateUrl: CONST.URL('principal/view/adm_calificacion'), controller: 'calificaciones_ctrl'
	}).when('/lineas', {
		templateUrl: CONST.URL('principal/view/adm_lineas'), controller: 'lineas_ctrl'
	}).when('/lineas/sublineas', {
		templateUrl: CONST.URL('principal/view/adm_sublineas'), controller: 'sublineas_ctrl'
	}).when('/grupos', {
		templateUrl: CONST.URL('principal/view/adm_grupos'), controller: 'grupos_ctrl'
	}).when('/grupos/semilleros', {
		templateUrl: CONST.URL('principal/view/adm_semilleros'), controller: 'semilleros_ctrl'
	}).when('/works', {
		templateUrl: CONST.URL('principal/view/adm_works'), controller: 'works_ctrl'
	}).otherwise({
		templateUrl: CONST.URL('principal/view/404')
	});
	$locationProvider.html5Mode(true);
}

dashboardApp.filter('fristCap', function () {
	return function (input, $scope) {
		if (input != null) {
			input = input.toLowerCase();
			return input.substring(0, 1).toUpperCase() + input.substring(1);
		}
		return "";
	}
});