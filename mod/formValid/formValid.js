var $ = require('jquery');

function FormValid(opt){
	this.options = $.extend({
		dom: null,
		rules: {}
	}, opt || {});

	this.init();
}

FormValid.prototype = {
		init: function(){
			this.dom = $(this.options.dom);
		},

		check: function(name){
			this.reset(name);

			var $dom = this.dom;

			var t = this, status = true, rules;
            if(name){
                rules = {};
                rules[name] = this.options.rules[name] || {};
            }else{
                rules = this.options.rules;
            }

			$.each(rules, function(index, item){
				var $tmp = $dom.find('[name=' + index + ']'), value = $tmp.val(), tmpStatus = true;

				if( Object.prototype.toString.call(item) != '[object Array]' ){
					item = [item];
				}

				var tmp;

				for( var i = 0; i < item.length; i++ ){
					tmp = item[i];

					if( typeof tmp.rule == 'function' && !tmp.rule(value) ){
						status = false; tmpStatus = false;
					} else if ( tmp.rule.constructor == RegExp && !tmp.rule.test(value) ){
						status = false; tmpStatus = false;
					}

					if( !tmpStatus ){
						t.error(index, tmp.errorText);
						return;
					}	
				} 

				t.success(index, tmp.successText);
			});

			return status;
		},

		error: function(name, text){
            this.reset(name);
			this.dom.find('[name=' + name + ']').parent().append('<span class="ui-formvalid-field ui-formvalid-field-error">' + text + '</span>');
		},

		success: function(name, text){
			this.reset(name);

			if(text != null){
				this.dom.find('[name=' + name + ']').parent().append('<span class="ui-formvalid-field ui-formvalid-field-success">' + text + '</span>');
			}
		},

		reset: function(name){
            if(name){
                this.dom.find('[name=' + name + ']').parent().find('.ui-formvalid-field').remove();
            }else{
                this.dom.find('.ui-formvalid-field').remove();
            }
		},

		addRule: function( name, rule ){
			this.options.rules[name] = rule;
		}
};

return FormValid;