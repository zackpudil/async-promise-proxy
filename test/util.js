export function checkDone(fn, done, callDoneOnSuccess = true) {
	try {
		fn();
	} catch (ex) {
		done(ex);
		return;
	}

	if(callDoneOnSuccess)
		done();
}