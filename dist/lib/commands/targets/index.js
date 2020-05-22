"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var salesforce_json_1 = __importDefault(require("./salesforce.json"));
var zoom_json_1 = __importDefault(require("./zoom.json"));
var gcal_json_1 = __importDefault(require("./gcal.json"));
exports.default = { salesforce: salesforce_json_1.default, zoom: zoom_json_1.default, gcal: gcal_json_1.default };
