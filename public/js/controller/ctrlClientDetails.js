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
    $scope.slideupErr = true;
    $scope.slidedownErr = false;
    $scope.slideupSucc = true;
    $scope.slidedownSucc = false;
    
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };
    
    $scope.clearFlash = function(){$timeout(function(){
      $scope.slideupErr = true;
      $scope.slidedownErr = false;
      $scope.slideupSucc = true;
      $scope.slidedownSucc = false;
      $timeout(function(){
        $scope.flash.clear();
      },800);
    }, 3000);};
    
    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };
    
    $scope.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    //Get its interventions
    GetAllInterventionOfClient();
    
    //Get enumeration values  
    GetInterventionTypes();
    
  };
  
  var GetAllInterventionOfClient = function(){
    Api.Interventions.query({client: $scope.clientID}, function(interventions){  
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
  
  var UpdateList = function(intervention){
    for(var i=0;i<$scope.interventions.length;i++){
      if($scope.interventions[i]._id === intervention._id){
        $scope.interventions[i] = intervention;
      }
    }
  };
  
  var ShowSuccessMessage = function(message){
    $scope.flash.showSuccess(message);
    $scope.slideupSucc = false;
    $scope.slidedownSucc = true;
    $scope.clearFlash();
  };
  
  var ShowErrorMessage = function(message){
    $scope.flash.showError(message);
    $scope.slideupErr = false;
    $scope.slidedownErr = true;
    $scope.clearFlash();
  };
  
  $scope.saveIntervention = function(){
    $scope.flash.clear();
    // Update
    if($scope.intervention._id){
      var type = $scope.intervention.type;
      $scope.intervention.type = $scope.intervention.type._id;
      $scope.intervention.client = $scope.intervention.client._id;
      $scope.intervention.$save({ Id: $scope.intervention._id },
        function (intervention) { //success
          if (intervention){
            ShowSuccessMessage('Intervention mise à jour');
            UpdateList(intervention);
            InitializeInterventionPanel();
          }
        },
        function (err) { //error
          $log.log("Impossible de mettre à jour l'intervention");
          ShowErrorMessage("L'intervention n'a pu être mise à jour : " + err.data.error);
          InitializeInterventionPanel();
        });
    }
    // Save
    else{
      $scope.intervention.client = $scope.clientID;
      $scope.intervention.type = $scope.intervention.type._id;
      var newItem = new Api.Interventions($scope.intervention);
      newItem.$save(function(intervention) {
        if(!intervention){
          $log.log('Impossible to create new intervention');
          ShowErrorMessage("La nouvelle intervention n'a pu être créé.");
          InitializeInterventionPanel();
        }
        else {
          ShowSuccessMessage('Intervention ajoutée');
          $scope.interventions.push(intervention);
          InitializeInterventionPanel();
        }
      },
      function(error){
        ShowErrorMessage('Impossible de créer la nouvelle intervention : ' + error.data.error);
        InitializeInterventionPanel();
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
    	InitializeInterventionPanel();
        for (var idx in $scope.interventions) {
          if ($scope.interventions[idx] === removedIntervention) {
            $scope.interventions.splice(idx, 1);
          }
        }
        ShowSuccessMessage('Intervention supprimée');
      },
      function (err) { //error
        ShowErrorMessage("Impossible de supprimer l'intervention : " + err.data.error);
        InitializeInterventionPanel();
      });
  };
  
  $scope.showIntervention =function(intervention){
    $scope.intervention = angular.copy(intervention);
  };
  
}