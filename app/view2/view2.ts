'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])
    .controller('View2Ctrl', function ($scope, $location: ILocationService, config, constants) {

        $scope.config = config;
        $scope.constants = constants;
        $scope.poly = new PolynomialField(0, config, $scope, "poly");
        $scope.$on("$destroy", function () {
            $scope.poly.remove();
        });

        $scope.ctrl = {
            add: function ($chip) {
                if (parseInt($chip) < config.field) {
                    return {value: $chip, index: NaN}
                }
                return null;
            }
        };
        $scope.calc = function () {
            $scope.number = 0;
        };
        if ("val" in $location.search()) {
            $scope.number = parseInt($location.search()['val']);
            $scope.calc();
        }
});