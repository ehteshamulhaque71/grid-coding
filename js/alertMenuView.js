class AlertMenuView {
    constructor() {
        globals.alertMenu.addEventListener('keydown', e => this.onkeydown(e), true); 
    }

    onkeydown (e) {
        if (e.key == "Tab") {
            e.stopPropagation()
            e.preventDefault();
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
            }
        }, 100);
    }

}