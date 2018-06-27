dashboardApp.controller('lineas_ctrl', ['$scope', '$http', '$timeout', '$uibModal', lineas_ctrl]);

function lineas_ctrl($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_linea"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_linea"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.linea      = {};
	
	var Table_linea = $('#lista-linea').dataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		order: [[0, 'asc'], [1, 'asc']],
		ajax: {
			url: CONST.URL('investigacion/linea_listar'), "type": "POST"
		},
		columns: [{data: 'nom_unidad'}, {data: 'abr'}, {data: 'nom_linea'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_linea').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.linea = Object.assign({}, data);
					$scope.adm_linea();
				});
			});
			
			$(row).find('button.drop_linea').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar la linea: ' + data.nom_linea + '?, Este proceso es irreversible.',
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
	
	$scope.adm_linea = function (usu) {
		$scope.linea  = usu || $scope.linea;
		modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_lineas'),
			size: 'md',
			controller: 'linea_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_linea.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('investigacion/linea_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_linea.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_linea').unbind('click').on('click', function (e) {
		Table_linea.fnDraw(false);
	});
}

dashboardApp.controller('linea_ctrl', ['$scope', '$http', '$uibModalInstance', '$timeout', linea_ctrl]);

function linea_ctrl($scope, $http, $uibModalInstance, $timeout) {
	$scope.linea = $scope.linea || {};
	$scope.tinymceOptions = {
		toolbar1: 'alignleft aligncenter alignright alignjustify  | numlist bullist',
		plugins:'lists',
		menubar: "format edit"
	};
	
	$scope.ok = function () {
		$scope.SAVING = true;
		var Linea     = Object.assign({}, $scope.linea);
		
		$http({
			url: CONST.URL('investigacion/linea_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Linea)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.linea.id_linea = data.data.data;
				$uibModalInstance.close($scope.linea);
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
		$("#linea_programa_id").select2({
			placeholder: "Buscar programa...", minimumInputLength: 0, multiple: false, ajax: {
				url: CONST.URL("principal/find2programa"),
				dataType: 'json',
				type: 'POST',
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
			}, initSelection: function (element, callback) {
				var id = $(element).val();
				if (id !== "") {
					$.ajax(CONST.URL("principal/find2programa"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid"><b>' + repo.des_programa + '</b></div><div class="row-fluid"><small><small>' + repo.des_nivel.capitalize() + '</small></small></div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.linea.programa_id = repo.id;
				});
				return repo.des_programa;
			}
		});
	});
	
	$scope.$watch('linea.programa_id', function (newVal, oldVal) {
		$("#linea_programa_id").select2('val', newVal);
	});
	
}