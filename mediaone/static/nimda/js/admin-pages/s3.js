$(function () {
	$(document).on("click", ".folder_name", function(){
		console.log("reaches here");
		var folder_id = $(this).attr("data-folder-id");
	});
});