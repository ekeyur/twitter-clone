var app = angular.module('twitterapp',['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  // .state({
  //   name: 'login',
  //   url: '/login',
  //   templateUrl: 'login.html',
  //   controller: 'LoginController'
  // })
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
  .state({
    name:'signup',
    url: '/signup',
    templateUrl:'signup.html',
    controller:'SignUpPostController'
  })
  .state ({
    name: 'worldtimeline',
    url: '/worldtimeline',
    templateUrl: 'worldtimeline.html',
    controller: 'WorldTimeLineController'
  });
  $urlRouterProvider.otherwise('/worldtimeline');
});

app.factory('twitterfactory', function($http) {
  var service = {};

  service.worldtimeline = function(){
    return $http({
      url: '/worldtimeline',
      method: 'GET'
    });
  };

  service.postTweet = function(twt){
    var url = '/profile/'+twt.user;
    console.log(twt);
    return $http({
      url : url,
      method : 'POST',
      data : twt
    });
  };

  service.signUp = function(data){
    var url = '/signup';
    return $http({
      url : url,
      method : 'POST',
      data : data
    });
  };

  service.logIn = function(data){
    var url = '/login';
    return $http({
      url : url,
      method : 'POST',
      data : data
    });
  };

  service.mytimeline = function(uname){
    var url = '/timeline/'+uname;
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

// app.controller('LoginController',function($scope,$state,$stateParams,twitterfactory){
//
// });

app.controller('SignUpPostController',function($scope,$state,$stateParams,twitterfactory){
  $scope.signuppost = function(){
    if($scope.password === $scope.password_again){
      user = {username : $scope.uname, password : $scope.password};
      twitterfactory.signUp(user).success(function(data){
      });
      $state.go('worldtimeline');
    }else{
      alert("Passwords do not match");
      $state.go('signup');
    }
  };

});

app.controller('MyTimelineController',function($scope,$stateParams,twitterfactory){
  twitterfactory.mytimeline($stateParams.username).success(function(data){
    $scope.tweets = data;
  });
});

app.controller('WorldTimeLineController',function($scope,twitterfactory) {
  twitterfactory.worldtimeline().success(function(tweets){
    $scope.tweets = tweets;
  });
  $scope.loginPost = function(){
    console.log($scope.usr);
    console.log($scope.password);
    user = {username : $scope.usr, password : $scope.password};
    twitterfactory.logIn(user).success(function(data){
    });
  };
});

app.controller('ProfileController',function($scope,$stateParams,twitterfactory){
  twitterfactory.profiles($stateParams.username).success(function(data){
    $scope.followingl = data.usr.following.length;
    $scope.followersl = data.usr.followers.length;
    $scope.profile = data;
  });
  $scope.posttwt = function()
  {
    var twt = {user : $stateParams.username, twt : $scope.areatwt };
    twitterfactory.postTweet(twt).success(function(data){
      twitterfactory.profiles($stateParams.username).success(function(data){
        $scope.followingl = data.usr.following.length;
        $scope.followersl = data.usr.followers.length;
        $scope.profile = data;
      });
    });
  };
});
