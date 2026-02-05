import requests
import json

if __name__ == '__main__':
    url:str = 'http://127.0.0.1:8000/generate'

    with open('sample.json', 'r', encoding='utf-8') as f:
        payload = json.load(f)

    response = requests.post(url, json=payload)

    if response.status_code == 200:
        with open('repertuar.pdf', 'wb') as f:
            f.write(response.content)
    else:
        print(response.status_code, response.text)

