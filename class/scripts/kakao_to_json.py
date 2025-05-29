import os
import json
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# JSON 파일 경로
json_path = "../public/data/places.json"  # 수정 필요
image_dir = "../public/data/image"
os.makedirs(image_dir, exist_ok=True)

# 브라우저 옵션 설정
options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
driver = webdriver.Chrome(options=options)

# 장소 데이터 로드
with open(json_path, "r", encoding="utf-8") as f:
    places = json.load(f)

def download_image(img_url, save_path):
    try:
        response = requests.get(img_url, stream=True)
        if response.status_code == 200:
            with open(save_path, "wb") as f:
                f.write(response.content)
            return True
    except:
        pass
    return False

# 각 장소 URL 접속 후 이미지 저장
for place in places:
    name = place["name"]
    url = place["url"]
    safe_name = name.replace("/", "_").replace(" ", "_")
    save_path = os.path.join(image_dir, f"{safe_name}.jpg")

    try:
        driver.get(url)
        img = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "img.img-thumb.img_cfit"))
        )
        img_url = img.get_attribute("src")
        if download_image(img_url, save_path):
            print(f"[✓] {name} 이미지 저장 완료")
        else:
            print(f"[✗] {name} 이미지 다운로드 실패")
    except Exception as e:
        print(f"[!] {name} 크롤링 실패: {e}")

driver.quit()
