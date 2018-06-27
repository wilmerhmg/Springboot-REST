dashboardApp.controller('programas_ctrl', ['$scope', '$http', '$timeout', '$uibModal', programas_ctrl]);

function programas_ctrl($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_programa"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_programa"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.programa   = {};
	
	var Table_programa = $('#lista-programa').dataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		order: [[0, 'asc'], [1, 'asc']],
		ajax: {
			url: CONST.URL('principal/programa_listar'), "type": "POST"
		},
		columns: [{data: 'des_nivel'}, {data: 'des_programa'}, {data: 'abr'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_programa').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.programa = Object.assign({}, data);
					$scope.adm_programa();
				});
			});
			
			$(row).find('button.drop_programa').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar el tipo de documento: ' + data.nom_doc + '?, Este proceso es irreversible.',
					icon: 'glyphicon glyphicon-question-sign',
					hide: false,
					styling: 'bootstrap3',
					confirm: {
						confirm: true, buttons: [{
							text: 'Cancelar', addClass: 'pull-left', click: function (notice) {
								notice.remove();
							}
						}, {
							text: 'Eliminar', click: function (notice) {
								notice.remove();
								$scope.eliminar(data);
							}
						}]
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
	
	$scope.adm_programa = function (usu) {
		$scope.programa = usu || $scope.programa;
		modalInstance   = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_programa'),
			size: 'sm',
			controller: 'programa_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_programa.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('principal/programa_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_programa.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_programa').unbind('click').on('click', function (e) {
		Table_programa.fnDraw(false);
	});
}

dashboardApp.controller('programa_ctrl', ['$scope', '$http', '$uibModalInstance', programa_ctrl]);

function programa_ctrl($scope, $http, $uibModalInstance) {
	$scope.programa = $scope.programa || {};
	$scope.ok       = function () {
		$scope.SAVING = true;
		var Programa     = Object.assign({}, $scope.programa);
		
		$http({
			url: CONST.URL('principal/ciclo_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Programa)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.programa.id_programa = data.data.data;
				$uibModalInstance.close($scope.programa);
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
	
}