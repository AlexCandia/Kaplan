﻿app.controller("headerController", ['$scope', 'Notification', 'LoginService', '$location',
function ($scope, Notification, LoginService, $location) {

    //$(".nav a").on("click", function () {
    //    $(".nav").find(".active").removeClass("active");
    //    $(this).parent().addClass("active");
    //});

    if (LoginService.getisAuthenticated()) {
        $scope.tipo = LoginService.getTipo();
        $scope.Nombres = LoginService.getUserName();
    };

    $scope.CerrarSesion = function () {
        LoginService.getCerrarSesion();
        $location.path('cerrarsesion'); 
    };

}]);