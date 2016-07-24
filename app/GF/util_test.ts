/**
 * Created by Zhou on 7/7/16.
 */

 
describe("Utility tests", function () {
    beforeAll(function () {
       new Utility();
    });
    it("should be able to convert decimal value to array", function () {
        expect(Utility.decimalNumberToPolynomial(3, 2)).toEqual([1, 1]);
        expect(Utility.decimalNumberToPolynomial(5, 3)).toEqual([2 , 1]);//2+1*3 =5
        expect(Utility.decimalNumberToPolynomial(120, 7)).toEqual([1, 3, 2]); // 1+3*7+7*7*2=120
    });

    it("can convert string array to decimal value", function () {
        expect(Utility.StringArrayToDecimalNumber(
            "1 1".split(" ") ,2  //["1","1"],2 1+2*1=3
        )).toEqual(3);
        expect(Utility.StringArrayToDecimalNumber(
            "1 3 2".split(" "),7
        )).toEqual(120);
    });

    it("can convert number array to decimal value",function () {
        expect(Utility.NumberArrayToDecimalNumber([1,3,2],7)).toEqual(120);
        expect(Utility.NumberArrayToDecimalNumber([1,undefined,0],2)).toEqual(1);
    });

    describe("can generate padded LaTex based on given polynomials",function () {
        var poly,poly2,resultStrings: string[];
        beforeEach(function () {
            poly = new PolynomialField(7);
            poly2 = new PolynomialField(5);
            resultStrings = Utility.paddingPolynomials([poly,poly2]);
        });
        it("content is the same as the original polynomials",function () {
            expect(resultStrings[0].replace(/\\phantom{.*?}/g, "").replace(/{([\d\+]*?)}/g, "$1")).toEqual("x^2+x+1");
            expect(resultStrings[1].replace(/\\phantom{.*?}/g, "").replace(/{([\d\+]*?)}/g, "$1")).toEqual("x^2+1");
        });
        it("but with same length",function () {
            expect(resultStrings[0].replace(/\\phantom{(.*?)}/g,"$1").replace(/{([\d\+]*?)}/g, "$1").length)
                .toEqual(resultStrings[1].replace(/\\phantom{(.*?)}/g,"$1").replace(/{([\d\+]*?)}/g, "$1").length);
        });

    });
});
