(function(){
    var app = angular.module('buzzfeeds',['mediaone', 'infinite-scroll']);
    app.controller('BuzzfeedsController', function($http, $scope){

        $scope.init = function(latest_buzzfeed_id) {
            $http.get('/api/buzzfeeds/'+latest_buzzfeed_id).success(function(data){
                $scope.featured_buzzfeed = data;
            });
            $scope.buzzfeeds_list = [];
            $scope.buzzfeeds_url = '/api/buzzfeeds/?exclude_id='+latest_buzzfeed_id;
            $scope.has_displayed_all_buzzfeeds = false;
            $scope.getBuzzFeedList();
        }
        $scope.getBuzzFeedList = function() {
            if($scope.has_displayed_all_buzzfeeds) return;
            $http.get($scope.buzzfeeds_url).success(function(data){
                angular.forEach(data.results,function(item) {
                    $scope.buzzfeeds_list.push(item);
                });
                if(data.next != null){
                    $scope.buzzfeeds_url = data.next;
                }
                else {
                    $scope.has_displayed_all_buzzfeeds=true;
                    return;
                };
            });
        };

        $scope.loadVideoInIframe = function(buzzfeed) {
            $('#id_featured_video').html("<iframe height='400px' width='100%'src="+buzzfeed.get_video_embed_link+"?autoplay=1 frameborder='0' allowfullscreen></iframe>");
        };

        $scope.loadVideoAsFeatured = function(buzzfeed) {
            $('#id_featured_video').html("<iframe height='400px' width='100%'src="+buzzfeed.get_video_embed_link+"?autoplay=1 frameborder='0' allowfullscreen></iframe>");
            $scope.featured_buzzfeed = buzzfeed;
        };
    });
    app.filter('trusted', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);
})();