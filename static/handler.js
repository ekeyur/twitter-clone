var app = angular.module('twitterapp',['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state({
    name: 'login',
    url: '/login',
    templateUrl: 'login.html',
    controller: 'LoginController'
  })
  .state({
    name: 'profile',
    url: '/profile',
    templateUrl: 'profile.html',
    controller: 'ProfileController'
  })
  .state({
    name: 'mytimeline',
    url: '/timeline',
    templateUrl: 'mytimeline.html',
    controller: 'MyTimelineController'
  })
  .state ({
    name: 'worldtimeline',
    url: '/worldtimeline',
    templateUrl: 'worldtimeline.html',
    controller: 'WorldTimeLineController'
  });
  $urlRouterProvider.otherwise('/index');
});

app.factory('twitterfactory', function($http) {
  var service = {};
  service.worldtimeline = function(){
    return $http({
      url: '/worldtimeline',
      method: 'GET'
    });
  };
  return service;
});

app.controller('WorldTimeLineController',function($scope,$state,twitterfactory) {
  twitterfactory.worldtimeline().success(function(tweets){
    $scope.tweets = tweets;
  });
});

app.controller('MyTimelineController', function($scope,$state) {

});

app.controller('IndexController', function($scope,$state) {

});
