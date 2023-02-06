export class NotFound404Error extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFound404Error'
  }

  // More custom code here if you want.
}