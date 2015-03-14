function xExtend() {
	var args = arguments, a0 = args[0], a1 = args[1], a2 = args[2];
	// 第一个参数是函数类型，那么此时为类继承，并且第一个参数就是基类
	// 此时需要第二个参数是子类信息
	if (typeof a0 == 'function') {
		a1 = a1 || {};
		if (/function|number|string|undefined/.test(typeof a1))
			return;

		var f, de, c, spargs;

		// 对没有指定constructor的，指定默认的无参空构造函数
		if ('function' != typeof a1['_constructor']) {
			f = function() {
				a0.apply(this, arguments);
			}
		}
		else {
			// 对用户的构造函数进行一次封装，使其可以自动调用父类的构造函数
			// 这是OO的基础，new子类的时候一定是先调用父类的构造函数
			f = function() {
				// 保存构造函数的参数
				spargs = arguments;

				//调用父类构造函数
				a0.apply(this, spargs);

				// 调用构造函数
				a1['_constructor'].apply(this, spargs);
			}
		}

		// 实现继承
		var ff = function() {};
		ff.prototype = a0.prototype;
		f.prototype = new ff;
		f.prototype.constructor = f;

		// 父类指针
		f.prototype.base = a0;

		// 加入prototype方法
		var grep = /^name|_constructor|static|base$/;
		for (var i in a1) {
			if (grep.test(i))
				continue;
			f.prototype[i] = a1[i];
		}

		// 子类不可覆盖但可以调用的超类方法
		for (var i in a0.prototype) {
			if (i.indexOf('$') == 0) {
				a0.prototype[i.slice(1)] = f.prototype[i.slice(1)] = a0.prototype[i];
			}
		}

		// 加入有静态成员
		if (a1['static']) {
			for (var i in a1['static'])
				f[i] = a1['static'][i];
		}
		// 可选参数，向外部环境注册类名。
		// #1。用户需要全局名称并且全局空间不存在
		// #2。如果指定的外部为对象，则将类附加到该对象上
		if ('undefined' != typeof a1['name'] && /^[a-zA-Z]\w*$/.test(a1['name'])) {
			var s = 'object' == typeof a1['scope'] && a1['scope'] || window;
			s[a1['name']] = f;
		}
		return f;
	}
	// 以下走正常的extend逻辑
}
module.exports = xExtend;