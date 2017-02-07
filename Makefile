MAIN = app.js
TEST_FILE = $(shell find test -type f -name "*.test.js")
MOCHA_REPORTER = spec
TEST_TIME_OUT = 5000
TEST_DIR = "./test/"
TDF = "./controllers/sign.test.js"
DEBUG_LISTEN = "localhost:5858"
test:
	@./node_modules/mocha/bin/mocha  \
		-r should \
		--timeout $(TEST_TIME_OUT) \
		--reporter $(MOCHA_REPORTER) \
		$(TEST_FILE)
debug-exp:
	@node --inspect --debug $(MAIN)
debug:
	@node --debug $(MAIN) $(DEBUG_LISTEN)
	# @node debug $(MAIN)
debug-test:
	@mocha debug $(TEST_DIR)$(TDF)
	# @node debug $(MAIN) $(DEBUG_LISTEN)
ins:
	@npm install $(p) --save
#just for windows
db:
	@start cmd /k redis-server
	@start cmd /k mongod \
		--dbpath=g:\mongodb\data
run:
	@node $(MAIN)
page-sync:
	@git submodule sync

.PHONY: test debug db run in page-sync
