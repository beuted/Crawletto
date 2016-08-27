// uses recursive shadowcasting to calculate lighting at specified position
// source: http://heyjavascript.com/field-of-view-in-javascript-using-recursive-shadow-casting/

/// <reference path="../typings/tsd.d.ts" />

import {Map} from "./Map";

export function LightSource(position: Phaser.Point, radius: number, map: Map) {
    this.position = position;
    this.radius = radius;

    // multipliers for transforming coordinates into other octants.
    this.mult = [
        [1, 0, 0, -1, -1, 0, 0, 1],
        [0, 1, -1, 0, 0, -1, 1, 0],
        [0, 1, 1, 0, 0, -1, -1, 0],
        [1, 0, 0, 1, -1, 0, 0, -1]
    ];

    // calculates an octant. Called by the this.calculate when calculating lighting
    this.calculateOctant = function(cx, cy, row, start, end, radius, xx, xy, yx, yy, id, enlight) {
        enlight(new Phaser.Point(cx, cy));

        var new_start = 0;

        if (start < end) return;

        var radius_squared = radius * radius;

        for (var i = row; i < radius + 1; i++) {
            var dx = -i - 1;
            var dy = -i;

            var blocked = false;

            while (dx <= 0) {

                dx += 1;

                var X = cx + dx * xx + dy * xy;
                var Y = cy + dx * yx + dy * yy;

                if (X < map.plateauSize.x && X >= 0 && Y < map.plateauSize.y && Y >= 0) {

                    var l_slope = (dx - 0.5) / (dy + 0.5);
                    var r_slope = (dx + 0.5) / (dy - 0.5);

                    if (start < r_slope) {
                        continue;
                    } else if (end > l_slope) {
                        break;
                    } else {
                        if (dx * dx + dy * dy < radius_squared) {
                            enlight(new Phaser.Point(X, Y));
                        }

                        if (blocked) {
                            if (map.isCaseOpaque(new Phaser.Point(X, Y))) {
                                new_start = r_slope;
                                continue;
                            } else {
                                blocked = false;
                                start = new_start;
                            }
                        } else {
                            // TODO: if it block sight
                            if (map.isCaseOpaque(new Phaser.Point(X, Y)) && i < radius) {
                                blocked = true;
                                this.calculateOctant(cx, cy, i + 1, start, l_slope, radius, xx, xy, yx, yy, id + 1, enlight);

                                new_start = r_slope;
                            }
                        }
                    }
                }
            }

            if (blocked) break;
        }
    }

    // sets flag lit to true on all tiles within radius of position specified
    this.calculate = function(enlight: (position: Phaser.Point) => void) {
        for (var i = 0; i < 8; i++) {
            this.calculateOctant(this.position.x, this.position.y, 1, 1.0, 0.0, this.radius,
                this.mult[0][i], this.mult[1][i], this.mult[2][i], this.mult[3][i], 0, enlight);
        }

        enlight(position);
    }

    // update the position of the light source
    this.update = function(position: Phaser.Point, enlight: (position: Phaser.Point) => void) {
        this.position = position;
        this.calculate(enlight);
    }
}
