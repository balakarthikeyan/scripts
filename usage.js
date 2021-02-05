<script type="text/javascript" src="plugins/jquery-simple-pagination.js"></script>
<link rel="stylesheet" href="<?=$CONFVAR['JSPATH'];?>jquery-ui/jquery-ui.min.css" type="text/css" />
<script type="text/javascript" src="jquery-ui/jquery-ui.min.js"></script>
<script type="text/javascript" src="plugins/jquery.ui.touch-punch.min.js"></script>
<link rel="stylesheet" type="text/css" href="fancybox/jquery.fancybox.css?v=2.1.5" media="screen" />
<script type="text/javascript" src="fancybox/jquery.fancybox.js?v=2.1.5"></script>
<script type="text/javascript" src="customscrollbar/customscrollbar.js"></script>
<link rel="stylesheet" href="customscrollbar/customscrollbar.css" type="text/css" />
jQuery(document).ready(function() {	

	//Like Page onload
	jQuery.fancybox({
		modal			: false,
		type  			: 'iframe',
		href  			: 'file.html',                
		title 			: null,
		width 			: 250,
		height 			: 150,
		autoDimensions  : true,
		autoScale 		: false,
		autoSize		: false			
	}); 

	jQuery('#tour_container').show();
  var $pagination = jQuery('#tour_container').simplePagination({
        previous_content: '<button class="btn custom_btn brown_btn">Back</button>', 
        next_content: '<button class="btn custom_btn brown_btn">Next</button>', 
        skip_content: '<button class="btn custom_btn brown_btn">Skip</button>', 
        close_content: '<button class="btn custom_btn brown_btn">Play</button>', 		
        number_of_visible_page_numbers: 2,
        items_per_page: 1,
        use_page_numbers: false,
        pagination_container: '.web_tour',
		    pages_container: ".web_pages",
        html_prefix: 'simple-pagination',
        navigation_element: 'a',
		    use_page_skip: true
    });
    	jQuery.fancybox({
		content: $pagination,
		prevEffect: 'none',
		nextEffect: 'none',
		type: 'html',		
		modal: true,
		scrolling: 'no',
		title: null,
		width: 500,
		height: 250,
		autoDimensions: true,
		autoScale: false,
		autoSize: true,
		helpers: {
			overlay: {
				closeClick: false
			}
		},
//		beforeShow : function() {
//			jQuery('.fancybox-skin').css({'background' :'#fcbf68'});
//		},
		afterClose   : function() {
			window.setTimeout( 
			function() {
				jQuery('.fancybox-skin').css({'background' :'#ffffff'});				
			}, 5000);
		},
//		onComplete: function () {
//			jQuery.fancybox.resize();
//			jQuery.fancybox.center();
//		}
	});
	jQuery(".fancybox-overlay").unbind();
});

	<div id="tour_container" class="tour_container">
		<div class="web_tour">
			<div class="simple-pagination-page-x-of-x"></div>
			<div class="web_pages">
				<h1 class="h1 simple-title"><?php echo $lang['TITLE']; ?></h1>
				<?php echo $lang['CONTENT']; ?>
			</div>
		</div>
		<div class="clearfix"></div>
		<div class="col-xs-12 my-navigation">
			<div class="col-xs-4 nav-wrap nav-wrap-left">
				<div class="simple-pagination-skip"></div>
				<div class="simple-pagination-close"></div>
			</div> 
			<div class="col-xs-8 nav-wrap nav-wrap-right">
				<!--<div class="simple-pagination-first"></div>-->
				<div class="simple-pagination-previous"></div>
				<!--<div class="simple-pagination-page-numbers"></div>-->
				<div class="simple-pagination-next"></div>
				<!--<div class="simple-pagination-last"></div>-->
			</div>
		</div>
		<div class="clearfix"></div>        
	</div>
