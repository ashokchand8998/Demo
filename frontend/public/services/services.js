angular.module("mainApp")
.factory("sampleService", ['$http', function ($http) {
    const login = function(user_data) {
        return $http.post("/api/user-login", user_data).then(
            function successCallback(response) {
                return response.data
            },
            function errorCallback(response) {
                alert(response.data)
            }
        );
    }

    const signup = function(user_data) {
        return $http.post("/api/add-user", user_data).then(
            function successCallback(response) {
                return response.data
            },
            function errorCallback(response) {
                alert(response.data.message)
            }
        )
    }

    const checkUser = function(user_data) {
        return $http.post("/api/check-user", user_data).then(
            function successCallback(response) {
                 return response.data;
            },
            function errorCallback(response) {
                alert(response.data.message);
            }
        )
    }

    const getTasks = function(user_id, condition) {
        return $http.get(`/api/getalltasks/${user_id}/${condition}`).then(
            function successCallback(response) {
                return response.data
            },
            function errorCallback(response) {
                alert(response.data.message);
            }
        )
    }

    const addTask = function(user_id, tasks) {
        return $http.post(`/api/addnewtask/${user_id}`, tasks).then(
            function successCallback(response) {
                return true
            },
            function errorCallback(response) {
                alert(JSON.stringify(response.data));
            }
        )
    }

    const updateTask = function(user_id, task_id, data) {
        return $http.put(`/api/task/${user_id}/${task_id}`, data).then(
            function successCallback(response) {
                let message = data.completed ? "1 task completed" : "Task updated successfully"
                alert(message);
                return true
            },
            function errorCallback(response) {
                alert(response.message);
                $route.reload();
            }
        )
    }

    const deleteTask = function(task) {
        return $http.delete(`/api/delete-task/${task.user_id}/${task.id}`).then(
            function successCallback(response) {
                alert(response.data.message);
                return true
            },
            function errorCallback(response) {
                alert(response.data.message);
                return false
            }
        )
    }

    const getReport = function(user_id, start_date, end_date) {
        return $http.get(`/api/view-track-report/${user_id}/${start_date}/${end_date}`).then(
            function successCallback(response) {
                return response.data
            },
            function errorCallback(response) {
                alert(response.data.message)
            }
        )
    }

    const endpoints = {
        login: login,
        signup: signup,
        checkUser: checkUser,
        getTasks: getTasks,
        addTask: addTask,
        updateTask: updateTask,
        deleteTask: deleteTask,
        getReport: getReport
    }
    return endpoints
}])