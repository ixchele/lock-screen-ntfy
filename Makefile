UUID = $(shell grep '"uuid"' metadata.json | cut -d '"' -f 4)
EXT_DIR = $(HOME)/.local/share/gnome-shell/extensions/$(UUID)
FILES = extension.js metadata.json stylesheet.css ft-log countdown.sh

all: install enable

install:
	@read -p "Enter ntfy.sh channel name: " channel; \
	if [ -z "$$channel" ]; then \
		echo "Error: Channel name cannot be empty."; \
		exit 1; \
	fi; \
	mkdir -p $(EXT_DIR); \
	cp $(FILES) $(EXT_DIR)/; \
	sed -i "s/TOPIC=.*/TOPIC=\"$$channel\"/" $(EXT_DIR)/ft-log; \
	chmod +x $(EXT_DIR)/ft-log $(EXT_DIR)/countdown.sh
	@echo "Installation successful."

enable:
	gnome-extensions enable $(UUID)

disable:
	gnome-extensions disable $(UUID)

uninstall: disable
	rm -rf $(EXT_DIR)

re: uninstall all

.PHONY: all install enable disable uninstall re
