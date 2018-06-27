dashboardApp.controller('grupos_ctrl', ['$scope', '$http', '$timeout', '$uibModal', grupos_ctrl]);

function grupos_ctrl($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_grupo"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_grupo"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.grupo      = {};
	
	var Table_Grupos = $('#lista-grupos').dataTable({
		"processing": true,
		"serverSide": true,
		"order": [[0, 'asc']],
		"ajax": {
			"url": CONST.URL('investigacion/grupo_listar'), "type": "POST"
		},
		"columns": [{data: 'sigla_grupo'}, {data: 'nom_grupo'}, {data: 'full_name'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_grupo').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.grupo = Object.assign({}, data);
					$scope.adm_grupo();
				});
			});
			
			$(row).find('button.drop_grupo').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar el grupo: ' + data.sigla_grupo + '?. Este proceso es irreversible.',
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
	
	$scope.adm_grupo = function (usu) {
		$scope.grupo  = usu || $scope.grupo;
		modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_grupos'),
			size: 'lg',
			controller: 'grupo_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_Grupos.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('investigacion/grupo_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_Grupos.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_grupos').unbind('click').on('click', function (e) {
		Table_Grupos.fnDraw(false);
	});
}

dashboardApp.controller('grupo_ctrl', ['$scope', '$http', '$uibModalInstance', '$timeout', '$uibModal', grupo_ctrl]);

function grupo_ctrl($scope, $http, $uibModalInstance, $timeout, $uibModal) {
	$scope.tinymceOptions = {
		plugins: 'table lists link'
	};
	
	$scope.ok = function () {
		$scope.SAVING  = true;
		var Grupo      = Object.assign({}, $scope.grupo);
		$http({
			url: CONST.URL('investigacion/grupo_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Grupo)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.grupo.id_grupo = data.data.data;
				$uibModalInstance.close($scope.grupo);
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
		$("#grupo_director_id").select2({
			placeholder: "Buscar persona...", minimumInputLength: 2, multiple: false, ajax: {
				url: CONST.URL("personas/buscar_persona"),
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
					$.ajax(CONST.URL("personas/buscar_persona"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid"><b>' + repo.full_name.capitalize() + '</b></div><div class="row-fluid"><small><small>' + repo.id + '</small></small></div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.grupo.director_id = $("#grupo_director_id").val();
				});
				return repo.full_name;
			}
		});
	});
	
	$scope.$watch('grupo.director_id', function (newVal, oldVal) {
		$("#grupo_director_id").select2('val', newVal);
	});
	
	$scope.crear_persona = function () {
		$scope.persona = {};
		modalInstance  = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_persona'),
			controller: 'persona_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			$scope.grupo.director_id = response.ide_persona;
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	}
}