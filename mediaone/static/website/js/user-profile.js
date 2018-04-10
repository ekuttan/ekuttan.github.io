(function(){
    var app = angular.module('userprofile',['mediaone']);

    app.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

    app.service('fileUpload', ['$http', function ($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
        this.saveProfileWithAvatar = function(user_profile_id, user_id, avatar, bio, first_name, last_name, facebook_url, twitter_url, googleplus_url, is_public, public_profile_url_slug){
            var fd = new FormData();
            fd.append('user', user_id);
            if(typeof(avatar) != 'string') {
                fd.append('avatar', avatar);
            }
            // If the fields do not contatin any value(null), make it as an empty string.
            if (!bio) {
                bio = '';
            }
            if (!first_name) {
                first_name ='';
            }
            if (!last_name) {
                last_name ='';
            }
            if (!facebook_url) {
                facebook_url ='';
            }
            if (!twitter_url){
                twitter_url = ''
            }
            if (!googleplus_url){
                googleplus_url = '';
            }
            if (!public_profile_url_slug) {
                public_profile_url_slug = '';
            }

            fd.append('bio', bio);
            fd.append('first_name', first_name);
            fd.append('last_name', last_name);
            fd.append('facebook_url', facebook_url);
            fd.append('twitter_url', twitter_url);
            fd.append('googleplus_url', googleplus_url);
            fd.append('public_profile_url_slug', public_profile_url_slug);
            fd.append('is_public', is_public);

            $http.defaults.xsrfHeaderName = 'X-CSRFToken';
            $http.defaults.xsrfCookieName = 'csrftoken';
            $http.put('/api/userprofiles/'+user_profile_id, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(data){
                $('#id_avatar').attr('src', data.avatar)
                $('#id_bio').text(data.bio);
                $('#id_first_name').text(data.first_name);
                $('#id_last_name').text(data.last_name);
                $('#id_public_profile_url').attr('href', data.get_public_profile_url);
                $('#id_googleplus_url').attr('href', data.googleplus_url);
                $('#id_googleplus_url').text(data.googleplus_url);
                $('#id_facebook_url').attr('href', data.facebook_url);
                $('#id_facebook_url').text(data.facebook_url);
                $('#id_twitter_url').attr('href', data.twitter_url);
                $('#id_twitter_url').text(data.twitter_url);
                $('#id_avatar_edit').attr('src', data.avatar);
                $('.display-profile').show();
                $('.edit-profile').hide();
            })
            .error(function(data){
                if (data.public_profile_url_slug[0] == 'This field must be unique.') {
                    $('#id_public_profile_url_slug_unique_error').text('The URL is already taken. Please add a different one.');
                }
            });
        }
    }]);
    app.controller('UserProfileController', function($http, $scope, $sce, fileUpload){
        $scope.userprofile = {};
        $scope.init = function(id) {
            $scope.user_profile_id = id;
            $('.edit-profile').hide();
            $http.get('/api/userprofiles/'+id).success(function(data){
                $scope.userprofile = data;
                $scope.user_profile_id =  $scope.userprofile.id;
                $scope.user_id = $scope.userprofile.user;
                $scope.profile_avatar = $scope.userprofile.avatar;
                $scope.profile_bio = $scope.userprofile.bio;
                $scope.profile_first_name = $scope.userprofile.first_name;
                $scope.profile_last_name = $scope.userprofile.last_name;
                $scope.public_profile_url_slug = $scope.userprofile.public_profile_url_slug;
                $scope.profile_facebook_url = $scope.userprofile.facebook_url;
                $scope.profile_twitter_url = $scope.userprofile.twitter_url;
                $scope.profile_googleplus_url = $scope.userprofile.googleplus_url;
                $scope.profile_is_public = $scope.userprofile.is_public;
            });
            $http.get('/api/userprofile/'+id+'/following-columns/').success(function(data){
                $scope.following_cols_list = data.results;
            });
            $http.get('/api/userprofile/'+id+'/watchlater-episodes/').success(function(data){
                $scope.watch_later_videos = data.results;
            });
            $http.get('/api/userprofile/'+id+'/upvoted-news/').success(function(data){
                $scope.upvoted_news = data.results;
            });
            $http.get('/api/userprofile/'+id+'/favourite-news/').success(function(data){
                $scope.favourite_news = data.results;
            });
        };

        $scope.unfollowColumnCategory = function(category_id) {
            $http.get('/api/column-category/'+category_id+'/follow/').success(function(data){
                // if(data.is_followed_column_category == false){
                //     angular.forEach(angular.element('.category_item_'+category_id),function(value,key){
                //             var data = angular.element(value);
                //              data.remove();
                //      });
                // }
                $http.get('/api/userprofile/'+$scope.user_profile_id+'/following-columns/').success(function(data){
                    $scope.following_cols_list = data.results;
                });
            });
        };

        $scope.setwatchLater = function(episodeId) {
            $http.get('/ajax/set_watch_later/'+episodeId).success(function(data){
                $http.get('/api/userprofile/'+$scope.user_profile_id+'/watchlater-episodes/').success(function(data){
                    $scope.watch_later_videos = data.results;
                });
            });
        };
        $scope.updateFavouriteSingleNews = function(id) {
                $http.get('/api/news/'+id+"/favourite/?favourite=update").success(function(data){
                    $http.get('/api/userprofile/'+$scope.user_profile_id+'/favourite-news/').success(function(data){
                        $scope.favourite_news = data.results;
                    });
                });
        };

        $scope.to_trusted = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };

        $scope.editProfile = function() {
            $('.display-profile').hide();
            $('.edit-profile').show();
        };

        $scope.saveProfile = function() {
            fileUpload.saveProfileWithAvatar($scope.user_profile_id, $scope.user_id, $scope.profile_avatar, $scope.profile_bio, $scope.profile_first_name, $scope.profile_last_name, $scope.profile_facebook_url, $scope.profile_twitter_url, $scope.profile_googleplus_url,
                $scope.profile_is_public, $scope.public_profile_url_slug);
        };

        $scope.readURL= function(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#id_avatar_edit').attr('src', e.target.result);
                }

                reader.readAsDataURL(input.files[0]);
            }
        }

    $("#id_avatar_file").change(function () {
        $scope.readURL(this);
    });
    });

    app.controller('FavouriteNewsController', function($http, $scope){
        $scope.fav_news_list = [];
        $scope.init = function(id) {
            $http.get('/api/favourite-news-list/'+id).success(function(data){
                $scope.fav_news_list = data.results;
         });
        };
    });

    app.controller('UserPublicProfileController', function($http, $scope){
        $scope.userprofile = {};
        $scope.init = function(id) {
            $http.get('/api/public_userprofiles/'+id).success(function(data){
                $scope.userprofile = data;
         });
        };
    });
})();