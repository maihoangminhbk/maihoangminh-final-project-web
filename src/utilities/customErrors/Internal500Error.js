export class Internal500Error extends Error {
  constructor(message) {
    super(message)
    this.name = 'Internal500Error'
  }

  // More custom code here if you want.
}