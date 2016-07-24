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
    .controller('View1Ctrl', function ($scope, Config) {
    var index = 0, allOperations = [
        {
            symbol: "+",
            texFunction: PolynomialField.addWithSteps
        },
        {
            symbol: '-',
            texFunction: PolynomialField.subtractWithSteps
        },
        {
            symbol: '*',
            texFunction: PolynomialField.subtractWithSteps
        },
    ];
    $scope.currentOperation = allOperations[0];
    $scope.remainingOperations = allOperations.slice(1, allOperations.length);
    $scope.changeOperation = function (operation) {
        $scope.currentOperation = operation;
        var index = allOperations.indexOf(operation);
        $scope.remainingOperations = allOperations.slice(0, index).concat(allOperations.slice(index + 1, allOperations.length));
    };
    $scope.poly = new PolynomialField(22, Config, $scope, 'poly');
    $scope.conf = Config;
    $scope.poly2 = new PolynomialField(0, Config, $scope, 'poly2');
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
        $scope.poly3.numberValue = PolynomialField.add($scope.poly, $scope.poly2);
        $scope.steps = PolynomialField.addWithSteps($scope.poly, $scope.poly2).tex;
        // var prod = PolynomialField.multiply($scope.poly,$scope.poly);
        // $scope.poly3.numberValue = prod[prod.length - 1].numberValue;
    };
});
//# sourceMappingURL=view1.js.map