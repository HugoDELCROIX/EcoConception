const summaryContainer = document.getElementById("summary-container")

import { initializeCart, getCartStorage } from "./modules.js"
;(async function () {
  if (getCartStorage() === null) await initializeCart()
  let selectedPracticies = getCartStorage()

  populateContainer(selectedPracticies)
})()

function populateContainer(selectedPracticies) {
  summaryContainer.innerHTML = ""
  const groupByLifecycle = selectedPracticies.reduce((group, practice) => {
    const { lifecycle } = practice
    group[lifecycle] = group[lifecycle] ?? []
    group[lifecycle].push(practice)
    return group
  }, {})

  for (let [key, value] of Object.entries(groupByLifecycle)) {
    summaryContainer.appendChild(makeGroupedPractice(key, value))
  }
}

function makeGroupedPractice(lifecycle, practices) {
  let groupCard = document.createElement("div")

  groupCard.innerHTML = `
    <div class="group-header">
      <p>${lifecycle}</p>
    </div>
    <div class="group-body">
      <table>
        <thead>
          <tr>
            <th>Critère</th>
            <th>Etapes clés</th>
            <th>Indicateur</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
  `

  const tbody = groupCard.getElementsByTagName("tbody")[0]

  practices.forEach((practice) => {
    let { criteria, keystep, indicator } = practice

    let practiceTr = document.createElement("tr")

    practiceTr.innerHTML = `
      <td>${criteria}</td>
      <td>${keystep}</td>
      <td>${indicator}</td>
    `

    tbody.appendChild(practiceTr)
  })

  return groupCard
}
