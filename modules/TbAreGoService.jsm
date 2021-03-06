let EXPORTED_SYMBOLS = ["TbAreGoService"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

const kPREF_BRANCH         = "extensions.TbAreGo.";
const kPREFNAME_AUDIO_PATH = "audioFilePath";
const kSTRING_BUNDLE       = "chrome://TbAreGo/locale/TbAreGo.properties";

let TbAreGoService = {

	get PREFNAME_AUDIO_PATH () {
		return kPREFNAME_AUDIO_PATH;
	},

	get prefs () {
		delete this.prefs;
		return this.prefs = Services.prefs.getBranch(kPREF_BRANCH);
	},

	get strings () {
		delete this.strings
		return this.strings = Services.strings
		                      .createBundle(kSTRING_BUNDLE);
	},

	alert: function (aStringName) {
		let text = this.strings.GetStringFromName(aStringName);
		Services.prompt.alert(null, null, text);
	},

	get audioFileURL () {
		let path = this.prefs.getComplexValue("audioFilePath",
		                                      Ci.nsISupportsString);

		let file = Cc["@mozilla.org/file/local;1"]
		           .createInstance(Ci.nsILocalFile);
		file.initWithPath(path);

		let uri = Services.io.newFileURI(file);
		let fileURL = uri.spec;

		return fileURL;
	},

	selectFile: function (aWindow) {
		let file = null;

		let filepicker = Cc["@mozilla.org/filepicker;1"]
		                 .createInstance(Ci.nsIFilePicker);
		filepicker.appendFilter("Audio File", "*.ogg;");

		let title = this.strings.GetStringFromName("TbAreGo.option.selectAudio.title");
		filepicker.init(aWindow, title, Ci.nsIFilePicker.modeOpen);

		let dialog = filepicker.show();
		if (dialog == Ci.nsIFilePicker.returnOK) {
			file = filepicker.file;
		}

		return file;
	},

};
