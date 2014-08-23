function ctrlInterventions($scope, $log, $route, $http, $window, $timeout, Api, FlashService) {
  /**********************
   *** Initialization ***
   **********************/
  $scope.initCtrl = function () {
    $scope.interventions = [];
    $scope.intervention = {};
    $scope.flash = FlashService;
    $scope.flash.clear();
    $scope.slideupErr = true;
    $scope.slidedownErr = false;
    $scope.slideupSucc = true;
    $scope.slidedownSucc = false;

    GetAllInterventionTypes();
    
    $scope.clearFlash = function(){$timeout(function(){
        $scope.slideupErr = true;
        $scope.slidedownErr = false;
        $scope.slideupSucc = true;
        $scope.slidedownSucc = false;
        $timeout(function(){
          $scope.flash.clear();
        },800);
      }, 3000);};
  };
  
  var GetAllInterventionTypes = function(next){
    Api.InterventionTypes.query({}, function(interventions){
      $scope.interventions = interventions;
      next();
    });
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
  
  $scope.saveInterventionType = function(){
    // Update
    if($scope.intervention._id){
      $scope.intervention.$save({ Id: $scope.intervention._id },
        function (intervention) { //success
          if (intervention){
            ShowSuccessMessage('Intervention mise à jour');
            UpdateList(intervention);
            $scope.intervention = {};
          }
        },
        function (err) { //error
          $log.log("Impossible de mettre à jour l'intervention : " + err.data.error);
          ShowErrorMessage("La nouvelle intervention n'a pu être mise à jour : " + err.data.error);     
          $scope.intervention = {};
        });
    }
    // Save
    else{
      var newInterventionType = new Api.InterventionTypes($scope.intervention);
      newInterventionType.$save(function(intervention){
        if(!intervention){
          $log.log('Impossible to create new intervention');
          ShowErrorMessage("La nouvelle intervention n'a pu être créé");
          $scope.intervention = {};
        }
        else {
          ShowSuccessMessage('Intervention ajouté');
          $scope.intervention = {};
        }
      },
      function(error){
        ShowErrorMessage('Impossible de créer la nouvelle intervention ' + error.data.error);
        $scope.intervention = {};
      });
    }
  };
  
  $scope.showInterventionType = function(interventionType){
    $scope.intervention = angular.copy(interventionType);
  };
  
  $scope.removeInterventionType = function(item, e){
    $scope.flash.clear();
    if (e) {
      e.preventDefault(); //pour empecher que le content soit développé
      e.stopPropagation();
    }
    var id = item._id;
    item.$remove({ Id: id },
      function (removedIntervention) { //success
        for (var idx in $scope.interventions) {
          if ($scope.interventions[idx] === removedIntervention) {
            $scope.interventions.splice(idx, 1);
          }
        }
      },
      function (err) { //error
        ShowErrorMessage("Impossible de supprimer le type d'intervention " + err.data.error);
        $scope.intervention = {};
      });
  };
}