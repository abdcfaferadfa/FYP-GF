/**
 * Created by  on 7/6/16.
 */
class Utility{

    static decimalNumberToPolynomial(value : number, degree : number) : number[]{
        let result: number[] = [];
        while (value>0){
            result.push(value % degree);
            value = Math.floor(value/degree);
        }
        return result;
    }

    static StringArrayToDecimalNumber(array : string[], degree : number) :number{
        return Utility.NumberArrayToDecimalNumber(
            array.map(function (value) {
                return parseInt(value);
            }),degree
        );
    }

    static NumberArrayToDecimalNumber(array :number[], degree :number):number{
        var result = 0, accumulator = 1;
        array.forEach(function (value) {
            if (!isNaN(value)) {
                result += accumulator * value;
            }
            accumulator *= degree;
        });
        return result;
    }

    static paddingPolynomials(Polynomials : PolynomialField[]): string[]{
        var max : number[] = [], finalStrings :string[]= [];

        Polynomials.forEach(function (polynomial :PolynomialField, index :number) {
            polynomial.chipArray.forEach(function (chip : Chip,index:number) {
                if (max[index] === void 0 || max[index] < parseInt(chip.value)) max[index] = parseInt(chip.value);
            })
        });
        Polynomials.forEach(function (polynomial : PolynomialField) {
            var finalString = "";
            max.forEach(function (maxValue : number, index: number){
                var  xPower = "";
                switch (index){
                    case 0:
                        xPower = "";
                        break;
                    case 1:
                        xPower = "x";
                        break;
                    default:
                        xPower ="x^{" + index.toString() + "}";
                }
                if (polynomial.chipArray[index] === void 0 || polynomial.chipArray[index].value=="0") {
                    finalString = `\\phantom{${maxValue.toString()}${xPower}}\\phantom{+}`+finalString;
                }
                else{
                    var times = "";
                    if (polynomial.chipArray[index].value=="1" && index!=0){
                        times = "\\phantom{0}";
                    }
                    else times =polynomial.chipArray[index].value;
                finalString = "\\phantom{"+maxValue.toString().substring(0,maxValue.toString().length-polynomial.chipArray[index].value.length)
                    +"}"+times+xPower +"{+}"+ finalString;
                }

            });
            finalString = finalString.substring(0,finalString.length-2)+"}";
            finalStrings.push(finalString);
        });
        return finalStrings;
    }
    
}