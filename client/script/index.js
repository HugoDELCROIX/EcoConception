const practiciesContainer = document.getElementById("practicies-container")
const paginationContainer = document.getElementById("pagination-container")

let currentPage = 0
let practiciesPerPage = 20

;(async function () {
  const defaultPracticies = await getPracticies()
  let practicies = defaultPracticies
  makeFamiliesSelector(practicies)
  populateContainer(currentPage, practicies)
  makePagination(practicies)

  initializeCart()

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
  async function populateContainer(page) {
    practiciesContainer.innerHTML = ""

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

    let categoryName = document.createElement("h1")
    categoryName.innerHTML = practiceContent.categories[0]
    box.appendChild(categoryName)

    let separator = document.createElement("hr")
    box.appendChild(separator)

    let criteria = document.createElement("p")
    criteria.innerHTML = practiceContent.criteria
    box.appendChild(criteria)

    if (!practiceContent.isVital) {
      let button = document.createElement("button")
      button.innerHTML = "<img src='./assets/images/plus.svg'></img>"

      if (practiceContent.isSelected) {
        box.classList.add("isSelected")
        button.innerHTML = "<img src='./assets/images/minus.svg'></img>"
      }

      button.addEventListener("click", () => {
        practiceContent.isSelected = !practiceContent.isSelected
        button.innerHTML = practiceContent.isSelected ? "<img src='./assets/images/minus.svg'></img>" : "<img src='./assets/images/plus.svg'></img>"
        box.classList.toggle("isSelected")
        practiceContent.isSelected
          ? addToCart(practiceContent)
          : removeFromCart(practiceContent)
        // Function to add to/remove from local storage
      })

      box.appendChild(button)
    } else {
      box.classList.add("isVital")
    }

    return box
  }

  function makePagination() {
    paginationContainer.innerHTML = ""

    let nbPage = Math.ceil(practicies.length / practiciesPerPage)

    for (let i = 0; i < nbPage; i++) {
      paginationContainer.appendChild(paginationButton(i, practicies))
    }
  }

  function paginationButton(page) {
    let button = document.createElement("button")
    button.innerText = page

    button.addEventListener("click", () => {
      currentPage = page
      populateContainer(currentPage)
    })

    return button
  }

  function makeFamiliesSelector() {
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

    familiesSelector.addEventListener("change", async (event) => {
      practicies = defaultPracticies
      practicies =
        event.target.value == 0
          ? practicies
          : practicies.filter(
              (practice) => practice.familyName === families[event.target.value]
            )

      currentPage = 0
      populateContainer(currentPage)
      makePagination()
    })
  }

  // CART MANAGEMENT:

  function initializeCart() {
    sessionStorage.setItem(
      "selectedPracticies",
      JSON.stringify(defaultPracticies.filter((practice) => practice.isVital))
    )
  }

  function getCartStorage() {
    return JSON.parse(sessionStorage.getItem("selectedPracticies"))
  }

  function setCartStorage(toSet) {
    sessionStorage.setItem("selectedPracticies", JSON.stringify(toSet))
  }

  function addToCart(practice) {
    let currentStorage = getCartStorage()
    currentStorage.push(practice)
    setCartStorage(currentStorage)
  }

  function removeFromCart(practice) {
    let currentStorage = getCartStorage()
    const index = currentStorage.indexOf(practice)
    currentStorage.splice(index, 1)
    setCartStorage(currentStorage)
  }
})()
