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

		let isLoop = TbAreGoService.prefs.getBoolPref("loopPlay");
		if (isLoop) {
			this.audioElm.addEventListener("ended", this, false);
		}
	},

	onUnLoad: function() {
		window.removeEventListener("unload", this, false);

		this.audioElm.pause();

		let isLoop = TbAreGoService.prefs.getBoolPref("loopPlay");
		if (isLoop) {
			this.audioElm.removeEventListener("ended", this, false);
		}
	},

	initAudio: function () {
		try {
			this.audioElm.src = TbAreGoService.audioFileURL;
		}
		catch (e) {
			TbAreGoService.alert("TbAreGo.overlay.alert.setAudioFile");
		}
	},

	resetPlayTime: function () {
		this.audioElm.currentTime = 0;
		this.audioElm.play();
	},
};
window.addEventListener("load", TbAreGo, false);
