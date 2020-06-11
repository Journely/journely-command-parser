"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Commands_1 = __importDefault(require("./Commands"));
require("mocha");
var chai_1 = require("chai");
var lodash_1 = __importDefault(require("lodash"));
describe('Commands', function () {
    var Command = new Commands_1.default();
    describe('#parse()', function () {
        it('Parse should return an array', function () {
            var command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value" & zoom > gcal');
            chai_1.expect(command).to.be.an('array');
        });
        it('Parse data field should contain non-empty metadata', function () {
            var command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value"');
            chai_1.expect(lodash_1.default.get(command, '[0]data.metadata', null)).to.not.be.null;
        });
        it('Parse data field should be present', function () {
            var command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value"');
            chai_1.expect(lodash_1.default.get(command, '[0]data', null)).to.not.be.null;
        });
        it('Parse config should be present', function () {
            var command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value"');
            chai_1.expect(lodash_1.default.get(command, '[0]config', null)).to.not.be.null;
        });
        it('Parse data.object should be present', function () {
            var command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value"');
            chai_1.expect(lodash_1.default.get(command, '[0]data.object', null)).to.not.be.null;
        });
        it('Parse data.target should be present', function () {
            var command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value"');
            chai_1.expect(lodash_1.default.get(command, '[0]data.target', null)).to.not.be.null;
        });
        it('Parse data.field should be present', function () {
            var command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value"');
            chai_1.expect(lodash_1.default.get(command, '[0]data.field', null)).to.not.be.null;
        });
        it('Parse should return 2 entries', function () {
            var command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value" > gcal');
            chai_1.expect(command.length).to.eq(2);
        });
        it('Parse should return 3 entries', function () {
            var command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value" > gcal & zoom');
            chai_1.expect(command.length).to.eq(3);
        });
        it('Empty Object search should still return command', function () {
            var command = Command.parse('salesforce object:Opportunity:""');
            console.log(JSON.stringify(command, null, 2));
            chai_1.expect(lodash_1.default.get(command, '[0]data.target', null)).to.not.be.null;
        });
        it('Keyword synonyms should work', function () {
            var command;
            command = Command.parse('salesforce from:Opportunity:"Something":"New Something" where:NextStep:"Steps":"Value"');
            chai_1.expect(lodash_1.default.get(command, '[0]data', null)).to.not.be.null;
            command = Command.parse('salesforce in:Opportunity:"Something":"New Something" show:NextStep:"Steps":"Value"');
            chai_1.expect(lodash_1.default.get(command, '[0]data', null)).to.not.be.null;
        });
    });
});
