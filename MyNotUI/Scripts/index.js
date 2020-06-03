//Angular
var apiUrl = "https://mynoteapi.berkaysezer.com/"
var app = angular.module("myApp", ["ngRoute"]);

app.directive("messages", function () {
    return {
        templateUrl: "directives/messages.html"
    };
});

app.config(function ($routeProvider) {

    $routeProvider
        .when("/", { templateUrl: "pages/app.html", controller: "appController" })
        .when("/login", { templateUrl: "pages/login.html", controller: "loginController" });
});

app.controller("mainController", function ($scope, $http) {

    $scope.isLoading = false;

    $scope.showLoading = function () {
        $scope.isLoading = true;
    };

    $scope.hideLoading = function () {
        $scope.isLoading = false;
    };

    $scope.loginData = function () {
        var loginDataJson = localStorage["login"] | sessionStorage["login"];

        if (!loginDataJson) {
            return null;
        }

        try {
            return JSON.parse(loginDataJson);
        } catch (e) {
            return null;
        }
    };

    $scope.token = function () {

        var loginData = $scope.loginData();

        if (!loginData) {
            return null;
        }

        return loginData.access_token;
    };



    $scope.ajax = function (apiUri, method, data, isAuth, successFunc, errorFunc) {
        $scope.showLoading();
        var headers = null;


        if (isAuth)
            headers = { Authorization: "Berarer" + $scope.token() };

        $http({

            url: apiUrl + apiUri,
            method: method,
            header: headers,
            data: data
        })
            .then(
                function (response) {
                    successFunc(response);
                    $scope.hideLoading();
                },
                function (response) {
                    errorFunc(response);
                    $scope.hideLoading();
                }
            );
    };

    $scope.checkAuth = function () {

        var tokenJson = localStorage["token"] | sessionStorage["token"];

        if (!tokenJson) {
            //login/register 
            //console.log("giriş yapılmamış");
            return;
        }
    };
    $scope.checkAuth();
});

app.controller("loginController", function ($scope, $http) {

    $scope.currentTab = "login"; // login | register
    $scope.messageFor = "login"; // login | register
    $scope.messageType = "info"; // success | warning | danger | info
    $scope.messages = []; // string array ["message 1", "message 2"]

    $scope.registerForm = {
        Email: "",
        Password: "",
        ConfirmPassword: ""
    };

    $scope.loginForm = {
        grant_type: "password",
        username: "",
        password: ""
    };

    $scope.rememberMe = false;

    $scope.error = function (data) {
        $scope.messageFor = $scope.currentTab;
        $scope.messageType = "danger";
        $scope.messages = [];

        if (data.ModelState) {
            var errors = [];
            for (var prop in data.ModelState) {
                for (var index in data.ModelState[prop]) {
                    //errors.push(data.ModelState[prop][index]);
                    $scope.messages.push(data.ModelState[prop][index]);
                }
            }
        }
    };

    $scope.success = function (message) {
        $scope.messageFor = $scope.currentTab;
        $scope.messageType = "success";
        $scope.messages = [message];
    };

    $scope.resetRegisterForm = function () {
        $scope.registerForm.Email = "";
        $scope.registerForm.Password = "";
        $scope.registerForm.ConfirmPassword = "";
    };

    $scope.resetLoginForm = function () {
        $scope.loginForm.username = "";
        $scope.loginForm.password = "";
        $scope.rememberMe = "";
    };

    $scope.$watch("currentTab", function () {
        $scope.resetLoginForm();
        $scope.resetRegisterForm();
        $scope.messages = [];
    });

    $scope.registerSubmit = function () {

        $scope.ajax("api/Account/Register", "post", $scope.registerForm, false,

            function (response) {
                $scope.resetRegisterForm();
                $scope.success("Your account has been successfully created.");
            },
            function (response) {
                $scope.error(response.data);
            });

    };

    $scope.loginSubmit = function () {
        alert("login")
    };
});

app.controller("appController", function ($scope, $location) {
    $location.path("/login");
});

//jquery dom ready
$(function () {

    $("#navBg").click(function () {
        closeNav();
    });

    $(".navbar-login a").click(function (event) {
        event.preventDefault();
        var href = $(this).attr("href");
        // https://getbootstrap.com/docs/4.0/components/navs/#via-javascript
        $('#pills-tab a[href="' + href + '"]').tab('show'); // Select tab by name
    });


    $('body').on('click', '#pills-tab a', function (e) {
        e.preventDefault()
        $(this).tab('show')
    });

    // https://stackoverflow.com/questions/37769900/how-to-change-a-scope-variable-outside-the-controller-in-angularjs
    // https://www.hiren.dev/2014/06/how-to-access-scope-variable-outside.html
    $('body').on('shown.bs.tab', 'a[data-toggle="pill"]', function (e) {
        var $scope = angular.element($('[ng-view]')[0]).scope();
        $scope.currentTab = $(e.target).attr("id") == "pills-signup-tab" ? "register" : "login";
        $scope.$apply();
        //e.target // newly activated tab
        //e.relatedTarget // previous active tab
        //console.log(e.target, e.relatedTarget);
    })
});

function openNav() {
    document.getElementById("navNotes").style.width = "250px";
    $("#navNotes").addClass("navOpened");
    $("#navBg").removeClass("d-none");
    //document.getElementById("page-app").style.marginLeft = "250px";
    //document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("navNotes").style.width = "0";
    $("#navNotes").removeClass("navOpened");
    $("#navBg").addClass("d-none");
}

