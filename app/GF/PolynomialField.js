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
        this.mathUpdateInProgress = false;
        if (typeof value === "number") {
            this.decimal = value;
            this.chipArray = Utility.decimalNumberToPolynomial(value, configuration.field).map(function (value, index) {
                return { value: value.toString(), index: index };
            });
        }
        else {
            this.decimal = Utility.StringArrayToDecimalNumber(value.map(function (value) { return value.toString(); }), configuration.field);
            this.chipArray = value.map(function (value, index) {
                return { value: value.toString(), index: index };
            });
        }
        this.config = configuration;
        if (scope && name) {
            scope.$watchCollection(name + ".chipArray", function () { return _this.syncChipToValue(); });
            PolynomialField.allPolynomial.push(this);
        }
    }
    Object.defineProperty(PolynomialField.prototype, "numberValue", {
        get: function () {
            return isNaN(this.decimal) || this.decimal == 0 ? "" : this.decimal.toString(this.config.displayOption);
            // return this.test*2;
        },
        set: function (decimal) {
            if (this.decimal == parseInt(decimal, this.config.displayOption))
                return;
            this.decimal = parseInt(decimal, this.config.displayOption);
            // this.test = parseInt(decimal) +1;
            // if (!this.decimalUpdateInProgress) {
            //     this.decimalUpdateInProgress = true;
            //     setTimeout(() => {
            this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field).map(function (value, index) {
                return { value: value.toString(), index: index };
            });
            // this.updateAllMath();
            //         this.decimalUpdateInProgress = false;
            //     },0);
            //
            // }
        },
        enumerable: true,
        configurable: true
    });
    PolynomialField.prototype.remove = function () {
        PolynomialField.allPolynomial.slice(PolynomialField.allPolynomial.indexOf(this), 1);
    };
    PolynomialField.prototype.updateAllMath = function () {
        var _this = this;
        if (!this.mathUpdateInProgress) {
            this.mathUpdateInProgress = true;
            setTimeout(function () { return [_this.mathUpdateInProgress = false, MathJax.Hub.Queue(["Reprocess", MathJax.Hub, window.document.body])]; }, 0);
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
        this.updateAllMath();
    };
    PolynomialField.add = function (a, b) {
        var arr1 = Utility.decimalNumberToPolynomial(a.decimal, a.config.field), arr2 = Utility.decimalNumberToPolynomial(b.decimal, a.config.field);
        var length = Math.max(arr1.length, arr2.length), newValue = [];
        for (var i = 0; i < length; i++) {
            newValue[i] = ((arr1[i] ? arr1[i] : 0) + (arr2[i] ? arr2[i] : 0)) % a.config.field;
        }
        return Utility.NumberArrayToDecimalNumber(newValue, a.config.field);
    };
    PolynomialField.addWithSteps = function (a, b) {
        var value = PolynomialField.add(a, b);
        var steps = Utility.paddingPolynomials([a, b, new PolynomialField(value, a.config)]);
        return {
            value: value,
            tex: "\\begin{array}{add}\n            & " + steps[0] + "\\\\\n            + & \\underline{" + steps[1] + "}\\\\\n            &" + steps[2] + "\n            \\end{array}"
        };
    };
    PolynomialField.subtract = function (a, b) {
        var arr1 = Utility.decimalNumberToPolynomial(a.decimal, a.config.field), arr2 = Utility.decimalNumberToPolynomial(b.decimal, a.config.field);
        var length = Math.max(arr1.length, arr2.length), newValue = [];
        for (var i = 0; i < length; i++) {
            newValue[i] = ((arr1[i] ? arr1[i] : 0) + a.config.field - (arr2[i] ? arr2[i] : 0)) % a.config.field;
        }
        return Utility.NumberArrayToDecimalNumber(newValue, a.config.field);
    };
    PolynomialField.subtractWithSteps = function (a, b) {
        var value = PolynomialField.subtract(a, b);
        var steps = Utility.paddingPolynomials([a, b, new PolynomialField(value, a.config)]);
        return {
            value: value,
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
    PolynomialField.multiplyWithSteps = function (polys) {
        var steps = Utility.paddingPolynomials(polys);
        var result = "\\begin{array}{mul}\n           & " + steps[0] + "\\\\\n            * &\\underline{" + steps[1] + "}\\\\\n            ";
        for (var i = 2; i < steps.length - 2; i++) {
            result += "&" + steps[i] + " \\\\";
        }
        result += "\n            &\\underline{" + steps[steps.length - 2] + "}\\\\\n            &" + steps[steps.length - 1] + "\n            \\end{array}\n        ";
        console.log(result);
        return result;
    };
    PolynomialField.allPolynomial = [];
    return PolynomialField;
}());
//# sourceMappingURL=PolynomialField.js.map