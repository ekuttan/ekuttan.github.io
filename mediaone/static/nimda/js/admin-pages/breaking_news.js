$(function () {

    App.initHelpers(['select2']);

    $('#id_expired_at').datetimepicker({format: 'YYYY-MM-DD HH:mm'});

    // Breaking News title js functions starts
    // $( ".breaking-news-title" ).resizable({
    //     stop: function(event, ui) {
    //         droppable_container = $(".breaking-news-image");
    //         var width = $(this).width();
    //         var height = $(this).height();
    //         percentWidth = (width / droppable_container.width()) * 100;
    //         precentHeight  = (height / droppable_container.height()) * 100;
    //         $("#id_title_width").val(Math.round(percentWidth * 100) / 100);
    //         $("#id_title_height").val(Math.round(precentHeight * 100) / 100);
    //     }
    // });
    // $( ".breaking-news-title" ).draggable({
    //     containment: ".breaking-news-image",
    //     scroll: false,
    //     stop: function(event, ui) {
    //         droppable_container = $(".breaking-news-image");
    //         var left = $(this).position().left;
    //         var top  = $(this).position().top;
    //         percentLeft = (left / droppable_container.width()) * 100;
    //         precentTop  = (top / droppable_container.height()) * 100;
    //         $("#id_title_left").val(Math.round(percentLeft * 100) / 100);
    //         $("#id_title_top").val(Math.round(precentTop * 100) / 100);
    //     }
    // });

    $("#id_title").on('keyup', function(){
        $('.breaking-heading').text($(this).val());
        recreate_title_resizable();
    });

    $("#id_summary").on('keyup', function(){
        $('.breaking-summary').text($(this).val());
        recreate_title_resizable();
    });

    $("#id_category").on('change', function(){
        if ($(this).val()){
            $('.breaking-category').text($("#id_category option:selected").text());
            recreate_title_resizable();
        }
        else{
            $('.breaking-category').text("");
        }
    });

    $("#id_news_item").on('change', function(){
        if ($(this).val()){
            $(".related_title").show();
        }
        else{
            $(".related_title").hide();
        }
    });

    $('.title_color').colorpicker().on('changeColor.colorpicker', function(event){
        var color = event.color.toHex();
        $('.breaking-news-title').css("color", color);
    });

    $("#populate_news_data").on('click', function(){
        var related_id = $("#id_news_item :selected").val()
        $.ajax({
            url: '/api/news/'+related_id+'/',
            type: 'GET',
            data: {},
            success: function(resp){
                $("#id_title").val(resp.title);
                $("#id_summary").val(resp.summary);
                $("#id_category").val(resp.category.id);
                var topic_list = []
                if (resp.topics!=null) {
                    for (i=0; i<resp.topics.length; i++){
                        topic_list.push(resp.topics[i].name);
                    }
                }
                $topicSelector = $("#id_topic");
                $topicSelector.val(topic_list).trigger("change");
                $('.breaking-heading').text(resp.title);
                $('.breaking-summary').text(resp.summary);
                $('.breaking-category').text(resp.category.name);
                recreate_title_resizable();
            }
        });

        // $.ajax({
        //     url: '/api/related-news/'+related_id+'/',
        //     type: 'GET',
        //     data: {},
        //     success: function(resp){
        //         $("#id_related_news").html("");
        //         var res = resp.results
        //         for (i=0; i<resp.results.length; i++){
        //             $('#id_related_news').append("<option selected value='"+resp.results[i].id+"'>"+resp.results[i].title+"</option>");
        //         }
        //         update_related_selections();
        //     }
        // });
    });

// Topic search and show for selection

    $("#search_topics").keyup(function(){
        if ($(this).val() && $(this).val().length > 2){
            var search_text = $(this).val();
            var selected_topic_ids = [];
            $('#id_topic :selected').each(function() {
                selected_topic_ids[this.value] = this.textContent;
            });
            $.ajax({
                url: "/api/rest-topic-search/?text="+search_text,
                type: 'GET',
                data: {},
                success: function(resp){
                    $("#id_topic").html("");
                    for (selected_topic in selected_topic_ids){
                        $('#id_topic').append("<option selected value='"+selected_topic+"'>"+selected_topic_ids[selected_topic]+"</option>");
                    }
                    for (i=0; i<resp.results.length; i++){
                        if(!selected_topic_ids[resp.results[i].topic_id]) {
                            $('#id_topic').append("<option value='"+resp.results[i].name+"'>"+resp.results[i].name+"</option>");
                        }
                    }
                }
            });
        }
    });
    $("#id_add_new_topic").on('click', function(){
        $('#id_topic').append("<option selected=selected value='"+$('#id_new_topic').val()+"'>"+$('#id_new_topic').val()+"</option>");
        $('#id_new_topic').val('');
    });


// Related News search and show for selection

    $("#search_related_news").keyup(function(){
        if ($(this).val() && $(this).val().length > 2){
            var search_text = $(this).val();
            var selected_related_ids = [];
            $('#id_related_news :selected').each(function() {
                selected_related_ids[this.value] = this.textContent;
            });
            $.ajax({
                url: "/api/rest-news-search/?text="+search_text,
                type: 'GET',
                data: {},
                success: function(resp){
                    $("#id_related_news").html("");
                    for (selected_news in selected_related_ids){
                        $('#id_related_news').append("<option selected value='"+selected_news+"'>"+selected_related_ids[selected_news]+"</option>");
                    }
                    for (i=0; i<resp.results.length; i++){
                        if(!selected_related_ids[resp.results[i].news_id]) {
                            $('#id_related_news').append("<option value='"+resp.results[i].news_id+"'>"+resp.results[i].title+"</option>");
                        }
                    }
//                    update_related_selections();
                }
            });
        }
    });

    //select between two panels for breaking news title
    $("input[name$='news_align']").click(function() {
        var type = $(this).val();
        if (type == 'right'){
            $("#breaking_news_left_panel").hide();
            $("#breaking_news_right_panel").show();
        }
        else {
            $("#breaking_news_left_panel").show();
            $("#breaking_news_right_panel").hide();
        }
    })

    //select between two panels for related
    $("input[name$='related_align']").click(function() {
        var type = $(this).val();
        if (type == 'right'){
            $(".related_news_left_panel").hide();
            $(".related_news_right_panel").show();
        }
        else {
            $(".related_news_left_panel").show();
            $(".related_news_right_panel").hide();
        }
    })

    function recreate_title_resizable() {
       // $( ".breaking-news-title" ).resizable("destroy").resizable({
       //      stop: function(event, ui) {
       //          droppable_container = $(".breaking-news-image");
       //          var width = $(this).width();
       //          var height = $(this).height();
       //          percentWidth = (width / droppable_container.width()) * 100;
       //          precentHeight  = (height / droppable_container.height()) * 100;
       //          $("#id_title_width").val(Math.round(percentWidth * 100) / 100);
       //          $("#id_title_height").val(Math.round(precentHeight * 100) / 100);
       //      }
       //  });
    }
    // Breaking News title js functions ends

    // Breaking News related news js functions starts
    // $( ".breaking-news-related" ).resizable({
    //     stop: function(event, ui) {
    //         droppable_container = $(".breaking-news-image");
    //         var width = $(this).width();
    //         var height = $(this).height();
    //         percentWidth = (width / droppable_container.width()) * 100;
    //         precentHeight  = (height / droppable_container.height()) * 100;
    //         $("#id_related_width").val(Math.round(percentWidth * 100) / 100);
    //         $("#id_related_height").val(Math.round(precentHeight * 100) / 100);
    //     }
    // });
    // $( ".breaking-news-related" ).draggable({
    //     containment: ".breaking-news-image",
    //     scroll: false,
    //     stop: function(event, ui) {
    //         droppable_container = $(".breaking-news-image");
    //         var left = $(this).position().left;
    //         var top  = $(this).position().top;
    //         percentLeft = (left / droppable_container.width()) * 100;
    //         precentTop  = (top / droppable_container.height()) * 100;
    //         $("#id_related_left").val(Math.round(percentLeft * 100) / 100);
    //         $("#id_related_top").val(Math.round(precentTop * 100) / 100);
    //     }
    // });

    function update_related_selections() {
        var related_ids = []
        $('#id_related_news :selected').each(function(i, selected){
          related_ids[i] = $(selected).val();
        });
        $.ajax({
            url: '/nimda/ajax/update_breaking_related_list/',
            type: 'GET',
            data: {'related_ids': related_ids},
            success: function(resp){
                $(".breaking-related-ul").html("");
                for (i=0; i<resp.related_data.length; i++){
                    $(".breaking-related-ul").append("<li><a href='/news/"+ resp.related_data[i][0] +"' target='blank'>"+ resp.related_data[i][1] +"</a></li>")
                }
            }
        });
    }

    update_related_selections()

    $("#id_related_news").on('change', function(){
        update_related_selections()
    });

    $('.related_color').colorpicker().on('changeColor.colorpicker', function(event){
        var color = event.color.toHex();
        $(".breaking-news-related").children().find("a").css("color", color);
        $(".breaking-live_update").children().find("li").css("color", color);
    });

    // Changing the font size of title and summary
    $("#slider_title").slider(
    {
        min: 10,
        max: 50,
        step: 1,
        change: showTitleChange
    });
    $("#slider_title").slider("option", "value", $('#id_title_font_size').val());

    function showTitleChange(event, ui) {
        $("#title_font_value").html(ui.value);
        $("#id_title_font_size").val(ui.value);
        $(".breaking-heading").css("font-size",(ui.value));
    }
    $("#slider_summary").slider(
    {
        min: 10,
        max: 50,
        step: 1,
        change: showSummaryChange
    });
    $("#slider_summary").slider("option", "value", $('#id_summary_font_size').val());

    function showSummaryChange(event, ui) {
        $("#summary_font_value").html(ui.value);
        $("#id_summary_font_size").val(ui.value);
        $(".breaking-summary").css("font-size",(ui.value));
    }
    // function recreate_relatesd_resizable() {
    //    $( ".breaking-news-related" ).resizable("destroy").resizable({
    //         stop: function(event, ui) {
    //             droppable_container = $(".breaking-news-image");
    //             var width = $(this).width();
    //             var height = $(this).height();
    //             percentWidth = (width / droppable_container.width()) * 100;
    //             precentHeight  = (height / droppable_container.height()) * 100;
    //             $("#id_title_width").val(Math.round(percentWidth * 100) / 100);
    //             $("#id_title_height").val(Math.round(precentHeight * 100) / 100);
    //         }
    //     });
    // }
    // Breaking News related news js functions ends

    function update_bg_image(input) {
        img_url = $("#id_background_image").val();
        if(img_url) {
            $('.breaking-news-image').css('background', 'transparent url('+img_url+') left top no-repeat');
            $('#hidden-bg-image').attr('src', img_url);
        }
     }

    $("#id_background_image").change(function(){
        update_bg_image(this);
    });

    $("input[name$='show_live_update']").click(function() {
        if ($(this).prop('checked') == true) {
            $("#show_related_news_section").hide();
            $("#show_live_updates_section").show();
            $("#live_updates_row").show();
            $("#related_news_row").hide();
        } else {
            $("#show_related_news_section").show();
            $("#show_live_updates_section").hide();
            $("#live_updates_row").hide();
            $("#related_news_row").show();
        }
    })

    function update_live_update_selections() {
        var live_update_ids = []
        $('#id_updates :selected').each(function(i, selected){
          live_update_ids[i] = $(selected).val();
        });
        live_update_ids.sort(function(a, b){return b-a});
        $(".breaking-live_update-ul").html("");
        no_of_counts = 3;
        for (i=0; i<no_of_counts; i++){
            if(live_update_ids[i]){
                update_text = $("#id_updates option[value='"+live_update_ids[i]+"']").text()
                $(".breaking-live_update-ul").append("<li>"+update_text+"</li>")
            } else if(i < live_update_ids.length){
                no_of_counts++;
            }
        }
    }
    update_live_update_selections();

    $("#add_live_update").on('click', function(){
        update = $("#id_live_update_text").val();
        if(update != '' ){
            $.ajax({
                url: '/nimda/ajax/add_breaking_news_live_update/',
                type: 'GET',
                data: {'update': update },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(errorThrown);
                },
                success: function(resp){
                    $("#id_updates").append("<option value='"+ resp.id+"' selected ='selected'>"+resp.update+"</option>");
                    update_live_update_selections();
                }
            });
            $("#id_live_update_text").val('');
        }
    });

});

function update_post_status(status){
    $("#id_post_status").val(status);
}
