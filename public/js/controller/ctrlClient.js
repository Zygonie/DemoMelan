function ctrlClient($scope, $log, $route, $http, $location, $timeout, Api, FlashService, SharedService) {
  /**********************
   *** Initialization ***
   **********************/
  $scope.initCtrl = function () {
    $scope.client = {};
    $scope.clients = {};
    $scope.flash = FlashService;
    $scope.showPanel = false;
    FlashService.clear();
    $scope.validePhone = true;
    
    $scope.clearFlash = function(){$timeout(function(){
      $scope.flash.clear();
    }, 5000);};
  };
    
  $scope.reload = function() {
    $route.reload();
  };
  
  $scope.getClient = function() {
    $scope.flash.clear();
    $scope.showPanel = false;
    var nom = $scope.client.name,
        prenom = $scope.client.forename,
        phone = $scope.client.phone;
    $scope.clients = {};
    
       
      Api.Clients.query({nom:nom, prenom:prenom, phone:phone}, function(res){
        if(res.length === 0){
          $scope.flash.showError('Aucun client trouvé');
          $scope.clearFlash();
        }
        else{
          $scope.clients = res;
          $scope.showPanel = true;
        }
      });
  };
    
  $scope.addClient = function() {
    $scope.flash.clear();
    // Validate phone number
    var regex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    if(regex.test($scope.client.phone)){
      var newClient = new Api.Clients($scope.client);
      newClient.$create(function(client) {
        if(!client){
          $log.log('Impossible to create new client');
          $scope.flash.showError("Le nouveau client n'a pu être créé.");
          $scope.clearFlash();
        }
        else {
          $scope.flash.showSuccess('Client ajouté');
          $scope.clearFlash();
          $scope.client = {};
        }
      },
      function(error){
        $scope.flash.showError('Impossible de créer le nouveau client. ' + error);
        $scope.clearFlash();
      });
    }
    else {
      $scope.validePhone = false;
      $scope.flash.showError('Numéro de téléphone invalide');
      $scope.clearFlash();
    }
  };
  
  $scope.openClient =function(client){
    SharedService.data.client = client;
    $location.path('/client/'+client._id);
  };
  
  
}