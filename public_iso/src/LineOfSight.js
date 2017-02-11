define(["require", "exports"], function (require, exports) {
    "use strict";
    function fieldOfView(ox, oy, r, visit, blocked) {
        visit(ox, oy);
        function quadrant(dx, dy) {
            var light = new Light(r);
            for (var dr = 1; dr <= r; dr += 1) {
                for (var i = 0; i <= dr; i++) {
                    var cell = new Pt(dr - i, i), arc = light.hits(cell);
                    if (!arc) {
                        continue;
                    }
                    var ax = ox + cell.x * dx, ay = oy + cell.y * dy;
                    visit(ax, ay);
                    if (!blocked(ax, ay)) {
                        continue;
                    }
                    if (!light.shade(arc, cell)) {
                        return;
                    }
                }
            }
        }
        quadrant(-1, +1);
        quadrant(+1, +1);
        quadrant(-1, -1);
        quadrant(+1, -1);
    }
    exports.fieldOfView = fieldOfView;
    function Pt(x, y) { this.x = x; this.y = y; }
    Pt.prototype.toString = function () { return '(' + this.x + ',' + this.y + ')'; };
    Pt.prototype.copy = function () { return new Pt(this.x, this.y); };
    function Ln(p, q) { this.p = p; this.q = q; }
    Ln.prototype.toString = function () { return this.p + '-' + this.q; };
    Ln.prototype.copy = function () { return new Ln(this.p.copy(), this.q.copy()); };
    Ln.prototype.cw = function (pt) { return this.dtheta(pt) > 0; };
    Ln.prototype.ccw = function (pt) { return this.dtheta(pt) < 0; };
    Ln.prototype.dtheta = function (pt) {
        var theta = Math.atan2(this.q.y - this.p.y, this.q.x - this.p.x), other = Math.atan2(pt.y - this.p.y, pt.x - this.p.x), dt = other - theta;
        return ((dt > -Math.PI) ? dt : (dt + 2 * Math.PI)).toFixed(5);
    };
    function Arc(steep, shallow) {
        this.steep = steep;
        this.shallow = shallow;
        this.steepbumps = [];
        this.shallowbumps = [];
    }
    Arc.prototype.toString = function () {
        return '[' + this.steep + ' : ' + this.shallow + ']';
    };
    Arc.prototype.copy = function () {
        var c = new Arc(this.steep.copy(), this.shallow.copy());
        var i;
        for (i in this.steepbumps) {
            c.steepbumps.push(this.steepbumps[i].copy());
        }
        for (i in this.shallowbumps) {
            c.shallowbumps.push(this.shallowbumps[i].copy());
        }
        return c;
    };
    Arc.prototype.hits = function (pt) {
        return (this.steep.ccw(new Pt(pt.x + 1, pt.y)) &&
            this.shallow.cw(new Pt(pt.x, pt.y + 1)));
    };
    Arc.prototype.bumpCW = function (pt) {
        var sb = new Pt(pt.x + 1, pt.y);
        this.steepbumps.push(sb);
        this.steep.q = sb;
        for (var i in this.shallowbumps) {
            var b = this.shallowbumps[i];
            if (this.steep.cw(b)) {
                this.steep.p = b;
            }
        }
    };
    Arc.prototype.bumpCCW = function (pt) {
        var sb = new Pt(pt.x, pt.y + 1);
        this.shallowbumps.push(sb);
        this.shallow.q = sb;
        for (var i in this.steepbumps) {
            var b = this.steepbumps[i];
            if (this.shallow.ccw(b)) {
                this.shallow.p = b;
            }
        }
    };
    Arc.prototype.shade = function (pt) {
        var steepBlock = this.steep.cw(new Pt(pt.x, pt.y + 1)), shallowBlock = this.shallow.ccw(new Pt(pt.x + 1, pt.y));
        if (steepBlock && shallowBlock) {
            return [];
        }
        else if (steepBlock) {
            this.bumpCW(pt);
            return [this];
        }
        else if (shallowBlock) {
            this.bumpCCW(pt);
            return [this];
        }
        else {
            var a = this.copy(), b = this.copy();
            a.bumpCW(pt);
            b.bumpCCW(pt);
            return [a, b];
        }
    };
    function Light(radius) {
        var wide = new Arc(new Ln(new Pt(1, 0), new Pt(0, radius)), new Ln(new Pt(0, 1), new Pt(radius, 0)));
        this.arcs = [wide];
    }
    Light.prototype.hits = function (pt) {
        for (var i in this.arcs) {
            if (this.arcs[i].hits(pt)) {
                return { i: i };
            }
        }
        return false;
    };
    Light.prototype.shade = function (arci, pt) {
        var arc = this.arcs[arci.i], splice = this.arcs.splice;
        splice.apply(this.arcs, [arci.i, 1].concat(arc.shade(pt)));
        return this.arcs.length > 0;
    };
});
//# sourceMappingURL=LineOfSight.js.map