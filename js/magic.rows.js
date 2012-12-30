/* Magic Rows | github.com/michaelburtonray/magic-rows */
;(function(window, $, undefined) {'use strict';

  $.fn.magicRows = function(options) {

		// hide everything while it is all being shilfted around
		this.addClass('images');
		$('html').addClass('loading')

		// apply css styles to container, anchor, and images
		this.css({
			'font-size' : 0,
			'text-align' : 'justify'
		}).children().css({
			'display' : 'inline-block'
		}).find('img').css({
			'display' : 'block'
		});

		// Hack to get the last line of container to be text-align: justify
		var $style_hack = $("<style type='text/css'>.images:after { content: '.'; display: inline-block; width: 100%; }</style>");
		$style_hack.appendTo($('head'));

		// support multiple elements
		if (this.length > 1) {
			this.each(function() {
				$(this).magicRows(options)
			});
			return this;
		}

		// private variables
		var images_array = [];
		var row = [];

		// settings
		var settings = $.extend({
			max_height : 225,
			margin : 6,
			loading_selector : 'html'
		}, options);

		// private methods
		
		/**
		 * Calculates the correct margin for the image based on its position in the row
		 * No left margin on first image; no right margin on last image; equal margins on all others
		 * @param {int} pos indicates the position of the image
		 * @param {posLast} is the zero-based indicator of the row's last position
		 * @return {string} CSS-style string of margins
		 */
		var calcMargins = function(pos, posLast) {
			var margin;

			// first image in row
			if (pos == 0) {
				margin = settings.margin + 'px ' + settings.margin + 'px ' + settings.margin + 'px 0px';

				// last image in row
			} else if (pos == posLast) {
				margin = settings.margin + 'px 0 ' + settings.margin + 'px ' + settings.margin + 'px';

				// everything else
			} else {
				margin = settings.margin + 'px';
			}

			return margin;
		};

		/**
		 * Sets the proper height and margin for each row containing images.
		 * @param *this* should be the DOM container of the a/img elements
 		 * @param {Image[]} row
 		 * @param {int} height
		 */
		var positionRow = function(row, height) {
			// iterate through row array and set height and margins
			for (var i = 0; i < row.length; i++) {
				var index = row[i].index;

				if (row.length > 1) {
					$(this).find('a:eq(' + index + ')').find('img')[0].style.height = height + 'px';
				}

				$(this).find('a:eq(' + index + ')').find('img')[0].style.margin = calcMargins(i, row.length - 1);

			}
		};

		// public methods
		this.init = function() {

			var $children = $(this).find('img');

			// set up the images_array array that stores information for
			// each image to be resized
			$children.each(function() {
				var $this = $(this);

				var image = {
					aspect_ratio : $this.width() / $this.height(),
					height : $this.height(),
					index : $this.parent().index(),
					width : $this.width()
				};
				images_array.push(image);

			});

			this.trigger();
			$(settings.loading_selector).removeClass('loading');
			return this;
		}

		this.trigger = function() {
			var parent_width = this.width();

			//  Row Loop
			while (images_array.length > 0) {

				// current image
				var image = images_array.shift();

				// push onto row
				row.push(image);

				// calculate height
				var denominator = 0;

				for (var i = 0; i < row.length; i++) {
					denominator += row[i].aspect_ratio;
				}

				var whitespace = (settings.margin * row.length * 2) - (2 * settings.margin);

				var height = Math.floor((parent_width - whitespace) / denominator) - 1;

				if (height <= settings.max_height) {

					positionRow.apply(this, [row, height]);

					// clear our row array
					row = [];
				}

			}

			// remaining images
			if (row.length > 0) {
				positionRow.apply(this, [row, height]);
			}

			return this;
		}

		return this.init();

	};

})(window, jQuery); 
