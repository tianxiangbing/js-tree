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
            let $ = require("jquery");
            return factory($);
        });
    } else if (typeof exports === 'object') { //umd
        let $ = require("jquery");
        module.exports = factory($);
    } else {
        window.JsTree = factory($);
    }
})(function ($) {
    "use strict";
    return class JsTree {
        constructor(container) {
            this.container = container;
        }
        init(args) {
            // this.settings = {...arguments[0]};
            Object.assign(this, { data: {}, isRowHandle: false, iconOpen: '<i class="js-tree-open"></i>', iconClose: '<i class="js-tree-close"></i>', isOpenAll: false, text: undefined, value: undefined, childrenField: 'children', searchInput: undefined, clickCallback: () => { }, openCallback: () => { }, closeCallback: () => { } }, { ...args });
            this.searchField = [this.value, this.text];
            this.show();
        }
        show() {
            this.defaultIcon = this.isOpenAll ? this.iconOpen : this.iconClose;
            let _html = this.format(this.data)
            $(this.container).html(_html);
            this.bindEvent();
        }
        bindEvent() {
            $(this.container).on('click', 'li', e => {
                if (this.isRowHandle) {
                    this.expand(e.currentTarget);
                }
                this.clickCallback(e.currentTarget);
                e.stopPropagation();
            }).on('click', 'li>i', e => {
                this.expand($(e.currentTarget).parent());
                e.stopPropagation();
            })
        }
        expand(target) {
            let $target = $(target);
            if ($target.hasClass('js-tree-opened')) {
                $target.children('ul').hide();
                $target.addClass('js-tree-closed').removeClass('js-tree-opened');
                $target.children('i').addClass('js-tree-close').removeClass('js-tree-open');
                this.closeCallback()
            } else {
                $target.children('ul').show();
                $target.removeClass('js-tree-closed').addClass('js-tree-opened');
                $target.children('i').addClass('js-tree-open').removeClass('js-tree-close');
                this.openCallback()
            }
        }
        format(data, isOpened) {
            let cls = isOpened===false ? ' js-tree-hide' : '';
            let _html = `<ul class="js-tree-ul ${cls}">`;
            data.forEach(item => {
                if (item.hasOwnProperty(this.childrenField) && item[this.childrenField].length > 0) {
                    let cls = this.isOpenAll ? 'js-tree-opened' : 'js-tree-closed';
                    if (this.isRowHandle) {
                        cls += ' js-tree-handle';
                    }
                    let itemHtml = `<li class="js-tree-ul-li ${cls}" data-value="${item[this.value]}">${this.defaultIcon}${item[this.text]}`;
                    _html += itemHtml;
                    _html += this.format(item[this.childrenField],this.isOpenAll );
                    itemHtml +='</li>';
                } else {
                    let itemHtml = `<li data-value="${item[this.value]}">${item[this.text]}</li>`;
                    _html += itemHtml;
                }
            });
            _html += '</ul>';
            return _html;
        }
    }
});