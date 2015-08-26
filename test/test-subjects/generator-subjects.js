import NoMethodCatcher from '../no-method-catcher';
var testFn = function*() {
	yield
	return 'testFour';
}

export class TestDefinedGenerator {
	constructor(data) {
		this.data = data;
	}

	* testZero() {
		yield;
		return 'testZero';
	}

	* testOne() {
		yield;

		return this.data;
	}

	* testTwo(data) {
		yield;

		this.newData = data;

		yield;

		return 'testTwo';
	}


	* testThree() {
		yield;
		return this.newData;
	}

	* testFour() {
		let data = yield* testFn();
		return data;
	}
}

export class TestProxyGenerator extends NoMethodCatcher {
	constructor() {
		super(true);
		this.setup(this._defaultCall);

		return this.proxy();
	}

	* _defaultCall(name, args) {
		yield;
		this.data = args[0];
		yield;

		return name;
	}

	* testActualOnProxy() {
		let data = yield* testFn();

		return { thisData: this.data, fnData: data }
	}
}