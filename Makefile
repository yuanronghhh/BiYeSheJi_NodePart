TEST_FILE = $(shell find test -type f -name "*.test.js")
MOCHA_REPORTER = spec
TEST_TIME_OUT = 5000
test:
	@./node_modules/mocha/bin/mocha  \
		-r should \
		--timeout $(TEST_TIME_OUT) \
		--reporter $(MOCHA_REPORTER) \
		$(TEST_FILE)
debug-exp:
	@node --inspect --debug app.js
debug:
	@start cmd /k node --debug app.js localhost:5858
	@sleep 2
	@node debug localhost:5858
ins:
	@npm install $(p) --save
db:
	@start cmd /k redis-server
	@start cmd /k mongod \
		--dbpath=g:\mongodb\data
run:
	@node app.js

.PHONY: test debug db run in
