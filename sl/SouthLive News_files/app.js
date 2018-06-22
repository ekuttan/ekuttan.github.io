// function scrollingTo(id){
//   $('html,body').animate({scrollTop: ($(id).offset().top-87)},  1800, 'easeOutBack');
// }

function viewport(){
  var e = window
  , a = 'inner';
  if ( !( 'innerWidth' in window ) ){
    a = 'client';
    e = document.documentElement || document.body;
  }
  
  return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}

function slideSize(){
  var dim = viewport();
  
  var pH = dim.height;
  
  var hH = $("header").height();
  var bL = $("#boss-area").height();
  
  // check if its mobile, discard if so.
  if(dim.width < 500){    
    var nH = (pH - hH);

  }else{
    var nH = (pH - hH) - bL;
  }

  $('.carousel .item').height(nH);
  return true;
}

$(document).ready(function(){

  $('.filler').hover(function(){
    $('.filler').find('p').addClass('animated fadeInUp');
    console.log('hit');
  });
  
  // slideSize();

  // $('a[rel="slideto"]').click(function() {
  //   console.log('going..');
  //   var target = $(this).attr('href');
  //   scrollingTo(target);
  //   return false;
  // }); 
 	
  // // Check if #myCarousel is present 
  // var cr = $('#myCarousel').length;
  // if(cr >0){
  // 	$('#myCarousel').carousel();

  // 	/** Adding animation using animate.css **/
  //   	$('#myCarousel').bind('slide', function() {
  //       $(this).find('.carousel-captions').removeClass('fadeInRight').delay(200);;
  //       $(this).find('.carousel-captions').addClass('fadeOutRight');
  //   	});

  //   	$('#myCarousel').bind('slid', function(e) {
  //       $(this).find('.carousel-captions').removeClass('fadeOutRight');
  //       $(this).find('.carousel-captions').addClass('fadeInRight').delay(200);
  //   	});
  // }

  // //
  // $( window ).resize(function() {
  //   slideSize();
  // });

});
