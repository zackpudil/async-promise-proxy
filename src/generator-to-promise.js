import async from './async';
import NoMethodCatcher from './no-method-catcher';

export default class extends NoMethodCatcher {

	constructor(generator) {
		super(false);

		this.setup(this._callGenerator);
		this.generator = generator;

		return this.proxy();
	}

	_callGenerator(name, args) {

		if(this.generator[name]) {
			this._updatePromise(function*() {
				let data = yield* this.generator[name].apply(this.generator, args);
				return data;
			});
		} 
		 else 
			throw 'no such method ' + name;

		return this.proxy();
	}

	_updatePromise(generatorFn) {
		if(this.promise)
			this.promise = this.promise.then(async(generatorFn.bind(this)));
		else
			this.promise = async(generatorFn.bind(this))();
	}

	then(fn) {
		this.promise = this.promise.then(fn);
		return this.proxy();
	}

	catch(fn) {
		this.promise = this.promise.catch(fn);
		return this.proxy();
	}
}