(function(){
    var app = angular.module('mediaone',['ngCookies']);
    app.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    });

    app.controller('CommonController', function($http, $scope, $sce, $cookies, $cookieStore){
        $scope.firstTimeCookie = $cookieStore.get('firstTime') ? $cookieStore.get('firstTime') : null;
        // Setting a cookie
        $cookieStore.put('firstTime', 'showed_hint');

        // For showing the login popup
        $scope.showLoginModal = false;
        $scope.toggleLoginModal = function(){
            $scope.showLoginModal = !$scope.showLoginModal;
        };

        $scope.showSiteTour = function(is_user_authenticted){
            var enjoyhint_instance = new EnjoyHint({
                  onEnd:function(){
                    if (is_user_authenticted == 'True') {
                        window.location = "/userprofile?site_tour=True"
                    }
                  }
            });

            var enjoyhint_script_steps = [
                {
                'next .btn-live-tv' : 'Click here for live tv'
                },
                {
                'next #id_search_news_item' : 'Search here'
                },
                {
                'next .overflow-nav' : 'Click here for more categories'
                },
                // {
                // 'next .btn-login' : 'Login'
                // },
                // {
                // 'next #user_details' : 'Mouse over here for profile page and logout'
                // },
                {
                'next #a_sort_news' : 'Sort news'
                },
                // {
                // 'next #a_upvote_0' : 'Click here to upvote news.'
                // },
                {
                'next #a_viewcount_0' : 'Number of Views'
                },
                {
                'next .column-list' : 'Recent 3 Columns.'
                },
                {
                'next #id_nearme_wid' : 'Near by news appears here'
                },
                {
                'next #id_video_on_demand_wid' : 'Latest videos are right here.'
                },
                {
                'next #id_programme_schedule_wid' : 'Now running and upcoming programmes.'
                },
            ];
            enjoyhint_instance.set(enjoyhint_script_steps);
            enjoyhint_instance.run();
        }
        $scope.init = function() {
            $scope.search_news_list = [];
            //This will hide the search DIV by default.
            $scope.SearchHidden = false;
            $scope.NewsHidden = true;


        };
        $scope.menu_list = [];
        $http.get('/api/main-category/?category_type=menu').success(function(data){
            $scope.menu_list = data;
        });


        $scope.live_tv_url = null
        $scope.live_tv_id = null
        $http.get('/api/live-tv-urls/').success(function(data){
            $scope.live_tv_id = data[0].live_tv;
            $scope.live_tv_gulf_id = data[0].live_tv_gulf;
            $scope.live_tv_url = "https://www.youtube.com/embed/" + $scope.live_tv_id;
            $scope.live_tv_gulf_url = "https://www.youtube.com/embed/" + data[0].live_tv_gulf+"?autoplay=1";
        });

        $scope.loadLiveTvGulf = function(){
            $('#id_mediaone_live_tv_gulf').removeClass('hide');
            $('#id_mediaone_live_tv_a').removeClass('hide');
            $scope.live_tv_url = "https://www.youtube.com/embed/" + $scope.live_tv_id+ "?autoplay=0";
            $('#id_mediaone_live_tv').addClass('hide');
            $('#id_mediaone_live_tv_gulf_a').addClass('hide');
        }

        $scope.loadLiveTv = function(){
            $('#id_mediaone_live_tv_gulf').addClass('hide');
            $('#id_mediaone_live_tv_a').addClass('hide');
            $scope.live_tv_gulf_url = "https://www.youtube.com/embed/" + $scope.live_tv_gulf_id+ "?autoplay=0";
            $('#id_mediaone_live_tv').removeClass('hide');
            $('#id_mediaone_live_tv_gulf_a').removeClass('hide');
        }

        $scope.show_live_tv = function(){
            $('.live-tv-container').toggleClass('in');
            $scope.live_tv_url = "https://www.youtube.com/embed/" + $scope.live_tv_id+ "?autoplay=1";
        }
        $scope.close_live_tv = function(){
            $('.live-tv-container').removeClass('in');
            $scope.live_tv_url = "https://www.youtube.com/embed/" + $scope.live_tv_id+ "?autoplay=0";
        }


        $scope.to_trusted = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };

        $scope.updateUpvote = function(id, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $(".vote_img_"+id).toggleClass("active");
                $http.get('/api/news/'+id+"/upvote/?vote=update").success(function(data){
                    $(".vote_count"+id).html(data['vote_count']);
                });
            }
            else{
                alert("You must be logged in to upvote this news!")
            }
        };

        $scope.getNumber = function(num) {
            return new Array(num);
        }

        $scope.widget_list = []
        $scope.widget_list_url = '/api/widgets/?sidebar=1'
        $scope.isEndOfWidgetList = false;
        $scope.has_changed_widget_url = false;

        $scope.getWidgetList = function(sidebar) {
            if(sidebar==1){
                $scope.sidebar_1 = true;
            } else if(sidebar == 2) {
                $scope.sidebar_2 = true;
            }
            if(sidebar && !$scope.has_changed_widget_url) {
                $scope.widget_list_url = '/api/widgets/?sidebar='+sidebar;
            }
            if ($scope.isEndOfWidgetList) return;
            $scope.isEndOfWidgetList = true;

            $http.get('/api/site-tour/').success(function(data){
                $scope.site_tour_image = data[0].site_tour_image;
            });

            $http.get($scope.widget_list_url).success(function(data){
                $scope.widget_list_pagination_params = data;
                angular.forEach(data.results,function(widget) {
                    if (widget.widget_type == 'custom url'){
                        $http.get('/api/custom-widget-urls/').success(function(data){
                            widget['related_data'] = data[0];
                        });
                    }
                    if (widget.widget_type == 'recent'){
                        $http.get('/api/news/?recent=true&widget=true?paginate_by='+widget.no_of_items).success(function(data){
                            widget['related_data'] = data.results;
                        });
                    }
                    if (widget.widget_type == 'recommended'){
                        $http.get('/api/recommended/?widget=true&paginate_by='+widget.no_of_items).success(function(data){
                            widget['related_data'] = data.results;
                        });
                    }
                    if (widget.widget_type == 'topic'){
                        $http.get('/api/news/?topic_id='+widget.topic.id+'&widget=true&paginate_by='+widget.no_of_items).success(function(data){
                            widget['related_data'] = {}
                            widget['related_data']['slug'] = widget.topic.slug;
                            widget['related_data']['avatar'] = widget.topic.avatar;
                            widget['related_data']['name'] = widget.topic.name;
                            widget['related_data']['news'] = data.results;
                        });
                    }
                    if (widget.widget_type == 'category'){
                        $http.get('/api/news/?category_id='+widget.category.id+"&widget=true&paginate_by="+widget.no_of_items).success(function(data){
                            widget['related_data'] = data.results;
                        });
                    }
                    if (widget.widget_type == 'recommended Videos'){
                        $http.get('/api/recommended-episodes/?paginate_by='+widget.no_of_items+'&widget=true').success(function(data){
                            widget['related_data'] = data.results;
                        });
                    }
                    // if (widget.widget_type == 'nearme'){
                    //     $http.get('/api/news/?recent=true').success(function(data){
                    //         widget['related'] = data.results;
                    //     });
                    // }
                    if (widget.widget_type == 'column'){
                        $http.get('/api/column/?paginate_by='+widget.no_of_items+'&widget=true').success(function(data){
                            widget['related_data'] = data.results;
                        });
                    }
                    if (widget.widget_type == 'programme'){
                        $http.get('/api/programme_schedules/?new=true').success(function(data){
                            widget['related_data'] = data.results;
                        });
                    }
                    if (widget.widget_type == 'video On Demand'){
                        $http.get('/api/episodes/?programme_id=0&widget=true').success(function(data){
                            widget['related_data'] = data.results;
                        });
                        $http.get('/api/programmes/?paginate_by='+widget.no_of_items+'&widget=true').success(function(data){
                            widget['programme_list'] = data.results;
                        });
                    }
                    if (widget.widget_type == 'movie Review'){
                        widget['related_data'] = [];
                        $http.get('/api/review/?paginate_by='+widget.no_of_items+'&widget=true&related_entity=film').success(function(data){
                            angular.forEach(data.results,function(item) {
                                item['int_expert_rating'] = Math.floor(item.expert_rating);
                                item['half_int_expert_rating'] = Math.round(item.expert_rating % 1) < 1 ? 0: 1 ;
                                widget['related_data'].push(item);
                            });
                        });
                    }
                    if (widget.widget_type == 'book Review'){
                        widget['related_data'] = [];
                        $http.get('/api/review/?paginate_by='+widget.no_of_items+'&widget=true&related_entity=book').success(function(data){
                            angular.forEach(data.results,function(item) {
                                item['int_expert_rating'] = Math.floor(item.expert_rating);
                                item['half_int_expert_rating'] = Math.round(item.expert_rating % 1) < 1 ? 0: 1 ;
                                widget['related_data'].push(item);
                            });
                        });
                    }
                    if (widget.widget_type == 'new Videos'){
                        $http.get('/api/episodes/?new=true?paginate_by='+widget.no_of_items+'&widget=true').success(function(data){
                            widget['related_data'] = data.results;
                        });
                    }
                    if (widget.widget_type == 'liveblog'){
                        $http.get('/api/liveblogs/?latest=true').success(function(data){
                            widget['related_data'] = data.results[0];
                        });
                    }
                    if (widget.widget_type == 'watch later Videos'){
                        $http.get('/api/episodes/?watch_later=true?paginate_by='+widget.no_of_items+'&widget=true').success(function(data){
                            widget['related_data'] = data.results;
                        });
                    }
                    $scope.widget_list.push(widget);
                });
                if($scope.widget_list_pagination_params.next != null){
                    $scope.widget_list_url = $scope.widget_list_pagination_params.next;
                    $scope.has_changed_widget_url = true;
                }
                else {
                    return;
                };
                $scope.isEndOfWidgetList = false;
             });
        };

        $scope.searchNewsList = function() {
            if($scope.search_news_item.length > 2) {
                $scope.SearchHidden = true;
                $scope.NewsHidden = false;
                search_text = $scope.search_news_item;
                $http.get("/api/rest-common-search/?text="+search_text).success(function(data){
                    $scope.search_list_pagination_params = data;
                    $scope.search_list = data.results;
                });
            } else if ($scope.search_news_item.length == 0){
                $scope.SearchHidden = false;
                $scope.NewsHidden = true;
            }
        };

        $scope.closeNewsSearch = function () {
            //Close the serach display and show news
            $scope.SearchHidden = $scope.SearchHidden = false;
            $scope.NewsHidden = $scope.NewsHidden = true;
            $scope.search_news_item = ''
            $('#search_display').html('');
        }

        //For pagination
        $scope.searchPaginationcall = function(search_url){
            $http.get(search_url).success(function(data){
                $scope.search_list_pagination_params = data;
                $scope.search_list = data.results;
            });

        }
        $scope.closeEditorsChoice = function(){
            $('#id_editors_choice').hide();
        }
    });

    app.filter('trusted', ['$sce', function ($sce) {
            return function(url) {
                return $sce.trustAsResourceUrl(url);
            };
        }]);

    app.directive('afterMenuBar', function ($timeout) {
        return function(scope, element, attrs) {
            if (scope.$last){
                $timeout(function () {
                    widths = window.recalcWidths();

                    $('.navbar-controls').css('left', widths.collapsed ? 0 : widths.navbarContainerWidth - widths.left);

                    $(".navbar-nav").overflowNavs({
                        "more" : "More",
                        "parent" : ".navbar-container",
                        "offset": widths.offset
                    });
                });
            }
        }
    });

    app.directive('menuBar', function () {
        return {
            restrict: 'E',
            templateUrl: "menu_bar_template"
        };
    });

    app.directive('toggleClass', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    element.toggleClass(attrs.toggleClass);
                });
            }
        };
    });

    app.directive('searchNews', function () {
        return {
            restrict: 'E',
            templateUrl: "/search_news_template"
        };
    });

    // Directive for login pop up
    app.directive('loginModal', function () {
        return {
          template: '<div class="modal fade">' +
              '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                  '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                  '</div>' +
                  '<div class="modal-body" ng-transclude></div>' +
                '</div>' +
              '</div>' +
            '</div>',
          restrict: 'E',
          transclude: true,
          replace:true,
          scope:true,
          link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function(value){
              if(value == true)
                $(element).modal('show');
              else
                $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function(){
              scope.$apply(function(){
                scope.$parent[attrs.visible] = true;
              });
            });

            $(element).on('hidden.bs.modal', function(){
              scope.$apply(function(){
                scope.$parent[attrs.visible] = false;
              });
            });
          }
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

    app.filter('slice', function() {
        return function(arr, start, end) {
            return arr.slice(start, end);
        };
    });


    app.directive('loading',   ['$http' ,function ($http)
        {
            return {
                restrict: 'A',
                link: function (scope, elm, attrs)
                {
                    scope.isLoading = function () {
                        return $http.pendingRequests.length > 0;
                    };

                    scope.$watch(scope.isLoading, function (v)
                    {
                        if(v){
                            elm.show();
                        }else{
                            elm.hide();
                        }
                    });
                }
            };

        }]);

})();
