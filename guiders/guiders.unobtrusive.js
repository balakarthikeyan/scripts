/*
* guiders.unobtrusive.js
* An unobtrusive guiders.js extension.
* version 1.0
* by Douglas Tarr https://github.com/tarr11
* 
* Developed at CorpQNA. (www.corpqna.com)
* Q&A For Business
*
* Forked from Guiders-JS https://github.com/jeff-optimizely/Guiders-JS
* Released under the Apache License 2.0.
* www.apache.org/licenses/LICENSE-2.0.html
* 
*
*/
(function (jQuery) {

	jQuery.fn.guider = function () {

		// there's no need to do jQuery(this) because
		// "this" is already a jquery object

		var ids = [];

		this.children().each(function (index, val) {
			if (val.id == "")
				ids.push("guider-" + index);
			else
				ids.push(val.id);
		});

		this.children().each(function (index, value) {
			var guiderId = ids[index];
			var nextId = ids[index + 1];
			var buttons = [];
			jQuery(this).find('.guider-buttons-row').children().each(function () {
				var btn = {
					name: jQuery(this).html(),
					classString: jQuery(this).attr('class')
				};
				if (jQuery(this).attr("data-onclick")) {
					var functionName = jQuery(this).attr("data-onclick");
					btn.onclick = function () { window[functionName]() };
				}
				buttons.push(btn);
			});
			var dataoffset = null;
			var guiderOptions = {
				description: jQuery(this).find('.guider-body').html(),
				buttons: buttons,
				attachTo: jQuery(this).attr('data-attachTo'),
				id: guiderId,
				next: nextId,
				overlay: (jQuery(this).attr('data-overlay') == "true"),
				title: jQuery(this).find('.guider-title').html(),
				position: jQuery(this).attr('data-position'),
				autoFocus: (jQuery(this).attr('data-autoFocus') == "true"),
				closeOnEscape: (jQuery(this).attr('data-closeOnEscape') == "true"),
				highlight: jQuery(this).attr('data-highlight'),
				isHashable: jQuery(this).attr('data-isHashable'),
				xButton: (jQuery(this).attr('data-xButton') == "true"),
				shouldSkip: (jQuery(this).attr('data-shouldSkip') == "true")
			};
			if (jQuery(this).attr('data-offset'))
				guiderOptions.offset = JSON.parse(jQuery(this).attr('data-offset'));


			if (jQuery(this).width() > 0) {
				guiderOptions.width = jQuery(this).width();
			}

			if (jQuery(this).height() > 0) {
				guiderOptions.height = jQuery(this).height();
			}
			var guider = guiders.createGuider(guiderOptions);

			if (index == 0)
				guider.show();

			return this;
		});
	};
})(jQuery);
