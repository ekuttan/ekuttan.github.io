    $(function () {
        // Init page helpers (Summernote)
        App.initHelpers(['summernote']);

        // To make the checkbox selected if all the permissions in a model is selected.
        $('.select-all-newsitem').prop('checked', $('.newsitem-perm:checked').length == $('.newsitem-perm').length ? true : false);
        $(".newsitem-perm").change(function(){
            if ($('.newsitem-perm:checked').length == $('.newsitem-perm').length) {
               $('.select-all-newsitem').prop('checked', true);
            } else {
                $('.select-all-newsitem').prop('checked', false);
            }
        });
        $(".select-all-newsitem").change(function(){
            if ($('.newsitem-perm:checked').length == $('.newsitem-perm').length) {
               $('.newsitem-perm').prop('checked', false);
            } else {
                $('.newsitem-perm').prop('checked', true);
            }
        });

        $('.select-all-breaking-news').prop('checked', $('.breaking-news-perm:checked').length == $('.breaking-news-perm').length ? true : false);
        $(".breaking-news-perm").change(function(){
            if ($('.breaking-news-perm:checked').length == $('.breaking-news-perm').length) {
               $('.select-all-breaking-news').prop('checked', true);
            } else {
                $('.select-all-breaking-news').prop('checked', false);
            }
        });
        $(".select-all-breaking-news").change(function(){
            if ($('.breaking-news-perm:checked').length == $('.breaking-news-perm').length) {
               $('.breaking-news-perm').prop('checked', false);
            } else {
                $('.breaking-news-perm').prop('checked', true);
            }
        });

        $('.select-all-lead-news').prop('checked', $('.lead-news-perm:checked').length == $('.lead-news-perm').length ? true : false);
        $(".lead-news-perm").change(function(){
            if ($('.lead-news-perm:checked').length == $('.lead-news-perm').length) {
               $('.select-all-lead-news').prop('checked', true);
            } else {
                $('.select-all-lead-news').prop('checked', false);
            }
        });
        $(".select-all-lead-news").change(function(){
            if ($('.lead-news-perm:checked').length == $('.lead-news-perm').length) {
               $('.lead-news-perm').prop('checked', false);
            } else {
                $('.lead-news-perm').prop('checked', true);
            }
        });

        $('.select-all-category').prop('checked', $('.category-perm:checked').length == $('.category-perm').length ? true : false);
        $(".category-perm").change(function(){
            if ($('.category-perm:checked').length == $('.category-perm').length) {
               $('.select-all-category').prop('checked', true);
            } else {
                $('.select-all-category').prop('checked', false);
            }
        });
        $(".select-all-category").change(function(){
            if ($('.category-perm:checked').length == $('.category-perm').length) {
               $('.category-perm').prop('checked', false);
            } else {
                $('.category-perm').prop('checked', true);
            }
        });

        $('.select-all-topic').prop('checked', $('.topic-perm:checked').length == $('.topic-perm').length ? true : false);
        $(".topic-perm").change(function(){
            if ($('.topic-perm:checked').length == $('.topic-perm').length) {
               $('.select-all-topic').prop('checked', true);
            } else {
                $('.select-all-topic').prop('checked', false);
            }
        });
        $(".select-all-topic").change(function(){
            if ($('.topic-perm:checked').length == $('.topic-perm').length) {
               $('.topic-perm').prop('checked', false);
            } else {
                $('.topic-perm').prop('checked', true);
            }
        });

        $('.select-all-column').prop('checked', $('.column-perm:checked').length == $('.column-perm').length ? true : false);
        $(".column-perm").change(function(){
            if ($('.column-perm:checked').length == $('.column-perm').length) {
               $('.select-all-column').prop('checked', true);
            } else {
                $('.select-all-column').prop('checked', false);
            }
        });
        $(".select-all-column").change(function(){
            if ($('.column-perm:checked').length == $('.column-perm').length) {
               $('.column-perm').prop('checked', false);
            } else {
                $('.column-perm').prop('checked', true);
            }
        });

        $('.select-all-review').prop('checked', $('.review-perm:checked').length == $('.review-perm').length ? true : false);
        $(".review-perm").change(function(){
            if ($('.review-perm:checked').length == $('.review-perm').length) {
               $('.select-all-review').prop('checked', true);
            } else {
                $('.select-all-review').prop('checked', false);
            }
        });
        $(".select-all-review").change(function(){
            if ($('.review-perm:checked').length == $('.review-perm').length) {
               $('.review-perm').prop('checked', false);
            } else {
                $('.review-perm').prop('checked', true);
            }
        });

        $('.select-all-writer').prop('checked', $('.writer-perm:checked').length == $('.writer-perm').length ? true : false);
        $(".writer-perm").change(function(){
            if ($('.writer-perm:checked').length == $('.writer-perm').length) {
               $('.select-all-writer').prop('checked', true);
            } else {
                $('.select-all-writer').prop('checked', false);
            }
        });
        $(".select-all-writer").change(function(){
            if ($('.writer-perm:checked').length == $('.writer-perm').length) {
               $('.writer-perm').prop('checked', false);
            } else {
                $('.writer-perm').prop('checked', true);
            }
        });

        $('.select-all-buzzfeed').prop('checked', $('.buzzfeed-perm:checked').length == $('.buzzfeed-perm').length ? true : false);
        $(".buzzfeed-perm").change(function(){
            if ($('.buzzfeed-perm:checked').length == $('.buzzfeed-perm').length) {
               $('.select-all-buzzfeed').prop('checked', true);
            } else {
                $('.select-all-buzzfeed').prop('checked', false);
            }
        });
        $(".select-all-buzzfeed").change(function(){
            if ($('.buzzfeed-perm:checked').length == $('.buzzfeed-perm').length) {
               $('.buzzfeed-perm').prop('checked', false);
            } else {
                $('.buzzfeed-perm').prop('checked', true);
            }
        });

        $('.select-all-liveblog').prop('checked', $('.liveblog-perm:checked').length == $('.liveblog-perm').length ? true : false);
        $(".liveblog-perm").change(function(){
            if ($('.liveblog-perm:checked').length == $('.liveblog-perm').length) {
               $('.select-all-liveblog').prop('checked', true);
            } else {
                $('.select-all-liveblog').prop('checked', false);
            }
        });
        $(".select-all-liveblog").change(function(){
            if ($('.liveblog-perm:checked').length == $('.liveblog-perm').length) {
               $('.liveblog-perm').prop('checked', false);
            } else {
                $('.liveblog-perm').prop('checked', true);
            }
        });

        $('.select-all-sportsteam').prop('checked', $('.sportsteam-perm:checked').length == $('.sportsteam-perm').length ? true : false);
        $(".sportsteam-perm").change(function(){
            if ($('.sportsteam-perm:checked').length == $('.sportsteam-perm').length) {
               $('.select-all-sportsteam').prop('checked', true);
            } else {
                $('.select-all-sportsteam').prop('checked', false);
            }
        });
        $(".select-all-sportsteam").change(function(){
            if ($('.sportsteam-perm:checked').length == $('.sportsteam-perm').length) {
               $('.sportsteam-perm').prop('checked', false);
            } else {
                $('.sportsteam-perm').prop('checked', true);
            }
        });

        $('.select-all-programme').prop('checked', $('.programme-perm:checked').length == $('.programme-perm').length ? true : false);
        $(".programme-perm").change(function(){
            if ($('.programme-perm:checked').length == $('.programme-perm').length) {
               $('.select-all-programme').prop('checked', true);
            } else {
                $('.select-all-programme').prop('checked', false);
            }
        });
        $(".select-all-programme").change(function(){
            if ($('.programme-perm:checked').length == $('.programme-perm').length) {
               $('.programme-perm').prop('checked', false);
            } else {
                $('.programme-perm').prop('checked', true);
            }
        });

        $('.select-all-episode').prop('checked', $('.episode-perm:checked').length == $('.episode-perm').length ? true : false);
        $(".episode-perm").change(function(){
            if ($('.episode-perm:checked').length == $('.episode-perm').length) {
               $('.select-all-episode').prop('checked', true);
            } else {
                $('.select-all-episode').prop('checked', false);
            }
        });
        $(".select-all-episode").change(function(){
            if ($('.episode-perm:checked').length == $('.episode-perm').length) {
               $('.episode-perm').prop('checked', false);
            } else {
                $('.episode-perm').prop('checked', true);
            }
        });


        $('.select-all-widget').prop('checked', $('.widget-perm:checked').length == $('.widget-perm').length ? true : false);
        $(".widget-perm").change(function(){
            if ($('.widget-perm:checked').length == $('.widget-perm').length) {
               $('.select-all-widget').prop('checked', true);
            } else {
                $('.select-all-widget').prop('checked', false);
            }
        });
        $(".select-all-widget").change(function(){
            if ($('.widget-perm:checked').length == $('.widget-perm').length) {
               $('.widget-perm').prop('checked', false);
            } else {
                $('.widget-perm').prop('checked', true);
            }
        });

        $('.select-all-nimdauser').prop('checked', $('.nimdauser-perm:checked').length == $('.nimdauser-perm').length ? true : false);
        $(".nimdauser-perm").change(function(){
            if ($('.nimdauser-perm:checked').length == $('.nimdauser-perm').length) {
               $('.select-all-nimdauser').prop('checked', true);
            } else {
                $('.select-all-nimdauser').prop('checked', false);
            }
        });
        $(".select-all-nimdauser").change(function(){
            if ($('.nimdauser-perm:checked').length == $('.nimdauser-perm').length) {
               $('.nimdauser-perm').prop('checked', false);
            } else {
                $('.nimdauser-perm').prop('checked', true);
            }
        });
        $('.select-all-generalsettings').prop('checked', $('.generalsettings-perm:checked').length == $('.generalsettings-perm').length ? true : false);
        $(".generalsettings-perm").change(function(){
            if ($('.generalsettings-perm:checked').length == $('.generalsettings-perm').length) {
               $('.select-all-generalsettings').prop('checked', true);
            } else {
                $('.select-all-generalsettings').prop('checked', false);
            }
        });
        $(".select-all-generalsettings").change(function(){
            if ($('.generalsettings-perm:checked').length == $('.generalsettings-perm').length) {
               $('.generalsettings-perm').prop('checked', false);
            } else {
                $('.generalsettings-perm').prop('checked', true);
            }
        });

        $('.select-all-role').prop('checked', $('.role-perm:checked').length == $('.role-perm').length ? true : false);
        $(".role-perm").change(function(){
            if ($('.role-perm:checked').length == $('.role-perm').length) {
               $('.select-all-role').prop('checked', true);
            } else {
                $('.select-all-role').prop('checked', false);
            }
        });
        $(".select-all-role").change(function(){
            if ($('.role-perm:checked').length == $('.role-perm').length) {
               $('.role-perm').prop('checked', false);
            } else {
                $('.role-perm').prop('checked', true);
            }
        });
    });