(function(){
    var app = angular.module('column',['mediaone','infinite-scroll']);
    // app.config(function($interpolateProvider){
    //     $interpolateProvider.startSymbol('[[');
    //     $interpolateProvider.endSymbol(']]');
    // });
    app.controller('ColumnController', function($http, $scope){
        $scope.column_list = [];
        $scope.has_displayed_all_new_columns = false;
        $scope.recommended_column_list = [];
        $scope.has_displayed_all_recommended_columns = false;
        $scope.recommended_column_list_url = '/api/column/?recommended=1';
        $scope.init = function(latest_column_id, category_id){
            $scope.new_column_featured_url = '/api/column/'+latest_column_id
            $scope.new_column_list_url = '/api/column/?exclude_id='+latest_column_id;
            if(category_id){
                $scope.new_column_list_url = "/api/column/?category_id="+category_id+'&exclude_id='+latest_column_id;
            }
            $http.get($scope.new_column_featured_url).success(function(data){
                $scope.featured_column = data;
                $(".loading.column").remove();
            });
            $scope.getNewColumnList();
            $scope.getRecomendedColumnList();
        };
        $scope.getNewColumnList = function() {
            if($scope.has_displayed_all_new_columns) return;
                $http.get($scope.new_column_list_url).success(function(data){

                    angular.forEach(data.results,function(item) {
                        $scope.column_list.push(item);
                    });
                    if(data.next != null){
                        $scope.new_column_list_url = data.next;
                    }
                    else {
                        $scope.has_displayed_all_new_columns=true;
                        return;
                    };
                 });
        };
        $scope.getRecomendedColumnList = function() {
            if($scope.has_displayed_all_recommended_columns) return;
                $http.get($scope.recommended_column_list_url).success(function(data){

                    angular.forEach(data.results,function(item) {
                        $scope.recommended_column_list.push(item);
                    });
                    if(data.next != null){
                        $scope.recommended_column_list_url = data.next;
                    }
                    else {
                        $scope.has_displayed_all_recommended_columns=true;
                        return;
                    };
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
                alert("You must be logged in to follow this news!")
            }
        };
    });

    app.controller('ColumnDetailController', function($http, $scope, $sce){
        $scope.column = {};
        $scope.following_category = false;
        $scope.init = function(id, preview_column) {
            $scope.column_url = '/api/column/'+id;
            if (preview_column){
                $scope.column_url = '/api/column/'+id+"/?preview_column=1";
            }
            $http.get($scope.column_url).success(function(data){
                $scope.column = data;
                if($scope.column.is_user_following_column_category){
                    $scope.following_category = true;
                }
         });
        };
        $scope.to_trusted = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };
        $scope.followColumnCategory = function(category_id, is_user_authenticted) {
            if (is_user_authenticted=='True'){
                $http.get('/api/column-category/'+category_id+'/follow/').success(function(data){
                    if(data.is_followed_column_category == true){
                        $scope.following_category = true;
                    } else {
                        $scope.following_category = false;
                    }
                });
            }
            else{
                alert("You must be logged in to follow this news!")
            }
        };
    });

    app.controller('AuthorColumnController', function($http, $scope){
        $scope.column_list = [];
        $scope.init = function(id) {
            $http.get('/api/author/'+id).success(function(data){
                $scope.author = data;
            });
        };
    });

    app.filter('trusted', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);
})();