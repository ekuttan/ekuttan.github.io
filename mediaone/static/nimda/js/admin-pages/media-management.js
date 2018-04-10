var app = angular.module('mediamgmnt',['infinite-scroll' ])
app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
})

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

app.service('fileUpload', ['$http','$rootScope',  function ($http, $rootScope) {
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
    this.uploadFileToUrl = function(file, breadcrumb_list, imageTopics, uploadUrl, cropSelection){
        var fd = new FormData();
        fd.append('file', file);
        fd.append('breadcrumb_list', JSON.stringify(breadcrumb_list));
        fd.append('imageTopics', imageTopics);
        if(cropSelection){
            fd.append('crop_selection', JSON.stringify(cropSelection));
        }
        fd.append('crop_img_natural_width', document.querySelector('#main-image-crop').naturalWidth);
        fd.append('crop_img_natural_height', document.querySelector('#main-image-crop').naturalHeight);

        $(".upload_local_form").hide();
        $(".upload_local_gear").show();
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
            $rootScope.preview_url = data.url;
            $("#modal-image-upload").modal('toggle');
            $rootScope.isEndOfMediaResults = false;
            $rootScope.media_list = [];
            $rootScope.media_list_url = $rootScope.removeURLParameter($rootScope.media_list_url, 'page');
            $rootScope.getMediaList();
            $rootScope.showPreview = true
        })
        .error(function(){
        });
    }
}]);



app.controller('MediaController', function($http, $scope, $filter, $rootScope, fileUpload){
	$http.defaults.xsrfHeaderName = 'X-CSRFToken';
	$http.defaults.xsrfCookieName = 'csrftoken';
	$scope.init = function() {
        $rootScope.isEndOfMediaResults = false;
        isEndOfSearchMediaResults = false;
		$rootScope.preview_url = ''
		$scope.folder_list = [];
		$rootScope.media_list = [];
		$rootScope.breadcrumb_list = [];
		$rootScope.folder_id = "0";
		$scope.folder_list_url = '/api/s3folders/?folder_id='+$rootScope.folder_id;
		$rootScope.media_list_url = '/api/s3uploads/?folder_id='+$rootScope.folder_id;
		$http.get($scope.folder_list_url).success(function(data){
			$scope.folder_list = data.results;
        });

        $rootScope.search_media_list = [];

        $rootScope.showPreview = false;
        $("#id_images_aftr_search").hide();
	};

	$scope.updateMediaList = function(folder_id, folder_name) {
		$rootScope.preview_url = ''
		$scope.folder_list_url = '/api/s3folders/?folder_id='+folder_id;
		$rootScope.media_list_url = '/api/s3uploads/?folder_id='+folder_id;
		$scope.entryExists = false;
		$scope.folderIndex = '';
		if (folder_id==0){
			$rootScope.breadcrumb_list = [];
		}
		angular.forEach($rootScope.breadcrumb_list,function(item) {
			if (item['id']==folder_id){
				$scope.entryExists = true;
				$scope.folderIndex = $rootScope.breadcrumb_list.indexOf(item);
				$rootScope.breadcrumb_list.splice($scope.folderIndex+1);
				return;
			}
        });
        if (!$scope.entryExists && folder_id!=0){
			$rootScope.breadcrumb_list.push({'id': folder_id, 'name': folder_name});
        }

		$http.get($scope.folder_list_url).success(function(data){
			$scope.folder_list = data.results;
            //update search folder list too
            $scope.search_folder_list = data.results;
        });
        $rootScope.isEndOfMediaResults = false;
        $rootScope.media_list = [];
        $rootScope.getMediaList();
        $rootScope.search_media_list = $rootScope.media_list;
    };

    $scope.uploadImageToS3 = function(){
        var file = $scope.upload_image;
        if (!file){
        	$scope.upload_file_error = true;
        	return
        }
        else{
        	$scope.upload_file_error = false;
        }
        var uploadUrl = "/ajax/update_image_to_s3/";
        fileUpload.uploadFileToUrl(file, $rootScope.breadcrumb_list, $('#id_image_topics').val(), uploadUrl, $rootScope.cropSelection);

        //for hiding image crop div
        $scope.hideCropDiv();
    };

    $scope.updatePreviewUrl = function(media_url){
	    $rootScope.preview_url = media_url;
        $rootScope.showPreview = true
	}

    $scope.hidePreview = function(media_url){
        $(".preview_image").attr('src', '');
        $rootScope.preview_url = '';
        $rootScope.showPreview = false;
    }

    $scope.updateImageUrl = function(){
        var target_id = $('#id_first_ok_btn').attr('target_id');
        var image_url = $("#id_img_url").val();
        $('#'+target_id).val(image_url);
        $('.'+target_id+'_show_remove_image').show();
        //for updating the image preview url anchor tags
        $('a.'+target_id).text(image_url);
        $('a.'+target_id).attr('href', image_url);

        $rootScope.preview_url = '';
        // using only for breaking news
        if ($('#hidden-bg-image').length){
            $('.breaking-news-image').css('background', 'transparent url('+image_url+') left top no-repeat');
            $('#hidden-bg-image').attr('src', image_url);
        }
    }

    $scope.hidePreviewOKbtn = function(){
        $rootScope.showPreview = false;
    }

    $scope.cropPreview = function(img, selection) {
      $rootScope.cropSelection = selection;
      var scaleX = 100 / (selection.width || 1);
      var scaleY = 100 / (selection.height || 1);
      $('#preview-image-crop').css({
          width: Math.round(scaleX * 400) + 'px',
          height: Math.round(scaleY * 300) + 'px',
          marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
          marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
      });
    }
    $('#main-image-crop').imgAreaSelect({ maxWidth: 600, maxHeight: 500, handles: true, onSelectChange: $scope.cropPreview });

    $scope.readURL= function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#main-image-crop').attr('src', e.target.result);
                $('#preview-image-crop').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#inputFile").change(function () {
        $scope.readURL(this);
    });

    $scope.hideCropDiv= function() {
        var ias = $('#main-image-crop').imgAreaSelect({ instance: true });
        ias.setOptions({ hide: true });
        ias.update();
    };

    $('#modal-image-upload').on('hidden.bs.modal', function () {
        $scope.hideCropDiv();
    })

    $scope.searchImages= function() {
        $("#id_images_bfr_search").hide();
        $("#id_images_aftr_search").show();
        $http.get('/api/rest-s3-folder/search?text='+$scope.search_text).success(function(data){
            $scope.search_folder_list = data.results;
        });
        $rootScope.isEndOfSearchMediaResults = false;
        $rootScope.search_media_list = [];
        $rootScope.getSearchMediaList();
        $rootScope.search_media_list_url ='';
    };
    $scope.clearSearch= function() {
        $("#id_images_bfr_search").show();
        $("#id_images_aftr_search").hide();
        $scope.search_text='';
        $scope.updateMediaList(0, '')
    };

    $rootScope.getMediaList = function() {
        if ($rootScope.isEndOfMediaResults) return;
        $rootScope.isEndOfMediaResults = true;
        $http.get($rootScope.media_list_url).success(function(data){
            $scope.media_list_pagination_params = data;
            angular.forEach(data.results,function(item) {
                $rootScope.media_list.push(item);
            });
            if($scope.media_list_pagination_params.next != null){
                $rootScope.media_list_url = $scope.media_list_pagination_params.next;
            }
            else {
                $scope.has_displayed_all = true;
                return;
            };
            $rootScope.isEndOfMediaResults = false;
         });
    };

    $rootScope.getSearchMediaList = function() {
        if ($scope.search_text){
            if (! $rootScope.search_media_list_url) {
                $rootScope.search_media_list_url = '/api/rest-s3-upload/search/?text='+$scope.search_text;
            }
            if ($rootScope.isEndOfSearchMediaResults) return;
            $rootScope.isEndOfSearchMediaResults = true;
            $http.get($rootScope.search_media_list_url).success(function(data){
                $scope.search_media_list_pagination_params = data;
                angular.forEach(data.results,function(item) {
                    $rootScope.search_media_list.push(item);
                });
                if($scope.search_media_list_pagination_params.next != null){
                    $rootScope.search_media_list_url = $scope.search_media_list_pagination_params.next;
                }
                else {
                    $rootScope.search_media_list_url ='';
                    return;
                };
                $rootScope.isEndOfSearchMediaResults = false;
             });
        } else {
            $rootScope.isEndOfSearchMediaResults = true;
        }
    };

    //It is currently used for removing 'page' querystring from medialist_url
    $rootScope.removeURLParameter = function removeURLParameter(url, parameter) {
        //prefer to use l.search if you have a location/link object
        var urlparts= url.split('?');
        if (urlparts.length>=2) {

            var prefix= encodeURIComponent(parameter)+'=';
            var pars= urlparts[1].split(/[&;]/g);

            //reverse iteration as may be destructive
            for (var i= pars.length; i-- > 0;) {
                //idiom for string.startsWith
                if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                    pars.splice(i, 1);
                }
            }

            url= urlparts[0]+'?'+pars.join('&');
            return url;
        } else {
            return url;
        }
    };
});

$(function () {
    $("button.upload_media").on("click", function(){
        var from_image_id = $(this).attr('from-image-id');
        $('#id_first_ok_btn').attr('target_id', from_image_id);
    });

    $("#id_upload_local").on("click", function(){
        $(".upload_local_form").show();
        $(".upload_local_gear").hide();
    });

    //To make slim scroll bar to work. Angular prevents normal calling of scroll.

    $('#sidebar-scroll').slimScroll({
        height: $('#sidebar').outerHeight(),
        background: '#fff none repeat scroll 0 0',
        color: '#fff',
        size: '5px',
        opacity : .35,
        wheelStep : 15,
        distance : '2px',
        railVisible: false,
        railOpacity: 1,

    });
});