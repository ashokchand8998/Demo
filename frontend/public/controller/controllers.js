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
mainApp.controller('loginCtrl', ['$scope', '$location', 'sampleService', function($scope, $location, sampleService) { 
    $scope.user = {
        email_id : null
    };

    $scope.check_user = function() {
        const email_id = $scope.user.email_id;
        if (email_id) {
            const data = {
                'email_id': email_id
            }
            const resultPromise = sampleService.checkUser(data);
            resultPromise.then(
                function(result) {
                    $scope.invalid_user = !result.exists;
                }
            )
        } else {
            $scope.invalid_user = false;
        }
    }

    $scope.login = function() {
        const resultPromise = sampleService.login($scope.user);
        resultPromise.then(
            function(result) {
                localStorage.setItem('logged', true);
                localStorage.setItem('user_id', result.id);
                $location.path("/tasks");
            }
        )
    }
}]);


//manages API calling for checking user and creating new user
mainApp.controller('signupCtrl', ['$scope', '$location', 'sampleService', function($scope, $location, sampleService) {
    $scope.user = {
        email_id : null
    };
    
    $scope.check_user = function() {
        const email_id = $scope.user.email_id;
        if (email_id) {
            const data = {
                'email_id': email_id
            }
            const resultPromise = sampleService.checkUser(data);
            resultPromise.then(
                function(result) {
                    $scope.user_exists = result.exists;
                }
            )
        } else {
            $scope.user_exists = false;
        }
    }

    $scope.signup = function() {
        if($scope.user.password == $scope.user.c_password) {
            const resultPromise = sampleService.signup($scope.user);
            resultPromise.then(
                function(result) {
                    console.log(result)
                    localStorage.setItem('logged', true);
                    localStorage.setItem('user_id', result.id);
                    $location.path("/");
                }
            );
        } else {
            alert("password don't match!")
        }
    }
}]);


//some functions for edit & cancel actions and 
//API calls to add, update and update data
mainApp.controller('tasksCtrl', ['$scope', '$route', '$filter', 'sampleService', function($scope, $route, $filter, sampleService) {
    $scope.$parent.activePage = "tasks";

    $scope.task = {};
    if (localStorage.getItem('logged')) {
        //assigning defaults
        $scope.curr_date = $filter('date')(new Date(), "yyyy-MM-dd");
        $scope.task.last_date = new Date();
        $scope.not_edit_mode = true;
        $scope.edit_id = null;

        //common showData function to be called 
        //when task list needs to be refreshed and not the whole page.
        const showData = function(condition) {
            if(typeof condition === "undefined") {
                condition = false;
            }
            const resultPromise = sampleService.getTasks(localStorage.getItem('user_id'), condition);
            resultPromise.then(
                function(result) {
                    $scope.tasks = result;
                }
            )
        }

        showData();

        $scope.addnewtask = function() {
            $scope.task.user_id = localStorage.getItem('user_id');
            const resultPromise = sampleService.addTask( $scope.task.user_id, $scope.task);
            resultPromise.then(
                function(result) {
                    if(result) {
                        $scope.task = {};
                        $scope.task.last_date = new Date();
                        alert("Tasks added successfully!!");
                        showData();
                    }
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

        $scope.setCompleted = function(task_id) {
            let data = {
                completed: true
            }
            const resultPromise = sampleService.updateTask(localStorage.getItem('user_id'), task_id, data);
            resultPromise.then(
                function(result) {
                    if(result) {
                        $scope.selected = {};
                        showData();
                    }
                }
            )
        }

        $scope.cancel = function() {
            $scope.selected = {};
        }

        $scope.update = function() {
            let data = {
                title: $scope.selected.title,
                last_date: $scope.selected.last_date
            };
            resultPromise = sampleService.updateTask(localStorage.getItem('user_id'), $scope.selected.id, data);
            resultPromise.then(
                function(result) {
                    if(result) {
                        $scope.selected = {};
                        showData();
                    }
                }
            )
        };

        $scope.delete = function(task) {
            const resultPromise = sampleService.deleteTask(task);
            resultPromise.then(
                function(result) {
                    if(result) {
                        if(result) {
                            showData();
                        } else {
                            $route.reload();
                        }
                    }
                }
            )
        }
    }
}]);


//manages all users trackreport page
mainApp.controller('trackerCtrl', ['$scope', '$filter', '$location', 'sampleService', function($scope, $filter, $location, sampleService) {
    $scope.$parent.activePage = "tracker";
    curr_date = $filter('date')(new Date(), "yyyy-MM-dd");

    //displying chart with date range
    $scope.applyfilter = function(start = $filter('date')($scope.start_date, "yyyy-MM-dd"), end = $filter('date')($scope.end_date, "yyyy-MM-dd")) {
        const resultPromise = sampleService.getReport(localStorage.user_id, start, end);
        resultPromise.then(
            function (result) {
                //making proper data set for presentation
                let all_emails = [null], total_tasks = [null], completed_tasks = [null];
                $scope.users = result;
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
            }
        );
    };

    //by default calling of filter function with date range set to current date
    $scope.applyfilter(curr_date, curr_date)
}]);
