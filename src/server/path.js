const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Path extends ObjectClass {
  constructor(parentId, x, y, parentColor) {
    super(parentId, x, y);
    this.parentColor = parentColor;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      parentColor: this.parentColor,
    };
  }
}

module.exports = Path;
