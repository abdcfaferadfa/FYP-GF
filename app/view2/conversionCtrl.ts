/**
 * Created by Zhou on 7/26/16.
 */
angular.module('myApp.view2')

    .controller('conversionCtrl', function ($scope, config: Configuration) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, window.document.body]);
        $scope.poly = new PolynomialField(13, config, $scope, "poly");
        $scope.getDecimalToCoefficient = function (value:number) {
            if (isNaN(value) || value == null) return "";
            var str = "\\begin{array}{conv}", power = 0, tmpValue = value;
            while (config.field <= value) {
                var currentXPower = power != 0 ? `* x^{${power}}` : "";
                str += `${value} & = & ${config.field}* ${Math.floor(value / config.field)} + 
                ${value % config.field} & …… ${value % config.field} ${currentXPower} \\\\`;
                value = Math.floor(value / config.field);
                power++;
            }
            var currentXPower = power != 0 ? `* x^{${power}}` : "";
            str += `${value} & = & ${value} & …… ${value} ${currentXPower}\\\\ `;
            str += "\\end{array} \\\\";
            str += "Final Polynomial: \\ " + $scope.getPolynomial(tmpValue);
            return str;
        };
        $scope.getPolynomial = function (value:number) {
            return Utility.polynomialInTexNoPadding(new PolynomialField(value, config));
        };
        $scope.$on("$destroy", function () {
            $scope.poly.remove();
        })
    });