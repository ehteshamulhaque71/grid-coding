class TableEditor {
	constructor() {
		this.viewName = "Table Editor";

		globals.tableView.addEventListener('keydown', e => this.onkeydown(e), true);
		globals.tableView.addEventListener('keyup', e => this.onkeyup(e), true);
		globals.tableView.addEventListener('mousedown', e => this.onmousedown(e), true);
	}

	onkeydown(e) {
		if (e.key == "Tab") {
			e.stopPropagation()
			e.preventDefault();
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
				// clearInterval(globals.tableObject.currentRow.currentCell.timer)
				// globals.tableObject.currentRow.currentCell.timer = null
				playSwitchSound()

				globals.setFocusVariableToView("Text Editor");

				globals.editor.focus();
				globals.editor.selectionStart = globals.editor.selectionEnd =
					globals.tableObject.currentRow.domNode.getAttribute(
						"data-line-end"
					);
			}
		}

		if (e.key == "2") {
			if (globals.isControlKeyDown) {
				e.preventDefault();
			}
		}

		if (e.key == "3") {
			if (globals.isControlKeyDown) {
				e.preventDefault();
				// clearInterval(globals.tableObject.currentRow.currentCell.timer)
				// globals.tableObject.currentRow.currentCell.timer = null
				playSwitchSound()

				globals.setFocusVariableToView("Code Tree");

				globals.treeObject.currentNode.domNode.focus();
			}
		}

		if (e.key == "4") {
			if (globals.isControlKeyDown) {
				e.preventDefault();
				// clearInterval(globals.tableObject.currentRow.currentCell.timer)
				// globals.tableObject.currentRow.currentCell.timer = null
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

		if (e.key == "Enter") {
			if (globals.isAltKeyDown) {
				e.preventDefault()
				if (globals.errorCue) {
					clearInterval(globals.errorTimer)
					globals.errorTimer = null
				}
				// clearInterval(globals.tableObject.currentRow.currentCell.timer)
				// globals.tableObject.currentRow.currentCell.timer = null
				globals.setFocusVariableToView(globals.codeOutputViewName);
				run(globals.editor.value)
			}
		}

		if (e.key == "l") {
			if (globals.isControlKeyDown) {
				e.preventDefault()
				globals.currentLineNumber = globals.tableObject.currentRow.rowNumber;
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
				textToSpeech(document.getElementById('current_line').innerHTML)
			}
		}

		if (e.key == 'g') {
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

		if (e.key == 'Backspace') {
			if (globals.tableObject.openAlert) {
				globals.tableObject.openAlert = false
				globals.alertMenu = document.getElementById('alertbutton')
				globals.alertMenuObject = new Menubutton(globals.alertMenu, null, null, null, null, null);
				globals.alertMenuObject.init();
				globals.alertMenuObject.openContextMenu(20, 20, document.activeElement)
			}
		}

		setTimeout(function () {
			if (globals.isTableFocused) {
				var currentPosition =
					globals.tableObject.currentRow.domNode.getAttribute(
						"data-line-end"
					);
				globals.currentLineNumber =
					globals.tableObject.currentRow.domNode.getAttribute(
						"data-line-number"
					);

				var code = globals.tableObject.getTableContent();

				globals.editor.value = code;

				var { astString, lineScope, codeList, errorLineNumberList, variableList } =
					globals.parser.travarseCode(
						code,
						currentPosition,
						globals.currentLineNumber
					);
				globals.tableObject.variableList = variableList
				globals.localCodeList = codeList;
				globals.localScopeList = lineScope;
				globals.localErrorList = errorLineNumberList;

				var currentLineElements = globals.localCodeList[globals.currentLineNumber - 1];

				for (var e = 0; e < currentLineElements.length; e++) {
					if (
						currentPosition >= currentLineElements[e].start &&
						currentPosition < currentLineElements[e].end
					) {
						globals.currentElement = currentLineElements[e];
						globals.currentScopeCount = currentLineElements[e].leftScope;
						break;
					} else if (currentPosition == currentLineElements[e].end) {
						globals.currentElement = currentLineElements[e];
						globals.currentScopeCount = currentLineElements[e].rightScope;
						break;
					}
				}

				if (currentLineElements.length == 0) {
					globals.currentElement = new Element(
						"",
						currentPosition,
						currentPosition,
						0,
						0,
						0
					);
					globals.localCodeList[globals.currentLineNumber - 1].push(globals.currentElement);
					globals.currentScopeCount = 0;
					globals.isBeginningScope = false;
				}

				if (globals.currentElement.content.includes("within")) {
					globals.isBeginningScope = true;
				} else {
					globals.isBeginningScope = false;
				}

				globals.codeTree = new CodeTree();
				globals.codeTree.buildCodeTree(globals.localCodeList, globals.localScopeList, globals.localErrorList, globals.currentLineNumber);
				globals.codeTree.initTableString();
				globals.codeTree.getView(globals.codeTree.head.firstChild);

				var treeString = globals.codeTree.treeString;
				var tableString = globals.codeTree.tableString + "</tbody></table>";

				globals.treeView.innerHTML = treeString;

				var trees = document.querySelectorAll('[role="tree"]');
				globals.treeObject = new TreeLinks(trees[0]);
				globals.treeObject.init();
				for (var i = 1; i < globals.tableObject.rows.length; i++) {
					if (globals.localErrorList.includes(i)) {
						globals.tableObject.rows[i].domNode.setAttribute(
							"data-error-line",
							"true"
						);
					} else {
						globals.tableObject.rows[i].domNode.setAttribute(
							"data-error-line",
							"false"
						);
					}
				}
				if (globals.tableObject.reload) {
					globals.tableView.innerHTML = tableString
					var tables = document.querySelectorAll('[role="table"]');
					globals.tableObject = new Table(tables[0], variableList);
					globals.tableObject.init();
					globals.tableObject.currentRow.currentCell.domNode.focus()
				}
				// if (globals.tableObject.currentRow.domNode.getAttribute('data-error-line') == 'true' && globals.tableObject.currentRow.currentCell.timer == null && document.activeElement.tagName == 'INPUT') {
				//     if (globals.realTimeErrorBeep) {
				//         console.log("stopping edit timer")
				//         clearInterval(globals.tableObject.currentRow.currentCell.input.timer)
				//         globals.tableObject.currentRow.currentCell.input.timer = null
				//         console.log("starting error timer")
				//         playErrorSound()
				//         globals.tableObject.currentRow.currentCell.timer = setInterval(playErrorSound, globals.errorBeepTimerInterval * 1000)
				//     }
				// }
				// else if (globals.tableObject.currentRow.domNode.getAttribute('data-error-line') == 'false' && globals.tableObject.currentRow.currentCell.input.timer == null && document.activeElement.tagName == 'INPUT') {
				//     if (globals.realTimeErrorBeep) {
				//         console.log("stopping error timer")
				//         clearInterval(globals.tableObject.currentRow.currentCell.timer)
				//         console.log("starting edit timer")
				//         playEditSound()
				//         globals.tableObject.currentRow.currentCell.input.timer = setInterval(playEditSound, 6000)
				//         globals.tableObject.currentRow.currentCell.timer = null
				//     }
				// }
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
	};


	onmousedown(e) {
		if (e.which == 3) {
			e.preventDefault();
		}
	};

}