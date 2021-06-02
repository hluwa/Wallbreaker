all: command

command: agent/src/classkit.ts agent/src/index.ts agent/src/objectkit.ts agent/src/struct.ts agent/src/utils.ts

	cd agent/; npm run build
	cp agent/_agent.js wallbreaker/agent/command/agent.js