Components.utils.import("resource://TbAreGo/TbAreGoService.jsm");
let TbAreGoOptions = {

	textboxId_audioFileName: "TbAreGo-audioFileName",

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

		let path = TbAreGoService.prefs.getComplexValue(TbAreGoService.PREFNAME_AUDIO_PATH,
		                                                Components.interfaces.nsISupportsString);
		document.getElementById(this.textboxId_audioFileName).value = path;

		TbAreGoService.prefs.addObserver("", this, false);
	},

	onUnLoad: function() {
		window.removeEventListener("unload", this, false);
		TbAreGoService.prefs.removeObserver("", this);

		if (this._prefChanged) {
			TbAreGoService.alert("TbAreGo.option.pleaseRestart");
		}
	},

	selectFile: function () {
		let filepicker = Components.classes['@mozilla.org/filepicker;1']
		                 .createInstance(Components.interfaces.nsIFilePicker);
		filepicker.appendFilter("Audio File", "*.ogg;");
		
		let title = TbAreGoService.strings
		            .GetStringFromName("TbAreGo.option.selectAudio.title");
		filepicker.init(window,
		                title,
		                Components.interfaces.nsIFilePicker.modeOpen);
		let dialog = filepicker.show();
		if (dialog == Components.interfaces.nsIFilePicker.returnOK) {
			let file = filepicker.file;
			TbAreGoService.prefs.setComplexValue(TbAreGoService.PREFNAME_AUDIO_PATH, 
			                                     Components.interfaces.nsILocalFile,
			                                     file);
			document.getElementById(this.textboxId_audioFileName).value = file.path;
		}
	},

};
window.addEventListener("load", TbAreGoOptions, false);
