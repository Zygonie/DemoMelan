function ctrlClientDetails($scope, $log, $route, $http, $location, $routeParams, $timeout, Api, FlashService, SharedService) {
  /**********************
   *** Initialization ***
   **********************/
  $scope.initDetails = function () {
    $scope.client = {};
    $scope.interventions = {};
    $scope.intervention = {};
    $scope.showPanel = false;
    $scope.clientID = $routeParams.clientID;
    $scope.types = [];
    $scope.opened = false;
    $scope.flash = FlashService;
    $scope.flash.clear();
    
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };
    
    $scope.clearFlash = function(){$timeout(function(){
        $scope.flash.clear();
    }, 5000);};
    
    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };
    
    $scope.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };
      
    //Get client
    Api.Clients.get({clientID: $scope.clientID}, function(res){
        if(res.length === 0){
          $scope.flash.showError('Aucun client trouvé');
          $scope.clearFlash();
        }
        else{
          $scope.client = res;
        }
    });

    //Get its interventions
    Api.Interventions.query({clientID: $scope.clientID}, function(interventions){
      if(interventions.length === 0){
        $scope.flash.showError('Aucune intervention trouvée');
        $scope.clearFlash();
      }
      else{
        $scope.interventions = interventions;
        $scope.showPanel = true;
      }
    });
    
    //Get enumeration values  
    Api.InterventionTypes.query({}, function(types){
      $scope.types = types;
      $scope.intervention.type = types[0];
      $scope.intervention.date = Date.now();
    });
    
  };
  
  $scope.addIntervention = function(){
    $scope.flash.clear();
    $scope.intervention.clientID = $scope.client._id;
    $scope.intervention.type = $scope.intervention.type._id;
    var newItem = new Api.Interventions($scope.intervention);
    newItem.$create(function(intervention) {
      if(!intervention){
        $log.log('Impossible to create new intervention');
        $scope.flash.showError("La nouvelle intervention n'a pu être créé.");
        $scope.clearFlash();
      }
      else {
        $scope.flash.showSuccess('Intervention ajoutée');
        $scope.intervention.type = $scope.types[0];
        $scope.intervention.date = Date.now();
        $scope.intervention.price = {};
        $scope.clearFlash();
      }
    },
    function(error){
      $scope.flash.showError('Impossible de créer la nouvelle intervention. ' + error);
      $scope.clearFlash();
    });
  };
  
  $scope.removeIntervention = function (intervention, e) {
    $scope.flash.clear();
    if (e) {
      e.preventDefault(); //pour empecher que le content soit développé
      e.stopPropagation();
    }
    var id = intervention._id;
    intervention.$remove({ Id: id },
      function (removedIntervention) { //success
        for (var idx in $scope.interventions) {
          if ($scope.interventions[idx] === removedIntervention) {
            $scope.interventions.splice(idx, 1);
          }
        }
      },
      function (err) { //error
      });
  };
  
  
}