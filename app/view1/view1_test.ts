// 'use strict';

import IControllerProvider = angular.IControllerProvider;
import IRootScopeService = angular.IRootScopeService;
import IControllerService = angular.IControllerService;
import INgModelController = angular.INgModelController;
describe('myApp.view1 module', function() {
    var ctrl;
  beforeEach(angular.mock.module('myApp.view1'));
    beforeEach(inject(function ($controller ,$rootScope:IRootScopeService) {
        ctrl = $controller("View1Ctrl",{$scope : $rootScope.$new()});
    }));

  describe('view1 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      expect(ctrl).toBeDefined();
    }));

  });
});