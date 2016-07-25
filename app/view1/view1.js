/**
 * Created by Zhou on 7/4/16.
 */
angular.module('myApp.view1', ['ngRoute', "Constants"])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl',
        });
    }])
    .controller('View1Ctrl', function ($scope, Config, constants) {
    var index = 0, allOperations = constants.ALL_OPERATIONS_INCLUDE_DISION;
    $scope.$watch(function () { return Config.enableDivision; }, function () {
        allOperations = Config.enableDivision ? constants.ALL_OPERATIONS_INCLUDE_DISION : constants.ALL_OPERATIONS_WITHOUT_DIVISION;
        $scope.currentOperation = allOperations[0];
        $scope.remainingOperations = allOperations.slice(1, allOperations.length);
    });
    $scope.changeOperation = function (operation) {
        $scope.currentOperation = operation;
        var index = allOperations.indexOf(operation);
        $scope.remainingOperations = allOperations.slice(0, index).concat(allOperations.slice(index + 1, allOperations.length));
    };
    $scope.poly = new PolynomialField(42, Config, $scope, 'poly');
    $scope.conf = Config;
    $scope.poly2 = new PolynomialField(6, Config, $scope, 'poly2');
    $scope.ctrl = {
        add: function ($chip) {
            if (parseInt($chip) < Config.field) {
                return { value: $chip, index: NaN };
            }
            return null;
        }
    };
    $scope.poly3 = new PolynomialField(0, Config, $scope, 'poly3');
    $scope.calc = function () {
        var result = $scope.currentOperation.texFunction($scope.poly, $scope.poly2);
        $scope.poly3.decimal = result.value;
        $scope.steps = result.tex;
        PolynomialField.updateAllMath();
    };
    $scope.sendResult = function () {
        $scope.poly.numberValue = $scope.poly3.numberValue;
        PolynomialField.updateAllMath();
    };
});
//# sourceMappingURL=view1.js.map