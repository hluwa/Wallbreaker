all: command

command: agent/_agent.js

	cp agent/_agent.js wallbreaker/agent/command/agent.js