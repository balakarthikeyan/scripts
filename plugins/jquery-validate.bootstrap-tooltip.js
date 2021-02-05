/**
 * jQuery Validation Bootstrap Tooltip extention v0.10.0
 * https://github.com/Thrilleratplay/jQuery-Validation-Bootstrap-tooltip
 * Copyright 2015 Tom Hiller
 * Released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function() {
    jQuery.extend(true, jQuery.validator, {
        prototype: {
            defaultShowErrors: function() {
                var _this = this;
                var bsVersion = jQuery.fn.tooltip.Constructor.VERSION;
                var bsMajorVer = 0;
                var bsMinorVer = 0;

                // Try to determine Bootstrap major and minor versions
                if (bsVersion) {
                    bsVersion = bsVersion.split('.');
                    bsMajorVer = parseInt(bsVersion[0]);
                    bsMinorVer = parseInt(bsVersion[1]);
                }

               jQuery.each(this.errorList, function(index, value) {
                    //If Bootstrap 3.3 or greater
                    if (bsMajorVer === 3 && bsMinorVer >= 3) {
                        var currentElement = jQuery(value.element);
                        if (currentElement.data('bs.tooltip') !== undefined) {
                            currentElement.data('bs.tooltip').options.title = value.message;
                        } else {
                            currentElement.tooltip(_this.applyTooltipOptions(value.element, value.message));
                        }

                        jQuery(value.element).removeClass(_this.settings.validClass).addClass(_this.settings.errorClass).tooltip('show');
                    } else {
                        jQuery(value.element).removeClass(_this.settings.validClass).addClass(_this.settings.errorClass).tooltip('destroy').tooltip(_this.applyTooltipOptions(value.element, value.message)).tooltip('show');
                    }

                    if (_this.settings.highlight) {
                        _this.settings.highlight.call(_this, value.element, _this.settings.errorClass, _this.settings.validClass);
                    }
                });

                jQuery.each(_this.validElements(), function(index, value) {
                    jQuery(value).removeClass(_this.settings.errorClass).addClass(_this.settings.validClass).tooltip(bsMajorVer === 4 ? 'dispose' : 'destroy');
                    if (_this.settings.unhighlight) {
                        _this.settings.unhighlight.call(_this, value, _this.settings.errorClass, _this.settings.validClass);
                    }
                });
            },

            applyTooltipOptions: function(element, message) {
                var options = {
                    animation: jQuery(element).data('animation') || true,
                    html: jQuery(element).data('html') || false,
                    placement: jQuery(element).data('placement') || 'top',
                    selector: jQuery(element).data('selector') || false,
                    title: jQuery(element).attr('title') || message,
                    trigger: jQuery.trim('manual ' + (jQuery(element).data('trigger') || '')),
                    delay: jQuery(element).data('delay') || 0,
                    container: jQuery(element).data('container') || false,
                };

                if (this.settings.tooltip_options && this.settings.tooltip_options[element.name]) {
                    jQuery.extend(options, this.settings.tooltip_options[element.name]);
                }
                if (this.settings.tooltip_options && this.settings.tooltip_options['_all_']) {
                    jQuery.extend(options, this.settings.tooltip_options['_all_']);
                }
                return options;
            },
        },
    });
}(jQuery));
