import {expect} from 'chai';
import GeneratorToPromiseDelegate from './generator-to-promise';
import {TestDefinedGenerator, TestProxyGenerator} from './test-subjects/generator-subjects';
import {checkDone} from './util';

describe("GeneratorToPromiseDelegate", function () {
	var gToPDelegate;
	
	describe("Defined methods", function () {

		before(function () {
			gToPDelegate = new GeneratorToPromiseDelegate(new TestDefinedGenerator('testOne'))
		});

		it("should create promise that on then returns the result of gen fn.", function (done) {
			gToPDelegate
				.testZero()
				.then(function (data) {
					checkDone(() => expect(data).to.equal('testZero'), done);
				});
		});

		it("should have access to generators context.", function (done) {
			gToPDelegate
				.testOne()
				.then(function (data) {
					checkDone(() => expect(data).to.equal('testOne'), done);
				})
		})

		it("should be able to chain gens with promises and context should be current.", function (done) {
			gToPDelegate
				.testTwo('testThree')
				.then(function (data) {
					checkDone(() => expect(data).to.equal('testTwo'), done, false);
				})
				.testThree()
				.then(function (data) {
					checkDone(() => expect(data).to.equal('testThree'), done);
				});
		});

		it("should call through yields through multiple methods.", function (done) {
			gToPDelegate
				.testFour()
				.then(function (data) {
					checkDone(() => expect(data).to.equal('testFour'), done);
				});
		});
	});

	describe("Proxy methods.", function () {
		before(function () {
			gToPDelegate = new GeneratorToPromiseDelegate(new TestProxyGenerator());
		});

		it("should pass proxy to the generator.", function (done) {
			gToPDelegate
				.testThisProxy('thisData')
				.then(function (data) {
					checkDone(() => expect(data).to.equal('testThisProxy'), done);
				});
		});

		it("should still call actual methods instead of proxy if they are defined.", function (done) {
			gToPDelegate
				.testActualOnProxy()
				.then(function (data) {
					checkDone( () => {
						expect(data.thisData).to.equal('thisData');
						expect(data.fnData).to.equal('testFour');
					}, done);
				});
		});

		it("should be able to chain proxy and actual methods.", function (done) {
			gToPDelegate
				.testAnotherProxy('thisData2')
				.testActualOnProxy()
				.then(function (data) {
					checkDone( () => {
						expect(data.thisData).to.equal('thisData2');
						expect(data.fnData).to.equal('testFour');
					}, done);
				});
		});
	});
});