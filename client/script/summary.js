const summaryContainer = document.getElementById("summary-container")

;(function () {
  let selectedPracticies = JSON.parse(
    sessionStorage.getItem("selectedPracticies")
  )

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

  let groupHeader = document.createElement("div")
  groupHeader.classList.add("group-header")
  groupCard.appendChild(groupHeader)

  let lifecycleName = document.createElement("p")
  lifecycleName.innerHTML = lifecycle
  groupHeader.appendChild(lifecycleName)

  let groupBody = document.createElement("div")
  groupBody.classList.add("group-body")
  groupCard.append(groupBody)

  let table = document.createElement("table")
  groupBody.appendChild(table)

  let thead = document.createElement("thead")
  table.appendChild(thead)

  let tr = document.createElement("tr")
  thead.appendChild(tr)

  let th = document.createElement("th")
  th.innerHTML = "Critère"

  let th2 = document.createElement("th")
  th2.innerHTML = "Etapes clés"

  let th3 = document.createElement("th")
  th3.innerHTML = "Indicateur"

  tr.appendChild(th)
  tr.appendChild(th2)
  tr.appendChild(th3)

  let tbody = document.createElement("tbody")
  table.appendChild(tbody)

  practices.forEach((practice) => {
    let { criteria, keystep, indicator } = practice

    let practiceTr = document.createElement("tr")

    let criteriaTd = document.createElement("td")
    criteriaTd.innerHTML = criteria
    practiceTr.appendChild(criteriaTd)

    let keyStepTd = document.createElement("td")
    keyStepTd.innerHTML = keystep
    practiceTr.appendChild(keyStepTd)

    let indicatorTd = document.createElement("td")
    indicatorTd.innerHTML = indicator
    practiceTr.appendChild(indicatorTd)

    table.appendChild(practiceTr)
  })

  groupCard.appendChild(table)
  return groupCard
}
