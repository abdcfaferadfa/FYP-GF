/**
 * Created by Zhou on 7/6/16.
 */

/**
 * PolynomialField
 */


interface Chip {
    value:string,
    index:number
}

interface ResultWithSteps {
    value:number,
    tex:string
}

class PolynomialField {
    static allPolynomial:PolynomialField[] = [];
    config:Configuration;
    decimal:number;
    chipArray:Chip[] = [];
    private _numberArray:number[] = [];
    static mathUpdateInProgress = false;


    /**
     *
     * @param value decimal
     * @param configuration
     * @param scope
     * @param name
     */
    constructor(value:number | Array < number | string >, configuration:Configuration = new Configuration(),
                scope ?:IScope, name ?:string) {
        if (typeof value === "number") {
            this.decimal = value;
        } else {
            this.decimal = Utility.StringArrayToDecimalNumber(value.map(value => value.toString()), configuration.field);
        }
        this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, configuration.field)
            .reverse().map((value, index, array) => {
            return {
                value: value.toString(),
                index: array.length - index - 1
            }
        });
        this.config = configuration;
        if (scope && name) {
            scope.$watchCollection(name + ".chipArray", () => this.syncChipToValue());
            PolynomialField.allPolynomial.push(this);
        }
    }

    get numberValue():string {
        return isNaN(this.decimal) || this.decimal == 0 ? "" : this.decimal.toString(this.config.displayOption);
    }

    set numberValue(decimal:string) {
        if (this.decimal == parseInt(decimal, this.config.displayOption)) return;
        this.decimal = parseInt(decimal, this.config.displayOption);
        this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field)
            .reverse().map(function (value, index, array) {
            return {
                value: value.toString(),
                index: array.length - index - 1
            }
        });
    }

    get numberArray():number[] {
        if (Utility.NumberArrayToDecimalNumber(this._numberArray, this.config.field) == this.decimal) return this._numberArray;
        this._numberArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field);
        return this._numberArray;
    }

    set numberArray(newArray:number[]) {
        this.decimal = Utility.NumberArrayToDecimalNumber(newArray, this.config.field);
        this._numberArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field);
    }

    private decimalInverseModulus(x: number) {
        for (var i = 1; i < this.config.field; i++) {
            if ((x * i) % this.config.field == 1) return i;
        }
    }

    remove() {
        PolynomialField.allPolynomial.slice(PolynomialField.allPolynomial.indexOf(this), 1);
    }

    static updateAllMath() {
        if (!PolynomialField.mathUpdateInProgress && MathJax.Hub.queue.pending <= 1) {
            PolynomialField.mathUpdateInProgress = true;
            setTimeout(() => [PolynomialField.mathUpdateInProgress = false, MathJax.Hub.Queue(["Update", MathJax.Hub, window.document.body])], 50);
        }
    }

    syncValueToChip() {
        this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field)
            .reverse().map(function (value, index, array) {
            return {
                value: value.toString(),
                index: array.length - index - 1
            }
        });
    }

    syncChipToValue() {
        this.decimal = Utility.StringArrayToDecimalNumber(this.chipArray
            .map(function (value, index, array) {
                return array[array.length - index - 1].value;
        }), this.config.field);

        this.chipArray.forEach(function (value:Chip, index:number, array) {
            value.index = array.length - 1 - index;
        });
        PolynomialField.updateAllMath()
    }


    static add(a:PolynomialField, b:PolynomialField):PolynomialField {
        var arr1 = Utility.decimalNumberToPolynomial(a.decimal, a.config.field),
            arr2 = Utility.decimalNumberToPolynomial(b.decimal, a.config.field);

        var length = Math.max(arr1.length, arr2.length),
            newValue = [];
        for (var i = 0; i < length; i++) {
            newValue[i] = ((arr1[i] ? arr1[i] : 0) + (arr2[i] ? arr2[i] : 0)) % a.config.field;
        }
        return new PolynomialField(newValue, a.config);
    }

    static addWithSteps(a:PolynomialField, b:PolynomialField):ResultWithSteps {
        var value = PolynomialField.add(a, b);
        var steps = Utility.paddingPolynomials([a, b, value]);
        return {
            value: value.decimal,
            tex: `\\begin{array}{add}
            & ${steps[0]}\\\\
            + & \\underline{${steps[1]}}\\\\
            &${steps[2]}
            \\end{array}`
        }
    }

    static subtract(a:PolynomialField, b:PolynomialField):PolynomialField {
        var arr1 = Utility.decimalNumberToPolynomial(a.decimal, a.config.field),
            arr2 = Utility.decimalNumberToPolynomial(b.decimal, a.config.field);

        var length = Math.max(arr1.length, arr2.length),
            newValue = [];
        for (var i = 0; i < length; i++) {
            newValue[i] = ((arr1[i] ? arr1[i] : 0) + a.config.field - (arr2[i] ? arr2[i] : 0)) % a.config.field;
        }
        return new PolynomialField(newValue, a.config);
    }

    static subtractWithSteps(a:PolynomialField, b:PolynomialField):ResultWithSteps {
        var value = PolynomialField.subtract(a, b);
        var steps = Utility.paddingPolynomials([a, b, value]);
        return {
            value: value.decimal,
            tex: `\\begin{array}{sub}
            & ${steps[0]}\\\\
            - & \\underline{${steps[1]}}\\\\
            &${steps[2]}
            \\end{array}`
        }
    }

    static _multiply(a:PolynomialField, b:PolynomialField):PolynomialField[] {
        var steps:PolynomialField[] = [],
            finalAns:number[] = [];
        for (var i = 0; i < a.numberArray.length + b.numberArray.length; i++) finalAns[i] = 0;
        steps.push(a);
        steps.push(b);
        b.numberArray.forEach(function (bValue:number, bIndex:number) {
            if (bValue == 0) return;
            var arr:number[] = [];
            for (var i = 0; i < bIndex; i++) arr[i] = 0;
            a.numberArray.forEach(function (aValue:number, aIndex:number) {
                arr[aIndex + bIndex] = (aValue * bValue) % a.config.field;
                finalAns[aIndex + bIndex] = (finalAns[aIndex + bIndex] == void 0) ?
                aValue * bValue :
                (aValue * bValue + finalAns[aIndex + bIndex]) % a.config.field;

            });
            steps.push(new PolynomialField(arr, a.config));
        });
        steps.push(new PolynomialField(finalAns, a.config));
        return steps;
    }

    static multiplyWithSteps(a:PolynomialField, b:PolynomialField):ResultWithSteps {
        var polys = PolynomialField._multiply(a, b);
        var steps = Utility.paddingPolynomials(polys);
        var result = `\\begin{array}{mul}
           & ${steps[0]}\\\\
            * &\\underline{${steps[1]}}\\\\
            `;
        for (var i = 2; i < steps.length - 2; i++) {
            result += `&${steps[i]} \\\\`;
        }
        result += `
            &\\underline{${steps[steps.length - 2]}}\\\\
            &${steps[steps.length - 1]}
            \\end{array}
        `;
        return {
            value: polys[polys.length - 1].decimal,
            tex: result
        };
    }

    /**
     * return a div/mod b
     * @param divide
     * @param a
     * @param b
     */
    private static divideAndModulus(divide:boolean, a:PolynomialField, b:PolynomialField):ResultWithSteps {
        var polys:PolynomialField[] = [],
            arr1 = Utility.decimalNumberToPolynomial(a.decimal, a.config.field),
            arr2 = Utility.decimalNumberToPolynomial(b.decimal, b.config.field),
            ans:number[] = [],
            remainder = new PolynomialField(a.decimal, a.config);
        polys.push(b, a);
        for (var i = arr1.length - arr2.length; i >= 0; i--) {
            ans[i] = (a.decimalInverseModulus(arr2[arr2.length - 1]) *
            Utility.decimalNumberToPolynomial(remainder.decimal, a.config.field)[arr2.length + i - 1] % a.config.field);
            ans[i] = isNaN(ans[i]) ? 0 : ans[i];
            if (ans[i] == 0) continue;
            var subtractor = PolynomialField._multiply(b, new PolynomialField(Math.pow(a.config.field, i) * ans[i], a.config)).pop();
            polys.push(subtractor);
            remainder = PolynomialField.subtract(remainder, subtractor);
            polys.push(remainder);
        }
        polys.unshift(new PolynomialField(ans, a.config));

        var tex:string, steps = Utility.paddingPolynomials(polys);
        var divisor = Utility.polynomialInTexNoPadding(polys[1]);
        tex = `\\begin{array}{div}
            & ${steps[0]}\\\\
            ${divisor} & \\hspace{-0.5em} \\enclose{longdiv} {${steps[2]}}\\\\`;
        for (var i = 3; i < steps.length; i += 2) {
            tex += `
            & \\underline{${steps[i]}}\\\\
            & {${steps[i+1]}}\\\\`
        }
        tex += `\\end{array}`;
        return {
            value: polys[divide ? 0 : polys.length - 1].decimal,
            tex: tex
        }
    }

    static div = PolynomialField.divideAndModulus.bind({}, true);
    static mod = PolynomialField.divideAndModulus.bind({}, false);


}