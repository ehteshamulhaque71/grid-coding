var globals = {
	indentationSize: 4,
	textEditorViewName: "Text Editor",
	tableEditorViewName: "Table Editor",
	codeTreeViewName: "Code Tree",
	bookmarksViewName: "Bookmarks",
	codeOutputViewName: "Code Output",
	navbarViewName: "Navigation Bar",

	currentViewName: this.textEditorViewName,

	blockPlaceholders: {
		"if": "enter if condition",
		"elif": "enter elif condition",
		"for": "enter for loop condition",
		"while": "enter while loop condition",
		"def": "enter function name and parameters",
		"class": "enter class name",
		"except": "enter exception name",
		"with": "enter with context"
	},

	getIndentationString: function (numIndentation) {
		indentationString = ""
		for (let i = 0; i < numIndentation * this.indentationSize; i++) {
			indentationString += " "
		}
		return indentationString
	},

	setFocusVariableToView: function (viewName) {
		console.log(viewName)
		this.isEditorFocused = false;
		this.isTableFocused = false;
		this.isTreeFocused = false;
		this.isBookmarkFocused = false;
		this.isOutputFocused = false;
		this.isNavbarFocused = false;
		this.currentViewName = viewName
		switch (viewName) {
			case this.navbarViewName:
				this.isNavbarFocused = true;
				break;
			case this.textEditorViewName:
				this.isEditorFocused = true;
				break;
			case this.tableEditorViewName:
				this.isTableFocused = true;
				break;
			case this.codeTreeViewName:
				this.isTreeFocused = true;
				break;
			case this.bookmarksViewName:
				this.isBookmarkFocused = true;
				break;
			case this.codeOutputViewName:
				this.isOutputFocused = true;
				break;
		}
	},


	setFixedIndentedCode: function (code) {
		/** sets fixed indented code in text editor */

		// generate statementList
		globals.astParser.parseAST(code)

		var lines = code.split(/\r\n|\r|\n/);
		var indentedCode = lines[0];
		for (let i = 1; i < lines.length; i++) {
			if (lines[i].trim() != '') {
				let statementScopeListSize = globals.statementList[i].scopeList.length
				indentedCode += '\n' + globals.getIndentationString(statementScopeListSize) + lines[i].trim()
			}
		}

		globals.editor.value = indentedCode;
		globals.editor.selectionStart = globals.editor.selectionEnd = indentedCode.length;
	},

	fixIndentation: function (code) {
		/** sets fixed indented code in text editor */

		// generate statementList
		globals.astParser.parseAST(code)

		var lines = code.split(/\r\n|\r|\n/);
		var indentedCode = lines[0];
		for (let i = 1; i < lines.length; i++) {
			if (lines[i].trim() != '') {
				let statementScopeListSize = globals.statementList[i].scopeList.length
				indentedCode += '\n' + globals.getIndentationString(statementScopeListSize) + lines[i].trim()
			}
		}

		return indentedCode;
	}
}