angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})
.controller('LoginCtrl', function($rootScope,$scope,$location,LoginService) {
  $scope.prueba = function () {
     console.log("haciendo una pruebita");
  }
  $scope.cargando = false;
  $scope.usuario ={}
  $scope.login = function (argument) {
      $scope.cargando = true;
     console.log($scope.usuario);
     LoginService.loginUser($scope.usuario)
        .$promise.then(function (response) {
                console.log(response);
                $scope.cargando = false;
                $location.path("/app/playlists");
            }); 
     
  }



})
.controller('RegistroCtrl', function($scope, RegistroService) {

    $scope.usuario={}
    $scope.registrar= function () {
        //console.log($scope.usuario);
        RegistroService.registrarUser($scope.usuario)
            .then(function (response) {
                console.log(response);
            });
    }

})
.controller('TestsCtrl', function($scope, TestsService) {
    $scope.tests = [];
    TestsService.getAllTests().$promise.then(function (response) {
        $scope.tests = response.tests;
        console.log($scope.tests);
    })  



})

.controller('TestCtrl', function($scope,$location, $stateParams,$ionicNavBarDelegate,TestService,CheckService) {
    
    var ciclo = 0;
    var infoTest = {};

    $ionicNavBarDelegate.showBackButton(false);

    TestService.getDataTest()({id:$stateParams.testId},function (response) {

        console.log(response);
        infoTest.test = response.id;
        infoTest.user = 1;
        infoTest.respuestas = [];

        $scope.preguntas = response.preguntas;
        $scope.tematia = response.nombre;
        $scope.preguntaActual = $scope.preguntas[ciclo];
        $scope.respuestas = $scope.preguntas[ciclo].answers;

    });

    $scope.siguientePregunta = function (idanswer) {

        infoTest.respuestas.push({pregunta:$scope.preguntaActual.id, idanswer:idanswer})
        if (ciclo < 3) { 
            ciclo++;
            $scope.preguntaActual = $scope.preguntas[ciclo];
            $scope.respuestas = $scope.preguntas[ciclo].answers;
        } else {
            CheckService.dataQuiz = infoTest;
            $location.path("/app/result");
        }
        
    }

})

.controller('ResultCtrl',function($scope, CheckService){

    CheckService.validateQuiz().then(function (response) {
         console.log(response);
    })

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});

/*.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});*/
