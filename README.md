# CliFF-zi
Command Line Interface Flexible Formatter by Eyzi

### Installation
`npm install --save cliff-zi`

## Usage
```
import Cliff from 'cliff-zi'

// Initialize Cliff object
let cliff_object = new Cliff({
	bin: 'git' // path or command as string
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
```


## Cliff Options

### bin
Command or path as string

### dev
If `true`, logging start and end of process to console


## Cliff Events

### process-line
Preferred way of reading data
- id `{String}`, Id of process
- data `{Buffer}`, Parsed line output from `process-data`

### process-data
- id `{String}`, Id of process
- data `{Buffer}`, Raw data returned by process

### process-error
- id `{String}`, Id of process
- data `{Buffer}`, Raw error data returned by process

### process-close
- id `{String}`, Id of process
- data `{Buffer}`, Exit code of process


## Cliff Process Events

### process-line
Preferred way of reading data
- line `{Buffer}`, Parsed line output from `process-data`

### process-data
- data `{Buffer}`, Raw data returned by process

### process-error
- data `{Buffer}`, Raw error data returned by process

### process-close
- code `{Buffer}`, Exit code of process
