var apiUrl = "https://ally-ide-pst.herokuapp.com";
var api = `/ally-ide/python-runtime/output`;
var wait = localStorageGetItem("wait") || false;
var check_timeout = 300;

var blinkStatusLine = ((localStorageGetItem("blink") || "true") === "true");
var editorMode = localStorageGetItem("editorMode") || "normal";
var redirectStderrToStdout = ((localStorageGetItem("redirectStderrToStdout") || "false") === "true");
var editorModeObject = null;
var soundTimer = null

function encode(str) {
	return btoa(unescape(encodeURIComponent(str || "")));
}

function decode(bytes) {
	var escaped = escape(atob(bytes || ""));
	try {
		return decodeURIComponent(escaped);
	} catch {
		return unescape(escaped);
	}
}

function run(code) {
	soundTimer = setInterval(playRunningSound, 1000)

	var sourceValue = code;
	var stdinValue = ''
	var languageId = 71
	var compilerOptions = ''
	var commandLineArguments = ''

	var data = {
		code_content: sourceValue,
	};

	var sendRequest = function (data) {
		$.ajax({
			url: apiUrl + api,
			type: "POST",
			async: true,
			contentType: "application/json",
			data: JSON.stringify(data),
			xhrFields: {
				withCredentials: apiUrl.indexOf("/secure") != -1 ? true : false
			},
			success: function (data) {
				// console.log(`Your submission token is: ${data.token}`);
				// if (wait == true) {
				setTimeout(function () {
					handleResult(data);
				}, 1000)

				// } else {
				//     setTimeout(fetchSubmission.bind(null, data.token), check_timeout);
				// }
			},
			error: handleRunError
		});
	}

	var fetchAdditionalFiles = false;
	if (parseInt(languageId) === 82) {
		if (sqliteAdditionalFiles === "") {
			fetchAdditionalFiles = true;
			$.ajax({
				url: `https://minio.judge0.com/public/ide/sqliteAdditionalFiles.base64.txt?${Date.now()}`,
				type: "GET",
				async: true,
				contentType: "text/plain",
				success: function (responseData, textStatus, jqXHR) {
					sqliteAdditionalFiles = responseData;
					data["additional_files"] = sqliteAdditionalFiles;
					sendRequest(data);
				},
				error: handleRunError
			});
		}
		else {
			data["additional_files"] = sqliteAdditionalFiles;
		}
	}

	if (!fetchAdditionalFiles) {
		sendRequest(data);
	}
}

function handleRunError(jqXHR, textStatus, errorThrown) {
	clearInterval(soundTimer)
	document.getElementById('output').value = errorThrown
	document.getElementById('output').focus()
}

function fetchSubmission(submission_token) {
	$.ajax({
		url: apiUrl + "/submissions/" + submission_token + "?base64_encoded=true",
		type: "GET",
		async: true,
		success: function (data, textStatus, jqXHR) {
			if (data.status.id <= 2) { // In Queue or Processing
				setTimeout(fetchSubmission.bind(null, submission_token), check_timeout);
				return;
			}
			handleResult(data);
		},
		error: handleRunError
	});
}

function handleResult(data) {
	var stdout = data.output;
	var stderr = data.error;

	if (blinkStatusLine) {
		setTimeout(function () {
			blinkStatusLine = false;
			localStorageSetItem("blink", "false");
		}, 3000);
	}

	if (stderr != '') {
		var errorOutput = ''
		var errorLines = stderr.substring(0, stderr.length - 1).replace('in <module>').split(/\n/g)
		errorOutput += errorLines[errorLines.length - 1]
		var errorWords = stderr.substring(0, stderr.length - 1).split(' ')
		const lines = document.getElementById('editor').value.split(/\n/g);
		var errorLine = errorWords[errorWords.indexOf('line') + 1].replace(',', '').replace('\n', '')
		if (errorWords.includes('EOF') && errorLine == lines.length + 1) {
			errorLine = errorLine - 1
		}
		errorOutput += '. At line ' + errorLine + '.\n'
		if (errorWords[0] == 'Traceback') {
			errorOutput += errorLines[2].trim()
		}

		else {
			errorOutput += errorLines[1].trim()
		}
		document.getElementById('output').value = errorOutput
		document.getElementById('output').selectionStart = document.getElementById('output').selectionEnd = 0
		document.getElementById('output').setAttribute('data-is-error', 'true')
		document.getElementById('output').setAttribute('data-error-line', errorLine)
	}
	else if (stdout != '') {
		stdout = stdout.substring(0, stdout.length - 1)
		document.getElementById('output').value = stdout
		document.getElementById('output').selectionStart = document.getElementById('output').selectionEnd = 0
		document.getElementById('output').setAttribute('data-is-error', 'false')
	}

	clearInterval(soundTimer)

	setTimeout(function () {
		playSwitchSound()
		globals.outputView.focus()
	}, 200)

	// document.getElementById('output').scrollIntoView()
}