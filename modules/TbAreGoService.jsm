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
		return this.prefs = Services.prefs.getBranch(kPREF_BRANCH)
		                    .QueryInterface(Components.interfaces.nsIPrefBranch2);
	},

	get strings () {
		delete this.strings
		return this.strings = Services.strings
		                      .createBundle(kSTRING_BUNDLE);
	},


};
