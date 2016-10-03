/**
 * Created by Zhou on 7/6/16.
 */
var Configuration = (function () {
    function Configuration(field, displayOption, showDetailedSteps) {
        if (field === void 0) { field = 2; }
        if (displayOption === void 0) { displayOption = 10; }
        if (showDetailedSteps === void 0) { showDetailedSteps = true; }
        this.field = field;
        this.displayOption = displayOption;
        this.showDetailedSteps = showDetailedSteps;
        this.enableDivision = true;
        this.enablePolynomialCompute = true;
    }
    return Configuration;
}());
var PolynomialField = (function () {
    /**
     *
     * @param value decimal
     * @param configuration
     * @param scope
     * @param name
     */
    function PolynomialField(value, configuration, scope, name) {
        var _this = this;
        if (configuration === void 0) { configuration = new Configuration(); }
        this.chipArray = [];
        this._numberArray = [];
        if (typeof value === "number") {
            this.decimal = value;
        }
        else {
            this.decimal = Utility.StringArrayToDecimalNumber(value.map(function (value) { return value.toString(); }), configuration.field);
        }
        this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, configuration.field)
            .reverse().map(function (value, index, array) {
            return {
                value: value.toString(),
                index: array.length - index - 1
            };
        });
        this.config = configuration;
        if (scope && name) {
            scope.$watchCollection(name + ".chipArray", function () { return _this.syncChipToValue(); });
            PolynomialField.allPolynomial.push(this);
        }
    }
    Object.defineProperty(PolynomialField.prototype, "numberValue", {
        get: function () {
            return isNaN(this.decimal) || this.decimal == 0 ? "" : this.decimal.toString(this.config.displayOption);
        },
        set: function (decimal) {
            if (this.decimal == parseInt(decimal, this.config.displayOption))
                return;
            this.decimal = parseInt(decimal, this.config.displayOption);
            this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field)
                .reverse().map(function (value, index, array) {
                return {
                    value: value.toString(),
                    index: array.length - index - 1
                };
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolynomialField.prototype, "numberArray", {
        get: function () {
            if (Utility.NumberArrayToDecimalNumber(this._numberArray, this.config.field) == this.decimal)
                return this._numberArray;
            this._numberArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field);
            return this._numberArray;
        },
        set: function (newArray) {
            this.decimal = Utility.NumberArrayToDecimalNumber(newArray, this.config.field);
            this._numberArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field);
        },
        enumerable: true,
        configurable: true
    });
    PolynomialField.prototype.decimalInverseModulus = function (x) {
        for (var i = 1; i < this.config.field; i++) {
            if ((x * i) % this.config.field == 1)
                return i;
        }
    };
    PolynomialField.prototype.remove = function () {
        PolynomialField.allPolynomial.splice(PolynomialField.allPolynomial.indexOf(this), 1);
    };
    PolynomialField.updateAllMath = function () {
        if (!PolynomialField.mathUpdateInProgress && MathJax.Hub.queue.pending <= 1) {
            PolynomialField.mathUpdateInProgress = true;
            setTimeout(function () { return [PolynomialField.mathUpdateInProgress = false, MathJax.Hub.Queue(["Update", MathJax.Hub, window.document.body])]; }, 50);
        }
    };
    PolynomialField.prototype.syncValueToChip = function () {
        this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field)
            .reverse().map(function (value, index, array) {
            return {
                value: value.toString(),
                index: array.length - index - 1
            };
        });
    };
    PolynomialField.prototype.syncChipToValue = function () {
        this.decimal = Utility.StringArrayToDecimalNumber(this.chipArray
            .map(function (value, index, array) {
            return array[array.length - index - 1].value;
        }), this.config.field);
        this.chipArray.forEach(function (value, index, array) {
            value.index = array.length - 1 - index;
        });
        PolynomialField.updateAllMath();
    };
    PolynomialField.add = function (a, b) {
        var arr1 = Utility.decimalNumberToPolynomial(a.decimal, a.config.field), arr2 = Utility.decimalNumberToPolynomial(b.decimal, a.config.field);
        var length = Math.max(arr1.length, arr2.length), newValue = [];
        for (var i = 0; i < length; i++) {
            newValue[i] = ((arr1[i] ? arr1[i] : 0) + (arr2[i] ? arr2[i] : 0)) % a.config.field;
        }
        return new PolynomialField(newValue, a.config);
    };
    PolynomialField.addWithSteps = function (a, b) {
        var value = PolynomialField.add(a, b);
        var steps = Utility.paddingPolynomials([a, b, value]);
        return {
            value: value.decimal,
            tex: "\\begin{array}{add}\n            & " + steps[0] + "\\\\\n            + & \\underline{" + steps[1] + "}\\\\\n            &" + steps[2] + "\n            \\end{array}"
        };
    };
    PolynomialField.subtract = function (a, b) {
        var arr1 = Utility.decimalNumberToPolynomial(a.decimal, a.config.field), arr2 = Utility.decimalNumberToPolynomial(b.decimal, a.config.field);
        var length = Math.max(arr1.length, arr2.length), newValue = [];
        for (var i = 0; i < length; i++) {
            newValue[i] = ((arr1[i] ? arr1[i] : 0) + a.config.field - (arr2[i] ? arr2[i] : 0)) % a.config.field;
        }
        return new PolynomialField(newValue, a.config);
    };
    PolynomialField.subtractWithSteps = function (a, b) {
        var value = PolynomialField.subtract(a, b);
        var steps = Utility.paddingPolynomials([a, b, value]);
        return {
            value: value.decimal,
            tex: "\\begin{array}{sub}\n            & " + steps[0] + "\\\\\n            - & \\underline{" + steps[1] + "}\\\\\n            &" + steps[2] + "\n            \\end{array}"
        };
    };
    PolynomialField._multiply = function (a, b) {
        var steps = [], finalAns = [];
        for (var i = 0; i < a.numberArray.length + b.numberArray.length; i++)
            finalAns[i] = 0;
        steps.push(a);
        steps.push(b);
        b.numberArray.forEach(function (bValue, bIndex) {
            if (bValue == 0)
                return;
            var arr = [];
            for (var i = 0; i < bIndex; i++)
                arr[i] = 0;
            a.numberArray.forEach(function (aValue, aIndex) {
                arr[aIndex + bIndex] = (aValue * bValue) % a.config.field;
                finalAns[aIndex + bIndex] = (finalAns[aIndex + bIndex] == void 0) ?
                    aValue * bValue :
                    (aValue * bValue + finalAns[aIndex + bIndex]) % a.config.field;
            });
            steps.push(new PolynomialField(arr, a.config));
        });
        steps.push(new PolynomialField(finalAns, a.config));
        return steps;
    };
    PolynomialField.multiplyWithSteps = function (a, b) {
        var polys = PolynomialField._multiply(a, b);
        var steps = Utility.paddingPolynomials(polys);
        var result = "\\begin{array}{mul}\n           & " + steps[0] + "\\\\\n            * &\\underline{" + steps[1] + "}\\\\\n            ";
        for (var i = 2; i < steps.length - 2; i++) {
            result += "&" + steps[i] + " \\\\";
        }
        result += "\n            &\\underline{" + steps[steps.length - 2] + "}\\\\\n            &" + steps[steps.length - 1] + "\n            \\end{array}\n        ";
        return {
            value: polys[polys.length - 1].decimal,
            tex: result
        };
    };
    /**
     * return a div/mod b
     * @param divide
     * @param a
     * @param b
     */
    PolynomialField.divideAndModulus = function (divide, a, b) {
        var polys = [], arr1 = Utility.decimalNumberToPolynomial(a.decimal, a.config.field), arr2 = Utility.decimalNumberToPolynomial(b.decimal, b.config.field), ans = [], remainder = new PolynomialField(a.decimal, a.config);
        polys.push(b, a);
        for (var i = arr1.length - arr2.length; i >= 0; i--) {
            ans[i] = (a.decimalInverseModulus(arr2[arr2.length - 1]) *
                Utility.decimalNumberToPolynomial(remainder.decimal, a.config.field)[arr2.length + i - 1] % a.config.field);
            ans[i] = isNaN(ans[i]) ? 0 : ans[i];
            if (ans[i] == 0)
                continue;
            var subtractor = PolynomialField._multiply(b, new PolynomialField(Math.pow(a.config.field, i) * ans[i], a.config)).pop();
            polys.push(subtractor);
            remainder = PolynomialField.subtract(remainder, subtractor);
            polys.push(remainder);
        }
        polys.unshift(new PolynomialField(ans, a.config));
        var tex, steps = Utility.paddingPolynomials(polys);
        var divisor = Utility.polynomialInTexNoPadding(polys[1]);
        tex = "\\begin{array}{div}\n            & " + steps[0] + "\\\\\n            " + divisor + " & \\hspace{-0.5em} \\enclose{longdiv} {" + steps[2] + "}\\\\";
        for (var i = 3; i < steps.length; i += 2) {
            tex += "\n            & \\underline{" + steps[i] + "}\\\\\n            & {" + steps[i + 1] + "}\\\\";
        }
        tex += "\\end{array}";
        return {
            value: polys[divide ? 0 : polys.length - 1].decimal,
            tex: tex
        };
    };
    PolynomialField.AESCompute = function (a, b) {
        return PolynomialField.div(new PolynomialField(PolynomialField.multiplyWithSteps(new PolynomialField(parseInt(a, 16)), new PolynomialField(parseInt(b, 16))).value), new PolynomialField(283)).value;
    };
    PolynomialField.modulusInverse = function (num, modulus, result) {
        if (modulus.decimal == 1) {
            return [0, 1, num.decimal];
        }
        else {
            var quotient = PolynomialField.div(num, modulus).value, remainder = PolynomialField.mod(num, modulus).value;
            result.push({
                tex: num.numberValue + " \u00F7 " + modulus.numberValue + " =\n                 " + quotient.toString(num.config.displayOption) + " ... " + remainder.toString(num.config.displayOption) + "\n                 \\ \\Rightarrow  \\\n                " + remainder.toString(num.config.displayOption) + " = " + num.numberValue + " - \n                " + quotient.toString(num.config.displayOption) + " \u00D7 " + modulus.numberValue + " ",
                url: "1=" + num.decimal + "&2=" + modulus.decimal + "&op=3"
            });
            var arr = PolynomialField.modulusInverse(modulus, new PolynomialField(remainder, num.config), result), prod = PolynomialField.multiplyWithSteps(new PolynomialField(arr[1], num.config), new PolynomialField(quotient, num.config)).value;
            var x = arr[1], y = PolynomialField.subtract(new PolynomialField(arr[0], num.config), new PolynomialField(prod, num.config)).decimal, 
            // (arr[0] - Math.floor(num.decimal/modulus.decimal)*arr[1]),
            q = arr[2];
            var lastStep = "";
            if (arr[0] != 0) {
                var tex = "1 = " + arr[0].toString(num.config.displayOption) + " \u00D7 \\color{black}{" + modulus.numberValue + "} \n                - " + arr[1].toString(num.config.displayOption) + " \u00D7 \n                \\color{red}{(" + num.numberValue + " - \n                " + quotient.toString(num.config.displayOption) + " \u00D7 " + modulus.numberValue + ")}\n                \\\\ \\Rightarrow  \\\n                \n                1 = " + arr[1].toString(num.config.displayOption) + " \u00D7 \\color{black}{" + num.numberValue + "}\n                + (" + arr[0].toString(num.config.displayOption) + " +\n                \\color{blue}{" + arr[1].toString(num.config.displayOption) + " \u00D7 \n                " + quotient.toString(num.config.displayOption) + "})\n                \u00D7 \\color{black}{" + modulus.numberValue + "}\n                \\\\ \\Rightarrow  \\ ";
                lastStep = "1 = " + arr[1].toString(num.config.displayOption) + " \u00D7 \\color{black}{" + num.numberValue + "} \n                + (" + arr[0].toString(num.config.displayOption) + " +\n                \\color{blue}{" + prod.toString(num.config.displayOption) + "})\u00D7 \\color{black}{" + modulus.numberValue + "}";
                result.push({
                    tex: tex + lastStep,
                    url: "1=" + arr[1] + "&2=" + quotient + "&op=2"
                });
                lastStep = "1 = " + arr[1].toString(num.config.displayOption) + " \u00D7 \\color{black}{" + num.numberValue + "} \n                + (\\color{blue}{" + arr[0].toString(num.config.displayOption) + " +\n                " + prod.toString(num.config.displayOption) + "})\u00D7 \\color{black}{" + modulus.numberValue + "}\n                 \\\\ \\Rightarrow  \\ ";
                result.push({
                    tex: lastStep + ("\n                1 = " + x.toString(num.config.displayOption) + " \u00D7 \\color{black}{" + num.numberValue + "}  \n                - \\color{blue}{" + y.toString(num.config.displayOption) + "} \u00D7 \\color{red}{" + modulus.numberValue + "}"),
                    url: "1=" + arr[0] + "&2=" + prod + "&op=2"
                });
            }
            else {
                result.push({
                    tex: lastStep + ("\n                1 = " + x.toString(num.config.displayOption) + " \u00D7 \\color{black}{" + num.numberValue + "}  \n                - " + y.toString(num.config.displayOption) + " \u00D7 \\color{red}{" + modulus.numberValue + "}"),
                    url: "1=" + arr[0] + "&2=" + prod + "&op=0"
                });
            }
            return [x, y, q];
        }
    };
    PolynomialField.allPolynomial = [];
    PolynomialField.mathUpdateInProgress = false;
    PolynomialField.div = PolynomialField.divideAndModulus.bind({}, true);
    PolynomialField.mod = PolynomialField.divideAndModulus.bind({}, false);
    return PolynomialField;
}());
//# sourceMappingURL=PolynomialField.js.map