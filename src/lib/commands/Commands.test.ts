import Commands from './Commands';
import 'mocha';
import { expect } from 'chai';

describe('Commands', function () {
  describe('#parse()', function () {
    it('Parse should return an array', function () {
      const Command = new Commands();
      expect(Command.parse('salesforce object:Opportunity:"Something":"New Something" field:NextStep:"Steps":"Value" > gcal')).to.be.an('array');
      // expect(Command.parse('1')).to.be.an('array');
    });
  });
});
