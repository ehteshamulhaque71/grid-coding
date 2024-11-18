class OutputView {
	constructor() {
		globals.outputView.addEventListener('keydown', e => this.onkeydown(e), true);
		globals.outputView.addEventListener('keyup', e => this.onkeyup(e), true);
		// globals.outputView.addEventListener('focus', e => this.onfocus(e), true);
	}

	onfocus(e) {
		globals.setFocusVariableToView(globals.codeOutputViewName);
		globals.isAltKeyDown = false;
		globals.isControlKeyDown = false;
	}

	onkeydown = function (e) {
		if (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'ArrowLeft' || e.key == 'ArrowRight') {

		}
		else if (e.key == 'r') {
			if (globals.isControlKeyDown) {

			}
		}

		else if (e.key == '0') {
			if (globals.isControlKeyDown) {
				return;
			}
		}
		else if (e.key == "Tab") {
			e.stopPropagation()
			e.preventDefault();
		}

		else if (e.key == 'Control') {
			globals.isControlKeyDown = true
		}
		else if (e.altKey) {
			globals.isAltKeyDown = true;
		}
		else if (e.key == '1') {
			e.preventDefault()
			if (globals.isControlKeyDown) {
				if (globals.errorCue) {
					globals.errorTimer = setInterval(errorCue, globals.errorCueTimerInterval * 1000)
				}
				globals.setFocusVariableToView(globals.textEditorViewName);
				if (document.getElementById("output").getAttribute('data-is-error') == 'true') {
					globals.editor.selectionStart = globals.editor.selectionEnd = globals.treeObject.treeitems[document.getElementById("output").getAttribute('data-error-line') - 1].domNode.getAttribute('data-line-end')
					globals.treeObject.currentNode = globals.treeObject.treeitems[document.getElementById("output").getAttribute('data-error-line') - 1]
					globals.tableObject.currentRow = globals.tableObject.rows[document.getElementById("output").getAttribute('data-error-line')]
				}
				playSwitchSound()
				globals.editor.focus()
			}
		}
		else if (e.key == '2') {
			e.preventDefault()
			if (globals.isControlKeyDown) {
				if (globals.errorCue) {
					globals.errorTimer = setInterval(errorCue, globals.errorCueTimerInterval * 1000);
				}
				globals.setFocusVariableToView(globals.tableEditorViewName);

				if (document.getElementById("output").getAttribute('data-is-error') == 'true') {
					globals.editor.selectionStart = globals.editor.selectionEnd = globals.treeObject.treeitems[document.getElementById("output").getAttribute('data-error-line') - 1].domNode.getAttribute('data-line-end')
					globals.treeObject.currentNode = globals.treeObject.treeitems[document.getElementById("output").getAttribute('data-error-line') - 1]
					globals.tableObject.currentRow = globals.tableObject.rows[document.getElementById("output").getAttribute('data-error-line')]
					for (var i = 0; i < globals.tableObject.currentRow.cells.length; i++) {
						if (globals.tableObject.currentRow.cells[i].domNode.innerHTML == '') {
							break
						}
						globals.tableObject.currentRow.currentCell = globals.tableObject.currentRow.cells[i]
					}
				}
				playSwitchSound()
				globals.tableObject.currentRow.currentCell.domNode.focus()
				console.log(globals.tableObject.currentRow.currentCell.domNode)
			}
		}
		else if (e.key == '3') {
			e.preventDefault()
			if (globals.isControlKeyDown) {
				if (globals.errorCue) {
					globals.errorTimer = setInterval(errorCue, globals.errorCueTimerInterval * 1000);
				}
				globals.setFocusVariableToView(globals.codeTreeViewName);

				if (document.getElementById("output").getAttribute('data-is-error') == 'true') {
					globals.editor.selectionStart = globals.editor.selectionEnd = globals.treeObject.treeitems[document.getElementById("output").getAttribute('data-error-line') - 1].domNode.getAttribute('data-line-end')
					globals.treeObject.currentNode = globals.treeObject.treeitems[document.getElementById("output").getAttribute('data-error-line') - 1]
					globals.tableObject.currentRow = globals.tableObject.rows[document.getElementById("output").getAttribute('data-error-line')]
				}
				playSwitchSound()
				globals.treeObject.currentNode.domNode.focus()
			}
		}
		else if (e.key == '4') {
			e.preventDefault()
			if (globals.isControlKeyDown) {
				globals.setFocusVariableToView(globals.bookmarksViewName);
				playSwitchSound()
				if (globals.bookmarkObject.treeitems.length > 0) {
					globals.bookmarkObject.treeitems[0].domNode.focus();
				} else {
					globals.bookmarkObject.domNode.focus();
				}
			}
		}
		else if (e.key == '5') {
			if (globals.isControlKeyDown) {
				e.preventDefault();
			}
		}

		else if (e.key == '9') {
			if (globals.isControlKeyDown) {
			}
		}

		else {
			e.stopPropagation()
			e.preventDefault()
		}
	}

	onkeyup = function (e) {
		if (e.key == 'Control') {
			globals.isControlKeyDown = false;
		}
		if (e.altKey) {
			globals.isAltKeyDown = false;
		}
	}
}