(function(){
    var app = angular.module('news',['mediaone', 'infinite-scroll']);
    app.controller('NewsController', function($http, $scope, $filter){
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
        $scope.init = function(column_spacing, category_id, sub_category_id) {
            $scope.news_list_url = "/api/news/?category_id="+category_id+"&sub_category_id="+sub_category_id;
            $scope.news_list = [];
            $scope.isEndOfResults = false;
            $scope.breaking_news = '';
            $scope.sortOrder = 'published_on';
            $scope.column_spacing = column_spacing;
            $scope.column_list = [];
        };
        $scope.getNewsList = function() {
            if ($scope.isEndOfResults) return;
            $scope.isEndOfResults = true;
            $http.get($scope.news_list_url).success(function(data){
                $scope.news_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
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
             });
        };

        $http.get('/api/breaking-news/').success(function(data){
            $scope.breaking_news = data.results[0];
        });

        $scope.updateSortOrder = function() {
            $scope.news_list = [];
            $scope.isEndOfResults = false;
            $scope.news_list_url = "/api/news/?order_by="+$scope.sortOrder;
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

        $http.get('/api/column/').success(function(data){
            $scope.column_list = data.results.splice(0,3);
        });

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
            templateUrl: "news_list_template"
        };
    });

    app.directive('breakingNews', function () {
        return {
            restrict: 'E',
            templateUrl: "breaking_news_template"
        };
    });

    app.controller('NewsDetailController', function($http, $scope){

        $scope.init = function(id, order_by) {
            $scope.news_list_url = "/api/news/?from_id="+id+"&order_by="+order_by ;
            $scope.news_list = [];
            $scope.isEndOfResults = false;
        };
        $scope.getDetailNewsList = function() {
            if ($scope.isEndOfResults) return;
            $scope.isEndOfResults = true;
            $http.get($scope.news_list_url).success(function(data){
                $scope.news_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    $http.get('/api/related-news/'+item['id']).success(function(data){
                        item['related_news'] = data.results;
                    });
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

    app.controller('NearmeNewsController', function($http, $scope){
        $scope.nearme_news_list = [];
        $scope.itemLocality = null;
        $scope.init = function(id) {
            var geocoder = new google.maps.Geocoder();

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
            }
            // Get the latitude and the longitude;
            function successFunction(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                codeLatLng(lat, lng);
            }

            function errorFunction() {
                alert("Geocoder failed");
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
        };
    });
    app.filter('trusted', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);
})();

// Function to implement auto scroll
$(function () {
    viewed_news_array = []
    $(document).scroll(function () {
        $('.title-anchor').each(function () {
            var top = window.pageYOffset;
            var distance = top - $(this).offset().top;
            var hash = $(this).attr('news-url');
            // 30 is an arbitrary padding choice,
            // if you want a precise check then use distance===0
            if (distance < 30 && distance > -30) {
                window.history.pushState('', document.title, hash);
                if ($.inArray(hash, viewed_news_array) == -1){
                    viewed_news_array.push($(this).attr('news-url'));
                    $.ajax({
                      url: '/api/news/'+$(this).attr('news-id')+'/view/',
                    }).done(function(data) {
                        return;
                    });
                }
            }
        });
    });
});