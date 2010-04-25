var TbAreGoOptions = {

	textboxId_audioFileName: "TbAreGo-audioFileName",

	prefBranch: "extensions.TbAreGo.",

	PREFname_audioPath: "audioFilePath",

	_prefSvc: null,
	get prefSvc() {
		if (!this._prefSvc) {
			this._prefSvc = Components.classes["@mozilla.org/preferences-service;1"]
			                .getService(Components.interfaces.nsIPrefService)
			                .getBranch(this.prefBranch)
			                .QueryInterface(Components.interfaces.nsIPrefBranch2);
		}
		return this._prefSvc;
	},

	_strBundle: null,
	get strBundle() {
		if (!this._strBundle) {
			this._strBundle = Components.classes["@mozilla.org/intl/stringbundle;1"]
			                  .getService(Components.interfaces.nsIStringBundleService)
			                  .createBundle("chrome://TbAreGo/locale/TbAreGo.properties");
		}
		return this._strBundle;
	},

	handleEvent: function (aEvent) {
		switch (aEvent.type) {
			case "load":
				this.onLoad();
				break;
		}
	},

	onLoad: function () {
		window.removeEventListener("load", this, false);

		var path = this.prefSvc.getComplexValue(this.PREFname_audioPath,
		                                        Components.interfaces.nsISupportsString);
		document.getElementById(this.textboxId_audioFileName).value = path;
	},

	selectFile: function () {
		var filepicker = Components.classes['@mozilla.org/filepicker;1']
		                 .createInstance(Components.interfaces.nsIFilePicker);
		filepicker.appendFilter("Audio File", "*.ogg;");
		
		var title = this.strBundle.GetStringFromName("TbAreGo.option.selectAudio.title");
		filepicker.init(window,
		                title,
		                Components.interfaces.nsIFilePicker.modeOpen);
		var dialog = filepicker.show();
		if (dialog == Components.interfaces.nsIFilePicker.returnOK) {
			var file = filepicker.file;
			this.prefSvc.setComplexValue(this.PREFname_audioPath, Components.interfaces.nsILocalFile, file);
			document.getElementById(this.textboxId_audioFileName).value = file.path;
			var pleaseRestart = this.strBundle.GetStringFromName("TbAreGo.option.pleaseRestart");
			window.alert(pleaseRestart);
		}
	},

};
window.addEventListener("load", TbAreGoOptions, false);
