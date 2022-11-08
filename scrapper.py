from bs4 import BeautifulSoup
from time import sleep
import re
import requests

# Url to be fetched
baseUrl = "https://gr491.isit-europe.org/"

# HTML document
page = requests.get(baseUrl)

soup = BeautifulSoup(page.text, 'html.parser')
htmlDocument = soup.prettify()

families = soup.find("div", {"id": "container-familles"}).find_all("a", {"class": "card3"})

for familly in families:
  familyTitle = familly.find("h2").text

  print("Fetching " + familyTitle + "...")

  # Page that will be beautified in order to perfom searches on it (the family)
  familyLink = familly.attrs["href"]
  familyPage = requests.get(baseUrl + familyLink)
  famillyPageSoup = BeautifulSoup(familyPage.text, 'html.parser')

  # Fetching class called famille

  famille = famillyPageSoup.find("div", {"class": "famille"})
  recommandations = famille.find_all("div", {"class": "recommandation"})

  for recommandation in recommandations:

    recoName =recommandation.find("button").text
    recommandationName = recoName[3:len(recoName) - 2]

    print("Fetching " + recommandationName + "...")

    container = recommandation.find("div", {"class": "container"})
    cards = container.find_all("a", {"class": "card3"})

    # fetching each cards
    for card in cards:
      # Link to request and get the indicator
      detailLink = card.attrs["href"]

      keyStep = card.find("h3").text
      paragraph = card.find("p").text
      categories = []

      cardCategories = card.find("div", {"class": "odd"}).find_all("span")
      
      for categorie in cardCategories:
        categories.append(categorie.text)

      isVital = True if "Incontournable" in categories else False

      # Fetch for the indicator in other page
      detailPage = requests.get(baseUrl + detailLink)
      detailSoup = BeautifulSoup(detailPage.text, "html.parser")

      indicatorAndLifecycle = detailSoup.find("div", {"class": "acteurs-metiers"}).find_all("p")

      indicator = indicatorAndLifecycle[0].text
      lifecycle = indicatorAndLifecycle[1].text

      print("Card done!")

      finalDictionary = {
        "family": familyTitle,
        "name": recommandationName,
        "isVital": isVital,
        "keystep": keyStep,
        "categories": categories,
        "indicator": indicator,
        "lifecycle": lifecycle
      }

      print(finalDictionary)
      sleep(3)
      
print("Done")