class TextEditor {
	constructor() {
		this.regex = new RegExp(/^(\s)*(if|elif|else|for|while|try|except|finally|def|class|with)(.)*(\:)(\s)*$/);
		this.spaceRegex = new RegExp(/^\s*/);

		globals.editor.addEventListener('keydown', e => this.onkeydown(e), true);
		globals.editor.addEventListener('keyup', e => this.onkeyup(e), true);
		globals.editor.addEventListener('mousedown', e => this.onmousedown(e), true);
		globals.editor.addEventListener('paste', e => this.onpaste(e), true);
		// globals.editor.addEventListener('focus', e => this.onfocus(e), true);
	}

	onfocus(e) {
		globals.setFocusVariableToView(globals.textEditorViewName);
		globals.isAltKeyDown = false;
		globals.isControlKeyDown = false;
	}

	onpaste(e) {
		if (globals.editor.value.trim() == '' || (globals.editor.selectionStart == 0 && globals.editor.selectionEnd == globals.editor.value.length)) {
			e.preventDefault()
			var pastedCode = (e.clipboardData || window.clipboardData).getData('text');
			globals.setFixedIndentedCode(pastedCode);
		}
	}

	onkeydown(e) {

		if (e.key == "Tab") {
			e.stopPropagation();
			e.preventDefault();
			var start = globals.editor.selectionStart;
			var end = globals.editor.selectionEnd;

			globals.editor.value = globals.editor.value.substring(0, start) + globals.getIndentationString(1) + globals.editor.value.substring(end);
			globals.editor.selectionStart = globals.editor.selectionEnd = start + globals.indentationSize;
		}

		if (e.key == "Enter") {
			if (globals.isAltKeyDown) {
				e.preventDefault()
				if (globals.errorCue) {
					clearInterval(globals.errorTimer)
					globals.errorTimer = null
				}
				globals.setFocusVariableToView(globals.codeOutputViewName)
				run(globals.editor.value)
				return;
			}
			const lines = globals.editor.value.split(/\n/g);
			var ln = globals.editor.value.substring(0, globals.editor.selectionStart).split(/\r\n|\r|\n/).length;
			if (lines[ln - 1].trim() == '') {
				// empty current line -> no event
				e.stopPropagation()
				e.preventDefault()
			}
			else if ((lines[ln - 1].trim() != '') && (ln < lines.length) && (lines[ln].trim() == '')) {
				var i = globals.editor.selectionStart
				var restOfLine = ''
				while (globals.editor.value[i] != '\n') {
					restOfLine += globals.editor.value[i]
					i += 1
					if (i >= globals.editor.value.length) {
						break
					}
				}
				if (restOfLine.trim() == '') {
					e.stopPropagation()
					e.preventDefault()
					globals.editor.selectionStart = globals.editor.selectionEnd = (globals.editor.selectionStart + 1 + lines[ln].length)
				}
			}
			else {
				if (globals.autoIndent) {
					e.preventDefault();
					var currentLineSubstr = globals.editor.value.substring(globals.editor.value.substring(0, globals.editor.selectionStart).lastIndexOf('\n') + 1, globals.editor.selectionStart)
					if (this.regex.test(currentLineSubstr)) {
						var currentIndentationString = lines[ln - 1].match(this.spaceRegex)[0]
						var start = globals.editor.selectionStart;
						var end = globals.editor.selectionEnd;

						globals.editor.value = globals.editor.value.substring(0, start) + "\n" + currentIndentationString + globals.getIndentationString(1) + globals.editor.value.substring(end);
						globals.editor.selectionStart = globals.editor.selectionEnd = start + currentIndentationString.length + globals.indentationSize + 1;
					}
					else {
						var currentIndentationString = lines[ln - 1].match(this.spaceRegex)[0]
						var start = globals.editor.selectionStart;
						var end = globals.editor.selectionEnd;

						globals.editor.value = globals.editor.value.substring(0, start) + "\n" + currentIndentationString + globals.editor.value.substring(end);
						globals.editor.selectionStart = globals.editor.selectionEnd = start + currentIndentationString.length + 1;
					}
				}
			}
		}

		if (e.key == "Backspace") {
			if (globals.autoIndent) {
				var currentLineSubstr = globals.editor.value.substring(globals.editor.value.substring(0, globals.editor.selectionStart).lastIndexOf('\n') + 1, globals.editor.selectionStart)
				if (currentLineSubstr.length > 0 && currentLineSubstr.trim() == '') {
					e.preventDefault()
					var spacesToBeDeleted = (currentLineSubstr.length % globals.indentationSize) == 0 ? globals.indentationSize : (currentLineSubstr.length % globals.indentationSize);
					var start = globals.editor.selectionStart;
					var end = globals.editor.selectionEnd;

					globals.editor.value = globals.editor.value.substring(0, start - spacesToBeDeleted) + globals.editor.value.substring(end);
					globals.editor.selectionStart = globals.editor.selectionEnd = start - spacesToBeDeleted;
				}
			}
		}
		if (
			// arrow up and down should change a global line number
			// arrow left and right should change a global position
			e.key == "ArrowUp" ||
			e.key == "ArrowDown" ||
			e.key == "ArrowLeft" ||
			e.key == "ArrowRight"
		) {

			globals.tableEditorArrowKey = true;
		}

		if (e.key == "Control") {
			globals.isControlKeyDown = true;
		}

		if (e.altKey) {
			globals.isAltKeyDown = true;
		}
		if (e.key == "1") {
			if (globals.isControlKeyDown) {
				e.preventDefault();
			}
		}
		if (e.key == "2") {
			if (globals.isControlKeyDown) {
				e.preventDefault();
				globals.setFocusVariableToView(globals.tableEditorViewName);
			}
		}

		if (e.key == "3") {
			if (globals.isControlKeyDown) {
				e.preventDefault();
				globals.setFocusVariableToView(globals.codeTreeViewName)
			}
		}

		if (e.key == "4") {
			if (globals.isControlKeyDown) {
				playSwitchSound()
				globals.setFocusVariableToView(globals.bookmarksViewName);
				if (globals.bookmarkObject.treeitems.length > 0) {
					globals.bookmarkObject.treeitems[0].domNode.focus();
				} else {
					globals.bookmarkObject.domNode.focus();
				}
			}
		}

		if (e.key == "5") {
			if (globals.isControlKeyDown) {
				e.preventDefault()
				if (globals.errorCue) {
					clearInterval(globals.errorTimer)
					globals.errorTimer = null
				}
				// clearInterval(globals.tableObject.currentRow.currentCell.timer)
				// globals.tableObject.currentRow.currentCell.timer = null
				globals.setFocusVariableToView(globals.codeOutputViewName);
				playSwitchSound()
				globals.outputView.focus()
			}
		}

		if (e.key == "l") {
			// current line and scope
			if (globals.isControlKeyDown) {
				e.preventDefault()
				var currentScopeName = "Global";
				if (globals.localScopeList[globals.currentLineNumber - 1] > 0) {
					currentScopeName = globals.localCodeList[globals.currentLineNumber - 1][globals.localScopeList[globals.currentLineNumber - 1] - 1].content.split(" ")[1];
				}
				document.getElementById("current_scope").innerHTML = "At " + currentScopeName + "'s scope";

				document.getElementById("current_line").innerHTML = "At Line " + globals.currentLineNumber + " Level " + (globals.localScopeList[globals.currentLineNumber - 1] + 1) + " in " + globals.currentViewName;
				textToSpeech(document.getElementById('current_line').innerHTML)
			}
		}

		if (e.key == 'g') {
			// go to option
			if (globals.isControlKeyDown) {
				e.preventDefault()
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
		}

		if (e.key == 'p') {
			// problems window
			if (globals.isControlKeyDown) {
				e.preventDefault()
				globals.samplesMenuObject.openContextMenu(20, 20, document.currentElement)
			}
		}

		setTimeout(function () {
			if (globals.isTableFocused) {
				for (var i = 0; i < globals.tableObject.currentRow.cells.length; i++) {
					if (globals.tableObject.currentRow.cells[i].domNode.innerHTML == '') {
						break
					}
					globals.tableObject.currentRow.currentCell = globals.tableObject.currentRow.cells[i]
				}
				globals.tableObject.currentRow.currentCell.domNode.focus();
				playSwitchSound()
				return
			}
			if (globals.isTreeFocused) {
				globals.treeObject.currentNode.domNode.focus();
				playSwitchSound()
			}
			if (globals.isBookmarkFocused) {
				if (globals.bookmarkObject.treeitems.length > 0) {
					globals.bookmarkObject.currentNode = globals.bookmarkObject.treeitems[0];
					globals.bookmarkObject.treeitems[0].domNode.focus();
				} else {
					globals.bookmarkObject.domNode.focus();
				}
				playSwitchSound()
			}
			if (globals.isEditorFocused) {
				var code = globals.editor.value;
				window.myCode = code;
				var currentPosition = globals.editor.selectionStart;
				window.currentPosition = currentPosition;

				globals.currentLineNumber = code.substring(0, currentPosition).split(/\r\n|\r|\n/).length;
				document.getElementById("current_line").innerHTML = "At Line " + globals.currentLineNumber + " Level " + (globals.localScopeList[globals.currentLineNumber - 1] + 1) + " in " + globals.currentViewName;
				globals.contextMenuObject.currentLineNumber = globals.currentLineNumber;
				if (!globals.tableEditorArrowKey) {
					var { astString, lineScope, codeList, errorLineNumberList, variableList } = globals.parser.travarseCode(code, currentPosition, globals.currentLineNumber);
					globals.astParser.parseAST(code)
					globals.localCodeList = codeList;
					globals.contextMenuObject.localCodeList = globals.localCodeList;
					globals.localScopeList = lineScope;
					globals.localErrorList = errorLineNumberList;
					globals.contextMenuObject.localScopeList = globals.localScopeList;
				}

				globals.tableEditorArrowKey = false;
				var currentLineElements = globals.localCodeList[globals.currentLineNumber - 1];
				for (var e = 0; e < currentLineElements.length; e++) {
					if (currentPosition >= currentLineElements[e].start && currentPosition < currentLineElements[e].end) {
						globals.currentElement = currentLineElements[e];
						globals.currentScopeCount = currentLineElements[e].leftScope;
						break;
					}
					else if (currentPosition == currentLineElements[e].end) {
						globals.currentElement = currentLineElements[e];
						globals.currentScopeCount = currentLineElements[e].rightScope;
						break;
					}
				}
				if (currentLineElements.length == 0) {
					globals.currentElement = new Element("", currentPosition, currentPosition, 0, 0, 0);
					globals.localCodeList[globals.currentLineNumber - 1].push(globals.currentElement);
					globals.currentScopeCount = 0;
					globals.isBeginningScope = false;
				}
				if (globals.currentElement.content.includes("within")) {
					globals.isBeginningScope = true;
				}
				else {
					globals.isBeginningScope = false;
				}

				globals.codeTree = new CodeTree();
				globals.codeTree.buildCodeTree(globals.localCodeList, globals.localScopeList, globals.localErrorList, globals.currentLineNumber);
				globals.codeTree.initTableString();
				globals.codeTree.getView(globals.codeTree.head.firstChild);
				console.log(globals.codeTree.head.firstChild)

				var treeString = globals.codeTree.treeString;
				var tableString = globals.codeTree.tableString + "</tbody></table>";

				globals.treeView.innerHTML = treeString;
				globals.tableView.innerHTML = tableString;

				var trees = document.querySelectorAll('[role="tree"]');
				globals.treeObject = new TreeLinks(trees[0]);
				globals.treeObject.init();

				var tables = document.querySelectorAll('[role="table"]');
				globals.tableObject = new Table(tables[0], variableList);
				globals.tableObject.init();
				// globals.parseTreeView.open()
				// globals.parseTreeView.writeln(astString)
				// globals.parseTreeView.close()
			}
		}, 100);
	};

	onkeyup(e) {
		if (e.key == "Control") {
			globals.isControlKeyDown = false;
		}
		if (e.altKey) {
			globals.isAltKeyDown = false;
		}
		if (
			// arrow up and down should change a global line number
			// arrow left and right should change a global position
			e.key == "ArrowUp" ||
			e.key == "ArrowDown" ||
			e.key == "ArrowLeft" ||
			e.key == "ArrowRight"
		) {
			globals.tableEditorArrowKey = false;
		}
	};


	onmousedown(e) {
		if (e.which == 3) {
			e.preventDefault();
		}
	};

}