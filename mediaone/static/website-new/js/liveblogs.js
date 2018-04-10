(function(){
    var app = angular.module('liveblogs',['mediaone', 'infinite-scroll']);
    app.controller('LiveblogsController', function($http, $scope){

    	$scope.init = function(){
	 	    $scope.liveblog_list = [];
			$scope.isEndOfResults = false;
			$scope.liveblog_url = '/api/liveblogs';
    	};
        $scope.getLiveBlogList = function() {
            if ($scope.isEndOfResults) return;
            $scope.isEndOfResults = true;
            $http.get($scope.liveblog_url).success(function(data){
                $scope.liveblog_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    $scope.liveblog_list.push(item);
                });
                if($scope.liveblog_list_pagination_params.next != null){
                    $scope.liveblog_url = $scope.liveblog_list_pagination_params.next;
                }
                else {
                    $scope.has_displayed_all = true;
                    return;
                };
                $scope.isEndOfResults = false;
             });
        };
    });
    app.controller('LiveblogDetailController', function($http, $scope, $sce){
        $scope.blog = {};
        $scope.init = function(id) {
            $http.get('/api/liveblogs/'+id).success(function(data){
                $scope.blog = data;
            });
        };
        $scope.to_trusted = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };
    });
})();