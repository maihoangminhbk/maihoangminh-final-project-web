export class Conflict409Error extends Error {
  constructor(message) {
    super(message)
    this.name = 'Conflict409Error'
  }
}