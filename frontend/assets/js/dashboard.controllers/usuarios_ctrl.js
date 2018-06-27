dashboardApp.controller('usuarios_ctrl', ['$scope', '$http', '$uibModal', '$timeout', usuarios]);

function usuarios($scope, $http, $uibModal, $timeout) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_usuario"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_usuario"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.usuario    = {};
	
	var Table_Usuarios = $('#lista-usuarios').dataTable({
		"processing": true,
		"serverSide": true,
		"order": [[1, 'asc']],
		"ajax": {
			"url": CONST.URL('usuarios/listar'), "type": "POST"
		},
		"columns": [{data: 'login'}, {data: 'full_name'}, {data: 'email_persona'}, {data: 'rol'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_usuario').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.usuario = Object.assign({}, data);
					$scope.adm_usuario();
				});
			});
			
			$(row).find('button.drop_usuario').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar el usuario: ' + data.login + '?, Este proceso es irreversible.',
					icon: 'glyphicon glyphicon-question-sign',
					hide: false,
					styling: 'bootstrap3',
					confirm: {
						confirm: true, buttons: [{
							text: 'Cancelar', addClass: 'pull-left', click: function (notice) {
								notice.remove()
							}
						}, {
							text: 'Eliminar', click: function (notice) {
								notice.remove()
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
	
	$scope.adm_usuario = function (usu) {
		$scope.usuario = usu || $scope.usuario;
		modalInstance  = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_usuario'),
			size: 'sm',
			controller: 'usuario_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_Usuarios.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('usuarios/eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_Usuarios.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_usuarios').unbind('click').on('click', function (e) {
		Table_Usuarios.fnDraw(false);
	});
}

dashboardApp.controller('usuario_ctrl', ['$scope', '$http', '$uibModalInstance', '$timeout', '$uibModal', usuario]);

function usuario($scope, $http, $uibModalInstance, $timeout, $uibModal) {
	$scope.usuario.clave = ($scope.usuario.id_usuario) ? 'A' : 'B';
	$scope.ok            = function () {
		$scope.SAVING              = true;
		var Usuario                = Object.assign({}, $scope.usuario);
		Usuario.fec_expedicion_doc = (Usuario.fec_expedicion_doc) ? Usuario.fec_expedicion_doc.getSimple() : "";
		Usuario.fech_nac_Usuario   = (Usuario.fech_nac_Usuario) ? Usuario.fech_nac_persona.getSimple() : "";
		
		$http({
			url: CONST.URL('usuarios/guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Usuario)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$uibModalInstance.close($scope.usuario);
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
		$("#usuario_persona_id").select2({
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
					$scope.usuario.persona_id = $("#usuario_persona_id").val();
				});
				return repo.full_name;
			}
		});
	});
	
	$scope.$watch('usuario.persona_id', function (newVal, oldVal) {
		$("#usuario_persona_id").select2('val', newVal);
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
			$scope.usuario.persona_id = response.ide_persona;
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	}
	
}