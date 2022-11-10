const practiciesContainer = document.getElementById("practicies-container")
const paginationContainer = document.getElementById("pagination-container")

let currentPage = 0
let practiciesPerPage = 20

;(async function () {
  let practicies = await getPracticies()
  makeFamiliesSelector(practicies)
  populateContainer(currentPage, practicies)
  makePagination(practicies)
})()

// Fetch api go retrieve the data from mongodb
async function fetchApi() {
  try {
    let response = await fetch("http://localhost:3000/practicies")
    localStorage.setItem("practicies", JSON.stringify(await response.json()))
    console.log("Making api call")
  } catch (error) {
    console.log("Couldn’t fetch API...")
  }
}

// Put data inside the localStorage and return it
async function getPracticies() {
  try {
    if (localStorage.getItem("practicies") === null) await fetchApi()

    return JSON.parse(localStorage.getItem("practicies"))
  } catch (error) {
    console.log(error)
  }
}

// Populate practice container
async function populateContainer(page, practiciesInput) {
  practiciesContainer.innerHTML = ""
  let practicies = practiciesInput

  let start = page * practiciesPerPage
  let end = start + practiciesPerPage
  console.log(page, practicies)
  let paginatedPracticies = practicies.slice(start, end)

  for (let i = 0; i < paginatedPracticies.length; i++) {
    practiciesContainer.appendChild(
      makePracticeContainer(paginatedPracticies[i])
    )
  }
}

// Create the html element to be displayed
function makePracticeContainer(practiceContent) {
  let box = document.createElement("div")
  box.classList.add("practice-container")

  let categoryName = document.createElement("p")
  categoryName.innerHTML = practiceContent.categories[0]
  box.appendChild(categoryName)

  let separator = document.createElement("hr")
  box.appendChild(separator)

  let criteria = document.createElement("p")
  criteria.innerHTML = practiceContent.criteria
  box.appendChild(criteria)

  let button = document.createElement("button")
  box.appendChild(button)

  return box
}

function makePagination(practicies) {
  paginationContainer.innerHTML = ""

  let nbPage = Math.ceil(practicies.length / practiciesPerPage)

  for (let i = 0; i < nbPage; i++) {
    paginationContainer.appendChild(paginationButton(i, practicies))
  }
}

function paginationButton(page, practicies) {
  let button = document.createElement("button")
  button.innerText = page

  button.addEventListener("click", () => {
    currentPage = page
    populateContainer(currentPage, practicies)
  })

  return button
}

function makeFamiliesSelector(practicies) {
  const familiesSelector = document.getElementById("familiesSelector")
  const families = [
    "Tout",
    "Architecture",
    "Back-end",
    "Contenus",
    "Front-end",
    "Hébergement",
    "Spécifications",
    "Stratégie",
    "Ux/Ui",
  ]

  families.forEach((family, index) => {
    let option = document.createElement("option")
    option.text = family
    option.value = index
    familiesSelector.appendChild(option)
  })

  familiesSelector.addEventListener("change", (event) => {
    let filteredPracticies =
      event.target.value == 0
        ? practicies
        : practicies.filter(
            (practice) => practice.familyName === families[event.target.value]
          )

    console.log(filteredPracticies)

    currentPage = 0
    populateContainer(currentPage, filteredPracticies)
    makePagination(filteredPracticies)
  })
}
