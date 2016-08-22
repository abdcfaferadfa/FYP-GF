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
    .controller('View1Ctrl', function ($scope, Config, constants, $timeout) {
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
    var timer;
    $scope.autoCompute = false;
    $scope.toggleAutoCompute = function () {
        if ($scope.autoCompute) {
            $timeout.cancel(timer);
            var recursiveCalculate = function () {
                $scope.calc();
                timer = $timeout(recursiveCalculate, 600);
            };
            recursiveCalculate();
        }
        else {
            $timeout.cancel(timer);
        }
    };
    $scope.poly = [];
    $scope.poly[0] = new PolynomialField(constants.defaultPolynomialValue[0], Config, $scope, 'poly[0]');
    $scope.conf = Config;
    $scope.poly[1] = new PolynomialField(constants.defaultPolynomialValue[1], Config, $scope, 'poly[1]');
    $scope.ctrl = {
        add: function ($chip) {
            if (parseInt($chip) < Config.field) {
                return { value: $chip, index: NaN };
            }
            return null;
        }
    };
    $scope.poly[2] = new PolynomialField(constants.defaultPolynomialValue[2], Config, $scope, 'poly[2]');
    $scope.needToShowModulus = false;
    $scope.calc = function (forceCalc) {
        if (forceCalc === void 0) { forceCalc = false; }
        var tmpResult, result = $scope.currentOperation.texFunction($scope.poly[0], $scope.poly[1]);
        if (Config.enablePolynomialCompute && result.value > constants.modulus) {
            tmpResult = result;
            result = PolynomialField.mod(new PolynomialField(result.value, Config), new PolynomialField(constants.modulus, Config));
        }
        if ($scope.poly[2].decimal == result.value && $scope.steps == result.tex && !forceCalc)
            return;
        $scope.additionalSteps = "";
        $scope.poly[2].numberValue = result.value.toString(Config.displayOption);
        $scope.steps = result.tex;
        $scope.needToShowModulus = false;
        if (Config.enablePolynomialCompute && tmpResult) {
            $scope.additionalSteps = tmpResult.tex;
            $scope.needToShowModulus = true;
        }
        PolynomialField.updateAllMath();
    };
    $scope.sendResult = function () {
        $scope.poly[0].numberValue = $scope.poly[2].numberValue;
        PolynomialField.updateAllMath();
    };
    $scope.$on("$destroy", function () {
        $scope.poly.forEach(function (aPoly, index) {
            constants.defaultPolynomialValue[index] = aPoly.decimal;
            aPoly.remove();
        });
    });
});
//# sourceMappingURL=view1.js.map