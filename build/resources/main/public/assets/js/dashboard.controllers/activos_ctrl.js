dashboardApp.controller('activos_ctrl', ['$scope', '$http', '$uibModal', '$timeout', 'AUX_TABLES', activos]);

function activos($scope, $http, $uibModal, $timeout, AUX_TABLES) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_activo"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_activo"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.activo     = {};
	$scope.activo_estados = AUX_TABLES.activo_estado;
	$scope.activo_tipos   = AUX_TABLES.activo_tipo;
	$scope.filtro_tipo_id = "";

	var Table_activos = $('#lista-activos').dataTable({
		"processing": true,
		"serverSide": true,
		"order": [[1, 'asc']],
		"ajax": {
			"url": CONST.BASE('activo/datatable'), "type": "POST", "data":function(d){
						d.filtro_tipo_id = $scope.filtro_tipo_id;
			}
		},
		"columns": [
			{data: 'nom_act', orderable: false}, {data: 'fecha_comp_act', class: 'text-center', orderable: false},
			{data: 'srl_act', orderable: false}, {data: 'tipo_id', orderable: false},
			{data: 'estado_id', orderable: false},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}
		],
		columnDefs: [
			{
				render: function (data, type, row) {
					return data ? AUX_TABLES.activo_tipo.find(function (tipo) {
						return tipo.id_tipo === data;
					}).desc_tipo : "SIN CLASIFICAR";
				}, targets: 3
			},
			{
				render: function (data, type, row) {
					return data ? AUX_TABLES.activo_estado.find(function (tipo) {
						return tipo.id_estado === data;
					}).desc_estado : "";
				}, targets: 4
			}
		],
		rowCallback: function (row, data) {
			$(row).find('button.admin_activo').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.activo                = Object.assign({}, data);
					$scope.activo.fecha_comp_act = ($scope.activo.fecha_comp_act) ? $scope.activo.fecha_comp_act.toDate() : null;
					$scope.activo.fecha_baja_act = ($scope.activo.fecha_baja_act) ? $scope.activo.fecha_baja_act.toDate() : null;
					$scope.adm_activo();
				});
			});

			$(row).find('button.drop_activo').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');

				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar el activo: ' + data.nom_act + '?, Este proceso es irreversible.',
					icon: 'glyphicon glyphicon-question-sign',
					hide: false,
					styling: 'bootstrap3',
					confirm: {
						confirm: true, buttons: [
							{
								text: 'Cancelar', addClass: 'pull-left', click: function (notice) {
									notice.remove();
								}
							}, {
								text: 'Eliminar', click: function (notice) {
									notice.remove();
									$scope.eliminar(data);
								}
							}
						]
					},
					buttons: {
						closer: false, sticker: false
					},
					history: {
						history: false
					},
					addclass: 'stack-modal',
					stack: {'dir1': 'down', 'dir2': 'right', 'modal': true}
				});
			});
		}
	});

	$scope.aplicaFiltro = function(){
			Table_activos.fnDraw(true);
	};

	$scope.adm_activo = function (activo) {
		$scope.activo = activo||$scope.activo;
		modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('activo/form_activo.html'),
			size: 'md',
			controller: 'activo_ctrl',
			scope: $scope
		});

		modalInstance.result.then(function (response) {
			Table_activos.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.eliminar = function (data) {
		$http({
			url: CONST.BASE('activo/' + data.id_act),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'DELETE'
		}).then(function (data) {
			Notify(data.data);
			Table_activos.fnDraw(false);
		}, function (data) {
			console.log(data);
			Notify(data.data);
		});
	};

	$('.actualizar_activos').unbind('click').on('click', function (e) {
		Table_activos.fnDraw(false);
	});
}

dashboardApp.controller('activo_ctrl', ['$scope', '$http', '$uibModalInstance', '$timeout', '$uibModal', 'AUX_TABLES', fnactivo]);

function fnactivo($scope, $http, $uibModalInstance, $timeout, $uibModal, AUX_TABLES) {
	$scope.activo_estados = AUX_TABLES.activo_estado;
	$scope.activo_tipos   = AUX_TABLES.activo_tipo;

	console.log($scope.activo)
	$scope.ok = function () {
		$scope.SAVING         = true;
		var ACT            = Object.assign({}, $scope.activo);
		ACT.fecha_comp_act = (ACT.fecha_comp_act) ? ACT.fecha_comp_act.getSimple() : "";
		ACT.fecha_baja_act = (ACT.fecha_baja_act) ? ACT.fecha_baja_act.getSimple() : "";
		console.log(ACT);
		$http({
			url: CONST.BASE('activo' + (ACT.id_act ? "/" + ACT.id_act : "")),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: ACT.id_act ? 'PUT' : 'POST',
			data: $.param(ACT)
		}).then(function (data) {
			Notify(data.data);
			if(!data.data.error) {
				$uibModalInstance.close($scope.activo);
			}
			$scope.SAVING = false;
		}, function (data) {
			console.log(data);
			$scope.SAVING = false;
			Notify(data.data);
		});

	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

}
