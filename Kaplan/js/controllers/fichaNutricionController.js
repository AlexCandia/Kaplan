﻿app.controller("fichaNutricionController", ['$scope', 'Notification', 'LoginService', '$location', 'tipoService', 'fichaService',
function ($scope, Notification, LoginService, $location, tipoService, fichaService) {
    if (!LoginService.getisAuthenticated() == true) {
        LoginService.getCerrarSesion();
        $location.path('cerrarsesion');
    } else {
        waitingDialog.show('Cargando Ficha...', { dialogSize: 'sm' });
        $scope.loading = true;
        $scope.TiposSintomatologia = true;

        $scope.StopLoading = function () {
            $scope.loading = !(!$scope.loadingTiposSintomatologia);
            if (!$scope.loading) { waitingDialog.hide(); }
        };

        if (parseInt(LoginService.getTipo()) == 6) {
            $scope.FormEditabe = false;
        } else {
            $scope.FormEditabe = true;
        };

        fichaService.getPlanesxRut(parseInt(fichaService.getRutPaciente())).then(function (result) {
            $scope.Planes = result.data;
            $scope.loadingPlanes = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Planes' };
            Notification.error(msg);
        });
        $scope.CambioPlan = function (plan) {
            if (typeof plan !== 'undefined') {
                fichaService.getSesionesxPlan(plan, 6).then(function (result) {
                    $scope.Sesiones = result.data;
                }, function (reason) {
                    msg = { title: 'Error Listar Planes' };
                    Notification.error(msg);
                });
            };
        };
        $scope.CambiarSesion = function (sesion) {
            if (typeof sesion !== 'undefined') {
                waitingDialog.show('Cargando Ficha...', { dialogSize: 'sm' });
                fichaService.getFichaPsicologiaxReserva(sesion).then(function (result) {
                    if (result.data.length !== 0) {
                        $scope.Ficha = result.data;
                        $scope.Ficha.FichaPsicologia.Sf36.FechaAIng = moment($scope.Ficha.FichaPsicologia.Sf36.FechaAIng);
                        $scope.Ficha.FichaPsicologia.Sf36.FechaAEgr = moment($scope.Ficha.FichaPsicologia.Sf36.FechaAEgr);
                        $scope.Ficha.FichaPsicologia.Sf36.FechaBIng = moment($scope.Ficha.FichaPsicologia.Sf36.FechaBIng);
                        $scope.Ficha.FichaPsicologia.Sf36.FechaBEgr = moment($scope.Ficha.FichaPsicologia.Sf36.FechaBEgr);
                        $scope.Ficha.FichaPsicologia.Had.FechaAIng = moment($scope.Ficha.FichaPsicologia.Had.FechaAIng);
                        $scope.Ficha.FichaPsicologia.Had.FechaAEgr = moment($scope.Ficha.FichaPsicologia.Had.FechaAEgr);
                        $scope.Ficha.FichaPsicologia.Had.FechaBIng = moment($scope.Ficha.FichaPsicologia.Had.FechaBIng);
                        $scope.Ficha.FichaPsicologia.Had.FechaBEgr = moment($scope.Ficha.FichaPsicologia.Had.FechaBEgr);
                        fichaService.getPaciente(parseInt(fichaService.getRutPaciente()), null).then(function (result) {
                            $scope.Paciente = result.data;
                            $scope.Paciente.Persona.FechaNac = moment($scope.Paciente.Persona.FechaNac);
                            $('#collapseDataPaciente').collapse('show');
                            waitingDialog.hide();
                        }, function (reason) {
                            msg = { title: 'Error Al cargar datos del paciente' };
                            Notification.error(msg);
                            $('#collapseDataPaciente').collapse('hide');
                            waitingDialog.hide();
                        });
                    } else {
                        $('#collapseDataPaciente').collapse('hide');
                        waitingDialog.hide();
                    };
                }, function (reason) {
                    if (reason.errorcode == 404) {
                        if (parseInt(LoginService.getTipo()) == 6) {
                            msg = { title: 'Sesion Sin Ficha, Complete la ficha para esta sesion' };
                            Notification.warning(msg);
                            fichaService.getPaciente(parseInt(fichaService.getRutPaciente()), null).then(function (result) {
                                $scope.Paciente = result.data;
                                $scope.Paciente.Persona.FechaNac = moment($scope.Paciente.Persona.FechaNac);
                                $scope.Ficha = { FichaKinesiologia: { Id: -1, IdReserva: sesion } };
                                $('#collapseDataPaciente').collapse('show');
                                waitingDialog.hide();
                            }, function (reason) {
                                msg = { title: 'Error Al cargar datos del paciente' };
                                Notification.error(msg);
                                $('#collapseDataPaciente').collapse('hide');
                                waitingDialog.hide();
                            });
                        } else {
                            msg = { title: 'Sesion Sin Ficha' };
                            Notification.warning(msg);
                            $('#collapseDataPaciente').collapse('hide');
                            waitingDialog.hide();
                        };
                    } else {
                        msg = { title: 'Error al Buscar Ficha' };
                        Notification.error(msg);
                        $('#collapseDataPaciente').collapse('hide');
                        waitingDialog.hide();
                    }
                });
            } else {
                $('#collapseDataPaciente').collapse('hide');
                waitingDialog.hide();
            };
        };
        $scope.ValidarForm = function () {
            var error = 0;
            var msg = 'Los siguientes campos son requeridos :<br>';
            $(':input[required]', '#frmPsicologia').each(function () {
                $(this).css('border', '1px solid #32b8da');
                if ($(this).val() == '') {
                    msg += '<br><b>' + $(this).attr('placeholder') + '</b>';
                    $(this).css('border', '2px solid #F57E7D');
                    /*if (error == 0) {
                        $(this).focus();
                        var tab = $(this).closest('.tab-pane').attr('id');
                        $('#myTab a[href="#' + tab + '"]').tab('show');
                    }*/
                    error = 1;
                }
            });
            if (error == 1) {
                msg = { title: 'Ups, faltan campos por completar', message: msg, delay: 5000 };
                Notification.warning(msg);
                return false;
            } else {
                return true;
            }
        }
        $scope.SaveFicha = function () {
            if ($scope.ValidarForm()) {
                $scope.Ficha.Fecha = moment($scope.Ficha.Fecha);
                $scope.Paciente.Persona.FechaNac = moment($scope.Paciente.Persona.FechaNac);
                $scope.Ficha.FichaPsicologia.IdEspecialista = parseInt(LoginService.getIdEspecialista())
                waitingDialog.show('Guardando Ficha...', { dialogSize: 'sm' });
                fichaService.SaveFichaPsicologia($scope.Ficha, $scope.Paciente)
                   .then(function (result) {
                       msg = { title: 'Ficha creada con éxito', message: "" };
                       Notification.success(msg);
                       waitingDialog.hide();
                       window.scrollTo(0, 0);
                       //$scope.CambiarSesion($scope.Sesion.Id);
                   }, function (reason) {
                       msg = { title: 'Error guardando Ficha' };
                       Notification.error(msg);
                       $scope.saving = false;
                       waitingDialog.hide();
                   });
            };
        }
        $scope.next = function () {
            $('.nav-tabs > .active').next('li').find('a').each(function () {
                $(this).attr("data-toggle", "tab");
            });
            $('.nav-tabs > .active').next('li').find('a').trigger('click');
        };
        $scope.previous = function () {
            $('.nav-tabs > .active').prev('li').find('a').trigger('click');
        };

        /*  Tipos   */
        tipoService.getTipoRegion().then(function (result) {
            $scope.TipoRegiones = result.data;
            $scope.loadingTipoRegion = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Region' };
            Notification.error(msg);
        });
        tipoService.getTipoComuna().then(function (result) {
            $scope.TipoComunas = result.data;
            $scope.loadingTipoComuna = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Comuna' };
            Notification.error(msg);
        });
        tipoService.getTipoAlergiaAlimentaria().then(function (result) {
            $scope.TipoAlergiaAlimentarias = result.data;
            $scope.loadingTipoAlergiaAlimentarias = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Alergia Alimentarias' };
            Notification.error(msg);
        });
        tipoService.getTipoAversionAlimentaria().then(function (result) {
            $scope.TipoAversionAlimentarias = result.data;
            $scope.loadingTipoAversionAlimentaria = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Aversión Alimentaria' };
            Notification.error(msg);
        });
        tipoService.getTipoAzucar().then(function (result) {
            $scope.TipoAzucares = result.data;
            $scope.loadingTipoAzucar = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Azucar' };
            Notification.error(msg);
        });
        tipoService.getTipoCarne().then(function (result) {
            $scope.TipoCarnes = result.data;
            $scope.loadingTipoCarne = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Carne' };
            Notification.error(msg);
        });
        tipoService.getTipoCribaje().then(function (result) {
            $scope.TipoCribajes = result.data;
            $scope.loadingTipoCribaje = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Cribaje' };
            Notification.error(msg);
        });
        tipoService.getTipoFruta().then(function (result) {
            $scope.TipoFrutas = result.data;
            $scope.loadingTipoFruta = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Fruta' };
            Notification.error(msg);
        });
        tipoService.getTipoIntoleranciaAlimentaria().then(function (result) {
            $scope.TipoIntoleranciaAlimentarias = result.data;
            $scope.loadingTipoIntoleranciaAlimentaria = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Intolerancia Alimentaria' };
            Notification.error(msg);
        });
        tipoService.getTipoLacteo().then(function (result) {
            $scope.TipoLacteos = result.data;
            $scope.loadingTipoLacteo = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Lacteo' };
            Notification.error(msg);
        });
        tipoService.getTipoLegumbre().then(function (result) {
            $scope.TipoLegumbres = result.data;
            $scope.loadingTipoLegumbre = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Legumbre' };
            Notification.error(msg);
        });
        tipoService.getTipoLiquido().then(function (result) {
            $scope.TipoLiquidos = result.data;
            $scope.loadingTipoLiquido = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Liquido' };
            Notification.error(msg);
        });
        tipoService.getTipoPescado().then(function (result) {
            $scope.TipoPescados = result.data;
            $scope.loadingTipoPescado = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Pescado' };
            Notification.error(msg);
        });
        tipoService.getTipoPreferenciaAlimentaria().then(function (result) {
            $scope.TipoPreferenciaAlimentarias = result.data;
            $scope.loadingTipoPreferenciaAlimentaria = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Preferencia Alimentaria' };
            Notification.error(msg);
        });
        tipoService.getTipoSodio().then(function (result) {
            $scope.TipoSodios = result.data;
            $scope.loadingTipoSodio = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Sodio' };
            Notification.error(msg);
        });
        tipoService.getTipoVerdura().then(function (result) {
            $scope.TipoVerduras = result.data;
            $scope.loadingTipoVerdura = false;
            $scope.StopLoading();
        }, function (reason) {
            msg = { title: 'Error Listar Tipo Verdura' };
            Notification.error(msg);
        });

        /*  Fin Tipos   */
    };
}]);