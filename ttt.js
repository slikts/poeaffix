'use strict'

const cE = document.createElement.bind(document)

function show(tables) {
  let b = document.body
  tables.forEach((t, ti) => {
    let c = cE('div')

    let h = cE('h2')
    h.innerHTML = `${ti}. ${t.path.join(' &rarr; ')}`
    c.appendChild(h)

    let tt = cE('table')
    t.rows.forEach((row, i) => {
      let tr = cE('tr')
      let ic = cE('th')
      ic.innerHTML = !i ? '' : i - 1
      tr.appendChild(ic)
      row.forEach(val => {
        let c = cE(i ? 'td' : 'th')
        c.innerHTML = typeof val === 'string' ? val.replace('\n', '<hr>') : JSON.stringify(val)
        tr.appendChild(c)
      })
      tt.appendChild(tr)
    })
    c.appendChild(tt)

    b.appendChild(c)
  })
}

fetch('data/itemaffix.json')
  .then(response => response.json())
  .then(show)
