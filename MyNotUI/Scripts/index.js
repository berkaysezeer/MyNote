//Angular

var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {

    $routeProvider
        .when("/", { templateUrl: "pages/app.html" })
        .when("/login", { templateUrl: "pages/login.html" });
});

app.controller("myCtrl", function ($scope) {

    $scope.checkAuth = function () {

        var tokenJson = localStorage["token"] | sessionStorage["token"];

        if (!tokenJson) {
            //login/register 
            console.log("giriş yapılmamış");
            return;
        }
    };


    $scope.checkAuth();
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

