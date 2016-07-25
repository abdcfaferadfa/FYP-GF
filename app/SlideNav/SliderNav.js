/**
 * Created by Zhou on 7/7/16.
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
    }
    return Configuration;
}());
angular.module("SliderNav", ['Constants', 'ngMessages']).controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('left').close()
            .then(function () {
            $log.debug("close LEFT is done");
        });
    };
}).controller("RightCtrl", function ($scope, $timeout, $mdSidenav, Config) {
    $scope.fields = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    $scope.primeField = [2, 3, 5, 7, 11, 13].map(function (value) { return value.toString(); });
    $scope.config = Config;
    $scope.displayOptions = [
        { text: 'bin', value: 2 }, { text: 'oct', value: 8 }, { text: 'dec', value: 10 }, { text: 'hex', value: 16 },
    ];
    $scope.fieldChanged = function () {
        PolynomialField.allPolynomial.map(function (value) {
            value.syncValueToChip();
        });
        Config.enableDivision = $scope.primeField.indexOf(Config.field.toString()) != -1;
    };
    $scope.close = function () {
        $mdSidenav('right').close();
    };
});
angular.module("Constants", []).constant("Config", new Configuration())
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
    ALL_OPERATIONS_INCLUDE_DISION: [
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
            symbol: '÷',
            texFunction: PolynomialField.div
        },
        {
            symbol: "%",
            texFunction: PolynomialField.mod
        }
    ]
});
//# sourceMappingURL=SliderNav.js.map