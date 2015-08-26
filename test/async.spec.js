import {} from 'co-mocha';
import {expect} from 'chai';
import async from './async';
import {TestDefinedGenerator, TestProxyGenerator} from './test-subjects/generator-subjects';
import {checkDone} from './util';

var superComplicatedTest = function* () {
	var test = new TestProxyGenerator();
	var fakeMethodPrefix = 'test';
	var ret = '';
	for(var i = 0; i < 10; i++)
		ret += yield* test[fakeMethodPrefix + i]('data' + i);

	return ret;
};

describe("Async", function () {
	var testGen = new TestDefinedGenerator('testOne');

	it("should create a function that returns a promise.", function () {
		var promiseFunc = async(testGen.testZero);

		expect(promiseFunc).to.be.a('function');
		expect(promiseFunc()).to.be.a('Promise');
	});

	it("should on .then() return result of gen funciton.", function (done) {
		async(testGen.testFour)()
			.then(function (data) {
				checkDone(() => expect(data).to.be.equal('testFour'), done);
			});
	});

	it("should always return result on .then()", function (done) {
		async(superComplicatedTest)()
			.then(function(data) {
				checkDone(() => expect(data).to.be.equal('test0test1test2test3test4test5test6test7test8test9'), done);
			});
	});
});
