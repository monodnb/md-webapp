/*jslint browser: true, devel: true */
(function ($, window, document) {

	//Variables
	var $appbar = $('#app-bar-wrapper');

	// The $ is now locally scoped
	$(function () {

		// DOM ready!


		// Initial setup
        $('.carousel').carousel();

		// Event delegation
		$('.theme-switch').on('click', changeTheme);
		$('.extend-appbar').on('click', extendAppbar);
		$('.extend-special').on('click', specialAppbar);
		$('.color-appbar').on('click', colorAppbar);

	});

	function changeTheme() {
		$('body').toggleClass('light-theme dark-theme');
	}
    
    function extendAppbar (){
        $appbar.toggleClass('extended');
    }
    
    function specialAppbar (){
        $appbar.toggleClass('special');
    }
    
    function colorAppbar (){
        $appbar.toggleClass('colored');
    }

}(window.jQuery, window, document)); // Fully reference jQuery after this point.

