const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Path extends ObjectClass {
  constructor(parentID, x, y, t) {
    super(parentID, x, y, t);
  }
}

module.exports = Path;
