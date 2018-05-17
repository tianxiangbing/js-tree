'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Created with Visual Studio Code.
 * github: https://github.com/tianxiangbing/js-tree
 * User: 田想兵
 * Date: 2018-05-08
 * Time: 20:00:00
 * Contact: 55342775@qq.com
 * desc: 倒计时
 * 请使用https://github.com/tianxiangbing/js-tree 上的代码
 * npm install js-tree-search --save
 */
(function (factory) {
    // 
    if (typeof define === 'function' && define.amd) {
        define(["jquery"], factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(function (require) {
            var $ = require("jquery");
            return factory($);
        });
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        //umd
        var _$ = require("jquery");
        module.exports = factory(_$);
    } else {
        window.JsTree = factory($);
    }
})(function ($) {
    "use strict";

    return function () {
        function JsTree(container) {
            _classCallCheck(this, JsTree);

            this.container = container;
        }

        _createClass(JsTree, [{
            key: 'init',
            value: function init(args) {
                // this.settings = {...arguments[0]};
                _extends(this, { data: {}, isRowHandle: false, iconOpen: '<i class="js-tree-open"></i>', iconClose: '<i class="js-tree-close"></i>', isOpenAll: false, text: undefined, value: undefined, childrenField: 'children', searchInput: undefined, clickCallback: function clickCallback() {}, openCallback: function openCallback() {}, closeCallback: function closeCallback() {} }, _extends({}, args));
                this.searchField = [this.value, this.text];
                this.show();
            }
        }, {
            key: 'show',
            value: function show() {
                this.defaultIcon = this.isOpenAll ? this.iconOpen : this.iconClose;
                var _html = this.format(this.data);
                $(this.container).html(_html);
                this.bindEvent();
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent() {
                var _this = this;

                $(this.container).on('click', 'li', function (e) {
                    if (_this.isRowHandle) {
                        _this.expand(e.currentTarget);
                    }
                    _this.clickCallback(e.currentTarget);
                    e.stopPropagation();
                }).on('click', 'li>i', function (e) {
                    _this.expand($(e.currentTarget).parent());
                    e.stopPropagation();
                });
            }
        }, {
            key: 'expand',
            value: function expand(target) {
                var $target = $(target);
                if ($target.hasClass('js-tree-opened')) {
                    $target.children('ul').hide();
                    $target.addClass('js-tree-closed').removeClass('js-tree-opened');
                    $target.children('i').addClass('js-tree-close').removeClass('js-tree-open');
                    this.closeCallback();
                } else {
                    $target.children('ul').show();
                    $target.removeClass('js-tree-closed').addClass('js-tree-opened');
                    $target.children('i').addClass('js-tree-open').removeClass('js-tree-close');
                    this.openCallback();
                }
            }
        }, {
            key: 'format',
            value: function format(data, isOpened) {
                var _this2 = this;

                var cls = isOpened === false ? ' js-tree-hide' : '';
                var _html = '<ul class="js-tree-ul ' + cls + '">';
                data.forEach(function (item) {
                    if (item.hasOwnProperty(_this2.childrenField) && item[_this2.childrenField].length > 0) {
                        var _cls = _this2.isOpenAll ? 'js-tree-opened' : 'js-tree-closed';
                        if (_this2.isRowHandle) {
                            _cls += ' js-tree-handle';
                        }
                        var itemHtml = '<li class="js-tree-ul-li ' + _cls + '" data-value="' + item[_this2.value] + '">' + _this2.defaultIcon + item[_this2.text];
                        _html += itemHtml;
                        _html += _this2.format(item[_this2.childrenField], _this2.isOpenAll);
                        itemHtml += '</li>';
                    } else {
                        var _itemHtml = '<li data-value="' + item[_this2.value] + '">' + item[_this2.text] + '</li>';
                        _html += _itemHtml;
                    }
                });
                _html += '</ul>';
                return _html;
            }
        }]);

        return JsTree;
    }();
});