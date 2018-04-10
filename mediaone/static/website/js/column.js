(function(){
    var app = angular.module('column',['mediaone']);
    // app.config(function($interpolateProvider){
    //     $interpolateProvider.startSymbol('[[');
    //     $interpolateProvider.endSymbol(']]');
    // });
    app.controller('ColumnController', function($http, $scope){
        $scope.column_list = [];
        $http.get('/api/column/').success(function(data){
            $scope.column_list = data.results;
        });
        $http.get('/api/column-writer/').success(function(data){
            $scope.writer_list = data.results;
        });

        $scope.init = function() {
            $scope.columnSearchHidden = false;
            $scope.columnListHidden = true;
            $scope.search_column_list = [];
        }
        $scope.searchColumnList = function () {
            if($scope.search_column_item) {
                $scope.columnSearchHidden = true;
                $scope.columnListHidden = false;
                search_text = $scope.search_column_item
                $http.get("/api/rest-column-search/?text="+search_text).success(function(data){
                    $scope.search_column_list = data.results;
                    $scope.search_column_list.search_list = true;
                });
            }
        }
        //Close the search display
        $scope.closeColumnSearch = function () {
            $scope.columnSearchHidden = false;
            $scope.columnListHidden = true;
            $scope.search_column_list = [];
            $scope.search_column_item = ''
            $('#search_column_display').html('');
        }
    });

    app.directive('columnList', function () {
        return {
            restrict: 'E',
            templateUrl: "column_list_template"
        };
    });

    app.controller('ColumnDetailController', function($http, $scope, $sce){
        $scope.column = {};
        $scope.init = function(id) {
            $http.get('/api/column/'+id).success(function(data){
                $scope.column = data;
         });
        };
        $scope.to_trusted = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };
    });

    app.controller('WriterColumnController', function($http, $scope){
        $scope.init = function(id) {
            $http.get('/api/column-writer/'+id).success(function(data){
                $scope.writer = data;
            });
        };
    });
})();