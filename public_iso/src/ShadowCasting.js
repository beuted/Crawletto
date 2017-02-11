define(["require", "exports"], function (require, exports) {
    "use strict";
    var LightSource = (function () {
        function LightSource(map) {
            this.position = null;
            this.radius = null;
            this.enlightedCells = [];
            this.map = map;
        }
        LightSource.prototype.calculate = function () {
            for (var i = 0; i < 8; i++) {
                this.calculateOctant(this.position.x, this.position.y, 1, 1.0, 0.0, this.radius, LightSource.mult[0][i], LightSource.mult[1][i], LightSource.mult[2][i], LightSource.mult[3][i], 0);
            }
            this.enlightedCells.push(this.position);
            return this.enlightedCells;
        };
        LightSource.prototype.update = function (position, radius) {
            if (position != this.position || radius != this.radius) {
                this.position = new Phaser.Point(position.x, position.y);
                this.radius = radius;
                this.enlightedCells = [];
                return this.calculate();
            }
            else {
                return this.enlightedCells;
            }
        };
        LightSource.prototype.calculateOctant = function (cx, cy, row, start, end, radius, xx, xy, yx, yy, id) {
            this.enlightedCells.push(new Phaser.Point(cx, cy));
            var new_start = 0;
            if (start < end)
                return;
            var radius_squared = radius * radius;
            for (var i = row; i < radius + 1; i++) {
                var dx = -i - 1;
                var dy = -i;
                var blocked = false;
                while (dx <= 0) {
                    dx += 1;
                    var X = cx + dx * xx + dy * xy;
                    var Y = cy + dx * yx + dy * yy;
                    if (X < this.map.plateauSize.x && X >= 0 && Y < this.map.plateauSize.y && Y >= 0) {
                        var l_slope = (dx - 0.5) / (dy + 0.5);
                        var r_slope = (dx + 0.5) / (dy - 0.5);
                        if (start < r_slope) {
                            continue;
                        }
                        else if (end > l_slope) {
                            break;
                        }
                        else {
                            if (dx * dx + dy * dy < radius_squared) {
                                this.enlightedCells.push(new Phaser.Point(X, Y));
                            }
                            if (blocked) {
                                if (this.map.isCellOpaque(new Phaser.Point(X, Y))) {
                                    new_start = r_slope;
                                    continue;
                                }
                                else {
                                    blocked = false;
                                    start = new_start;
                                }
                            }
                            else {
                                if (this.map.isCellOpaque(new Phaser.Point(X, Y)) && i < radius) {
                                    blocked = true;
                                    this.calculateOctant(cx, cy, i + 1, start, l_slope, radius, xx, xy, yx, yy, id + 1);
                                    new_start = r_slope;
                                }
                            }
                        }
                    }
                }
                if (blocked)
                    break;
            }
        };
        LightSource.mult = [
            [1, 0, 0, -1, -1, 0, 0, 1],
            [0, 1, -1, 0, 0, -1, 1, 0],
            [0, 1, 1, 0, 0, -1, -1, 0],
            [1, 0, 0, 1, -1, 0, 0, -1]
        ];
        return LightSource;
    }());
    exports.LightSource = LightSource;
});
//# sourceMappingURL=ShadowCasting.js.map