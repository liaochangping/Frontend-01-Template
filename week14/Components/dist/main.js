/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./fool.js":
/*!*****************!*\
  !*** ./fool.js ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("console.log(\"fool\");\n\n//# sourceURL=webpack:///./fool.js?");

/***/ }),

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _fool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fool */ \"./fool.js\");\n/* harmony import */ var _fool__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_fool__WEBPACK_IMPORTED_MODULE_0__);\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nfunction create(Cls, attributes) {\n  var object; //如果不是组件，而是以小写开头的字符串，则直接用Wrapper包裹起来，构成html中tag元素\n\n  if (typeof Cls === 'string') {\n    object = new Wrapper(Cls);\n  } else {\n    //否则直接使用组件\n    object = new Cls();\n  }\n\n  for (var key in attributes) {\n    // object[key] = attributes[key];\n    object.setAttribute(key, attributes[key]);\n  } //协议children的包含方式\n\n\n  for (var _len = arguments.length, childrens = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n    childrens[_key - 2] = arguments[_key];\n  }\n\n  for (var _i = 0, _childrens = childrens; _i < _childrens.length; _i++) {\n    var child = _childrens[_i];\n\n    //如果child非html标签或者组件，则需要构建字符串节点TextNode，用于显示\n    if (typeof child === 'string' || typeof child === 'number' || typeof child === 'bool') {\n      child = new Text(child);\n    }\n\n    object.appendChild(child);\n  }\n\n  return object;\n} //构建字符串标签\n\n\nvar Text = /*#__PURE__*/function () {\n  function Text(value) {\n    _classCallCheck(this, Text);\n\n    //直接构建字符串节点\n    this.root = document.createTextNode(value);\n  } //由于文本节点不存在子元素和设置属性相关操作，所以只存在挂载的操作\n\n\n  _createClass(Text, [{\n    key: \"componentMountTo\",\n    value: function componentMountTo(parent) {\n      //直接将node元素添加到父元素中\n      parent.appendChild(this.root);\n    }\n  }]);\n\n  return Text;\n}(); //包装具体的html元素标签\n\n\nvar Wrapper = /*#__PURE__*/function () {\n  function Wrapper(type) {\n    _classCallCheck(this, Wrapper);\n\n    this.childrens = []; //直接构建对应字符串的类型对象\n\n    this.root = document.createElement(type);\n  }\n\n  _createClass(Wrapper, [{\n    key: \"setAttribute\",\n    value: function setAttribute(key, value) {\n      // console.log(\"parent:attribute\",key,value);\n      this.root.setAttribute(key, value);\n    }\n  }, {\n    key: \"appendChild\",\n    value: function appendChild(child) {\n      this.childrens.push(child);\n    }\n  }, {\n    key: \"componentMountTo\",\n    value: function componentMountTo(parent) {\n      //直接将node元素添加到父元素中\n      parent.appendChild(this.root); //将申明式中的子元素挂载到当前节点上\n\n      var _iterator = _createForOfIteratorHelper(this.childrens),\n          _step;\n\n      try {\n        for (_iterator.s(); !(_step = _iterator.n()).done;) {\n          var child = _step.value;\n          child.componentMountTo(this.root);\n        }\n      } catch (err) {\n        _iterator.e(err);\n      } finally {\n        _iterator.f();\n      }\n    }\n  }, {\n    key: \"class\",\n    set: function set(value) {\n      console.log(\"parent:class\", value);\n    }\n  }]);\n\n  return Wrapper;\n}();\n\nvar Component = /*#__PURE__*/function () {\n  function Component(props) {\n    _classCallCheck(this, Component);\n\n    this.childrens = [];\n    this.attributes = {};\n  } // set class(value){\n  //     console.log(\"parent:class\",value);\n  // }\n  // setAttribute(key, value){\n  //     // console.log(\"parent:attribute\",key,value);\n  //     this.attributes[key] = value;\n  // }\n\n\n  _createClass(Component, [{\n    key: \"appendChild\",\n    value: function appendChild(child) {\n      this.childrens.push(child);\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      return create(\"div\", null, create(\"h1\", null, \"xxxxxxxx\"), this.slot);\n    }\n  }, {\n    key: \"componentMountTo\",\n    value: function componentMountTo(parent) {\n      this.slot = create(\"div\", null);\n\n      var _iterator2 = _createForOfIteratorHelper(this.childrens),\n          _step2;\n\n      try {\n        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {\n          var child = _step2.value;\n          this.slot.appendChild(child);\n        }\n      } catch (err) {\n        _iterator2.e(err);\n      } finally {\n        _iterator2.f();\n      }\n\n      this.render().componentMountTo(parent);\n    }\n  }]);\n\n  return Component;\n}(); // let component = <Component id=\"a\" class=\"cls\" style=\"display:inline-block;width:100px;height:100px;background-color:red;\">\n//     <Component style=\"display:inline-block;width:10px;height:50px;background-color:blue;\"/>\n//     <Component style=\"display:inline-block;width:30px;height:10px;background-color:green;\"/>\n// </Component>\n\n\nvar component = create(\"span\", null, create(Component, null, create(\"div\", null, create(\"span\", null, \"jsda;fj;asjdf;ajsdf\")))); // component.class = \"teste\";\n\ncomponent.componentMountTo(document.body); // var component = create(Parent, {\n//     id: \"a\",\n//     \"class\": \"cls\",\n//     style: \"width:100px\"\n//   }, create(Child, null), create(Child, null));\n\nconsole.log(component);\n\n//# sourceURL=webpack:///./main.js?");

/***/ })

/******/ });