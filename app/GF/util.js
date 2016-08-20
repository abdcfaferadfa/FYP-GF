/**
 * Created by  on 7/6/16.
 */
var Utility = (function () {
    function Utility() {
    }
    Utility.decimalNumberToPolynomial = function (value, degree) {
        var result = [];
        while (value > 0) {
            result.push(value % degree);
            value = Math.floor(value / degree);
        }
        return result;
    };
    Utility.StringArrayToDecimalNumber = function (array, degree) {
        return Utility.NumberArrayToDecimalNumber(array.map(function (value) {
            return parseInt(value);
        }), degree);
    };
    Utility.NumberArrayToDecimalNumber = function (array, degree) {
        var result = 0, accumulator = 1;
        array.forEach(function (value) {
            if (!isNaN(value)) {
                result += accumulator * value;
            }
            accumulator *= degree;
        });
        return result;
    };
    Utility.paddingPolynomials = function (Polynomials) {
        var max = [], finalStrings = [];
        Polynomials.forEach(function (polynomial, index) {
            polynomial.numberArray.forEach(function (value, index) {
                if (max[index] === void 0 || max[index] < value)
                    max[index] = value;
            });
        });
        Polynomials.forEach(function (polynomial) {
            var finalString = "", firstNoneZeroIndex = 0;
            while ((firstNoneZeroIndex < polynomial.numberArray.length) &&
                (polynomial.numberArray[firstNoneZeroIndex] === void 0 || polynomial.numberArray[firstNoneZeroIndex] == 0))
                firstNoneZeroIndex++;
            max.forEach(function (maxValue, index) {
                var xPower = "";
                switch (index) {
                    case 0:
                        xPower = "";
                        break;
                    case 1:
                        xPower = "x";
                        break;
                    default:
                        xPower = "x^{" + index.toString() + "}";
                }
                if (polynomial.numberArray[index] === void 0 || polynomial.numberArray[index] == 0) {
                    finalString = ("\\phantom{" + maxValue.toString() + xPower + "}\\phantom{+}") + finalString;
                }
                else {
                    var times = "";
                    if (polynomial.numberArray[index] == 1 && index != 0) {
                        times = "\\phantom{0}";
                    }
                    else
                        times = polynomial.numberArray[index].toString();
                    var plusSign = (index == firstNoneZeroIndex) ? "\\phantom{+}" : "{+}";
                    finalString = "\\phantom{" + maxValue.toString().substring(0, maxValue.toString().length - polynomial.numberArray[index].toString().length)
                        + "}" + times + xPower + plusSign + finalString;
                }
            });
            finalString = finalString.substring(0, finalString.length - 2) + "}";
            finalStrings.push(finalString);
        });
        return finalStrings;
    };
    Utility.polynomialInTexNoPadding = function (poly) {
        var coefficients = Utility.decimalNumberToPolynomial(poly.decimal, poly.config.field), str = "";
        coefficients.forEach(function (value, index, array) {
            if (value == 0)
                return;
            var xPower = "";
            switch (index) {
                case 0:
                    xPower = "1";
                    break;
                case 1:
                    xPower = "x";
                    break;
                default:
                    xPower = "x^{" + index.toString() + "}";
            }
            str = ("+ " + (value == 1 ? "" : value + "*") + " " + xPower) + str;
        });
        str = str.substring(1);
        return str;
    };
    return Utility;
}());
//# sourceMappingURL=util.js.map