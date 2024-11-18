class Element {
    constructor(content, start, end, scope, leftScope, rightScope) {
        this.content = content;
        this.start = start;
        this.end = end;
        this.scope = scope;
        this.leftScope = leftScope;
        this.rightScope = rightScope;
    }
}

class Parser {
    constructor(parser) {
        this.parser = parser;
    }

    travarseCode(code, currentPosition) {
        // var startTime = window.performance.now();
        var astString = "";
        var nodeIdStack = [];
        var nodeStack = []
        var codeList = [[]];
        var lineScope = [0];
        var errorLineNumberList = [];

        var blockScopeNodeList = ["if", "elif", "else", "for", "while", "try", "except", "finally", "def", "class", "with"];
        var nonBlockScopeBeginningNodeList = ["(", "{", "["];
        var nonBlockScopeEndingNodeList = [")", "}", "]"];
        var variableList = []

        var nodeCount = 0;
        var nonBlockScopeCount = 0;

        var scopeStack = [];
        var blockScopeStack = [];

        var lineNumber = 1;
        var soFar = 0;
        var dedentIdx = 0;
        var isEOFSet = false;
        var isDedentSet = false;

        var tree = this.parser.parse(code);

        tree.iterate({
            enter(type, start, end) {
                nodeCount += 1;
                nodeIdStack.push(nodeCount);
                nodeStack.push(type.name)
                // if (type.name == 'EOF') {
                //     var temp = start
                //     start = end
                //     end = temp
                // }

                astString += `<ul><li>${type.name} (${start},${end})`;

                if (type.name == ":") {
                    blockScopeStack.push(scopeStack[scopeStack.length - 1]);
                }

                if (blockScopeNodeList.includes(type.name)) {
                    scopeStack.push(type.name);
                }

                if (nonBlockScopeBeginningNodeList.includes(type.name)) {
                    scopeStack.push(type.name);
                    nonBlockScopeCount += 1;
                }

                if (nonBlockScopeEndingNodeList.includes(type.name)) {
                    scopeStack.pop();
                    nonBlockScopeCount -= 1;
                }

                if (type.name == "String") {
                    if (currentPosition >= start && currentPosition < end) {
                        nonBlockScopeCount += 1;
                    }
                }
            },

            leave(type, start, end) {
                nodeStack.pop()
                if (nodeCount == nodeIdStack.pop()) {
                    if (type.name == 'VariableName' && (nodeStack[nodeStack.length - 1] != 'FunctionDefinition' && nodeStack[nodeStack.length - 1] != 'CallExpression')) {
                        if (!variableList.includes(code.substring(start, end))) {
                            variableList.push(code.substring(start, end))
                        }
                    }
                    if (type.name == "EOF") {
                        if (!isEOFSet) {
                            if (code[soFar] == "\n") {
                                lineNumber += 1;
                                codeList.push([]);
                                lineScope.push(0);
                            }
                            soFar = end;
                        }
                    }
                    if (type.name == "Dedent") {
                        if (nodeCount == dedentIdx + 1) {
                            dedentIdx = nodeCount;
                        } else {
                            isDedentSet = false;
                        }
                        if (!isDedentSet) {
                            if (code[soFar] == "\n") {
                                lineNumber += 1;
                                codeList.push([]);
                                lineScope.push(0);
                            }
                            soFar += 1;
                        }
                    }

                    if (codeList[codeList.length - 1].length == 0) {
                        var newLine = true;
                    } else {
                        var newLine = false;
                    }

                    var fragment = "";
                    var consecutive = false;
                    var fragmentStart = soFar;
                    for (var i = soFar; i < start; i++) {
                        if (code[i] == "\n") {
                            if (newLine) {
                                if (type.name == "EOF") {
                                    if (!isEOFSet) {
                                        var len = fragment.length;
                                        for (
                                            var j = 0;
                                            j < blockScopeStack.length;
                                            j++
                                        ) {
                                            if (len >= globals.indentationSize) {
                                                var element = new Element(
                                                    "within " +
                                                    blockScopeStack[j],
                                                    fragmentStart + j * globals.indentationSize,
                                                    fragmentStart + j * globals.indentationSize + globals.indentationSize,
                                                    j,
                                                    j,
                                                    j + 1
                                                );
                                                codeList[
                                                    codeList.length - 1
                                                ].push(element);
                                                lineScope[
                                                    lineScope.length - 1
                                                ] += 1;
                                                len -= globals.indentationSize;
                                            }
                                        }
                                        if (len > 0) {
                                            var element = new Element(
                                                fragment.substr(
                                                    fragment.length - len
                                                ),
                                                fragmentStart +
                                                (fragment.length - len),
                                                fragmentStart + fragment.length,
                                                lineScope[lineScope.length - 1],
                                                lineScope[lineScope.length - 1],
                                                lineScope[lineScope.length - 1]
                                            );
                                            codeList[codeList.length - 1].push(
                                                element
                                            );
                                        }
                                        isEOFSet = true;
                                    }
                                } else if (type.name == "Dedent") {
                                    if (!isDedentSet) {
                                        var len = fragment.length;
                                        for (
                                            var j = 0;
                                            j < blockScopeStack.length;
                                            j++
                                        ) {
                                            if (len >= globals.indentationSize) {
                                                var element = new Element(
                                                    "within " +
                                                    blockScopeStack[j],
                                                    fragmentStart + j * globals.indentationSize,
                                                    fragmentStart + j * globals.indentationSize + globals.indentationSize,
                                                    j,
                                                    j,
                                                    j + 1
                                                );
                                                codeList[
                                                    codeList.length - 1
                                                ].push(element);
                                                lineScope[
                                                    lineScope.length - 1
                                                ] += 1;
                                                len -= globals.indentationSize;
                                            }
                                        }
                                        if (len > 0) {
                                            var element = new Element(
                                                fragment.substr(
                                                    fragment.length - len
                                                ),
                                                fragmentStart +
                                                (fragment.length - len),
                                                fragmentStart + fragment.length,
                                                lineScope[lineScope.length - 1],
                                                lineScope[lineScope.length - 1],
                                                lineScope[lineScope.length - 1]
                                            );
                                            codeList[codeList.length - 1].push(
                                                element
                                            );
                                        }
                                        isDedentSet = true;
                                        dedentIdx = nodeCount;
                                    }
                                } else {
                                    var len = fragment.length;
                                    for (
                                        var j = 0;
                                        j < blockScopeStack.length;
                                        j++
                                    ) {
                                        if (len >= globals.indentationSize) {
                                            var element = new Element(
                                                "within " + blockScopeStack[j],
                                                fragmentStart + j * globals.indentationSize,
                                                fragmentStart + j * globals.indentationSize + globals.indentationSize,
                                                j,
                                                j,
                                                j + 1
                                            );
                                            codeList[codeList.length - 1].push(
                                                element
                                            );
                                            lineScope[
                                                lineScope.length - 1
                                            ] += 1;
                                            len -= globals.indentationSize;
                                        }
                                    }
                                    if (len > 0) {
                                        var element = new Element(
                                            fragment.substr(
                                                fragment.length - len
                                            ),
                                            fragmentStart +
                                            (fragment.length - len),
                                            fragmentStart + fragment.length,
                                            lineScope[lineScope.length - 1],
                                            lineScope[lineScope.length - 1],
                                            lineScope[lineScope.length - 1]
                                        );
                                        codeList[codeList.length - 1].push(
                                            element
                                        );
                                    }
                                }
                            } else {
                                if (fragment.length > 0) {
                                    var element = new Element(
                                        fragment,
                                        fragmentStart,
                                        fragmentStart + fragment.length,
                                        lineScope[lineScope.length - 1],
                                        lineScope[lineScope.length - 1],
                                        lineScope[lineScope.length - 1]
                                    );
                                    codeList[codeList.length - 1].push(element);
                                }
                            }
                            newLine = true;
                            lineNumber += 1;
                            codeList.push([]);
                            lineScope.push(0);
                            fragment = "";
                            consecutive = false;
                            fragmentStart = i + 1;
                        } else {
                            fragment += code[i];
                            consecutive = true;
                        }
                    }
                    if (consecutive) {
                        if (newLine) {
                            if (type.name == "EOF") {
                                if (!isEOFSet) {
                                    var len = fragment.length;
                                    for (
                                        var j = 0;
                                        j < blockScopeStack.length;
                                        j++
                                    ) {
                                        if (len >= globals.indentationSize) {
                                            var element = new Element(
                                                "within " + blockScopeStack[j],
                                                fragmentStart + j * globals.indentationSize,
                                                fragmentStart + j * globals.indentationSize + globals.indentationSize,
                                                j,
                                                j,
                                                j + 1
                                            );
                                            codeList[codeList.length - 1].push(
                                                element
                                            );
                                            lineScope[
                                                lineScope.length - 1
                                            ] += 1;
                                            len -= globals.indentationSize;
                                        }
                                    }
                                    if (len > 0) {
                                        var element = new Element(
                                            fragment.substr(
                                                fragment.length - len
                                            ),
                                            fragmentStart +
                                            (fragment.length - len),
                                            fragmentStart + fragment.length,
                                            lineScope[lineScope.length - 1],
                                            lineScope[lineScope.length - 1],
                                            lineScope[lineScope.length - 1]
                                        );
                                        codeList[codeList.length - 1].push(
                                            element
                                        );
                                    }
                                    isEOFSet = true;
                                }
                            } else if (type.name == "Dedent") {
                                if (!isDedentSet) {
                                    var len = fragment.length;
                                    for (
                                        var j = 0;
                                        j < blockScopeStack.length;
                                        j++
                                    ) {
                                        if (len >= globals.indentationSize) {
                                            var element = new Element(
                                                "within " + blockScopeStack[j],
                                                fragmentStart + j * globals.indentationSize,
                                                fragmentStart + j * globals.indentationSize + globals.indentationSize,
                                                j,
                                                j,
                                                j + 1
                                            );
                                            codeList[codeList.length - 1].push(
                                                element
                                            );
                                            lineScope[
                                                lineScope.length - 1
                                            ] += 1;
                                            len -= globals.indentationSize;
                                        }
                                    }
                                    if (len > 0) {
                                        var element = new Element(
                                            fragment.substr(
                                                fragment.length - len
                                            ),
                                            fragmentStart +
                                            (fragment.length - len),
                                            fragmentStart + fragment.length,
                                            lineScope[lineScope.length - 1],
                                            lineScope[lineScope.length - 1],
                                            lineScope[lineScope.length - 1]
                                        );
                                        codeList[codeList.length - 1].push(
                                            element
                                        );
                                    }
                                    isDedentSet = true;
                                    dedentIdx = nodeCount;
                                }
                            } else {
                                var len = fragment.length;
                                for (
                                    var j = 0;
                                    j < blockScopeStack.length;
                                    j++
                                ) {
                                    if (len >= globals.indentationSize) {
                                        var element = new Element(
                                            "within " + blockScopeStack[j],
                                            fragmentStart + j * globals.indentationSize,
                                            fragmentStart + j * globals.indentationSize + globals.indentationSize,
                                            j,
                                            j,
                                            j + 1
                                        );
                                        codeList[codeList.length - 1].push(
                                            element
                                        );
                                        lineScope[lineScope.length - 1] += 1;
                                        len -= globals.indentationSize;
                                    }
                                }
                                if (len > 0) {
                                    var element = new Element(
                                        fragment.substr(fragment.length - len),
                                        fragmentStart + (fragment.length - len),
                                        fragmentStart + fragment.length,
                                        lineScope[lineScope.length - 1],
                                        lineScope[lineScope.length - 1],
                                        lineScope[lineScope.length - 1]
                                    );
                                    codeList[codeList.length - 1].push(element);
                                }
                            }
                        } else {
                            if (fragment.length > 0) {
                                var element = new Element(
                                    fragment,
                                    fragmentStart,
                                    fragmentStart + fragment.length,
                                    lineScope[lineScope.length - 1],
                                    lineScope[lineScope.length - 1],
                                    lineScope[lineScope.length - 1]
                                );
                                codeList[codeList.length - 1].push(element);
                            }
                        }
                    }

                    if (type.name == "Newline") {
                        lineNumber += 1;
                        codeList.push([]);
                        lineScope.push(0);
                    }

                    if (type.name == "ErrorNode") {
                        errorLineNumberList.push(lineNumber);
                    }

                    if (type.name == "Dedent" || type.name == "EOF") {
                        blockScopeStack.pop();
                        scopeStack.pop();
                    }

                    if (
                        ![
                            "Newline",
                            "Indent",
                            "Dedent",
                            "EOF",
                            "ErrorNode",
                        ].includes(type.name)
                    ) {
                        if (type.name == ":") {
                            var element = new Element(
                                code.substring(start, end),
                                start,
                                end,
                                lineScope[lineScope.length - 1] + 1,
                                lineScope[lineScope.length - 1],
                                lineScope[lineScope.length - 1] + 1
                            );
                        } else {
                            var element = new Element(
                                code.substring(start, end),
                                start,
                                end,
                                lineScope[lineScope.length - 1],
                                lineScope[lineScope.length - 1],
                                lineScope[lineScope.length - 1]
                            );
                        }
                        codeList[codeList.length - 1].push(element);
                    }
                    soFar = end;
                    if (type.name == "EOF") {
                        soFar = start;
                    }
                    if (type.name == "ErrorNode") {
                        soFar = start;
                    }
                } else {
                    if (type.name == "ErrorNode") {
                        errorLineNumberList.push(lineNumber);
                    }
                    if (type.name == "Script") {
                        if (codeList[codeList.length - 1].length == 0) {
                            var newLine = true;
                        } else {
                            var newLine = false;
                        }

                        var fragment = "";
                        var fragmentStart = soFar;
                        var consecutive = false;
                        for (var i = soFar; i < end; i++) {
                            if (code[i] == "\n") {
                                consecutive = false;
                                if (newLine) {
                                    var len = fragment.length;
                                    for (
                                        var j = 0;
                                        j < blockScopeStack.length;
                                        j++
                                    ) {
                                        if (len >= globals.indentationSize) {
                                            var element = new Element(
                                                "within " + blockScopeStack[j],
                                                fragmentStart + j * globals.indentationSize,
                                                fragmentStart + j * globals.indentationSize + globals.indentationSize,
                                                j,
                                                j,
                                                j + 1
                                            );
                                            codeList[codeList.length - 1].push(
                                                element
                                            );
                                            lineScope[
                                                lineScope.length - 1
                                            ] += 1;
                                            len -= globals.indentationSize;
                                        }
                                    }
                                    if (len > 0) {
                                        var element = new Element(
                                            fragment.substr(
                                                fragment.length - len
                                            ),
                                            fragmentStart +
                                            (fragment.length - len),
                                            fragmentStart + fragment.length,
                                            lineScope[lineScope.length - 1],
                                            lineScope[lineScope.length - 1],
                                            lineScope[lineScope.length - 1]
                                        );
                                        codeList[codeList.length - 1].push(
                                            element
                                        );
                                    }
                                } else {
                                    if (fragment.length > 0) {
                                        var element = new Element(
                                            fragment,
                                            fragmentStart,
                                            fragmentStart + fragment.length,
                                            lineScope[lineScope.length - 1],
                                            lineScope[lineScope.length - 1],
                                            lineScope[lineScope.length - 1]
                                        );
                                        codeList[codeList.length - 1].push(
                                            element
                                        );
                                    }
                                }

                                newLine = true;
                                lineNumber += 1;
                                codeList.push([]);
                                lineScope.push(0);
                                consecutive = false;
                                fragment = "";
                                fragmentStart = i + 1;
                            } else {
                                fragment += code[i];
                                consecutive = true;
                            }
                        }
                        if (consecutive) {
                            if (newLine) {
                                var len = fragment.length;
                                for (
                                    var j = 0;
                                    j < blockScopeStack.length;
                                    j++
                                ) {
                                    if (len >= globals.indentationSize) {
                                        var element = new Element(
                                            "within " + blockScopeStack[j],
                                            fragmentStart + j * globals.indentationSize,
                                            fragmentStart + j * globals.indentationSize + globals.indentationSize,
                                            j,
                                            j,
                                            j + 1
                                        );
                                        codeList[codeList.length - 1].push(
                                            element
                                        );
                                        lineScope[lineScope.length - 1] += 1;
                                        len -= globals.indentationSize;
                                    }
                                }
                                if (len > 0) {
                                    var element = new Element(
                                        fragment.substr(fragment.length - len),
                                        fragmentStart + (fragment.length - len),
                                        fragmentStart + fragment.length,
                                        lineScope[lineScope.length - 1],
                                        lineScope[lineScope.length - 1],
                                        lineScope[lineScope.length - 1]
                                    );
                                    codeList[codeList.length - 1].push(element);
                                }
                            } else {
                                if (fragment.length > 0) {
                                    var element = new Element(
                                        fragment,
                                        fragmentStart,
                                        fragmentStart + fragment.length,
                                        lineScope[lineScope.length - 1],
                                        lineScope[lineScope.length - 1],
                                        lineScope[lineScope.length - 1]
                                    );
                                    codeList[codeList.length - 1].push(element);
                                }
                            }
                        }
                    }
                }
                astString += "</ul>";
            },
        });

        // var endTime = window.performance.now();
        // console.log((endTime - startTime) / 1000)

        return { astString, lineScope, codeList, errorLineNumberList, variableList };
    }
}
