'use strict'

import { log } from './util'

export default function lookup(item, tables, _type) {
  let map = [
    [/(\d+)% increased Global Critical Strike Chance/, 'Global Critical Strike Chance +%'],
    [/\+(\d+) Life gained for each Enemy hit by your Attacks/, 'Life Gain Per Target'],
    [/\+(\d+) to maximum Life/, 'Base Maximum Life'],
    [/\+(\d+) to maximum Energy Shield/, 'Base Maximum Energy Shield'],
    [/\+(\d+) to maximum Energy Shield/, 'Local Energy Shield'],
    // [//, ''],
  ]

  let mods = []
  item.explicitMods.forEach(x => {
    // if (['Weapons'].includes(_type[0])) {
    map.forEach(([patt, key]) => {
      let q = x.match(patt)
      if (q) {
        mods.push([key, +q[1]])
      }
    })

      let catType = {
        'TwoHandWeapons': 'Local Bow and Two Handed Weapon Damage',
        'OneHandWeapons': 'Local One Handed Weapon Damage',
      }
      let q = x.match(/Adds (\d+)(?:-(\d+))? (\w+ Damage)/)
      if (q) {
        let [, min, max, type] = q
        mods.push([`Local ${type}`, [min, max].map(x => +x), catType[_type[1]]])
      }

      q = x.match(/(\d+)% increased Critical Strike Chance/)
      if (q) {
        mods.push(['Local Critical Strike Chance +%', +q[1]])
      }
    // }

    // if (['Armours'].includes(_type[0])) {
      // let q
      q = x.match(/\+(\d+) to (Strength|Dexterity|Intelligence|All Attributes)/)
      if (q) {
        let [, n, t] = q
        // log(n, t)
        mods.push([`Additional ${t}`, +n])
      }
      q = x.match(/(\d+)% increased Armour/)
      if (q) {
        let [, n] = q
        mods.push([`Local Armour`, +n])
      }
      //7% increased Stun Recovery
      q = x.match(/(\d+)% increased Stun Recovery/)
      if (q) {
        let [, n] = q
        mods.push([`Base Stun Recovery`, +n])
      }
    // }
  })

  let matches = []
  mods.forEach(([name, value, cat]) => {
    tables.forEach((x, zi) => {
      if (cat && !x.path.includes(cat)) {
        return
      }

      let i = x.rows[0].indexOf(name)
      if (~i) {
        x.rows.slice(1).forEach((row, j) => {
          let p = compare(value, row[i])
          if (p) {
            matches.push([[zi, j], row[0], _fmt(row[i]), _fmt(value), row.slice(2).filter(x => x).length])
          }
        })
      }
    })
  })

  return matches
}

let _fmt = x => Array.isArray(x[0]) ? x.map(_fmt).join(' ') : x.join ? x.join('-') : x

function compare(a, b) {
  if (a.length > 1) {
    return a.map((x, i) => compare(x, b[i])).filter(x => x).length === a.length
  }
  if (b.length === 1) {
    return a === b[0]
  }
  return a >= b[0] && a <= b[1]
}
