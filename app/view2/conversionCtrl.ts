/**
 * Created by Zhou on 7/26/16.
 */
angular.module('myApp.view2')

    .controller('conversionCtrl', function ($scope, Config:Configuration) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, window.document.body]);
        $scope.number = 13;
        $scope.getDecimalToCoefficient = function (value:number) {
            if (isNaN(value) || value == null) return "";
            var str = "\\begin{array}{conv}", power = 0, tmpValue = value;
            while (Config.field <= value) {
                var currentXPower = power != 0 ? `* x^{${power}}` : "";
                str += `${value} & = & ${Config.field}* ${Math.floor(value / Config.field)} + 
                ${value % Config.field} & …… ${value % Config.field} ${currentXPower} \\\\`;
                value = Math.floor(value / Config.field);
                power++;
            }
            var currentXPower = power != 0 ? `* x^{${power}}` : "";
            str += `${value} & = & ${value} & …… ${value} ${currentXPower}\\\\ `;
            str += "\\end{array} \\\\";
            str += "Final Polynomial: \\ " + $scope.getPolynomial(tmpValue);
            return str;
        };
        $scope.getPolynomial = function (value:number) {
            return Utility.polynomialInTexNoPadding(new PolynomialField(value, Config));
        }
    });