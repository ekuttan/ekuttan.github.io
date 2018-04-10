(function(){
    var app = angular.module('sports',[]);
    app.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    });

    app.controller('SportsNewsController', function($http, $scope){
        $scope.news_list = [];
        $http.get('/api/news?category=Sports').success(function(data){
            $scope.news_list_pagination_params = data;
            $scope.news_list = data.results;
         });
    });

    app.directive('sportsNewsList', function () {
        return {
            restrict: 'E',
            templateUrl: "news_list_template"
        };
    });
})();