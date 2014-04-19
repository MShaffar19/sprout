!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sprout=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy;

function assoc(obj, k, value) {
  if (obj[k] === value) return obj;
  var o = copy(obj);
  o[k] = value;
  return o;
}

module.exports = assoc;
},{"./util":11}],2:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy,
    getIn = _dereq_('./getIn');

function assocIn(obj, keys, value) {
  if (getIn(obj, keys) === value) return obj;
  var k = keys[0],
      ks = keys.slice(1),
      o = copy(obj);
  if (ks.length) {
    o[k] = (k in o) ? assocIn(o[k], ks, value) : assocIn({}, ks, value);
  } else {
    o[k] = value;
  }
  return o;
}

module.exports = assocIn;
},{"./getIn":8,"./util":11}],3:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy,
    objectKeys = _dereq_('./util').objectKeys,
    isArrayOrObject = _dereq_('./util').isArrayOrObject,
    getIn = _dereq_('./getIn');

function assocObj(obj, obj2) {
  var keys = objectKeys(obj2),
      n = keys.length,
      i = -1,
      o, o2, k;
  if (!n) return obj;
  o = copy(obj);
  while (++i < n) {
    k = keys[i];
    o2 = obj2[k];
    if (isArrayOrObject(o2)) {
      o[k] = (k in o) ? assocObj(o[k], o2) : assocObj({}, o2);
    } else {
      o[k] = o2;
    }
  }
  return o;
}

module.exports = assocObj;
},{"./getIn":8,"./util":11}],4:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy;

function dissoc(obj, k) {
  if(!(k in obj)) return obj;
  var o = copy(obj);
  delete o[k];
  return o;
}

module.exports = dissoc;
},{"./util":11}],5:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy,
    objectKeys = _dereq_('./util').objectKeys;

function dissocIn(obj, keys) {
  var k = keys[0],
      ks = keys.slice(1),
      o = copy(obj);
  if (ks.length) {
    o[k] = dissocIn(obj[k], ks);
    if (!objectKeys(o[k]).length) delete o[k];
  } else {
    delete o[k];
  }
  return o;
}

module.exports = dissocIn;
},{"./util":11}],6:[function(_dereq_,module,exports){
var dissoc = _dereq_('./dissoc'),
    objectKeys = _dereq_('./util').objectKeys,
    isArrayOrObject = _dereq_('./util').isArrayOrObject,
    copy = _dereq_('./util').copy;

function dissocObj(obj, obj2) {
  var keys = objectKeys(obj2),
      n = keys.length,
      i = -1,
      o, o2, k;
  if (!n) return obj;
  o = copy(obj);
  while(++i < n) {
    k = keys[i];
    o2 = obj2[k];
    if (isArrayOrObject(o2)) {
      o[k] = dissocObj(obj[k], o2);
      if (!objectKeys(o[k]).length) delete o[k];
    } else {
      delete o[k];
    }
  }
  return o;
}

module.exports = dissocObj;
},{"./dissoc":4,"./util":11}],7:[function(_dereq_,module,exports){
var isUndefined = _dereq_('./util').isUndefined;

function get(obj, k, orValue) {
  if (!(k in obj)) return isUndefined(orValue) ? void 0 : orValue;
  return obj[k];
}

module.exports = get;
},{"./util":11}],8:[function(_dereq_,module,exports){
var isUndefined = _dereq_('./util').isUndefined;

// Get value from a nested structure or null.
function getIn(obj, keys, orValue) {
  var k = keys[0],
      ks = keys.slice(1);
  if (!obj.hasOwnProperty(k)) return isUndefined(orValue) ? void 0 : orValue;
  return ks.length ? getIn(obj[k], ks) : obj[k];
}

module.exports = getIn;
},{"./util":11}],9:[function(_dereq_,module,exports){
var get = _dereq_('./get'),
    getIn = _dereq_('./getIn'),
    assoc = _dereq_('./assoc'),
    dissoc = _dereq_('./dissoc'),
    assocIn = _dereq_('./assocIn'),
    dissocIn = _dereq_('./dissocIn'),
    assocObj = _dereq_('./assocObj'),
    dissocObj = _dereq_('./dissocObj'),
    merge = _dereq_('./merge'),
    util = _dereq_('./util');

function multiGet(obj, path, orValue) {
  if (typeof path === 'string') return get(obj, path, orValue);
  return getIn(obj, path, orValue);
}

function multiAssoc(obj, path, value) {
  if (typeof path === 'string') return assoc(obj, path, value);
  if (!util.isUndefined(value) && util.isArray(path)) return assocIn(obj, path, value);
  return assocObj(obj, path);
}

function multiDissoc(obj, path) {
  if (typeof path === 'string') return dissoc(obj, path);
  if (util.isArray(path)) return dissocIn(obj, path);
  return dissocObj(obj, path);
}

module.exports = {
  get: multiGet,
  assoc: multiAssoc,
  dissoc: multiDissoc
};
},{"./assoc":1,"./assocIn":2,"./assocObj":3,"./dissoc":4,"./dissocIn":5,"./dissocObj":6,"./get":7,"./getIn":8,"./merge":10,"./util":11}],10:[function(_dereq_,module,exports){
function merge() {
  var n = arguments.length,
      i = -1,
      o = {},
      k, obj;

  while (++i < n) {
    obj = arguments[i];
    for (k in obj) {
      o[k] = obj[k];
    }
  }

  return o;
}

module.exports = merge;
},{}],11:[function(_dereq_,module,exports){
// Shallow copy
function copy(obj) {
  if (Array.isArray(obj)) return obj.slice();
  var k,
      newObj = {};
  for (k in obj) {
    newObj[k] = obj[k];
  }
  return newObj;
}

function objectKeys(obj) {
  var keys = [], k;
  for (k in obj) {
    keys.push(k);
  }
  return keys;
}

function isArrayOrObject(obj) {
  return typeof obj === 'object';
}

function isArray(obj) {
  return Array.isArray(obj);
}

// Is a value undefined
function isUndefined(v) {
  return v === void 0;
}

module.exports = {
  copy: copy,
  objectKeys: objectKeys,
  isArrayOrObject: isArrayOrObject,
  isArray: isArray,
  isUndefined: isUndefined
};
},{}]},{},[9])
(9)
});