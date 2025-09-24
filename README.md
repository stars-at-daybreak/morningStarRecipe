<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/9920e644-b6ba-4c76-868b-9cbd31ac291c" />

# 모두의 부엌 **( https://ourkitchen.store/ )**

## 테스트용 계정

아이디: test@ourkitchen.com  
비밀번호: test123$

> 💡 테스트 계정으로 로그인하여 레시피 등록, 댓글 작성, 좋아요 등 모든 기능을 체험해보실 수 있습니다.

---
## 프로젝트 소개

"오늘 저녁 뭐 먹지?" 매일 반복되는 고민을 해결하기 위한 **레시피 공유 플랫폼**입니다.

### 목표
- 누구나 쉽게 레시피를 공유하고 검색할 수 있는 직관적인 플랫폼 구축
- 요리를 좋아하는 사람들이 소통하고 교류할 수 있는 커뮤니티 제공
- 실제 음식 나눔을 통한 지역 기반 소셜 네트워킹 플랫폼

### 주요 기능

### 주요 기능

| **실시간 순위 시스템** | **레시피 게시글 기능** | **음식 나눔 게시글** |
|:---:|:---:|:---:|
| 인기 레시피 실시간 랭킹 | 사용자가 직접 레시피 작성 및 공유 | 만든 음식을 이웃과 나눌 수 있는 기능 |
| <img width="250" alt="실시간 순위 시스템" src="https://github.com/user-attachments/assets/5708ad82-ae8f-4fa4-8387-5e9edf9899cb" /> | <img width="250" alt="레시피 게시글 기능" src="https://github.com/user-attachments/assets/b355fb16-67b8-4fa6-b9c6-a4f80f5133f9" /> | <img width="250" alt="음식 나눔 게시글" src="https://github.com/user-attachments/assets/14eb880a-d021-4669-9d10-6caae22d5ca2" /> |
| • 좋아요 수 기반 실시간 순위 업데이트<br>• 메인 페이지 TOP 3 레시피 노출<br>• 트렌드 파악 가능 | • 단계별 설명과 사진 포함<br>• 재료, 조리시간, 난이도 입력<br>• 체계적인 레시피 관리 | • 지역 기반 음식 나눔 커뮤니티<br>• 실제 오프라인 연결<br>• 소셜 네트워킹 기능 |
| | | |
| **댓글 시스템** | **추천/찜하기 시스템** | **회원별 등급제도** |
| 게시글별 사용자 소통 기능 | 레시피 평가 및 북마크 기능 | 레시피 게시글 수에 따른 뱃지 부여 |
| <img width="250" alt="댓글 시스템" src="https://github.com/user-attachments/assets/61c6aace-ee63-4825-ac0b-82953a7a46f1" /> | <img width="250" alt="찜하기 기능" src="https://github.com/user-attachments/assets/6c6fa463-eb32-43ee-9243-228f39354008" /> | <img width="250" alt="회원별 등급제도" src="https://github.com/user-attachments/assets/700dfa48-fab0-49b0-8d1c-9d29354d4c8b" /> |
| • 실시간 댓글 작성 및 답글<br>• 요리 팁과 질문 공유<br>• 커뮤니티 형성 | **추천/비추천**: 좋아요/싫어요 투표<br>**찜하기**: 원클릭 레시피 저장<br>• 평가 결과 순위 반영 및 개인 컬렉션 구성 | • 사용자 성취감 부여<br>• 지속적인 참여 유도<br><br>**등급 시스템**<br>1단계 초보 집밥러 (0\~9개)<br>2단계 우리집 요리사 (10\~49개)<br>3단계 식탁 해결사 (50\~99개)<br>4단계 집밥의 고수 (100개 이상) |

</div>

---




## 기술 스택

### Frontend
- **React 19.1.1**: 사용자 인터페이스 구축
- **TypeScript**: 타입 안정성 확보
- **Vite**: 빠른 번들링 및 개발 서버
- **React Router DOM**: 클라이언트 사이드 라우팅
- **Zustand**: 상태 관리

### Backend & Database
- **Supabase**: BaaS(Backend-as-a-Service) 백엔드 기능들을 API로 제공하는 서비스
    - 인증 (Authentication)
    - 실시간 데이터베이스 (PostgreSQL)
    - API 자동 생성

### 개발 도구
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **TypeScript ESLint**: TypeScript 린팅

### 배포 및 호스팅
- **Netlify**: 프론트엔드 배포
- **GitHub**: 소스 코드 관리

---

## 설치 및 실행 방법

### 1. 저장소 클론
```bash
git clone https://github.com/stars-at-daybreak/morningStarRecipe.git
cd morningStarRecipe
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key

# API 설정 (선택사항)
VITE_API_BASE_URL=your_api_base_url
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 빌드 및 배포
```bash
# 타입 체크 및 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 린트 검사
npm run lint
```

---
## 폴더 구조
```
morningStarRecipe/
├── public/                     # 정적 파일
└── src/                        # 소스 코드
    ├── assets/                 # 정적 리소스 (이미지, 아이콘 등)
    ├── components/             # 재사용 가능한 컴포넌트
    ├── data/                   # 정적 데이터
    ├── error/                  # 에러 처리 관련
    ├── hooks/                  # 커스텀 훅
    ├── pages/                  # 페이지 컴포넌트
    ├── providers/              # Context Provider
    ├── services/               # API 서비스 레이어
    ├── stores/                 # 상태 관리 (Zustand)
    ├── styles/                 # 스타일 파일
    ├── types/                  # TypeScript 타입 정의
    └── utils/                  # 유틸리티 함수
```
---

## URL 구조 (모놀리식 아키텍처)

| 경로 | 설명 | 인증 필요 |
|------|------|-----------|
| `/` | 메인 페이지 | 불필요 |
| `/login` | 로그인 | 불필요 |
| `/password` | 비밀번호 찾기 | 불필요 |
| `/signup` | 회원가입 | 불필요 |
| `/recipes` | 레시피 목록 | 불필요 |
| `/recipes/:id` | 레시피 상세 페이지 | 불필요 |
| `/recipes/form` | 레시피 작성 | 필요 |
| `/share` | 나눔 게시글 목록 | 불필요 |
| `/share/:id` | 나눔 게시글 상세 | 불필요 |
| `/share/form` | 나눔 게시글 작성 | 필요 |
| `/mypage` | 마이페이지 | 필요 |
| `/mypage/my-postList` | 내 게시물 | 필요 |
| `/mypage/my-bookmark` | 찜한 레시피 | 필요 |
| `/mypage/user-edit` | 프로필 수정 | 필요 |
| `/levelup-guide` | 레벨업 가이드 | 불필요 |
| `/privacy` | 개인정보 처리방침 | 불필요 |
| `/terms` | 서비스이용약관 | 불필요 |
| `/404` | 페이지 없음 | 불필요 |

---

## 아키텍처
<img width="1443" height="642" alt="사본 -Frontend and Backend Architecture with CI_CD" src="https://github.com/user-attachments/assets/1b13cc44-23d5-43c0-8b7e-9cd1286e86a7" />

---

## 데이터베이스 설계 (ERD)
<img width="1653" height="1128" alt="Image" src="https://github.com/user-attachments/assets/e8fbeefc-a72d-4b51-be75-b19f93e865ff" />

---

## 와이어프레임
<img width="2267" height="1221" alt="Image" src="https://github.com/user-attachments/assets/627dd09d-0696-49ee-8bdd-c063511a073f" />

---

## 팀 정보

| 이름 | 이메일 |
|------|--------|
| 김동욱 | slasnrndu@gmail.com |
| 이상철 | tkdcjf3552@gmail.com |
| 조은별 | silverstar9482@gmail.com |

