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
    url: '/profile/{username}',
    templateUrl: 'profile.html',
    controller: 'ProfileController'
  })
  .state({
    name: 'mytimeline',
    url: '/mytimeline/{username}',
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

  service.mytimeline = function(uname){
    var url = '/timeline/'+uname
    return $http({
      url : url,
      method : 'GET'
    });
  };

  service.profiles = function(username){
    var url = '/profile/'+username;
    return $http({
      url: url,
      method: 'GET'
    });
  };
  return service;
});

app.controller('MyTimelineController',function($scope,$stateParams,twitterfactory){
  twitterfactory.mytimeline($stateParams.username).success(function(data){
    console.log(data);
    $scope.tweets = data;
  });
});

app.controller('WorldTimeLineController',function($scope,twitterfactory) {
  twitterfactory.worldtimeline().success(function(tweets){
    $scope.tweets = tweets;
  });
});

app.controller('ProfileController',function($scope,$stateParams,twitterfactory){
  twitterfactory.profiles($stateParams.username).success(function(data){
    console.log(data);
    $scope.followingl = data.usr.following.length;
    $scope.followersl = data.usr.followers.length;
    $scope.profile = data;
  });
});
