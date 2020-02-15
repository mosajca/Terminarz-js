angular.module("App", ["ngMaterial"])
    .controller("EventController", function ($scope, $http, $mdDialog) {
        $http.get("http://localhost:10010/events")
            .then(function (response) {
                $scope.events = response.data;
            });
        $scope.showDeleteDialog = function (event, eventId) {
            var confirm = $mdDialog.confirm()
                .title('Czy na pewno chcesz usunąć?')
                .targetEvent(event)
                .ok('Usuń')
                .cancel('Anuluj');

            $mdDialog.show(confirm).then(function() {
                $http.delete("http://localhost:10010/events/" + eventId);
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
                    });
                }, function () { });
        };
    })
    .controller("CalendarController", function ($scope) {
        $scope.date = null;
        $scope.log = function () {
            console.log($scope.date);
        }
        $scope.filter = function(date) {
            return true;
        }
    })
    .controller("ToolbarController", function ($scope, $http, $mdDialog) {
        $scope.showAddDialog = function (event) {
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
                    });
                }, function () { });
        };
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
                    });
                }, function () { });
        };
        $scope.showLogoutDialog = function (event) {
            var confirm = $mdDialog.confirm()
              .title('Czy na pewno chcesz się wylogować?')
              .targetEvent(event)
              .ok('Wyloguj')
              .cancel('Anuluj');

            $mdDialog.show(confirm).then(function() {
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
