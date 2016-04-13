angular.module('starter.services', [])

.factory('RegistroService',function ($resource) {

    var API_PATH = 'https://knowledge-antoniomejias.c9users.io/user/create';

    var register = $resource(API_PATH);
    var registroService = {};

    registroService.registrarUser = function (datos) {
        return register.save(datos)
    }

    return registroService;
})

.factory('LoginService',function ($resource) {

    var API_PATH = 'https://knowledge-antoniomejias.c9users.io/user/login';

    var login = $resource(API_PATH);
    var loginService = {};

    loginService.loginUser = function (datos) {
        return login.save(datos)
    }

    return loginService;
})


.factory('TestsService',function ($resource) {

    var API_PATH = 'https://knowledge-antoniomejias.c9users.io/test/showAllTests';
    var tests = $resource(API_PATH);

    return {
            getAllTests: function () {
                return tests.get();
        }
    };
})

.factory('TestService',function ($resource) {
   
    var tests = $resource('https://knowledge-antoniomejias.c9users.io/test/getTestData/:id',{id: '@id'});

    return {
            getDataTest: function () {
                return tests.save;
        }
    };
})

.factory('CheckService',function ($resource) {
   
    var check = $resource('https://knowledge-antoniomejias.c9users.io/test/validateQuiz');

    return {
            dataQuiz: {},
            validateQuiz: function () {
                return check.save(this.dataQuiz).$promise;
        }
    };
})

.factory('UpdateService',function ($resource) {
   
    var update = $resource('https://knowledge-antoniomejias.c9users.io/user/update',null, {'update': { method:'PUT' }});

    return {
            updateUser: function (user) {
                return update.update(user).$promise;
        }
    };
});
