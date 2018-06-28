angular.module('dashboardApp').service('AUX_TABLES', ['$http', DASHBOARD_SERVICES]);

function DASHBOARD_SERVICES($http) {
	this.tipo_doc      = [];
	this.activo_estado = [];
	this.activo_tipo   = [];
	this.areas         = [];


	this.loader_tipo_doc = function (reference) {
		if(this.tipo_doc.length) {
			reference = this.tipo_doc;
			return;
		}

		$http({
			url: CONST.BASE('persona/documento/collection'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'GET'
		}).then(function (data) {
			this.tipo_doc = data.data.rows;
			reference     = data.data.rows;
		}.bind(this), function (data) {
			console.log(data);
		});
	}.bind(this);

	this.loader_activo_tipo = function (reference) {
		if(this.activo_tipo.length) {
			reference = this.activo_tipo;
			return;
		}

		$http({
			url: CONST.BASE('activo/tipo/collection'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'GET'
		}).then(function (data) {
			this.activo_tipo = data.data.rows;
			reference        = data.data.rows;
		}.bind(this), function (data) {
			console.log(data);
		});
	}.bind(this);

	this.loader_activo_estado = function (reference) {
		if(this.activo_estado.length) {
			reference = this.activo_estado;
			return;
		}

		$http({
			url: CONST.BASE('activo/estado/collection'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'GET'
		}).then(function (data) {
			this.activo_estado = data.data.rows;
			reference          = data.data.rows;
		}.bind(this), function (data) {
			console.log(data);
		});
	}.bind(this);

	this.loader_areas = function (reference) {
		if(this.areas.length) {
			reference = this.areas;
			return;
		}

		$http({
			url: CONST.BASE('area/collection'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'GET'
		}).then(function (data) {
			this.areas = data.data.rows;
			reference  = data.data.rows;
		}.bind(this), function (data) {
			console.log(data);
		});
	}.bind(this);

	this.loader_tipo_doc();
	this.loader_activo_tipo();
	this.loader_activo_estado();
	this.loader_areas();
}