var TableCell = function (node, tableRow, rowIndex, colIndex, isFirstCell, isLastCell) {
	if (typeof node !== 'object') {
		return;
	}

	this.tableRow = tableRow;
	this.domNode = node;
	this.isFirstCell = isFirstCell
	this.isLastCell = isLastCell
	this.isCurrentCell = false
	this.rowIndex = rowIndex;
	this.colIndex = colIndex;
	this.input = null;
	this.cellType = [];
	this.allowedBlocks = []
	this.isShiftKeyDown = false
	this.timer = null
	this.blockTimer = null
};


TableCell.prototype.init = function () {
	var inputElement = this.domNode.querySelector('input')
	if (inputElement) {
		this.tableRow.currentCell = this
		this.domNode.setAttribute('tabindex', '0')
		this.input = new TableInput(inputElement, this);
		this.input.init()
	}
	else if (['else:', 'try:', 'except:'].includes(this.domNode.textContent)) {
		this.tableRow.currentCell = this
		this.domNode.setAttribute('tabindex', '0')
		this.cellType.push('block definition')
		if (this.colIndex > 1) {
			this.cellType.push('block body')
		}
	}
	this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
	this.domNode.addEventListener('keyup', this.handleKeyup.bind(this));
	this.domNode.addEventListener('focus', this.handleFocus.bind(this));
	this.domNode.addEventListener('blur', this.handleBlur.bind(this));
};

TableCell.prototype.handleKeyup = function (event) {
	switch (event.key) {
		case 'Shift':
			event.stopPropagation()
			event.preventDefault()
			this.isShiftKeyDown = false
			break
	}
}

TableCell.prototype.handleKeydown = function (event) {
	switch (event.key) {
		case "PageUp":
			if (event.target != this.domNode) {
				break
			}
			event.stopPropagation();
			event.preventDefault();
			if (!this.tableRow.isFirstRow) {

				var newRow = null
				for (var i = this.rowIndex - 1; i > 0; i--) {
					newRow = i
					if (this.tableRow.table.rows[i].cells[this.colIndex].cellType.length > 0) {
						break
					}
				}

				this.domNode.setAttribute('tabindex', '-1')
				this.tableRow.table.currentRow = this.tableRow.table.rows[newRow]
				this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[this.colIndex]
				if (this.tableRow.table.currentRow.domNode.getAttribute('data-error-line') == 'true') {
					playErrorSound()
				}
				else {
					playTravarseSound()
				}
				this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
				this.tableRow.table.currentRow.currentCell.domNode.focus()
			}
			else {
				playEndSound()
			}
			break

		case "PageDown":
			if (event.target != this.domNode) {
				break
			}
			event.stopPropagation()
			event.preventDefault()
			if (!this.tableRow.isLastRow) {
				var newRow = null
				for (var i = this.rowIndex + 1; i < this.tableRow.table.rows.length; i++) {
					newRow = i
					if (this.tableRow.table.rows[i].cells[this.colIndex].cellType.length > 0) {
						break
					}
				}

				this.domNode.setAttribute('tabindex', '-1')
				this.tableRow.table.currentRow = this.tableRow.table.rows[newRow]
				this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[this.colIndex]
				if (this.tableRow.table.currentRow.domNode.getAttribute('data-error-line') == 'true') {
					playErrorSound()
				}
				else {
					playTravarseSound()
				}
				this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
				this.tableRow.table.currentRow.currentCell.domNode.focus()
			}
			else {
				playEndSound()
			}
			break

		case "Home":
			if (event.target != this.domNode) {
				break
			}
			event.stopPropagation()
			event.preventDefault()
			if (!this.isFirstCell) {
				if (this.domNode.innerHTML == '') {
					for (var i = this.colIndex - 1; i > 0; i--) {
						if (this.tableRow.cells[i].domNode.innerHTML != '') {
							this.domNode.setAttribute('tabindex', '-1')
							this.tableRow.table.currentRow.currentCell = this.tableRow.cells[i]
							this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
							this.tableRow.table.currentRow.currentCell.domNode.focus()
							playTravarseSound()
							break
						}
					}
				}
				else {
					this.domNode.setAttribute('tabindex', '-1')
					this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[0]
					this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
					this.tableRow.table.currentRow.currentCell.domNode.focus()
					playTravarseSound()
				}
			}
			else {
				playEndSound()
			}
			break

		case "End":
			if (event.target != this.domNode) {
				break
			}
			event.stopPropagation()
			event.preventDefault()

			if (!this.isLastCell) {
				if (this.cellType.length > 0 || this.domNode.innerHTML == '') {
					this.domNode.setAttribute('tabindex', '-1')
					this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[this.tableRow.cells.length - 1]
					this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
					this.tableRow.table.currentRow.currentCell.domNode.focus()
					playTravarseSound()
				}
				else {
					for (var i = this.colIndex + 1; i < this.tableRow.cells.length; i++) {
						if (this.tableRow.cells[i].cellType.length > 0) {
							this.domNode.setAttribute('tabindex', '-1')
							this.tableRow.table.currentRow.currentCell = this.tableRow.cells[i]
							this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
							this.tableRow.table.currentRow.currentCell.domNode.focus()
							playTravarseSound()
							break
						}
					}
				}
			}
			else {
				playEndSound()
			}
			break

		case "ArrowUp":
			if (event.target != this.domNode) {
				break
			}
			event.stopPropagation();
			event.preventDefault();
			if (document.activeElement)
				if (globals.isControlKeyDown) {
					event.preventDefault()
					if (!this.tableRow.isFirstRow) {
						var newRow = null
						for (var i = this.rowIndex - 1; i > 0; i--) {
							newRow = i
							if (this.tableRow.table.rows[i].cells[this.colIndex].cellType.length > 0) {
								break
							}
						}

						this.domNode.setAttribute('tabindex', '-1')
						this.tableRow.table.currentRow = this.tableRow.table.rows[newRow]
						this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[this.colIndex]
						if (this.tableRow.table.currentRow.domNode.getAttribute('data-error-line') == 'true') {
							playErrorSound()
						}
						else {
							playTravarseSound()
						}
						this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
						this.tableRow.table.currentRow.currentCell.domNode.focus()
					}
					else {
						playEndSound()
					}
				}
				else {
					if (!this.tableRow.isFirstRow) {
						this.domNode.setAttribute('tabindex', '-1')
						this.tableRow.table.currentRow = this.tableRow.table.rows[this.rowIndex - 1]
						this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[this.colIndex]
						if (this.tableRow.table.currentRow.domNode.getAttribute('data-error-line') == 'true') {
							playErrorSound()
						}
						else {
							playTravarseSound()
						}
						this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
						this.tableRow.table.currentRow.currentCell.domNode.focus()
					}
					else {
						playEndSound()
					}
				}
			break

		case "ArrowDown":
			if (event.target != this.domNode) {
				break
			}
			event.stopPropagation();
			event.preventDefault();
			if (globals.isControlKeyDown) {
				event.preventDefault()
				if (!this.tableRow.isLastRow) {
					var newRow = null
					for (var i = this.rowIndex + 1; i < this.tableRow.table.rows.length; i++) {
						newRow = i
						if (this.tableRow.table.rows[i].cells[this.colIndex].cellType.length > 0) {
							break
						}
					}

					this.domNode.setAttribute('tabindex', '-1')
					this.tableRow.table.currentRow = this.tableRow.table.rows[newRow]
					this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[this.colIndex]
					if (this.tableRow.table.currentRow.domNode.getAttribute('data-error-line') == 'true') {
						playErrorSound()
					}
					else {
						playTravarseSound()
					}
					this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
					this.tableRow.table.currentRow.currentCell.domNode.focus()
				}
				else {
					playEndSound()
				}
			}
			else {
				if (!this.tableRow.isLastRow) {
					this.domNode.setAttribute('tabindex', '-1')
					this.tableRow.table.currentRow = this.tableRow.table.rows[this.rowIndex + 1]
					this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[this.colIndex]
					if (this.tableRow.table.currentRow.domNode.getAttribute('data-error-line') == 'true') {
						playErrorSound()
					}
					else {
						playTravarseSound()
					}
					this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
					this.tableRow.table.currentRow.currentCell.domNode.focus()
				}
				else {
					playEndSound()
				}
			}
			break

		case "ArrowLeft":
			if (event.target != this.domNode) {
				break
			}
			event.stopPropagation();
			event.preventDefault();
			if (globals.isControlKeyDown) {
				event.preventDefault()
				if (!this.isFirstCell) {
					if (this.domNode.innerHTML == '') {
						for (var i = this.colIndex - 1; i > 0; i--) {
							if (this.tableRow.cells[i].domNode.innerHTML != '') {
								this.domNode.setAttribute('tabindex', '-1')
								this.tableRow.table.currentRow.currentCell = this.tableRow.cells[i]
								this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
								this.tableRow.table.currentRow.currentCell.domNode.focus()
								playTravarseSound()
								break
							}
						}
					}
					else {
						this.domNode.setAttribute('tabindex', '-1')
						this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[0]
						this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
						this.tableRow.table.currentRow.currentCell.domNode.focus()
						playTravarseSound()
					}
				}
				else {
					playEndSound()
				}
			}
			else {
				if (!this.isFirstCell) {
					playTravarseSound()
					this.domNode.setAttribute('tabindex', '-1')
					this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[this.colIndex - 1]
					this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
					this.tableRow.table.currentRow.currentCell.domNode.focus()
				}
				else {
					playEndSound()
				}
			}
			break
		case "ArrowRight":
			if (event.target != this.domNode) {
				break
			}
			event.stopPropagation();
			event.preventDefault();
			if (globals.isControlKeyDown) {
				event.preventDefault()
				if (!this.isLastCell) {
					if (this.cellType.length > 0 || this.domNode.innerHTML == '') {
						this.domNode.setAttribute('tabindex', '-1')
						this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[this.tableRow.cells.length - 1]
						this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
						this.tableRow.table.currentRow.currentCell.domNode.focus()
						playTravarseSound()
					}
					else {
						for (var i = this.colIndex + 1; i < this.tableRow.cells.length; i++) {
							if (this.tableRow.cells[i].cellType.length > 0) {
								this.domNode.setAttribute('tabindex', '-1')
								this.tableRow.table.currentRow.currentCell = this.tableRow.cells[i]
								this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
								this.tableRow.table.currentRow.currentCell.domNode.focus()
								playTravarseSound()
								break
							}
						}
					}
				}
				else {
					playEndSound()
				}
			}
			else {
				if (!this.isLastCell) {
					playTravarseSound()
					this.domNode.setAttribute('tabindex', '-1')
					this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[this.colIndex + 1]
					this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
					this.tableRow.table.currentRow.currentCell.domNode.focus()
				}
				else {
					playEndSound()
				}
			}
			break

		case 'Shift':
			event.stopPropagation()
			event.preventDefault()
			this.isShiftKeyDown = true
			break

		case "Enter":
			if (globals.isAltKeyDown) {
				return
			}
			if (event.target == this.domNode) {
				// Enter pressed on navigation mode
				event.stopPropagation();
				event.preventDefault();
				if (this.input != null) {
					// editable cell
					playEnterSound()
					if (this.input.domNode.setSelectionRange) {
						this.input.domNode.setSelectionRange(this.input.domNode.value.length, this.input.domNode.value.length);
					} else {
						var range = this.input.domNode.createTextRange();
						this.input.domNode.moveStart('character', this.input.domNode.value.length);
						range.moveEnd('character', this.input.domNode.value.length);
						range.select();
					}
					this.domNode.setAttribute('tabindex', '-1');
					this.input.domNode.setAttribute('tabindex', '0');
					this.input.domNode.focus();
				}
				else {
					// non-editable cell
					if (this.cellType.includes('block definition') && (['else:', 'try:', 'except:'].includes(this.domNode.innerHTML))) {
						// handle special case of else, try, and except
						this.domNode.setAttribute('data-current-cell', 'false')
						this.tableRow.domNode.setAttribute('data-current-line', 'false')
						this.tableRow.table.currentRow = this.tableRow.table.rows[this.rowIndex + 1]
						this.tableRow.table.currentRow.currentCell = this.tableRow.table.rows[this.rowIndex + 1].cells[this.colIndex + 1]
						this.tableRow.table.currentRow.domNode.setAttribute('data-current-line', 'true')
						this.tableRow.table.currentRow.currentCell.domNode.setAttribute('data-current-cell', 'true')
						this.tableRow.table.currentRow.currentCell.input.domNode.focus()
					}
					// if (this.domNode.getAttribute('aria-label').includes('within')) {
					if (this.domNode.textContent.includes('within')) {
						if (this.domNode.innerHTML == this.tableRow.table.rows[this.rowIndex - 1].cells[this.colIndex].domNode.innerHTML) {
							var children = null;
							var previousInputCellIndex = null;
							this.domNode.innerHTML = '';
							for (i = this.colIndex + 1; i < this.tableRow.cells.length; i++) {
								if (this.tableRow.cells[i].input) {
									value = this.tableRow.cells[i].input.domNode.value;
									children = this.tableRow.cells[i].domNode.childNodes;
									previousInputCellIndex = i;
									for (var child = 0; child < children.length; child++) {
										if (children[child].tagName == 'INPUT') {
											var placeholder = this.colIndex > 1 ? 'Enter ' + this.tableRow.cells[this.colIndex - 1].domNode.innerText.split(' ')[1].trim() + ' body' : 'Enter a statement';
											console.log(placeholder)
											var input = this.tableRow.table.createInput(placeholder)
											this.domNode.appendChild(input)
											var inputElement = new TableInput(input, this)
											inputElement.init()
											this.input = inputElement
											this.input.domNode.value = children[child].value
										} else {
											this.domNode.appendChild(document.createTextNode(children[child].textContent))
										}
									}
									// break
								}
								this.tableRow.cells[i].domNode.innerHTML = '';
								this.tableRow.cells[i].input = null;
								this.tableRow.cells[i].domNode.removeAttribute('class');
								// this.tableRow.cells[i].domNode.setAttribute('aria-label', `Line ${this.tableRow.cells[i].rowIndex}, Level ${this.tableRow.cells[i].colIndex}`)
								this.tableRow.cells[i].domNode.setAttribute('data-current-cell', 'false');
							}
							this.tableRow.domNode.setAttribute('data-line-end', `${parseInt(this.tableRow.domNode.getAttribute('data-line-end')) - ((previousInputCellIndex - this.colIndex) * globalThis.indentationSize)}`)
							this.tableRow.currentCell = this;
							this.domNode.focus()
							this.domNode.setAttribute('data-current-cell', 'true')
							this.domNode.removeAttribute('class')
							this.input.domNode.focus()
						}
					}
				}
			}
			break

		case "Backspace":
			if (event.target == this.domNode) {
				event.preventDefault()
				if (this.input || this.domNode.innerHTML == "else:") {
					if (this.cellType.includes('statement') || (this.cellType.includes('block body') && !this.cellType.includes('block definition'))) {
						if (this.rowIndex == 1 && this.colIndex == 1 && this.tableRow.isLastRow) {
							var answer = window.confirm('Are you sure you want to delete this cell?')
							if (!answer) {
								return
							}
							this.domNode.innerHTML = ''
							var input = this.tableRow.table.createInput('Enter a statement')
							this.domNode.appendChild(input)
							var inputElement = new TableInput(input, this)
							inputElement.init()
							this.input = inputElement
							this.domNode.focus()
						}
						else if (this.rowIndex == 1 && !this.tableRow.isLastRow) {
							console.log(this.cellType)
							var answer = window.confirm('Are you sure you want to delete this cell?')
							if (!answer) {
								return
							}
							this.tableRow.table.currentRow = this.tableRow.table.rows[this.rowIndex + 1]
							this.tableRow.table.currentRow.currentCell = null
							for (var i = 1; i < this.tableRow.table.currentRow.cells.length; i++) {
								if (this.tableRow.table.currentRow.cells[i].input) {
									this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[i]
									break
								}
							}
							this.tableRow.table.currentRow.domNode.setAttribute('data-current-line', 'true')
							this.tableRow.table.currentRow.currentCell.domNode.setAttribute('data-current-cell', 'true')
							var lineStart = parseInt(this.tableRow.table.currentRow.domNode.getAttribute('data-line-start'))
							var lineEnd = parseInt(this.tableRow.table.currentRow.domNode.getAttribute('data-line-end'))
							this.tableRow.table.currentRow.domNode.setAttribute('data-line-start', '0')
							this.tableRow.table.currentRow.domNode.setAttribute('data-line-end', `${lineEnd - lineStart}`)
							this.tableRow.table.currentRow.domNode.setAttribute('data-line-number', '1')
							this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
							this.tableRow.table.currentRow.currentCell.domNode.focus()
							this.tableRow.table.rows.splice(this.rowIndex, 1)
							this.tableRow.table.reload = true;
						}
						else {
							if (this.tableRow.cells[this.colIndex - 1].domNode.textContent.includes('within')) {
								var scopeName = this.tableRow.cells[this.colIndex - 1].domNode.textContent.split(' ')[1]
								if (!this.tableRow.table.rows[this.rowIndex - 1].cells[this.colIndex - 1].domNode.textContent.includes(`within ${scopeName}`)) {
									event.stopPropagation()
									return
								}
							}
							var answer = window.confirm('Are you sure you want to delete this cell?')
							if (!answer) {
								return
							}
							this.tableRow.table.currentRow = this.tableRow.table.rows[this.rowIndex - 1]
							this.tableRow.table.currentRow.currentCell = null
							for (var i = 1; i < this.tableRow.table.currentRow.cells.length; i++) {
								if (this.tableRow.table.currentRow.cells[i].input) {
									this.tableRow.table.currentRow.currentCell = this.tableRow.table.currentRow.cells[i]
									break
								}
							}
							this.tableRow.table.currentRow.domNode.setAttribute('data-current-line', 'true')
							this.tableRow.table.currentRow.currentCell.domNode.setAttribute('data-current-cell', 'true')
							this.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
							this.tableRow.table.currentRow.currentCell.domNode.focus()
							this.tableRow.table.rows.splice(this.rowIndex, 1)
							this.tableRow.table.reload = true;
						}
					}
					// else if (this.cellType.includes('block definition')) {
					//     var scopeName = this.domNode.firstChild.textContent.replace(':', '').trim()
					//     var alertList = document.getElementById('alert')
					//     alertList.innerHTML = ''
					//     if (scopeName == 'if') {
					//         var untilIfBlock = this.rowIndex
					//         for (var i = this.rowIndex + 1; i < this.tableRow.table.rows.length; i++) {
					//             if (this.tableRow.table.rows[i].cells[this.colIndex].domNode.textContent != 'within if') {
					//                 break
					//             }
					//             untilIfBlock += 1
					//         }
					//         if (untilIfBlock != this.tableRow.table.rows.length - 1) {
					//             if (this.tableRow.table.rows[untilIfBlock + 1].cells[this.colIndex].domNode.innerHTML != '') {
					//                 if (this.tableRow.table.rows[untilIfBlock + 1].cells[this.colIndex].domNode.firstChild.textContent.includes('elif') || this.tableRow.table.rows[untilIfBlock + 1].cells[this.colIndex].domNode.firstChild.textContent.includes('else')) {
					//                     window.alert('you cannot delete an if block that contains an elif/else block')
					//                     event.stopPropagation()
					//                     return;
					//                 }
					//             }
					//         }
					//     }
					//     var currentTableCell = this
					//     var li = document.createElement('li')
					//     li.setAttribute('role', 'menuitem')
					//     li.setAttribute('id', 'delete_body')
					//     var linesToDelete = []
					//     for (var i = currentTableCell.tableRow.table.currentRow.rowNumber + 1; i < currentTableCell.tableRow.table.rows.length; i++) {
					//         if (currentTableCell.tableRow.table.rows[i].cells[currentTableCell.tableRow.table.currentRow.currentCell.colIndex].domNode.textContent != `within ${scopeName}`) {
					//             break;
					//         }
					//         linesToDelete.push(currentTableCell.tableRow.table.rows[i].rowNumber)
					//     }
					//     li.innerHTML = `Delete ${scopeName} block (line ${linesToDelete[0] - 1} to line ${linesToDelete[linesToDelete.length - 1]})`
					//     li.onkeydown = function (e) {
					//         if (e.key == 'Enter') {
					//             var answer = window.confirm('Are you sure you want to delete this block?')
					//             if (!answer) {
					//                 return
					//             }
					//             var linesToDelete = []
					//             for (var i = currentTableCell.tableRow.table.currentRow.rowNumber + 1; i < currentTableCell.tableRow.table.rows.length; i++) {
					//                 if (currentTableCell.tableRow.table.rows[i].cells[currentTableCell.tableRow.table.currentRow.currentCell.colIndex].domNode.textContent != `within ${scopeName}`) {
					//                     break;
					//                 }
					//                 linesToDelete.push(currentTableCell.tableRow.table.rows[i].rowNumber)
					//             }
					//             var rowIndex = currentTableCell.tableRow.table.currentRow.rowNumber;
					//             if (rowIndex == 1) {
					//                 if (linesToDelete[linesToDelete.length - 1] == currentTableCell.tableRow.table.rows.length - 1) {
					//                     for (var i = linesToDelete.length - 1; i >= 0; i--) {
					//                         currentTableCell.tableRow.table.rows.splice(linesToDelete[i], 1)
					//                     }
					//                     currentTableCell.domNode.innerHTML = ''
					//                     var input = document.createElement('input')
					//                     input.setAttribute('type', 'text')
					//                     input.setAttribute('role', 'combobox')
					//                     input.setAttribute('aria-controls', 'listbox-container')
					//                     input.setAttribute('aria-owns', 'listbox-container')
					//                     input.setAttribute('aria-expanded', 'false')
					//                     input.setAttribute('aria-autocomplete', 'list')
					//                     input.setAttribute('autocomplete', 'off')
					//                     input.setAttribute('placeholder', 'enter a statement')
					//                     currentTableCell.domNode.appendChild(input)
					//                     var inputElement = new TableInput(input, currentTableCell)
					//                     inputElement.init()
					//                     currentTableCell.input = inputElement
					//                     currentTableCell.domNode.focus()
					//                     currentTableCell.tableRow.table.reload = true;
					//                 }
					//                 else {
					//                     currentTableCell.tableRow.table.currentRow = currentTableCell.tableRow.table.rows[linesToDelete[linesToDelete.length - 1] + 1];
					//                     for (var i = 1; i < currentTableCell.tableRow.table.currentRow.cells.length; i++) {
					//                         if (currentTableCell.tableRow.table.currentRow.cells[i].domNode.innerHTML == '') {
					//                             break
					//                         }
					//                         currentTableCell.tableRow.table.currentRow.currentCell = currentTableCell.tableRow.table.currentRow.cells[i]
					//                     }
					//                     for (var i = linesToDelete.length - 1; i >= 0; i--) {
					//                         currentTableCell.tableRow.table.rows.splice(linesToDelete[i], 1)
					//                     }
					//                     currentTableCell.tableRow.table.currentRow.domNode.setAttribute('data-current-line', 'true')
					//                     currentTableCell.tableRow.table.currentRow.currentCell.domNode.setAttribute('data-current-cell', 'true')
					//                     currentTableCell.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
					//                     currentTableCell.tableRow.table.currentRow.domNode.setAttribute('data-line-start', '0')
					//                     currentTableCell.tableRow.table.currentRow.domNode.setAttribute('data-line-end', `${currentTableCell.tableRow.table.currentRow.currentCell.domNode.textContent.length}`)
					//                     currentTableCell.tableRow.table.currentRow.domNode.setAttribute('data-line-number', '1')
					//                     currentTableCell.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
					//                     currentTableCell.tableRow.table.currentRow.currentCell.domNode.focus()
					//                     currentTableCell.tableRow.table.rows.splice(currentTableCell.rowIndex, 1)
					//                     currentTableCell.tableRow.table.reload = true;
					//                 }
					//             }
					//             else {
					//                 for (var i = linesToDelete.length - 1; i >= 0; i--) {
					//                     currentTableCell.tableRow.table.rows.splice(linesToDelete[i], 1)
					//                 }
					//                 if (currentTableCell.colIndex == 1) {
					//                     currentTableCell.tableRow.table.currentRow = currentTableCell.tableRow.table.rows[currentTableCell.rowIndex - 1];
					//                     for (var i = 1; i < currentTableCell.tableRow.table.currentRow.cells.length; i++) {
					//                         if (currentTableCell.tableRow.table.currentRow.cells[i].domNode.innerHTML == '') {
					//                             break
					//                         }
					//                         currentTableCell.tableRow.table.currentRow.currentCell = currentTableCell.tableRow.table.currentRow.cells[i]
					//                     }
					//                     currentTableCell.tableRow.table.currentRow.domNode.setAttribute('data-current-line', 'true')
					//                     currentTableCell.tableRow.table.currentRow.currentCell.domNode.setAttribute('data-current-cell', 'true')
					//                     currentTableCell.tableRow.table.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
					//                     currentTableCell.tableRow.table.currentRow.currentCell.domNode.focus()
					//                     currentTableCell.tableRow.table.rows.splice(currentTableCell.rowIndex, 1)
					//                     currentTableCell.tableRow.table.reload = true;
					//                 }
					//                 else {
					//                     currentTableCell.domNode.innerHTML = ''
					//                     var input = document.createElement('input')
					//                     input.setAttribute('type', 'text')
					//                     input.setAttribute('role', 'combobox')
					//                     input.setAttribute('aria-controls', 'listbox-container')
					//                     input.setAttribute('aria-owns', 'listbox-container')
					//                     input.setAttribute('aria-expanded', 'false')
					//                     input.setAttribute('aria-autocomplete', 'list')
					//                     input.setAttribute('autocomplete', 'off')
					//                     input.setAttribute('placeholder', 'enter a statement')
					//                     currentTableCell.domNode.appendChild(input)
					//                     var inputElement = new TableInput(input, currentTableCell)
					//                     inputElement.init()
					//                     currentTableCell.input = inputElement
					//                     currentTableCell.domNode.focus()
					//                     currentTableCell.tableRow.table.reload = true;
					//                 }
					//             }
					//         }
					//     }
					//     alertList.appendChild(li)

					//     if (scopeName == 'if') {
					//         // for, def
					//         var li = document.createElement('li')
					//         li.setAttribute('role', 'menuitem')
					//         li.innerHTML = 'Substitute if block with for block'
					//         li.onkeydown = function (e) {
					//             if (e.key == 'Enter') {
					//                 var answer = window.confirm('Are you sure you want substitute this block with a for block?')
					//                 if (!answer) {
					//                     return
					//                 }
					//                 currentTableCell.substituteBlock(scopeName, 'for', 'enter loop variable in range')
					//             }

					//         }
					//         alertList.appendChild(li)
					//         if (currentTableCell.colIndex == 1) {
					//             var li = document.createElement('li')
					//             li.setAttribute('role', 'menuitem')
					//             li.innerHTML = 'Substitute if block with def block'
					//             li.onkeydown = function (e) {
					//                 if (e.key == 'Enter') {
					//                     var answer = window.confirm('Are you sure you want to substitute this block with a def block?')
					//                     if (!answer) {
					//                         return
					//                     }
					//                     currentTableCell.substituteBlock(scopeName, 'def', 'enter function name ( parameter list )')
					//                 }
					//             }
					//             alertList.appendChild(li)
					//         }
					//     }
					//     if (scopeName == 'for') {
					//         // if def
					//         var li = document.createElement('li')
					//         li.setAttribute('role', 'menuitem')
					//         li.innerHTML = 'Substitute for block with if block'
					//         li.onkeydown = function (e) {
					//             if (e.key == 'Enter') {
					//                 var answer = window.confirm('Are you sure you want to substitute this block with a for block?')
					//                 if (!answer) {
					//                     return
					//                 }
					//                 currentTableCell.substituteBlock(scopeName, 'if', 'enter if condition')
					//             }
					//         }
					//         alertList.appendChild(li)
					//         if (currentTableCell.colIndex == 1) {
					//             var li = document.createElement('li')
					//             li.setAttribute('role', 'menuitem')
					//             li.innerHTML = 'Substitute for block with def block'
					//             li.onkeydown = function (e) {
					//                 if (e.key == 'Enter') {
					//                     var answer = window.confirm('Are you sure you want to substitute this block with a def block?')
					//                     if (!answer) {
					//                         return
					//                     }
					//                     currentTableCell.substituteBlock(scopeName, 'def', 'enter function name ( parameter list )')
					//                 }
					//             }
					//             alertList.appendChild(li)
					//         }
					//     }
					//     if (scopeName == 'def') {
					//         // if def
					//         var li = document.createElement('li')
					//         li.setAttribute('role', 'menuitem')
					//         li.innerHTML = 'Substitute def block with if block'
					//         li.onkeydown = function (e) {
					//             if (e.key == 'Enter') {
					//                 var answer = window.confirm('Are you sure you want to substitute this block with an if block?')
					//                 if (!answer) {
					//                     return
					//                 }
					//                 currentTableCell.substituteBlock(scopeName, 'if', 'enter if condition')
					//             }
					//         }
					//         alertList.appendChild(li)

					//         var li = document.createElement('li')
					//         li.setAttribute('role', 'menuitem')
					//         li.innerHTML = 'Substitute def block with for block'
					//         li.onkeydown = function (e) {
					//             if (e.key == 'Enter') {
					//                 var answer = window.confirm('Are you sure you want to substitute this block with a for block?')
					//                 if (!answer) {
					//                     return
					//                 }
					//                 currentTableCell.substituteBlock(scopeName, 'for', 'enter loop variable in range')
					//             }
					//         }
					//         alertList.appendChild(li)
					//     }

					//     if (scopeName == 'elif') {
					//         // if def
					//         var li = document.createElement('li')
					//         li.setAttribute('role', 'menuitem')
					//         li.innerHTML = 'Substitute elif block with if block'
					//         li.onkeydown = function (e) {
					//             if (e.key == 'Enter') {
					//                 var answer = window.confirm('Are you sure you want to substitute this block with an elif block?')
					//                 if (!answer) {
					//                     return
					//                 }
					//                 currentTableCell.substituteBlock(scopeName, 'if', 'enter if condition')
					//             }
					//         }
					//         alertList.appendChild(li)

					//         var li = document.createElement('li')
					//         li.setAttribute('role', 'menuitem')
					//         li.innerHTML = 'Substitute elif block with for block'
					//         li.onkeydown = function (e) {
					//             if (e.key == 'Enter') {
					//                 var answer = window.confirm('Are you sure you want to substitute this block with a for block?')
					//                 if (!answer) {
					//                     return
					//                 }
					//                 currentTableCell.substituteBlock(scopeName, 'for', 'enter loop variable in range')
					//             }
					//         }
					//         alertList.appendChild(li)
					//     }

					//     if (scopeName == 'else') {
					//         // if def
					//         var li = document.createElement('li')
					//         li.setAttribute('role', 'menuitem')
					//         li.innerHTML = 'Substitute else block with if block'
					//         li.onkeydown = function (e) {
					//             if (e.key == 'Enter') {
					//                 var answer = window.confirm('Are you sure you want to substitute this block with an if block?')
					//                 if (!answer) {
					//                     return
					//                 }
					//                 currentTableCell.substituteBlock(scopeName, 'if', 'enter if condition')
					//             }
					//         }
					//         alertList.appendChild(li)

					//         var li = document.createElement('li')
					//         li.setAttribute('role', 'menuitem')
					//         li.innerHTML = 'Substitute else block with elif block'
					//         li.onkeydown = function (e) {
					//             if (e.key == 'Enter') {
					//                 var answer = window.confirm('Are you sure you want to substitute this block with an elif block?')
					//                 if (!answer) {
					//                     return
					//                 }
					//                 currentTableCell.substituteBlock(scopeName, 'elif', 'enter elif condition')
					//             }
					//         }
					//         alertList.appendChild(li)

					//         var li = document.createElement('li')
					//         li.setAttribute('role', 'menuitem')
					//         li.innerHTML = 'Substitute else block with for block'
					//         li.onkeydown = function (e) {
					//             if (e.key == 'Enter') {
					//                 var answer = window.confirm('Are you sure you want to substitute this block with a for block?')
					//                 if (!answer) {
					//                     return
					//                 }
					//                 currentTableCell.substituteBlock(scopeName, 'for', 'enter loop variable in range')
					//             }
					//         }
					//         alertList.appendChild(li)
					//     }

					//     var cancelElement = document.createElement('li')
					//     cancelElement.setAttribute('role', 'menuitem')
					//     cancelElement.innerHTML = 'Cancel'
					//     cancelElement.onkeydown = function (e) {
					//         if (e.key == 'Enter') {
					//             return
					//         }
					//     }
					//     alertList.appendChild(cancelElement)
					//     this.tableRow.table.openAlert = true;
					// }
				}
			}
			break
	}
};

TableCell.prototype.handleFocus = function (event) {
	globals.isAltKeyDown = false;
	globals.isControlKeyDown = false;
	var node = this.domNode;
	var label = ''
	if (this.rowIndex > 0 && this.colIndex > 0) {
		if (this.input) {
			var children = this.domNode.childNodes
			for (var child = 0; child < children.length; child++) {
				if (children[child].tagName == 'INPUT') {
					// label += children[child].value
				} else {
					// label += children[child].textContent
				}
			}
			if (this.input.domNode.value == '') {
				if (label.trim() != '') {
					// label += ' ,'
				}
				label += 'activate this cell to ' + this.input.domNode.getAttribute('placeholder')
			}
			this.domNode.setAttribute('aria-label', label)
		}
		else {
			// this.domNode.setAttribute('aria-label', this.domNode.textContent)
			if (this.domNode.innerHTML == '') {
				playNoOpSound()
			}
		}
	}
	node.classList.add('focus');
};

TableCell.prototype.handleBlur = function (event) {
	var node = this.domNode;
	node.classList.remove('focus');
	if (this.blockTimer != null) {
		clearInterval(this.blockTimer)
	}
};

TableCell.prototype.substituteBlock = function (currentBlock, newBlock, placeholder) {
	this.domNode.innerHTML = ''
	if (newBlock != 'else') {
		this.domNode.appendChild(document.createTextNode(newBlock + ' '))
		var input = document.createElement('input')
		input.setAttribute('type', 'text')
		input.setAttribute('placeholder', placeholder)
		this.domNode.appendChild(input)
		var inputElement = new TableInput(input, this)
		inputElement.init()
		this.input = inputElement
		this.domNode.appendChild(document.createTextNode(':'))
	}
	else {
		this.domNode.appendChild(document.createTextNode(newBlock + ':'))
		this.cellType.push('block definition')
		if (this.colIndex > 1) {
			this.cellType.push('block body')
		}
	}
	this.domNode.setAttribute('tabindex', '0')
	for (var i = this.rowIndex + 1; i < this.tableRow.table.rows.length; i++) {
		if (this.tableRow.table.rows[i].cells[this.colIndex].domNode.innerHTML == '') {
			break
		}
		if (this.tableRow.table.rows[i].cells[this.colIndex].domNode.textContent != 'within ' + currentBlock) {
			break
		}
		this.tableRow.table.rows[i].cells[this.colIndex].domNode.innerHTML = '<b><small>within <i>' + newBlock + '</i></small></b>'
		if (this.tableRow.table.rows[i].cells[this.colIndex + 1].cellType.includes('block body') && !this.tableRow.table.rows[i].cells[this.colIndex + 1].cellType.includes('block definition')) {
			if (this.tableRow.table.rows[i].cells[this.colIndex + 1].input) {
				this.tableRow.table.rows[i].cells[this.colIndex + 1].input.domNode.setAttribute('placeholder', 'enter ' + newBlock + ' body')
			}
		}
	}
	this.domNode.focus()
}