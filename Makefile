
ESLINT         = ./node_modules/.bin/eslint
ESLINT_FLAGS   = --config eslint/eslint.json





install:
	sudo cp git-events /etc/bash_completion.d/git-events
	npm link && npm install --global

eslint: FORCE
	$(ESLINT) $(ESLINT_FLAGS) ./src

FORCE:
