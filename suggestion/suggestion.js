var $ = require('common:jquery'), util = require('common:util');

function Suggestion(opts){
	this.options = $.extend({
		dom: null,
		width: false,
		max: 10,
		url: null,
		data: null,
		delay: 300,
		kw: 'kw',
		requestParams: {},
		resultField: '',
		match: null,
		format: null,
		callback: function(){}
	}, opts || {});

	this.init();
}

Suggestion.prototype = {
	init: function(){
		var self = this, opts = self.options;

		self.dom = $(opts.dom).attr('autocomplete', 'off');
		self.parent = self.dom.parent();

		!/fixed|absolute/.test(self.parent.css('position')) && self.parent.css('position', 'relative');

		self.suggest = $('<ul class="ui-suggestion">').appendTo(self.parent);
		self.xhr = null;
		self.tid = null;
		self.index = null;

		self.setData(opts.data);

		self.initEvent();
	},

	initEvent: function(){
		var self = this, opts = self.options;

		self.dom.on('keyup paste cut', function(e){
			if(e.keyCode == 13){
				var $current = self.suggest.find('.ui-suggestion-active');

				if($current.length){
					self.setKw($current.attr('data-suggestion-kw'), true);
				}

				return self.close();
			}else{
				!Suggestion.isUDEvent(e) && self.match();
			}
		}).focus(function(){
			self.match();
		}).keydown(function(e){
			Suggestion.isUDEvent(e) && self.switchKw(e);
		}).blur(function(){
			setTimeout(function(){
				self.close();
			}, 100);
		});

		self.suggest.delegate('.ui-suggestion-item', 'click', function(){
			self.setKw($(this).attr('data-suggestion-kw'), true);
		});
	},

	setKw: function(value, execCallback){
		var self = this;

		self.dom.val(value);
		execCallback && self.options.callback && self.options.callback.call(self, value);
	},

	switchKw: function(e){
		var self = this;

		if(!self.items) return;

		var code = e.keyCode, max = self.items.length - 1, index = self.index == null ? -1 : self.index;

		if(code == 38){
			index--;
		}else{
			index++;
		}

		if(index < 0){
			index = max;
		}else if(index > max){
			index = 0;
		}

		self.index = index;
		
		self.items.removeClass('ui-suggestion-active');

		var $item = self.items.eq(index).addClass('ui-suggestion-active');

		self.setKw($item.attr('data-suggestion-kw'));

		e.preventDefault();
	},

	setData: function(data){
		this.data = data;
	},

	match: function(){
		var self = this, opts = self.options;

		self.cancelMatch();

		//request remote data
		self.tid = setTimeout(function(){
			var kw = self.dom.val();

			if(!$.trim(kw)){
				self.close();
				return;
			}

			var data = self.data, cache = Suggestion.cache[kw];
			
			if(data && (data = self._match.call(self, data, kw)).length){
				//if kw can be find in local data
				self.build(data, kw);
			}else if(cache){
				//if kw in cache
				self.build(cache, kw);
			}else if(opts.url){
				var params = $.extend({}, opts.requestParams);
				params[opts.kw] = kw;

				self.xhr = $.getJSON(opts.url, params, function(data){
					if(opts.resultField){
						data = util.object.get(data, opts.resultField) || [];
					}
					
					data = Suggestion.cache[kw] = self._match.call(self, data, kw);

					self.build(data, kw);
				});
			}
		}, opts.delay);	
	},

	cancelMatch: function(){
		var self = this;

		self.xhr && self.xhr.abort();
		self.tid && clearTimeout(self.tid);
	},

	_match: function(data, kw){
		var self = this, opts = self.options, tmp;

		if(opts.match){
			tmp = opts.match.call(self, data, kw);
		}else{
			tmp = [];

			$.each(data, function(key, item){
				String(item).indexOf(kw) == 0 && tmp.push(item);
			});
		}

		return tmp.slice(0, opts.max);
	},

	build: function(data, kw){
		var self = this, opts = self.options;

		self.index = null;

		if(!data.length){
			self.suggest.empty();
			self.items = null;
			self.close();
		}else{
			var html = '';

			$.each(data, function(key, item){
				html += '<li class="ui-suggestion-item" data-suggestion-index="' + key + '" data-suggestion-kw="' + item + '"><a href="javascript:;">' + self.format(item, kw) + '</a></li>';
			});

			self.suggest.html(html);
			self.items = self.suggest.find('.ui-suggestion-item');
			self.open();
		}
	},

	open: function(){
		var self = this;
		
		if(!self.items) return;

		var $dom = self.dom;
		var position = $dom.position();

		self.suggest.show().css({
			left: position.left,
			top: position.top + $dom.outerHeight(),
			width: self.options.width || ($dom.outerWidth() - 2)
		});
	},

	close: function(){
		var self = this;

		self.suggest.hide();
	},

	format: function(text, kw){
		var self = this, opts = self.options;

		if(opts.format){
			return opts.format.call(self, text, kw);
		}

		return text;
	}
};


Suggestion.cache = {};

Suggestion.isUDEvent = function(e){
	return e.keyCode == 38 || e.keyCode == 40;
};

module.exports = Suggestion;