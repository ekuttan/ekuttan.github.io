$(function () {

    App.initHelpers(['select2']);

    $('#id_expired_at').datetimepicker({format: 'YYYY-MM-DD HH:mm'});

    $("#id_title").on('keyup', function(){
        $('#lead-heading-left').text($(this).val());
        $('#lead-heading-right').text($(this).val());
        recreate_title_resizable();
    });

    $("#id_summary").on('keyup', function(){
        $('#lead-summary-left').text($(this).val());
        $('#lead-summary-right').text($(this).val());
        recreate_title_resizable();
    });

    $("#id_title").on('change', function(){
        $('#lead-heading-left').text($(this).val());
        $('#lead-heading-right').text($(this).val());
        recreate_title_resizable();
    });

    $("#id_category").on('change', function(){
        if ($(this).val()){
            $('#lead-category-left').text($("#id_category option:selected").text());
            $('#lead-category-right').text($("#id_category option:selected").text());
            recreate_title_resizable();
        }
        else{
            $('.lead-category-left').text("");
            $('.lead-category-right').text("");
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
        $(".lead-heading").css("color", color);
        $('#lead-heading-left').css("color", color);
        $('#lead-heading-right').css("color", color);
    });

    $('.summary_color').colorpicker().on('changeColor.colorpicker', function(event){
        var color = event.color.toHex();
        $(".lead-summary").css("color", color);
        $('#lead-summary-right').css("color", color);
        $('#lead-summary-left').css("color", color);

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
                $("#id_title").keyup();
                $("#id_summary").keyup();
                $("#id_category").change();
                recreate_title_resizable();
            }
        });

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


    //select between two panels for lead news title
    $("input[name$='news_align']").click(function() {
        var type = $(this).val();
        if (type == 'right'){
            $("#lead_news_left_panel").hide();
            $("#lead_news_right_panel").show();
        }
        else {
            $("#lead_news_left_panel").show();
            $("#lead_news_right_panel").hide();
        }
    })


    function recreate_title_resizable() {

    }
    // lead News title js functions ends



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
        $("#lead-heading-left").css("font-size",(ui.value));
        $("#lead-heading-right").css("font-size",(ui.value));
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
        $(".lead-summary").css("font-size",(ui.value));
        $("#lead-summary-left").css("font-size",(ui.value));
        $("#lead-summary-right").css("font-size",(ui.value));
    }

    function update_bg_image(input) {
        img_url = $("#id_background_image").val();
        if(img_url) {
            $('.lead-news-image').css('background', 'transparent url('+img_url+') left top no-repeat');
            $('#hidden-bg-image').attr('src', img_url);
        }
     }

    $("#id_background_image").change(function(){
        update_bg_image(this);
    });



});

function update_post_status(status){
    $("#id_post_status").val(status);
}
