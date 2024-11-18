var Table = function (node, variableList = []) {
    if (typeof node !== 'object') {
        return;
    }

    this.domNode = node;
    this.currentRow = null;
    this.errorRow = [];
    this.rows = [];
    this.reload = false;
    this.openAlert = false;
    this.variableList = variableList
};

Table.prototype.init = function () {
    this.rows.push([])
    var trList = this.domNode.querySelectorAll('tr')
    for (var i = 0; i < trList.length; i++) {
        var row = new TableRow(trList[i], this, i + 1, i == 0, i == trList.length - 1)
        row.init()
        this.rows.push(row)
    }
};

Table.prototype.getTableContent = function () {
    var code = ''
    var lineSoFar = 0
    // why from 1?
    for (var i = 1; i < this.rows.length; i++) {
        // why am i setting data-line-start?
        this.rows[i].domNode.setAttribute('data-line-start', lineSoFar)
        // why from 1?
        for (var j = 1; j < this.rows[i].cells.length; j++) {
            var children = this.rows[i].cells[j].domNode.childNodes
            for (var child = 0; child < children.length; child++) {
                if (children[child].tagName == 'INPUT') {
                    code += children[child].value
                    lineSoFar += children[child].value.length
                } else {
                    if (children[child].textContent.includes('within')) {
                        code += globals.getIndentationString(1)
                        lineSoFar += globals.indentationSize
                    } else {
                        code += children[child].textContent
                        lineSoFar += children[child].textContent.length
                    }
                }
            }
        }
        // why am i seting data-line-end?
        this.rows[i].domNode.setAttribute('data-line-end', lineSoFar)
        if (!this.rows[i].isLastRow) {
            code += '\n'
            lineSoFar += 1
        }
    }
    return code
}

Table.prototype.addCondition = function () {
    var regex = new RegExp(/^(\s)*(if|elif|else|for|while|try|except|finally|def|class|with)(.)*(\:)(\s)*$/);
    for (var i = 1; i < this.rows.length; i++) {
        for (var j = 1; j < this.rows[i].cells.length; j++) {
            var children = this.rows[i].cells[j].domNode.childNodes
            var cellContent = ''
            for (var child = 0; child < children.length; child++) {
                if (children[child].tagName == 'INPUT') {
                    cellContent += children[child].value
                } else {
                    cellContent += children[child].textContent
                }
            }
            if (!cellContent.includes('within') && regex.test(cellContent)) {
                for (var k = i + 1; k < this.rows.length; k++) {
                    if (!this.rows[k].cells[j].domNode.innerHTML.includes('within')) {
                        break
                    }
                    this.rows[k].cells[j].domNode.innerHTML = `<b><small>within <i>${cellContent.trim().replace(':', '')}</i></small></b>`
                }
            }
        }
    }
}

Table.prototype.removeCondition = function () {
    var regex = new RegExp(/^(\s)*(if|elif|else|for|while|try|except|finally|def|class|with)(.)*(\:)(\s)*$/);
    for (var i = 1; i < this.rows.length; i++) {
        for (var j = 1; j < this.rows[i].cells.length; j++) {
            var children = this.rows[i].cells[j].domNode.childNodes
            var cellContent = ''
            for (var child = 0; child < children.length; child++) {
                if (children[child].tagName == 'INPUT') {
                    cellContent += children[child].value
                } else {
                    cellContent += children[child].textContent
                }
            }
            if (!cellContent.includes('within') && regex.test(cellContent)) {
                for (var k = i + 1; k < this.rows.length; k++) {
                    if (!this.rows[k].cells[j].domNode.innerHTML.includes('within')) {
                        break
                    }
                    this.rows[k].cells[j].domNode.innerHTML = `<b><small>within <i>${cellContent.trim().replace(':', '').split(' ')[0]}</i></small></b>`
                }
            }
        }
    }
}


Table.prototype.createInput = function (placeholder) {
    var input = document.createElement('input');

    input.setAttribute('type', 'text');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', 'listbox-container');
    input.setAttribute('aria-owns', 'listbox-container');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('placeholder', placeholder);

    return input;
}

Table.prototype.addBlock = function (blockName, modifyDefinitionCell = false) {
    playNewBlockSound()
    if (modifyDefinitionCell) {
        if (["if", "elif", "for", "while", "def", "class", "except", "with"].includes(blockName)) {
            this.currentRow.currentCell.domNode.innerHTML = ''
            this.currentRow.currentCell.domNode.appendChild(document.createTextNode(blockName + ' '))
            var input = this.createInput(globals.blockPlaceholders[blockName]);
            this.currentRow.currentCell.domNode.appendChild(input)
            var inputElement = new TableInput(input, this.currentRow.currentCell)
            inputElement.init()
            this.currentRow.currentCell.input = inputElement
            this.currentRow.currentCell.domNode.appendChild(document.createTextNode(':'))
            // inputElement.domNode.setAttribute('tabindex', '0')
            inputElement.domNode.focus()
        }
        else if (["else", "try", "finally"].includes(blockName)) {
            this.currentRow.currentCell.domNode.innerHTML = blockName + ':'
            // this.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
            this.currentRow.currentCell.input = null;

            // do I need cell type?
            this.currentRow.currentCell.cellType = []
            this.currentRow.currentCell.cellType.push('block definition')
            if (this.currentRow.currentCell.colIndex > 1) {
                this.currentRow.currentCell.cellType.push('block body')
            }
            this.currentRow.currentCell.domNode.focus()
        }
    }
    else {
        this.currentRow.currentCell.cellType = []
        this.currentRow.currentCell.cellType.push('block definition')
        if (this.currentRow.currentCell.colIndex > 1) {
            this.currentRow.currentCell.cellType.push('block body')
        }
    }

    var currentRowNumber = this.currentRow.rowNumber
    var currentCellNumber = this.currentRow.currentCell.colIndex

    var newRow = this.domNode.insertRow(currentRowNumber)
    newRow.setAttribute('data-line-number', currentRowNumber + 1)
    newRow.setAttribute('data-current-line', 'false')

    if (this.currentRow.isLastRow) {
        var row = new TableRow(newRow, this, currentRowNumber + 1, false, true)
        row.init()
        this.rows.push(row)
        this.currentRow.isLastRow = false
    } else {
        var row = new TableRow(newRow, this, currentRowNumber + 1, false, false)
        row.init()
        this.rows.splice(currentRowNumber + 1, 0, row)
    }

    var newCell = newRow.insertCell(0)
    newCell.setAttribute('data-current-cell', 'false')
    newCell.innerHTML = currentRowNumber + 1
    // isLastCell?
    var cell = new TableCell(newCell, row, row.rowNumber, 0, true, false)
    cell.init()
    row.cells.push(cell)

    for (var i = 1; i < currentCellNumber; i++) {
        var newCell = newRow.insertCell(i)
        newCell.setAttribute('data-current-cell', 'false')
        newCell.innerHTML = this.currentRow.cells[i].domNode.innerHTML
        newCell.setAttribute('class', this.currentRow.cells[i].domNode.getAttribute('class'))
        var cell = new TableCell(newCell, row, row.rowNumber, i, false, false)
        cell.init()
        row.cells.push(cell)
    }

    var newCell = newRow.insertCell(currentCellNumber)
    newCell.setAttribute('data-current-cell', 'false')
    newCell.innerHTML = `<b><small>within <i>${blockName}</i></small></b>`
    newCell.setAttribute('class', blockName)
    var cell = new TableCell(newCell, row, row.rowNumber, currentCellNumber, false, false)
    cell.init()
    row.cells.push(cell)

    if (this.currentRow.currentCell.isLastCell) {
        for (var i = 1; i < this.rows.length; i++) {
            var newCell = this.rows[i].domNode.insertCell(this.rows[i].cells.length)
            newCell.setAttribute('data-current-cell', 'false')
            newCell.innerHTML = ''
            this.rows[i].cells[this.rows[i].cells.length - 1].isLastCell = false
            var cell = new TableCell(newCell, this.rows[i], this.rows[i].rowNumber, currentCellNumber + 1, false, true)
            cell.init()
            this.rows[i].cells.push(cell)
        }
    }
    else {
        for (var i = currentCellNumber + 1; i < this.currentRow.cells.length; i++) {
            var newCell = newRow.insertCell(i)
            newCell.setAttribute('data-current-cell', 'false')
            newCell.innerHTML = ''
            var cell = new TableCell(newCell, row, row.rowNumber, i, false, i == this.currentRow.cells.length - 1)
            cell.init()
            row.cells.push(cell)
        }
    }

    row.cells[currentCellNumber + 1].domNode.innerHTML = ''
    var input = this.createInput(`enter ${blockName} body`)
    row.cells[currentCellNumber + 1].domNode.appendChild(input)
    var inputElement = new TableInput(input, row.cells[currentCellNumber + 1])
    inputElement.init()
    row.cells[currentCellNumber + 1].input = inputElement
    for (var i = this.currentRow.rowNumber + 2; i < this.rows.length; i++) {
        this.rows[i].rowNumber = i
        this.rows[i].isLastRow = (i == this.rows.length - 1)
        this.rows[i].cells[0].domNode.innerHTML = i
        for (var j = 0; j < this.rows[i].cells.length; j++) {
            this.rows[i].cells[j].rowIndex = i
        }
    }

    if (!modifyDefinitionCell) {
        row.cells[currentCellNumber + 1].input.domNode.focus()
        var condition = this.currentRow.currentCell.input.domNode.value
        this.currentRow.domNode.setAttribute('data-current-line', 'false')
        this.currentRow.currentCell.domNode.setAttribute('data-current-cell', 'false')
        this.rows[currentRowNumber + 1].currentCell = this.rows[currentRowNumber + 1].cells[currentCellNumber + 1]
        this.currentRow = this.rows[this.currentRow.currentCell.rowIndex + 1]
        this.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
        this.currentRow.domNode.setAttribute('data-current-line', 'true')
        this.currentRow.currentCell.domNode.setAttribute('data-current-cell', 'true')

        if(globals.isDetailIndentationBlockEnabled) {
            this.currentRow.cells[this.currentRow.currentCell.colIndex - 1].domNode.innerHTML = `<b><small>within <i>${condition.replace(':', '').trim()}</i></small></b>`
        }
    }
}

Table.prototype.addFunctionCall = function (functionName, placeholder) {
    playNewBlockSound()
    this.currentRow.currentCell.domNode.innerHTML = ''
    this.currentRow.currentCell.domNode.appendChild(document.createTextNode(functionName + '('))
    var input = this.createInput(placeholder)
    this.currentRow.currentCell.domNode.appendChild(input)
    var inputElement = new TableInput(input, this.currentRow.currentCell)
    inputElement.init()
    this.currentRow.currentCell.input = inputElement
    this.currentRow.currentCell.domNode.appendChild(document.createTextNode(')'))
    inputElement.domNode.focus()
}

Table.prototype.addRow = function (placeholder) {
    var currentRowNumber = this.currentRow.rowNumber;
    var currentCellNumber = this.currentRow.currentCell.colIndex;

    var newRow = this.domNode.insertRow(currentRowNumber);
    newRow.setAttribute('data-line-number', currentRowNumber + 1);

    if (this.currentRow.isLastRow) {
        var row = new TableRow(newRow, this, currentRowNumber + 1, false, true);
        row.init();
        this.rows.push(row);
        this.currentRow.isLastRow = false;
    }
    else {
        var row = new TableRow(newRow, this, currentRowNumber + 1, false, false);
        row.init()
        this.rows.splice(currentRowNumber + 1, 0, row)
    }

    var newCell = newRow.insertCell(0)
    newCell.innerHTML = currentRowNumber + 1
    newCell.setAttribute('data-current-cell', 'false')

    var cell = new TableCell(newCell, row, row.rowNumber, 0, true, false)
    cell.init()
    row.cells.push(cell)

    for (var i = 1; i < currentCellNumber; i++) {
        var newCell = newRow.insertCell(i)
        newCell.setAttribute('data-current-cell', 'false')
        newCell.innerHTML = this.currentRow.cells[i].domNode.innerHTML
        newCell.setAttribute('class', this.currentRow.cells[i].domNode.getAttribute('class'))
        var cell = new TableCell(newCell, row, row.rowNumber, i, false, false)
        cell.init()
        row.cells.push(cell)
    }

    var newCell = newRow.insertCell(currentCellNumber)
    var cell = new TableCell(newCell, row, row.rowNumber, currentCellNumber, false, currentCellNumber == this.currentRow.cells.length - 1)
    cell.init()
    row.cells.push(cell)
    cell.domNode.innerHTML = ''
    var input = this.createInput(placeholder)
    cell.domNode.appendChild(input)
    var inputElement = new TableInput(input, cell)
    inputElement.init()
    cell.input = inputElement
    this.currentRow.currentCell.input.domNode.setAttribute('tabindex', '-1')
    this.currentRow.domNode.setAttribute('data-current-line', 'false')
    this.currentRow.currentCell.domNode.setAttribute('data-current-cell', 'false')
    this.currentRow = row
    this.currentRow.currentCell = cell

    newRow.setAttribute('data-current-line', 'true')
    newCell.setAttribute('data-current-cell', 'true')
    this.currentRow.currentCell.domNode.setAttribute('tabindex', '0')
    this.currentRow.currentCell.input.domNode.setAttribute('tabindex', '0')
    this.currentRow.currentCell.input.domNode.focus()
    for (var i = this.currentRow.currentCell.colIndex + 1; i < this.rows[this.currentRow.rowNumber - 1].cells.length; i++) {
        var newCell = newRow.insertCell(i)
        newCell.setAttribute('data-current-cell', 'false')
        newCell.innerHTML = ''
        var cell = new TableCell(newCell, this.currentRow, this.currentRow.rowNumber, i, false, i == this.rows[this.currentRow.rowNumber - 1].cells.length - 1)
        cell.init()
        row.cells.push(cell)
    }
    for (var i = this.currentRow.rowNumber + 1; i < this.rows.length; i++) {
        this.rows[i].rowNumber = i
        this.rows[i].isLastRow = (i == this.rows.length - 1)
        this.rows[i].cells[0].domNode.innerHTML = i
        for (var j = 0; j < this.rows[i].cells.length; j++) {
            this.rows[i].cells[j].rowIndex = i
        }
    }
}