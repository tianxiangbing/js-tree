'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Created with Visual Studio Code.
 * github: https://github.com/tianxiangbing/js-tree
 * User: 田想兵
 * Date: 2018-05-18
 * Time: 20:00:00
 * Contact: 55342775@qq.com
 * desc: js搜索树
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
                _extends(this, { data: {}, isRowHandle: false, iconOpen: '<i class="js-tree-open"></i>', iconClose: '<i class="js-tree-close"></i>', isOpenAll: false, text: undefined, value: undefined, childrenField: 'children', searchInput: undefined, formatItem: undefined, clickCallback: function clickCallback() {}, openCallback: function openCallback() {}, closeCallback: function closeCallback() {} }, _extends({}, args));
                this.filterColumn = [this.value, this.text];
                this.show();
                this.bindEvent();
            }
        }, {
            key: 'show',
            value: function show() {
                this.defaultIcon = this.isOpenAll ? this.iconOpen : this.iconClose;
                this.level = 0;
                var _html = this.format(this.data);
                $(this.container).html('<div class="js-tree-container">' + _html + '</div>');
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent() {
                var _this2 = this;

                $(this.container).on('click', 'li', function (e) {
                    if (_this2.isRowHandle) {
                        _this2.expand(e.currentTarget);
                    }
                    _this2.clickCallback(e.currentTarget);
                    e.stopPropagation();
                }).on('click', 'li i', function (e) {
                    _this2.expand($(e.currentTarget).closest('li'));
                    e.stopPropagation();
                });
                if (this.searchInput) {
                    var _this = this;
                    $(this.searchInput).on('focus', function () {
                        var input = $(this);
                        _this.timer && clearInterval(_this.timer);
                        _this.timer = setInterval(function () {
                            if (input.data('old') != input.val()) {
                                _this.search();
                                input.data('old', input.val());
                            }
                        }, 25);
                    }).on('keyup', function (e) {
                        var input = $(this);
                        if (input.data('old') != input.val() && e.keyCode != 13) {
                            _this.search();
                            input.data('old', input.val());
                        }
                    }).on('blur', function () {
                        if (_this.timer) {
                            clearInterval(_this.timer);
                        }
                    });
                }
            }
        }, {
            key: 'search',
            value: function search() {
                var _this = this;
                var value = _this.searchInput.val();
                if (value.length > 0) {
                    var data = this.filter(value);
                    this.level = 0;
                    var _html = this.format(data);
                    $('.js-tree-container', this.container).children('.js-tree-ul').hide();
                    if ($('.js-tree-container', this.container).find('.js-tree-filter').length === 0) {
                        $('.js-tree-container', this.container).append('<div class="js-tree-filter"></div>');
                    }
                    $('.js-tree-filter', this.container).html(_html);
                } else {
                    $('.js-tree-container', this.container).children('.js-tree-ul').show();
                    $('.js-tree-filter').remove();
                }
            }
        }, {
            key: 'openAll',
            value: function openAll() {
                this.isOpenAll = true;
                this.show();
            }
        }, {
            key: 'closeAll',
            value: function closeAll() {
                this.isOpenAll = false;
                this.show();
            }
        }, {
            key: 'filter',
            value: function filter(value) {
                var _this = this;
                var newData = [];
                var data = this.data;
                this.__filter(newData, data, value);
                return newData;
            }
        }, {
            key: '__filter',
            value: function __filter(newData, data, value) {
                for (var i = 0, l = data.length; i < l; i++) {
                    var item = data[i];
                    for (var j = 0, len = this.filterColumn.length; j < len; j++) {
                        var v = item[this.filterColumn[j]];
                        if (v.toString().indexOf(value) != -1) {
                            newData.push(item);
                        }
                    }
                    if (item.hasOwnProperty(this.childrenField)) {
                        this.__filter(newData, item[this.childrenField], value);
                    }
                }
            }
        }, {
            key: 'expand',
            value: function expand(target) {
                var $target = $(target);
                if ($target.hasClass('js-tree-opened')) {
                    $target.children('ul').hide();
                    $target.addClass('js-tree-closed').removeClass('js-tree-opened');
                    $target.children().children('i').addClass('js-tree-close').removeClass('js-tree-open');
                    this.closeCallback();
                } else {
                    $target.children('ul').show();
                    $target.removeClass('js-tree-closed').addClass('js-tree-opened');
                    $target.children().children('i').addClass('js-tree-open').removeClass('js-tree-close');
                    this.openCallback();
                }
            }
        }, {
            key: 'format',
            value: function format(data, isOpened) {
                var _this3 = this;

                var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.level;

                var currentLevel = level;
                currentLevel++;
                var ulcls = isOpened === false ? ' js-tree-hide' : '';
                var _html = '<ul class="js-tree-ul ' + ulcls + '">';
                data.forEach(function (item) {
                    var hasChild = false;
                    var cls = _this3.isOpenAll ? 'js-tree-opened' : 'js-tree-closed';
                    if (item.hasOwnProperty(_this3.childrenField) && item[_this3.childrenField].length > 0) {
                        hasChild = true;
                        if (_this3.isRowHandle) {
                            cls += ' js-tree-handle';
                        }
                    }
                    _html += _this3.formatItemHTML(item, currentLevel, cls, data, hasChild);
                });
                _html += '</ul>';
                return _html;
            }
        }, {
            key: 'formatItemHTML',
            value: function formatItemHTML(item, currentLevel, cls, data, hasChild) {
                var _html = '';
                var spaceCls = this.getSpaceClass(currentLevel);
                var itemHtml = '<li class="js-tree-ul-li ' + cls + '" data-value="' + item[this.value] + '"><div class="js-tree-item-dv ' + spaceCls + '">';
                //支持自定义格式化
                if (this.formatItem) {
                    itemHtml += this.formatItem.call(this, item, data);
                } else {
                    itemHtml += (hasChild ? this.defaultIcon : '') + '<span>' + item[this.text] + '</span>';
                }
                _html += itemHtml;
                _html += '</div>';
                hasChild ? _html += this.format(item[this.childrenField], this.isOpenAll, currentLevel) : undefined;
                _html += '</li>';
                return _html;
            }
        }, {
            key: 'getSpaceClass',
            value: function getSpaceClass(level) {
                return 'js-tree-space-' + level;
            }
        }]);

        return JsTree;
    }();
});