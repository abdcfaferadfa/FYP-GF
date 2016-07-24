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
        expect(poly.chipArray.map(function (chip) { return parseInt(chip.value); })).toEqual([0, 0, 0, 1]);
        expect(poly.chipArray.map(function (chip) { return chip.index; })).toEqual([0, 1, 2, 3]);
    });
    describe("use a Configuration to config", function () {
        var poly, config;
        beforeEach(function () {
            config = new Configuration(2, 10);
            poly = new PolynomialField(7, config);
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
    // it("use $scope.watchCollection to monitor ")
});
//# sourceMappingURL=polynomialField_test.js.map