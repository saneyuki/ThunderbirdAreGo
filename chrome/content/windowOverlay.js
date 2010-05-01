var TbAreGo = {

	// The Audio Element's Id.
	AUDIO_ID: "TbAreGo-audio",

	_audioElm: null,
	get audioElm () {
		if (!this._audioElm) {
			this._audioElm = document.getElementById(this.AUDIO_ID);
		}
		return this._audioElm;
	},

	prefBranch: "extensions.TbAreGo.",

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
			case "unload":
				this.onUnLoad();
				break;
			case "ended":
				this.resetPlayTime();
				break;
		}
	},

	observe: function (aSubject, aTopic, aData) {
		switch (aTopic) {
			case "nsPref:changed":
				this.prefObserve(aSubject, aData);
				break;
		}
	},

	prefObserve: function (aSubject, aData) {
		switch (aData) {
			case "loopPlay":
				var pleseSet = this.strBundle.GetStringFromName("TbAreGo.option.loop.pleaseReopenWindow");
				window.alert(pleseSet);
				break;
		}
	},

	onLoad: function () {
		window.removeEventListener("load", this, false);
		window.addEventListener("unload", this, false);

		this.initAudio();
		this.audioElm.play();

		var isLoop = this.prefSvc.getBoolPref("loopPlay");
		if (isLoop) {
			this.audioElm.addEventListener("ended", this, false);
		}

		this.prefSvc.addObserver("", this, false);
	},

	onUnLoad: function() {
		window.removeEventListener("unload", this, false);

		this.audioElm.pause();

		var isLoop = this.prefSvc.getBoolPref("loopPlay");
		if (isLoop) {
			this.audioElm.removeEventListener("ended", this, false);
		}

		this.prefSvc.removeObserver("", this);
	},

	initAudio: function () {
		try {
			var path = this.prefSvc.getComplexValue("audioFilePath", Components.interfaces.nsISupportsString);

			var file = Components.classes['@mozilla.org/file/local;1']
			           .createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(path);
			var ioService = Components.classes['@mozilla.org/network/io-service;1']
			                .getService(Components.interfaces.nsIIOService);
			var uri = ioService.newFileURI(file);
			var fileURL = uri.spec;
			this.audioElm.src = fileURL;
		}
		catch (e) {
			var pleseSet = this.strBundle.GetStringFromName("TbAreGo.overlay.alert.setAudioFile");
			window.alert(pleseSet);
			return;
		}
	},

	resetPlayTime: function () {
		this.audioElm.currentTime = 0;
		this.audioElm.play();
	},
};
window.addEventListener("load", TbAreGo, false);
