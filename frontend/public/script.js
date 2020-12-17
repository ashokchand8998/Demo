const mainApp = angular.module("mainApp", ["ngRoute", "zingchart-angularjs"]);


/* routes */
mainApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when("/", {
        resolve: {
            check: function($location) {
            if(localStorage.getItem('logged')) {
                $location.path("/tasks");
            }
        }},
        templateUrl: "./views/login.html",
        controller: "loginCtrl"
    })
    .when("/tasks", {
        resolve: {
            check: function($location) {
            if(!localStorage.getItem('logged')) {
                $location.path("/")
            }
        }},
        templateUrl: "./views/tasks.html",
        controller: "tasksCtrl",
    })
    .when("/signup", {
        templateUrl: "./views/signup.html",
        controller: "signupCtrl"
    })
    .when("/tracker", {
        resolve: {
            check: function($location) {
            if(!localStorage.getItem('logged')) {
                $location.path("/")
            }
        }},
        templateUrl: "./views/tracker.html",
        controller: "trackerCtrl",
        activePage: "tracker"
    })
    .when("/profile", {
        resolve: {
            check: function($location) {
            if(!localStorage.getItem('logged')) {
                $location.path("/")
            }
        }},
        templateUrl: "./views/profile.html",
        controller: "profileCtrl",
        activePage: "profile"
    })
    .otherwise({
        template: "<h1>Page not found</h1>"
    });
}]);