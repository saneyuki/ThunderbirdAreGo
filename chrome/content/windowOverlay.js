Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://TbAreGo/TbAreGoService.jsm");
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

		this.initAudio();
	},

	onUnLoad: function() {
		window.removeEventListener("unload", this, false);

		this.audioElm.pause();
	},

	initAudio: function () {
		try {
			this.audioElm.src = TbAreGoService.audioFileURL;

			let isLoop = TbAreGoService.prefs.getBoolPref("loopPlay");
			this.audioElm.loop = isLoop;

			this.audioElm.play();
		}
		catch (e) {
			TbAreGoService.alert("TbAreGo.overlay.alert.setAudioFile");
		}
	},
};
window.addEventListener("load", TbAreGo, false);
