Usage
-----

## GeneratorToPromise
Used to wraps a es6 class that has generator methods, and proxies it into a promise. This is better expained with an example:

es6 exmpale
```javascript
import req from 'some-request-library-that-supports-promises(like request-promise)';
import {GeneratorToPromise} from 'async-promise-proxy';

// NOTE this example is just to show case the yield -> then functionality.  This is not a great use-case.
class UserApi {
	* getUser(userId) {
		// in this instance think of yield* like await in the async/await C# 6.
		let user = yield* req.get({
			uri: `whatever.com/users/${userId}`
		});

		return user;
	}

	* postUser (user) {

		// one yield
		yield* req.post({
			uri: `whatever.com/`,
			json: user
		});

		// two yield, this will be the data in the .then(function(data) { })
		return yield* req.get({
			uri: 'whatever.com/${userId}'
		});
	}
}

// now we user the generator:

var userApi = new GeneratorToPromise(new UserApi());

// Now the calls to the generators will instead return promises.
userApi
	.getUser('someUserId')
	.then(function (data) {
		/* user data, that was returned in the UserApi.getUser */
		console.log(data);
	})
	.catch(function (err) {
		/* if an error happens this will be called */
		console.log(err);
	})

userApi
	.postUser({ userId: 'someUserId', name: 'someUser' })
	.then(function (data) {
		/* now this will be the last yield in the UserApi.postUser function, not the first yield */
		console.log(data);
	});

// You can even chain methods together:
someFakeApi
	.someMethodThatUpdatesTheUnderlyingInstance()
	.someOtherMethodThatUsesTheUpdatesFromThePreviousMethod()
	.then(console.log)
	// you can even chain off the thens
	.theLastMethodThatsCalled()
	.then(console.log);
```

## NoMethodCatcher

Inherit from this class to setup a __noSuchMethod__ like behavior in your class. Note this only works with node/io.js/ any server side js engine that supports the Proxy behavior.  For node.js however you don't need to run with the --harmony-proxies flag, including the library does that for you.

es6 example:
```javascript

import {NoMethodCatcher} from 'async-promise-proxy';

// class
class IAcceptAllMethods extends NoMethodCatcher {
	// these classes need constructors
	constructor() {
		super(); // call super(true) if your catch-all method is a generator.
		this.setup(this.catchTheMethods);

		// this is SUPER important, you must return this.proxy().
		return this.proxy();
	}

	// name will be the name of the unhandled method that got called, args is...the args.
	catchTheMethods(name, args) {
		console.log(`got unhandled method: ${name} with args ${args.join(", ")}`);
	}

	actualMethod() {
		console.log("Got a call on the actual method.");

		//note: if you want a fluent interface you have to return this.proxy() and not this
		return this.proxy();
	}
}

var test = new IAcceptAllMethods();

test.someMethodThatDoesntExist('does', 'not', 'exist') // --> got unhandled method: someMethodThatDoesntExist with args does, not, exist
test
	.actualMethod() // --> Got a call on the actual method.
	.soWhat('ever') // --> got unhandled method: soWhat with args ever

```