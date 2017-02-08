'use strict';
import ILogService = angular.ILogService;
import ILogProvider = angular.ILogProvider;

angular.module('myApp.view2', ['ngRoute', 'Constants'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])
    .controller('View2Ctrl', ["$scope","$location","$log","config","constants","$timeout",
        function ($scope, $location: ILocationService,
                  $log: ILogService, config: Configuration, constants,$timeout: ITimeoutService) {

        config.pageConfig = constants.PAGE_CONFIGURATIONS[2];

        var urlData = $location.search();
        if (constants.urlLiteral in urlData) {
            var obj = {url: urlData[constants.urlLiteral]};
            if (constants.internalLiteral in urlData) {
                obj[constants.internalLiteral] = true;
            }
            constants.urlStack.push(obj);
            urlData[constants.urlLiteral] = null;
        }

        $scope.config = config;
        $scope.constants = constants;
        constants.inverseModulus = ($location.search()["val"] == void 0) ?
            constants.inverseModulus : parseInt($location.search()["val"]);
        $scope.poly = new PolynomialField(constants.inverseModulus, config, $scope, "poly",false);
        $scope.result = new PolynomialField(0, config, $scope, "result",false);

        let oldValue = $scope.poly.decimal;
        let timer;
        const recursiveCalculate = function () {
            let delay = 0;
            if (oldValue!=$scope.poly.decimal){
                oldValue = $scope.poly.decimal;
                $scope.calc();
                delay = constants.RENDERING_DELAY;
            }
            timer = $timeout(recursiveCalculate,constants.RECALCULATION_TIMEOUT+delay);
        };
        timer = $timeout(recursiveCalculate,constants.RECALCULATION_TIMEOUT);

        $scope.$on("$destroy", function () {
            $scope.poly.remove();
            $scope.result.remove();
            $timeout.cancel(timer);
        });
        $scope.choice = void 0;
        $scope.ctrl = config.ctrl;


        $scope.calc = function () {
            if (!config.enablePolynomialCompute ) return;
            $scope.steps = [];
            $scope.result.numberValue = PolynomialField.modulusInverse(
                new PolynomialField(constants.modulus, config),
                $scope.poly, $scope.steps)[1].toString(config.displayOption);
            PolynomialField.updateAllMath();
        };

        $scope.toDetail = function (para) {
            // $log.debug($location.url());
            $location.url(`/view1?url=view2%3fval%3d${$scope.poly.decimal}&internal&${para}`);
        };
        $scope.calc();


    }]);