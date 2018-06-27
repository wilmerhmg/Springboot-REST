dashboardApp.controller('ciclos_ctrl', ['$scope', '$http', '$timeout', '$uibModal', ciclos_ctrl]);

function ciclos_ctrl($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_ciclo"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_ciclo"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.ciclo  = {};
	
	var Table_ciclo = $('#lista-ciclo').dataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		order: [[1, 'asc']],
		ajax: {
			url: CONST.URL('principal/ciclo_listar'), "type": "POST"
		},
		columns: [{data: 'abr'}, {data: 'des_nivel'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_ciclo').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.ciclo = Object.assign({}, data);
					$scope.adm_ciclo();
				});
			});
			
			$(row).find('button.drop_ciclo').on('click', function () {
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
	
	$scope.adm_ciclo = function (usu) {
		$scope.ciclo = usu || $scope.ciclo;
		modalInstance    = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_ciclo'),
			size: 'sm',
			controller: 'ciclo_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_ciclo.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('principal/ciclo_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_ciclo.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_ciclo').unbind('click').on('click', function (e) {
		Table_ciclo.fnDraw(false);
	});
}

dashboardApp.controller('ciclo_ctrl', ['$scope', '$http', '$uibModalInstance', ciclo_ctrl]);

function ciclo_ctrl($scope, $http, $uibModalInstance) {
	$scope.ciclo = $scope.ciclo || {};
	$scope.ok = function () {
		$scope.SAVING = true;
		var Ciclo      = Object.assign({}, $scope.ciclo);
		
		$http({
			url: CONST.URL('principal/ciclo_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Ciclo)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.ciclo.id_nivel = data.data.data;
				$uibModalInstance.close($scope.ciclo);
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