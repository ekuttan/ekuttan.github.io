// (function(){
    var app = angular.module('programme',['mediaone', 'infinite-scroll']);
    app.controller('ProgrammeController', function($http, $scope){
        $scope.programme_list = [];
        $scope.programme_list_url = '/api/programmes/'
        $scope.featured_video_list = []
        $scope.featured_video_id = ''
        $scope.featured_video_url = ''
        $scope.isEndOfResults = false;

        $scope.following_programme_list = []
        $scope.following_programme_list_url = '/api/programmes/?following=true'
        $scope.isEndOfFollowingProgrammes = false;

        $scope.new_episode_list = []
        $scope.new_episode_list_url = '/api/episodes/?new=true'
        $scope.isEndOfNewEpisodess = false;

        $scope.watch_later_episode_list = []
        $scope.watch_later_episode_list_url = '/api/episodes/?watch_later=true'
        $scope.isEndOfWatchLaterEpisodess = false;

        $http.get('/api/episodes/?programme_id=0').success(function(data){
            $scope.featured_video_list = data.results.splice(1);
            if (data.results[0].get_youtube_embed_link) {
                $scope.featured_video_url = data.results[0].get_youtube_embed_link
            } else  if(data.results[0].get_dailymotion_embed_link) {
                $scope.featured_video_url = data.results[0].get_dailymotion_embed_link
            }
         });

        $scope.init = function() {
            $scope.programmeSearchShow = false;
            $scope.programmeListShow = true;
            $scope.search_programme_list = [];
        }
        $scope.searchProgrammeList = function () {
            if($scope.search_programme_item) {
                $scope.programmeSearchShow = true;
                $scope.programmeListShow = false;
                search_text = $scope.search_programme_item
                $http.get("/api/rest-episode-search/?text="+search_text).success(function(data){
                    $scope.search_programme_list = data.results;
                });
            }
        }
        //Close the search display
        $scope.closeProgrameSearch = function () {
            $scope.programmeSearchShow = false;
            $scope.programmeListShow = true;
            $scope.search_programme_list = [];
            $scope.search_programme_item = ''
            $('#search_programme_display').html('');
        }

        $scope.getProgrammeList = function() {
            if ($scope.isEndOfResults) return;
            $scope.isEndOfResults = true;
            $http.get($scope.programme_list_url).success(function(data){
                $scope.programme_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    $http.get('/api/episodes/?programme_id='+item.id).success(function(resp){
                        resp.results.splice(3);
                        item["episodes"] = resp.results;
                        item["detail_link"] = "/programmes/"+item.slug+"/?id="+resp.results[0].id;
                    });
                    $scope.programme_list.push(item);
                });
                if($scope.programme_list_pagination_params.next != null){
                    $scope.programme_list_url = $scope.programme_list_pagination_params.next;
                }
                else {
                    $scope.has_displayed_all = true;
                    return;
                };
                $scope.isEndOfResults = false;
             });
        };

        $scope.getFollowingProgrammeList = function() {
            if ($scope.isEndOfFollowingProgrammes) return;
            $scope.isEndOfFollowingProgrammes = true;
            $http.get($scope.following_programme_list_url).success(function(data){
                $scope.following_programme_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    $scope.following_programme_list.push(item);
                });
                if($scope.following_programme_list_pagination_params.next != null){
                    $scope.following_programme_list_url = $scope.following_programme_list_pagination_params.next;
                }
                else {
                    $scope.has_displayed_all_following = true;
                    return;
                };
                $scope.isEndOfFollowingProgrammes = false;
             });
        };

        $scope.getNewEpisodeList = function() {
            if ($scope.isEndOfNewEpisodes) return;
            $scope.isEndOfNewEpisodes = true;
            $http.get($scope.new_episode_list_url).success(function(data){
                $scope.new_episode_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    $scope.new_episode_list.push(item);
                });
                if($scope.new_episode_list_pagination_params.next != null){
                    $scope.new_episode_list_url = $scope.new_episode_list_pagination_params.next;
                }
                else {
                    $scope.has_displayed_all_new = true;
                    return;
                };
                $scope.isEndOfNewEpisodes = false;
             });
        };

        $scope.getWatchLaterEpisodeList = function() {
            if ($scope.isEndOfWatchLaterEpisodes) return;
            $scope.isEndOfWatchLaterEpisodes = true;
            $http.get($scope.watch_later_episode_list_url).success(function(data){
                $scope.watch_later_episode_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    $scope.watch_later_episode_list.push(item);
                });
                if($scope.watch_later_episode_list_pagination_params.next != null){
                    $scope.watch_later_episode_list_url = $scope.watch_later_episode_list_pagination_params.next;
                }
                else {
                    $scope.has_displayed_all_watch_later = true;
                    return;
                };
                $scope.isEndOfWatchLaterEpisodes = false;
             });
        };

        $scope.changeVideo=function(link){
            $scope.featured_video_url=link;
        }
        $scope.setFollow = function(programmeId) {
            $http.get('/ajax/set_programme_follow/'+programmeId).success(function(data){
                $("#follow_"+programmeId).html(data.follow_status);
            });
        };
        $scope.setwatchLater = function(episodeId) {
            $http.get('/ajax/set_watch_later/'+episodeId).success(function(data){
                $("#watch_later_"+episodeId).html(data.watch_later_status);
            });
        };
    });

    app.controller('ProgrammeDetailController', function($http, $scope){
        $scope.init = function(programme_id, episode_embed_link) {
            $scope.mainVideoUrl = episode_embed_link;
            $scope.programme_id = programme_id;
            $scope.isEndOfResults = false;
            $scope.episode_list_url = '/api/episodes/?programme_id='+programme_id
            $scope.episode_list = []

            $http.get('/api/programmes/'+$scope.programme_id).success(function(data){
                $scope.programme = data;
            });
        }

        $scope.following_programme_list = []
        $scope.following_programme_list_url = '/api/programmes/?following=true'
        $scope.isEndOfFollowingProgrammes = false;

        $scope.new_episode_list = []
        $scope.new_episode_list_url = '/api/episodes/?new=true'
        $scope.isEndOfNewEpisodess = false;

        $scope.watch_later_episode_list = []
        $scope.watch_later_episode_list_url = '/api/episodes/?watch_later=true'
        $scope.isEndOfWatchLaterEpisodess = false;

        $scope.getEpisodeList = function() {
            if ($scope.isEndOfResults) return;
            $scope.isEndOfResults = true;
            $http.get($scope.episode_list_url).success(function(data){
                $scope.episode_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    $scope.episode_list.push(item);
                });
                if($scope.episode_list_pagination_params.next != null){
                    $scope.episode_list_url = $scope.episode_list_pagination_params.next;
                }
                else {
                    $scope.has_displayed_all = true;
                    return;
                };
                $scope.isEndOfResults = false;
             });
        };

        $scope.getFollowingProgrammeList = function() {
            if ($scope.isEndOfFollowingProgrammes) return;
            $scope.isEndOfFollowingProgrammes = true;
            $http.get($scope.following_programme_list_url).success(function(data){
                $scope.following_programme_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    $scope.following_programme_list.push(item);
                });
                if($scope.following_programme_list_pagination_params.next != null){
                    $scope.following_programme_list_url = $scope.following_programme_list_pagination_params.next;
                }
                else {
                    $scope.has_displayed_all_following = true;
                    return;
                };
                $scope.isEndOfFollowingProgrammes = false;
             });
        };

        $scope.getNewEpisodeList = function() {
            if ($scope.isEndOfNewEpisodes) return;
            $scope.isEndOfNewEpisodes = true;
            $http.get($scope.new_episode_list_url).success(function(data){
                $scope.new_episode_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    $scope.new_episode_list.push(item);
                });
                if($scope.new_episode_list_pagination_params.next != null){
                    $scope.new_episode_list_url = $scope.new_episode_list_pagination_params.next;
                }
                else {
                    $scope.has_displayed_all_new = true;
                    return;
                };
                $scope.isEndOfNewEpisodes = false;
             });
        };

        $scope.getWatchLaterEpisodeList = function() {
            if ($scope.isEndOfWatchLaterEpisodes) return;
            $scope.isEndOfWatchLaterEpisodes = true;
            $http.get($scope.watch_later_episode_list_url).success(function(data){
                $scope.watch_later_episode_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    $scope.watch_later_episode_list.push(item);
                });
                if($scope.watch_later_episode_list_pagination_params.next != null){
                    $scope.watch_later_episode_list_url = $scope.watch_later_episode_list_pagination_params.next;
                }
                else {
                    $scope.has_displayed_all_watch_later = true;
                    return;
                };
                $scope.isEndOfWatchLaterEpisodes = false;
             });
        };

        $scope.setwatchLater = function(episodeId) {
            $http.get('/ajax/set_watch_later/'+episodeId).success(function(data){
                $("#watch_later_"+episodeId).html(data.watch_later_status);
            });
        };

    });

    app.filter('trusted', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);
// })();