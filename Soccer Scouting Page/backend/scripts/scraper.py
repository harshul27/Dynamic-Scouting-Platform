import requests
from bs4 import BeautifulSoup

def scrape_player_data(player_name):
    # A simple example, this needs to be tailored to a specific website
    search_url = f"https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query={player_name.replace(' ', '+')}"
    headers = {'User-Agent': 'Mozilla/5.0'}

    try:
        response = requests.get(search_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the first player link and navigate to their profile page
        player_link = soup.find('a', {'class': 'spielprofil_tooltip'})
        if player_link:
            profile_url = f"https://www.transfermarkt.com{player_link['href']}"
            profile_response = requests.get(profile_url, headers=headers)
            profile_soup = BeautifulSoup(profile_response.text, 'html.parser')

            # Extract specific data points (age, nationality, etc.)
            age_tag = profile_soup.find('span', string='Age:')
            nationality_tag = profile_soup.find('span', string='Nationality:')

            age = age_tag.find_next_sibling('span').text.strip() if age_tag else None
            nationality = nationality_tag.find_next_sibling('span').text.strip() if nationality_tag else None

            return {'age': int(age) if age else None, 'nationality': nationality}

    except requests.exceptions.RequestException as e:
        print(f"Scraping failed: {e}")
        return None
    return None