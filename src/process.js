"use strict"

import { EventEmitter } from 'events'
import { spawn } from 'child_process'
import { v4 as uuidv4 } from 'uuid'

class Process extends EventEmitter {

	#id
	#process
	#dataChunk
	#dataLines

	constructor(bin, args) {
		super()

		this.#id = uuidv4()
		this.#process = spawn(bin, args)
		this.#dataChunk = ''
		this.#dataLines = []

		this.#process.stdout.on('data', data => {
			this.emit('process-data', data)
			this.#dataChunk += data.toString()
			this.readlines()
		})
		this.#process.stderr.on('data', data => {
			this.emit('process-error', data)
		})
		this.#process.on('close', code => {
			this.flush()
			this.emit('process-close', code)
		})
	}

	get id() {
		return this.#id
	}

	readlines() {
		if (this.#dataLines.length > 0) {
			let lastLine = this.#dataLines.pop()
			this.#dataChunk = lastLine + this.#dataChunk
		}
		
		this.#dataChunk.split('\r?\n').forEach(chunk => {
			this.#dataLines.push(chunk)
		})

		while (this.#dataLines.length > 1) {
			let line = this.#dataLines.shift()
			this.emit('process-line', line)
		}
	}

	flush() {
		this.#dataLines.forEach(line => {
			this.emit('process-line', line)
		})
	}

	write(command) {
		this.#process.stdin.write(`${ command }\r\n`)
	}

	kill(code) {
		this.#process.kill(code)
	}
}

export default Process