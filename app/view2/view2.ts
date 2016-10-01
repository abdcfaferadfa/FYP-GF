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
    .controller('View2Ctrl', function ($scope, $location: ILocationService,
                                       $log: ILogService, config: Configuration, constants) {
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
        $scope.poly = new PolynomialField(constants.inverseModulus, config, $scope, "poly");
        $scope.result = new PolynomialField(0, config, $scope, "result");

        $scope.$on("$destroy", function () {
            $scope.poly.remove();
            $scope.result.remove();
        });
        $scope.choice = void 0;
        $scope.ctrl = {
            add: function ($chip) {
                if (parseInt($chip) < config.field) {
                    return {value: $chip, index: NaN}
                }
                return null;
            }
        };

        $scope.calc = function () {
            if (!config.enablePolynomialCompute) return;
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


    });