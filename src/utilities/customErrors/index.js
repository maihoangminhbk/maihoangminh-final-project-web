import { BadRequest400Error } from './badRequest400Error'
import { NotFound404Error } from './notFound404Error'
import { Conflict409Error } from './conflict409Error'
import { Unauthorized401Error } from './unauthorized401Error'
import { Internal500Error } from './Internal500Error'

export const customErrors = {
  BadRequest400Error,
  NotFound404Error,
  Conflict409Error,
  Unauthorized401Error,
  Internal500Error
}