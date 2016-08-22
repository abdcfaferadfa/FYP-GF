import IScope = angular.IScope;
import ISidenavService = angular.material.ISidenavService;
/**
 * Created by Zhou on 7/7/16.
 */

class Configuration {
    //TODO separate Polynomial config and app config
    field:number;
    displayOption:number;
    showDetailedSteps:boolean;
    enableDivision:boolean;
    enablePolynomialCompute:boolean;

    constructor(field:number = 2, displayOption:number = 10, showDetailedSteps = true) {
        this.field = field;
        this.displayOption = displayOption;
        this.showDetailedSteps = showDetailedSteps;
        this.enableDivision = true;
        this.enablePolynomialCompute = true;
    }
}



interface Operation {
    symbol:string,
    texFunction:(a:PolynomialField, b:PolynomialField) => ResultWithSteps
}

angular.module("SliderNav", ['Constants', 'ngMessages']).controller('LeftCtrl', function ($scope, $timeout:ITimeoutService, $mdSidenav, $log) {
    $scope.close = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('left').close()
            .then(function () {
                $log.debug("close LEFT is done");
            });

    };
}).controller("RightCtrl", function ($scope, $element, $timeout:ITimeoutService, $mdSidenav:ISidenavService, Config:Configuration) {

    $scope.fields = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    $scope.primeField = [2, 3, 5, 7, 11, 13].map(value => value.toString());
    $scope.config = Config;
    $scope.displayOptions = [
        {text: 'bin', value: 2}, {text: 'oct', value: 8}, {text: 'dec', value: 10}, {text: 'hex', value: 16},
    ];
    $scope.fieldChanged = function () {
        PolynomialField.allPolynomial.map(function (value:PolynomialField) {
            value.syncValueToChip();
        });
        Config.enableDivision = $scope.primeField.indexOf(Config.field.toString()) != -1
    };


    $scope.close = function () {
        $mdSidenav('right').close();
    }
});
angular.module("Constants", []).constant("Config", new Configuration())
//TODO: sperate declearation of constants
    .constant("constants", {
        ALL_OPERATIONS_WITHOUT_DIVISION: [
            {
                symbol: "＋",
                texFunction: PolynomialField.addWithSteps
            },
            {
                symbol: '－',
                texFunction: PolynomialField.subtractWithSteps
            },
            {
                symbol: '×',
                texFunction: PolynomialField.multiplyWithSteps
            },
        ],
        ALL_OPERATIONS_INCLUDE_DISION :[
            {
                symbol: "＋",
                texFunction: PolynomialField.addWithSteps
            },
            {
                symbol: '－',
                texFunction: PolynomialField.subtractWithSteps
            },
            {
                symbol: '×',
                texFunction: PolynomialField.multiplyWithSteps
            },
            {
                symbol : '÷',
                texFunction : PolynomialField.div
            },
            {
                symbol : "%",
                texFunction : PolynomialField.mod
            }
        ],
        defaultPolynomialValue: [42, 7, 0],
        modulus: 283,
    });


