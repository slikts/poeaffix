'use strict'

let fs = require('fs')

let cheerio = require('cheerio')

function log(x) {
  console.log.apply(console, arguments)
  return x
}

function toText(html) {
  return [
    ['&#x2013;', '-'],
    ['&apos;', '\''],
    ['&amp;', '&'],
    [/&(#xA0|nbsp);/g, ' '],
    [/<br>/g, '\n'],
    [/<small>N\/A<\/small>|&#x\w+?;|^\-$|<.+?>/g, ''],
  ].reduce((x, [k, l]) => x.replace(k, l), html)
}

function parseRowStructure(table) {
  return [...cheerio(table).find('tr')].map(row =>
    [...cheerio(row).find('td, th')].map(cell =>
      toText(cheerio(cell).html().trim()))
  )
}

function parseStructure(html) {
  let selectors = ['h2 > span', 'h3 > span', 'h4 > span', 'p > b:only-child', 'table.wikitable']
  let $items = cheerio.load(html)(selectors.join(','))
  let path = []
  let pathOrder = selectors.map(x => x.split(' ')[0]).slice(0, -1)
  let tables = []

  $items.each((i, item) => {
    let pathIdx = pathOrder.indexOf(item.parent.name)
    if (~pathIdx) {
      path[pathIdx] = cheerio(item).html()
    }
    if (item.parent.name === 'h3') {
      path.splice(2)
    }
    if (item.name === 'table') {
      tables.push({
        path: path.slice(),
        rows: parseRowStructure(item),
      })
      path.splice(3)
    }
  })

  return tables
}

function parse(filename) {
  log('parsing', filename)

  let tables = parseStructure(fs.readFileSync(filename))
    // .filter(table => /^Stat/.test(table.rows[0][2]))
    // .filter(table => table.rows[0].filter(x => /Minimum/.test(x)).length)
    .map(table => {
      table.rows = [
        transposeStat,
        fixCompound,
        parseNums,
        combineRanges,
      ].reduce((a, b) => b(a), table.rows)

      return table
    })

  save(tables, `${filename.split('.')[0]}.json`)
}

function compare(a, b) {
  let zz = b.split('-').map(x => +x)
  if (zz.length === 2) {
    return a >= zz[0] && a <= zz[1]
  }
  return a === zz[0]
}

function lookup(item, tables) {
  let mods = []
  item.explicitMods.forEach(x => {
    if (['Weapons', 'Armours'].includes(item.type[0])) {
      let catType = {
        'TwoHandWeapons': 'Local Bow and Two Handed Weapon Damage',
        'OneHandWeapons': 'Local One Handed Weapon Damage',
      }
      let q = x.match(/Adds (\d+)(?:-(\d+))? (\w+ Damage)/)
      if (q) {
        let [, min, max, type] = q
        mods = mods.concat([[min, 'Minimum'], [max, 'Maximum']]
          .map(([x, t]) => [`Local ${t} ${type}`, +x, catType[item.type[1]]]))
      }

      q = x.match(/(\d+)% increased Critical Strike Chance/)
      if (q) {
        mods.push(['Local Critical Strike Chance +%', +q[1]])
      }
    }
  })

  mods.forEach(([name, value, cat]) => {
    tables.forEach(x => {
      if (cat && !x.path.includes(cat)) {
        return
      }
      let i = x.rows[0].indexOf(name)
      if (~i) {
        x.rows.slice(1).forEach(row => {
          let p = compare(value, row[i])
          if (p) {
            log(i, name, value, row[i], row[0])
            //log(row[0])
          }
        })
      }
    })
  })
}

function save(data, filename) {
  fs.writeFile(filename, JSON.stringify(data, null, 2), err => {
    if (err) {
      throw err
    }
    log(`${filename} saved`)
  })
}

function fixCompound(rows) {
  let q = rows[0].map((x, i) => x.includes('\n') ? i : null).filter(x => x !== null)
  if (!q.length) {
    return rows
  }
  return rows.map(x => x.reduce((a, b, i) => a.concat(q.includes(i) ? b.split('\n').concat(['']).slice(0, 2) : b), []))
}

function parseNums(rows) {
  return rows.map((row, i) => row.map((val, j) => {
    if (!i || !j || !val) {
      return val
    }
    if (j === 1) {
      return +val
    }
    return val.replace('%', '').split('-').map(x => +x.replace(',', '.'))
  }))
}

function combineRanges(rows) {
  if (!rows[0].filter(x => /Minimum/.test(x)).length) {
    return rows
  }
  return rows.map((row, i) => {
    if (!i) {
      row[2] = row[2].replace('Minimum ', '')
    } else if (row[3]) {
      row[2] = [row[2], row[3]]
    }
    return row.slice(0, 3)
  })
}

function transposeStat(rows) {
  if (!/^Stat/.test(rows[0][2])) {
    return rows
  }
  let t = rows.slice(1).map(x => x.slice(2))
  return [t.map(x => x[0])]
    .concat(t.map((x, i) => t.map((y, j) => i === j ? y[1] : '')))
    .map((x, i) => rows[i].slice(0, 2).concat(x))
}

parse('data/itemaffix.html')
