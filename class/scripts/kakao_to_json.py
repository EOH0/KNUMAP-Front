import requests
import json
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
import time

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

for page in range(1, 2):  # 최대 10페이지
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

# Selenium으로 영업시간/리뷰수 크롤링
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
driver = webdriver.Chrome(options=chrome_options)

for place in places:
    try:
        driver.get(place["url"])
        # iframe이 로드될 때까지 대기 후 전환
        WebDriverWait(driver, 3).until(
            EC.frame_to_be_available_and_switch_to_it("entryIframe")
        )

        # # 영업시간 대기 및 추출
        # try:
        #     opening = WebDriverWait(driver, 1).until(
        #         EC.presence_of_element_located((By.CSS_SELECTOR, "#foldDetail2 .line_fold .detail_fold .txt_detail"))
        #     ).text
        # except Exception:
        #     opening = "정보 없음"

        # 리뷰수 대기 및 추출
        try:
            review = driver.find_element(By.XPATH, '//*[@id="mainContent"]/div[1]/div[1]/div[2]/div[2]/a/span[2]').text
        except Exception:
            review = "0"

        # place["openingHours"] = opening
        place["reviewCount"] = review

        # 4. 다시 메인 프레임으로 전환 (다음 반복을 위해)
        driver.switch_to.default_content()
        
    except Exception as e:
        place["openingHours"] = "정보 없음"
        place["reviewCount"] = "0"

driver.quit()

# 저장 경로 지정 (public/data/places.json)
output_dir = os.path.join(os.path.dirname(__file__), "../public/data")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "places.json")

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(places, f, ensure_ascii=False, indent=2)

print(f"저장 완료: {output_path}")