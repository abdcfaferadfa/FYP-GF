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
    static mathUpdateInProgress = false;


    /**
     *
     * @param value decimal
     * @param configuration
     * @param scope
     * @param name
     */
    constructor(value:number | Array<number|string>, configuration:Configuration = new Configuration(),
                scope?:IScope, name?:string) {
        if (typeof value === "number") {
            this.decimal = value;
        } else {
            this.decimal = Utility.StringArrayToDecimalNumber(value.map(value => value.toString()), configuration.field);
        }
        this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, configuration.field).map((value, index) => {
            return {value: value.toString(), index: index}
        });
        this.config = configuration;
        if (scope && name) {
            scope.$watchCollection(name + ".chipArray", ()=> this.syncChipToValue());
            PolynomialField.allPolynomial.push(this);
        }
    }

    get numberValue():string {
        return isNaN(this.decimal) || this.decimal == 0 ? "" : this.decimal.toString(this.config.displayOption);
    }

    set numberValue(decimal:string) {
        if (this.decimal == parseInt(decimal, this.config.displayOption)) return;
        this.decimal = parseInt(decimal, this.config.displayOption);
        this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field).map(function (value, index) {
            return {value: value.toString(), index: index}
        });
    }

    private decimalInverseModulus(x: number) {
        for(var i=1;i<this.config.field;i++){
            if ((x*i)%this.config.field==1) return i;
        }
    }

    remove() {
        PolynomialField.allPolynomial.slice(PolynomialField.allPolynomial.indexOf(this), 1);
    }

    static updateAllMath() {
        if (!PolynomialField.mathUpdateInProgress && MathJax.Hub.queue.pending == 0) {
            PolynomialField.mathUpdateInProgress = true;
            setTimeout(() => [PolynomialField.mathUpdateInProgress = false, MathJax.Hub.Queue(["Reprocess", MathJax.Hub, window.document.body])]
                , 50);
        }
    }

    syncValueToChip() {
        this.chipArray = Utility.decimalNumberToPolynomial(this.decimal, this.config.field).map(function (value, index) {
            return {value: value.toString(), index: index}
        });
    }

    syncChipToValue() {
        this.decimal = Utility.StringArrayToDecimalNumber(this.chipArray.map(function (value) {
            return value.value;
        }), this.config.field);

        this.chipArray.forEach(function (value:Chip, index:number) {
            value.index = index;
        });
        PolynomialField.updateAllMath()
    }


    static add(a:PolynomialField, b:PolynomialField):PolynomialField {
        var arr1 = Utility.decimalNumberToPolynomial(a.decimal, a.config.field),
            arr2 = Utility.decimalNumberToPolynomial(b.decimal, a.config.field);

        var length = Math.max(arr1.length, arr2.length), newValue = [];
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

        var length = Math.max(arr1.length, arr2.length), newValue = [];
        for (var i = 0; i < length; i++) {
            newValue[i] = ((arr1[i] ? arr1[i] : 0) + a.config.field - (arr2[i] ? arr2[i] : 0)) % a.config.field;
        }
        return new PolynomialField(newValue, a.config);
    }

    static subtractWithSteps(a:PolynomialField, b:PolynomialField) :ResultWithSteps{
        var value = PolynomialField.subtract(a,b);
        var steps = Utility.paddingPolynomials([a,b, value]);
        return{
            value : value.decimal,
            tex : `\\begin{array}{sub}
            & ${steps[0]}\\\\
            - & \\underline{${steps[1]}}\\\\
            &${steps[2]}
            \\end{array}`
        }
    }

     static _multiply(a:PolynomialField, b:PolynomialField):PolynomialField[] {
        var steps:PolynomialField[] = [], finalAns:number[] = [];
        for (var i = 0; i < a.chipArray.length + b.chipArray.length; i++) finalAns[i] = 0;
        steps.push(a);
        steps.push(b);
        b.chipArray.forEach(function (bChip:Chip, bIndex:number) {
            if (bChip.value == '0') return;
            var arr:number[] = [];
            for (var i = 0; i < bIndex; i++)arr[i] = 0;
            a.chipArray.forEach(function (aChip:Chip, aIndex:number) {
                arr[aIndex + bIndex] = (parseInt(aChip.value) * parseInt(bChip.value)) % a.config.field;
                finalAns[aIndex + bIndex] = ( (finalAns[aIndex + bIndex] == void 0) ?
                    parseInt(aChip.value) * parseInt(bChip.value)
                        : parseInt(aChip.value) * parseInt(bChip.value) + finalAns[aIndex + bIndex]) % a.config.field;

            });
            steps.push(new PolynomialField(arr, a.config));
        });
        steps.push(new PolynomialField(finalAns, a.config));
        return steps;
    }

    static multiplyWithSteps(a:PolynomialField, b:PolynomialField):ResultWithSteps {
        var polys = PolynomialField._multiply(a,b);
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
            value : polys[polys.length-1].decimal,
            tex: result
        };
    }

    /**
     * return a div/mod b
     * @param divide
     * @param a
     * @param b
     */
    private static divideAndModulus(divide: boolean,a:PolynomialField,b:PolynomialField):ResultWithSteps{
        var polys : PolynomialField[] = [],
            arr1 = Utility.decimalNumberToPolynomial(a.decimal,a.config.field),
            arr2 = Utility.decimalNumberToPolynomial(b.decimal,b.config.field),
            ans :number[]= [],
            remainder = new PolynomialField(a.decimal,a.config);
        polys.push(a,b);
        for(var i = arr1.length-arr2.length;i>=0;i--){
            ans[i] = (a.decimalInverseModulus(arr2[arr2.length-1])*
            Utility.decimalNumberToPolynomial(remainder.decimal,a.config.field)[arr2.length+i-1] % a.config.field);
            ans[i] = isNaN(ans[i])?0:ans[i];
            if (ans[i]==0) continue;
            var subtractor = PolynomialField._multiply(b
                ,new PolynomialField(Math.pow(a.config.field,i)*ans[i],a.config)).pop();
            polys.push(subtractor);
            remainder = PolynomialField.subtract(remainder,subtractor);
            polys.push(remainder);
        }
        polys.unshift(new PolynomialField(ans,a.config));

        var tex :string,steps = Utility.paddingPolynomials(polys);
        var divisor = Utility.paddingPolynomials([polys[2]]);
        tex = `\\begin{array}{div}
            & ${steps[0]}\\\\
            ${divisor} & \\hspace{-0.5em} \\enclose{longdiv} {${steps[1]}}\\\\`;
        for(var i=3;i<steps.length;i+=2){
            tex += `
            & \\underline{${steps[i]}}\\\\
            & {${steps[i+1]}}\\\\`
        }
        tex += `\\end{array}`;
        return {
            value : polys[divide?0:polys.length-1].decimal,
            tex : tex
        }
    }

    static div = PolynomialField.divideAndModulus.bind({},true);
    static mod = PolynomialField.divideAndModulus.bind({},false);
//     static divide(f : PolynomialField, g :PolynomialField, div : number[] = []) : PolynomialField[] {
//     // Calculating a degree of each polynom
//     var degreeF = f.value.length;
//     var degreeG = g.value.length;
//
//     // Integer division part
//     if(div === undefined) {
//         div = [];
//     }
//
//     // When degree of f (divident) is less than degree of g (divisor) than
//     // modulo is simply f
//     if (degreeF < degreeG) {
//         return [new PolynomialField(0), f];
//     }
//
//     // Constructs an array for divisor polynom
//     var divisor = Array(degreeF + 1);
//
//     // Now we are trying to build polynom which will decrease the divident
//     // degree by one. To do that we shift divisor and multiply all its
//     // coefficient by special element(to fill highest coefficient of the
//     // divident(f) with null.
//     div.unshift(config.mul(f.coef(degreeF),
//         config.inv(g.coef(degreeG))));
//
//     var i;
//     for (i = 0; i <= degreeF; ++i) {
//         if (i >= degreeF - degreeG) {
//             var j = (i - degreeF + degreeG);
//             // Doing all transformation with coefficients(in config
//             // arithmetics of course)
//             var coef = config.mul(g.coef(j), div[0]);
//
//             divisor[i] = config.opp(coef);
//         }
//         // This will make shift
//         else {
//             divisor[i] = 0;
//         }
//     }
//
//     // Now adding this stuff to f and repeat this algorithm with a new,
//     // 'less-degreeful' divident
//     var dividedF = this.add(f, this.polynom(divisor));
//
//     // Don't forget to add nulls, if degree difference is more than one
//     if(dividedF.degree() !== -Infinity) {
//         var degreeDifference = f.degree() - dividedF.degree() - 1;
//
//         for(i = 0; i < degreeDifference; ++i) {
//             div.unshift(this.config.nullElement());
//         }
//     }
//
//     // Repeating algorithm
//     return this.divmod(dividedF, g, div);
// };

}

