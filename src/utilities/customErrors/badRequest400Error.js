export class BadRequest400Error extends Error {
  constructor(message) {
    super(message)
    this.name = 'BadRequestError'
  }

  // More custom code here if you want.
}