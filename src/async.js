
export default function(makeGenerator) {
	return function () {
		var generator = makeGenerator.apply(this, arguments);

		function handle(result) {
			if(result.done) return Promise.resolve(result.value);

			return Promise.resolve(result.value).then(function (res) {
				return handle(generator.next(res));
			}, function (err) {
				handle(generator.throw(err));
			});
		}

		try {
			return handle(generator.next());
		} catch (ex) {
			return Promise.reject(ex);
		}
	}
}