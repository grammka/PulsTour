(function(window, $) {

	var UTILS, STATES, OPTIONS;
	var points;

	// ==========================================================================
	
	OPTIONS = {
		pointSize: 20
	};

	STATES = ['fixedCenter', 'fixedNearElement', 'absoluteNearElement'];

	UTILS = {
		getUniqueId: (function() {
			var date = +new Date();
			return function() {
				return ++date;
			}
		})()
	};

	points = {};

	// ==========================================================================
	
	function getPointNearElementPosition(cssOptions, elmBounds) {
		if (this.placement == 'left' || this.placement == 'right') {
			cssOptions.top = elmBounds.top + (elmBounds.height - OPTIONS.pointSize) / 2;
		} else if (this.placement == 'top' || this.placement == 'bottom') {
			cssOptions.left = elmBounds.left + (elmBounds.width - OPTIONS.pointSize) / 2;
		}

		if (this.placement == 'top') {
			cssOptions.top = elmBounds.top - OPTIONS.pointSize / 2;
		} else if (this.placement == 'right') {
			cssOptions.left = elmBounds.left + elmBounds.width - OPTIONS.pointSize / 2;
		} else if (this.placement == 'bottom') {
			cssOptions.bottom = elmBounds.top + elmBounds.height - OPTIONS.pointSize / 2;
		} else if (this.placement == 'left') {
			cssOptions.left = elmBounds.left - OPTIONS.pointSize / 2;
		}
	}

	function getStatesPositions() {
		var elmBounds, appendToBounds,
			positions = {
				fixedCenter: {
					position: 'fixed',
					top: null,
					left: null
				},
				fixedNearElement: {
					position: 'fixed',
					transition: 'all linear 0.34s',
					top: null,
					left: null
				},
				absoluteNearElement: {
					position: 'absolute',
					top: null,
					left: null
				}
			};


		// fixedCenter ------------------------------------------------------------------------ /

		positions.fixedCenter.top = ($(window).height() - OPTIONS.pointSize) / 2;
		positions.fixedCenter.left = ($(window).width() - OPTIONS.pointSize) / 2;

		// absoluteNearElement ---------------------------------------------------------------- /

		elmBounds = this.$elm[0].getBoundingClientRect();
		appendToBounds = this.$parent[0].getBoundingClientRect();

		elmBounds = {
			width:  elmBounds.width,
			height: elmBounds.height,
			top:    elmBounds.top - appendToBounds.top,
			left:   elmBounds.left - appendToBounds.left,
			right:  appendToBounds.right - elmBounds.right,
			bottom: appendToBounds.bottom - elmBounds.bottom
		};

		getPointNearElementPosition.bind(this)(positions.absoluteNearElement, elmBounds);

		// fixedNearElement ------------------------------------------------------------------- /

		elmBounds = this.$elm[0].getBoundingClientRect();

		getPointNearElementPosition.bind(this)(positions.fixedNearElement, elmBounds);


		return positions;
	}

	// ==========================================================================

	function PulsTourTooltip(point) {
		this.point = point;
		this.$tooltip = $('<div class="puls-tour__tooltip">' + point.$elm.attr('puls-tour-message') + '</div>').appendTo(point.$point)
	}

	PulsTourTooltip.prototype.setPosition = function() {
		var tooltipWidth, tooltipHeight;
		var cssOptions = {};

		tooltipWidth    = this.$tooltip.outerWidth(true);
		tooltipHeight   = this.$tooltip.outerHeight(true);

		if (this.point.placement == 'left' || this.point.placement == 'right') {
			cssOptions.top = (OPTIONS.pointSize - tooltipHeight) / 2;
		} else if (this.point.placement == 'top' || this.point.placement == 'bottom') {
			cssOptions.left = (OPTIONS.pointSize - tooltipWidth) / 2;
		}

		if (this.point.placement == 'top') {
			cssOptions.bottom = '100%';
		} else if (this.point.placement == 'right') {
			cssOptions.left = '100%';
		} else if (this.point.placement == 'bottom') {
			cssOptions.top = '100%';
		} else if (this.point.placement == 'left') {
			cssOptions.right = '100%';
		}

		this.$tooltip.removeAttr('style').css(cssOptions);
	};

	PulsTourTooltip.prototype.show = function() {
		this.point.$point.addClass('puls-tour__point_tooltip-visible');
		this.setPosition();
	};

	// ==========================================================================

	function PulsTourPoint(id, $elm) {
		var point = this;

		this.$elm = $elm;
		this.placement = $elm.attr('puls-tour-placement');
		this.$parent = $elm.attr('puls-tour-parent') ? $($elm.attr('puls-tour-parent')) : $('body');
		this.$point = $('<div class="puls-tour__point"></div>').appendTo(this.$parent);
		this.tooltip = new PulsTourTooltip(this);
		this.statesPositions = getStatesPositions.bind(this)();

		$elm[0].pulsTourPoint = points[id];

		this.$point.on('click', function() {
			point.tooltip.show();
		});
	}

	PulsTourPoint.prototype.setPosition = function(step) {
		this.$point.removeAttr('style').css(this.statesPositions[STATES[step]]);
	};

	// ==========================================================================

	function PulsTour() {
		var self = this;
		var $elms = $('[puls-tour-message]');

		$elms.each(function() {
			var id = UTILS.getUniqueId();

			points[id] = new PulsTourPoint(id, $(this));
		});

		this.changeState(0);

		setTimeout(function() {
			self.changeState(1);

			setTimeout(function() {
				self.changeState(2);
			}, 350);
		}, 1000);
	}

	PulsTour.prototype.changeState = function(step) {
		for (var id in points) {
			points[id].setPosition(step);
		}
	};

	// ==========================================================================

	window.PulsTour = PulsTour;

})(window, jQuery);
