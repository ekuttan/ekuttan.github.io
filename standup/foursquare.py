import json, requests
url = 'https://api.foursquare.com/v2/venues/explore'

params = dict(
  client_id='CLIENT_ID',
  client_secret='CLIENT_SECRET',
  v='20170801',
  ll='40.7243,-74.0018',
  query='coffee',
  limit=1
)
resp = requests.get(url=url, params=params)
data = json.loads(resp.text)