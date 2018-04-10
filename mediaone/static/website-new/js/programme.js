// (function(){
    var app = angular.module('programme',['mediaone', 'infinite-scroll']);
    app.controller('ProgrammeController', function($http, $scope, $sce){

        // make sure the search div is hidden
        $scope.SearchHidden = false;
        $scope.ProgrammeHidden = true;
        //

        $scope.programme_list = [];
        $scope.programme_list_url = '/api/programmes/'
        $scope.has_displayed_all_programmes = false;
        $scope.featured_video_list = []
        $scope.featured_video_id = ''
        $scope.featured_video_url = ''
        $scope.isEndOfResults = false;

        $scope.following_programme_list = []
        $scope.following_programme_list_url = '/api/programmes/?following=true'
        $scope.isEndOfFollowingProgrammes = false;

        $scope.new_episode_list = []
        $scope.new_episode_list_url = '/api/episodes/?new=true'
        $scope.has_displayed_all_new_episodes = false;

        $scope.watch_later_episode_list = []
        $scope.watch_later_episode_list_url = '/api/episodes/?watch_later=true'
        $scope.isEndOfWatchLaterEpisodess = false;

        $scope.recommended_videos = [];
        $scope.recommended_videos_url = '/api/recommended-episodes/'
        $scope.has_displayed_all_recommended_videos = false;

        $http.get('/api/episodes/?programme_id=0').success(function(data){
            $scope.featured_video = data.results[0];
            if (data.results[0].get_youtube_embed_link) {
                $scope.featured_video_url = data.results[0].get_youtube_embed_link
            } else  if(data.results[0].get_dailymotion_embed_link) {
                $scope.featured_video_url = data.results[0].get_dailymotion_embed_link
            }
            $('.loading.featured').remove();
        });


        $scope.getNewEpisodeList = function() {
            if($scope.has_displayed_all_new_episodes) return;
            $http.get($scope.new_episode_list_url).success(function(data){
                angular.forEach(data.results,function(item) {
                    item['detail_link'] = "/programmes/"+item.programme.slug+"?episode_id="+item.id;
                    $scope.new_episode_list.push(item);
                });
                if(data.next != null){
                    $scope.new_episode_list_url = data.next;
                }
                else {
                    $scope.has_displayed_all_new_episodes=true;
                    return;
                };
             });
        };

        $scope.searchProgrammeList = function() {
            if($scope.search_programme_item.length > 2) {
                $scope.SearchHidden = true;
                $scope.ProgrammeHidden = false;
                search_text = $scope.search_programme_item;
                console.log(search_text);
                $http.get("/api/rest-episode-search/?text="+search_text).success(function(data){
                    $scope.search_list_pagination_params = data;
                    $scope.search_list = data.results;
                    console.log(data.results);
                });
            } else if ($scope.search_programme_item.length == 0){
                $scope.SearchHidden = false;
                $scope.ProgrammeHidden = true;
            }
        };

        $scope.closeProgrameSearch = function () {
            //Close the search display and show programe               
            console.log("closeProgrameSearch");
            $scope.SearchHidden = false;
            $scope.ProgrammeHidden = true;
            // $scope.search_news_item = ''
            // $('#search_display').html('');
        };

        //For pagination
        $scope.searchPaginationcall = function(search_url){
            $http.get(search_url).success(function(data){
                $scope.search_list_pagination_params = data;
                $scope.search_list = data.results;
            });

        }
        $scope.getProgrammeList = function() {
            if ($scope.has_displayed_all_programmes) return;
            $http.get($scope.programme_list_url).success(function(data){
                angular.forEach(data.results,function(item) {
                    $http.get('/api/episodes/?programme_id='+item.id).success(function(resp){
                        resp.results.splice(6);
                        item["episodes"] = resp.results;
                        angular.forEach(item["episodes"],function(episode) {
                            episode['detail_link'] = "/programmes/"+episode.programme.slug+"?episode_id="+episode.id;
                        });
                    });
                    $scope.programme_list.push(item);
                });
                if(data.next != null){
                    $scope.programme_list_url = data.next;
                }
                else {
                    $scope.has_displayed_all_programmes = true;
                    return;
                };
             });
        };

        $scope.getRecommendedVideoList = function() {
            if ($scope.has_displayed_all_recommended_videos) return;
            $http.get($scope.recommended_videos_url).success(function(data){
                angular.forEach(data.results,function(item) {
                    item['detail_link'] = "/programmes/"+item.programme.slug+"?episode_id="+item.id;
                    $scope.recommended_videos.push(item);
                });
                if(data.next != null){
                    $scope.recommended_videos_url = data.next;
                }
                else {
                    $scope.has_displayed_all_recommended_videos = true;
                    return;
                };
             });
        };

        $scope.getNewEpisodeList();
        $scope.getProgrammeList();
        $scope.getRecommendedVideoList();

        $scope.init = function() {
        }

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
                if ( data.follow_status =='Unfollow') {
                    $("#follow_"+programmeId).removeClass('follow');
                    $("#follow_"+programmeId).addClass('unfollow');
                    $("#follow_"+programmeId).html("<i class='fa fa-minus'></i> UnFollow");
                } else if (data.follow_status =="Follow") {
                    $("#follow_"+programmeId).removeClass('unfollow');
                    $("#follow_"+programmeId).addClass('follow');
                    $("#follow_"+programmeId).html("<i class='fa fa-plus'></i> Follow");
                }
            });
        };
        $scope.setwatchLater = function(episodeId, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $http.get('/ajax/set_watch_later/'+episodeId).success(function(data){
                    //TODO: watched later goes here
                    // $("#watch_later_"+episodeId).html(data.watch_later_status);
                    $('.id_'+episodeId+'_bfr_watch_later').addClass('hide');
                    $('.id_'+episodeId+'_aftr_watch_later').removeClass('ng-hide');
                });
            } else{
                $('.login-container').toggleClass('in');
            }
        };

        $scope.loadVideoInIframe = function(episode) {
            episode.get_video_embed_link = $sce.trustAsResourceUrl(episode.get_video_embed_link);
            $('#id_featured_video').html("<iframe height='400px' width='100%'src="+episode.get_video_embed_link+"?autoplay=1 frameborder='0' allowfullscreen></iframe>");
            $http.get('/ajax/set_watched/'+episode.id).success(function(data){
                //TODO: watched logic goes here
            });
        };

        $scope.loadVideoAsFeatured = function(episode) {
            episode.get_video_embed_link = $sce.trustAsResourceUrl(episode.get_video_embed_link);
            $('#id_featured_video').html("<iframe height='400px' width='100%'src="+episode.get_video_embed_link+"?autoplay=1 frameborder='0' allowfullscreen></iframe>");
            $('#id_featured_programme').text(episode.programme.title);
            $scope.featured_video = episode;
        };
    });

    app.directive('searchProgramme', function () {
        
        return {
            restrict: 'E',
            templateUrl: "/search_programme_template"
        };
    });

    app.controller('ProgrammeDetailController', function($http, $scope, $sce){

        $scope.following_programme_list = []
        $scope.following_programme_list_url = '/api/programmes/?following=true'
        $scope.isEndOfFollowingProgrammes = false;

        $scope.watch_later_episode_list = []
        $scope.watch_later_episode_list_url = '/api/episodes/?watch_later=true'
        $scope.isEndOfWatchLaterEpisodess = false;

        $scope.getNewEpisodeList = function() {
            if($scope.has_displayed_all_new_episodes) return;
            $http.get($scope.new_episode_list_url).success(function(data){
                angular.forEach(data.results,function(item) {
                    $scope.new_episode_list.push(item);
                });
                if(data.next != null){
                    $scope.new_episode_list_url = data.next;
                }
                else {
                    $scope.has_displayed_all_new_episodes=true;
                    return;
                };
             });
        };

        $scope.init = function(programme_id, featured_episode_id) {
            $scope.programme_id = programme_id;
            $http.get('/api/episodes/'+featured_episode_id).success(function(data){
                data.get_video_embed_link = $sce.trustAsResourceUrl(data.get_video_embed_link);
                $scope.featured_video = data;
                $('#id_featured_video').html("<iframe height='400px' width='100%'src="+$scope.featured_video.get_video_embed_link+"?autoplay=1 frameborder='0' allowfullscreen></iframe>");
                $(".loading.featured").remove();
            });
            $scope.new_episode_list = []
            $scope.new_episode_list_url = '/api/episodes/?programme_id='+programme_id+'&exclude_id='+featured_episode_id;
            $scope.has_displayed_all_new_episodes = false;
            $scope.getNewEpisodeList();
        }

        $scope.setwatchLater = function(episodeId, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $http.get('/ajax/set_watch_later/'+episodeId).success(function(data){
                    //TODO: watched later goes here
                    // $("#watch_later_"+episodeId).html(data.watch_later_status);
                    $('#id_'+episodeId+'_bfr_watch_later').addClass('hide');
                    $('#id_'+episodeId+'_aftr_watch_later').removeClass('ng-hide');
                });
            } else {
                $('.login-container').toggleClass('in');
            }
        };
        $scope.loadVideoInIframe = function(episode) {
            episode.get_video_embed_link = $sce.trustAsResourceUrl(episode.get_video_embed_link);
            $('#id_featured_video').html("<iframe height='400px' width='100%'src="+episode.get_video_embed_link+"?autoplay=1 frameborder='0' allowfullscreen></iframe>");
        };

        $scope.loadVideoAsFeatured = function(episode) {
            document.title = episode.title;
            window.history.pushState('', document.title, "/programmes/"+episode.programme.slug+"?episode_id="+episode.id);
            episode.get_video_embed_link = $sce.trustAsResourceUrl(episode.get_video_embed_link);
            $('#id_featured_video').html("<iframe height='400px' width='100%'src="+episode.get_video_embed_link+"?autoplay=1 frameborder='0' allowfullscreen></iframe>");
            $('#id_featured_programme').text(episode.programme.title);
            $scope.featured_video = episode;
        };

    });
