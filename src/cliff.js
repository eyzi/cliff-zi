"use strict"

import { EventEmitter } from 'events'
import Process from './process.js'

class Cliff extends EventEmitter {

	#bin
	#processes

	constructor(options) {
		super()

		this.#processes = new Map()

		/**
		 * OPTIONS
		 * bin			executable
		 */
		this.#bin = options.bin
		this.dev = options.dev
	}

	process(id) {
		return this.#processes.get(id)
	}

	command(...args) {
		let process = new Process(this.#bin, args)
		if (!process) return null

		this.log(0, `Starting process ID=${ process.id }`)

		process.on('process-data', data => {
			this.emit('process-data', {
				id: process.id,
				data: data
			})
		})
		process.on('process-line', line => {
			this.emit('process-line', {
				id: process.id,
				data: line
			})
		})
		process.on('process-error', data => {
			this.emit('process-error', {
				id: process.id,
				data: data
			})
		})
		process.on('process-close', code => {
			this.log(0, `Closing process ID=${ process.id }`)
			this.#processes.delete(process.id)
			this.emit('process-close', {
				id: process.id,
				data: code
			})
		})

		this.#processes.set(process.id, process)
		return process
	}

	log(level, ...data) {
		if (this.dev) console.log(...data)
	}
}

export default Cliff