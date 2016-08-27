// uses recursive shadowcasting to calculate lighting at specified position
// source: http://heyjavascript.com/field-of-view-in-javascript-using-recursive-shadow-casting/

/// <reference path="../typings/tsd.d.ts" />

import {Map} from "./Map";

export class LightSource {

    public position: Phaser.Point = null;
    public radius: number = null;
    public map: Map;

    // Cache for the result of calculate()
    private enlightedCells: Phaser.Point[] = [];

    // multipliers for transforming coordinates into other octants.
    private static mult: number[][] = [
        [1, 0, 0, -1, -1, 0, 0, 1],
        [0, 1, -1, 0, 0, -1, 1, 0],
        [0, 1, 1, 0, 0, -1, -1, 0],
        [1, 0, 0, 1, -1, 0, 0, -1]
    ];

    constructor(map: Map) {
        this.map = map;
    }

    /// sets flag lit to true on all tiles within radius of position specified
    private calculate() {
        for (var i = 0; i < 8; i++) {
            this.calculateOctant(this.position.x, this.position.y, 1, 1.0, 0.0, this.radius,
                LightSource.mult[0][i], LightSource.mult[1][i], LightSource.mult[2][i], LightSource.mult[3][i], 0);
        }

        this.enlightedCells.push(this.position);

        return this.enlightedCells;
    }

    /// update the position of the light source
    public update(position: Phaser.Point, radius: number) {
        if (position != this.position || radius != this.radius) {
            this.position = new Phaser.Point(position.x, position.y);
            this.radius = radius;
            this.enlightedCells = [];
            return this.calculate();
        } else {
            return this.enlightedCells;
        }
    }

    /// calculates an octant. Called by the this.calculate when calculating lighting
    private calculateOctant(cx, cy, row, start, end, radius, xx, xy, yx, yy, id) {
        this.enlightedCells.push(new Phaser.Point(cx, cy));

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

                if (X < this.map.plateauSize.x && X >= 0 && Y < this.map.plateauSize.y && Y >= 0) {

                    var l_slope = (dx - 0.5) / (dy + 0.5);
                    var r_slope = (dx + 0.5) / (dy - 0.5);

                    if (start < r_slope) {
                        continue;
                    } else if (end > l_slope) {
                        break;
                    } else {
                        if (dx * dx + dy * dy < radius_squared) {
                            this.enlightedCells.push(new Phaser.Point(X, Y));
                        }

                        if (blocked) {
                            if (this.map.isCaseOpaque(new Phaser.Point(X, Y))) {
                                new_start = r_slope;
                                continue;
                            } else {
                                blocked = false;
                                start = new_start;
                            }
                        } else {
                            // TODO: if it block sight
                            if (this.map.isCaseOpaque(new Phaser.Point(X, Y)) && i < radius) {
                                blocked = true;
                                this.calculateOctant(cx, cy, i + 1, start, l_slope, radius, xx, xy, yx, yy, id + 1);

                                new_start = r_slope;
                            }
                        }
                    }
                }
            }

            if (blocked) break;
        }
    }
}
