'use strict';
angular.module('myApp.view2', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])
    .controller('View2Ctrl', function ($scope, Config, Constants) {
        $scope.config = Config;
        $scope.constants = Constants;
});
//# sourceMappingURL=view2.js.map