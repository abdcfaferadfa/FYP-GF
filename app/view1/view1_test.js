// 'use strict';
describe('myApp.view1 module', function () {
    var ctrl;
    beforeEach(angular.mock.module('myApp.view1'));
    beforeEach(inject(function ($controller, $rootScope) {
        ctrl = $controller("View1Ctrl", { $scope: $rootScope.$new() });
    }));
    describe('view1 controller', function () {
        it('should ....', inject(function ($controller) {
            //spec body
            expect(ctrl).toBeDefined();
        }));
    });
});
//# sourceMappingURL=view1_test.js.map