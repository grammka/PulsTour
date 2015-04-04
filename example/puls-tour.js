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
	
	function getPointNearElementPosition(options, elmBounds) {
		if (this.placement == 'left' || this.placement == 'right') {
			options.top = elmBounds.top + (elmBounds.height - OPTIONS.pointSize) / 2;
		} else if (this.placement == 'top' || this.placement == 'bottom') {
			options.left = elmBounds.left + (elmBounds.width - OPTIONS.pointSize) / 2;
		}

		if (this.placement == 'top') {
			options.top = elmBounds.top - OPTIONS.pointSize / 2;
		} else if (this.placement == 'right') {
			options.left = elmBounds.left + elmBounds.width - OPTIONS.pointSize / 2;
		} else if (this.placement == 'bottom') {
			options.bottom = elmBounds.top + elmBounds.height - OPTIONS.pointSize / 2;
		} else if (this.placement == 'left') {
			options.left = elmBounds.left - OPTIONS.pointSize / 2;
		}
	}

	function getStatesPositions() {
		var elmBounds,
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

		if (this.$parent) {
			var appendToBounds = this.$parent[0].getBoundingClientRect();

			elmBounds = {
				width:  elmBounds.width,
				height: elmBounds.height,
				top:    elmBounds.top - appendToBounds.top,
				left:   elmBounds.left - appendToBounds.left,
				right:  appendToBounds.right - elmBounds.right,
				bottom: appendToBounds.bottom - elmBounds.bottom
			};
		}

		getPointNearElementPosition.bind(this)(positions.absoluteNearElement, elmBounds);

		// fixedNearElement ------------------------------------------------------------------- /

		if (this.$parent) {
			elmBounds = this.$elm[0].getBoundingClientRect();

			getPointNearElementPosition.bind(this)(positions.fixedNearElement, elmBounds);
		} else {
			positions.fixedNearElement.top = positions.absoluteNearElement.top;
			positions.fixedNearElement.left = positions.absoluteNearElement.left;
		}


		return positions;
	}

	function PulsTourPoint(id, $elm) {
		this.point = points[id];
		this.$elm = $elm;
		this.placement = $elm.attr('puls-tour-placement');
		this.message = $elm.attr('puls-tour-message');
		this.$parent = $elm.attr('puls-tour-parent') ? $($elm.attr('puls-tour-parent')) : null;
		this.statesPositions = getStatesPositions.bind(this)();

		$elm[0].pulsTourPoint = this.point = points[id];

		this.draw();
	}

	PulsTourPoint.prototype.draw = function() {
		this.$point = $('<div class="puls-tour__point"></div>').appendTo(this.$parent || $('body'));
	};

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
