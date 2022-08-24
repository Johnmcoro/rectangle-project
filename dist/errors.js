"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * InvalidRectangleError is thrown if a Rectangle is instantiated
 * with an invalid pair of cartesian coordinates.
 */
class InvalidRectangleError extends Error {
    constructor(bl, tr) {
        const message = `Error attempting to instantiate Rectangle. The provided pair of 
        coordinates ${bl}, ${tr} do not represent a valid rectangle. `;
        super(message);
    }
}
exports.default = InvalidRectangleError;
