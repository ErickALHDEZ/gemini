(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PrincipalCapacitandosController', PrincipalCapacitandosController);

    PrincipalCapacitandosController.$inject = ['$scope', '$stateParams', '$modal', 'tablaDatosService', 'CatalogoUnidadesAdmtvas', 'Capacitandos', 'ControlProcesos'];

    function PrincipalCapacitandosController($scope, $stateParams, $modal, tablaDatosService, CatalogoUnidadesAdmtvas, Capacitandos, ControlProcesos ) {

        var vm = this;

        vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
        vm.limpiaBusqueda             = limpiaBusqueda;

        vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
        vm.cambiarPagina              = cambiarPagina;

        vm.nuevoCapacitando           = nuevoCapacitando;
        vm.editaCapacitando           = editaCapacitando;
        vm.muestraCapacitando         = muestraCapacitando;
        vm.eliminaCapacitando         = eliminaCapacitando;

        vm.opcionBuscar = 'nombre';
        vm.mostrarbtnLimpiar = false;
        vm.cadena_buscar = '';

        vm.listaCapacitandos = [];
        vm.personaSeleccionada = {};

        vm.tablalListaCapacitados = {
            totalElementos     : 0,
            paginaActual       : 1,
            registrosPorPagina : 10,
            inicio             : 0,
            fin                : 1,
            condicion          : {},
            filtro_datos       : {},
            fila_seleccionada  : 0
        };

        inicia();

        function inicia() {
                
                vm.tablalListaCapacitados.filtro_datos = {
                        filter: {
                            where: vm.tablalListaCapacitados.condicion,
                            order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC','curp ASC','idAlumno ASC'],
                            limit: vm.tablalListaCapacitados.registrosPorPagina,
                            skip: vm.tablalListaCapacitados.paginaActual - 1,
                            include: [
                                {
                                    relation: 'localidad_pertenece',
                                    scope: {
                                    fields: ['nombre']
                                    }
                                },
                                {
                                    relation: 'unidad_pertenece',
                                    scope: {
                                    fields: ['nombre']
                                    }
                                },
                                {
                                    relation: 'inscripcionesCursos',
                                    scope: {
                                        fields:['id','pagado','idAlumno','idCurso','calificacion','numDocAcreditacion'],
                                        include:{
                                            relation: 'CursosOficiales',
                                            scope: {
                                                //where: {formacion: false},
                                                fields:['nombreCurso','fechaInicio','fechaFin','estatus', 'fechaInicioOriginal','fechaFinOriginal'],
                                                order: ['fechaInicio ASC']
                                            }
                                        }
                                    }
                                },
                                {
                                    relation: 'inscripcionesEvaluaciones',
                                    scope: {
                                        fields:['id','pagado','idAlumno','idEvaluacion','calificacion','numDocAcreditacion'],
                                        include:{
                                            relation: 'Evaluaciones',
                                            scope: {
                                                fields:['tipoEvaluacion','nombreEvaluacion','codigoEstandar','nombreEstandar','fechaEvaluacion','fechaEvaluacionReal','estatus'],
                                                order: ['fechaEvaluacion ASC']
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                };

                vm.client = 1;
                vm.tablalListaCapacitados.paginaActual = 1;
                vm.tablalListaCapacitados.inicio = 0;
                vm.tablalListaCapacitados.fin = 1;

                vm.listaCapacitandos = {};
                tablaDatosService.obtiene_datos_tabla(Capacitandos, vm.tablalListaCapacitados)
                .then(function(respuesta) {

                    vm.tablalListaCapacitados.totalElementos = respuesta.total_registros;
                    vm.tablalListaCapacitados.inicio = respuesta.inicio;
                    vm.tablalListaCapacitados.fin = respuesta.fin;

                    if(vm.tablalListaCapacitados.totalElementos > 0)
                    {
                        vm.listaCapacitandos = respuesta.datos;
                        vm.personaSeleccionada = vm.listaCapacitandos[0];
                        vm.client = 2;
                        vm.tablalListaCapacitados.fila_seleccionada = 0;
                        muestraDatosRegistroActual(vm.personaSeleccionada);
                    }
                });

        };

        function muestraResultadosBusqueda() {

                vm.client = 1;
                vm.listaCapacitandos = {};
                vm.personaSeleccionada = {};
                vm.tablalListaCapacitados.fila_seleccionada = undefined;
                vm.tablalListaCapacitados.paginaActual = 1;
                vm.tablalListaCapacitados.inicio = 0;
                vm.tablalListaCapacitados.fin = 1;
                vm.mostrarbtnLimpiar = true;

                if(vm.opcionBuscar == 'nombre'){
                    vm.tablalListaCapacitados.condicion = {nombreCompleto: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}};
                }
                else if(vm.opcionBuscar == 'numcontrol'){
                    vm.tablalListaCapacitados.condicion = {numControl: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}};
                }
                else if(vm.opcionBuscar == 'curp'){
                    vm.tablalListaCapacitados.condicion = {curp: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}};
                }

                tablaDatosService.obtiene_datos_tabla(Capacitandos, vm.tablalListaCapacitados)
                .then(function(respuesta) {

                    vm.tablalListaCapacitados.totalElementos = respuesta.total_registros;
                    vm.tablalListaCapacitados.inicio = respuesta.inicio;
                    vm.tablalListaCapacitados.fin = respuesta.fin;

                    if(vm.tablalListaCapacitados.totalElementos > 0)
                    {
                        vm.listaCapacitandos = respuesta.datos;
                        vm.personaSeleccionada = vm.listaCapacitandos[0];
                        vm.client = 2;
                        vm.tablalListaCapacitados.fila_seleccionada = 0;
                        muestraDatosRegistroActual(vm.personaSeleccionada);
                    }
                });

        };

        function limpiaBusqueda() {

                vm.mostrarbtnLimpiar = false;
                vm.cadena_buscar = '';
                vm.client = 1;
                vm.listaCapacitandos = {};
                vm.personaSeleccionada = {};
                vm.tablalListaCapacitados.fila_seleccionada = undefined;
                vm.tablalListaCapacitados.paginaActual = 1;
                vm.tablalListaCapacitados.inicio = 0;
                vm.tablalListaCapacitados.fin = 1;

                vm.tablalListaCapacitados.condicion = {};

                tablaDatosService.obtiene_datos_tabla(Capacitandos, vm.tablalListaCapacitados)
                .then(function(respuesta) {

                    vm.tablalListaCapacitados.totalElementos = respuesta.total_registros;
                    vm.tablalListaCapacitados.inicio = respuesta.inicio;
                    vm.tablalListaCapacitados.fin = respuesta.fin;

                    if(vm.tablalListaCapacitados.totalElementos > 0)
                    {
                        vm.listaCapacitandos = respuesta.datos;
                        vm.personaSeleccionada = vm.listaCapacitandos[0];
                        vm.client = 2;
                        vm.tablalListaCapacitados.fila_seleccionada = 0;
                        muestraDatosRegistroActual(vm.personaSeleccionada);
                    }
                });

        };

        function muestraDatosRegistroActual(seleccion) {

                var index = vm.listaCapacitandos.indexOf(seleccion);
                vm.personaSeleccionada = seleccion;
                vm.client = 2;
                vm.tablalListaCapacitados.fila_seleccionada = index;
        };

        function cambiarPagina() {

                if(vm.tablalListaCapacitados.totalElementos > 0)
                {
                    tablaDatosService.cambia_pagina(Capacitandos, vm.tablalListaCapacitados)
                    .then(function(respuesta) {

                        vm.tablalListaCapacitados.inicio = respuesta.inicio;
                        vm.tablalListaCapacitados.fin = respuesta.fin;

                        vm.listaCapacitandos = respuesta.datos;
                        vm.personaSeleccionada = vm.listaCapacitandos[0];
                        vm.client = 2;
                        vm.tablalListaCapacitados.fila_seleccionada = 0;
                        muestraDatosRegistroActual(vm.personaSeleccionada);
                    });
                }
        };

        function editaCapacitando(seleccion) {

                var modalInstance = $modal.open({
                    templateUrl: 'app/components/capacitandos/modal-datos-capacitando.html',
                    //windowClass: "animated fadeIn",
                    controller: 'ModalEditaCapacitandoController as vm',
                    windowClass: 'app-modal-window',
                    resolve: {
                        registroEditar: function () { return seleccion }
                    }

                });

                modalInstance.result.then(function (respuesta) {

                    vm.personaSeleccionada.numControl          = respuesta.numControl;
                    vm.personaSeleccionada.apellidoPaterno     = respuesta.apellidoPaterno;
                    vm.personaSeleccionada.apellidoMaterno     = respuesta.apellidoMaterno;
                    vm.personaSeleccionada.nombre              = respuesta.nombre;
                    vm.personaSeleccionada.email               = respuesta.email;
                    vm.personaSeleccionada.telefono            = respuesta.telefono;
                    vm.personaSeleccionada.celular             = respuesta.celular;
                    vm.personaSeleccionada.domicilio           = respuesta.domicilio;
                    vm.personaSeleccionada.numeroExt           = respuesta.numeroExt;
                    vm.personaSeleccionada.cruzamientos        = respuesta.cruzamientos;
                    vm.personaSeleccionada.sexo                = respuesta.sexo;
                    vm.personaSeleccionada.diaNacimiento       = respuesta.diaNacimiento;
                    vm.personaSeleccionada.mesNacimiento       = respuesta.mesNacimiento;
                    vm.personaSeleccionada.anioNacimiento      = respuesta.anioNacimiento;
                    vm.personaSeleccionada.edad                = respuesta.edad;
                    vm.personaSeleccionada.curp                = respuesta.curp;
                    vm.personaSeleccionada.colonia             = respuesta.colonia;
                    vm.personaSeleccionada.codigoPostal        = respuesta.codigoPostal;
                    vm.personaSeleccionada.idLocalidad         = respuesta.idLocalidad;
                    vm.personaSeleccionada.idNivelEstudios     = respuesta.idNivelEstudios;
                    vm.personaSeleccionada.estadoCivil         = respuesta.estadoCivil;
                    vm.personaSeleccionada.foto                = respuesta.foto;
                    vm.personaSeleccionada.disVisual           = respuesta.disVisual;
                    vm.personaSeleccionada.disAuditiva         = respuesta.disAuditiva;
                    vm.personaSeleccionada.disLenguaje         = respuesta.disLenguaje;
                    vm.personaSeleccionada.disMotriz           = respuesta.disMotriz;
                    vm.personaSeleccionada.disMental           = respuesta.disMental;
                    vm.personaSeleccionada.disOtro             = respuesta.disOtro;
                    vm.personaSeleccionada.enfermedadPadece    = respuesta.enfermedadPadece;
                    vm.personaSeleccionada.enfermedadCual      = respuesta.enfermedadCual;
                    vm.personaSeleccionada.tutorNombre         = respuesta.tutorNombre;
                    vm.personaSeleccionada.tutorCurp           = respuesta.tutorCurp;
                    vm.personaSeleccionada.tutorEmail          = respuesta.tutorEmail;
                    vm.personaSeleccionada.tutorParentesco     = respuesta.tutorParentesco;
                    vm.personaSeleccionada.tutorDireccion      = respuesta.tutorDireccion;
                    vm.personaSeleccionada.tutorTelefono       = respuesta.tutorTelefono;
                    vm.personaSeleccionada.docActaNacimiento   = respuesta.docActaNacimiento;
                    vm.personaSeleccionada.docCompEstudios     = respuesta.docCompEstudios;
                    vm.personaSeleccionada.docIdentOficial     = respuesta.docIdentOficial;
                    vm.personaSeleccionada.docConstCurp        = respuesta.docConstCurp;
                    vm.personaSeleccionada.docFotografias      = respuesta.docFotografias;
                    vm.personaSeleccionada.docCompMigratorio   = respuesta.docCompMigratorio;
                    vm.personaSeleccionada.docCompDomicilio    = respuesta.docCompDomicilio;
                    vm.personaSeleccionada.docCurpTutor        = respuesta.docCurpTutor;
                    vm.personaSeleccionada.trabajaActualmente  = respuesta.trabajaActualmente;
                    vm.personaSeleccionada.idActividad         = respuesta.idActividad;
                    vm.personaSeleccionada.empresaTrabaja      = respuesta.empresaTrabaja;
                    vm.personaSeleccionada.empresaPuesto       = respuesta.empresaPuesto;
                    vm.personaSeleccionada.empresaAntiguedad   = respuesta.empresaAntiguedad;
                    vm.personaSeleccionada.empresaDireccion    = respuesta.empresaDireccion;
                    vm.personaSeleccionada.empresaTelefono     = respuesta.empresaTelefono;
                    vm.personaSeleccionada.idExperiencia       = respuesta.idExperiencia;
                    vm.personaSeleccionada.idMedio             = respuesta.idMedio;
                    vm.personaSeleccionada.idMotivo            = respuesta.idMotivo;
                    vm.personaSeleccionada.idGrupoPertenece    = respuesta.idGrupoPertenece;
                    vm.personaSeleccionada.gpoJefasFamilia     = respuesta.gpoJefasFamilia;
                    vm.personaSeleccionada.gpoSitViolencia     = respuesta.gpoSitViolencia;
                    vm.personaSeleccionada.gpoAdolCalle        = respuesta.gpoAdolCalle;
                    vm.personaSeleccionada.gpoIndigenas        = respuesta.gpoIndigenas;
                    vm.personaSeleccionada.gpoAdultoMayor      = respuesta.gpoAdultoMayor;
                    vm.personaSeleccionada.gpoLgbttti          = respuesta.gpoLgbttti;
                    vm.personaSeleccionada.gpoDentroCereso     = respuesta.gpoDentroCereso;
                    vm.personaSeleccionada.gpoCapDiferentes    = respuesta.gpoCapDiferentes;
                    vm.personaSeleccionada.gpoMenorReadap      = respuesta.gpoMenorReadap;
                    vm.personaSeleccionada.gpoFueraCereso      = respuesta.gpoFueraCereso;
                    vm.personaSeleccionada.registroRemoto      = respuesta.registroRemoto;
                    vm.personaSeleccionada.fechaRegistro       = respuesta.fechaRegistro;
                    vm.personaSeleccionada.ultimaActualizacion = respuesta.ultimaActualizacion;

                }, function () {
                });

        };

        function muestraCapacitando(seleccion) {

            var modalInstance = $modal.open({
                templateUrl: 'app/components/capacitandos/modal-datos-capacitando.html',
                //windowClass: "animated fadeIn",
                controller: 'ModalVisualizaCapacitandoController as vm',
                windowClass: 'app-modal-window',
                resolve: {
                    registroEditar: function () { return seleccion }
                }

            });

            modalInstance.result.then(function () {
            }, function () {
            });

        };

        function nuevoCapacitando() {

                var modalInstance = $modal.open({
                    templateUrl: 'app/components/capacitandos/modal-datos-capacitando.html',
                    //windowClass: "animated fadeIn",
                    controller: 'ModalNuevoCapacitandoController as vm',
                    windowClass: 'app-modal-window'
                });

                modalInstance.result.then(function () {
                    vm.limpiaBusqueda();
                }, function () {
                });

        };

        function eliminaCapacitando(seleccion) {

                Capacitandos.inscripcionesCursos.count({ id: seleccion.idAlumno })
                .$promise
                .then(function(resultado) {
                    if(resultado.count > 0)
                    {
                            swal({
                            title: 'Error',
                            html: 'No se puede eliminar el capacitando seleccionado porque ya se encuentra registrado en alg&uacute;n curso',
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonColor: "#9a0000",
                            confirmButtonText: "Aceptar"
                            });
                    }
                    else
                    {

                            swal({
                            title: "Confirmar",
                            html: 'Se eliminar&aacute; al capacitando <strong>'+ seleccion.apellidoPaterno + ' ' + seleccion.apellidoMaterno + ' ' + seleccion.nombre  +'</strong>, ¿Continuar?',
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#9a0000",
                            confirmButtonText: "Aceptar",
                            cancelButtonText: "Cancelar",
                            closeOnConfirm: false,
                            closeOnCancel: true
                            }, function(){
                                    swal.disableButtons();

                                    Capacitandos.deleteById({ id: seleccion.idAlumno })
                                    .$promise
                                    .then(function() { 
                                        vm.limpiaBusqueda();
                                        swal('Capacitando eliminado', '', 'success');
                                    });

                            });
                    }
                });

        };
            

    };

})();