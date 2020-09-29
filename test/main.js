import Cliff from '../src/cliff.js'

// Initialize Cliff object
let cliff_object = new Cliff({
	dev: true,
	bin: 'git'
})

// Run a command that returns a process
let cliff_process = cliff_object.command('--version')

// Get each line output by:
// 1) Listening to the Cliff object and filter by process id
cliff_object.on('process-line', cliff_data => {
	let { id, data } = cliff_data
	if (id === cliff_process.id) {
		console.log(data)
	}
})

// OR 2) Listening to the Cliff process
cliff_process.on('process-line', line => {
	console.log(line)
})