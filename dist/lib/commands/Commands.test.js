"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Commands_1 = __importDefault(require("./Commands"));
require("mocha");
var chai_1 = require("chai");
describe('Commands', function () {
    describe('#parse()', function () {
        it('Parse should return an array', function () {
            var Command = new Commands_1.default();
            chai_1.expect(Command.parse('salesforce opportunity:"Something"')).to.be.an('array');
        });
    });
});
