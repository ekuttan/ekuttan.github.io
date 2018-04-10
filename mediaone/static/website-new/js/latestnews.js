(function(){
    var app = angular.module('latestnews',['mediaone', 'infinite-scroll']);

    app.controller('LatestnewsController', function($http, $scope){

    	$scope.init = function(){
	 	    $scope.latest_news_list = [];
			$scope.isEndOfLatestNewsResults = false;
			$scope.latest_news_list_url = '/api/news/?order_by=published_on';
    	};
        $scope.getLatestNewsList = function() {
            if ($scope.isEndOfLatestNewsResults) return;
            $scope.isEndOfLatestNewsResults = true;
            $http.get($scope.latest_news_list_url).success(function(data){
                $scope.news_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    $scope.latest_news_list.push(item);
                });
                if($scope.news_list_pagination_params.next != null){
                    $scope.latest_news_list_url = $scope.news_list_pagination_params.next;
                }
                else {
                    $scope.has_displayed_all = true;
                    return;
                };
                $scope.isEndOfLatestNewsResults = false;
             });
        };
    });
})();