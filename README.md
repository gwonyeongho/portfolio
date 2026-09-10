# 권영호 포트폴리오

임베디드 · 로보틱스 · AI 소프트웨어 개발자 포트폴리오 사이트.

빌드 과정이 없는 정적 사이트다. `index.html` 한 파일로 전부 동작한다.

## 내용 고치는 법

`index.html` 을 열고 `const CONTENT = {` 로 시작하는 부분만 고치면 된다.
이 객체가 페이지의 모든 글과 목록을 담고 있다. HTML 과 CSS 는 건드릴 필요가 없다.

기본 규칙 세 가지.

| 규칙 | 예 |
| --- | --- |
| 글자는 따옴표로 감싼다 | `name: "권영호",` |
| 항목 사이에는 쉼표를 넣는다 | `"Python", "Linux",` |
| 목록에서 지우면 화면에서도 사라진다 | `certifications: []` → 자격증 섹션이 사라짐 |

### 프로젝트 추가

`projects: [` 안에서 `{ ... }` 한 덩어리를 복사해 붙이고 내용만 바꾼다.

```js
{
  date: "2025.09 – 2025.11",
  status: { label: "완료", kind: "done" },   // kind: "live" 는 진행 중(강조)
  meta: [
    { label: "Team", value: "4명 · 8주" },
    { label: "Role", value: "임베디드 · 통신" },
  ],
  title: "프로젝트 이름",
  subtitle: "한 줄 설명",
  summary: "프로젝트가 무엇인지 두세 문장으로.",
  bullets: [
    "내가 한 일 첫 번째",
    "내가 한 일 두 번째",
  ],
  tags: ["C++", "ROS2", "Raspberry Pi"],
  links: [
    { label: "GitHub 저장소", url: "https://github.com/..." },
  ],
},
```

### 기술 스택 추가

카드는 두 형태가 있다.

```js
// 활용수준 막대를 함께 보여주는 카드. level 은 1(초급) 2(중급) 3(고급)
{ title: "언어 / Languages", levels: [{ name: "C / C++", level: 3 }] },

// 이름만 알약 모양으로 나열하는 카드
{ title: "협업 / Collaboration", tags: ["Git", "Jira"] },
```

### 프로필 사진 넣기

사진 파일을 이 폴더에 넣고 파일명을 적는다. 비워두면 `monogram` 글자가 대신 보인다.

```js
photo: "profile.jpg",
```

## 로컬에서 확인

`index.html` 을 브라우저로 열면 된다. 또는:

```bash
npx serve .
```

## 배포

Vercel 에 GitHub 저장소를 연결해 두면 `master` 에 push 할 때마다 자동으로 다시 배포된다.

```bash
git add -A
git commit -m "프로젝트 추가"
git push
```

처음 연결하는 방법은 [vercel.com/new](https://vercel.com/new) 에서 이 저장소를 선택하고
Framework Preset 을 **Other**, Build Command 와 Output Directory 를 비운 채 Deploy 하면 된다.

## 구조

| 섹션 | 내용 |
| --- | --- |
| Hero | 이름 · 직무 · 연락 버튼 |
| About | 소개, 관심 분야 |
| Skills | 언어 · 공학용 활용수준, 도구 |
| Projects | 프로젝트 상세 |
| Experience | SSAFY · 학력 |
| Certifications | 자격증 |
| Contact | 이메일 · 전화 · GitHub |

섹션 순서는 `index.html` 아래쪽 `renderAbout`, `renderSkills` ... 목록의 순서를 바꾸면 된다.

## 프로필 사진 넣기

사진 파일 이름을 `profile.jpg` 로 바꿔서 이 폴더에 넣고 push 하면 된다.
파일이 없거나 이름이 다르면 모노글램 글자가 대신 보이므로 깨진 이미지가 나오지는 않는다.

```powershell
cd C:\Users\SSAFY\source\repos\portfolio; git add -A; git commit -m "프로필 사진 추가"; git push
```

다른 이름이나 png 를 쓰려면 `index.html` 의 `photo:` 값을 그 파일명으로 바꾼다.
