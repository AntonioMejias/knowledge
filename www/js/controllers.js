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
                $location.path("tab-dash");
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

.controller('ChatsCtrl', function($scope, Chats) {
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
});
