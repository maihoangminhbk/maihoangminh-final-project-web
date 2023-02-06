export class Unauthorized401Error extends Error {
  constructor(message) {
    super(message)
    this.name = 'Unauthorized401Error'
  }

  // More custom code here if you want.
}