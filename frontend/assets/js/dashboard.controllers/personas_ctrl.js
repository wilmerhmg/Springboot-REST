dashboardApp.controller('personas_ctrl', ['$scope', '$http', '$uibModal', '$timeout', personas]);

function personas($scope, $http, $uibModal, $timeout) {
	
	var btn_admin     = '<button type="button" class="btn btn-primary btn-xs admin_persona"><li class="glyphicon glyphicon-edit"></li></button>';
	var modalInstance = {};
	$scope.persona    = {};
	
	var Table_Persona = $('#lista-personas').dataTable({
		"processing": true,
		"serverSide": true,
		"order": [[1, 'asc']],
		"ajax": {
			"url": CONST.URL('personas/listar'), "type": "POST"
		},
		"columns": [{data: 'ide_persona'}, {data: 'full_name'}, {data: 'cel_persona'}, {data: 'email_persona'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_persona').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.persona                    = Object.assign({}, data);
					$scope.persona.fec_expedicion_doc = ($scope.persona.fec_expedicion_doc) ? $scope.persona.fec_expedicion_doc.toDate() : null;
					$scope.persona.fech_nac_persona   = ($scope.persona.fech_nac_persona) ? $scope.persona.fech_nac_persona.toDate() : null;
					$scope.adm_persona();
				});
			});
		}
	});
	
	$scope.adm_persona = function (per) {
		$scope.persona = per || $scope.persona;
		modalInstance  = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_persona'),
			controller: 'persona_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_Persona.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$('.actualizar_personas').unbind('click').on('click', function (e) {
		Table_Persona.fnDraw(false);
	});
}

dashboardApp.controller('persona_ctrl', ['$scope', '$http', '$uibModalInstance', '$timeout', persona]);

function persona($scope, $http, $uibModalInstance, $timeout) {
	$scope.ok = function () {
		$scope.SAVING              = true;
		var Persona                = Object.assign({}, $scope.persona);
		Persona.fec_expedicion_doc = (Persona.fec_expedicion_doc) ? Persona.fec_expedicion_doc.getSimple() : "";
		Persona.fech_nac_persona   = (Persona.fech_nac_persona) ? Persona.fech_nac_persona.getSimple() : "";
		
		$http({
			url: CONST.URL('personas/guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Persona)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$uibModalInstance.close($scope.persona);
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
	
	$scope.findPersona = function () {
		if ($scope.persona.uid && $scope.persona.ide_persona.length) {
			return true;
		}
		$scope.SAVING = true;
		$http({
			url: CONST.URL('personas/find'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param({term: $scope.persona.ide_persona})
		}).then(function (data) {
			console.log(data.data);
			$scope.persona                    = (data.data.data) ? data.data.data : $scope.persona;
			$scope.persona.fec_expedicion_doc = ($scope.persona.fec_expedicion_doc) ? $scope.persona.fec_expedicion_doc.toDate() : null;
			$scope.persona.fech_nac_persona   = ($scope.persona.fech_nac_persona) ? $scope.persona.fech_nac_persona.toDate() : null;
			$scope.SAVING                     = false;
		}, function (data) {
			console.log(data);
			
			$scope.SAVING = false;
		});
	};
	
	$timeout(function () {
		$("#persona_cod_mun_exp, #persona_cod_mun_nacimiento").select2({
			placeholder: "Buscar Municipio...", minimumInputLength: 2, multiple: false, ajax: {
				url: CONST.URL("personas/ajax_buscar_mpio"),
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
					$.ajax(CONST.URL("personas/ajax_buscar_mpio"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid"><b>' + repo.nom_municipio.capitalize() + '</b></div><div class="row-fluid"><small><small>' + repo.ref.capitalize() + '</small></small></div>';
				return markup;
			}, formatSelection: function (repo) {
				if ($(this)[0].element[0].id.equals('persona_cod_mun_nacimiento')) {
					$timeout(function () {
						$scope.persona.cod_mun_nacimiento = $("#persona_cod_mun_nacimiento").val();
					});
				} else {
					$timeout(function () {
						$scope.persona.cod_mun_exp = $("#persona_cod_mun_exp").val();
					});
				}
				return repo.nombre;
			}
		});
	});
	
	$scope.$watch('persona.cod_mun_nacimiento', function (newVal, oldVal) {
		$("#persona_cod_mun_nacimiento").select2('val', newVal);
	});
	
	$scope.$watch('persona.cod_mun_exp', function (newVal, oldVal) {
		$("#persona_cod_mun_exp").select2('val', newVal);
	});
}