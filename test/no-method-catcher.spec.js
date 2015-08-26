import {} from 'co-mocha';
import {expect} from 'chai';
import sinon from 'sinon';
import {Test, TestGenerator} from './test-subjects/class-subjects';

describe("Proxy", function () {
	describe("No generators", function () {
		var test;

		before(function () {
			test = new Test();
		});

		it("should call proxy method used in setup", function () {
			let data = test.testProxy(4, 2);
			expect(data).to.eql({ name: 'testProxy', args: [4, 2]});
		});

		it("should call actual method if it exists.", function () {
			let data = test.actualMethod('testActualMethod');
			expect(data).to.equal('testActualMethodCalled');
		});
	});

	describe("generators", function() {
		var test,
			resultOne,
			resultTwo;

		before(function * () {
			test = new TestGenerator();
			resultOne = yield* test.testProxy(4, 2);
			resultTwo = yield* test.actualMethod('testActualMethod');
		});

		it("should call proxy method used in setup", function() {
			expect(resultOne).to.eql({ name: 'testProxyGen', args: [4, 2]});
		});

		it("should call actual method if it exists", function() {
			expect(resultTwo).to.equal('testActualMethodGenCalled');
		})
	});
});
