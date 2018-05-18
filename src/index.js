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
            Object.assign(this, { data: {}, isRowHandle: false, iconOpen: '<i class="js-tree-open"></i>', iconClose: '<i class="js-tree-close"></i>', isOpenAll: false, text: undefined, value: undefined, childrenField: 'children', searchInput: undefined, formatItem: undefined, clickCallback: () => { }, openCallback: () => { }, closeCallback: () => { } }, { ...args });
            this.filterColumn = [this.value, this.text];
            this.show();
        }
        show() {
            this.defaultIcon = this.isOpenAll ? this.iconOpen : this.iconClose;
            this.level = 0;
            let _html = this.format(this.data)
            $(this.container).html(`<div class="js-tree-container">${_html}</div>`);
            this.bindEvent();
        }
        bindEvent() {
            $(this.container).on('click', 'li', e => {
                if (this.isRowHandle) {
                    this.expand(e.currentTarget);
                }
                this.clickCallback(e.currentTarget);
                e.stopPropagation();
            }).on('click', 'li i', e => {
                this.expand($(e.currentTarget).closest('li'));
                e.stopPropagation();
            });
            if (this.searchInput) {
                let _this = this;
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
                }).on('blur', function() {
                    if (_this.timer) {
                        clearInterval(_this.timer);
                    }
                });
            }
        }
        search() {
            var _this = this;
            var value = _this.searchInput.val();
            if(value.length>0){
                let data = this.filter(value);
                this.level  = 0;
                let _html = this.format(data);
                $('.js-tree-container',this.container).children('.js-tree-ul').hide();
                if($('.js-tree-container',this.container).find('.js-tree-filter').length ===0){
                    $('.js-tree-container',this.container).append(`<div class="js-tree-filter"></div>`);
                }
                $('.js-tree-filter',this.container).html(_html);
            }else{
                $('.js-tree-container',this.container).children('.js-tree-ul').show();
                $('.js-tree-filter').remove();
            }
        }
        openAll(){
            this.isOpenAll = true;
            this.show();
        }
        closeAll(){
            this.isOpenAll = false;
            this.show();
        }
        filter(value) {
            var _this = this;
            var newData = [];
            let data = this.data;
            this.__filter(newData,data,value);
            return newData;
        }
        __filter(newData,data,value){
            for (var i = 0, l = data.length; i < l; i++) {
                var item = data[i];
                for (var j = 0, len = this.filterColumn.length; j < len; j++) {
                    var v = item[this.filterColumn[j]];
                    if (v.toString().indexOf(value) != -1) {
                        newData.push(item);
                    }
                }
                if(item.hasOwnProperty(this.childrenField)){
                    this.__filter(newData,item[this.childrenField],value)
                }
            }
        }
        expand(target) {
            let $target = $(target);
            if ($target.hasClass('js-tree-opened')) {
                $target.children('ul').hide();
                $target.addClass('js-tree-closed').removeClass('js-tree-opened');
                $target.children().children('i').addClass('js-tree-close').removeClass('js-tree-open');
                this.closeCallback()
            } else {
                $target.children('ul').show();
                $target.removeClass('js-tree-closed').addClass('js-tree-opened');
                $target.children().children('i').addClass('js-tree-open').removeClass('js-tree-close');
                this.openCallback()
            }
        }
        format(data, isOpened,level =this.level) {
            let currentLevel = level ;
            currentLevel++;
            let ulcls = isOpened === false ? ' js-tree-hide' : '';
            let _html = `<ul class="js-tree-ul ${ulcls}">`;
            data.forEach(item => {
                let hasChild = false;
                let cls = this.isOpenAll ? 'js-tree-opened' : 'js-tree-closed';
                if (item.hasOwnProperty(this.childrenField) && item[this.childrenField].length > 0) {
                    hasChild = true;
                    if (this.isRowHandle) {
                        cls += ' js-tree-handle';
                    }
                }
                _html += this.formatItemHTML(item, currentLevel, cls, data, hasChild);
            });
            _html += '</ul>';
            return _html;
        }
        formatItemHTML(item, currentLevel, cls, data, hasChild) {
            let _html = '';
            let spaceCls = this.getSpaceClass(currentLevel)
            let itemHtml = `<li class="js-tree-ul-li ${cls}" data-value="${item[this.value]}"><div class="js-tree-item-dv ${spaceCls}">`;
            //支持自定义格式化
            if (this.formatItem) {
                itemHtml += this.formatItem.call(this, item, data);
            } else {
                itemHtml += `${hasChild ? this.defaultIcon:''}<span>${item[this.text]}</span>`;
            }
            _html += itemHtml;
            _html += '</div>';
            hasChild ? _html += this.format(item[this.childrenField], this.isOpenAll,currentLevel) : undefined;
            _html += '</li>';
            return _html;
        }
        getSpaceClass(level) {
            return 'js-tree-space-' + level;
        }
    }
});