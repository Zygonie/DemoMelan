function ctrlInterventions($scope, $log, $route, $http, $window, $timeout, Api, FlashService) {
  /**********************
   *** Initialization ***
   **********************/
  $scope.initCtrl = function () {
    $scope.interventions = [];
    $scope.intervention = {};
    $scope.flash = FlashService;
    $scope.flash.clear();

    GetAllInterventionTypes();
    
    $scope.clearFlash = function(){$timeout(function(){
        $scope.flash.clear();
      }, 5000);};
  };
  
  var GetAllInterventionTypes = function(next){
    Api.InterventionTypes.query({}, function(interventions){
      $scope.interventions = interventions;
      next();
    });
  };
  
  $scope.addInterventionType = function(){
    if($scope.intervention._id){
      $scope.intervention.$save({ Id: $scope.intervention._id },
        function (intervention) { //success
          if (intervention){
            $scope.flash.showSuccess('Intervention mise à jour');
            $scope.clearFlash();
            GetAllInterventionTypes(function(){$scope.intervention = {};});            
          }
        },
        function (err) { //error
          $log.log("Impossible de mettre à jour l'intervention : " + err.data.error);
          $scope.flash.showError("La nouvelle intervention n'a pu être mise à jour : " + err.data.error);
          $scope.clearFlash();
        });
    }
    else{
      var newInterventionType = new Api.InterventionTypes($scope.intervention);
      newInterventionType.$save(function(intervention){
        if(!intervention){
          $log.log('Impossible to create new intervention');
          $scope.flash.showError("La nouvelle intervention n'a pu être créé");
          $scope.clearFlash();
        }
        else {
          $scope.flash.showSuccess('Intervention ajouté');
          GetAllInterventionTypes(function(){$scope.intervention = {};});
          $scope.clearFlash();
        }
      },
      function(error){
        $scope.flash.showError('Impossible de créer la nouvelle intervention ' + error.data.error);
        $scope.clearFlash();
      });
    }
  };
  
  $scope.showInterventionType = function(interventionType){
    $scope.intervention = interventionType;
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
        $scope.flash.showError("Impossible de supprimer le type d'intervention " + err.data.error);
        $scope.clearFlash();
      });
  };
}