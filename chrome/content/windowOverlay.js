var TbAreGo = {

	// The Audio Element's Id.
	AUDIO_ID: "TbAreGo-audio",

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
		}
	},

	onLoad: function () {
		window.removeEventListener("load", this, false);
		window.addEventListener("unload", this, false);

		this.playAudio(this.AUDIO_ID);
	},

	onUnLoad: function() {
		window.removeEventListener("unload", this, false);

		this.stopAudio(this.AUDIO_ID);
	},

	playAudio: function (aId) {
		var audio = document.getElementById(aId);

		try {
			var path = this.prefSvc.getComplexValue("audioFilePath", Components.interfaces.nsISupportsString);

			var file = Components.classes['@mozilla.org/file/local;1']
			           .createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(path);
			var ioService = Components.classes['@mozilla.org/network/io-service;1']
			                .getService(Components.interfaces.nsIIOService);
			var uri = ioService.newFileURI(file);
			var fileURL = uri.spec;
		}
		catch (e) {
			var pleseSet = this.strBundle.GetStringFromName("TbAreGo.overlay.alert.setAudioFile");
			window.alert(pleseSet);
			return;
		}

		audio.src = fileURL;
		audio.play();
	},

	stopAudio : function (aId) {
		var audio = document.getElementById(aId);
		audio.pause();
	},
};
window.addEventListener("load", TbAreGo, false);
