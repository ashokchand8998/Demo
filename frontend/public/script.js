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


/* controllers */
mainApp.controller('mainCtrl', ['$scope', function($scope) {
    //nothing here
}]);

//currently only shows button for logout
mainApp.controller('profileCtrl', ['$scope', '$route', function($scope, $route) {
    $scope.$parent.activePage = "profile";
    $scope.logout = function() {
        localStorage.clear();
        $route.reload();
    }
}])


//calls API for checking user and authentication
mainApp.controller('loginCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) { 
    $scope.user = {
        email_id : null
    };

    $scope.check_user = function() {
        const email_id = $scope.user.email_id;
        if (email_id) {
            const data = {
                'email_id': email_id
            }
            $http.post("/api/check-user", data).then(
                function successCallback(response) {
                    $scope.invalid_user = !response.data.exists;
                },
                function errorCallback(response) {
                    console.log(response)
                    alert(response.message);
                }
            )
        } else {
            $scope.invalid_user = false;
        }
    }

    $scope.login = function() {
        $http.post("/api/user-login", $scope.user).then(
            function successCallback(response) {
                localStorage.setItem('logged', true);
                localStorage.setItem('user_id', response.data.id);
                $location.path("/tasks");
            },
            function errorCallback(response) {
                alert(response.data)
            }
        );
    }
}]);


//manages API calling for checking user and creating new user
mainApp.controller('signupCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.user = {
        email_id : null
    };
    
    $scope.check_user = function() {
        const email_id = $scope.user.email_id;
        if (email_id) {
            const data = {
                'email_id': email_id
            }
            $http.post("/api/check-user", data).then(
                function successCallback(response) {
                    $scope.user_exists = response.data.exists;
                },
                function errorCallback(response) {
                    alert(response);
                }
            )
        } else {
            $scope.user_exists = false;
        }
    }

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
}]);


//some functions for edit & cancel actions and 
//API calls to add, update and update data
mainApp.controller('tasksCtrl', ['$scope', '$route', '$http', '$filter', function($scope, $route, $http, $filter) {
    $scope.$parent.activePage = "tasks";
    $scope.task = {};
    if (localStorage.getItem('logged')) {
        //assigning defaults
        $scope.task.curr_date = $filter('date')(new Date(), "yyyy-MM-dd");
        $scope.task.last_date = new Date();
        $scope.not_edit_mode = true;
        $scope.edit_id = null;

        //common showData function to be called 
        //when task list needs to be refreshed and not the whole page.
        const showData = function(condition) {
            if(typeof condition ===  "undefined") {
                condition = false;
            }
            $http.get(`/api/getalltasks/${localStorage.getItem('user_id')}/${condition}`).then(
                function successCallback(response) {
                    $scope.tasks = response.data;
                },
                function errorCallback(response) {
                    alert(response.data.message);
                }
            );
        }

        showData();

        $scope.addnewtask = function() {
            $scope.task.user_id = localStorage.getItem('user_id');
            $http.post(`/api/addnewtask/${localStorage.getItem('user_id')}`, $scope.task).then(
                function successCallback(response) {
                    $scope.task = {};
                    $scope.task.last_date = new Date();
                    alert("Tasks added successfully!!");
                    showData();
                },
                function errorCallback(response) {
                    alert(JSON.stringify(response.data));
                }
            );
        };

        $scope.edit = function(selectedtask) {
            $scope.selected = angular.copy(selectedtask);
            $scope.edit_id = $scope.selected.id;
            $scope.not_edit_mode = false;
            $scope.selected.last_date = new Date($scope.selected.last_date)
        };

        //common updateTask function for updating task content 
        //as well as setting task as completed
        const updateTasks = function(task_id, data) {
            $http.put(`/api/task/${localStorage.getItem('user_id')}/${task_id}`, data).then(
                function successCallback(response) {
                    $scope.selected = {};
                    let message = data.completed ? "1 task completed" : "Task updated successfully"
                    alert(message);
                    showData();
                },
                function errorCallback(response) {
                    alert(response.message);
                    $route.reload();
                }
            )
        }
        $scope.setCompleted = function(task_id) {
            let data = {
                completed: true
            }
            updateTasks(task_id, data);
        }

        $scope.cancel = function() {
            $scope.selected = {};
        }

        $scope.update = function() {
            let data = {
                title: $scope.selected.title,
                last_date: $scope.selected.last_date
            };
            updateTasks($scope.selected.id, data);
        };
        $scope.delete = function(task) {
            $http.delete(`/api/delete-task/${task.user_id}/${task.id}`).then(
                function successCallback(response) {
                    alert(response.data.message);
                    showData();
                },
                function errorCallback(response) {
                    alert(response.data.message);
                    $route.reload();
                }
            )
        }
    }
}]);


//manages all users trackreport page
mainApp.controller('trackerCtrl', ['$scope', '$http', '$filter', '$location', function($scope, $http, $filter, $location) {
    $scope.$parent.activePage = "tracker";
    curr_date = $filter('date')(new Date(), "yyyy-MM-dd");

    //displying chart with date range
    $scope.applyfilter = function(start = $filter('date')($scope.start_date, "yyyy-MM-dd"), end = $filter('date')($scope.end_date, "yyyy-MM-dd")) {
        $http.get(`/api/view-track-report/${localStorage.user_id}/${start}/${end}`).then(
            function successCallback(response) {
                //making proper data set for presentation
                let all_emails = [null], total_tasks = [null], completed_tasks = [null];
                $scope.users = response.data;
                for(let user in $scope.users) {
                    all_emails.push($scope.users[user]['email_id']);
                    total_tasks.push(parseInt($scope.users[user]['total_tasks']));
                    completed_tasks.push(parseInt($scope.users[user]['completed_tasks']));
                }
                all_emails.push(null);
                total_tasks.push(null);
                completed_tasks.push(null);

                //presented chart's content
                let chart_data = {
                    type: "line",
                    title: {
                        text: "Track Report"
                    },
                    "crosshair-x": {},
                    legend:{
                        align: "right",
                        verticalAlign: "top",
                        adjustLayout: true
                    },
                    "scale-x": {
                        values: all_emails,
                        label: {
                            text: "Users"
                        }
                    },
                    "scale-y": {
                        values: `0: ${Math.max(...total_tasks) + 1}: 1`,
                        format: "%v",
                        label: {
                            text: "No. of tasks"
                        }
                    },
                    series: [
                        { values: total_tasks, "line-color": "black", "line-width": 3, text: "Total tasks", marker: { size: 9 }},
                        { values: completed_tasks, "line-color": "green", "line-width": 3, text: "Completed tasks", marker: { size: 5 }}     
                    ],
                    plot: {
                        "aspect": "spline",
                        "tooltip": false,
                        "animation": {
                            effect: 1,
                            sequence: 2,
                            speed: 10
                        }
                    }
                };
                zingchart.render({
                    id: "myChart",
                    data: chart_data,
                    height: '100%',
                    widht: '100%'
                })
            },
            function errorCallback(response) {
                alert(response.data.message);
                $location.path("/")
            }
        );
    };

    //by default calling of filter function with date range set to current date
    $scope.applyfilter(curr_date, curr_date)
}]);