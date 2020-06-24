'use strict';
(function(factory) {
	if(typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function(Highcharts) {
	(function(H) {
		H.wrap(H.seriesTypes.column.prototype, 'translate', function(proceed) {
			var options = this.options;
			var topMargin = options.topMargin || 0;
			var bottomMargin = options.bottomMargin || 0;

			proceed.call(this);

			H.each(this.points, function(point) {
				if(options.borderRadiusTopLeft || options.borderRadiusTopRight || options.borderRadiusBottomRight || options.borderRadiusBottomLeft) {
					var w = point.shapeArgs.width;
					var h = point.shapeArgs.height;
					var x = point.shapeArgs.x;
					var y = point.shapeArgs.y;

					var radiusTopLeft = H.relativeLength(options.borderRadiusTopLeft || 0, w);
					var radiusTopRight = H.relativeLength(options.borderRadiusTopRight || 0, w);
					var radiusBottomRight = H.relativeLength(options.borderRadiusBottomRight || 0, w);
					var radiusBottomLeft = H.relativeLength(options.borderRadiusBottomLeft || 0, w);

					var maxR = Math.min(w, h) / 2

					radiusTopLeft = radiusTopLeft > maxR ? maxR : radiusTopLeft;
					radiusTopRight = radiusTopRight > maxR ? maxR : radiusTopRight;
					radiusBottomRight = radiusBottomRight > maxR ? maxR : radiusBottomRight;
					radiusBottomLeft = radiusBottomLeft > maxR ? maxR : radiusBottomLeft;

					
          if (options.stacking === "percent") {
            if(point.series.groupedData) {
              if(point.stackY != 100) {
                radiusTopLeft = 0;
                radiusTopRight = 0;
              }
              if(Math.round(point.total * (point.stackY / 100)) != point.y) {
                radiusBottomLeft = 0;
                radiusBottomRight = 0;
              }
            }

            if (point.series.stackKey && point.stackY !== 100) {
              radiusTopLeft = 0;
              radiusTopRight = 0;
            }

            if ((point.series.stackKey) && point.stackY && point.percentage && (point.stackY.toFixed(4) !== point.percentage.toFixed(4))) {
              radiusBottomLeft = 0;
              radiusBottomRight = 0;
            }
          } else if (options.stacking === "normal") {
            if (point.stackY !== point.stackTotal) {
              radiusTopLeft = 0;
              radiusTopRight = 0;
            }
            if (point.stackY !== 0) {
              radiusBottomLeft = 0;
              radiusBottomRight = 0;
            }
          }

					point.dlBox = point.shapeArgs;

					point.shapeType = 'path';
					point.shapeArgs = {
						d: [
							'M', x + radiusTopLeft, y + topMargin,
							'L', x + w - radiusTopRight, y + topMargin,
							'C', x + w - radiusTopRight / 2, y, x + w, y + radiusTopRight / 2, x + w, y + radiusTopRight,
							'L', x + w, y + h - radiusBottomRight,
							'C', x + w, y + h - radiusBottomRight / 2, x + w - radiusBottomRight / 2, y + h, x + w - radiusBottomRight, y + h + bottomMargin,
							'L', x + radiusBottomLeft, y + h + bottomMargin,
							'C', x + radiusBottomLeft / 2, y + h, x, y + h - radiusBottomLeft / 2, x, y + h - radiusBottomLeft,
							'L', x, y + radiusTopLeft,
							'C', x, y + radiusTopLeft / 2, x + radiusTopLeft / 2, y, x + radiusTopLeft, y,
							'Z'
						]
					};
				}

			});
		});
	}(Highcharts));
}));
