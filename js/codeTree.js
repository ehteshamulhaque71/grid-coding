class CodeContent {
    constructor(content, start, end) {
        this.content = content
        this.start = start
        this.end = end
    }
}

class Line {
    constructor(number) {
        this.number = number
        this.isCurrentLine = false
        this.content = []
        this.contentString = ''
        this.scopeCount = null
        this.parent = null
        this.scopeList = []
        this.firstChild = null
        this.leftSibling = null
        this.rightSibling = null
        this.setSize = 0
        this.level = 0
        this.pos = 0
        this.startIndex = 0
        this.endIndex = 0
        this.isErrorInLine = false
    }

    addContent(codeContent) {
        this.content.push(codeContent)
        this.contentString += codeContent.content
        if (this.content.length == 1) {
            this.startIndex = codeContent.start
        }
        this.endIndex = codeContent.end
    }

    addChild(childNode) {
        this.setSize += 1
        if (this.firstChild == null) {

            this.firstChild = childNode
            childNode.pos = 1
        }
        else {
            var nodePointer = this.firstChild
            while (nodePointer.rightSibling != null) {
                nodePointer = nodePointer.rightSibling
            }
            nodePointer.rightSibling = childNode
            childNode.leftSibling = nodePointer
            childNode.pos = childNode.leftSibling.pos + 1
        }
    }

    getLastChild() {
        var nodePointer = this.firstChild
        while (nodePointer.rightSibling != null) {
            nodePointer = nodePointer.rightSibling
        }
        return nodePointer
    }
}

class CodeTree {
    constructor() {
        this.head = new Line(0)
        this.head.level = 0
        this.head.pos = 1
        this.head.content = "code"
        this.head.scopeCount = -1
        this.tail = this.head
        this.current = this.head
        this.treeString = '<ul id="tree-list" role="tree" aria-labelledby="tree1">'
        this.tableString = '<table role="table">'
        this.maxBlockScope = 0
    }

    buildCodeTree(codeList, scopeList, errorList, currentLineNumber) {
        for (var lineNumber = 0; lineNumber < codeList.length; lineNumber++) {
            if (codeList[lineNumber].length > 0) {
                if (scopeList[lineNumber] > this.current.scopeCount + 1) {
                    this.current = this.current.getLastChild();
                }
                else if (scopeList[lineNumber] < this.current.scopeCount + 1) {
                    var parentScope = scopeList[lineNumber] - 1;
                    while (this.current.scopeCount != parentScope) {
                        this.current = this.current.parent;
                    }
                }
                if (scopeList[lineNumber] > this.maxBlockScope) {
                    this.maxBlockScope = scopeList[lineNumber];
                }
                var line = new Line(lineNumber + 1);
                if (lineNumber + 1 == currentLineNumber) {
                    line.isCurrentLine = true;
                    var currentScopeName = "Global";
                    if (scopeList[lineNumber] > 0) {
                        currentScopeName = codeList[lineNumber][scopeList[lineNumber] - 1].content.split(" ")[1];
                    }
                    document.getElementById("current_scope").innerHTML = "At " + currentScopeName + "'s scope";
                }
                line.parent = this.current;
                line.level = this.current.level;
                line.scopeCount = scopeList[lineNumber];
                line.startIndex = codeList[lineNumber][0].start;
                line.endIndex = codeList[lineNumber][codeList[lineNumber].length - 1].end;
                if (errorList.includes(lineNumber + 1)) {
                    line.isErrorInLine = true;
                }
                var idx = 0;
                for (var i = 0; i < line.scopeCount; i++) {
                    line.scopeList.push(codeList[lineNumber][i].content.split(" ")[1]);
                    idx += 1;
                }
                for (var i = idx; i < codeList[lineNumber].length; i++) {
                    line.addContent(new CodeContent(codeList[lineNumber][i].content, codeList[lineNumber][i].start, codeList[lineNumber][i].end));
                }
                this.current.addChild(line);
            }
        }
    }

    addLine(line) {
        this.current.addChild(line)
    }

    initTableString() {
        this.tableString += '<tbody>'
    }

    getLastLine() {
        return this.current.getLastChild()
    }

    getParentContentString(item) {
        return item.contentString;
    }

    getView(rootItem) {
        var rowCount = 0
        this.tableString += `<tr data-line-number="${rootItem.number}" data-current-line="${rootItem.isCurrentLine}" data-line-start="${rootItem.startIndex}" data-line-end="${rootItem.endIndex}" data-error-line="${rootItem.isErrorInLine}">`
        this.tableString += `<td data-current-cell="${rootItem.isCurrentLine}">` + rootItem.number + '</td>'

        if (globals.isDetailIndentationBlockEnabled) {
            /** if detailed indetation block is enabled */
            var currentParent = rootItem.parent;
            var indentStrings = [];
            for (var i = rootItem.scopeList.length - 1; i >= 0 ; i--) {
                indentStrings.push('<td class=' + rootItem.scopeList[i] + '><b><small>within <i>' + this.getParentContentString(currentParent).trim().replace(':', '') + '</i></small></b></td>');
                currentParent = currentParent.parent;
                rowCount += 1
            }
            this.tableString += indentStrings.reverse().join("");
        }
        else {
            for (var i = 0; i < rootItem.scopeList.length; i++) {
                this.tableString += '<td class=' + rootItem.scopeList[i] + '><b><small>within <i>' + rootItem.scopeList[i] + '</i></small></b></td>'
                rowCount += 1
            }
        }

        

        if (rootItem.firstChild != null) {
            if (["if", "elif", "for", "while", "def", "class", "except", "with"].includes(rootItem.content[0].content)) {
                this.tableString += `<td>${rootItem.content[0].content} <input role="combobox" aria-controls="listbox-container" aria-owns="listbox-container" aria-expanded="false" aria-autocomplete="list" autocomplete="off" placeholder="${globals.blockPlaceholders[rootItem.content[0].content]}" type="text" value='${rootItem.contentString.substring(rootItem.content[0].content.length + 1, rootItem.contentString.length - 1).replace(/'/g,'&#039;')}'>:</td>`
            }
            else if (["else", "try", "finally"].includes(rootItem.content[0].content)) {
                this.tableString += `<td>${rootItem.content[0].content}:</td>`
            }
        }
        else {
            // if (rootItem.contentString.includes('print') && rootItem.contentString.includes('(') && rootItem.contentString.includes(')')) {
            //     if (rootItem.content[1].content == '(' && rootItem.content[rootItem.content.length - 1].content == ')') {
            //         var printArgs = rootItem.contentString.split('(')[1].split(')')[0]
            //         this.tableString += `<td>print(<input role="combobox" aria-controls="listbox-container" aria-owns="listbox-container" aria-expanded="false" aria-autocomplete="list" autocomplete="off" placeholder="enter a string to print" tabindex="-1" type="text" value='${printArgs.replace(/'/g,'&#039;')}'>)</td>`
            //     }
            // }
            if (rootItem.scopeList.length > 0) {
                this.tableString += `<td><input role="combobox" aria-controls="listbox-container" aria-owns="listbox-container" aria-expanded="false" aria-autocomplete="list" autocomplete="off" placeholder="enter ${rootItem.scopeList[rootItem.scopeList.length - 1]} body" tabindex="-1" type="text" value='${rootItem.contentString.replace(/'/g,'&#039;')}'></td>`
            }
            else {
                this.tableString += `<td><input role="combobox" aria-controls="listbox-container" aria-owns="listbox-container" aria-expanded="false" aria-autocomplete="list" autocomplete="off" placeholder="enter a statement" tabindex="-1" type="text" value='${rootItem.contentString.replace(/'/g,'&#039;')}'></td>`
            }
        }
        rowCount += 1
        for (var i = rowCount; i <= this.maxBlockScope; i++) {
            this.tableString += '<td></td>'
        }

        if (rootItem.firstChild == null) {
            if (rootItem.isCurrentLine) {
                this.treeString += `<li role="treeitem" tabindex="0" aria-label='Line ${rootItem.number}: ${rootItem.contentString}' data-line-number="${rootItem.number}" data-line-start="${rootItem.startIndex}" data-line-end="${rootItem.endIndex}">`
            }
            else {
                this.treeString += `<li role="treeitem" tabindex="-1" aria-label='Line ${rootItem.number}: ${rootItem.contentString}' data-line-number="${rootItem.number}" data-line-start="${rootItem.startIndex}" data-line-end="${rootItem.endIndex}">`
            }

            this.treeString += `<span role="treeitem" data-error-line="${rootItem.isErrorInLine}">` + rootItem.contentString + '</span>'
            this.treeString += '</li>'
        }
        else {
            if (rootItem.isCurrentLine) {
                this.treeString += `<li role="treeitem" aria-label='Line ${rootItem.number}: ${rootItem.contentString}' aria-expanded="true" tabindex="0" data-line-number="${rootItem.number}" data-line-start="${rootItem.startIndex}" data-line-end="${rootItem.endIndex}">`
            }
            else {
                this.treeString += `<li role="treeitem" aria-label='Line ${rootItem.number}: ${rootItem.contentString}' aria-expanded="true" tabindex="-1" data-line-number="${rootItem.number}" data-line-start="${rootItem.startIndex}" data-line-end="${rootItem.endIndex}">`
            }
            this.treeString += `<span role="treeitem" data-error-line="${rootItem.isErrorInLine}">` + rootItem.contentString + '</span>'
            this.treeString += '<ul role="group">'
            this.getView(rootItem.firstChild)
            this.treeString += '</li>'
        }
        if (rootItem.rightSibling == null) {
            this.treeString += '</ul>'
            return
        }
        else {
            this.getView(rootItem.rightSibling)
        }
    }
}