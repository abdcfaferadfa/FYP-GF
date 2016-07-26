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
            polynomial.chipArray.forEach(function (chip, index) {
                if (max[index] === void 0 || max[index] < parseInt(chip.value))
                    max[index] = parseInt(chip.value);
            });
        });
        Polynomials.forEach(function (polynomial) {
            var finalString = "", firstNoneZeroIndex = 0;
            while ((firstNoneZeroIndex < polynomial.chipArray.length) &&
                (polynomial.chipArray[firstNoneZeroIndex] === void 0 || polynomial.chipArray[firstNoneZeroIndex].value == "0"))
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
                if (polynomial.chipArray[index] === void 0 || polynomial.chipArray[index].value == "0") {
                    finalString = ("\\phantom{" + maxValue.toString() + xPower + "}\\phantom{+}") + finalString;
                }
                else {
                    var times = "";
                    if (polynomial.chipArray[index].value == "1" && index != 0) {
                        times = "\\phantom{0}";
                    }
                    else
                        times = polynomial.chipArray[index].value;
                    var plusSign = (index == firstNoneZeroIndex) ? "\\phantom{+}" : "{+}";
                    finalString = "\\phantom{" + maxValue.toString().substring(0, maxValue.toString().length - polynomial.chipArray[index].value.length)
                        + "}" + times + xPower + plusSign + finalString;
                }
            });
            finalString = finalString.substring(0, finalString.length - 2) + "}";
            finalStrings.push(finalString);
        });
        return finalStrings;
    };
    return Utility;
}());
//# sourceMappingURL=util.js.map