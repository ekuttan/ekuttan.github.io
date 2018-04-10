(function(){
    var app = angular.module('mediaone',[]);
    app.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    });

    app.controller('CommonController', function($http, $scope, $sce){
        $scope.menu_list = [];
        $http.get('/api/main-category/?category_type=menu').success(function(data){
            $scope.menu_list = data.results;
        });

        $scope.to_trusted = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };

        $scope.markUpvote = function(id) {
            $http.get('/api/news/'+id+"/upvote/?vote=true").success(function(data){
                $('#show-upvoted-news'+id).show();
                if($('#show-upvoted-news'+id).hasClass("ng-hide")){
                    $('#show-upvoted-news'+id).removeClass("ng-hide");
                }
                $('#hide-upvoted-news'+id).hide();
            });
        };

        $scope.removeUpvote = function(id) {
            $http.get('/api/news/'+id+"/upvote/?vote=false").success(function(data){
                $('#hide-upvoted-news'+id).show();
                if($('#hide-upvoted-news'+id).hasClass("ng-hide")){
                    $('#hide-upvoted-news'+id).removeClass("ng-hide");
                }
                $('#show-upvoted-news'+id).hide();
            });
        };

    });

    app.directive('menuBar', function () {
        return {
            restrict: 'E',
            templateUrl: "menu_bar_template"
        };
    });

    app.filter("showRating", function(){
       return function(input, span_id){
           var val = parseFloat(input);
            // Make sure that the value is in 0 - 5 range, multiply to get width
            var size = Math.max(0, (Math.min(5, val))) * 16;
            // Create stars holder
            var $span = $('<span />').width(size);
            // Replace the numerical value with stars
            $('#review_'+span_id).html($span);
       }
    });

})();