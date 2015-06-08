// Tabs
;(function ($, window, document, undefined) {

    'use strict';

    //plugin name
    var tabs = 'tabs';

    //get instance
    var self = null;

    //defaults
    var defaults = {};

    //main function
    function Tabs(element, options) {
        self = this;
        this.element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = tabs;
        //init
        this.init();
    }

    //Check for mobile devices
    Tabs.prototype.isMobile = function () {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    //Check if tab-bar is in app-bar
    Tabs.prototype.isAppbar = function ($element) {
        return $element.closest('#app-bar-main').length;
    };

    //Init
    Tabs.prototype.init = function () {
        var $element = this.element,
            $tabs = $element.find('.tab'),
            $indicator,
            $activeTab,
            $thisTab;

        // Set the click event handler
        $tabs.on('click', function () {
            $thisTab = $(this);
            $activeTab = $element.find('.tab.active');
            self.indicate($element, $indicator, $activeTab, $thisTab);
        });
        $(window).on('load', function () {
            $indicator = $element.find('.indicator');
            $activeTab = $element.find('.tab.active');
            $thisTab = $element.find('.tab.active');
            $activeTab.click();
        });
        $(window).on('resize', function () {
            $indicator = $element.find('.indicator');
            $activeTab = $element.find('.tab.active');
            $thisTab = $element.find('.tab.active');
            //self.indicate($element, $indicator, $activeTab, $thisTab);
        });
        
    };


    Tabs.prototype.indicate = function ($element, $indicator, $activeTab, $thisTab) {
        var activeTabWidth = $activeTab.outerWidth(),
            thisTabWidth = $thisTab.outerWidth(),
            activeTabOffset = $activeTab.position().left,
            thisTabOffset = $thisTab.position().left,
            leftPos = thisTabOffset,
            rightPos = $element.outerWidth() - (thisTabOffset + thisTabWidth);
        if (thisTabOffset > activeTabOffset) {
            $indicator.css('right', rightPos);
            setTimeout(function () {
                $indicator.css('left', leftPos);
            }, 100);
        } else {
            $indicator.css('left', leftPos);
            setTimeout(function () {
                $indicator.css('right', rightPos);
            }, 100);
        }
        $activeTab.removeClass('active');
        $thisTab.addClass('active');
        self.setSubtitle($element, $thisTab);
    };
    
    Tabs.prototype.setSubtitle = function($element, $thisTab){
        if (self.isAppbar($element)) {
            var viewText = $thisTab.text();
            $element.closest('#app-bar-wrapper').find('.app-view-title').text(viewText);
        }
    };


    /**
     * Create the jquery plugin function
     */
    $.fn.tabs = function (options) {
        return this.each(function () {
            new Tabs(this, options);
        });
    };

})(jQuery, window, document);