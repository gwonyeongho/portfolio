# 권영호 포트폴리오

임베디드 · 로보틱스 · AI 소프트웨어 개발자 포트폴리오 사이트.

빌드 과정이 없는 정적 사이트다. `index.html` 한 파일로 전부 동작한다.

## 로컬에서 보기

`index.html`을 브라우저로 열면 된다. 또는:

```bash
npx serve .
```

## 배포 — Vercel

1. 이 폴더를 GitHub 저장소로 push 한다.
2. [vercel.com/new](https://vercel.com/new) 에서 GitHub 계정을 연결한다.
3. 저장소를 선택하고 그대로 Deploy 한다.
   - Framework Preset: **Other**
   - Build Command: 비움
   - Output Directory: 비움

이후 `master` 브랜치에 push 하면 자동으로 재배포된다.

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
