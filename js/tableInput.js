var TableInput = function (node, tableCell) {
	if (typeof node !== 'object') {
		return;
	}

	this.tableCell = tableCell
	this.domNode = node;
	this.isShiftKeyDown = false;
	this.tableCell.cellType = []
	this.autocompleteOpen = false
	this.timer = null
	this.regex = new RegExp(/^(\s)*(if|elif|else|for|while|try|except|finally|def|class|with)(.)*(\:)(\s)*$/);
	if (node.getAttribute('placeholder').includes('statement')) {
		this.tableCell.cellType.push('statement')
	}
	if (node.getAttribute('placeholder').includes('body')) {
		this.tableCell.cellType.push('block body')
	}
	// if (node.getAttribute('placeholder').includes('print')) {
	//     if (this.tableCell.colIndex > 1) {
	//         this.tableCell.cellType.push('block body')
	//     }
	//     else {
	//         this.tableCell.cellType.push('statement')
	//     }
	// }
	if (this.tableCell.domNode.firstChild.tagName != 'INPUT' && !node.getAttribute('placeholder').includes('print')) {
		this.tableCell.cellType.push('block definition')
		if (this.tableCell.colIndex > 1) {
			this.tableCell.cellType.push('block body')
		}
	}
};

TableInput.prototype.init = function () {
	if (this.domNode.getAttribute('role', 'combobox')) {
		this.setAllowedBlocks()
		startAutocomplete(this.domNode, this.tableCell.allowedBlocks, this);
	}

	this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
	this.domNode.addEventListener('keyup', this.handleKeyup.bind(this));
	this.domNode.addEventListener('focus', this.handleFocus.bind(this));
	this.domNode.addEventListener('blur', this.handleBlur.bind(this));
};

TableInput.prototype.handleKeydown = function (event) {
	if (this.domNode.getAttribute('role', 'combobox')) {
		$(this.domNode).attr('aria-expanded', 'true');
		if (!this.domNode.value) {
			$(this.domNode).autocomplete("destroy");
			startAutocomplete(this.domNode, this.tableCell.allowedBlocks, this);
			$(this.domNode).attr('aria-expanded', 'false');
		}
	}
	switch (event.key) {
		case "PageUp":
		case "PageDown":
		case "Home":
		case "End":
			stopPropagation()
			break

		case 'Enter':
			// event.stopPropagation()
			if (globals.isAltKeyDown) {
				return
			}
			event.stopPropagation()
			event.preventDefault()
			if (this.tableCell.tableRow.domNode.getAttribute('data-error-line') == 'true' && globals.realTimeErrorBeep) {
				playErrorSound()
			}
			console.log(this.tableCell.cellType)
			if (this.tableCell.cellType.includes("statement") || (this.tableCell.cellType.includes("block body") && !this.tableCell.cellType.includes("block definition"))) {
				if (this.domNode.value.includes("elif") && this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("elif");
				}
				else if (this.domNode.value == "elif block" && !this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("elif", true);
				}
				else if (this.domNode.value.includes("if") && this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("if");
				}
				else if (this.domNode.value == "if block" && !this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("if", true);
				}
				else if (this.domNode.value.includes("for") && this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("for");
				}
				else if (this.domNode.value == "for block" && !this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("for", true);
				}
				else if (this.domNode.value.includes("def") && this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("def");
				}
				else if (this.domNode.value == "def block" && !this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("def", true);
				}
				else if (this.domNode.value.includes("else") && this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("else");
				}
				else if (this.domNode.value == "else block" && !this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("else", true);
				}
				else if (this.domNode.value.includes("while") && this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("while");
				}
				else if (this.domNode.value == "while block" && !this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("while", true);
				}
				else if (this.domNode.value.includes("class") && this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("class");
				}
				else if (this.domNode.value == "class block" && !this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("class", true);
				}
				else if (this.domNode.value.includes("try") && this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("try");
				}
				else if (this.domNode.value == "try block" && !this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("try", true);
				}
				else if (this.domNode.value.includes("except") && this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("except");
				}
				else if (this.domNode.value == "except block" && !this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("except", true);
				}
				else if (this.domNode.value.includes("finally") && this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("finally");
				}
				else if (this.domNode.value == "finally block" && !this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("finally", true);
				}
				else if (this.domNode.value.includes("with") && this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("with");
				}
				else if (this.domNode.value == "with block" && !this.domNode.value.includes(":")) {
					this.tableCell.tableRow.table.addBlock("with", true);
				}
				// else if (this.domNode.value == "print statement" || this.domNode.value == "print") {
				//     this.tableCell.tableRow.table.addFunctionCall('print', 'enter a variable or string to print');
				// }
				// else if (this.domNode.value == "print statement") {
				//     this.tableCell.tableRow.table.addFunctionCall('print', 'enter a variable or string to print');
				// }
				else {
					if (this.domNode.value.trim() != "" && !this.autocompleteOpen) {
						console.log(this)
						if (!this.tableCell.tableRow.isLastRow) {
							if (this.tableCell.tableRow.table.rows[this.tableCell.rowIndex + 1].cells[this.tableCell.colIndex].input) {
								if (this.tableCell.tableRow.table.rows[this.tableCell.rowIndex + 1].cells[this.tableCell.colIndex].input.domNode.getAttribute('placeholder').includes('statement') || this.tableCell.tableRow.table.rows[this.tableCell.rowIndex + 1].cells[this.tableCell.colIndex].input.domNode.getAttribute('placeholder').includes('body')) {
									if (this.tableCell.tableRow.table.rows[this.tableCell.rowIndex + 1].cells[this.tableCell.colIndex].input.domNode.value == '') {
										this.tableCell.tableRow.table.currentRow = this.tableCell.tableRow.table.rows[this.tableCell.rowIndex + 1]
										this.tableCell.tableRow.table.currentRow.currentCell = this.tableCell.tableRow.table.rows[this.tableCell.rowIndex + 1].cells[this.tableCell.colIndex]
										this.tableCell.tableRow.table.currentRow.currentCell.input.domNode.focus()
									}
									else {
										if (this.domNode.getAttribute('placeholder').includes('print')) {
											if (this.tableCell.colIndex > 1) {
												this.tableCell.tableRow.table.addRow('enter ' + this.tableCell.tableRow.table.rows[this.tableCell.rowIndex].cells[this.tableCell.colIndex - 1].domNode.textContent.split(' ')[1] + ' body');
											}
											else {
												this.tableCell.tableRow.table.addRow('enter a statement');
											}
										}
										else {
											this.tableCell.tableRow.table.addRow(this.domNode.getAttribute("placeholder"));
										}
									}
								}
								else {
									if (this.domNode.getAttribute('placeholder').includes('print')) {
										if (this.tableCell.colIndex > 1) {
											this.tableCell.tableRow.table.addRow('enter ' + this.tableCell.tableRow.table.rows[this.tableCell.rowIndex].cells[this.tableCell.colIndex - 1].domNode.textContent.split(' ')[1] + ' body');
										}
										else {
											this.tableCell.tableRow.table.addRow('enter a statement');
										}
									}
									else {
										this.tableCell.tableRow.table.addRow(this.domNode.getAttribute("placeholder"));
									}
								}
							}
							else {
								if (this.domNode.getAttribute('placeholder').includes('print')) {
									if (this.tableCell.colIndex > 1) {
										this.tableCell.tableRow.table.addRow('enter ' + this.tableCell.tableRow.table.rows[this.tableCell.rowIndex].cells[this.tableCell.colIndex - 1].domNode.textContent.split(' ')[1] + ' body');
									}
									else {
										this.tableCell.tableRow.table.addRow('enter a statement');
									}
								}
								else {
									this.tableCell.tableRow.table.addRow(this.domNode.getAttribute("placeholder"));
								}
							}
						}
						else {
							if (this.domNode.getAttribute('placeholder').includes('print')) {
								if (this.tableCell.colIndex > 1) {
									this.tableCell.tableRow.table.addRow('enter ' + this.tableCell.tableRow.table.rows[this.tableCell.rowIndex].cells[this.tableCell.colIndex - 1].domNode.textContent.split(' ')[1] + ' body');
								}
								else {
									this.tableCell.tableRow.table.addRow('enter a statement');
								}
							}
							else {
								this.tableCell.tableRow.table.addRow(this.domNode.getAttribute("placeholder"));
							}
						}
					}
				}
				if (this.domNode.getAttribute('role', 'combobox')) {
					$(this.domNode).autocomplete("destroy");
					this.setAllowedBlocks()
					startAutocomplete(this.domNode, this.tableCell.allowedBlocks, this);
					$(this.domNode).attr('aria-expanded', 'false');
				}
			}
			else {
				this.tableCell.tableRow.table.currentRow.domNode.setAttribute('data-current-line', 'false')
				var condition = ''
				var children = this.tableCell.domNode.childNodes
				for (var child = 0; child < children.length; child++) {
					if (children[child].tagName == 'INPUT') {
						condition += children[child].value
					} else {
						condition += children[child].textContent
					}
				}

				if (globals.isDetailIndentationBlockEnabled) {
					this.tableCell.tableRow.table.rows[this.tableCell.rowIndex + 1].cells[this.tableCell.colIndex].domNode.innerHTML = `<b><small>within <i>${condition.replace(':', '').trim()}</i></small></b>`
				}

				this.tableCell.tableRow.table.currentRow = this.tableCell.tableRow.table.rows[this.tableCell.rowIndex + 1]
				this.tableCell.tableRow.table.currentRow.currentCell = this.tableCell.tableRow.table.rows[this.tableCell.rowIndex + 1].cells[this.tableCell.colIndex + 1]
				this.tableCell.tableRow.table.currentRow.currentCell.input.domNode.focus()
				this.tableCell.tableRow.table.currentRow.domNode.setAttribute('data-current-line', 'true')
			}
			break
		case 'Shift':
			event.stopPropagation()
			event.preventDefault()
			this.isShiftKeyDown = true
			break

		case 'Backspace':
			if (this.domNode.getAttribute('role', 'combobox')) {
				$(this.domNode).autocomplete("destroy");
				this.setAllowedBlocks()
				startAutocomplete(this.domNode, this.tableCell.allowedBlocks, this);
				$(this.domNode).attr('aria-expanded', 'false');
			}
			break

		// case 'Tab':
		//     event.stopPropagation()
		//     event.preventDefault()
		//     if (this.isShiftKeyDown) {
		//         if (this.tableCell.cellType.includes('block body')) {
		//             this.domNode.setAttribute('tabindex', '-1')
		//             var blockDefinitionRowNumber = this.tableCell.tableRow.rowNumber - 1
		//             // for (var i = this.tableCell.tableRow.rowNumber - 1; i < this.tableCell.tableRow.table.rows.length - 1; i--) {
		//             //     if (this.tableCell.tableRow.table.rows[i].cells[this.tableCell.colIndex - 1].domNode.innerHTML != this.tableCell.tableRow.cells[this.tableCell.colIndex - 1].domNode.innerHTML) {
		//             //         blockDefinitionRowNumber = i
		//             //         break
		//             //     }
		//             // }
		//             this.tableCell.tableRow.table.rows[blockDefinitionRowNumber].currentCell = this.tableCell.tableRow.table.rows[blockDefinitionRowNumber].cells[this.tableCell.colIndex - 1];
		//             this.tableCell.tableRow.table.currentRow = this.tableCell.tableRow.table.rows[blockDefinitionRowNumber];
		//             if (this.tableCell.tableRow.table.currentRow.currentCell.domNode.innerHTML == 'else:') {
		//                 this.tableCell.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0');
		//                 this.tableCell.tableRow.table.currentRow.currentCell.domNode.focus();
		//             }
		//             else {
		//                 if (this.tableCell.tableRow.table.currentRow.currentCell.input) {
		//                     this.tableCell.tableRow.table.currentRow.currentCell.input.domNode.setAttribute('tabindex', '0');
		//                     this.tableCell.tableRow.table.currentRow.currentCell.input.domNode.focus();
		//                 }
		//             }
		//         }
		//     }
		//     else {
		//         if (this.tableCell.cellType.includes('block definition')) {
		//             this.domNode.setAttribute('tabindex', '-1')
		//             this.tableCell.tableRow.table.rows[this.tableCell.tableRow.rowNumber + 1].currentCell = this.tableCell.tableRow.table.rows[this.tableCell.tableRow.rowNumber + 1].cells[this.tableCell.colIndex + 1];
		//             this.tableCell.tableRow.table.currentRow = this.tableCell.tableRow.table.rows[this.tableCell.tableRow.rowNumber + 1];
		//             this.tableCell.tableRow.table.currentRow.currentCell.input.domNode.setAttribute('tabindex', '0');
		//             this.tableCell.tableRow.table.currentRow.currentCell.input.domNode.focus();
		//         }
		//     }
		//     break

		case 'Escape':
			event.stopImmediatePropagation();
			event.preventDefault();
			if (this.tableCell.tableRow.domNode.getAttribute('data-error-line') == 'true' && globals.realTimeErrorBeep) {
				playErrorSound()
			}
			else {
				playLeaveSound()
			}
			this.domNode.setAttribute('tabindex', '-1');
			this.tableCell.domNode.setAttribute('tabindex', '0');
			this.tableCell.domNode.focus();
			break

		case "ArrowLeft":
		case "ArrowRight":
		case "ArrowUp":
		case "ArrowDown":
			event.stopPropagation();
			break
	}
}

TableInput.prototype.handleKeyup = function (event) {
	switch (event.key) {
		case 'Shift':
			event.stopPropagation()
			event.preventDefault()
			this.isShiftKeyDown = false
			break
	}
}

TableInput.prototype.handleFocus = function (event) {
	globals.isAltKeyDown = false;
	globals.isControlKeyDown = false;
	console.log('------------------------------')
	var node = this.domNode;
	node.classList.add('focus');
	// if (this.tableCell.tableRow.domNode.getAttribute('data-error-line') == 'true' && this.tableCell.timer == null && globals.realTimeErrorBeep) {
	//     console.log("starting error timer")
	//     clearInterval(this.timer)
	//     this.timer = null
	//     playErrorSound()
	//     // this.tableCell.timer = setInterval(playErrorSound, globals.errorBeepTimerInterval * 1000)
	// }
	if (this.timer == null) {
		console.log("starting edit timer")
		// playEditSound()
		setTimeout(() => {
			if (this.domNode == document.activeElement) {
				playEditSound()
				this.timer = setInterval(playEditSound, 6000)
			}
		}, 1000);
	}
	if (this.domNode.getAttribute('role', 'combobox')) {
		this.setAllowedBlocks()
		$(this.domNode).autocomplete("destroy");
		startAutocomplete(this.domNode, this.tableCell.allowedBlocks, this);
	}
};

TableInput.prototype.handleBlur = function (event) {
	var node = this.domNode;
	this.autocompleteOpen = false
	this.isShiftKeyDown = false
	node.classList.remove('focus');
	// if (this.tableCell.timer) {
	//     console.log("stopping error timer")
	//     clearInterval(this.tableCell.timer)
	//     this.tableCell.timer = null
	// }
	// if (this.timer) {
	// console.log("starting error timer")
	clearInterval(this.timer)
	this.timer = null
	setTimeout(() => {
		if (this.timer) {
			clearInterval(this.timer)
			this.timer = null
		}
	}, 1000);
	// }
	if (this.domNode.getAttribute('role', 'combobox')) {
		$(this.domNode).autocomplete("destroy");
		this.setAllowedBlocks()
		startAutocomplete(this.domNode, this.tableCell.allowedBlocks, this);
		$(this.domNode).attr('aria-expanded', 'false');
	}
};

TableInput.prototype.setAllowedBlocks = function () {
	this.tableCell.allowedBlocks = [];
	for (var i = 0; i < this.tableCell.tableRow.table.variableList.length; i++) {
		this.tableCell.allowedBlocks.push(this.tableCell.tableRow.table.variableList[i])
	}
	if (!this.tableCell.cellType.includes('block definition') && !this.domNode.getAttribute('placeholder').includes('print')) {
		// this.tableCell.allowedBlocks.push('print statement')
		this.tableCell.allowedBlocks.push('if block')
		this.tableCell.allowedBlocks.push('for block')
		this.tableCell.allowedBlocks.push('while block')
		this.tableCell.allowedBlocks.push('try block')
		this.tableCell.allowedBlocks.push('with block')
		if (this.tableCell.colIndex == 1) {
			this.tableCell.allowedBlocks.push('def block')
			this.tableCell.allowedBlocks.push('class block')
		}
		if (this.tableCell.rowIndex > 2 && this.tableCell.tableRow.table.rows[this.tableCell.rowIndex - 1].cells[this.tableCell.colIndex].domNode.textContent == 'within if') {
			this.tableCell.allowedBlocks.push('elif block')
			this.tableCell.allowedBlocks.push('else block')
		}
		if (this.tableCell.rowIndex > 2 && this.tableCell.tableRow.table.rows[this.tableCell.rowIndex - 1].cells[this.tableCell.colIndex].domNode.textContent == 'within elif') {
			this.tableCell.allowedBlocks.push('elif block')
			this.tableCell.allowedBlocks.push('else block')
		}
		if (this.tableCell.rowIndex > 2 && this.tableCell.tableRow.table.rows[this.tableCell.rowIndex - 1].cells[this.tableCell.colIndex].domNode.textContent == 'within try') {
			this.tableCell.allowedBlocks.push('except block')
			this.tableCell.allowedBlocks.push('finally block')
		}
		if (this.tableCell.rowIndex > 2 && this.tableCell.tableRow.table.rows[this.tableCell.rowIndex - 1].cells[this.tableCell.colIndex].domNode.textContent == 'within except') {
			this.tableCell.allowedBlocks.push('except block')
			this.tableCell.allowedBlocks.push('finally block')
		}
	}
};