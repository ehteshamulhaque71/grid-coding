class Statement {
    constructor(numLine) {
        this.numLine = numLine
        this.scopeList = []
        this.numParentLine = null
        this.isErrorLine = false
    }
}

class ASTParser {
    parseAST (code) {
        globals.statementList = [];
        globals.variableList = [];
        globals.errorLineNumberList = [];
        var nodeCount = 0;
        var nodeIdStack = [];
        var nodeStack = [];
        var blockScopeNodeList = ["if", "elif", "else", "for", "while", "try", "except", "finally", "def", "class", "with"];
        
        var codeLines = code.split(/\r?\n/).map(line => {
            var trimmed = line.trim();
            if (trimmed.length == 0){
                return line + "emptyline";
            }
            return line;
        });

        var modifiedCode = codeLines.join('\n')

        var parseTree = window.myParser.parser.parse(modifiedCode);
        var lineNumber = 1;
        globals.statementList.push(new Statement(lineNumber));
        // console.log("creating statement ", lineNumber);
        var level = 1;
        var blockScopeStack = [];
        var blockScopeStackLineNumber = [];
        var currentBlock = null;
        var soFar = 0;
        var indentationNodeFound = false
        var indentationStart = 0

        parseTree.iterate({
            enter (type, start, end) {
                // console.log('entering: ', type.name)
                nodeCount += 1;
                nodeIdStack.push(nodeCount);
                nodeStack.push(type.name)
                if (blockScopeNodeList.includes(type.name)) {
                    currentBlock = type.name;
                }
                if (type.name == 'Body') {
                    blockScopeStack.push(currentBlock)
                    // console.log(blockScopeStack)
                    blockScopeStackLineNumber.push(lineNumber)
                    level += 1
                }
            },

            leave(type, start, end) {
                if (type.name == 'EOF') {
                    var temp = start
                    start = end
                    end = temp
                }
                nodeStack.pop()
                // console.log("leaving: ", type.name)
                if (nodeCount == nodeIdStack.pop()) {
                    // console.log("processing: ", soFar, start, end)
                    // processing a leaf node
                    if (indentationNodeFound) {
                        var baseSize = start - indentationStart
                        indentationNodeFound = false
                        // console.log(globals.statementList[lineNumber - 1 - 1], baseSize)
                    }
                    if (type.name == 'Indent') {
                        indentationNodeFound = true
                        indentationStart = start
                    }
                    if (type.name == 'Indent' || type.name == 'Dedent' || type.name == 'EOF') {
                        return;
                    }
                    if (type.name == 'Dedent') {
                        // if ()
                    }
                    var numNewLine = modifiedCode.substring(soFar, start).split('\n').length - 1
                    for (let i = 0; i < numNewLine; i++) {
                        lineNumber += 1
                        var statement = new Statement(lineNumber);
                        // console.log("creating statement ", lineNumber)
                        statement.scopeList = blockScopeStack.slice(0);
                        statement.numParentLine = (blockScopeStack.slice(0).length > 0 ) ? blockScopeStackLineNumber[blockScopeStackLineNumber.length - 1] : null
                        globals.statementList.push(statement)
                    }
                    if (type.name == 'Newline') {
                        lineNumber += 1
                        var statement = new Statement(lineNumber);
                        // console.log("creating statement ", lineNumber)
                        statement.scopeList = blockScopeStack.slice(0);
                        statement.numParentLine = (blockScopeStack.slice(0).length > 0 ) ? blockScopeStackLineNumber[blockScopeStackLineNumber.length - 1] : null
                        globals.statementList.push(statement)
                    }
                    if (type.name == 'VariableName' && (nodeStack[nodeStack.length - 1] != 'FunctionDefinition' && nodeStack[nodeStack.length - 1] != 'CallExpression')) {
                        if (!globals.variableList.includes(code.substring(start, end))) {
                            globals.variableList.push(code.substring(start, end))
                        }
                    }
                    if (type.name == "ErrorNode") {
                        globals.errorLineNumberList.push(lineNumber);
                        globals.statementList[lineNumber - 1].isErrorLine = true
                    }
                    soFar = end;
                    if (type.name == "EOF") {
                        soFar = start;
                    }
                    if (type.name == "ErrorNode") {
                        soFar = start;
                    }
                }
                else {
                    if (type.name == 'Body') {
                        blockScopeStack.pop()
                        // console.log('popping', blockScopeStack)
                        blockScopeStackLineNumber.pop()
                        level -= 1
                    }
                }
                // console.log("leaving: ", type.name)
            }
        })
        if (code.substring(soFar, modifiedCode.length).includes('\n')) {
            lineNumber += 1
            var statement = new Statement(lineNumber);
            // console.log("creating statement ", lineNumber)
            statement.scopeList = blockScopeStack.slice(0);
            // console.log(blockScopeStack)
            statement.numParentLine = (blockScopeStack.slice(0).length > 0 ) ? blockScopeStackLineNumber[blockScopeStackLineNumber.length - 1] : null
            globals.statementList.push(statement)
        }
    }
}