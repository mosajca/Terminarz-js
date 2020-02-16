angular.module("App", ["ngMaterial"])
    .controller("EventController", function ($scope, $http, $mdDialog) {
        $scope.reloadEvents = function() {
            $http.get("http://localhost:10010/events")
            .then(function (response) {
                $scope.events = response.data;
            });
        }
        $scope.reloadEvents();
        $scope.$on('setEvents', function(e, events) {
            $scope.events = events;
        });
        $scope.$on('addEvent', function(e, event) {
            $mdDialog.show({
                controller: function ($scope, $mdDialog) {
                    $scope.cancel = function () { $mdDialog.cancel(); }
                    $scope.ok = function (data) { $mdDialog.hide(data); }
                    $scope.name = null;
                    $scope.description = null;
                    $scope.startDateTime = null;
                    $scope.endDateTime = null;
                    $scope.public = false;
                    $scope.action = "Dodaj";
                },
                templateUrl: "/templates/event.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true
            })
                .then(function (data) {
                    $http.post("http://localhost:10010/events", {
                        "name": data[0],
                        "description": data[1],
                        "startDateTime": data[2].toISOString(),
                        "endDateTime": data[3].toISOString(),
                        "public": data[4]
                    }).then(function(response){$scope.reloadEvents()}, function(response){});
                }, function () { });
        });
        $scope.showDeleteDialog = function (event, eventId) {
            var confirm = $mdDialog.confirm()
                .title('Czy na pewno chcesz usunąć?')
                .targetEvent(event)
                .ok('Usuń')
                .cancel('Anuluj');

            $mdDialog.show(confirm).then(function() {
                $http.delete("http://localhost:10010/events/" + eventId)
                .then(function(response){$scope.reloadEvents()}, function(response){});
            }, function() {
            });
        };
        $scope.showEditDialog = function (event, e) {
            $mdDialog.show({
                controller: function ($scope, $mdDialog) {
                    $scope.cancel = function () { $mdDialog.cancel(); }
                    $scope.ok = function (data) { $mdDialog.hide(data); }
                    $scope.name = e.name;
                    $scope.description = e.description;
                    $scope.startDateTime = new Date(e.startDateTime);
                    $scope.endDateTime = new Date(e.endDateTime);
                    $scope.public = e.public;
                    $scope.action = "Edytuj";
                },
                templateUrl: "/templates/event.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true
            })
                .then(function (data) {
                    $http.put("http://localhost:10010/events/" + e.id, {
                        "name": data[0],
                        "description": data[1],
                        "startDateTime": data[2].toISOString(),
                        "endDateTime": data[3].toISOString(),
                        "public": data[4]
                    }).then(function(response){$scope.reloadEvents()}, function(response){});
                }, function () { });
        };
    })
    .controller("CalendarController", function ($rootScope, $scope, $http) {
        $scope.date = null;
        $scope.public = false;
        $scope.myPublic = false;
        $scope.private = false;
        $scope.count = function() {
            let sum = 0;
            if ($scope.public) sum += 1;
            if ($scope.myPublic) sum += 2;
            if ($scope.private) sum += 4;
            return sum;
        }
        $scope.log = function () {
            $http.get("http://localhost:10010/events?time=" + $scope.date.getTime() + "&visibility=" + $scope.count())
            .then(function (response) {
                $rootScope.$broadcast("setEvents", response.data);
            });
        }
        $scope.filter = function(date) {
            return true;
        }
    })
    .controller("ToolbarController", function ($rootScope, $scope, $http, $mdDialog) {
        $scope.showAddDialog = function (event) {
            $rootScope.$broadcast("addEvent", event);
        }
        $scope.showLoginDialog = function (event) {
            $mdDialog.show({
                controller: function ($scope, $mdDialog) {
                    $scope.cancel = function () { $mdDialog.cancel(); }
                    $scope.login = function (data) { $mdDialog.hide(data); }
                    $scope.name = null;
                    $scope.password = null;
                },
                templateUrl: "/templates/login.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true
            })
                .then(function (data) {
                    $http.defaults.headers.common.Authorization = 'Basic ' + btoa(unescape(encodeURIComponent(data[0]+':'+data[1])));
                    $http.get("http://localhost:10010/users/" + data[0])
                        .then(function (response) {
                            $rootScope.user = { name: response.data.name};
                        }, function (response) {
                            $http.defaults.headers.common.Authorization = undefined;
                        });
                }, function () { });
        };
        $scope.showRegisterDialog = function (event) {
            $mdDialog.show({
                controller: function ($scope, $mdDialog) {
                    $scope.cancel = function () { $mdDialog.cancel(); }
                    $scope.register = function (data) { $mdDialog.hide(data); }
                    $scope.name = null;
                    $scope.password = null;
                    $scope.password2 = null;
                },
                templateUrl: "/templates/register.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true
            })
                .then(function (data) {
                    $http.post("http://localhost:10010/users", {
                        "name": data[0],
                        "password": data[1]
                    }).then(function (response){}, function (response){});
                }, function () { });
        };
        $scope.showLogoutDialog = function (event) {
            var confirm = $mdDialog.confirm()
              .title('Czy na pewno chcesz się wylogować?')
              .targetEvent(event)
              .ok('Wyloguj')
              .cancel('Anuluj');

            $mdDialog.show(confirm).then(function() {
                $rootScope.user = undefined;
                $http.defaults.headers.common.Authorization = undefined;
            }, function() {
            });
        };
    })
    .config(function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.months = ['styczeń', 'luty', 'marzec', 'kwiecień','maj','czerwiec',
            'lipiec','sierpień','wrzesień','październik','listopad','grudzień'];
        $mdDateLocaleProvider.shortMonths = ['sty', 'lu', 'mar', 'kwi','maj','cze',
            'lip','sie','wrze','paź','lis','gru'];
        $mdDateLocaleProvider.days = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek','piątek','sobota'];
        $mdDateLocaleProvider.shortDays = ['nd', 'pn', 'wt', 'śr', 'czw','pt','sb'];
        $mdDateLocaleProvider.firstDayOfWeek = 1;
    });
