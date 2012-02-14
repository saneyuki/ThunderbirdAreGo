Components.utils.import("resource://gre/modules/Services.jsm");
let TbAreGoOptions = {

	textboxId_audioFileName: "TbAreGo-audioFileName",

	prefBranch: "extensions.TbAreGo.",

	PREFname_audioPath: "audioFilePath",

	get prefSvc() {
		delete this.prefSvc;
		return this.prefSvc = Services.prefs.getBranch(this.prefBranch)
							  .QueryInterface(Components.interfaces.nsIPrefBranch2);
	},

	get strBundle() {
		delete this.strBundle
		return this.strBundle = Services.strings
								.createBundle("chrome://TbAreGo/locale/TbAreGo.properties");
	},

	observe: function (aSubject, aTopic, aData) {
		switch (aTopic) {
			case "nsPref:changed":
				this.prefObserve(aSubject, aData);
				break;
		}
	},

	_prefChanged: false,

	prefObserve: function (aSubject, aData) {
		this._prefChanged = true;
	},

	handleEvent: function (aEvent) {
		switch (aEvent.type) {
			case "load":
				this.onLoad();
				break;
			case "unload":
				this.onUnLoad();
				break;
		}
	},

	onLoad: function () {
		window.removeEventListener("load", this, false);
		window.addEventListener("unload", this, false);

		let path = this.prefSvc.getComplexValue(this.PREFname_audioPath,
		                                        Components.interfaces.nsISupportsString);
		document.getElementById(this.textboxId_audioFileName).value = path;

		this.prefSvc.addObserver("", this, false);
	},

	onUnLoad: function() {
		window.removeEventListener("unload", this, false);
		this.prefSvc.removeObserver("", this);

		if (this._prefChanged) {
			let pleaseRestart = this.strBundle.GetStringFromName("TbAreGo.option.pleaseRestart");
			window.alert(pleaseRestart);
		}
	},

	selectFile: function () {
		let filepicker = Components.classes['@mozilla.org/filepicker;1']
		                 .createInstance(Components.interfaces.nsIFilePicker);
		filepicker.appendFilter("Audio File", "*.ogg;");
		
		let title = this.strBundle.GetStringFromName("TbAreGo.option.selectAudio.title");
		filepicker.init(window,
		                title,
		                Components.interfaces.nsIFilePicker.modeOpen);
		let dialog = filepicker.show();
		if (dialog == Components.interfaces.nsIFilePicker.returnOK) {
			let file = filepicker.file;
			this.prefSvc.setComplexValue(this.PREFname_audioPath, Components.interfaces.nsILocalFile, file);
			document.getElementById(this.textboxId_audioFileName).value = file.path;
		}
	},

};
window.addEventListener("load", TbAreGoOptions, false);
