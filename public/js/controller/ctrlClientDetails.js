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
    },function (err) { //error
        $log.log("Impossible de trouver le client");
        $scope.flash.showError("Impossible de trouver le client : " + err.data.error);
        $scope.clearFlash();
    });

    //Get its interventions
    GetAllInterventionOfClient();
    
    //Get enumeration values  
    GetInterventionTypes();
    
  };
  
  var GetAllInterventionOfClient = function(){
    Api.Interventions.query({clientID: $scope.clientID}, function(interventions){  
      if(interventions.length === 0){
          $scope.flash.showError('Aucune intervention trouvée');
          $scope.clearFlash();
        }
        else{
          $scope.interventions = interventions;
          $scope.showPanel = true;
        }
      },function (err) { //error
          $log.log("Impossible de trouver les interventions");
          $scope.flash.showError("Impossible de trouver les interventions : " + err.data.error);
          $scope.clearFlash();
      });
  };
  
  var GetInterventionTypes = function(){
    Api.InterventionTypes.query({}, function(types){
      $scope.types = types;
      InitializeInterventionPanel();
    });
  };
  
  var InitializeInterventionPanel = function(){
    $scope.intervention.type = $scope.types[0];
    $scope.intervention.date = Date.now();
    if($scope.intervention.notes){
      delete $scope.intervention.notes;
    }
    if($scope.intervention.price){
      delete $scope.intervention.price;
    }
  };
  
  $scope.saveIntervention = function(){
    $scope.flash.clear();
    if($scope.intervention._id){
      var type = $scope.intervention.type;
      $scope.intervention.type = $scope.intervention.type._id;
      $scope.intervention.$save({ Id: $scope.intervention._id },
        function (intervention) { //success
          if (intervention){
            $scope.flash.showSuccess('Intervention mise à jour');
            GetAllInterventionOfClient();
            InitializeInterventionPanel();
            $scope.clearFlash();
          }
        },
        function (err) { //error
          $log.log("Impossible de mettre à jour l'intervention");
          $scope.flash.showError("L'intervention n'a pu être mise à jour : " + err.data.error);
          $scope.clearFlash();
        });
    }
    else{
      $scope.intervention.clientID = $scope.client._id;
      $scope.intervention.type = $scope.intervention.type._id;
      var newItem = new Api.Interventions($scope.intervention);
      newItem.$save(function(intervention) {
        if(!intervention){
          $log.log('Impossible to create new intervention');
          $scope.flash.showError("La nouvelle intervention n'a pu être créé.");
          $scope.clearFlash();
        }
        else {
          $scope.flash.showSuccess('Intervention ajoutée');
          GetAllInterventionOfClient();
          InitializeInterventionPanel();
          $scope.clearFlash();
        }
      },
      function(error){
        $scope.flash.showError('Impossible de créer la nouvelle intervention : ' + error.data.error);
        $scope.clearFlash();
      });
    }
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
        $scope.flash.showError("Impossible de supprimer l'intervention : " + err.data.error);
        $scope.clearFlash();
      });
  };
  
  $scope.showIntervention =function(intervention){
    $scope.intervention = intervention;
    $scope.types.forEach(function(item){
      if(item.name === intervention.type.name){
        intervention.type = item;
      }
    });
  };
  
}