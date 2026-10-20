# 권영호 포트폴리오

AI와 SW 개발자 포트폴리오이다. 참고 사이트의 사원증 진입 화면과 문서형 정보 구조를 바탕으로 소개, 이력, 이름 중심의 간결한 기술 스택, 프로젝트 목록과 개별 상세 화면을 구성하였다.

**배포 주소:** https://gwonyeongho.github.io/portfolio/

## 프로젝트 구성

대표 프로젝트는 본디 문화유산 AI 복원 및 VR 박물관, PipeCheckkk, Smart Factory Twin, Karaoke AI Agent이다. 추가 프로젝트로 신체 치수 예측과 해외여행 커뮤니티 앱을 소개한다. 6개 프로젝트 모두 별도 상세 화면을 제공한다. 담당 역할과 기여 내용은 항목과 설명의 2열 표로 표시한다. 사용 기술은 표의 추가 행 대신 영역별 작은 태그로 분리한다. 해결 문제는 짧은 목록으로 구분하고 노래방 성능 개선은 비교 표와 개선 결과를 표시한다. 측정 조건과 평가 범위는 상세 화면에서 제외하고 근거 데이터와 문서에 보존한다.

팀 전체 기능과 개인 구현을 구분하였다. 본디의 개인 담당은 유물저장소 웹과 미리보기 개선, 방향 점검 Agent이다. VR 클라이언트와 다른 팀원의 AI 모델 학습은 개인 구현으로 표기하지 않았다. 비공개 저장소 링크와 고유 자격 식별번호는 공개하지 않는다.

## 파일 구성

| 파일 | 역할 |
| --- | --- |
| `index.html` | 진입 화면과 공통 HTML |
| `content.js` | 소개, 기술 활용 설명, 프로젝트 상세 내용 |
| `media.js` | 프로젝트별 대표 이미지와 주요 화면 연결 |
| `app.js` | 화면 렌더링과 해시 기반 상세 라우팅 |
| `styles.css` | 반응형 레이아웃과 시각 스타일 |
| `project-layout.css` | 이미지 좌측, 설명 우측의 프로젝트 목록 |
| `readability.css` | 역할 및 기여 표, 문제 해결 카드, 성능 비교 표의 반응형 스타일 |
| `assets/` | 실제 프로젝트 화면과 대표 이미지 |
| `tests/` | 콘텐츠 검증 및 브라우저 회귀 테스트 |
| `docs/CONTENT_SOURCES.md` | 작성 근거와 공개 범위 |

기술 스택은 C++을 가장 먼저 표시하며 설명 문장, Framework 그룹, 센서와 장비 이름을 제외하였다. AI 항목에는 RAG를 포함하고 Tools에 MATLAB / Simulink를 표시한다. 소개는 프로젝트 이름을 나열하지 않고 경험한 개발 분야를 설명한다.

모든 프로젝트 상세는 `프로젝트 개요 → 담당 역할 → 기여 및 기술 → 해결 문제 → AI 활용 → 주요 화면` 순서이다. 담당 역할은 실제 구현한 영역으로 구분한다. 본디는 인프라, 웹과 API, 3D 비교, 방향 점검 Agent를 명시하며 트러블슈팅 분류를 사용하지 않는다. 실제 원본과 복원본 비교 화면을 주요 화면의 첫 이미지로 제공한다. 노래방의 기존 반복 평가에 기반한 성능 개선은 해결 문제 안에 정리하였다. 개인 담당에 AI 모델을 적용하지 않은 해외여행 앱은 해당 범위를 명시한다.

프레임워크 빌드 없이 정적 파일로 배포된다. `master` 브랜치 변경은 GitHub Pages에 반영된다. 상세 주소는 `#project/karaoke-agent`와 같은 해시를 사용하므로 GitHub Pages에서 직접 열거나 새로고침해도 별도 서버 라우팅이 필요 없다.

## 실행 및 검증

```bash
npm install
npm run check
npm test
npm run serve
```

브라우저 테스트는 로컬 서버를 실행한 뒤 별도 터미널에서 수행한다.

```bash
npx playwright install chromium
npm run test:browser
```

다른 배포 주소를 검증할 때는 `PORTFOLIO_URL` 환경변수를 지정한다.

```bash
PORTFOLIO_URL=https://gwonyeongho.github.io/portfolio/ npm run test:browser
```

## 내용 수정

일반 문구는 `content.js`에서 수정한다. 프로젝트 객체에는 `id`, `title`, `role`, `responsibilities`, `overview`, `tech`, `contributions`, `problems`, `aiUsage`를 작성한다. `problems`는 제목과 라벨별 짧은 목록을 담는다. `performance`는 표의 열과 비교 수치, 측정 조건, 선택 근거, 평가 범위를 구분한다. 이미지와 캡션은 `media.js`에서 관리한다. 확인하지 않은 성능 수치는 추가하지 않는다.
