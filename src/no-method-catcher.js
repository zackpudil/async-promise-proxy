import nosuchmethod from 'node-nosuchmethod';

export default class {
	constructor(isGenerator = false) {
		this.isGenerator = isGenerator;
	}

	setup(catchFn) {
		this.catchFn = catchFn;
	}

	_defaultNoSuchMethod(name, args) {
		if(this[name])
			return this[name].apply(this, args);

		return this.catchFn.apply(this, [name, args]);
	}

	* _defaultNoSuchMethodForGenerator(name, args) {
		let ret;
		if(this[name])
			ret = yield* this[name].apply(this, args);
		else
			ret = yield* this.catchFn.apply(this, [name, args]);

		return ret;
	}

	proxy() {
		if(this.isGenerator)
			return nosuchmethod(this, this._defaultNoSuchMethodForGenerator.bind(this));
		else
			return nosuchmethod(this, this._defaultNoSuchMethod.bind(this));
	}
}