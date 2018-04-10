(function(){
    var app = angular.module('review',['mediaone']);

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

        $scope.searchReviewList = function () {
            if($scope.search_review_item) {
                $scope.reviewSearchHidden = true;
                $scope.reviewListHidden = false;
                search_text = $scope.search_review_item
                $http.get("/api/rest-review-search/?text="+search_text).success(function(data){
                    $scope.search_review_list = data.results;
                    $scope.search_review_list.search_list = true;
                });
            }
        }
        //Close the search display
        $scope.closeReviewSearch = function () {
            $scope.reviewSearchHidden = false;
            $scope.reviewListHidden = true;
            $scope.search_review_list = [];
            $scope.search_review_item = ''
            $('#search_review_display').html('');
        }

        // $scope.showRating = function(review_span_id){

        // };
    });

    app.directive('reviewList', function () {
        return {
            restrict: 'E',
            templateUrl: "review_list_template"
        };
    });

    app.controller('ReviewDetailController', function($http, $scope, $sce){
        $scope.review = {};
        $scope.init = function(id, preview_review) {
            $scope.review_url = '/api/review/'+id;
            if(preview_review) {
                $scope.review_url = '/api/review/'+id+"/?preview_review=1";
            }
            $http.get($scope.review_url).success(function(data){
                $scope.review = data;
                $scope.ratings = [{
                    current: data.expert_rating,
                    max: 5
                }];
            });
        };
        $scope.to_trusted = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };
    });

    app.controller('WriterReviewController', function($http, $scope){
        $scope.init = function(id) {
            $http.get('/api/review-writer/'+id).success(function(data){
                $scope.writer = data;
            });
        };
    });
})();
