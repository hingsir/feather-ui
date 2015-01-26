module.exports = {
	get: function(data, name){
		if(data[name]){
			return data[name];
		}

		name = name.split('.');

		var i = 0, len = name.length, tmp = data;

		for(; i < len; i++){
			tmp = tmp[name[i]];

			if(tmp == null) return null;
		}

		return tmp;
	},

	set: function(data, name, value){
		if(typeof value == 'undefined'){
			data = name;
		}else{
			name = name.split('.');

			var i = 0, len = name.length - 1, tmp = data;

			for(; i < len; i++){
				var tmpName = name[i];

				if(typeof tmp[tmpName] != 'object' || !tmp[tmpName]){
					tmp[tmpName] = {};
				}

				tmp = tmp[tmpName];
			}

			tmp[name[i]] = value;
		}
	},

	toJSONString: function(obj){
		// if('JSON' in window){
		// 	return JSON.stringify(obj);			
		// }else{
			if(typeof obj == 'undefined'){
				return ;
			}

			if(obj.constructor == Array){
				var tmp = [], i = 0, j = obj.length;

				for(; i < j; i++){
					tmp.push(this.toJSONString(obj[i]));
				}

				return '[' + tmp.join(',') + ']';
			}

			if(typeof obj == 'object' && obj){
				var tmp = [];

				for(var i in obj){
                	obj.hasOwnProperty(i) && tmp.push('"' + i + '":' + this.toJSONString(obj[i]));
				}

				return "{" + tmp.join(',') + "}";
			}

			if(typeof obj == 'function'){
				return ;
			}
			
			return String(obj);
		//}
	},

	parseJSON: function(str){
		// if('JSON' in window){
		// 	return JSON.parse(str);
		// }else{
			return (new Function('return ' + str))();
		//}
	}
};