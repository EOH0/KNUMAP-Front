import requests
import json
import os

KAKAO_API_KEY = 'd49c484cf17eb492ce696a0e378b68fd'
category = 'CE7'
x = 128.609512
y = 35.890318
radius = 600

url = 'https://dapi.kakao.com/v2/local/search/category.json'
headers = {
    "Authorization": f"KakaoAK {KAKAO_API_KEY}"
}

places = []

for page in range(1, 46):  # 최대 45페이지
    params = {
        "category_group_code": category,
        "x": x,
        "y": y,
        "radius": radius,
        "size": 15,
        "page": page,
        "sort": "distance"
    }

    res = requests.get(url, headers=headers, params=params)
    data = res.json()

    documents = data.get('documents', [])
    if not documents:
        break

    for place in documents:
        name = place['place_name']
        phone = place['phone'] if place['phone'] else "전화번호 없음"
        link = place['place_url']
        places.append({
            "name": name,
            "phone": phone,
            "url": link
        })

# 저장 경로 지정 (public/data/places.json)
output_dir = os.path.join(os.path.dirname(__file__), "../public/data")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "places.json")

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(places, f, ensure_ascii=False, indent=2)

print(f"저장 완료: {output_path}")
