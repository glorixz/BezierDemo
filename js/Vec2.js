/**
 * Vec2 is a set of functions that perform standard operations
 * on 2D vectors - (x, y), which are stored as 2-element arrays.
 * Provided by Alla Sheffer
 */

function Vec2 (x, y) {

    this.x = 0.0;
    this.y = 0.0;

    if (arguments.length >= 1) this.x = x;
    if (arguments.length >= 2) this.y = y;

    /** ---------------------------------------------------------------------
     *  A new 2D vector that has the same values as the input argument
     */
    this.createFrom = function (from) {
        this.x = from.x;
        this.y = from.y;
    };

    /** ---------------------------------------------------------------------
     * Copy a 2D vector into another 2D vector
     * @param to Vec2 A 2D vector that you want changed
     */
    this.clone = function (to) {
        to.x = this.x;
        to.y = this.y;
    };

    /** ---------------------------------------------------------------------
     * Set the components of a 2D vector
     * @param x Number The change in x of the vector
     * @param y Number The change in y of the vector
     */
    this.set = function (x, y) {
        this.x = x;
        this.y = y;
    };

    /** ---------------------------------------------------------------------
     * Calculate the length of a vector
     * @return Number The length of a vector
     */
    this.norm = function () {
        return Math.sqrt(dot(this, this));
    };

    /** ---------------------------------------------------------------------
     * Make a vector have a length of 1
     * @return Vec2 The input vector normalized to unit length. Or null if the vector is zero length
     */
    this.normalize = function () {

        let length = this.len(v);
        if (Math.abs(length) < 0.0000001) {
            return null; // Invalid vector
        }

        var new_x = this.x / percent;
        var new_y = this.y / percent;

        var new_vector = new Vec2(new_x, new_y);
        return new_vector;
    };

	/** ---------------------------------------------------------------------
     * Scale a vector:  result = s * v0
     * @param s Number A scale factor
     * @return Vec2 The result
     */
    this.scale = function (s) {
        var new_x = this.x * s;
        var new_y = this.y * s;

        var new_vector = new Vec2(new_x, new_y);
        return new_vector;
    };

    /** ---------------------------------------------------------------------
     * Determine if 2 vectors are equal
     * @param v1 Float32Array A 2D vector
     * @return Boolean if 2 vectors are equal
     */
    this.equal = function (v1) {
        var is_equal = (this.x == v1.x && this.y == v1.y);
        return is_equal;
    };

    /** ---------------------------------------------------------------------
     * Print a vector on the console
     * @param name String A description of the vector to be printed
     * @param v Float32Array A 2D vector
     */
    this.printVector = function () {
        var maximum, order, digits;

        maximum = Math.max(this.x, this.y);
        order = Math.floor(Math.log(maximum) / Math.LN10 + 0.000000001);
        digits = (order <= 0) ? 5 : (order > 5) ? 0 : (5 - order);

        console.log("Vec2: " + this.x.toFixed(digits) + " "
                                 + this.y.toFixed(digits));
    };
}


/** ---------------------------------------------------------------------
 * Add two vectors:  result = v0 + v1
 * @param v1 Vec2 A 2D vector
 * @return Vec2 The result of adding v and v1
 */
function sum(v1, v2) {
    var new_x = v2.x + v1.x;
    var new_y = v2.y + v1.y;

    var new_vector = new Vec2(new_x, new_y);
    return new_vector;
};

 /** ---------------------------------------------------------------------
     * Calculate the dot product of 2 vectors
     * @return Number The result of the dot product
     */
function dot (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};

/** ---------------------------------------------------------------------
 * Subtract two vectors:  result = v0 - v1
 * @param v1 Vec2 A 2D vector
 * @return Vec2 The result of subtracting v1 from v0
 */
function minus(v1, v2) {
    var new_x = v1.x - v2.x;
    var new_y = v1.y - v2.y;

    var new_vector = new Vec2(new_x, new_y);
    return new_vector;
};