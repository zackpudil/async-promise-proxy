import NoMethodCatcher from '../no-method-catcher';

export class Test extends NoMethodCatcher {
	constructor() {
		super();

		this.setup(this._catch);

		return this.proxy();
	}

	_catch(name, args) {
		return { name:name, args: args };
	}

	actualMethod(data) {
		return data + 'Called';
	}
}

export class TestGenerator extends NoMethodCatcher {
	constructor() {
		super(true);

		this.setup(this._catch);

		return this.proxy();
	}

	* _catch(name, args) {
		yield [];
		return { name: name + 'Gen', args: args };
	}

	* actualMethod(data) {
		yield [];
		data += 'Gen';
		yield [];
		return data + 'Called';
	}
}