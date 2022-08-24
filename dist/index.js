"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rectangle_1 = __importDefault(require("./rectangle"));
const R1 = new rectangle_1.default({ x: 0, y: 0 }, { x: 10, y: 10 });
console.log(R1);
