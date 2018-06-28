dashboardApp.controller('asignaciones_ctrl', ['$scope', '$http', '$uibModal', '$timeout', asignaciones_ctrl]);

function asignaciones_ctrl($scope, $http, $uibModal, $timeout) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-danger btn-xs drop_asignacion"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.Asignacion = {};

	var Table_Asignacions = $('#lista-asignacion').dataTable({
		"processing": true,
		"serverSide": true,
		"order": [[1, 'asc']],
		"ajax": {
			"url": CONST.BASE('asignacion/datatable'), "type": "POST"
		},
		"columns": [
			{data: 'nom_act', orderable: false}, {data: 'asignado', orderable: false},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}
		],
		rowCallback: function (row, data) {

			$(row).find('button.drop_asignacion').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');

				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar el Asignacion: ' + data.nom_act + '?, Este proceso es irreversible.',
					icon: 'glyphicon glyphicon-question-sign',
					hide: false,
					styling: 'bootstrap3',
					confirm: {
						confirm: true, buttons: [
							{
								text: 'Cancelar', addClass: 'pull-left', click: function (notice) {
									notice.remove()
								}
							}, {
								text: 'Eliminar', click: function (notice) {
									notice.remove()
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

	$scope.adm_asignacion = function (asig) {
		$scope.Asignacion = asig || $scope.Asignacion;
		modalInstance     = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('asignacion/form_asignacion.html'),
			size: 'sm',
			controller: 'asignacion_ctrl',
			scope: $scope
		});

		modalInstance.result.then(function (response) {
			Table_Asignacions.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.eliminar = function (data) {
		$http({
			url: CONST.BASE('asignacion/' + data.id_asignacion),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'DELETE',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_Asignacions.fnDraw(false);
		}, function (data) {
			console.log(data);
			Notify(data.data);
		});
	};

	$('.actualizar_asignacion').unbind('click').on('click', function (e) {
		Table_Asignacions.fnDraw(false);
	});
}

dashboardApp.controller('asignacion_ctrl', ['$scope', '$http', '$uibModalInstance', '$timeout', '$uibModal', 'AUX_TABLES', asignacion_ctrl]);

function asignacion_ctrl($scope, $http, $uibModalInstance, $timeout, $uibModal, AUX_TABLES) {
	$scope.AREAS = AUX_TABLES.areas;
	$scope.ok    = function () {
		$scope.SAVING  = true;
		var Asignacion = Object.assign({}, $scope.Asignacion);

		$http({
			url: CONST.BASE('asignacion'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Asignacion)
		}).then(function (data) {
			Notify(data.data);
			if(!data.data.error) {
				$uibModalInstance.close($scope.Asignacion);
			}
			$scope.SAVING = false;
		}, function (data) {
			console.log(data);
			$scope.SAVING = false;
		});

	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};


	$timeout(function () {
		$("#Asignacion_persona_id").select2({
			placeholder: "Buscar persona...", minimumInputLength: 2, multiple: false, ajax: {
				url: CONST.BASE("persona/search"),
				dataType: 'json',
				type: 'GET',
				quietMillis: 500,
				data: function (term, page) {
					return {
						q: term, page: page
					};
				},
				results: function (data, page) {
					var more = (page * 10) < data.total;
					return {results: data.data, more: more};
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid"><b>' + repo.label + '</b></div><div class="row-fluid"><small><small>' + repo.more + '</small></small></div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.Asignacion.persona_id = $("#Asignacion_persona_id").val();
				});
				return repo.label;
			}
		});
		$("#Asignacion_activo_id").select2({
			placeholder: "Buscar Acivo...", minimumInputLength: 0, multiple: false, ajax: {
				url: CONST.BASE("activo/search"),
				dataType: 'json',
				type: 'get',
				quietMillis: 500,
				data: function (term, page) {
					return {
						q: term, page: page
					};
				},
				results: function (data, page) {
					var more = (page * 10) < data.total;
					return {results: data.data, more: more};
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid"><b>' + repo.label + '</b></div><div class="row-fluid"><small><small>' + repo.more + '</small></small></div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.Asignacion.activo_id = $("#Asignacion_activo_id").val();
				});
				return repo.label;
			}
		});
	});

}
