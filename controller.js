var timeoutApp = angular.module('timeout', []);

timeoutApp.controller('MainCtrl', function ($scope, $http) {

  $http.get('users.json').success(function(dataUsers) {
    $http.get('venues.json').success(function(dataVenues) {
      $scope.list = [];
      $scope.avoid = [];
      $scope.atLeastADrink = [];

      angular.forEach(dataVenues, function(dataVenuesElement) {
        this.push({'name':dataVenuesElement.name,'reason':[],'drinks':[], 'maxPotentialParticipants':dataUsers.length});
      }, $scope.list);

      // Push places to avoid because of food in $scope.avoid
      angular.forEach(dataUsers, function(dataUsersElement) {
        angular.forEach(dataUsersElement.wont_eat, function(wont_eatElement) {
          angular.forEach(dataVenues, function(dataVenuesElement) {
            var presentValue = dataVenuesElement.food.some(isPresent);
            function isPresent(presentElement) {
              return (presentElement === wont_eatElement);
            }
            if(presentValue){
              this.push({
                'name': dataVenuesElement.name,
                'reason': dataUsersElement.name + " doesn't eat " + wont_eatElement
              });
            }
          },$scope.avoid);
        });

        // Push places to go because of the drinks in $scope.atLeastADrink
        angular.forEach(dataVenues, function(dataVenuesElement){
          var keepGoing = true;
          angular.forEach(dataVenuesElement.drinks, function(dataVenuesElementDrinks){
            angular.forEach(dataUsersElement.drinks, function(drinksElement){
              if(keepGoing) {
                if(drinksElement === dataVenuesElementDrinks){
                  this.push({
                    'name': dataVenuesElement.name,
                    'drinks': dataUsersElement.name + " can take at least a drink in"
                  });
                  keepGoing = false;
                }
              }
            }, $scope.atLeastADrink);
          });
        });
      });

      // Push results from $scope.avoid and $scope.atLeastADrink to $scope.list
      angular.forEach($scope.list, function(listElement){
        angular.forEach($scope.avoid, function(avoidElement){
          if(listElement.name === avoidElement.name){
            listElement.reason.push(avoidElement.reason);
          }
        });
        angular.forEach($scope.atLeastADrink, function(atLeastADrinkElement){
          if(listElement.name === atLeastADrinkElement.name){
            listElement.drinks.push(atLeastADrinkElement.drinks);
          }
        });
      });

    });
  });
});
