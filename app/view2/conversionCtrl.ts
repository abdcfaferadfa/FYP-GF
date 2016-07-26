/**
 * Created by Zhou on 7/26/16.
 */
angular.module('myApp.view2')

    .controller('conversionCtrl', function ($scope, Config:Configuration) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, window.document.body]);
        $scope.getDecimalToCoefficient = function (value:number) {
            if (isNaN(value) || value == null) return "";
            var str = "\\begin{array}{conv}", power = 0;
            while (Config.field <= value) {
                var currentXPower = power != 0 ? `* x^{${power}}` : "";
                str += `${value} & = & ${Config.field}* ${Math.floor(value / Config.field)} + 
                ${value % Config.field} & …… ${value % Config.field} ${currentXPower} \\\\`;
                value = Math.floor(value / Config.field);
                power++;
            }
            var currentXPower = power != 0 ? `* x^{${power}}` : "";
            str += `${value} & = & ${value} & …… ${value} ${currentXPower}\\\\ `;
            str += "\\end{array} ";
            return str;
        };
        $scope.getPolynomial = function (value:number) {
            return Utility.paddingPolynomials([new PolynomialField(value, Config)]);
        }
    });