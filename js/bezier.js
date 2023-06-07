/**
 * Bezier is a set of functions that create bezier curve on canvas.
 * Code skeleton provided by Alla Sheffer.
 */

function Bezier () {

    this.control_points = [];

    this.curve_mode = "Basic";
    this.continuity_mode = "C0";
    this.subdivide_level = 0;
    this.piecewise_degree = 1;
    this.samples = 20;

    /** ---------------------------------------------------------------------
     * Evaluate the Bezier curve at the given t parameter
     * @param t Given t parameter
     * @return Vec2 The location of point at given t parameter
     */
    this.evaluate = function (t) {
        if (t >= 0.0 && t <= 1.000005 && this.control_points.length > 1) {
            if (t == 0) {
                return this.control_points[0];
            }

            let m = this.control_points.length - 1;

            let result = new Vec2(0,0);

            for (let i = 0; i < this.control_points.length; i++) {
                let basis = this.nChooseK(m, i) * Math.pow(t, i) * Math.pow(1-t, m-i);
                result = sum(result, this.control_points[i].scale(basis));
            }

            return result;
        }
    };

    /** ---------------------------------------------------------------------
     * Subdivide this Bezier curve into two curves
     * Place the new control points into curve1 and curve2.
     * @param curve1 The first curve
     * @param curve2 The second curve
     */
    this.subdivide = function (curve1, curve2) {
        let final_points_left = [];
        let final_points_right = [];

        let points = this.control_points;
        let lineCount = this.control_points.length - 1;
        while (lineCount > 0) {
            final_points_left.push(points[0]);
            final_points_right.unshift(points[points.length-1]); // append to left

            // new points obtained via interpolation
            let new_points = [];
            for (let i=1; i<=lineCount; i++) {
                let interp = sum(points[i-1], points[i]).scale(0.5);
                new_points.push(interp);
            }
            
            points = new_points
            lineCount--;
        }

        // after while-loop exits, points should contain only the midpoint.
        curve1.setControlPoints(final_points_left.concat(points));
        curve2.setControlPoints(points.concat(final_points_right));
    };


    /** ---------------------------------------------------------------------
     * Draw this Bezier curve
     */
    this.drawCurve = function () {
        if (this.control_points.length >= 2) {
            if (this.curve_mode == "Basic") {
                // Basic Mode
                //
                // Create a Bezier curve from the entire set of control points,
                // and then simply draw it to the screen

                // Do this by evaluating the curve at some finite number of t-values,
                // and drawing line segments between those points.
                // You may use the this.drawLine() function to do the actual
                // drawing of line segments.

                let samp_dist = 1/(this.samples-1)
                let p_prev = this.evaluate(0);
                for (let t = samp_dist; t<=1.000005; t+= samp_dist) {
                    let p = this.evaluate(t);
                    this.drawLine(p_prev, p);
                    p_prev = p;
                }

            }
            else if (this.curve_mode == "Subdivision") {
                // Subdivision mode
                //
                // Create a Bezier curve from the entire set of points,
                // then subdivide it the number of times indicated by the
                // this.subdivide_level variable.
                // The control polygons of the subdivided curves will converge
                // to the actual bezier curve, so we only need to draw their
                // control polygons.

                // base case
                if (this.subdivide_level == 0) {
                    this.drawControlPolygon();
                } else {
                    let curve1 = new Bezier();
                    let curve2 = new Bezier();
                    curve1.setCurveMode("Subdivision");
                    curve2.setCurveMode("Subdivision");
                    curve1.setSubdivisionLevel(this.subdivide_level - 1);
                    curve2.setSubdivisionLevel(this.subdivide_level - 1);
                    curve1.setGL(gl_operation);
                    curve2.setGL(gl_operation);
                    this.subdivide(curve1, curve2);
                    
                    curve1.drawCurve();
                    curve2.drawCurve();
                }
            }
            else if (this.curve_mode == "Piecewise") {
                let ptsPerCurve = this.piecewise_degree + 1;

                if (this.continuity_mode == "C0")
                {
                    // C0 continuity
                    //
                    // Each piecewise curve should be C0 continuous with adjacent
                    // curves, meaning they should share an endpoint.

                    // draw a number of curves equal to Math.ceil((control_points.length-1)/this.piecewise_degree)
                    let currPoints = []
                    for (let i=0; i < this.control_points.length; i++) {
                        currPoints.push(this.control_points[i]);

                        if (currPoints.length == ptsPerCurve || i == this.control_points.length-1) {
                            let piecewiseCurve = new Bezier();
                            piecewiseCurve.setCurveMode("Basic");
                            piecewiseCurve.setSamples(this.samples);
                            piecewiseCurve.setGL(gl_operation);
                            piecewiseCurve.setControlPoints(currPoints);
                            piecewiseCurve.drawCurve();
                            
                            // C0 continuity:
                            // Begin new curve with last point of the previous curve.
                            currPoints = [this.control_points[i]];
                        }
                    }
                }
                else if (this.continuity_mode == "C1")
                {
                    // C1 continuity
                    //
                    // Each piecewise curve should be C1 continuous with adjacent
                    // curves. This means that not only must they share an endpoint,
                    // they must also have the same tangent at that endpoint.
                    // Add additional control points to enforce the C1 property.

                    // C1 continuity: at every splice point, surround the point with
                    // two points, with each point being at the halfway point on the 
                    // control polygon lines to the left and right of the splice point.
                    
                    let currPoints = []
                    for (let i=0; i < this.control_points.length; i++) {
                        if (i == this.control_points.length-1) {
                            // reached the last point
                            currPoints.push(this.control_points[i]);
                            let curve = new Bezier();
                            curve.setCurveMode("Basic");
                            curve.setSamples(this.samples);
                            curve.setGL(gl_operation);

                            curve.setControlPoints(currPoints);
                            curve.drawCurve();
                        } else if (currPoints.length != ptsPerCurve - 1) {
                            // not the last point; not a splice point
                            // add points until we reach a splice point
                            currPoints.push(this.control_points[i]);
                        } else if (i != this.control_points.length - 1) {
                            // i is a splice point
                            // generate new points
                            let newPt1 = sum(this.control_points[i-1], this.control_points[i]).scale(0.5);
                            let newPt2 = sum(this.control_points[i], this.control_points[i+1]).scale(0.5);
                            let c1Pts = [newPt1, this.control_points[i], newPt2];

                            // draw the curve to the left of the splice
                            currPoints.push(newPt1);
                            let curve = new Bezier();
                            curve.setCurveMode("Basic");
                            curve.setSamples(this.samples);
                            curve.setGL(gl_operation);
                            curve.setControlPoints(currPoints);
                            curve.drawCurve();

                            // draw the splice curve
                            let spliceCurve = new Bezier();
                            spliceCurve.setCurveMode("Basic");
                            spliceCurve.setSamples(this.samples);
                            spliceCurve.setGL(gl_operation);
                            spliceCurve.setControlPoints(c1Pts);
                            spliceCurve.drawCurve();

                            currPoints = [newPt2];
                        }
                    }
                }
            }
        }
    };


    /** ---------------------------------------------------------------------
     * Draw line segment between point p1 and p2
     */
    this.drawLine = function (p1, p2) {
        this.gl_operation.drawLine(p1, p2);
    };


    /** ---------------------------------------------------------------------
     * Draw control polygon
     */
    this.drawControlPolygon = function () {
        if (this.control_points.length >= 2) {
            for (var i = 0; i < this.control_points.length - 1; i++) {
                this.drawLine(this.control_points[i], this.control_points[i + 1]);
            }
        }
    };

    /** ---------------------------------------------------------------------
     * Draw control points
     */
    this.drawControlPoints = function () {
        this.gl_operation.drawPoints(this.control_points);
    };


    /** ---------------------------------------------------------------------
     * Drawing setup
     */
    this.drawSetup = function () {
        this.gl_operation.drawSetup();
    };


    /** ---------------------------------------------------------------------
     * Compute nCk ("n choose k")
     * WARNING:: Vulnerable to overflow when n is very large!
     */
    this.nChooseK = function (n, k) {
        var result = -1;

        if (k >= 0 && n >= k) {
            result = 1;
            for (var i = 1; i <= k; i++) {
                result *= n - (k - i);
                result /= i;
            }
        }

        return result;
    };


    /** ---------------------------------------------------------------------
     * Setters - set value
     */
    this.setControlPoints = function(points) {
        this.control_points = points;
    }

    this.setGL = function (gl_operation) {
        this.gl_operation = gl_operation;
    };

    this.setCurveMode = function (curveMode) {
        this.curve_mode = curveMode;
    };

    this.setContinuityMode = function (continuityMode) {
        this.continuity_mode = continuityMode;
    };

    this.setSubdivisionLevel = function (subdivisionLevel) {
        this.subdivide_level = subdivisionLevel;
    };

    this.setPiecewiseDegree = function (piecewiseDegree) {
        this.piecewise_degree = piecewiseDegree;
    };

    this.setSamples = function (piecewiseDegree) {
        this.samples = piecewiseDegree;
    };

    /** ---------------------------------------------------------------------
     * Getters - get value
     */
    this.getCurveMode = function () {
        return this.curve_mode;
    };

    this.getContinuityMode = function () {
        return this.continuity_mode;
    };

    this.getSubdivisionLevel = function () {
        return this.subdivide_level;
    };

    this.getPiecewiseDegree = function () {
        return this.piecewise_degree;
    };

    /** ---------------------------------------------------------------------
     * @return Array A list of control points
     */
    this.getControlPoints = function () {
        return this.control_points;
    };


    /** ---------------------------------------------------------------------
     * @return Vec2 chosen point
     */
    this.getControlPoint = function (idx) {
        return this.control_points[idx];
    };

    /** ---------------------------------------------------------------------
     * Add a new control point
     * @param new_point Vec2 A 2D vector that is added to control points
     */
    this.addControlPoint = function (new_point) {
        this.control_points.push(new_point);
    };

    /** ---------------------------------------------------------------------
     * Remove a control point
     * @param point Vec2 A 2D vector that is needed to be removed from control points
     */
    this.removeControlPoint = function (point) {
        var pos =  this.points.indexOf(point);
        this.control_points.splice(pos, 1);
    };

    /** ---------------------------------------------------------------------
     * Remove all control points
     */
    this.clearControlPoints = function() {
        this.control_points = [];
    };

    /** ---------------------------------------------------------------------
     * Print all control points
     */
    this.printControlPoints = function() {
        this.control_points.forEach(element => {
            element.printVector();
        });
    };
}
