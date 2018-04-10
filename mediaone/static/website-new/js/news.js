(function(){
    var app = angular.module('news',['mediaone', 'infinite-scroll', 'ngCookies']);
    var show_lead_news = true;
    app.controller('NewsController', function($http, $scope, $filter, $cookies){
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
        $scope.init = function(column_spacing, preview_id, category_id, sub_category_id, topic_id, add_spacing_home, home) {
            $scope.category_id = category_id;
            $scope.sub_category_id = sub_category_id;
            $scope.topic_id = topic_id;
            $scope.news_list_url = "/api/news/?category_id="+category_id+"&sub_category_id="+sub_category_id+"&topic_id="+topic_id+"&list=true";
            if (preview_id){
                $scope.news_list_url = "/api/news/?preview_id="+preview_id;
            }
            $scope.show_loading = 3;
            $scope.news_list = [];
            $scope.isEndOfResults = false;
            $scope.breaking_news = '';
            $scope.sortOrder = 'published_on';
            $scope.column_spacing = column_spacing;
            $scope.add_spacing_home = add_spacing_home;
            $scope.column_list = [];

            $scope.sort_options = [{'key': 'published_on', 'value': 'Latest'},
                                   {'key': 'vote_count', 'value': 'Most Voted'},
                                   {'key': 'relevance', 'value': 'Relevant'}]
            $scope.defaults_sort = $scope.sort_options[0]
            $http.get('/api/column/').success(function(data){
                $scope.column_list = data.results.splice(0,3);
            });
            $http.get('/api/sticky-news/').success(function(data){
                $scope.sticky_news = data.results;
            });

            $scope.nearme_news_list = [];
            $scope.itemLocality = null;
            /* Nearme logic starts here */
            var geocoder = new google.maps.Geocoder();
            if (navigator.geolocation && home=='True') {
                if (!$cookies.getObject('lat')) {
                    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
                } else {
                    codeLatLng($cookies.getObject('lat'), $cookies.getObject('lng'));
                }
            }
            // Get the latitude and the longitude;
            function successFunction(position) {
                if (!$cookies.getObject('lat')) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 7);
                    // Setting a cookie
                    $cookies.put('lat', lat, {'expires': expireDate});
                    $cookies.put('lng', lng, {'expires': expireDate});
                }
                codeLatLng(lat,lng);
            }

            function errorFunction() {
                alert("Please enable location settings in your browser in order to get Near me news.");
            }
            /* function to get the city(locality) based on latitude and longitude.*/
            function codeLatLng(lat, lng) {
                // uncomment the following line to test the location using Kochi.
                // var latlng = new google.maps.LatLng(9.9700, 76.2800);
                var latlng = new google.maps.LatLng(lat, lng);
                geocoder.geocode({'latLng' : latlng},
                      function(results, status) {
                          if (status == google.maps.GeocoderStatus.OK) {
                              if (results[1]) {
                                  var arrAddress = results;
                                  // iterate through address_component array
                                  $.each(arrAddress, function(i, address_component) {
                                      if (address_component.types[0] == "locality") {
                                          $scope.itemLocality = address_component.address_components[0].long_name;
                                      }
                                  });
                                $http.get('/api/nearme-news/?locality='+$scope.itemLocality).success(function(data){
                                        $scope.near_me_news_list_pagination_params = data;
                                        $scope.near_me_news_list = data.results;
                                });
                              } else {
                                  alert("No results found");
                              }
                          } else {
                              alert("Geocoder failed due to: " + status);
                          }
                      });
            }
            /* Nearme logic ends here */
        };
        $scope.getNewsList = function() {
            if ($scope.isEndOfResults) return;
            $scope.isEndOfResults = true;
            $http.get($scope.news_list_url).success(function(data){
                $scope.news_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    item.has_youtube_url = false;
                    if(item.youtube_url){
                        item.has_youtube_url = true;
                    }
                    $scope.news_list.push(item);
                });
                if($scope.news_list_pagination_params.next != null){
                    $scope.news_list_url = $scope.news_list_pagination_params.next;
                }
                else {
                    $scope.has_displayed_all = true;
                    return;
                };
                $scope.isEndOfResults = false;
                $('.loading.home').remove();
             });
        };

        $scope.updateSortOrder = function(order_key, order_value) {
            append_url = '';
            if($scope.category_id){
                append_url = append_url+"&category_id="+$scope.category_id;
            }
            if($scope.sub_category_id){
                append_url = append_url+"&sub_category_id="+$scope.sub_category_id;
            }
            if($scope.topic_id){
                append_url = append_url+"&topic_id="+$scope.topic_id;
            }
            $scope.defaults_sort = {'key': order_key, 'value': order_value}
            $scope.news_list = [];
            $scope.isEndOfResults = false;
            $scope.news_list_url = "/api/news/?order_by="+order_key+append_url;
            $scope.getNewsList();

            $http({
                method: 'POST',
                url: '/ajax/news/update_order_session/',
                data: $.param({
                    'order_by': $scope.sortOrder
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function(resp){

            });

        };

        $scope.followColumnCategory = function(category_id, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $http.get('/api/column-category/'+category_id+'/follow/').success(function(data){
                    if(data.is_followed_column_category == true){
                        $('.follow_column_cat_'+category_id).removeClass("ng-show");
                        $('.follow_column_cat_'+category_id).addClass("ng-hide");
                        $('.unfollow_column_cat_'+category_id).removeClass("ng-hide");
                        $('.unfollow_column_cat_'+category_id).addClass("ng-show");
                    } else {
                        $('.follow_column_cat_'+category_id).removeClass("ng-hide");
                        $('.follow_column_cat_'+category_id).addClass("ng-show");
                        $('.unfollow_column_cat_'+category_id).removeClass("ng-show");
                        $('.unfollow_column_cat_'+category_id).addClass("ng-hide");
                    }
                });
            }
            else{
                $('.login-container').toggleClass('in');
                // alert("You must be logged in to follow this column category!")
            }
        };

    });

    app.controller('BreakingNewsController', function($http, $scope, $filter, $rootScope){
        $scope.init = function(breaking_news_preview_id) {
            $scope.breaking_news = null;
            $scope.breaking_news_url = '/api/breaking-news/';
            if (breaking_news_preview_id){
                $scope.breaking_news_url = "/api/breaking-news/?preview_id="+breaking_news_preview_id;
            }

            $http.get($scope.breaking_news_url).success(function(data){
                $scope.breaking_news = data.results[0];
                $rootScope.breaking_news_for_hiding_rltd_news =  data.results[0];
                if ($scope.breaking_news) {
                    show_lead_news = false;
                    $("#lead_news_div").hide();
                    $scope.breaking_news.background_image = $scope.breaking_news.background_image.replace(" ", "%20");
                    if ($scope.breaking_news.news_align == 'right') {
                        $scope.breakingNewsLeftPanel = false;
                        $scope.breakingNewsRightPanel = true;
                    } else {
                        $scope.breakingNewsLeftPanel = true;
                        $scope.breakingNewsRightPanel = false;
                    }

                    if ($scope.breaking_news.related_align == 'right') {
                        if($scope.breaking_news.show_live_update) {
                            $scope.liveUpdateLeftPanel = false;
                            $scope.liveUpdateRightPanel = true;
                            $scope.relatedNewsLeftPanel = false;
                            $scope.relatedNewsRightPanel = false;
                        } else {
                            $scope.relatedNewsLeftPanel = false;
                            $scope.relatedNewsRightPanel = true;
                            $scope.liveUpdateLeftPanel = false;
                            $scope.liveUpdateRightPanel = false;
                        }
                    } else {
                        if($scope.breaking_news.show_live_update) {
                            $scope.liveUpdateLeftPanel = true;
                            $scope.liveUpdateRightPanel = false;
                            $scope.relatedNewsLeftPanel = false;
                            $scope.relatedNewsRightPanel = false;
                        } else {
                            $scope.relatedNewsLeftPanel = true;
                            $scope.relatedNewsRightPanel = false;
                            $scope.liveUpdateLeftPanel = false;
                            $scope.liveUpdateRightPanel = false;
                        }
                    }
                } else {
                    $("#breaking_news_div").hide();
                }

            });
        };

        // For closing the breaking news page
        $scope.closeBreakingNews = function(){
            $("#breaking_news_div").hide();
            $('.breaking_news_rltd_news').removeClass('breaking_news_rltd_news');
            if($('.news_starting_section').hasClass("ng-hide")){
                $('.news_starting_section').removeClass('ng-hide');
            }
            $(".showing_for_second_news").hide();
        }
    });

    app.controller('SportsNewsController', function($http, $scope){
        $scope.news_list = [];
        $http.get('/api/news?category=Sports').success(function(data){
            $scope.news_list_pagination_params = data;
            $scope.news_list = data.results;
         });
    });

    app.directive('newsList', function () {
        return {
            restrict: 'E',
            templateUrl: "news_list_template_new"
        };
    });

    app.directive('breakingNews', function () {
        return {
            restrict: 'E',
            scope: {
                breaking_news_preview_id: "=breaking_news_preview_id"
            },
            templateUrl: "breaking_news_template",
        };
    });

    app.directive('categorystickyNews', function () {
        return {
            restrict: 'E',
            scope: {
                stickycategory_list_news_preview_id: "=stickycategory_list_preview_id"
            },
            templateUrl: "stickycategory-list",
        };
    });

    app.controller('CategoryStickyNewsController', function($http, $scope, $filter, $rootScope){
        $scope.init = function() {
            $scope.stickycategory_newslist = null;
            $scope.stickycategory_newslist_url = '/api/stickycategory/';
            $http.get($scope.stickycategory_newslist_url).success(function(data){
                $scope.stickycategory_newslist = data.results[0];
            });
            $scope.markFavourite = function(id) {
            $http.get('/api/news/'+id+"/favourite/?favourite=true").success(function(data){
                $('#show-favourite-news'+id).show();
                if($('#show-favourite-news'+id).hasClass("ng-hide")){
                    $('#show-favourite-news'+id).removeClass("ng-hide");
                }
                $('#hide-favourite-news'+id).hide();
            });
        };

        $scope.removeFavourite = function(id) {
            $http.get('/api/news/'+id+"/favourite/?favourite=false").success(function(data){
                $('#hide-favourite-news'+id).show();
                if($('#hide-favourite-news'+id).hasClass("ng-hide")){
                    $('#hide-favourite-news'+id).removeClass("ng-hide");
                }
                $('#show-favourite-news'+id).hide();
            });
        };

        $scope.updateUpvoteSingleNews = function(id, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $http.get('/api/news/'+id+"/upvote/?vote=update").success(function(data){
                    $(".single_upvote_count_"+id).html(data['vote_count']);
                });
            }
            else{
                alert("You must be logged in to upvote this news!")
            }
        };


        $scope.updateFavouriteSingleNews = function(id, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $http.get('/api/news/'+id+"/favourite/?favourite=update").success(function(data){
                    $(".single_favourite_count_"+id).html(data['get_favourite_user_count']);
                });
            }
            else{
                alert("You must be logged in to favourite this news!")
            }
        };
     };
 });

    app.directive('leadNews', function () {
        return {
            restrict: 'E',
            scope: {
                lead_news_preview_id: "=lead_news_preview_id"
            },
            templateUrl: "lead_news_template",
        };
    });

    app.controller('LeadNewsController', function($http, $scope, $filter, $rootScope){
        $scope.init = function(lead_news_preview_id) {
            $scope.lead_news = null;
            $scope.lead_news_url = '/api/lead-news/';
            if (lead_news_preview_id){
                $scope.lead_news_url = "/api/lead-news/?preview_id="+lead_news_preview_id;
            }

            $http.get($scope.lead_news_url).success(function(data){
                if (show_lead_news) {
                    $scope.lead_news = data.results[0];
                    if ($scope.lead_news) {
                        $scope.lead_news.background_image = $scope.lead_news.background_image.replace(" ", "%20");
                        if ($scope.lead_news.news_align == 'right') {
                            $scope.leadNewsLeftPanel = false;
                            $scope.leadNewsRightPanel = true;
                        } else {
                            $scope.leadNewsLeftPanel = true;
                            $scope.leadNewsRightPanel = false;
                        }
                    } else {
                        $("#lead_news_div").hide();
                    }

                }
            });
        };

        // For closing the breaking news page
        // $scope.closeLeadNews = function(){
        //     $("#lead_news_div").hide();
        //     if($('.news_starting_section').hasClass("ng-hide")){
        //         $('.news_starting_section').removeClass('ng-hide');
        //     }
        //     $(".showing_for_second_news").hide();
        // };
    });
// NewsDetailController is used for infinite scrolling in detail page
    app.controller('NewsDetailController', function($http, $scope){

        $scope.init = function(id, order_by, category_id, sub_category_id,topic_id) {
            $scope.news_list_url = "/api/news/?from_id="+id+"&order_by="+order_by+"&category_id="+category_id+"&sub_category_id="+sub_category_id+"&topic_id="+topic_id+'&paginate_by=3&get_ids=true';
            $scope.news_list = [];
            $scope.isEndOfResults = false;

            $scope.news_detail_url = "/api/news/"+id;

            $http.get($scope.news_detail_url).success(function(data){
                $.ajax({
                      url: '/api/news/'+id+'/view/',
                    }).done(function(data) {
                        return;
                    });//increments view count when a user clicks on news.
                $scope.featured_news_item = data;
                if(data.results){
                    $scope.featured_news_item = data.results[0];
                }
                $(".loading.detail.featured").hide();
            });
            $http.get('/api/related-news/'+id).success(function(data){
                $scope.featured_related_news = data.results.slice(0,3);
            });
        };
        $scope.sleep = function(milliseconds) {
          var start = new Date().getTime();
          for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
              break;
            }
          }
        }


        $scope.getDetailNewsList = function() {
            if ($scope.isEndOfResults) return;
            $scope.isEndOfResults = true;
            $http.get($scope.news_list_url).success(function(data){
                $scope.news_list_pagination_params = data;
                for (i=0;i<data.results.length;i++) {
                    var news_id = data.results[i]['id'];
                    $http.get('/api/news/'+news_id).success(function(result){
                        item = result;
                        $scope.news_list.push(item);
                    });

                    $http.get('/api/related-news/'+news_id).success(function(related_data){
                        for(j=0;j<$scope.news_list.length;j++){
                            if (related_data.newsitem_id == $scope.news_list[j].id) {
                                $scope.news_list[j]['related_news'] = related_data.results;
                            }
                        }
                    });
                }

                // angular.forEach(data.results,function(item) {
                //     console.log(item['id']);
                //     $http.get('/api/news/'+item['id']).success(function(data){
                //         item = data;
                //         $http.get('/api/related-news/'+item['id']).success(function(data){
                //             item['related_news'] = data.results;
                //             $scope.news_list.push(item);
                //         });
                //     });
                // });

                if($scope.news_list_pagination_params.next != null){
                    $scope.news_list_url = $scope.news_list_pagination_params.next;
                }
                else {
                    $scope.has_displayed_all = true;
                    return;
                };
                $scope.isEndOfResults = false;
                $('.loading.detail').hide();
             });

        };

        $scope.markFavourite = function(id) {
            $http.get('/api/news/'+id+"/favourite/?favourite=true").success(function(data){
                $('#show-favourite-news'+id).show();
                if($('#show-favourite-news'+id).hasClass("ng-hide")){
                    $('#show-favourite-news'+id).removeClass("ng-hide");
                }
                $('#hide-favourite-news'+id).hide();
            });
        };

        $scope.removeFavourite = function(id) {
            $http.get('/api/news/'+id+"/favourite/?favourite=false").success(function(data){
                $('#hide-favourite-news'+id).show();
                if($('#hide-favourite-news'+id).hasClass("ng-hide")){
                    $('#hide-favourite-news'+id).removeClass("ng-hide");
                }
                $('#show-favourite-news'+id).hide();
            });
        };

        $scope.updateUpvoteSingleNews = function(id, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $http.get('/api/news/'+id+"/upvote/?vote=update").success(function(data){
                    $(".single_upvote_count_"+id).html(data['vote_count']);
                });
            }
            else{
                alert("You must be logged in to upvote this news!")
            }
        };


        $scope.updateFavouriteSingleNews = function(id, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $http.get('/api/news/'+id+"/favourite/?favourite=update").success(function(data){
                    $(".single_favourite_count_"+id).html(data['get_favourite_user_count']);
                });
            }
            else{
                alert("You must be logged in to favourite this news!")
            }
        };

        $scope.followTopic = function(topic_id, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $http.get('/api/topic/'+topic_id+'/follow/').success(function(data){
                    if(data.is_followed_topic == true){
                        $('.follow-first-topic_'+topic_id).removeClass("ng-show");
                        $('.follow-first-topic_'+topic_id).addClass("ng-hide");
                        $('.unfollow-first-topic_'+topic_id).removeClass("ng-hide");
                        $('.unfollow-first-topic_'+topic_id).addClass("ng-show");
                    } else {
                        $('.follow-first-topic_'+topic_id).removeClass("ng-hide");
                        $('.follow-first-topic_'+topic_id).addClass("ng-show");
                        $('.unfollow-first-topic_'+topic_id).removeClass("ng-show");
                        $('.unfollow-first-topic_'+topic_id).addClass("ng-hide");
                    }
                });
            }
            else{
                alert("You must be logged in to follow this news!")
            }
        };
    });


    app.controller('TopicNewsController', function($http, $scope){
        $scope.topic = {};
        $scope.init = function(id) {
            $http.get('/api/topics/'+id).success(function(data){
                $scope.topic = data;
         });
        };
    });

    app.controller('RecommendedNewsController', function($http, $scope){
        $scope.recommended_news_list = [];
        $scope.init = function(id) {
            $http.get('/api/recommended/').success(function(data){
                $scope.recommended_news_list = data.results;
         });
        };
    });

    app.filter('trusted', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);

    // SingleNewsDetailController is used for showing  single in detail page
    app.controller('SingleNewsDetailController', function($http, $scope){
        $scope.init = function(id, preview_news_item) {
            $scope.news_detail_url = "/api/news/"+id;
            if(preview_news_item){
                $scope.news_detail_url = "/api/news/?preview_detail_id="+id
            }
            $http.get($scope.news_detail_url).success(function(data){
                $scope.news_item = data;
                if(data.results){
                    $scope.news_item = data.results[0];
                }
            });
            $http.get('/api/related-news/'+id).success(function(data){
                $scope.related_news = data.results.slice(0,3);
            });
        };

        $scope.updateUpvoteSingleNews = function(id, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $scope.news_item.is_upvoted = !$scope.news_item.is_upvoted;
                $http.get('/api/news/'+id+"/upvote/?vote=update").success(function(data){
                    $(".single_upvote_count").html(data['vote_count']);
                });
            }
            else{
                alert("You must be logged in to upvote this news!")
            }
        };

        $scope.updateFavouriteSingleNews = function(id, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $http.get('/api/news/'+id+"/favourite/?favourite=update").success(function(data){
                    $(".single_favourite_count").html(data['get_favourite_user_count']);
                });
            }
            else{
                alert("You must be logged in to favourite this news!")
            }
        };

        $scope.followTopic = function(topic_id, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $http.get('/api/topic/'+topic_id+'/follow/').success(function(data){
                    if(data.is_followed_topic == true){
                        $('.follow-first-topic').removeClass("ng-show");
                        $('.follow-first-topic').addClass("ng-hide");
                        $('.unfollow-first-topic').removeClass("ng-hide");
                        $('.unfollow-first-topic').addClass("ng-show");
                    } else {
                        $('.follow-first-topic').removeClass("ng-hide");
                        $('.follow-first-topic').addClass("ng-show");
                        $('.unfollow-first-topic').removeClass("ng-show");
                        $('.unfollow-first-topic').addClass("ng-hide");
                    }
                });
            }
            else{
                alert("You must be logged in to follow this news!")
            }
        };
    });
})();

window.resetDisqusComment = function(id, url){
    DISQUS.reset({
        reload: true,
        config: function () {
            this.page.identifier = id;
            this.page.url = 'http://127.0.0.1:8000/' + url;
        }
    });

    $('.thread_container_' + id).append($('#disqus_thread'))

};


// Function to implement auto scroll
$(function () {
    viewed_news_array = []
    $(document).scroll(function () {
        $('.title-anchor').each(function () {
            var top = window.pageYOffset;
            var distance = top - $(this).offset().top;
            var hash = $(this).attr('news-url');
            var newsId = $(this).attr('news-id');
            // 10 is an arbitrary padding choice,
            // if you want a precise check then use distance===0
            if (distance < 30 && distance > -30) {
                window.history.pushState('', document.title, hash);
                window.resetDisqusComment(newsId, hash)
                if ($.inArray(hash, viewed_news_array) == -1){
                    viewed_news_array.push($(this).attr('news-url'));
                    $.ajax({
                      url: '/api/news/'+$(this).attr('news-id')+'/view/',
                    }).done(function(data) {
                        return;
                    });
                }
            document.title = 'Latest Malayalam News from MediaOneTV - ' + $(this).attr('news-title');
            }
        });
        $('.end-anchor').each(function () {
            var top = window.pageYOffset;
            var distance = top - $(this).offset().top;
            var hash = $(this).attr('news-url');
            // 10 is an arbitrary padding choice,
            // if you want a precise check then use distance===0
            if (distance < 10 && distance > -10) {
                window.history.pushState('', document.title, hash);
                document.title = 'Latest Malayalam News from MediaOneTV - '+ $(this).attr('news-title');
            }
        });
    });
});