'use strict'

import fs from 'fs'
import lookup from './lookup'
import { log } from './util'

import items from './test/items'

let data = filename => JSON.parse(fs.readFileSync(filename))


// let items = data('test/items.json')
// let items = require('test/items')
let tables = data('data/itemaffix.json')

Object.keys(items).forEach(x => {
  log(x)
  log(items[x].data.explicitMods.map(x => ' * ' + x).join('\n'))
  log(lookup(items[x].data, tables, items[x].type))
})
//log(lookup(items.armour1.data, tables, items.armour1.type))
