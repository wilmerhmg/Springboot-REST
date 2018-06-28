dashboardApp.controller('personas_ctrl', ['$scope', '$http', '$uibModal', '$timeout', personas]);

function personas($scope, $http, $uibModal, $timeout) {

	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_persona"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_persona"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.persona    = {};

	var Table_Persona = $('#lista-personas').dataTable({
		"processing": true,
		"serverSide": true,
		"order": [[1, 'asc']],
		"ajax": {
			"url": CONST.BASE("persona/datatable"), "type": "POST"
		},
		"columns": [
			{data: 'num_doc_per', orderable: false}, {data: 'nom1_per', orderable: false},
			{data: 'ape1_per', orderable: false}, {data: 'cel_per', orderable: false}, {
				data: 'email_per',
				orderable: false
			},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}
		],
		rowCallback: function (row, data) {
			$(row).find('button.admin_persona').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.persona               = Object.assign({}, data);
					$scope.persona.fecha_nac_per = ($scope.persona.fecha_nac_per) ? $scope.persona.fecha_nac_per.toDate() : null;
					$scope.adm_persona();
				});
			});

			$(row).find('button.drop_persona').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');

				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar la persona: ' + data.nom1_per + '?, Este proceso es irreversible.',
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

	$scope.adm_persona = function (per) {
		$scope.persona = per || $scope.persona;
		modalInstance  = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('persona/form_persona.html'),
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

	$scope.eliminar = function (data) {
		$scope.SAVING = true;
		$http({
			url: CONST.BASE('persona/' + data.id_per),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'DELETE'
		}).then(function (data) {
			$scope.SAVING = false;
			Notify(data.data);
			Table_Persona.fnDraw(false);
		}, function (data) {
			console.log(data);
			$scope.SAVING = false;
		});
	};
}

dashboardApp.controller('persona_ctrl', ['$scope', '$http', '$uibModalInstance', '$timeout', 'AUX_TABLES', persona]);

function persona($scope, $http, $uibModalInstance, $timeout, AUX_TABLES) {
	$scope.tipos_doc = AUX_TABLES.tipo_doc;

	$scope.ok = function () {
		$scope.SAVING              = true;
		var Persona                = Object.assign({}, $scope.persona);
		Persona.fec_expedicion_doc = (Persona.fec_expedicion_doc) ? Persona.fec_expedicion_doc.getSimple() : "";
		Persona.fecha_nac_per      = (Persona.fecha_nac_per) ? Persona.fecha_nac_per.getSimple() : "";
		$http({
			url: CONST.BASE('persona' + (Persona.id_per ? "/" + Persona.id_per : '')),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: Persona.id_per ? 'PUT' : 'POST',
			data: $.param(Persona)
		}).then(function (data) {
			Notify(data.data);
			if(!data.data.error) {
				$uibModalInstance.close($scope.persona);
			}
			$scope.SAVING = false;
		}, function (data) {
			console.log(data);
			Notify(data.data)
			$scope.SAVING = false;
		});

	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.findPersona = function () {
		if($scope.persona.id_per && $scope.persona.num_doc_per.length) {
			return true;
		}
		$scope.SAVING = true;
		$http({
			url: CONST.BASE('persona/' + $scope.persona.num_doc_per),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'GET'
		}).then(function (data) {
			$scope.persona               = (!data.data.error) ? data.data : $scope.persona;
			$scope.persona.fecha_nac_per = ($scope.persona.fecha_nac_per) ? $scope.persona.fecha_nac_per.toDate() : null;
			$scope.SAVING                = false;
		}, function (data) {
			console.log(data);
			$scope.SAVING = false;
			Notify(data.data);
		});
	};

	$timeout(function () {
		$("#persona_mun_exp_doc_id, #persona_mun_res_per_id").select2({
			placeholder: "Buscar Municipio...", minimumInputLength: 2, multiple: false, ajax: {
				url: CONST.BASE("divipol/search"),
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
			}, initSelection: function (element, callback) {
				var id = $(element).val();
				if(id !== "") {
					$.ajax(CONST.BASE("divipol/" + id), {
						dataType: "json", type: 'GET',
					}).done(function (data) {
						callback(data);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid"><b>' + repo.nom_mpio + '</b></div><div class="row-fluid"><small><small>' + repo.nom_depto + '</small></small></div>';
				return markup;
			}, formatSelection: function (repo) {
				if($(this)[0].element[0].id.equals('persona_mun_res_per_id')) {
					$timeout(function () {
						$scope.persona.mun_res_per_id = $("#persona_mun_res_per_id").val();
					});
				} else {
					$timeout(function () {
						$scope.persona.mun_exp_doc_id = $("#persona_mun_exp_doc_id").val();
					});
				}
				return repo.nom_mpio;
			}
		});
	});

	$scope.$watch('persona.mun_res_per_id', function (newVal, oldVal) {
		$("#persona_mun_res_per_id").select2('val', newVal);
	});

	$scope.$watch('persona.mun_exp_doc_id', function (newVal, oldVal) {
		$("#persona_mun_exp_doc_id").select2('val', newVal);
	});
}