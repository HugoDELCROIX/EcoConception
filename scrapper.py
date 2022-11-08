from bs4 import BeautifulSoup
import requests

# Url to be fetched
url = "https://gr491.isit-europe.org/?famille=strategie"

# HTML document
page = requests.get(url)

soup = BeautifulSoup(page.text, 'html.parser')
htmlDocument = soup.prettify()
print(htmlDocument)
