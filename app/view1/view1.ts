import IDirectivePrePost = angular.IDirectivePrePost;
import ITimeoutService = angular.ITimeoutService;
import IPromise = angular.IPromise;
import ILocation = webdriver.ILocation;
import ILocationService = angular.ILocationService;
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

    .controller('View1Ctrl',["$scope", "config", "constants","$timeout", "$location",
        function ($scope,
                  config: Configuration,
                  constants,
                  $timeout: ITimeoutService,
                  $location: ILocationService) {
        var allOperations = constants.ALL_OPERATIONS_INCLUDE_DISION;

        config.pageConfig = constants.PAGE_CONFIGURATIONS[1];


        $scope.$watch(() => config.enableDivision, function () {
            allOperations = config.enableDivision ? constants.ALL_OPERATIONS_INCLUDE_DISION : constants.ALL_OPERATIONS_WITHOUT_DIVISION;
            $scope.currentOperation = allOperations[0];
            $scope.remainingOperations = allOperations.slice(1,allOperations.length);
            $scope.changeOperation(allOperations[(urlData["op"] == void 0 ? 0 : parseInt(urlData["op"])) % allOperations.length])
        });

        $scope.changeOperation = function (operation : Operation) {
            $scope.currentOperation = operation;
            var index = allOperations.indexOf(operation);
            $scope.remainingOperations = allOperations.slice(0,index).concat(allOperations.slice(index+1,allOperations.length));
        };


        var urlData = $location.search();
        constants.defaultPolynomialValue[0] = (urlData["1"] == void 0) ?
            constants.defaultPolynomialValue[0] : parseInt(urlData["1"]);
        constants.defaultPolynomialValue[1] = (urlData["2"] == void 0) ?
            constants.defaultPolynomialValue[1] : parseInt(urlData["2"]);

        if (constants.urlLiteral in urlData) {
            var obj = {url: urlData[constants.urlLiteral]};
            if (constants.internalLiteral in urlData) {
                obj[constants.internalLiteral] = true;
            }
            constants.urlStack.push(obj);
            urlData[constants.urlLiteral] = null;
            // $location.search(constants.urlLiteral,null);
            // $location.search(constants.internalLiteral,null);
        }



        var timer:IPromise<any>;
        $scope.autoCompute = false;
        $scope.toggleAutoCompute = function () {
            if ($scope.autoCompute) {
                $timeout.cancel(timer);
                var recursiveCalculate = function () {
                    $scope.calc();
                    timer = $timeout(recursiveCalculate, 600)
                };
                recursiveCalculate();
            } else {
                $timeout.cancel(timer);
            }
        };

        $timeout(function () {
            $scope.autoCompute = true;
            $scope.toggleAutoCompute();
        }, 0);

        $scope.poly = [];
        $scope.poly[0] = new PolynomialField(constants.defaultPolynomialValue[0], config, $scope, 'poly[0]');
        $scope.conf = config;
        $scope.poly[1] = new PolynomialField(constants.defaultPolynomialValue[1], config, $scope, 'poly[1]');
        $scope.ctrl = {
            add: function ($chip) {
                if (parseInt($chip) < config.field) {
                    return {value: $chip, index: NaN}
                }
                return null;
            }
        };

        $scope.poly[2] = new PolynomialField(constants.defaultPolynomialValue[2], config, $scope, 'poly[2]',false);
        $scope.needToShowModulus = false;

        $scope.calc = function (forceCalc = false) {
            var tmpResult, result = $scope.currentOperation.texFunction($scope.poly[0], $scope.poly[1]);

            if (config.enablePolynomialCompute && result.value > Math.pow(2, constants.degree)) {
                tmpResult = result;
                result = PolynomialField.mod(new PolynomialField(result.value, config), new PolynomialField(constants.modulus, config))
            }
            if ($scope.poly[2].decimal == result.value && $scope.steps == result.tex && !forceCalc) return;
            $scope.additionalSteps = "";
            $scope.poly[2].numberValue = result.value.toString(config.displayOption);
            $scope.steps = result.tex;
            $scope.needToShowModulus = false;
            if (config.enablePolynomialCompute && tmpResult) {
                $scope.additionalSteps = tmpResult.tex;
                $scope.needToShowModulus = true;
            }

            PolynomialField.updateAllMath();
        };


        $scope.sendResult = function () {
            $scope.poly[0].numberValue = $scope.poly[2].numberValue;
            PolynomialField.updateAllMath();
        };


        $scope.$on("$destroy",function () {
            $scope.poly.forEach(function (aPoly:PolynomialField,index:number) {
                constants.defaultPolynomialValue[index] = aPoly.decimal;
                aPoly.remove();
            });
            $timeout.cancel(timer);
        })


    }]);