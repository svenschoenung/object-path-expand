'use strict';
var expect = require('chai').expect;
var expand = require('./index.js');

describe('expand', function() {
  it('should do nothing for non-objects', function() {
    var fn = function() { };
    var date = new Date();
    expect(expand(fn)).to.eql(fn);
    expect(expand(null)).to.eql(null);
    expect(expand([])).to.eql([]);
    expect(expand("str")).to.eql("str");
    expect(expand(42)).to.eql(42);
    expect(expand(/regexp/)).to.eql(/regexp/);
    expect(expand(date)).to.eql(date);
  });
  it('should do nothing for an empty object', function() {
    expect(expand({})).to.eql({});
  });
  it('should do nothing for objects without deep paths', function() {
    var object = { 'foo' : 42, 'bar': null };
    var expandedObject = { 'foo' : 42, 'bar': null };
    expect(expand(object)).to.eql(expandedObject);
  });
  it('should expand deep paths for properties', function() {
    var object = { 'foo.bar' : 42 };
    var expandedObject = { 'foo' : { 'bar': 42 } };
    expect(expand(object)).to.eql(expandedObject);
  });
  it('should expand deep paths for array elements', function() {
    var arr = (n,o) => { var a = []; a[n] = o; return a };
    var object = { 'foo.2.bar' : 42 };
    var expandedObject = { 'foo' : arr(2, { 'bar': 42 }) };
    expect(expand(object)).to.eql(expandedObject);
  });
  it('should expand paths for properties of the same object to the same object', function() {
    var object = { 'foo.bar' : 42, 'foo.quux' : 23 };
    var expandedObject = { 'foo' : { 'bar': 42, 'quux': 23 } };
    expect(expand(object)).to.eql(expandedObject);
  });
  it('should merge objects where possible instead of overwriting them', function() {
    var object1 = { 'foo' : { 'bar': 42 }, 'foo.quux' : 23 };
    var object2 = { 'foo.quux' : 23, 'foo' : { 'bar': 42 } };
    var expandedObject = { 'foo' : { 'bar': 42, 'quux': 23 } };
    expect(expand(object1)).to.eql(expandedObject);
    expect(expand(object2)).to.eql(expandedObject);
  });
  it('has undefined behaviour when paths specify the same property', function() {
    var object = { 'foo.bar' : { 'quux': 42 }, 'foo' : { 'bar.quux': 23 } };
    var expandedObject1 = { 'foo' : { 'bar': { 'quux': 42 } } };
    var expandedObject2 = { 'foo' : { 'bar': { 'quux': 23 } } };
    expect([expandedObject1, expandedObject2]).to.include(expand(object));
  });
  it('has undefined behaviour when objects cannot be sensibly merged', function() {
    var object1 = { 'foo' : [ 'a', 'b' ], 'foo.bar' : 23 };
    var object2 = { 'foo.bar' : 23, 'foo' : [ 'a', 'b' ] };
    var expandedObject1 = { 'foo' : { '0': 'a', '1': 'b', 'bar': 23 } };
    var expandedObject2 = { 'foo' : { 'bar': 23 } };
    expect([expandedObject1, expandedObject2]).to.include(expand(object1));
    expect([expandedObject1, expandedObject2]).to.include(expand(object2));
  });
});
