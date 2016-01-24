'use strict'

export function log(x) {
  console.log.apply(console, arguments)
  return x
}
