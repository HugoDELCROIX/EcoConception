const reviewContainer = document.getElementById("review-container")
const exportBtn = document.getElementById("export-btn")
const exportLayout = document.getElementById("export-layout")

;(function () {
  let selectedPracticies = JSON.parse(
    sessionStorage.getItem("selectedPracticies")
  )

  let groupedPracticies = getGroupedPracticies(selectedPracticies)

  populateReviewContainer(groupedPracticies)

  exportBtn.addEventListener("click", () => {
    exportFile(groupedPracticies)
  })
})()

function getGroupedPracticies(selectedPracticies) {
  return selectedPracticies.reduce((group, practice) => {
    const { lifecycle } = practice
    group[lifecycle] = group[lifecycle] ?? []
    group[lifecycle].push(practice)
    return group
  }, {})
}

function populateReviewContainer(groupedPracticies) {
  reviewContainer.innerHTML = ""

  for (let [key, value] of Object.entries(groupedPracticies)) {
    reviewContainer.appendChild(makeReviewCount(key, value.length))
  }
}

function makeReviewCount(lifecycleName, nbPracticies) {
  const lifecycleNb = document.createElement("p")
  lifecycleNb.innerHTML = `${lifecycleName}: ${nbPracticies} critères`

  return lifecycleNb
}

function exportFile(groupedPracticies) {
  let file = document.createElement("html")
  let fragment = exportLayout.content.cloneNode(true)
  let tbody = fragment.querySelector("tbody")

  for (let [key, value] of Object.entries(groupedPracticies)) {
    value.forEach((practice) => {
      let { keystep, criteria, indicator } = practice

      let tr = document.createElement("tr")
      tr.innerHTML = `
      <td>${key}</td>
      <td>${criteria}</td>
      <td>${keystep}</td>
      <td>${indicator}</td>
    `

      tbody.appendChild(tr)
    })
  }

  file.appendChild(fragment)

  var filename = "rapport.html"

  var downloaderLink = document.createElement("a")
  downloaderLink.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(file.innerHTML)
  )
  downloaderLink.setAttribute("download", filename)
  downloaderLink.style.display = "none"
  document.body.appendChild(downloaderLink)
  downloaderLink.click()
  document.body.removeChild(downloaderLink)
}
