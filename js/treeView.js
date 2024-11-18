class TreeView {
    constructor() {
        globals.treeView.addEventListener('keydown', e => this.onkeydown(e), true); 
        globals.treeView.addEventListener('keyup', e => this.onkeyup(e), true);
        globals.treeView.addEventListener('mousedown', e => this.onmousedown(e), true);
    }

    onkeydown (e) {
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
                globals.setFocusVariableToView(globals.textEditorViewName);

                globals.editor.focus();
                globals.editor.selectionStart = globals.editor.selectionEnd =
                    globals.treeObject.currentNode.domNode.getAttribute(
                        "data-line-end"
                    );
            }
            playSwitchSound()
        }

        if (e.key == "2") {
            if (globals.isControlKeyDown) {
                e.preventDefault();
                playSwitchSound()
                var code = globals.editor.value;
                var currentPosition =
                    globals.treeObject.currentNode.domNode.getAttribute(
                        "data-line-end"
                    );
                globals.currentLineNumber =
                    globals.treeObject.currentNode.domNode.getAttribute(
                        "data-line-number"
                    );
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

                globals.tableView.innerHTML = tableString;

                var tables = document.querySelectorAll('[role="table"]');
                globals.tableObject = new Table(tables[0], variableList);
                globals.tableObject.init();

                globals.tableObject.currentRow.currentCell.domNode.focus();

                globals.setFocusVariableToView(globals.tableEditorViewName);
            }
        }

        if (e.key == "3") {
            if (globals.isControlKeyDown) {
                e.preventDefault();
            }
        }

        if (e.key == "4") {
            if (globals.isControlKeyDown) {
                e.preventDefault();
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
                globals.setFocusVariableToView(globals.codeOutputViewName);
                run(globals.editor.value)
            }
        }

        if (e.key == "l") {
            if (globals.isControlKeyDown) {
                e.preventDefault()
                globals.currentLineNumber =
                    globals.treeObject.currentNode.domNode.getAttribute("data-line-number");
                var currentScopeName = "Global";
                if (globals.localScopeList[globals.currentLineNumber - 1] > 0) {
                    currentScopeName =
                        globals.localCodeList[globals.currentLineNumber - 1][
                            globals.localScopeList[globals.currentLineNumber - 1] - 1
                        ].content.split(" ")[1];
                }
                document.getElementById("current_scope").innerHTML = "At " + currentScopeName + "'s scope";
                document.getElementById("current_line").innerHTML = "At Line " + globals.currentLineNumber + " Level " + (globals.localScopeList[globals.currentLineNumber - 1] + 1) + " in " + globals.currentViewName;
                
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
    };

    onkeyup (e) {
        if (e.key == "Control") {
            globals.isControlKeyDown = false;
        }
        if (e.altKey) {
            globals.isAltKeyDown = false
        }
    };


    onmousedown (e) {
        if (e.which == 3) {
            e.preventDefault();
        }
    };
}