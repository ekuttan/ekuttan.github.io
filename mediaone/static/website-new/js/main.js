/*!
 * Actions Popup
 */

$(function() {
    $('.news-header-wrapper .actions-popup').addClass('visible');

    var lastScrollTop = 0;

    $(window).scroll(function(event){
        var st = $(this).scrollTop();
        if (st > lastScrollTop){
            // downscroll code
            $('.actions-popup').removeClass('visible');
        } else {
            // upscroll code
            showPopup();
        }
        lastScrollTop = st;
    });

    function showPopup() {
        var elements = $('.news-item-cover, .news-item-content');

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (isElementInViewport(el)) {
                var prev = $(el).prevAll('.news-item-header');
                // console.log(prev);
                if (prev.length > 0)  {
                    prev.find('.actions-popup').addClass('visible');
                } else {
                    // first news item. Since header is not a sibling, it won't be found
                    $('.news-header-wrapper .actions-popup').addClass('visible');
                }
                break;
            }
        }
    }

    // Reference: http://stackoverflow.com/a/16270434
    function isElementInViewport(el) {
        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var rect = el.getBoundingClientRect();

        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */ &&
            rect.top < (window.innerHeight || document. documentElement.clientHeight) /*or $(window).height() */;
    }
});

/*!
 * Bootstrap-submenu v2.0.4 (https://vsn4ik.github.io/bootstrap-submenu/)
 * Copyright 2014-2016 Vasily A. (https://github.com/vsn4ik)
 * Licensed under the MIT license
 */

/**
 * $.inArray: friends with IE8. Use Array.prototype.indexOf in future.
 * $.proxy: friends with IE8. Use Function.prototype.bind in future.
 */

'use strict';

(function(factory) {
  if (typeof define == 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  }
  else if (typeof exports == 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  }
  else {
    // Browser globals
    factory(jQuery);
  }
})(function($) {
  function Item(element) {
    this.$element = $(element);
    this.$menu = this.$element.closest('.dropdown-menu');
    this.$main = this.$menu.parent();
    this.$items = this.$menu.children('.dropdown-submenu');

    this.init();
  }

  Item.prototype = {
    init: function() {
      this.$element.on('keydown', $.proxy(this, 'keydown'));
    },
    close: function() {
      this.$main.removeClass('open');
      this.$items.trigger('hide.bs.submenu');
    },
    keydown: function(event) {
      // 27: Esc

      if (event.keyCode == 27) {
        event.stopPropagation();

        this.close();
        this.$main.children('a, button').trigger('focus');
      }
    }
  };

  function SubmenuItem(element) {
    this.$element = $(element);
    this.$main = this.$element.parent();
    this.$menu = this.$main.children('.dropdown-menu');
    this.$subs = this.$main.siblings('.dropdown-submenu');
    this.$items = this.$menu.children('.dropdown-submenu');

    this.init();
  }

  $.extend(SubmenuItem.prototype, Item.prototype, {
    init: function() {
      this.$element.on({
        click: $.proxy(this, 'click'),
        keydown: $.proxy(this, 'keydown')
      });

      this.$main.on('hide.bs.submenu', $.proxy(this, 'hide'));
    },
    click: function(event) {
      // Fix a[href="#"]. For community
      event.preventDefault();

      event.stopPropagation();

      this.toggle();
    },
    hide: function(event) {
      // Stop event bubbling
      event.stopPropagation();

      this.close();
    },
    open: function() {
      this.$main.addClass('open');
      this.$subs.trigger('hide.bs.submenu');
    },
    toggle: function() {
      if (this.$main.hasClass('open')) {
        this.close();
      }
      else {
        this.open();
      }
    },
    keydown: function(event) {
      // 13: Return, 32: Spacebar

      if (event.keyCode == 32) {
        // Off vertical scrolling
        event.preventDefault();
      }

      if ($.inArray(event.keyCode, [13, 32]) != -1) {
        this.toggle();
      }
    }
  });

  function Submenupicker(element) {
    this.$element = $(element);
    this.$main = this.$element.parent();
    this.$menu = this.$main.children('.dropdown-menu');
    this.$items = this.$menu.children('.dropdown-submenu');

    this.init();
  }

  Submenupicker.prototype = {
    init: function() {
      this.$menu.off('keydown.bs.dropdown.data-api');
      this.$menu.on('keydown', $.proxy(this, 'itemKeydown'));

      this.$menu.find('li > a').each(function() {
        new Item(this);
      });

      this.$menu.find('.dropdown-submenu > a').each(function() {
        new SubmenuItem(this);
      });

      this.$main.on('hidden.bs.dropdown', $.proxy(this, 'hidden'));
    },
    hidden: function() {
      this.$items.trigger('hide.bs.submenu');
    },
    itemKeydown: function(event) {
      // 38: Arrow up, 40: Arrow down

      if ($.inArray(event.keyCode, [38, 40]) != -1) {
        // Off vertical scrolling
        event.preventDefault();

        event.stopPropagation();

        var $items = this.$menu.find('li:not(.disabled):visible > a');
        var index = $items.index(event.target);

        if (event.keyCode == 38 && index !== 0) {
          index--;
        }
        else if (event.keyCode == 40 && index !== $items.length - 1) {
          index++;
        }
        else {
          return;
        }

        $items.eq(index).trigger('focus');
      }
    }
  };

  var old = $.fn.submenupicker;

  // For AMD/Node/CommonJS used elements (optional)
  // http://learn.jquery.com/jquery-ui/environments/amd/
  $.fn.submenupicker = function(elements) {
    var $elements = this instanceof $ ? this : $(elements);

    return $elements.each(function() {
      var data = $.data(this, 'bs.submenu');

      if (!data) {
        data = new Submenupicker(this);

        $.data(this, 'bs.submenu', data);
      }
    });
  };

  $.fn.submenupicker.Constructor = Submenupicker;
  $.fn.submenupicker.noConflict = function() {
    $.fn.submenupicker = old;
    return this;
  };

  return $.fn.submenupicker;
});
;

/* ===================================================
 * bootstrap-overflow-navs.js v0.4
 * ===================================================
 * Copyright 2012-15 Michael Langford, Evan Owens
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

+function ($) { "use strict";

    /**
     * options:
     *      more - translated "more" text
     *      offset - width that needs to be subtracted from the parent div width
     */
    $.fn.overflowNavs = function(options) {
        // Create a handle to our ul menu
        // @todo Implement some kind of check to make sure there is only one?  If we accidentally get more than one
        // then strange things happen
        var ul = $(this);

        // This should work with all navs, not just the navbar, so you should be able to pass a parent in
        var parent = options.parent ? options.parent : ul.parents('.navbar');

        // Check if it is a navbar and twitter bootstrap collapse is in use
        var collapse = $('div.nav-collapse').length; // Boostrap < 2
        if(!collapse) {
            var collapse = $('div.navbar-collapse').length; // Boostrap > 2
        }

        // Check if bootstrap navbar is collapsed (mobile)
        if(collapse) {
            var collapsed = $('.btn-navbar').is(":visible"); // Boostrap < 2
            if(!collapsed) {
                var collapsed = $('.navbar-toggle').is(":visible"); // Boostrap > 2
            }
        }
        else {
            var collapsed = false;
        }

        // Only process dropdowns if not collapsed
        if(collapsed === false) {

            // Get width of the navbar parent so we know how much room we have to work with
            var parent_width = $(parent).width() - (options.offset ? parseInt(options.offset) : 0);

            // Find an already existing .overflow-nav dropdown
            var dropdown = $('li.overflow-nav', ul);

            // Create one if none exists
            if (! dropdown.length) {
                dropdown = $('<li class="overflow-nav dropdown"></li>');
                dropdown.append($('<a class="dropdown-toggle" data-toggle="dropdown" href="#">' + options.more + '</a>'));
                dropdown.append($('<ul class="dropdown-menu"></ul>'));
            }

            // Get the width of the navbar, need to add together <li>s as the ul wraps in bootstrap
            var width = 100; // Allow for padding
            ul.children('li').each(function() {
                var $this = $(this);
                width += $this.outerWidth();
            });

            // Window is shrinking
            if (width >= parent_width) {
                // Loop through each non-dropdown li in the ul menu from right to left (using .get().reverse())
                $($('li', ul).not('.overflow-nav').not('.dropdown li').get().reverse()).each(function() {
                    // Get the width of the navbar
                    var width = 100; // Allow for padding
                    ul.children('li').each(function() {
                        var $this = $(this);
                        width += $this.outerWidth();
                    });
                    if (width >= parent_width) {
                        // Remember the original width so that we can restore as the window grows
                        $(this).attr('data-original-width', $(this).outerWidth());
                        // Move the rightmost item to top of dropdown menu if we are running out of space
                        if ($(this).hasClass('dropdown')) {
                            $(this).removeClass('dropdown').addClass('dropdown-submenu');
                        }
                        dropdown.children('ul.dropdown-menu').prepend(this);
                    }
                    // @todo on shrinking resize some menu items are still in drop down when bootstrap mobile navigation is displaying
                });
            }
            // Window is growing
            else {
                // We used to just look at the first one, but this doesn't work when the window is maximized
                //var dropdownFirstItem = dropdown.children('ul.dropdown-menu').children().first();
                dropdown.children('ul.dropdown-menu').children().each(function() {
                    if (width+parseInt($(this).attr('data-original-width')) < parent_width) {
                        // Restore the topmost dropdown item to the main menu
                        dropdown.before(this);
                    }
                    else {
                        // If the topmost item can't be restored, don't look any further
                        return false;
                    }
                });
            }

            // Remove or add dropdown depending on whether or not it contains menu items
            if (! dropdown.children('ul.dropdown-menu').children().length) {
                dropdown.remove();
            }
            else {
                // Append new dropdown menu to main menu iff it doesn't already exist
                if (! ul.children('li.overflow-nav').length) {
                    ul.append(dropdown);
                }
            }
        }
    };

}(window.jQuery);
;
$(function() {
    $('.breaking-news .btn-close').on('click', function() {
        // console.log('closing...');
        $('.breaking-news').addClass('closed');
    });
});
;
/*!
 * Cover Image Animation
 */

$(function() {
    // cover image animation is disabled...
    return;

    if ($('.news-header-wrapper').length == 0) {
        return;
    }

    if ($('.news-header-wrapper.imageless').length > 0) {
        return;
    }

    $(window).load(function() {
        var selector = '.news-header-wrapper.modify .news-item-cover';
        var headerHeight = $('.news-header-wrapper > .container').height(); // 235
        var coverHeight  = $('.news-header-wrapper > .news-item-cover').height(); // 750
        var marginTop    = headerHeight + (coverHeight - headerHeight);

        if ($('.news-header-wrapper.header-alt').length > 0) {
            marginTop = coverHeight - headerHeight - 150;
            selector += ' img';
        }

        var style = "<style type='text/css'>" +
                    selector + " { " +
                    " margin-top: -" + marginTop + "px; }" +
                    "</style>";
        $(style).appendTo('head');
    });

    (function() {
        // detect if IE : from http://stackoverflow.com/a/16657946
        var ie = (function(){
            var undef,rv = -1; // Return value assumes failure.
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf('MSIE ');
            var trident = ua.indexOf('Trident/');

            if (msie > 0) {
                // IE 10 or older => return version number
                rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            } else if (trident > 0) {
                // IE 11 (or newer) => return version number
                var rvNum = ua.indexOf('rv:');
                rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
            }

            return ((rv > -1) ? rv : undef);
        }());


        // disable/enable scroll (mousewheel and keys) from http://stackoverflow.com/a/4770179
        // left: 37, up: 38, right: 39, down: 40,
        // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
        var keys = [32, 37, 38, 39, 40], wheelIter = 0;

        function preventDefault(e) {
            e = e || window.event;
            if (e.preventDefault)
            e.preventDefault();
            e.returnValue = false;
        }

        function keydown(e) {
            for (var i = keys.length; i--;) {
                if (e.keyCode === keys[i]) {
                    preventDefault(e);
                    return;
                }
            }
        }

        function touchmove(e) {
            preventDefault(e);
        }

        function wheel(e) {
            // for IE
            //if( ie ) {
                //preventDefault(e);
            //}
        }

        function disable_scroll() {
            window.onmousewheel = document.onmousewheel = wheel;
            document.onkeydown = keydown;
            document.body.ontouchmove = touchmove;
        }

        function enable_scroll() {
            window.onmousewheel = document.onmousewheel = document.onkeydown = document.body.ontouchmove = null;
        }

        var docElem = window.document.documentElement,
            scrollVal,
            isRevealed,
            noscroll,
            isAnimating,
            container = $('.news-header-wrapper')[0];
            // trigger = container.querySelector( 'button.trigger' );

        function scrollY() {
            return window.pageYOffset || docElem.scrollTop;
        }

        function scrollPage() {
            scrollVal = scrollY();

            if( noscroll && !ie ) {
                if( scrollVal < 0 ) return false;
                // keep it that way
                window.scrollTo( 0, 0 );
            }

            if( $(container).hasClass('notrans')) {
                $(container).removeClass('notrans');
                return false;
            }

            if( isAnimating ) {
                return false;
            }

            if( scrollVal <= 0 && isRevealed ) {
                toggle(0);
            }
            else if( scrollVal > 0 && !isRevealed ){
                toggle(1);
            }
        }

        function toggle( reveal ) {
            isAnimating = true;

            if( reveal ) {
                $(container).addClass('modify');
            }
            else {
                noscroll = true;
                disable_scroll();
                $(container).removeClass('modify');
            }

            // simulating the end of the transition:
            setTimeout( function() {
                isRevealed = !isRevealed;
                isAnimating = false;
                if( reveal ) {
                    noscroll = false;
                    enable_scroll();
                }
            }, 600 );
        }

        // refreshing the page...
        var pageScroll = scrollY();
        noscroll = pageScroll === 0;

        disable_scroll();

        if( pageScroll ) {
            isRevealed = true;
            $(container).addClass('notrans');
            $(container).addClass('modify');
        }

        window.addEventListener( 'scroll', scrollPage );
        //trigger.addEventListener( 'click', function() { toggle( 'reveal' ); } );
    })();
});
;

$(function() {
    $('.navbar .navbar-controls .btn-login').on('click', function() {
        $('.login-container').toggleClass('in');
    });

    $('.login-container .close').on('click', function() {
        $('.login-container').removeClass('in');
    });
});
;
/*!
 * Media One
 */
;
/*!
 * Navbar
 */

$(function() {
    $(window).load(function() {
        var adHeight = $('#ad-top').height();

        $('#navbar').affix({
              offset: {
                top: adHeight
              }
        });
    });

    window.recalcWidths= function () {
        var widths = {};

        widths.navbarBrandWidth    = $('.navbar-brand').outerWidth();
        widths.navbarContainerWidth = $('.navbar-container').width();
        widths.navbarControlsWidth  = 0;

        widths.collapsed = $('.navbar-toggle').is(":visible");
        if (widths.collapsed) {
            // account for navbar toggle width
            widths.navbarControlsWidth = 90;
        } else {
            var controls = $('.navbar-control');
            for (var i = 0; i < controls.length; i++) {
                var control = $(controls[i]);

                if (control.hasClass('navbar-search')) {
                    widths.navbarControlsWidth += control.find('.search-box').outerWidth();
                } else {
                    widths.navbarControlsWidth += control.outerWidth();
                }
            }
        }

        widths.offset = widths.navbarBrandWidth + widths.navbarControlsWidth;
        widths.left   = widths.collapsed ? widths.offset : widths.navbarControlsWidth;

        return widths;
    }

    var widths = window.recalcWidths();
    $('.navbar-controls').css('left', widths.collapsed ? 0 : widths.navbarContainerWidth - widths.left);
    $('.navbar-controls .search-box .form-control').on('focus', function() {
        $('.navbar-controls').css('left', widths.collapsed ? 0 : widths.navbarBrandWidth);
        $('.navbar-controls .search-box').css('width', '100%');
        $('.navbar-controls .search-box .form-control').css('padding-left', '26px');
    });
    $('.navbar-controls .search-box .form-control').on('focusout', function() {
        $('.navbar-controls .search-box').css('width', '34px');
        $('.navbar-controls .search-box .form-control').css('padding-left', '0px');
        setTimeout(function() {
            $('.navbar-controls').css('left', widths.navbarContainerWidth - widths.left);
        }, 1100);
    });

    $(".navbar-nav").overflowNavs({
        "more" : "More",
        "parent" : ".navbar-container",
        "offset": widths.offset
    });

    $(window).on('resize', function() {
        widths = window.recalcWidths();

        $('.navbar-controls').css('left', widths.collapsed ? 0 : widths.navbarContainerWidth - widths.left);

        $(".navbar-nav").overflowNavs({
            "more" : "<i class='fa fa-ellipsis-v'></i>",
            "parent" : ".navbar-container",
            "offset": widths.offset
        });
    });
});
;
$(function() {
    $('.profile-edit .user-avatar .overlay').on('click', function() {
        $('#id_avatar_file').click();
        return false;
    });

    $('.profile-header .btn-edit').on('click', function() {
        // console.log('hiding normal');
        $('.profile-header').not('.profile-edit').collapse('hide');
        return false;
    });

    $('.profile-header .btn-cancel').on('click', function() {
        // console.log('hiding edit');
        $('.profile-edit').collapse('hide');
        return false;
    });
    $('.profile-header').on('hidden.bs.collapse', function () {
        if ($(this).hasClass('profile-edit')) {
            // console.log('showing normal');
            $('.profile-header').not('.profile-edit').collapse('show');
        } else {
            // console.log('showing edit');
            $('.profile-edit').collapse('show');
        }
    });
});
;
$(function() {
    $('.schedule-list .days a').on('click', function() {
        var current  = $('.program-list .collapse.in');
        var targetId = $(this).attr('href');

        if (current.attr('id') == targetId.substr(1)) {
            return;
        }

        current.collapse('hide');
        $(targetId).collapse('show');

        $('.schedule-list .days a').removeClass('active');
        $(this).addClass('active');

        return false;
    });
});
;
// $(function() {
//     $('.rate-me .star').on('click', function() {
//         console.log('Your Rating: ' + $(this).attr('title'));
//         return false;
//     });
// });
;
$(function() {
    $('.search-result .btn-close').on('click', function() {
        $('.search-result').removeClass('in');
    });

    $('.navbar .search-box .form-control').on('change keyup paste', function() {
        $('.search-result').addClass('in');
    });

    $('.navbar .search-box .form-control').on('blur', function() {
        $(this).val('');
    });
});