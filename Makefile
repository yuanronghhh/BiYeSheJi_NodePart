TEST_FILE = $(shell find test -type f -name "*.test.js")
MOCHA_REPORTER = spec
TEST_TIME_OUT = 5000
test:
	@./node_modules/mocha/bin/mocha  \
		-r should \
		--timeout $(TEST_TIME_OUT) \
		--reporter $(MOCHA_REPORTER) \
		$(TEST_FILE)
debug:
	@node --debug --inspect app.js
database:
	@start cmd /k redis-server
	@start cmd /k mongod \
		--dbpath=g:\mongodb\data
run:
	@node app.js
.PHONY: test debug database run
