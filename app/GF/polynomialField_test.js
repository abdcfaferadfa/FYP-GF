/**
 * Created by Zhou on 7/15/16.
 */
describe("polynomial Field", function () {
    var scope;
    beforeEach(function () {
        scope = jasmine.createSpyObj("scope", ["$watchCollection"]);
    });
    it("can initialize using value or array", function () {
        expect(new PolynomialField(5)).toEqual(new PolynomialField([1, 0, 1]));
    });
    it("has a polynomial chip array representation", function () {
        var poly = new PolynomialField(8);
        expect(poly.chipArray[1]).toEqual({
            value: jasmine.any(String),
            index: jasmine.any(Number)
        });
        expect(poly.chipArray.map(function (chip) { return parseInt(chip.value); })).toEqual([1, 0, 0, 0]);
        expect(poly.chipArray.map(function (chip) { return chip.index; })).toEqual([3, 2, 1, 0]);
    });
    describe("use a Configuration to config", function () {
        var poly, config;
        beforeEach(function () {
            config = new Configuration(2, 10);
            poly = new PolynomialField(7, config);
        });
        it("has a numberArray and numberValue", function () {
            expect(poly.numberValue).toEqual('7');
            expect(poly.numberArray).toEqual([1, 1, 1]);
            poly.numberArray = [1, 1];
            expect(poly.numberValue).toEqual('3');
            poly.numberValue = "13";
            expect(poly.numberArray).toEqual([1, 0, 1, 1]);
        });
        it("updates decimal value according to configuration", function () {
            config.displayOption = 16;
            poly.numberValue = "10";
            expect(poly.decimal).toEqual(16);
            poly.decimal = 10;
            expect(poly.numberValue).toEqual("a");
        });
        it("convert polynomial using field", function () {
            config.field = 3;
            expect(new PolynomialField([0, 0, 1], config).decimal).toEqual(9);
        });
    });
    describe("Can do computation", function () {
        var poly, poly2, config;
        beforeEach(function () {
            config = new Configuration(2, 10);
            poly = new PolynomialField([1, 1, 1], config);
            poly2 = new PolynomialField([1, 0, 1, 1], config);
        });
        it("that add number", function () {
            expect(PolynomialField.add(poly, poly2).numberArray).toEqual([0, 1, 0, 1]);
        });
        it("multiply number", function () {
            expect(PolynomialField.multiplyWithSteps(poly, poly2).value).toEqual(Utility.NumberArrayToDecimalNumber([1, 1, 0, 0, 0, 1], 2));
        });
    });
    // it("use $scope.watchCollection to monitor ")
});
//# sourceMappingURL=polynomialField_test.js.map