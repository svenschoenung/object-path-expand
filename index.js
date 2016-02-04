var util = require('util');
var objectPath = require('object-path');
var merge = require('merge');

function expand(obj) {
  if (!util.isObject(obj) ||
      util.isArray(obj) ||
      util.isRegExp(obj) ||
      util.isDate(obj)) {
    return obj;
  }

  var expandedObject = {};
  var expandedProperty;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      objectPath.set(expandedProperty = {}, prop, expand(obj[prop]))
      expandedObject = merge.recursive(expandedObject, expandedProperty);
    }
  }
  return expandedObject;
}

module.exports = expand;
