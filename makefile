install:
	node scripts/package.json.js
	npm prune
	npm install

init:
	node scripts/tsconfig.json.js
	node scripts/package.json.js

pro: init install
	gulp pro
