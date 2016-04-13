angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('LoginCtrl', function($rootScope,$scope,$location,$ionicPopup,$ionicLoading,$ionicNavBarDelegate,LoginService,localStorageService) {

    if(localStorageService.get(user))
        $location.path("/app/playlists");

    $ionicNavBarDelegate.showBackButton(false);
   
    $scope.cargando = false;
    $scope.usuario ={};
    var user = {};

    $scope.login = function (argument) {

        $ionicLoading.show({
            template: '<span>Autenticando</span><ion-spinner  icon="dots" class="spinner-light"></ion-spinner>'
        });
        console.log($scope.usuario);



        LoginService.loginUser($scope.usuario)
            .$promise
            .then(function (response) {
                $ionicLoading.hide();
                console.log(response);
                if (response.UserNotFoundException || !response.success) {

                    var alertPopup = $ionicPopup.alert({
                        title: response.titulo,
                        template: response.mensaje
                    });

                } else  {
                    //console.log(response.usuario);
                    $scope.user = response.usuario; 
                    
                    localStorageService.set(user,$scope.user);
                    $location.path("/app/playlists");
                    //$scope.usuario ={};

                }
                $scope.cargando = false;
                
            }); 
     
  }



})
.controller('RegistroCtrl', function($scope,$ionicPopup,$location,$ionicLoading, RegistroService) {
    

    $scope.usuario={};
    $scope.cargando = false;
    $scope.upload_file  = "";


    $scope.registrar= function () {
        //console.log("FILE:"+$scope.usuario.file);
        $ionicLoading.show({
            template: '<span>Registrando</span><ion-spinner  icon="dots" class="spinner-light"></ion-spinner>'
        });
        RegistroService.registrarUser($scope.usuario)
            .$promise
            .then(function (response) {
                $scope.cargando = false;
                $ionicLoading.hide();
                console.log(response);

                var alertPopup = $ionicPopup.alert({
                    title: response.titulo,
                    template: response.mensaje
                });

                alertPopup.then(function (res) {

                    if (response.success)
                        $location.path("/login");
                });
        });
    }

})
.controller('TestsCtrl', function($scope, TestsService) {
    $scope.tests = [];
    $scope.cargando = true;
    TestsService.getAllTests().$promise.then(function (response) {
        $scope.cargando = false;
        $scope.tests = response.tests.map(function (test) {
            switch (test.nombre) {
                case 'Informática':
                    test.icon='ion-monitor';
                    break;
                case 'Historia':
                    test.icon='ion-ios-book';
                    break;
                case 'Ciencia':
                    test.icon='ion-beaker';
                    break;
                default:
                    break;
                
            }
            return test;
        })
        //$scope.cargando = false;
        console.log($scope.tests);
    })  



})

.controller('TestCtrl', function($scope,$location, $stateParams,$ionicNavBarDelegate,$window,localStorageService,TestService,CheckService) {
    
    
    $scope.cargando = true;
    $ionicNavBarDelegate.showBackButton(false);
    var ciclo = 0;
    var infoTest = {};
    var userID;
    var user = {};

     
    TestService.getDataTest()({id:$stateParams.testId},function (response) {
        ciclo = 0;
        console.log("bienvenido");
        infoTest.test = response.id;
        userID = localStorageService.get(user).id;
        infoTest.user = userID;
        infoTest.respuestas = [];
        $scope.icon = {};


        switch (response.nombre) {
            case 'Informática':
                $scope.icon.tipo='ion-monitor';
                $scope.icon.color = "red";
                $scope.colorquestion = 'red-question';
                $scope.background = "red-background";
                
                break;
            case 'Historia':
                $scope.icon.tipo='ion-ios-book';
                $scope.icon.color = 'green';
                $scope.colorquestion = 'green-question';
                $scope.background = "green-background";
               
                break;
            case 'Ciencia':
                 $scope.icon.tipo='ion-beaker';
                 $scope.icon.color = 'yellow';
                 $scope.colorquestion = 'yellow-question';
                 $scope.background = "yellow-background";
                 
                break;
            default:
                break;
                
        }
           
        infoTest.background = $scope.background;
        $scope.preguntas = response.preguntas;
        $scope.tematia = response.nombre;
        $scope.preguntaActual = $scope.preguntas[ciclo];
        $scope.respuestas = $scope.preguntas[ciclo].answers;
        $scope.cargando = false;;

    });
    
    $scope.siguientePregunta = function (idanswer) {

        infoTest.respuestas.push({pregunta:$scope.preguntaActual.id, idanswer:idanswer})
        if (ciclo < 3) { 
            ciclo++;
            $scope.preguntaActual = $scope.preguntas[ciclo];
            $scope.respuestas = $scope.preguntas[ciclo].answers;
        } else {
            console.log(infoTest);
            CheckService.dataQuiz = infoTest;
            
            $location.path("/app/result");
            $ionicNavBarDelegate.showBackButton(false);
            //ciclo = 0;
            //infoTest.respuestas = [];

            //$window.location.reload(true);
        }
        
    }

})

.controller('ResultCtrl',function($scope,$ionicNavBarDelegate,$window, CheckService){
    console.log(CheckService.dataQuiz);
    $scope.cargando = true;
    $scope.background=CheckService.dataQuiz.background;
    $scope.vm={};
    $scope.vm.options = {
        chart: {
            type: 'boxPlotChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 30,
                left: 50
            },
            color: ['darkorange', 'green', 'darkred'],
            x: function(d){return d.label;},
            maxBoxWidth: 10,
            yDomain: [0, 5]
          },
        title : {
            enable: true,
            text: 'Resultados test'
        }
    };

    
    CheckService.validateQuiz().then(function (response) {
         console.log(response);
         $scope.cargando = false;
        if(response.aciertos > response.fallos) {
            $scope.mensaje="¡Excelente!";
            $scope.icon="ion-happy";
        }
        else if (response.aciertos < response.fallos) {
            $scope.mensaje="¡Reprobado!";
            $scope.icon="ion-sad";
        } else {
            $scope.mensaje="¡No estuvo mal!";
            $scope.icon="ion-happy";
        }


         $scope.vm.data = [  
          {
            label: 'Preguntas',
            values: {
                Q1: 0,
                Q2: '',
                Q3: 4
                   
            }
          },
          {
            label: 'Correctas',
            values: {
                Q1: 0,
                Q2: '',
                Q3: response.aciertos
            }
          },
          {
            label: 'Incorrectas',
            values: {
                Q1: 0,
                Q2: '',
                Q3: response.fallos
          }
          }
        ];
         
    })

    $ionicNavBarDelegate.showBackButton(false);
    //$window.location.reload(true);
})

.controller('PlaylistsCtrl', function($scope,localStorageService) {
    var user = {};
    $scope.user = localStorageService.get(user);
    console.log($scope.user);
})

.controller('PlaylistCtrl', function($scope, $ionicNavBarDelegate, $stateParams) {

     //$ionicNavBarDelegate.showBackButton(false);
})

.controller('MenuCtrl', function($scope,$location,localStorageService) {
    var user = {};
    $scope.user = localStorageService.get(user);
    $scope.user.urlFoto = 'https://knowledge-antoniomejias.c9users.io/'+ $scope.user.urlFoto;
        console.log( $scope.user.urlFoto);
    console.log('hola mundo');

    $scope.logout = function () {
        $scope.user = localStorageService.set(user,{});
        $location.path('/login');
    }
    
})

.controller('PerfilCtrl', function($scope,$ionicPopup,$ionicLoading, localStorageService, UpdateService) {
  var user = {};
  $scope.usuario = localStorageService.get(user);
  $scope.actualizar = function () {
    console.log('aactualziadno');
        $ionicLoading.show({
            template: '<span>Actualizando</span><ion-spinner  icon="dots" class="spinner-light"></ion-spinner>'
        });

        UpdateService.updateUser($scope.usuario)
            .then(function (response) {
                $ionicLoading.hide();

                var alertPopup = $ionicPopup.alert({
                    title: response.titulo,
                    template: response.mensaje
                });

            })
  }
});

