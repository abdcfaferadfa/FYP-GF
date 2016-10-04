
// Declare app level module which depends on views, and components
import IRepeatScope = angular.IRepeatScope;
import IRootElementService = angular.IRootElementService;
import IWindowService = angular.IWindowService;
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
    'myApp.sbox',
  'myApp.version',
  'ngMessages',
  'ngMaterial',
  'SliderNav',
    'ngCookies',
]).config(['$locationProvider', '$routeProvider', "$mdThemingProvider", function ($locationProvider, $routeProvider, $mdThemingProvider, constants) {
    //$locationProvider.hashPrefix('!');
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette("yellow")
        .dark();
    $routeProvider.when('/intro', {
        templateUrl: 'view2/intro.html',

    });
    $routeProvider.when('/convert', {
        templateUrl: 'view2/conversion.html',
        controller: "conversionCtrl",
    });

    $routeProvider.otherwise({redirectTo: '/convert'});


}]).controller("MainController", function ($scope, $timeout, $mdSidenav: ISidenavService,
    $cookies , config, constants, $location: ILocationService, $window: IWindowService
    ) {
    $cookies.putObject("test",constants);
    $scope.toggleLeft = function () {
        if (constants.urlStack.length == 0) {
            $mdSidenav('left').toggle();
        } else {
            var url = constants.urlStack.pop();
            if (constants.internalLiteral in url) {
                $location.url(url.url);
            } else {
                $window.location.href = url.url;
            }

        }
    };
    $scope.toggleRight = buildToggler("right");
        $scope.isOpenRight = function(){
            return $mdSidenav('right').isOpen();
        };
    $scope.config = config;
    $scope.constants = constants;

    function buildToggler(navID) {
        return function() {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle()
        }
    }
    }
).directive("mathjaxBind", function() {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs",
            function<T extends IScope>($scope : T, $element, $attrs) {
                $scope.$watch($attrs.mathjaxBind, function(texExpression : string) {
                    var texScript = angular.element("<script type='math/tex'>")
                        .html(texExpression ? texExpression :  "");
                    $element.html("");
                    $element.append(texScript);

                });
            }]
    };
}).directive("mathjaxAutobind", function () {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs",
            function<T extends IScope>($scope:T, $element:IRootElementService, $attrs) {
                $scope.$watch($attrs.mathjaxAutobind, function (texExpression:string) {
                    var texScript = angular.element("<script type='math/tex'>")
                        .html(texExpression ? texExpression : "");
                    $element.html("");
                    $element.append(texScript);
                    MathJax.Hub.Queue(["Update", MathJax.Hub, $element[0]]);
                });
            }]
    };
});
