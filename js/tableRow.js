var TableRow = function (node, table, rowNumber, isFirstRow, isLastRow) {
    if (typeof node !== 'object') {
        return;
    }

    this.table = table;
    this.domNode = node;
    this.isFirstRow = isFirstRow
    this.rowNumber = rowNumber
    this.isLastRow = isLastRow
    this.currentCell = null
    this.isControlKeyDown = false
    this.isCurrentRow = false

    if (node.getAttribute('data-current-line') == 'true') {
        this.isCurrentRow = true;
        this.table.currentRow = this;
    }

    if (node.getAttribute('data-error-line') == 'true') {
        this.table.errorRow.push(this);
    }

    this.cells = []
};


TableRow.prototype.init = function () {
    var tdList = this.domNode.querySelectorAll('td')

    for (var i = 0; i < tdList.length; i++) {
        var cell = new TableCell(tdList[i], this, this.rowNumber, i, i == 0, i == tdList.length - 1)
        cell.init()
        this.cells.push(cell)
    }

    this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
    this.domNode.addEventListener('focus', this.handleFocus.bind(this));
    this.domNode.addEventListener('blur', this.handleBlur.bind(this));
};

TableRow.prototype.focusCurrentCell = function () {
    this.currentCell.domNode.focus()
};

TableRow.prototype.handleKeydown = function (event) {
    switch (event.key) {
        case "Control":
            this.isControlKeyDown = true
            break
    }
};

TableRow.prototype.handleKeyup = function (event) {
    switch (event.key) {
        case "Control":
            this.isControlKeyDown = false
            break
    }
};

TableRow.prototype.handleFocus = function (event) {
    var node = this.domNode;
    node.classList.add('focus');
};

TableRow.prototype.handleBlur = function (event) {
    var node = this.domNode;
    node.classList.remove('focus');
};