const { Command } = require('commander');

const command = new Command();

command
	.option('-p <port>', 'Puerto del servidor', 8080)
	.option('--mode <mode>', 'Modo de trabajo', 'production')
	.parse();

console.log(command.opts());
console.log(command.args);
