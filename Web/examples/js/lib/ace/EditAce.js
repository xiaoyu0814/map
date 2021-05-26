var Editor = function (domId){
    this.aceEditor = null;
    this.domId = domId;
    this.initCodeEditor();
}
//初始化编辑器
Editor.prototype.initCodeEditor = function(){
    if (!this.aceEditor) {
        this.aceEditor = ace.edit(this.domId);
        let theme = "clouds"
        let language = "javascript"
            
        this.aceEditor.setTheme("ace/theme/" + theme);
        this.aceEditor.session.setMode("ace/mode/" + language);
        ace.require("ace/ext/language_tools");
        this.aceEditor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        this.aceEditor.setShowPrintMargin(false);
        this.aceEditor.setFontSize(14);
        this.aceEditor.$blockScrolling = Infinity;
    }
}
Editor.prototype.setTheme = function(theme) {
    if (this.aceEditor) {
        this.aceEditor.setTheme("ace/theme/" + theme);
    }
}
Editor.prototype.setFontSize = function(value) {
    if (this.aceEditor) {
        return this.aceEditor.setFontSize(value)
    }
}
Editor.prototype.getFontSize = function() {
    if (this.aceEditor) {
        return this.aceEditor.getFontSize();
    }
    return 18;
}
//编辑器输入文本
Editor.prototype.setValue = function(textValue){
    if (this.aceEditor) {
         this.aceEditor.setValue(textValue);
         this.aceEditor.clearSelection();
         this.aceEditor.moveCursorTo(0, 0);
    }
}
//编辑器输入文本
Editor.prototype.getValue = function(){
    if (this.aceEditor) {
        return this.aceEditor.getValue();
    } else {
        return "";
    }
}

Editor.prototype.clear = function() {
    this.setValue("");
}

Editor.prototype.resize = function () {
    if (this.aceEditor) {
        this.aceEditor.resize(true);
    }
}

Editor.prototype.insert = function(text) {
    if (this.aceEditor) {
        this.aceEditor.session.insert(this.aceEditor.getCursorPosition(), text)
    }
}

Editor.prototype.moveCursorTo = function(row, column) {
    if (this.aceEditor) {
        this.aceEditor.moveCursorTo(row, column)
    }
}

Editor.prototype.findAll = function(needle, options) {
    if (this.aceEditor) {
        return this.aceEditor.findAll(needle, options, false)
    }
}
Editor.prototype.getSession = function(){
    if (this.aceEditor) {
        return this.aceEditor.getSession()
    }
}
