const Event = require('events')
const SerialPort = require('serialport')
const { Readline } = SerialPort.parsers
const fs = require('fs-extra')

exports.SerialTraceClient = class {
  constructor(port) {
    if (port || typeof port !== 'string') {
      throw new TypeError('Serial trace client should have valid name, port, io as a option in new statement')
    }

    this.emitter = new Event()
    this.port = port
    this.connected = false

    this.connect()

    this.monitorInterval = setInterval(() => {
      const isUSB = fs.existsSync(this.port)
      if (!isUSB && this.connected) {
        this.emitter.emit('disconnected', this.port)
        this.connected = false
      } else if (isUSB && !this.connected) {
        this.connect()
      }
    }, 1000)
  }

  listen() {
    return this.emitter
  }

  connect() {
    this.serial = new SerialPort(this.port, { baudRate: 921600 },
      (err) => {
        if (err) {
          console.log('Error: ', err.message)
          // this.emitter.emit('ERROR', this.port, err.message)
          return
        }

        this.connected = true
        this.emitter.emit('connected', this.port)

        this.parser = this.serial.pipe(new Readline({ delimiter: '\n' }))
        this.parser.on('data', data => {
          this.emitter.emit('data', data)
        })
      })

    // this.serial = new SerialPort(this.port, { baudRate: 921600, autoOpen: true })
    // this.serial
    //   .on('data', data => {
    //     this.emitter.emit('data', data)
    //   })


    return true
  }

  disconnect() {
    if (this.connected) {
      this.connected = false
      this.serial.close()
      this.emitter.emit('disconnected', this.port)

    }
    return true
  }
}
