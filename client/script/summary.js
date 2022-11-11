const summaryContainer = document.getElementById("summary-container")

;(function () {
  let selectedPracticies = JSON.parse(
    sessionStorage.getItem("selectedPracticies")
  )

  console.log(selectedPracticies)

  const groupByLifecycle = selectedPracticies.reduce((group, practice) => {
    const { lifecycle } = practice
    group[lifecycle] = group[lifecycle] ?? []
    group[lifecycle].push(practice)
    return group
  }, {})
})()

function makeLifecycleSummary(groupedPracticies) {}
