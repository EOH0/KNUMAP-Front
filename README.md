## 🗺️  **KNUMAP**

> **경북대 학생들을 위한 캠퍼스 라이프  플랫폼!**
> 

---

## ❓ 프로젝트 개요

**KNUMAP**은 경북대학교 학생들이 주변 제휴 가게, 맛집, 공용 공간 등의 정보를 **지도 기반으로 쉽게 탐색**하고, **소셜 기능**을 통해 친구들과 공유할 수 있도록 돕는 **통합 캠퍼스 정보 서비스**입니다.

신입생이나 복학생, 또는 지역 정보를 잘 모르는 학우들은 학교 주변의 좋은 가게나 공간을 찾기 위해 많은 시간을 소비하거나, 주변 사람들의 입소문에 의존해야 하는 경우가 많습니다. 특히, 단과대학별 제휴 혜택이 있음에도 이를 쉽게 알기 어려운 구조도 문제였습니다.

**KNUMAP**은 이를 해결하고자 기획되었습니다. 단과대학에 따라 제공되는 **제휴 혜택 정보**, 카카오맵 기반의 **위치 탐색**, 그리고 친구와의 소통이 가능한 **소셜 기능**을 통합한 이 서비스는 다음과 같은 문제를 해결합니다:

- 제휴 정보가 흩어져 있어 확인이 불편함
- 학교 주변 위치 기반 정보를 빠르게 찾기 어려움
- 캠퍼스 생활에서 친구와 정보 공유가 비효율적임

**KNUMAP**을 통해 경북대 학생들은 자신이 속한 단과대학의 제휴 혜택을 **한눈에 파악**하고, **학교 주변의 유용한 공간을 쉽게 찾고**, 친구와 함께 즐길 수 있는 **소셜 캠퍼스 라이프**를 경험하게 됩니다. 학생들이 이 앱을 통해 시간을 절약하고, 더 편리하게 학교생활을 누릴 수 있기를 기대합니다.

---

## 📍 프로젝트 목표

- 이 프로젝트는 경북대학교 학생들의 캠퍼스 생활을 더욱 풍요롭고 편리하게 만들어주는 것을 목표로 합니다.
    - 경북대학교 내에서 학생들이 추천한 맛집, 카페 등을 한 눈에 볼 수 있게 제공하여 **학생 중심의 정보 제공**이라는 점에서 매우 유용합니다. 신입생 및 재학생들이 쉽게 새롭게 업데이트 된 정보를 얻을 수 있도록 도와주는 지도 서비스입니다.
    - 학생들의 **실시간 정보 공유**라는 점에서 매우 유용하고, 특히 경북대학교 학생들에게는 실질적인 도움이 될 것입니다. 교내 혹은 그 근처 정보를 보다 편리하게 확인할 수 있다는 점에서 긍정적인 반응을 얻을 수 있을 것입니다.
    - 사용자는 장소를 클릭해 주소, 운영 시간, 전화번호, 리뷰 등 세부 정보를 확인하고, 현재 위치에서 추천 장소까지 경로를 안내 받을 수 있도록 지도 앱과 SNS 계정으로의 접근을 용이하게 합니다.
    - 장소는 맛집, 카페, 편의점으로 **카테고리화(필터링 기능)** 되어 쉽게 찾을 수 있습니다. 또한, 사용자들은 리뷰와 평점을 남기고, 자신이 자주 가는 장소를 즐겨찾기에 추가할 수 있습니다.

---

## 👥 팀 소개: 스터디 그룹

- 팀 이름: 스터디 그룹
    - 코딩테스트를 준비하기 위해 모인 우리, 백준에서부터 응용버전 해커톤까지 달린다! **가자아아! 💪🔥🤓**

---

## 👤 팀원 소개

- **황상균:** 팀 리더 & 백엔드 개발
    - Firebase 기반으로 기능 연결
        - Authentication - 로그인 / 회원가입
        - Hosting - 배포 (Vercel)
        - Firestore Database - 사용자 정보, reviews 등 DB 저장
        - Storage - image 저장
    - 내정보 , 제휴 , 로그인 , 회원가입 등 일부 프론트엔드 구현
- **김선호:** 백엔드 개발
    - FireStore(DB), Vercel(서버) 관리
    - 로컬 서버 테스트 버그 수정
    - 서버 배포 버그 수정
- **김여진:** 프론트엔드 개발
    - 아이디어 채택
    - 데이터 크롤링, 분류
    - README 작성
- **이현수:** 프론트엔드, 백엔드 개발
    - Next.js 기반으로 구성 개발
        - 기능 명시
            - index.js - 메인화면, Home.module.css - 디자인
            - login.js, signup.js - 로그인 및 회원가입
                - findEmail.js, resetPassword.js - 아이디 및 비밀번호 찾기
                - profile.js - 내정보
            - favorite.js, partner.js - 즐겨찾기 및 제휴
            - social.js, chat.js - 친구추가, 친구와 채팅 등등

---

## 🖥️ 주요 기능

### **필터링 기능**

- **기능 설명**: 사용자는 다양한 기준에 따라 장소 목록을 필터링하고 정렬할 수 있습니다.
- **정렬 기준 선택:**
    - 사용자에게 정렬 옵션 제공:
        - **가나다순 정렬**
        - **인기순 정렬** (예: 리뷰 수 기준)
        - **최신 등록순** 등
    - 버튼이나 드롭다운 메뉴를 통해 정렬 기준 변경 가능
- **필터링 기능**
    - **위치별 필터**:
        - 정문, 쪽문, 서문, 북문, 농장문, 텍문 등 위치 선택 가능
        - 선택된 위치에 해당하는 장소만 보여줌
    - **분야별 필터**:
        - **카페 / 음식점 / 편의점**의 카테고리 제공
        - 원하는 분야만 선택하여 해당 리스트만 확인 가능
    - **복수 조건 필터링** 가능:
        - 예: "정문" + "카페" 동시에 선택 시 해당 조건을 모두 만족하는 항목만 출력

### **제휴 기능**

- **기능 설명**: 사용자의 단과대학에 맞는 제휴 업체 목록을 보여줍니다.
- **제공 정보**:
    - 업체명
    - 제휴 기간
    - 대상
    - 지도에서 보기 버튼 (`지도에서 해당 업체 위치 검색`)
    - 외부 링크 (카카오맵, 인스타그램)
- **이미지 출력**: `/data/partner/images/` 경로에서 업체 이름 기반 이미지 로드
- **예외 처리**: 이미지가 없을 경우 기본 이미지(`/data/image.jpg`)로 대체

### **소셜 기능**

- **기능 설명**: 사용자 간 소셜 인터랙션을 지원합니다. 주요 기능은 다음과 같습니다:
    - **친구 추가**  –  사용자 이름으로 검색하여 친구 요청 및 추가
    - **친구 목록 보기**  –  Firestore에 저장된 친구 목록을 조회하여 UI에 출력
    - **친구 삭제**  –  친구 옆 삭제 버튼으로 목록에서 제거
    - **실시간 채팅** 💬  –  친구와의 개별 채팅창에서 메시지를 주고받을 수 있음
        - Firestore의 `messages` 컬렉션 또는 `chats/{chatId}/messages` 구조 사용
        - 각 메시지에는 보낸 사람, 수신자, 내용, 타임스탬프 포함
        - 실시간 업데이트: `onSnapshot()`을 통해 실시간으로 채팅 내용 반영
        - 텍스트 기반 채팅 UI (좌측 내 메시지, 우측 상대방 메시지 식으로 표시)

---

## 🤡 사용 기술

- **Frontend:** Next.js, React, CSS Modules, Firebase Client SDK
- **Backend:** Firebase

---

## 📚 레포지토리

- **Frontend & Backend:**  https://github.com/EOH0/KNUMAP-Front.git
- **배포 도메인:**  https://vercel.com/eoh0s-projects/knumap-front

---

KNUMAP/
├── frontend/
│   ├── pages/                # 페이지 라우팅
│   ├── components/           # 재사용 가능한 컴포넌트
│   ├── public/               # 정적 파일 및 이미지
│   ├── styles/               # 스타일 시트
│   └── lib/                  # Firebase 초기화 및 사용자 컨텍스트
├── backend/
│   ├── functions/            # Firebase Functions
│   ├── firestore/            # Firestore 데이터 구조
│   └── auth/                 # Firebase Authentication 설정
└── README.md                 # 프로젝트 설명서

---

## Frontend

> **지도 기반 UI, 제휴정보 표시, 소셜 기능, Firebase 연동, 필터/검색/즐겨찾기**
> 

![image.png](attachment:b26bccf2-70ca-4dba-b587-18cc8fc5d938:image.png)

---

---

## 주요 기능

### **1. 지도 기반 장소 탐색 UI**

- `/pages/index.js`: 초기 메인 지도 화면
    - Kakao Map 또는 Leaflet 기반으로 지도 렌더링
    - 마커 클릭 시 상세 정보 모달/팝업
    - 장소 검색 시 `query string`으로 필터링 가능 (`/map?keyword=스타벅스` 등)

### **2. 제휴 정보 보기**

- `/pages/partner.js`: 제휴 가맹점 목록 UI
    - Firestore에서 유저의 `단과대학` 정보 가져옴 → 그에 맞는 제휴 가게 필터링
    - JSON 파일(`public/data/제휴정보.json`) 기반 렌더링
    - `카카오맵/인스타 아이콘`, `지도에서 보기` 버튼 포함
    - 정렬 및 필터링 기능도 추가됨 (위치/분야 기준)

### 3. **소셜 기능**

- `/pages/social.js`, `/components/SocialList.js` 등
    - 친구 추가, 친구 목록 보기, 삭제 기능
    - 친구 간 채팅 기능도 일부 포함 (채팅 로그 및 메시지 전달)
    - `firebase.firestore()` 기반 실시간 UI 구성

### **4. 로그인 / 회원정보**

- Firebase Auth와 Context API를 이용한 로그인/로그아웃
- `/pages/profile.js`: 단과대학, 학과 등 사용자 정보 관리

---

**frontend/** 사용자와의 인터페이스, 지도 UI, 필터링, 리뷰, 소셜 기능 등 전반적인 화면
├── pages/                      # 라우트별 화면
│   ├── index.js                # 메인 지도 페이지
│   ├── partner.js              # 제휴 목록
│   ├── profile.js              # 내 정보 수정
│   ├── social.js               # 친구 기능
│   └── favorite.js             # 즐겨찾기
│
├── components/                # 공통 UI 컴포넌트
│   ├── Map.jsx                 # Kakao 지도
│   ├── PlaceCard.jsx           # 장소 카드 UI
│   ├── FilterBar.jsx           # 필터링 바
│   ├── FriendList.jsx          # 친구 목록
│   ├── ChatBox.jsx             # 채팅 UI
│
├── public/                    # 정적 파일
│   ├── data/                   # JSON 기반 데이터
│   │   ├── 제휴정보.json
│   │   ├── reviews.json
│   │   └── reviewStats.json
│   ├── icons/                  # 아이콘 이미지 (카카오, 인스타)
│   └── image.jpg               # 기본 썸네일 이미지
│
├── styles/                    # CSS 모듈
│   ├── Main.module.css
│   ├── partner.module.css
│   ├── social.module.css
│
├── lib/                       # 전역 상태, Firebase 초기화
│   ├── firebase.js             # Firebase 설정
│   └── UserContext.js          # 로그인 사용자 context
│
├── .env.local                 # 환경 변수 (API 키 등)
├── next.config.js             # Next.js 설정
└── package.json               # 프론트엔드 의존성

---

## Backend

> **Firebase Auth + Firestore, 사용자/친구/채팅 정보 관리, Kakao API 연동, 정적 JSON 활용**
> 

---

## 📃 API 명세서

[API 명세서](https://www.notion.so/204837fdd1cb80ef90c9d0f6d88bcc02?pvs=21)

### 세부 API 명세서

| 기능 이름 | URL 또는 경로 | Method | 요청 방식 | 설명 | 상태 |
| --- | --- | --- | --- | --- | --- |
| 🔐 회원가입 | - | - | Firebase SDK | createUserWithEmailAndPassword | 완료 |
| 🔐 로그인 | - | - | Firebase SDK | signInWithEmailAndPassword | 완료 |
| 🔐 로그아웃 | - | - | Firebase SDK | signOut | 완료 |
| 👤 프로필 불러오기 | users/{uid} | - | Firestore | 사용자 정보 getDoc | 완료 |
| 👤 프로필 저장 | users/{uid} | - | Firestore | setDoc으로 사용자 정보 저장 | 완료 |
| 👤 프로필 이미지 업로드 | profileImages/{uid} | - | Firebase Storage | uploadString + getDownloadURL | 완료 |
| 👤 프로필 페이지 접근 | /profile | GET | 페이지 라우팅 | 사용자 프로필 정보 편집 | 완료 |
| 📍 장소 데이터 로딩 | /data/places.json | GET | 정적 JSON | 전체 장소 리스트 불러오기 | 완료 |
| 📍 제휴 데이터 로딩 | /data/제휴정보.json | GET | 정적 JSON | 단대별 제휴 목록 JSON | 완료 |
| 📍 리뷰 데이터 로딩 | /api/loadReviews | GET | Next.js API Route | Firestore에서 리뷰 불러오기 | 완료 |
| 📍 장소 검색/필터링 | - | - | 클라이언트 처리 | Fuse.js + 조건 필터링 | 완료 |
| ⭐ 즐겨찾기 저장/삭제 | localStorage[favorites_{uid}] | - | 클라이언트 처리 | 브라우저 localStorage 이용 | 완료 |
| ⭐ 즐겨찾기 페이지 | /favorite | GET | 페이지 라우팅 | 즐겨찾기한 장소 리스트 보여줌 | 완료 |
| 💬 채팅 메시지 저장 | chats/{chatId}/messages | - | Firestore | addDoc로 메시지 저장 | 완료 |
| 💬 채팅 실시간 수신 | chats/{chatId}/messages | - | Firestore snapshot | onSnapshot으로 메시지 실시간 로딩 | 완료 |
| 💬 채팅 페이지 | /chat?uid={상대 UID} | GET | 페이지 라우팅 | 1:1 채팅 페이지로 이동 | 완료 |
| 👥 친구 전체 목록 조회 | users | - | Firestore | 모든 사용자 getDocs | 완료 |
| 👥 친구 추가 | users/{uid}.friends[] | - | Firestore | arrayUnion으로 친구 UID 저장 | 완료 |
| 👥 친구 삭제 | users/{uid}.friends[] | - | Firestore | arrayRemove로 친구 UID 제거 | 완료 |
| 👥 친구 목록 보기 | users/{uid}.friends → users/{fid} | - | Firestore | 친구 UID 배열 → getDoc으로 이름 등 로딩 | 완료 |
| 👥 소셜 페이지 | /social | GET | 페이지 라우팅 | 친구 추가/삭제/목록 UI | 완료 |

## DataBase 구조

![image.png](attachment:e0017b4a-ea36-493d-9a48-84d34815e4d1:image.png)

---

## 주요 기능

### **1. 인증 (Authentication)**

- Firebase Authentication 사용
    - 이메일/비밀번호 기반 로그인
    - 로그인 상태를 `UserContext`로 전역 관리

### **2. 데이터베이스 (Firestore)**

- 사용자 정보

```json
users/{uid} {
  name: "황상균",
  college: "IT대학",
  major: "컴퓨터학부"
}
```

- 친구 목록

```json
friends/{uid}/list: [{ name, uid }]
```

- 채팅 메시지

```bash
chats/{chatId}/messages/{messageId}
```

### **3. 제휴 정보 관리**

- JSON 파일로 수동 관리:
    - `/public/data/제휴정보.json` (제휴 가게 정보)
    - `/public/data/reviews.json`, `/reviewStats.json` 등 리뷰 관련 데이터

### **4. 서버리스 함수 (옵션)**

- `functions/` 폴더에 Firebase Functions 사용 가능 (SSR 또는 API proxy 목적)
- 예: Kakao API 요청을 Functions로 프록시 처리 가능 (현재 코드에는 없을 수 있음)

---

**backend/** Firebase 기반 인증, 데이터 저장, Kakao API 연동, 서버리스 함수 처리 등
├── functions/                 # Firebase Functions (SSR 또는 API proxy)
│   ├── index.js               # 기본 진입점
│   ├── kakaoProxy.js          # Kakao API 중계 처리 (선택 구현)
│   └── firebase.json          # Functions 설정
│
├── firestore/                # Cloud Firestore 구조
│   └── users/{uid}           # 사용자 정보 (이름, 단과대학, 학과 등)
│   └── friends/{uid}/list    # 친구 목록
│   └── chats/{chatId}        # 채팅 데이터 (메시지 기록)
│
├── auth/                     # Firebase Authentication
│   └── 이메일/비밀번호 로그인
│
├── rules/                    # Firestore 보안 규칙 (firestore.rules)
├── storage/                  # 이미지 업로드 시 사용할 수 있음 (선택)
└── .firebaserc               # Firebase 프로젝트 설정

---

## ✨ 향후기대사항

### **1. AI 기반 맞춤 추천 기능**

- 사용자의 관심사, 위치, 선호 장소 데이터를 기반으로 **개인 맞춤형 추천 장소**를 제공하는 기능을 개발할 예정입니다.
    - 예를 들어, "혼밥하기 좋은 곳", "조용한 카페", "인기 많은 제휴 가게" 등을 자동 추천합니다.

### **2. 실시간 인기 장소 표시**

- 리뷰 수나 즐겨찾기 수, 방문 수 등을 기반으로 **실시간 트렌드**를 보여주는 기능이 추가될 예정입니다.

### **3. 모바일 앱 개발**

- 현재는 웹 기반으로 서비스되고 있지만, 향후 모바일 앱(Android/iOS)으로 확장하여 **이동 중에도 더 손쉽게** 이용할 수 있도록 개선할 예정입니다.

### **4. 단과대학 및 학과별 제휴 확대**

- 현재는 6개 단과대학만 제휴 이력이 있지만, 앞으로는 **경북대학교 전 단과대학**, 더 나아가 **학과별 맞춤 제휴 혜택**까지 확장하여 **더 세분화되고 폭넓은 정보**를 제공할 수 있도록 할 예정입니다.

---
