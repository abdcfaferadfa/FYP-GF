
/**
 * Created by Zhou on 7/26/16.
 */
angular.module('myApp.view2')

    .controller('conversionCtrl', [ "$scope","config", "constants",
        function ($scope, config: Configuration, constants) {

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, window.document.body]);
            $scope.config = config;
            config.enablePolynomialCompute = false;
            constants.degree = "n";
            config.pageConfig = constants.PAGE_CONFIGURATIONS[0];

            $scope.poly = new PolynomialField(42, config, $scope, "poly");

            $scope.getDecimalToCoefficient = function (value:number) {
                if (isNaN(value) || value == null) return "";
                let str = "\\begin{array}{conv}", power = 0, tmpValue = value;
                while (config.field <= value) {
                    let currentXPower = power != 0 ? `* x^{${power}}` : "";
                    str += `${value} & = & ${config.field}* ${Math.floor(value / config.field)} + 
                    ${value % config.field} & …… ${value % config.field} ${currentXPower} \\\\`;
                    value = Math.floor(value / config.field);
                    power++;
                }
                let currentXPower = power != 0 ? `* x^{${power}}` : "";
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
            });
    }]);