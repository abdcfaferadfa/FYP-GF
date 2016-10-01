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
    .controller("sboxCtrl", function ($scope, config, constants, $timeout, $location) {
    $scope.config = config;
    $scope.constants = constants;
    var urlData = $location.search();
    if (constants.urlLiteral in urlData) {
        config.displayOption = 16;
        var obj = { url: urlData[constants.urlLiteral] };
        if (constants.internalLiteral in urlData) {
            obj[constants.internalLiteral] = true;
        }
        constants.urlStack.push(obj);
        urlData[constants.urlLiteral] = null;
    }
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
        config.field = 2;
        constants.degree = 8;
        constants.modulus = constants.irreduciblePolynomials[6];
        constants.modulusTex = constants.irreduciblePolynomialsTex[6];
        config.enablePolynomialCompute = true;
        config.enableDivision = true;
        $scope.steps = [];
        $scope.result.numberValue = PolynomialField.modulusInverse(new PolynomialField(constants.modulus, config), $scope.poly, $scope.steps)[1].toString(config.displayOption);
        matrixTex();
        PolynomialField.updateAllMath();
    };
    $scope.calc();
    $scope.formatNumber = function (number, reverse) {
        if (reverse === void 0) { reverse = false; }
        var s = number.toString(2);
        while (s.length < 8)
            s = "0" + s;
        if (reverse)
            s = Array.from(s).reverse().join("");
        return "(" + s.slice(0, 4) + "," + s.slice(4, 8) + ")_2";
    };
    function matrixTex() {
        var content = "";
        constants.AES_AFFINE_MATRIX.forEach(function (value) {
            content += value.join(" & ") + "\\\\";
        });
        content = "\\left[ \\begin{matrix} " + content + " \\end{matrix}\\right]";
        var s = $scope.result.decimal.toString(2);
        while (s.length < 8)
            s = "0" + s;
        s = Array.from(s).reverse();
        content += "\\left[ \\begin{matrix} \n            " + s.join(" \\\\ ") + "\n         \\end{matrix}\\right] = ";
        var result = [];
        constants.AES_AFFINE_MATRIX.forEach(function (value) {
            var ans = 0;
            value.forEach(function (value2, index) {
                ans = ans ^ (value2 & s[index]);
            });
            result.push(ans);
        });
        var intermediateResult = "\\left[ \\begin{matrix} \n            " + Array.from(result).join(" \\\\ ") + "\n         \\end{matrix}\\right]";
        content += intermediateResult;
        $scope.matrixProduct = content;
        $scope.intermediateResult = parseInt(Array.from(result).join(""), 2);
        result.forEach(function (value, index, array) {
            result[index] ^= constants.AES_FINAL_VECTOR[index];
        });
        $scope.finalProcess = intermediateResult + " \\oplus \n                \\left[ \\begin{matrix} \n                    " + Array.from(constants.AES_FINAL_VECTOR).join(" \\\\ ") + "\n                 \\end{matrix}\\right] = \n                 \\left[ \\begin{matrix} \n                    " + Array.from(result).join(" \\\\ ") + "\n                 \\end{matrix}\\right]";
        $scope.sboxResult = parseInt(Array.from(result).reverse().join(""), 2);
    }
    $scope.redirect = function () {
        $location.url("/view2?url=sbox%3fval%3d" + $scope.poly.decimal + "&internal&val=" + $scope.poly.decimal);
    };
});
//# sourceMappingURL=sbox.js.map