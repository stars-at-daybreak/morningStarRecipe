# 모두의 부엌

## 프로젝트 소개

"오늘 저녁 뭐 먹지?" 매일 반복되는 고민을 해결하기 위한 **레시피 공유 플랫폼**입니다.

### 목표
- 누구나 쉽게 레시피를 공유하고 검색할 수 있는 직관적인 플랫폼 구축
- 요리를 좋아하는 사람들이 소통하고 교류할 수 있는 커뮤니티 제공
- 실제 음식 나눔을 통한 지역 기반 소셜 네트워킹 플랫폼

### 주요 기능

<details>
<summary><strong>실시간 순위 시스템</strong>: 인기 레시피 실시간 랭킹</summary>

- 목적: 사용자 활동 유도 및 경쟁을 통한 콘텐츠 품질 향상
- 좋아요 수 기반 실시간 순위 업데이트
- 메인 페이지에 TOP 3 레시피 노출로 트렌드 파악 가능

</details>

<details>
<summary><strong>레시피 게시글 기능</strong>: 사용자가 직접 레시피 작성 및 공유</summary>

- 목적: 사용자 생성 콘텐츠로 플랫폼 활성화 및 개인만의 레시피 노하우 공유 유도
- 단계별 설명과 사진을 포함한 상세 레시피 작성
- 재료, 조리시간, 난이도 등 체계적인 정보 입력

</details>

<details>
<summary><strong>음식 나눔 게시글</strong>: 만든 음식을 이웃과 나눌 수 있는 기능</summary>

- 지역 기반 음식 나눔 커뮤니티
- 실제 오프라인 연결을 통한 소셜 네트워킹

</details>

<details>
<summary><strong>댓글 시스템</strong>: 게시글별 사용자 소통 기능</summary>

- 목적: 커뮤니티 형성 및 사용자 체류시간 증가
- 실시간 댓글 작성 및 답글 기능
- 요리 팁과 질문을 주고받는 커뮤니티 형성

</details>

<details>
<summary><strong>추천/비추천 시스템</strong>: 레시피 평가 기능</summary>

- 목적: 사용자 참여 유도 및 경쟁 분위기 조성으로 콘텐츠 품질 관리
- 실시간 좋아요/싫어요 투표 시스템
- 평가 결과에 따른 순위 반영

</details>

<details>
<summary><strong>찜하기 기능</strong>: 마음에 드는 레시피 북마크 기능</summary>

- 목적: 개인화된 레시피 컬렉션 구성 및 재방문 유도
- 원클릭으로 레시피 저장 및 해제
- 마이페이지에서 찜한 레시피 목록 관리

</details>

<details>
<summary><strong>회원별 등급제도</strong>: 레시피 좋아요 수 높은 사용자 뱃지 부여 기능</summary>

- 목적: 사용자 성취감 부여 및 지속적인 참여 유도
- 누적 게시글 수에 따른 등급 시스템

| 등급 | 레벨명 | 필요 게시글 수 |
|------|--------|----------------|
| LV.1 | 초보 집밥러 | 0~9개 |
| LV.2 | 우리집 요리사 | 10~49개 |
| LV.3 | 식탁 해결사 | 50~99개 |
| LV.4 | 집밥의 고수 | 100개 이상 |

</details>

<details>
<summary><strong>반응형 디자인</strong>: 모바일 최적화된 UI/UX</summary>

- 다양한 디바이스에서 최적화된 사용 경험
- 터치 인터페이스 최적화

</details>

---

## 배포 URL

**배포 사이트**: [https://morningstarrecipe.netlify.app/](https://morningstarrecipe.netlify.app/)

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

## 테스트용 계정

아이디: test@ourkitchen.com  
비밀번호: test123$

> **참고**: 테스트 계정으로 로그인하여 레시피 등록, 댓글 작성, 좋아요 등 모든 기능을 체험해보실 수 있습니다.

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

