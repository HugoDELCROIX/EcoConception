async function fetchApi() {
  try {
    let response = await fetch("http://localhost:3000/practicies")
    localStorage.setItem("practicies", JSON.stringify(await response.json()))
    console.log("Making api call")
  } catch (error) {
    console.log("Couldn’t fetch API...")
  }
}

export async function getPracticies() {
  try {
    if (localStorage.getItem("practicies") === null) await fetchApi()

    return JSON.parse(localStorage.getItem("practicies"))
  } catch (error) {
    console.log(error)
  }
}

export function getCartStorage() {
  return JSON.parse(sessionStorage.getItem("selectedPracticies"))
}

export function setCartStorage(toSet) {
  sessionStorage.setItem("selectedPracticies", JSON.stringify(toSet))
}

export async function initializeCart() {
  const practicies = await getPracticies()
  let vitalPracticies = practicies.filter((practice) => practice.isVital)
  setCartStorage(vitalPracticies)
}

export function getLocalStorage() {
  return JSON.parse(localStorage.getItem("practicies"))
}
