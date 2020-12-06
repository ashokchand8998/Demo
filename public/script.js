const mainApp = angular.module("mainApp", ["ngRoute"]);

//services
// mainApp.factory('SampleService', function() {
//     return {
//         show_button : localStorage.getItem('logged')
//     }
// })

//routes
mainApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        resolve: {
            check: function($location) {
            if(localStorage.getItem('logged')) {
                $location.path("/viewtasks")
            }
        }},
        templateUrl: "./views/login.html",
        controller: "loginCtrl"
    })
    .when("/addtasks", {
        resolve: {
            check: function($location) {
            if(!localStorage.getItem('logged')) {
                $location.path("/")
            }
        }},
        templateUrl: "./views/addtasks.html",
        controller: "addtasksCtrl"
    })
    .when("/viewtasks", {
        resolve: {
            check: function($location) {
            if(!localStorage.getItem('logged')) {
                $location.path("/")
            }
        }},
        templateUrl: "./views/viewtasks.html",
        controller: "viewtasksCtrl"
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
        controller: "trackerCtrl"
    })
    .when("/profile", {
        resolve: {
            check: function($location) {
            if(!localStorage.getItem('logged')) {
                $location.path("/")
            }
        }},
        templateUrl: "./views/profile.html",
        controller: "profileCtrl"
    })
    .otherwise({
        template: "<h1>Page not found</h1>"
    });
});

//controller
mainApp.controller('profileCtrl', function($scope, $route) {
    $scope.logout = function() {
        localStorage.clear();
        $route.reload();
    }
})

mainApp.controller('loginCtrl', function($scope, $http, $location) { 
    $scope.login = function() {
        $http.post("/api/user-login", $scope.user).then(
            function successCallback(response) {
                localStorage.setItem('logged', true);
                localStorage.setItem('user_id', response.data.id);
                $location.path("/viewtasks");
            },
            function errorCallback(response) {
                alert(response.data)
            }
        );
    }
});

mainApp.controller('signupCtrl', function($scope, $http, $location) {
    $scope.signup = function() {
        if($scope.user.password == $scope.user.c_password) {
            $http.post("/api/add-user", $scope.user).then(
                function successCallback(response) {
                    localStorage.setItem('logged', true);
                    localStorage.setItem('user_id', response.data.id);
                    $location.path("/");
                },
                function errorCallback(response) {
                    alert(response.data.message)
                }
            );
        } else {
            alert("password don't match!")
        }
    }
});

mainApp.controller('viewtasksCtrl', function($route, $scope, $http) {
    if (localStorage.getItem('logged')) {
        $scope.curr_date = new Date();
        $scope.not_edit_mode = true;
        $scope.edit_id = null;

        $http.get(`/api/getalltasks/${localStorage.getItem('user_id')}`).then(
            function successCallback(response) {
                $scope.tasks = response.data;
            },
            function errorCallback(response) {
                alert(response.data.message);
            }
        );
        $scope.edit = function(selectedtask) {
            $scope.selected = angular.copy(selectedtask);
            $scope.edit_id = $scope.selected.id;
            $scope.not_edit_mode = false;
            $scope.selected.last_date = new Date($scope.selected.last_date)
        };
        $scope.update = function() {
            let data = {
                title: $scope.selected.title,
                last_date: $scope.selected.last_date,
                completed: $scope.selected.completed
            };
            $http.put(`/api/task/${localStorage.getItem('user_id')}/${$scope.selected.id}`, data).then(
                function successCallback(response) {
                    $scope.selected = {};
                    alert("Task updated successfully");
                    $route.reload();
                },
                function errorCallback(response) {
                    alert(response.message);
                    $route.reload();
                }
            )
        };
        $scope.delete = function(task) {
            $http.delete(`/api/delete-task/${task.user_id}/${task.id}`).then(
                function successCallback(response) {
                    alert(response.data.message);
                    $route.reload();
                },
                function errorCallback(response) {
                    alert(response.data.message);
                    $route.reload();
                }
            )
        }
    }
});

mainApp.controller('addtasksCtrl', function($scope, $http, $filter) {
    $scope.curr_date = $filter('date')(new Date(), "yyyy-MM-dd");
    $scope.addnewtask = function() {
        $scope.task.user_id = localStorage.getItem('user_id');
        $scope.task.last_date = $scope.curr_date;
        if(!$scope.task.last_date) {
            $scope.task.last_date = date;
        }
        $http.post(`/api/addnewtask/${localStorage.getItem('user_id')}`, $scope.task).then(
            function successCallback(response) {
                $scope.task = {};
                alert("Tasks added successfully!!");
            },
            function errorCallback(response) {
                console.log(response.data.message)
                alert(JSON.stringify(response.data));
            }
        );
    };
});

mainApp.controller('trackerCtrl', function($scope, $http) {
    console.log("tracker page loaded");
    $http.get("/api/view-track-report").then(
        function successCallback(response) {
            console.log(response.data)
            $scope.users = response.data;
        },
        function errorCallback(response) {
            alert(response.message);
        }
    );
});