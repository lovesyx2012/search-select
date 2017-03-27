/**
 * Created by Cephiroth on 2017/1/16.
 */
'use strict';
;(function($, win, doc, undefined) {
    function SearchSelect(ctx, options){
        var defaultOptions = {
            valueEl: '.search-select-value',
            inputEl: '.search-select-input',
            dropDownEl: '.search-select-dropdown',
            itemEl: '.item',
            noneEl: '.none',
            change: null
        };
        this.options = $.extend({}, defaultOptions, options);
        this.el = ctx;
        this.value = this.el.find(this.options.valueEl);
        this.input = this.el.find(this.options.inputEl);
        this.dropDown = this.el.find(this.options.dropDownEl);
        this.item = this.dropDown.find(this.options.itemEl);
        this.none = this.dropDown.find(this.options.noneEl);
        this.init();
    }
    SearchSelect.prototype = {
        init: function () {
            var self = this;
            self.expand();
            self.search();
        },
        change: function (value, text) {
            var self = this, handler = self.options.change;
            if (handler && $.isFunction(handler)) {
                handler(self.el, value, text);
            }
        },
        search: function () {
            var self = this;
            self.input.on('input', function () {
                var _self = this,
                    isSearch = false;
                if (_self.value === '') {
                    self.item.show();
                    self.none.hide();
                    return;
                } 
                if (_self.value.trim() === '') {
                    self.item.hide();
                    self.none.show();
                    return;
                } 
                self.item.each(function (i, el) {
                    if (el.textContent.trim().indexOf(_self.value.trim()) != -1) {
                        isSearch = true;
                        $(el).show();
                    } else {
                        $(el).hide();
                    }
                });
                if (isSearch) {
                    self.none.hide();
                } else {
                    self.none.show();
                }
            })
        },
        expand: function () {
            var self = this;
            self.input.on('click', function (evt) {
                var _self = this;
                evt.stopPropagation();
                if (self.dropDown.is(':visible')) {
                    if (_self.value === '') {
                        self.item.removeClass('active');
                        self.dropDown.find('li.all').addClass('active');
                        self.value.val(self.dropDown.find('li.all').data('value'));
                    }
                    self.input.val(self.dropDown.find('li.active').text());
                    self.input.blur();
                } else {
                    self.input.select();
                    self.item.show();
                    self.none.hide();
                }
                self.dropDown.slideToggle(200);
            });
            self.item.on('click', function () {
                var _self = this, $this = $(_self);
                self.item.removeClass('active');
                $this.addClass('active');
                self.input.val(_self.textContent);
                self.value.val($this.data('value'));
                self.dropDown.slideUp(200);
                self.change($this.data('value'), _self.textContent);
            });
            $(document).on('click', function (evt) {
                if (!$(evt.target).hasClass('search-select-dropdown')) {
                     if (self.input.val() === '') {
                         self.item.removeClass('active');
                         self.dropDown.find('li.all').addClass('active');
                         self.value.val(self.dropDown.find('li.all').data('value'));
                     }
                     self.input.val(self.dropDown.find('li.active').text());
                     self.dropDown.slideUp(200);
                }
            });
        }
    };

    $.fn.SearchSelect = function(options){
        return new SearchSelect(this, options);
    };
}(jQuery, window, document));
