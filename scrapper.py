# Author: Thomas (Rhylionn)
# Purpose: Fetch datas from isit-europe to get all 491 all good practicies for Design4Green preparation
# This script has been design to make sure the server is not saturated with the help of sleeps


from bs4 import BeautifulSoup
from time import sleep
from random import random
import requests
import json

requests.adapters.DEFAULT_RETRIES = 4

dumpedData = []

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
  familyPage = ""

  while familyPage == "":
    try:
      familyPage = requests.get(baseUrl + familyLink)
      break
    except:
      print("Couldn’t fetch a page... waiting before retry")
      sleep(15)
      continue
  
  famillyPageSoup = BeautifulSoup(familyPage.text, 'html.parser')

  # Fetching class called famille

  famille = famillyPageSoup.find("div", {"class": "famille"})
  recommandations = famille.find_all("div", {"class": "recommandation"})

  for recommandation in recommandations:

    recoName = recommandation.find("button").text
    recommandationName = recoName[3:len(recoName) - 2]

    print("Fetching " + recommandationName + "...")

    container = recommandation.find("div", {"class": "container"})
    cards = container.find_all("a", {"class": "card3"})

    # fetching each cards
    for card in cards:
      # Link to request and get the indicator
      detailLink = card.attrs["href"]
      cardKeyStep = card.find("h3")

      if cardKeyStep is not None:
        keyStep = cardKeyStep.text
      else:
        keyStep = "N/A"

      cardParagraph = card.find("p")
      if cardParagraph is not None:
        paragraph = cardParagraph.text
      else:
        paragraph = "N/A"

      categories = []

      cardCategories = card.find("div", {"class": "odd"}).find_all("span")

      if cardCategories is not None:
        for categorie in cardCategories:
          categories.append(categorie.text)

      isVital = True if "Incontournable" in categories else False

      # Fetch for the indicator in other page
      detailPage = ""
      while detailPage == "":
        try:
          detailPage = requests.get(baseUrl + detailLink)
          break
        except:
          print("Couldn’t fetch a page... waiting before retry")
          sleep(15)
          continue
      
      detailSoup = BeautifulSoup(detailPage.text, "html.parser")
      indicator = "N/A"
      lifecycle = "N/A"

      detailIndicatorAndLifecycle = detailSoup.find("div", {"class": "acteurs-metiers"})

      if detailIndicatorAndLifecycle is not None:
        indicatorAndLifecycle = detailIndicatorAndLifecycle.find_all("p")

        if indicatorAndLifecycle is not None:
          indicator = indicatorAndLifecycle[0].text if len(indicatorAndLifecycle) > 0 else "N/A"
          lifecycle = indicatorAndLifecycle[1].text if len(indicatorAndLifecycle) > 1 else "N/A"

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

      dumpedData.append(finalDictionary)
      sleep((random()+0.5)*3)
  
  print("Waiting to start new family...")
  sleep(15)

with open("data.json", "w") as finalData:
  json.dump(dumpedData, finalData)

print("Done.")