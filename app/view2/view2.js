'use strict';
angular.module('myApp.view2', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])
    .controller('View2Ctrl', function ($scope, $location, config, constants) {
    $scope.config = config;
    $scope.constants = constants;
    constants.inverseModulus = ($location.search()["val"] == void 0) ?
        constants.inverseModulus : parseInt($location.search()["val"]);
    $scope.poly = new PolynomialField(constants.inverseModulus, config, $scope, "poly");
    $scope.$on("$destroy", function () {
        $scope.poly.remove();
    });
    $scope.ctrl = {
        add: function ($chip) {
            if (parseInt($chip) < config.field) {
                return { value: $chip, index: NaN };
            }
            return null;
        }
    };
    $scope.calc = function () {
        if (!config.enablePolynomialCompute)
            return;
        $scope.steps = [];
        PolynomialField.modulusInverse($scope.poly, new PolynomialField(constants.modulus, config), $scope.steps);
        PolynomialField.updateAllMath();
    };
});
//# sourceMappingURL=view2.js.map