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
        this.saveProfileWithAvatar = function(user_profile_id, user_id, avatar, bio, first_name, last_name, is_public, public_profile_url_slug,
            show_desktop_notifications){
            var fd = new FormData();
            fd.append('user', user_id);
            if(typeof(avatar) != 'string' && avatar !== null) {
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
            if (!public_profile_url_slug) {
                public_profile_url_slug = '';
            }

            fd.append('bio', bio);
            fd.append('first_name', first_name);
            fd.append('last_name', last_name);
            fd.append('public_profile_url_slug', public_profile_url_slug);
            fd.append('is_public', is_public);
            fd.append('show_desktop_notifications', show_desktop_notifications);
            $http.defaults.xsrfHeaderName = 'X-CSRFToken';
            $http.defaults.xsrfCookieName = 'csrftoken';
            $http.put('/api/userprofiles/'+user_profile_id, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(data){
                $('#id_avatar').attr('src', data.avatar)
                $('#id_bio').text(data.bio);
                $('#id_profile_name').text(data.first_name +" "+ data.last_name);
                $('#id_public_profile_url').attr('href', data.get_public_profile_url);
                $('#id_public_profile_url').text(data.get_absolute_uri + data.get_public_profile_url);
                $('#id_avatar').attr('src', data.avatar);
                $('.profile-edit').collapse('hide');
            })
            .error(function(data){
                if (data.public_profile_url_slug) {
                    $('#id_public_profile_url_slug_unique_error').text('The URL is already taken. Please add a different one.');
                }
            });
        }
    }]);
    app.controller('UserProfileController', function($http, $scope, $sce, fileUpload){
        $scope.userprofile = {};
        $scope.init = function(id) {
            $scope.user_profile_id = id;
            $http.get('/api/userprofiles/'+id).success(function(data){
                $scope.userprofile = data;
                $scope.user_profile_id =  $scope.userprofile.id;
                $scope.user_id = $scope.userprofile.user;
                $scope.profile_avatar = $scope.userprofile.avatar;
                $scope.profile_bio = $scope.userprofile.bio;
                $scope.profile_first_name = $scope.userprofile.first_name;
                $scope.profile_last_name = $scope.userprofile.last_name;
                $scope.public_profile_url_slug = $scope.userprofile.public_profile_url_slug;
                $scope.profile_is_public = $scope.userprofile.is_public;
                $scope.show_desktop_notifications =$scope.userprofile.show_desktop_notifications;
                $scope.show_site_tour =$scope.userprofile.is_user_first_login;
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
            $http.get('/api/userprofile/'+id+'/followed-topics/').success(function(data){
                $scope.followed_topics = data.results;
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
        $scope.updateFollowTopic = function(id) {
                $http.get('/api/topic/'+id+'/follow/').success(function(data){
                    $http.get('/api/userprofile/'+$scope.user_profile_id+'/followed-topics/').success(function(data){
                        $scope.followed_topics = data.results;
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
            if($scope.public_profile_url_slug) {
                fileUpload.saveProfileWithAvatar($scope.user_profile_id, $scope.user_id, $scope.profile_avatar, $scope.profile_bio, $scope.profile_first_name, $scope.profile_last_name,
                $scope.profile_is_public, $scope.public_profile_url_slug, $scope.show_desktop_notifications);
            } else {
                $('#id_public_profile_url_slug_unique_error').text('Url slug is mandatory');
            }
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
            $http.get('/api/userprofile/'+id+'/following-columns/').success(function(data){
                $scope.following_cols_list = data.results;
            });
            $http.get('/api/userprofile/'+id+'/upvoted-news/').success(function(data){
                $scope.upvoted_news = data.results;
            });
            $http.get('/api/userprofile/'+id+'/favourite-news/').success(function(data){
                $scope.favourite_news = data.results;
            });
            $http.get('/api/userprofile/'+id+'/followed-topics/').success(function(data){
                $scope.followed_topics = data.results;
            });
        };
    });
})();