(function(){
    var app = angular.module('programmeschedule',['mediaone', 'infinite-scroll']);

    app.controller('ProgrammescheduleController', function($http, $scope, $filter){
        $scope.init = function() {
            $scope.currentprogramme_url = '/api/programme_schedules/?current=true';
            $scope.next_programmes_url =  '/api/programme_schedules/?new=true';
            $scope.programmeschedule_list_url = "/api/programme_schedules/";
            $scope.currently_running = {};
            $scope.next_programmes_count = 0;
            $scope.next_programmes_list = [];
            $scope.programme_monday = [];
            $scope.programme_tuesday = [];
            $scope.programme_wednesday = [];
            $scope.programme_thursday = [];
            $scope.programme_friday = [];
            $scope.programme_saturday = [];
            $scope.programme_sunday = [];
            $scope.this_weekdays = [];
            $scope.current_date = new Date();
            $scope.current_time = $filter('date')(new Date(), 'HH:mm:ss');
            for (var i=0; i<7; i++) {
                var this_day = new Date();
                $scope.this_weekdays.push(this_day.setDate($scope.current_date.getDate()+i));
            }
            $http.get($scope.currentprogramme_url).success(function(data){
                $scope.currently_running = data.results[0];

            });

            $http.get($scope.next_programmes_url).success(function(data){
                angular.forEach(data.results,function(item) {
                    $scope.next_programmes_list.push(item);
                });
                if(data.count < 7){
                    $http.get('/api/programme_schedules/?next_day=true').success(function(data){
                        angular.forEach(data.results,function(item) {
                            $scope.next_programmes_list.push(item);
                        });
                    });
                }
                $('.loading.schedule').remove();
                $scope.next_programmes_list = $scope.next_programmes_list.slice(0,6);
            });
        }

        $http.get('/api/programme_schedules/?paginate_by=false').success(function(data){
            angular.forEach(data,function(item) {
                if(item.programmes[0]){
                    item['programmes'] = item.programmes[0];
                    item.schedule_time = $filter('date')(item.time, 'HH:mm:ss');
                    if(item.day == 'monday') {
                        item.hash_tag = 'Mon';
                        $scope.programme_monday.push(item);
                    } else if(item.day == 'tuesday') {
                        item.hash_tag = 'Tue';
                        $scope.programme_tuesday.push(item);
                    } else if(item.day == 'wednesday') {
                        item.hash_tag = 'Wed';
                        $scope.programme_wednesday.push(item);
                    } else if(item.day == 'thursday') {
                        item.hash_tag = 'Thu';
                        $scope.programme_thursday.push(item);
                    } else if(item.day == 'friday') {
                        item.hash_tag = 'Fri';
                        $scope.programme_friday.push(item);
                    } else if(item.day == 'saturday') {
                        item.hash_tag = 'Sat';
                        $scope.programme_saturday.push(item);
                    } else if(item.day == 'sunday') {
                        item.hash_tag = 'Sun';
                        $scope.programme_sunday.push(item);
                    }
                }
            });
        });
    });


})();
