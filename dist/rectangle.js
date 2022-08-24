"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __importDefault(require("./errors"));
/**
 * Rectangle is represented as a pair of cartesian coordinate tuples
 * reprenting bottom left corner and top right corner.
 */
class Rectangle {
    constructor(bottomLeft, topRight) {
        if (this.isValidRectangle(bottomLeft, topRight)) {
            this.bottomLeft = bottomLeft;
            this.topRight = topRight;
            this.topLeft = this.getTopLeft(bottomLeft, topRight);
            this.bottomRight = this.getBottomRight(bottomLeft, topRight);
        }
        else {
            throw new errors_1.default(bottomLeft, topRight);
        }
    }
    isValidRectangle(bl, tr) {
        return bl.x < tr.x && bl.y < tr.y;
    }
    getTopLeft(bl, tr) {
        return { x: bl.x, y: tr.y };
    }
    getBottomRight(bl, tr) {
        return { x: tr.x, y: bl.x };
    }
    Intersection(r1, r2) {
        return false;
    }
    Containment(r1, r2) {
        return false;
    }
    Adjacent(r1, r2) {
        return false;
    }
}
exports.default = Rectangle;
