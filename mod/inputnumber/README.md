InputNumber
================

兼容HTML4的input type=number组件,
默认平安样式，可自定

###使用
```html
<script>
require.async('inputnumber', function(InputNumber){
	new InputNumber({
		dom: '#num',
		max: 100,
		min:1,
		step:1
	});
});
</script>
```
