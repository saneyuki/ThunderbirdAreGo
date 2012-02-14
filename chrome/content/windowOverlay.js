Components.utils.import("resource://gre/modules/Services.jsm");
let TbAreGo = {

	_audioElm: null,
	get audioElm () {
		if (!this._audioElm) {
			let audio = new Audio();
			audio.type = "audio/ogg";
			this._audioElm = audio;
		}
		return this._audioElm;
	},

	prefBranch: "extensions.TbAreGo.",

	_prefSvc: null,
	get prefSvc() {
		if (!this._prefSvc) {
			this._prefSvc = Services.prefs
			                .getBranch(this.prefBranch)
			                .QueryInterface(Components.interfaces.nsIPrefBranch2);
		}
		return this._prefSvc;
	},

	_strBundle: null,
	get strBundle() {
		if (!this._strBundle) {
			this._strBundle = Services.strings
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

	onLoad: function () {
		window.removeEventListener("load", this, false);
		window.addEventListener("unload", this, false);

		this.initAudio();
		this.audioElm.play();

		let isLoop = this.prefSvc.getBoolPref("loopPlay");
		if (isLoop) {
			this.audioElm.addEventListener("ended", this, false);
		}
	},

	onUnLoad: function() {
		window.removeEventListener("unload", this, false);

		this.audioElm.pause();

		let isLoop = this.prefSvc.getBoolPref("loopPlay");
		if (isLoop) {
			this.audioElm.removeEventListener("ended", this, false);
		}
	},

	initAudio: function () {
		try {
			let path = this.prefSvc.getComplexValue("audioFilePath", Components.interfaces.nsISupportsString);

			let file = Components.classes['@mozilla.org/file/local;1']
			           .createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(path);
			let uri = Services.io.newFileURI(file);
			let fileURL = uri.spec;
			this.audioElm.src = fileURL;
		}
		catch (e) {
			let pleseSet = this.strBundle.GetStringFromName("TbAreGo.overlay.alert.setAudioFile");
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
