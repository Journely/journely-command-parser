import Commands from './Commands';
import 'mocha';
import { expect } from 'chai';
import _ from 'lodash';

describe('Commands', function () {
  const Command = new Commands();
  describe('#parse()', function () {
    it('Parse should return an array', function () {
      const command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value"');
      expect(command).to.be.an('array');
    });

    it('Parse data field should be present', function () {
      const command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value"');
      expect(_.get(command, '[0]data', null)).to.not.be.null;
    });

    it('Parse config should be present', function () {
      const command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value"');
      expect(_.get(command, '[0]config', null)).to.not.be.null;
    });

    it('Parse data.object should be present', function () {
      const command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value"');
      expect(_.get(command, '[0]data.object', null)).to.not.be.null;
    });

    it('Parse data.target should be present', function () {
      const command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value"');
      expect(_.get(command, '[0]data.target', null)).to.not.be.null;
    });

    it('Parse data.field should be present', function () {
      const command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value"');
      expect(_.get(command, '[0]data.field', null)).to.not.be.null;
    });

    it('Parse should return 2 entries', function () {
      const command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value" > gcal');
      expect(command.length).to.eq(2);
    });

    it('Parse should return 3 entries', function () {
      const command = Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value" > gcal & zoom');
      expect(command.length).to.eq(3);
    });
  });
});
