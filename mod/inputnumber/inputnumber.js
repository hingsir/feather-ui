var $ = require('jquery');

function InputNumber(opt){
	this.options = $.extend({
		dom : null,
		max : '',
		min : '',
		step : '',
		val : ''
	}, opt || {});

	this.init();
}

InputNumber.prototype = {
	init: function(){
		var self = this,$dom = self.dom = $(self.options.dom);
		self.max = self.clearComma(self.options.max || $dom.attr('max')),
		self.step = self.clearComma(self.options.step || $dom.attr('step')),
		self.min = self.clearComma(self.options.min || $dom.attr('min')),
		self.generate();
	},
	bindEvent:function(){
		var self = this;
		$(self.minus).add(self.add).bind('click',function() {
			var clearnum = self.clearComma($(this).val());
			self.operate(clearnum);
		});
	},

	generate:function(){
		var self = this, $dom = self.dom = $(self.options.dom);
		self.minus = $('<input type="button"/>')
			.val('-')
			.addClass('input-number-button')
			.insertBefore(self.options.dom);
		self.add = $('<input type="button"/>')
			.val('+')
			.addClass('input-number-button')
			.insertAfter(self.options.dom);
		self.bindEvent();
	},

	operate:function(operator){
		var $dom = this.dom,
			offset = parseInt(operator+this.step),
			val = parseInt(this.clearComma($dom.val())),
			total = offset+val;
		(total>=this.min && total<=this.max) && $dom.val(this.addComma(val+offset));
		this.detect(total);
	},

	clearComma:function(num){
		num+='';
		return num.replace(',','');
	},

	addComma:function(num){
        num += '';  
        var ints = num.split('.');  
        var x1 = ints[0];  
        var x2 = ints.length > 1 ? '.' + ints[1] : '';  
        var reg = /(\d+)(\d{3})/;  
        while (reg.test(x1)) {  
            x1 = x1.replace(reg, '$1' + ',' + '$2');  
        }  
        return x1 + x2;  
	},

	detect:function(total){
		(total>=this.max) && this.disable(this.add);
		(total<=this.min) && this.disable(this.minus);
		(total>this.min) && this.enable(this.minus);
		(total<this.max) && this.enable(this.add);
	},

	disable: function(dom){
		dom.attr('disable','disable')
			.addClass('input-number-disable');
	},

	enable:function(dom){
		dom.removeAttr('disable')
			.removeClass('input-number-disable');
	}
};

module.exports = InputNumber;
