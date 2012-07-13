ZIP     = zip
OPTION  = -6
# IGNORE  = -x .DS_Store
PACKAGE = TbAreGo.xpi
FILE    = \
  ./chrome/content/options.js \
  ./chrome/content/options.xul \
  ./chrome/content/windowOverlay.js \
  ./chrome/content/windowOverlay.xul \
  ./chrome/locale/en-US/TbAreGo.dtd \
  ./chrome/locale/en-US/TbAreGo.properties \
  ./chrome/locale/ja/TbAreGo.dtd \
  ./chrome/locale/ja/TbAreGo.properties \
  ./modules/TbAreGoService.jsm \
  ./defaults/preferences/TbAreGo.js \
  chrome.manifest \
  install.rdf


all:  $(PACKAGE)

$(PACKAGE):  $(FILES)
	$(ZIP) $(OPTION) $(PACKAGE) $(FILE)
