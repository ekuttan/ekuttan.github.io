(function(){
    var app = angular.module('review',['mediaone', 'infinite-scroll']);

    app.controller('ReviewController', function($http, $scope){
        $scope.column_list = [];
        $http.get('/api/review/').success(function(data){
            $scope.review_list = data.results;
        });
        $http.get('/api/review-writer/').success(function(data){
            $scope.writer_list = data.results;
        });

        $scope.init = function() {
            $scope.reviewSearchHidden = false;
            $scope.reviewListHidden = true;
            $scope.search_review_list = [];
        }
    });

    app.directive('reviewList', function () {
        return {
            restrict: 'E',
            templateUrl: "review_list_template"
        };
    });

    app.controller('ReviewDetailController', function($http, $scope, $sce){
        $scope.review = {};
        $scope.init = function(id, preview_review, user_authenticated) {
            $scope.user_authenticated = user_authenticated;
            $scope.review_url = '/api/review/'+id;
            if(preview_review) {
                $scope.review_url = '/api/review/'+id+"/?preview_review=1";
            }
            $http.get($scope.review_url).success(function(data){
                $scope.review = data;
                $scope.int_expert_rating = Math.floor(data.expert_rating)
                $scope.half_int_expert_rating =  Math.round(data.expert_rating % 1) < 1 ? 0: 1 ;
                $scope.no_user_ratings = true;
                if (data.get_user_rating !=null){
                    $scope.int_user_rating = Math.floor(data.get_user_rating['avg_rating'])
                    $scope.half_int_user_rating =  Math.round(data.get_user_rating['avg_rating'] % 1) < 1 ? 0: 1 ;
                    $scope.rated_user_count = data.get_user_rating['count'];
                    $scope.no_user_ratings = false;
                }
                $scope.int_current_user_rating = Math.floor(data.get_current_user_rating)
                $scope.half_current_user_rating =  Math.round(data.get_current_user_rating % 1) < 1 ? 0: 1 ;
            });
        };

        $scope.to_trusted = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };

        $scope.rateReview= function(your_rating) {
            if ( $scope.user_authenticated!= 'True') {
                alert('You should login to rate');
            } else {
                $http.get('/api/review/'+$scope.review.id+'/rate/'+your_rating).success(function(data){
                    $scope.int_current_user_rating = Math.floor(your_rating);
                    $scope.half_current_user_rating =  Math.round(your_rating % 1) < 1 ? 0: 1 ;
                     $scope.no_user_ratings = false;
                    if ($scope.review.get_user_rating !=null) {
                        average_rating = (parseFloat($scope.review.get_user_rating['avg_rating']) + parseFloat(your_rating)) / (parseFloat($scope.rated_user_count) + 1);
                        $scope.int_user_rating = Math.floor(average_rating)
                        $scope.half_int_user_rating =  Math.round(average_rating % 1) < 1 ? 0: 1 ;
                        $scope.rated_user_count = $scope.rated_user_count +1;
                    } else{
                        $scope.int_user_rating = Math.floor(your_rating);
                        $scope.half_int_user_rating =  Math.round(your_rating % 1) < 1 ? 0: 1 ;
                        $scope.rated_user_count = 1;
                    }
                });
            }
        }
    });

    app.controller('WriterReviewController', function($http, $scope){
        $scope.init = function(id) {
            $http.get('/api/review-writer/'+id).success(function(data){
                $scope.writer = data;
            });
        };
    });

    app.filter('trusted', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);
})();
