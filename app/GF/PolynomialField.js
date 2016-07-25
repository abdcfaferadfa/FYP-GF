/**
 * Created by Zhou on 7/6/16.
 */
var PolynomialField = (function () {
    /**
     *
     * @param value decimal
     * @param configuration
     * @param scope
     * @param name
     * @param temporaryVaribale
     */
    function PolynomialField(value, configuration, scope, name) {
        var _this = this;
        if (configuration === void 0) { configuration = new Configuration(); }
        this.chipArray = [];
        if (typeof value === "number") {
            this.decimal = value;
        }
        else {
            this.decimal = Utility.StringArrayToDecimalNumber(value.map(function (value) { return value.toString(); }), configuration.field);
        }
        this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, configuration.field).map(function (value, index) {
            return { value: value.toString(), index: index };
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
            this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field).map(function (value, index) {
                return { value: value.toString(), index: index };
            });
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
        PolynomialField.allPolynomial.slice(PolynomialField.allPolynomial.indexOf(this), 1);
    };
    PolynomialField.updateAllMath = function () {
        if (!PolynomialField.mathUpdateInProgress) {
            PolynomialField.mathUpdateInProgress = true;
            setTimeout(function () { return [PolynomialField.mathUpdateInProgress = false, MathJax.Hub.Queue(["Reprocess", MathJax.Hub, window.document.body])]; }, 50);
        }
    };
    PolynomialField.prototype.syncValueToChip = function () {
        this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field).map(function (value, index) {
            return { value: value.toString(), index: index };
        });
    };
    PolynomialField.prototype.syncChipToValue = function () {
        this.decimal = Utility.StringArrayToDecimalNumber(this.chipArray.map(function (value) {
            return value.value;
        }), this.config.field);
        this.chipArray.forEach(function (value, index) {
            value.index = index;
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
        for (var i = 0; i < a.chipArray.length + b.chipArray.length; i++)
            finalAns[i] = 0;
        steps.push(a);
        steps.push(b);
        b.chipArray.forEach(function (bChip, bIndex) {
            if (bChip.value == '0')
                return;
            var arr = [];
            for (var i = 0; i < bIndex; i++)
                arr[i] = 0;
            a.chipArray.forEach(function (aChip, aIndex) {
                arr[aIndex + bIndex] = (parseInt(aChip.value) * parseInt(bChip.value)) % a.config.field;
                finalAns[aIndex + bIndex] = ((finalAns[aIndex + bIndex] == void 0) ?
                    parseInt(aChip.value) * parseInt(bChip.value)
                    : parseInt(aChip.value) * parseInt(bChip.value) + finalAns[aIndex + bIndex]) % a.config.field;
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
     * @param operator
     * @param a
     * @param b
     */
    PolynomialField.divideAndModulus = function (divide, a, b) {
        var polys = [], arr1 = Utility.decimalNumberToPolynomial(a.decimal, a.config.field), arr2 = Utility.decimalNumberToPolynomial(b.decimal, b.config.field), ans = [], remainder = new PolynomialField(a.decimal, a.config);
        polys.push(a, b);
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
        var divisor = Utility.paddingPolynomials([polys[2]]);
        tex = "\\begin{array}{div}\n            & " + steps[0] + "\\\\\n            " + divisor + " & \\hspace{-0.5em} \\enclose{longdiv} {" + steps[1] + "}\\\\";
        for (var i = 3; i < steps.length; i += 2) {
            tex += "\n            & \\underline{" + steps[i] + "}\\\\\n            & {" + steps[i + 1] + "}\\\\";
        }
        tex += "\\end{array}";
        return {
            value: polys[divide ? 0 : polys.length - 1].decimal,
            tex: tex
        };
    };
    PolynomialField.allPolynomial = [];
    PolynomialField.mathUpdateInProgress = false;
    PolynomialField.div = PolynomialField.divideAndModulus.bind({}, true);
    PolynomialField.mod = PolynomialField.divideAndModulus.bind({}, false);
    return PolynomialField;
}());
//# sourceMappingURL=PolynomialField.js.map