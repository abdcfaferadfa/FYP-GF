/**
 * Created by Zhou on 10/1/16.
 */

angular.module('myApp.sbox', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/sbox', {
            templateUrl: 'invmod/sbox.html',
            controller: 'sboxCtrl'
        });
    }])
    .controller("sboxCtrl", function ($scope, config: Configuration,
                                      constants, $timeout: ITimeoutService,
                                      $location: ILocationService) {
        config.field = 2;
        constants.degree = 8;
        constants.modulus = constants.irreduciblePolynomials[6];
        constants.modulusTex = constants.irreduciblePolynomialsTex[6];
        config.enablePolynomialCompute = true;
        config.enableDivision = true;


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
        $scope.matrixProduct = "";
        $scope.finalProcess = "";
        $scope.calc = function () {
            if (!config.enablePolynomialCompute) return;
            $scope.steps = [];
            $scope.result.numberValue = PolynomialField.modulusInverse(
                new PolynomialField(constants.modulus, config),
                $scope.poly, $scope.steps)[1].toString(config.displayOption);
            matrixTex();
            PolynomialField.updateAllMath();
        };
        $scope.calc();
        $scope.formatNumber = function (number: number, reverse = false) {
            var s = number.toString(2);
            while (s.length < 8) s = "0" + s;
            if (reverse) s = Array.from(s).reverse().join("");
            return `(${s.slice(0, 4)},${s.slice(4, 8)})_2`;
        };

        function matrixTex() {
            var content = "";
            constants.AES_AFFINE_MATRIX.forEach(function (value: number[]) {
                content += value.join(" & ") + "\\\\"
            });
            content = `\\left[ \\begin{matrix} ${content} \\end{matrix}\\right]`;
            var s = $scope.result.decimal.toString(2);
            while (s.length < 8) s = "0" + s;
            s = Array.from(s).reverse();
            content += `\\left[ \\begin{matrix} 
            ${s.join(" \\\\ ")}
         \\end{matrix}\\right] = `;
            var result = [];
            constants.AES_AFFINE_MATRIX.forEach(function (value) {
                var ans = 0;
                value.forEach(function (value2, index) {
                    ans = ans ^ (value2 & s[index]);
                });
                result.push(ans)
            });
            var intermediateResult = `\\left[ \\begin{matrix} 
            ${Array.from(result).reverse().join(" \\\\ ")}
         \\end{matrix}\\right]`;
            content += intermediateResult;
            $scope.matrixProduct = content;


        }

    });