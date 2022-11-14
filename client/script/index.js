const practiciesContainer = document.getElementById("practicies-container")
const paginationContainer = document.getElementById("pagination-container")

import {
  getPracticies,
  getCartStorage,
  setCartStorage,
  initializeCart,
} from "./modules.js"

let currentPage = 0
let practiciesPerPage = 20

;(async function () {
  if (getCartStorage() === null) await initializeCart()

  let selectedPracticies = getCartStorage()

  const defaultPracticies = await getPracticies()
  let practicies = defaultPracticies

  makeFamiliesSelector(practicies)
  populateContainer(currentPage, practicies)
  makePagination(practicies)

  // Populate practice container
  async function populateContainer(page) {
    practiciesContainer.innerHTML = ""

    let start = page * practiciesPerPage
    let end = start + practiciesPerPage
    let paginatedPracticies = practicies.slice(start, end)

    for (let i = 0; i < paginatedPracticies.length; i++) {
      practiciesContainer.appendChild(
        makePracticeContainer(paginatedPracticies[i])
      )
    }
  }

  // Create the html element to be displayed
  function makePracticeContainer(practiceContent) {
    const { _id, categories, criteria } = practiceContent
    const btnAddImage =
      "<img src='./assets/images/plus.svg' alt='Ajouter au panier'>"
    const btnRemoveImage =
      "<img src='./assets/images/minus.svg' alt='Retirer du panier'>"

    let box = document.createElement("div")
    box.classList.add("practice-container")

    box.innerHTML = `
      <h1>${categories[0]}</h1>
      <hr>
      <p>${criteria}</p>
    `

    if (!practiceContent.isVital) {
      let isSelected =
        selectedPracticies.find((practice) => practice._id == _id) != null

      const button = document.createElement("button")
      button.innerHTML = btnAddImage

      if (isSelected) {
        box.classList.add("isSelected")
        button.innerHTML = btnRemoveImage
      }

      button.addEventListener("click", () => {
        selectedPracticies = getCartStorage()
        if (isSelected) {
          isSelected = false
          console.log("Removing")
          removeFromCart(practiceContent)
        } else {
          isSelected = true
          console.log("Adding")
          addToCart(practiceContent)
        }

        button.innerHTML = isSelected ? btnRemoveImage : btnAddImage
        box.classList.toggle("isSelected")
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

  function addToCart(practice) {
    let currentStorage = getCartStorage()
    currentStorage.push(practice)
    setCartStorage(currentStorage)
  }

  function removeFromCart(practice) {
    const index = selectedPracticies.indexOf(practice)
    selectedPracticies.splice(index, 1)
    setCartStorage(selectedPracticies)
  }
})()
