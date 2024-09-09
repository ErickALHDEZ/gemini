(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNuevoCapacitandoController', ModalNuevoCapacitandoController);

        ModalNuevoCapacitandoController.$inject = ['$scope', '$timeout', '$modalInstance', 'Capacitandos', 'CatalogoLocalidades', 'CatalogoNivelEstudios', 'CatalogoActividades', 'CatalogoExperiencias', 'CatalogoMedios', 'CatalogoMotivos'];

    function ModalNuevoCapacitandoController($scope, $timeout, $modalInstance, Capacitandos, CatalogoLocalidades, CatalogoNivelEstudios, CatalogoActividades, CatalogoExperiencias, CatalogoMedios, CatalogoMotivos) {

            var vm = this;

            vm.calculaNacim = calculaNacim;
            vm.guardar      = guardar;
            vm.curpValida   = curpValida;
            vm.transformarCadenaPaterno  = transformarCadenaPaterno;
            vm.transformarCadenaMaterno  = transformarCadenaMaterno;
            vm.transformarCadenaNombres  = transformarCadenaNombres;

            vm.mostrarNumControl = true;
            vm.soloLecturaNumControl = false;
            vm.soloLectura = false;
            vm.mostrarSpiner = false;
            vm.mostrar_msg_error = false;
            vm.mensaje = '';
            vm.mostrar_msg_curp  = false;
            vm.color_msg_curp    = "success"; 
            vm.mensaje_curp      = ""; 
            //vm.correoCompartido = false;

            vm.listaLocalidades = [];
            vm.listaNivelEstudios = [];
            vm.listaActividades = [];
            vm.listaExperiencia = [];
            vm.listaMedios = [];
            vm.listaMotivos = [];

            vm.registroEditar = {
                idUnidadAdmtva      : $scope.currentUser.unidad_pertenece_id,
                numControl          : '',
                apellidoPaterno     : '',
                apellidoMaterno     : '',
                nombre              : '',
                sexo                : '',
                email               : '',
                diaNacimiento       : '',
                mesNacimiento       : '',
                anioNacimiento      : '',
                edad                : '',
                telefono            : '',
                celular             : '',
                curp                : '',
                domicilio           : '',
                numeroExt           : '',
                cruzamientos        : '',
                colonia             : '',
                codigoPostal        : '',
                idLocalidad         : 0,
                idNivelEstudios     : 0,
                estadoCivil         : '',
                foto                : '',
                disVisual           : false,
                disAuditiva         : false,
                disLenguaje         : false,
                disMotriz           : false,
                disMental           : false,
                disOtro             : '',
                enfermedadPadece    : '',
                enfermedadCual      : '',
                tutorNombre         : '',
                tutorCurp           : '',
                tutorEmail          : '',
                tutorParentesco     : '',
                tutorDireccion      : '',
                tutorTelefono       : '',
                docActaNacimiento   : false,
                docCompEstudios     : false,
                docIdentOficial     : false,
                docConstCurp        : false,
                docFotografias      : false,
                docCompMigratorio   : false,
                docCompDomicilio    : false,
                docCurpTutor        : false,
                docIneTutor         : false,
                trabajaActualmente  : '',
                idActividad         : 0,
                empresaTrabaja      : '',
                empresaPuesto       : '',
                empresaAntiguedad   : '',
                empresaDireccion    : '',
                empresaTelefono     : '',
                idExperiencia       : 0,
                idMedio             : 0,
                idMotivo            : 0,
                idGrupoPertenece    : 0,
                gpoJefasFamilia     : false,
                gpoSitViolencia     : false,
                gpoAdolCalle        : false,
                gpoIndigenas        : false,
                gpoAdultoMayor      : false,
                gpoLgbttti          : false,
                gpoDentroCereso     : false,
                gpoCapDiferentes    : false,
                gpoMenorReadap      : false,
                gpoFueraCereso      : false,
                registroRemoto      : false,
                fechaRegistro       : '',
                ultimaActualizacion : ''
            };

            vm.temp = {};

            inicia();

            function inicia() {

                CatalogoLocalidades.find({
                    filter: {
                        fields: ['idLocalidad','nombre'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaLocalidades = resp;
                });

                CatalogoNivelEstudios.find()
                .$promise
                .then(function(resp) {
                    vm.listaNivelEstudios = resp;
                });
        
                CatalogoActividades.find()
                .$promise
                .then(function(resp) {
                    vm.listaActividades = resp;
                });
        
                CatalogoExperiencias.find()
                .$promise
                .then(function(resp) {
                    vm.listaExperiencia = resp;
                });
        
                CatalogoMedios.find()
                .$promise
                .then(function(resp) {
                    vm.listaMedios = resp;
                });
        
                CatalogoMotivos.find()
                .$promise
                .then(function(resp) {
                    vm.listaMotivos = resp;
                });
        
            };

            function calculaNacim() {
                
                if(vm.registroEditar.curp == undefined)
                    return;

                if (curpValida(vm.registroEditar.curp.toUpperCase())) { // ?? Acá se comprueba
                    vm.mensaje_curp     = "CURP válido";
                    vm.color_msg_curp   = "success";
                    vm.mostrar_msg_curp = true;
                } 
                else {
                    vm.mensaje_curp     = "CURP no válido";
                    vm.color_msg_curp   = "danger";
                    vm.mostrar_msg_curp = true;
                }

                if(vm.registroEditar.curp.length >= 10)
                {
                    var error_fecha = false;

                    if( isNaN(Number(vm.registroEditar.curp.substr(4,2))))
                        error_fecha = true;
                    else if( isNaN(Number(vm.registroEditar.curp.substr(6,2))) )
                        error_fecha = true;
                    else if(isNaN(Number(vm.registroEditar.curp.substr(8,2))) )
                        error_fecha = true;

                    if(error_fecha == true)
                    {
                        vm.mostrar_msg_error = true;
                        vm.mensaje = 'La fecha de nacimiento dentro de la CURP es incorrecta';
                        vm.registroEditar.edad = '';
                        $timeout(function(){
                            vm.mostrar_msg_error = false;
                            vm.mensaje = '';
                        }, 2000);
                    }
                    else
                    {
                        var fechaHoy = new Date();
                        var anioHoy = fechaHoy.getFullYear();

                        var anio = parseInt(vm.registroEditar.curp.substr(4,2)) + 2000;
                        if( (anioHoy - anio) < 0)
                            var anio = parseInt(vm.registroEditar.curp.substr(4,2)) + 1900;

                        var mes = parseInt(vm.registroEditar.curp.substr(6,2));
                        var dia = parseInt(vm.registroEditar.curp.substr(8,2));

                        var fechaNacimiento = new Date(anio,(mes-1),dia);
                        
                        var edad = fechaHoy.getFullYear()- fechaNacimiento.getFullYear() - 1; 
                        
                        if(fechaHoy.getMonth() + 1 - mes > 0) 
                            edad++;
        
                        if( (fechaHoy.getDate() - dia >= 0) && (fechaHoy.getMonth() + 1 - mes == 0) ) 
                            edad++;

                        vm.registroEditar.edad = edad;
                        vm.registroEditar.anioNacimiento = anio.toString();
                        vm.registroEditar.mesNacimiento  = vm.registroEditar.curp.substr(6,2);
                        vm.registroEditar.diaNacimiento  = vm.registroEditar.curp.substr(8,2);
                        vm.registroEditar.sexo           = vm.registroEditar.curp.substr(10,1);

                    }
                }
            };

            function guardar() {

                vm.mostrarSpiner = true;

                if( vm.registroEditar.edad == '' )
                {
                    vm.mostrarSpiner = false;
                    vm.mostrar_msg_error = true;
                    vm.mensaje = 'La fecha de nacimiento dentro de la CURP es incorrecta';
                    $timeout(function(){
                         vm.mostrar_msg_error = false;
                         vm.mensaje = '';
                    }, 3000);
                    return;
                }
                vm.registroEditar.curp = vm.registroEditar.curp.toUpperCase();
                Capacitandos.count({
                    where: {curp: vm.registroEditar.curp}
                })
                .$promise
                .then(function(resp) {
                    
                    if(resp.count > 0)
                    {
                        vm.mostrarSpiner = false;
                        vm.mostrar_msg_error = true;
                        vm.mensaje = 'El CURP ya se encuentra registrado';
                        $timeout(function(){
                                vm.mostrar_msg_error = false;
                                vm.mensaje = '';
                        }, 3000);

                    }
                    else
                    {
                        Capacitandos.find({
                            filter: {
                                where: {
                                    and: [
                                        {numControl: vm.registroEditar.numControl},
                                        {numControl: {neq: ''}}
                                    ]
                                },
                                include: [{
                                        relation: 'unidad_pertenece',
                                        scope: {
                                        fields: ['nombre']
                                        }
                                }]                                                       
                            }
                        })
                        .$promise
                        .then(function(resp) {

                            if(resp.length > 0)
                            {
                                vm.mostrarSpiner = false;
                                vm.mostrar_msg_error = true;
                                vm.mensaje = 'El número de control ya se encuentra asignado a: '+ resp[0].nombreCompleto + ', registrado en la ' + resp[0].unidad_pertenece.nombre;
                                $timeout(function(){
                                        vm.mostrar_msg_error = false;
                                        vm.mensaje = '';
                                }, 5000);

                            }
                            else
                            {
                                vm.registroEditar.ultimaActualizacion =  Date();

                                Capacitandos.create(
                                {
                                    idUnidadAdmtva      : vm.registroEditar.idUnidadAdmtva,
                                    numControl          : vm.registroEditar.numControl.trim(),
                                    apellidoPaterno     : vm.registroEditar.apellidoPaterno,
                                    apellidoMaterno     : vm.registroEditar.apellidoMaterno,
                                    nombre              : vm.registroEditar.nombre,
                                    nombreCompleto      : vm.registroEditar.apellidoPaterno + ' ' + vm.registroEditar.apellidoMaterno + ' ' + vm.registroEditar.nombre,
                                    sexo                : vm.registroEditar.sexo,
                                    email               : vm.registroEditar.email,
                                    diaNacimiento       : vm.registroEditar.diaNacimiento,
                                    mesNacimiento       : vm.registroEditar.mesNacimiento,
                                    anioNacimiento      : vm.registroEditar.anioNacimiento,
                                    edad                : vm.registroEditar.edad,
                                    telefono            : vm.registroEditar.telefono,
                                    celular             : vm.registroEditar.celular,
                                    curp                : vm.registroEditar.curp,
                                    domicilio           : vm.registroEditar.domicilio,
                                    numeroExt           : vm.registroEditar.numeroExt,
                                    cruzamientos        : vm.registroEditar.cruzamientos,
                                    colonia             : vm.registroEditar.colonia,
                                    codigoPostal        : vm.registroEditar.codigoPostal,
                                    idLocalidad         : vm.registroEditar.idLocalidad,
                                    idNivelEstudios     : vm.registroEditar.idNivelEstudios,
                                    estadoCivil         : vm.registroEditar.estadoCivil,
                                    foto                : vm.registroEditar.foto,
                                    disVisual           : vm.registroEditar.disVisual,
                                    disAuditiva         : vm.registroEditar.disAuditiva,
                                    disLenguaje         : vm.registroEditar.disLenguaje,
                                    disMotriz           : vm.registroEditar.disMotriz,
                                    disMental           : vm.registroEditar.disMental,
                                    disOtro             : vm.registroEditar.disOtro,
                                    enfermedadPadece    : vm.registroEditar.enfermedadPadece,
                                    enfermedadCual      : vm.registroEditar.enfermedadCual,
                                    tutorNombre         : vm.registroEditar.tutorNombre,
                                    tutorCurp           : vm.registroEditar.tutorCurp,
                                    tutorEmail          : vm.registroEditar.tutorEmail,
                                    tutorParentesco     : vm.registroEditar.tutorParentesco,
                                    tutorDireccion      : vm.registroEditar.tutorDireccion,
                                    tutorTelefono       : vm.registroEditar.tutorTelefono,
                                    docActaNacimiento   : vm.registroEditar.docActaNacimiento,
                                    docCompEstudios     : vm.registroEditar.docCompEstudios,
                                    docIdentOficial     : vm.registroEditar.docIdentOficial,
                                    docConstCurp        : vm.registroEditar.docConstCurp,
                                    docFotografias      : vm.registroEditar.docFotografias,
                                    docCompMigratorio   : vm.registroEditar.docCompMigratorio,
                                    docCompDomicilio    : vm.registroEditar.docCompDomicilio,
                                    docCurpTutor        : vm.registroEditar.docCurpTutor,
                                    docIneTutor         : vm.registroEditar.docIneTutor,
                                    trabajaActualmente  : vm.registroEditar.trabajaActualmente,
                                    idActividad         : vm.registroEditar.idActividad,
                                    empresaTrabaja      : vm.registroEditar.empresaTrabaja,
                                    empresaPuesto       : vm.registroEditar.empresaPuesto,
                                    empresaAntiguedad   : vm.registroEditar.empresaAntiguedad,
                                    empresaDireccion    : vm.registroEditar.empresaDireccion,
                                    empresaTelefono     : vm.registroEditar.empresaTelefono,
                                    idExperiencia       : vm.registroEditar.idExperiencia,
                                    idMedio             : vm.registroEditar.idMedio,
                                    idMotivo            : vm.registroEditar.idMotivo,
                                    idGrupoPertenece    : vm.registroEditar.idGrupoPertenece,
                                    gpoJefasFamilia     : vm.registroEditar.gpoJefasFamilia,
                                    gpoSitViolencia     : vm.registroEditar.gpoSitViolencia,
                                    gpoAdolCalle        : vm.registroEditar.gpoAdolCalle,
                                    gpoIndigenas        : vm.registroEditar.gpoIndigenas,
                                    gpoAdultoMayor      : vm.registroEditar.gpoAdultoMayor,
                                    gpoLgbttti          : vm.registroEditar.gpoLgbttti,
                                    gpoDentroCereso     : vm.registroEditar.gpoDentroCereso,
                                    gpoCapDiferentes    : vm.registroEditar.gpoCapDiferentes,
                                    gpoMenorReadap      : vm.registroEditar.gpoMenorReadap,
                                    gpoFueraCereso      : vm.registroEditar.gpoFueraCereso,
                                    registroRemoto      : vm.registroEditar.registroRemoto,
                                    fechaRegistro       : vm.registroEditar.ultimaActualizacion,
                                    ultimaActualizacion : vm.registroEditar.ultimaActualizacion
                                })
                                .$promise
                                .then(function(respuesta) {
                                    $modalInstance.close();
                                });
                            }
                        });
                    }

                });

            };

            function curpValida(curp) {
                var re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
                    validado = curp.match(re);
                
                if (!validado)  //Coincide con el formato general?
                    return false;
                
                //Validar que coincida el dígito verificador
                function digitoVerificador(curp17) {
                    //Fuente https://consultas.curp.gob.mx/CurpSP/
                    var diccionario  = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
                        lngSuma      = 0.0,
                        lngDigito    = 0.0;
                    for(var i=0; i<17; i++)
                        lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
                    lngDigito = 10 - lngSuma % 10;
                    if (lngDigito == 10) return 0;
                    return lngDigito;
                }
              
                if (validado[2] != digitoVerificador(validado[1])) 
                    return false;
                    
                return true; //Validado
            };
            
            function transformarCadenaPaterno(){
                let texto = vm.registroEditar.apellidoPaterno;
                if(texto){
                    texto = texto.toUpperCase();
                    const acentos = {'Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
                    //return texto.split('').map( letra => acentos[letra] || letra).join('').toString();
                    vm.registroEditar.apellidoPaterno = texto.split('').map( letra => acentos[letra] || letra).join('').toString();
                }
                return;
            }

            function transformarCadenaMaterno(){
                let texto = vm.registroEditar.apellidoMaterno;
                if(texto){
                    texto = texto.toUpperCase();
                    const acentos = {'Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
                    vm.registroEditar.apellidoMaterno = texto.split('').map( letra => acentos[letra] || letra).join('').toString();
                }
                return;
            }

            function transformarCadenaNombres(){
                let texto = vm.registroEditar.nombre;
                if(texto){
                    texto = texto.toUpperCase();
                    const acentos = {'Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
                    vm.registroEditar.nombre = texto.split('').map( letra => acentos[letra] || letra).join('').toString();
                }
                return;
            }

    };

})();