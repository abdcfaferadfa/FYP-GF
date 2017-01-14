angular.module("SliderNav", ['Constants', 'ngMessages']).controller('LeftCtrl', ["$scope", "$timeout", "$mdSidenav", "$log",
    function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('left').close()
                .then(function () {
                $log.debug("close LEFT is done");
            });
        };
    }]).controller("ChooseCtrl", ["$scope", "$mdSidenav", "constants",
    function ($scope, $mdDialog, constants) {
        $scope.constants = constants;
        $scope.cancel = $mdDialog.hide;
        $scope.update = function (index) {
            constants.degree = constants.irreduciblePolynomials[index].toString(2).length - 1;
            constants.modulus = constants.irreduciblePolynomials[index];
            constants.modulusTex = constants.irreduciblePolynomialsTex[index];
            PolynomialField.updateAllMath();
            $mdDialog.hide();
        };
    }])
    .controller("RightCtrl", ["$scope", "$element", "$timeout", "$mdSidenav", "config", "constants", "$mdDialog",
    function ($scope, $element, $timeout, $mdSidenav, config, constants, $mdDialog) {
        $scope.fields = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        $scope.primeField = [2, 3, 5, 7, 11, 13].map(function (value) { return value.toString(); });
        $scope.config = config;
        $scope.constants = constants;
        $scope.displayOptions = [
            { text: 'bin', value: 2 }, { text: 'oct', value: 8 }, { text: 'dec', value: 10 }, { text: 'hex', value: 16 },
        ];
        $scope.fieldChanged = function () {
            PolynomialField.allPolynomial.map(function (value) {
                value.syncValueToChip();
            });
            config.enableDivision = $scope.primeField.indexOf(config.field.toString()) != -1;
        };
        $scope.showChangePolynomial = function (event) {
            $mdDialog.show({
                controller: "ChooseCtrl",
                templateUrl: "SlideNav/Choose.html",
                targetEvent: event,
                clickOutsideToClose: true,
                openFrom: {
                    top: 0,
                    width: 30,
                    height: 80
                },
                closeTo: {
                    left: 1500
                },
            });
            $timeout(PolynomialField.updateAllMath, 250);
        };
        $scope.close = function () {
            $mdSidenav('right').close();
        };
        $scope.toF2 = function () {
            config.field = 2;
            if (!config.enablePolynomialCompute) {
                constants.degree = "n";
            }
            else {
                constants.degree = constants.modulus.toString(2).length - 1;
            }
        };
    }]);
angular.module("Constants", []).constant("config", new Configuration())
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
    ],
    defaultPolynomialValue: [42, 7, 0],
    irreduciblePolynomials: [
        7, 11, 31, 61, 103, 245, 283, 731, 1293
    ],
    irreduciblePolynomialsTex: ["x^{2}+x+1",
        "x^{3}+x+1", "x^{4}+x^{3}+x^{2}+x+1",
        "x^{5}+x^{4}+x^{3}+x^{2}+1", "x^{6}+x^{5}+x^{2}+x+1",
        "x^{7}+x^{6}+x^{5}+x^{4}+x^{2}+1", "x^{8}+x^{4}+x^{3}+x+1",
        "x^{9}+x^{7}+x^{6}+x^{4}+x^{3}+x+1", "x^{10}+x^{8}+x^{3}+x^{2}+1"],
    modulus: 283,
    degree: 8,
    modulusTex: "x^{8}+x^{4}+x^{3}+x+1",
    inverseModulus: 149,
    urlStack: [],
    internalLiteral: "internal",
    urlLiteral: "url",
    AES_AFFINE_MATRIX: [
        [1, 0, 0, 0, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 1, 1, 1, 1]
    ],
    AES_FINAL_VECTOR: [1, 1, 0, 0, 0, 1, 1, 0],
    COOKIE_NAME: "GF",
    COOKIE_EXPIRY: 1000 * 60 * 60 * 24 * 30,
    USER_PRFERENCE: {
        constants: ["modulus", "degree", "modulusTex", "inverseModulus", "defaultPolynomialValue"],
        config: Object.keys(new Configuration())
    },
});
//# sourceMappingURL=SliderNav.js.map