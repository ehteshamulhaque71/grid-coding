function errorCue() {
	var errors = document.getElementById('table').querySelectorAll('[data-error-line="true"]')
	if (errors.length > 0) {
		playErrorCue();
	}
}

function loadDemoTask() {
	var code =
		`a = 10
if a > 0:
 for i in range(a):
  print(i)
else:
 print("nothing to print")`
	document.getElementById('editor').value = globals.fixIndentation(code)
	document.getElementById('editor').selectionStart = document.getElementById('editor').selectionEnd = 0
}


$(document).ready(function () {
	globals.parser = new Parser(window.myParser.parser);
	globals.astParser = new ASTParser();

	globals.editor = document.getElementById("editor");
	globals.tableView = document.getElementById("table");
	globals.treeView = document.getElementById("tree");
	globals.bookmarkView = document.getElementById("bookmark");
	globals.outputView = document.getElementById("output");
	globals.parseTreeView = document.getElementById("ast").contentWindow.document;
	globals.helpDialog = document.getElementById("dialog");

	globals.isControlKeyDown = false
	globals.isAltKeyDown = false
	globals.currentLineNumber = 1;
	globals.isBeginningScope = false;
	globals.currentScopeCount = 0;

	// configs
	globals.indentationSize = 1

	globals.autoIndent = true
	globals.errorCue = true
	globals.realTimeErrorBeep = true
	globals.replaceTabs = true
	globals.isContextMenuOpen = false
	globals.isDialogOpen = false
	globals.isDetailIndentationBlockEnabled = false
	globals.errorBeepTimerInterval = 15
	globals.errorCueTimerInterval = 40
	globals.lastActiveElement = globals.editor


	globals.statementList = [new Statement(1)]
	globals.variablesList = []
	globals.errorLineNumberList = [];

	globals.treeObject = null;
	globals.tableObject = null;

	globals.isEditorFocused = false;
	globals.isTableFocused = false;
	globals.isTreeFocused = false;
	globals.isBookmarkFocused = false;
	globals.isOutputFocused = false;
	globals.tableEditorArrowKey = false;
	globals.isNavbarFocused = false;

	globals.localCodeList = [[]];
	globals.localScopeList = [0];
	globals.localErrorList = [];

	globals.bookmarkList = [];
	globals.errorTimer = setInterval(errorCue, globals.errorCueTimerInterval * 1000);

	globals.currentElement = new Element("", 0, 0, 0, 0, 0);
	globals.codeTree = new CodeTree();

	globals.contextMenu = document.getElementById("menubutton");
	globals.contextMenuObject = new Menubutton(
		globals.contextMenu,
		globals.bookmarkList,
		globals.currentLineNumber,
		globals.localCodeList,
		globals.localScopeList,
		globals.editor
	);
	globals.contextMenuObject.init();

	globals.alertMenu = document.getElementById("alertbutton");
	globals.alertMenuObject = new Menubutton(globals.alertMenu, null, null, null, null, null);
	globals.alertMenuObject.init();

	globals.editor.focus();
	globals.setFocusVariableToView(globals.textEditorViewName);

	var textEditorObject = new TextEditor();
	var tableEditorObject = new TableEditor();
	var outputViewObject = new OutputView();
	var alertMenuViewObject = new AlertMenuView();
	loadDemoTask();


	document.oncontextmenu = function (e) {
		e.stopPropagation();
		e.preventDefault();
		console.log(globals.isOutputFocused)
		if (globals.isBookmarkFocused) {
			globals.contextMenu = document.getElementById("menubutton-bookmark");
			globals.contextMenuObject = new Menubutton(
				globals.contextMenu,
				globals.bookmarkList,
				globals.currentLineNumber,
				globals.localCodeList,
				globals.localScopeList,
				globals.editor
			);
			globals.contextMenuObject.init();
			globals.contextMenuObject.openContextMenu(
				e.pageX,
				e.pageY,
				document.activeElement
			);
		}
		else if (globals.isOutputFocused) {
			console.log("here")
			if (document.getElementById('output').getAttribute('data-is-error') == 'true') {
				var errorLine = parseInt(document.getElementById('output').getAttribute('data-error-line'))
				document.getElementById('goto-editor_output').innerHTML = 'Go to line ' + errorLine + ' in Text Editor'
				document.getElementById('goto-table_output').innerHTML = 'Go to line ' + errorLine + ' in Table Editor'
				// document.getElementById('goto-tree_output').innerHTML = 'Go to line ' + errorLine + ' in Code Tree'
			}
			else if (document.getElementById('output').getAttribute('data-is-error') == 'false') {
				document.getElementById('goto-editor_output').innerHTML = 'Go to current line in Text Editor'
				document.getElementById('goto-table_output').innerHTML = 'Go to current line in Table Editor'
				// document.getElementById('goto-tree_output').innerHTML = 'Go to current line in Code Tree'
			}

			globals.contextMenu = document.getElementById("menubutton-output");
			globals.contextMenuObject = new Menubutton(
				globals.contextMenu,
				globals.bookmarkList,
				globals.currentLineNumber,
				globals.localCodeList,
				globals.localScopeList,
				globals.editor
			);
			globals.contextMenuObject.init();
			globals.contextMenuObject.openContextMenu(
				e.pageX,
				e.pageY,
				document.activeElement
			);
		}
		else {
			globals.contextMenu = document.getElementById("menubutton");
			globals.contextMenuObject = new Menubutton(
				globals.contextMenu,
				globals.bookmarkList,
				globals.currentLineNumber,
				globals.localCodeList,
				globals.localScopeList,
				globals.editor
			);
			globals.contextMenuObject.init();
			if (globals.isTableFocused) {
				globals.currentLineNumber = globals.tableObject.currentRow.rowNumber;
			}
			if (globals.isTreeFocused) {
				globals.currentLineNumber =
					globals.treeObject.currentNode.domNode.getAttribute("data-line-number");
			}
			var currentScopeName = "Global";
			if (globals.localScopeList[globals.currentLineNumber - 1] > 0) {
				currentScopeName =
					globals.localCodeList[globals.currentLineNumber - 1][
						globals.localScopeList[globals.currentLineNumber - 1] - 1
					].content.split(" ")[1];
			}

			document.getElementById("current_scope").innerHTML =
				"At " + currentScopeName + "'s scope";

			document.getElementById("current_line").innerHTML =
				"At Line " + globals.currentLineNumber + " Level " + (globals.localScopeList[globals.currentLineNumber - 1] + 1) + " in " + globals.currentViewName;
			globals.contextMenuObject.openContextMenu(
				e.pageX,
				e.pageY,
				document.activeElement
			);
		}
	};

	document.onkeydown = function (e) {
		// if (e.key == "Tab") {
		//     e.preventDefault();
		// }
		if (e.key == "Control") {
			globals.isControlKeyDown = true;
		}
		if (e.altKey) {
			globals.isAltKeyDown = true;
		}
		if (e.key == "9") {
			if (globals.isControlKeyDown) {
				e.stopPropagation();
				e.preventDefault();
				window.open("./help.html", "_blank");
			}
		}
		if (e.key == '0') {
			console.log(globals.currentViewName)
			if (globals.isControlKeyDown) {
				e.stopPropagation();
				e.preventDefault();
				if (globals.isBookmarkFocused) {
					globals.contextMenu = document.getElementById("menubutton-bookmark");
					globals.contextMenuObject = new Menubutton(
						globals.contextMenu,
						globals.bookmarkList,
						globals.currentLineNumber,
						globals.localCodeList,
						globals.localScopeList,
						globals.editor
					);
					globals.contextMenuObject.init();
					globals.contextMenuObject.openContextMenu(
						window.screen.availWidth / 2 - 250,
						window.screen.availHeight / 2 - 150,
						document.activeElement
					);
				}
				else if (globals.isOutputFocused) {
					if (document.getElementById('output').getAttribute('data-is-error') == 'true') {
						var errorLine = parseInt(document.getElementById('output').getAttribute('data-error-line'))
						document.getElementById('goto-editor_output').innerHTML = 'Go to line ' + errorLine + ' in Text Editor'
						document.getElementById('goto-table_output').innerHTML = 'Go to line ' + errorLine + ' in Table Editor'
						// document.getElementById('goto-tree_output').innerHTML = 'Go to line ' + errorLine + ' in Code Tree'
					}
					else if (document.getElementById('output').getAttribute('data-is-error') == 'false') {
						document.getElementById('goto-editor_output').innerHTML = 'Go to current line in Text Editor'
						document.getElementById('goto-table_output').innerHTML = 'Go to current line in Table Editor'
						// document.getElementById('goto-tree_output').innerHTML = 'Go to current line in Code Tree'
					}

					globals.contextMenu = document.getElementById("menubutton-output");
					globals.contextMenuObject = new Menubutton(
						globals.contextMenu,
						globals.bookmarkList,
						globals.currentLineNumber,
						globals.localCodeList,
						globals.localScopeList,
						globals.editor
					);
					globals.contextMenuObject.init();
					globals.contextMenuObject.openContextMenu(
						window.screen.availWidth / 2 - 250,
						window.screen.availHeight / 2 - 150,
						document.activeElement
					);
				}
				else {
					globals.contextMenu = document.getElementById("menubutton");
					globals.contextMenuObject = new Menubutton(
						globals.contextMenu,
						globals.bookmarkList,
						globals.currentLineNumber,
						globals.localCodeList,
						globals.localScopeList,
						globals.editor
					);
					globals.contextMenuObject.init();
					if (globals.isTableFocused) {
						globals.currentLineNumber = globals.tableObject.currentRow.rowNumber;
					}
					if (globals.isTreeFocused) {
						globals.currentLineNumber =
							globals.treeObject.currentNode.domNode.getAttribute("data-line-number");
					}
					var currentScopeName = "Global";
					if (globals.localScopeList[globals.currentLineNumber - 1] > 0) {
						currentScopeName =
							globals.localCodeList[globals.currentLineNumber - 1][
								globals.localScopeList[globals.currentLineNumber - 1] - 1
							].content.split(" ")[1];
					}

					document.getElementById("current_scope").innerHTML =
						"At " + currentScopeName + "'s scope";

					document.getElementById("current_line").innerHTML =
						"At Line " + globals.currentLineNumber + " Level " + (globals.localScopeList[globals.currentLineNumber - 1] + 1) + " in " + globals.currentViewName;
					globals.contextMenuObject.openContextMenu(
						window.screen.availWidth / 2 - 250,
						window.screen.availHeight / 2 - 150,
						document.activeElement
					);
				}
			}
		}
	};

	document.onkeyup = function (e) {
		if (e.key == "Control") {
			globals.isControlKeyDown = false;
		}
		if (e.altKey) {
			globals.isAltKeyDown = false;
		}
	};


	document.getElementById('help').onkeydown = function (e) {
		if (e.key == "Enter") {
			e.preventDefault()
			setTimeout(function () {
				openDialog('helpDialog', document.activeElement, 'help_dialog_label')
			}, 400)
		}
	};


	document.getElementById('configuration').onkeydown = function (e) {
		if (e.key == "Enter") {
			e.preventDefault()
			setTimeout(function () {
				document.getElementById('indentationSizeConfig').value = globals.indentationSize
				document.getElementById('autoIndentConfig').checked = globals.autoIndent
				document.getElementById('errorCueEnableConfig').checked = globals.errorCue
				document.getElementById('notificationIntervalConfig').value = globals.errorCueTimerInterval
				document.getElementById('indentationBlockDetailsEnableConfig').checked = globals.isDetailIndentationBlockEnabled
				// document.getElementById('beepIntervalConfig').value = globals.errorBeepTimerInterval
				openDialog('configurationDialog', document.activeElement, 'config_dialog_label')
			}, 400)
		}
	};

	document.getElementById('configurationSaveBtn').onclick = function (e) {
		if (globals.indentationSize != parseInt(document.getElementById('indentationSizeConfig').value)) {
			globals.indentationSize = parseInt(document.getElementById('indentationSizeConfig').value)
			globals.setFixedIndentedCode(globals.editor.value);
		}
		globals.autoIndent = document.getElementById('autoIndentConfig').checked
		globals.errorCue = document.getElementById('errorCueEnableConfig').checked
		if (globals.isDetailIndentationBlockEnabled != document.getElementById('indentationBlockDetailsEnableConfig').checked) {
			globals.isDetailIndentationBlockEnabled = document.getElementById('indentationBlockDetailsEnableConfig').checked
			if (globals.isDetailIndentationBlockEnabled) {
				globals.tableObject.addCondition()
			}
			else {
				globals.tableObject.removeCondition()
			}
		}
		globals.isDetailIndentationBlockEnabled = document.getElementById('indentationBlockDetailsEnableConfig').checked
		globals.errorCueTimerInterval = parseInt(document.getElementById('notificationIntervalConfig').value)
		// globals.errorBeepTimerInterval = parseInt(document.getElementById('beepIntervalConfig').value)
		clearInterval(globals.errorTimer)
		globals.errorTimer = null
		globals.errorTimer = setInterval(errorCue, globals.errorCueTimerInterval * 1000)
		closeDialog(this)
	}
	document.getElementById('configurationCloseBtn').onclick = function (e) {
		closeDialog(this)
	}

	document.getElementById('helpCloseBtn').onclick = function (e) {
		closeDialog(this)
	}

	document.getElementById('run_code').onkeydown = function (e) {
		if (e.key == "Enter") {
			e.preventDefault()
			globals.setFocusVariableToView(globals.codeOutputViewName);
			run(globals.editor.value)
		}
	};

	document.getElementById('jump_first').onkeydown = function (e) {
		if (e.key == "Enter") {
			console.log(globals.currentViewName)
			e.preventDefault()
			globals.editor.selectionStart = globals.editor.selectionEnd = globals.treeObject.treeitems[0].domNode.getAttribute('data-line-end')
			globals.treeObject.currentNode = globals.treeObject.treeitems[0]
			globals.tableObject.currentRow = globals.tableObject.rows[1]
			for (var i = 0; i < globals.tableObject.currentRow.cells.length; i++) {
				if (globals.tableObject.currentRow.cells[i].domNode.innerHTML == '') {
					break
				}
				globals.tableObject.currentRow.currentCell = globals.tableObject.currentRow.cells[i]
			}
			setTimeout(function () {
				if (globals.isEditorFocused) {
					globals.editor.focus()
				}
				else if (globals.isTableFocused) {
					globals.tableObject.currentRow.currentCell.domNode.focus()
				}
				else if (globals.isTreeFocused) {
					globals.treeObject.currentNode.domNode.focus()
				}
			}, 400)
		}
	};

	document.getElementById('go_line').onkeydown = function (e) {
		if (e.key == "Enter") {
			var line = window.prompt('Enter a line number between ' + 1 + ' and ' + globals.treeObject.treeitems.length)
			line = parseInt(line)
			globals.editor.selectionStart = globals.editor.selectionEnd = globals.treeObject.treeitems[line - 1].domNode.getAttribute('data-line-end')
			globals.treeObject.currentNode = globals.treeObject.treeitems[line - 1]
			globals.tableObject.currentRow = globals.tableObject.rows[line]
			for (var i = 0; i < globals.tableObject.currentRow.cells.length; i++) {
				if (globals.tableObject.currentRow.cells[i].domNode.innerHTML == '') {
					break
				}
				globals.tableObject.currentRow.currentCell = globals.tableObject.currentRow.cells[i]
			}
			setTimeout(function () {
				if (globals.isEditorFocused) {
					globals.editor.focus()
				}
				else if (globals.isTableFocused) {
					globals.tableObject.currentRow.currentCell.domNode.focus()
				}
				else if (globals.isTreeFocused) {
					globals.treeObject.currentNode.domNode.focus()
				}
			}, 400)
		}
	};

	document.getElementById('jump_last').onkeydown = function (e) {
		if (e.key == "Enter") {
			e.preventDefault()
			globals.editor.selectionStart = globals.editor.selectionEnd = globals.treeObject.treeitems[globals.treeObject.treeitems.length - 1].domNode.getAttribute('data-line-end')
			globals.treeObject.currentNode = globals.treeObject.treeitems[globals.treeObject.treeitems.length - 1]
			globals.tableObject.currentRow = globals.tableObject.rows[globals.tableObject.rows.length - 1]
			for (var i = 0; i < globals.tableObject.currentRow.cells.length; i++) {
				if (globals.tableObject.currentRow.cells[i].domNode.innerHTML == '') {
					break
				}
				globals.tableObject.currentRow.currentCell = globals.tableObject.currentRow.cells[i]
			}
			setTimeout(function () {
				if (globals.isEditorFocused) {
					globals.editor.focus()
				}
				else if (globals.isTableFocused) {
					globals.tableObject.currentRow.currentCell.domNode.focus()
				}
				else if (globals.isTreeFocused) {
					globals.treeObject.currentNode.domNode.focus()
				}
			}, 400)
		}
	};

	document.getElementById("goto-editor_output").onkeydown = function (e) {
		if (e.key == "Enter") {

			if (document.getElementById('output').value.trim() == '') {
				var line = 1
			}
			else if (document.getElementById('output').getAttribute('data-is-error') == 'true') {
				var line = parseInt(document.getElementById('output').getAttribute('data-error-line'))
			}
			else if (document.getElementById('output').getAttribute('data-is-error') == 'false') {
				var line = parseInt(globals.treeObject.currentNode.domNode.getAttribute('data-line-number'))
			}
			globals.editor.selectionStart = globals.editor.selectionEnd = globals.treeObject.treeitems[line - 1].domNode.getAttribute('data-line-end')
			globals.treeObject.currentNode = globals.treeObject.treeitems[line - 1]
			globals.tableObject.currentRow = globals.tableObject.rows[line]
			for (var i = 0; i < globals.tableObject.currentRow.cells.length; i++) {
				if (globals.tableObject.currentRow.cells[i].domNode.innerHTML == '') {
					break
				}
				globals.tableObject.currentRow.currentCell = globals.tableObject.currentRow.cells[i]
			}
			setTimeout(function () {
				playSwitchSound()
				globals.editor.focus()
				globals.setFocusVariableToView(globals.textEditorViewName);
			}, 400)
		}
	}

	document.getElementById("goto-table_output").onkeydown = function (e) {
		if (e.key == "Enter") {
			if (document.getElementById('output').value.trim() == '') {
				var line = 1
			}
			else if (document.getElementById('output').getAttribute('data-is-error') == 'true') {
				var line = parseInt(document.getElementById('output').getAttribute('data-error-line'))
			}
			else if (document.getElementById('output').getAttribute('data-is-error') == 'false') {
				var line = parseInt(globals.treeObject.currentNode.domNode.getAttribute('data-line-number'))
			}
			globals.editor.selectionStart = globals.editor.selectionEnd = globals.treeObject.treeitems[line - 1].domNode.getAttribute('data-line-end')
			globals.treeObject.currentNode = globals.treeObject.treeitems[line - 1]
			globals.tableObject.currentRow = globals.tableObject.rows[line]
			for (var i = 0; i < globals.tableObject.currentRow.cells.length; i++) {
				if (globals.tableObject.currentRow.cells[i].domNode.innerHTML == '') {
					break
				}
				globals.tableObject.currentRow.currentCell = globals.tableObject.currentRow.cells[i]
			}
			setTimeout(function () {
				playSwitchSound()
				globals.tableObject.currentRow.currentCell.domNode.focus()
				globals.setFocusVariableToView(globals.tableEditorViewName);
			}, 400)
		}
	}
});
