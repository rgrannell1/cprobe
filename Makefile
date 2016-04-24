
ESLINT         = ./node_modules/.bin/eslint
ESLINT_FLAGS   = --config config/eslint.json





install:
	sudo cp git-events /etc/bash_completion.d/git-events
	npm link && npm install --global

eslint:
	$(ESLINT) $(ESLINT_FLAGS) ./src
