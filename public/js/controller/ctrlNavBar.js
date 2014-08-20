function ctrlNavBar($window, $scope, $location) {
  $scope.isActive = function (viewLocation) {
    var location = $location.url().toLowerCase();
    return location.indexOf(viewLocation.toLowerCase()) !== -1;
  };
    
  $scope.goHome = function(){
    $window.location.href = '/home';
  };
  
  $scope.logout = function(){
    $window.location.href = '/logout';
  };
}