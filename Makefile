TESTS = test/*.js

browser:
	node_modules/pakmanager/bin/pakmanager.js deps
	node_modules/pakmanager/bin/pakmanager.js build
	mv pakmanaged.js pakmanaged.html browser

test:
	@./node_modules/.bin/vows \
		$(TESTS)

# Since the target is named `test` and there is a directory named `test`, PHONY
# is needed to keep make from saying: "make: `test' is up to date"
.PHONY: test browser

