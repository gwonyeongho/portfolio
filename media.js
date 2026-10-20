/* 대표 이미지와 상세 화면 자료. 원본 PPT와 저장소 화면을 바탕으로 구성했습니다. */
const MEDIA = {
  "vr-museum": {
    cover: "assets/bondi-cover.webp",
    coverCaption:
      "본디 프로젝트 소개 / 실제 유물저장소 화면을 활용한 대표 이미지",
    screens: [
      [
        "assets/bondi-comparison.webp",
        "원본(왼쪽)과 복원본(오른쪽)을 나란히 비교하는 실제 유물저장소 화면. 두 뷰어의 카메라가 함께 움직입니다.",
      ],
      [
        "assets/bondi-preview.webp",
        "유물 원본과 여러 복원본을 웹에서 확인하고 비교하는 유물저장소",
      ],
    ],
  },
  pipecheckkk: {
    cover: "assets/pipecheck-cover.webp",
    coverCaption: "PipeCheckkk 프로젝트 최종발표 자료",
    screens: [
      [
        "assets/pipecheck-exploration.webp",
        "팀 통합 대시보드의 탐사 중 화면. 관로 카메라와 장애물 회피 진행 상태, 일시 정지 및 종료 제어를 표시합니다. 개인 담당은 AI 주행과 관제 연동입니다.",
      ],
      [
        "assets/pipecheck-flow.webp",
        "카메라와 Depth, 초음파, IMU, 이전 행동을 입력받아 방향과 속도 및 다음 행동을 판단하는 AI 주행 구조",
      ],
    ],
  },
  "smart-factory": {
    cover: "assets/factory-cover.webp",
    coverCaption:
      "스마트팩토리 프로젝트 소개 / 실제 공정 화면을 활용한 대표 이미지",
    screens: [
      [
        "assets/factory-preview.webp",
        "자동 조립 공정과 장비의 진행 상태를 확인하는 웹 화면",
      ],
      [
        "assets/factory-vision.webp",
        "YOLO로 상단 부품과 하단 부품을 구분한 인식 화면. 표시된 값은 해당 프레임의 검출 신뢰도이며 전체 모델 정확도는 아닙니다.",
      ],
    ],
  },
  "karaoke-agent": {
    cover: "assets/karaoke-cover.webp",
    coverCaption: "실제 프로젝트 제어 UI를 바탕으로 제작한 대표 이미지",
    screens: [
      [
        "assets/karaoke-ui.webp",
        "실제 프론트엔드 코드로 렌더링한 초기 제어 화면. 음성 처리 및 모델 API를 실행한 시연 화면은 아닙니다.",
      ],
    ],
  },
};
const IMAGE_SIZES = {
  "assets/bondi-comparison.webp": [2879, 1413],
  "assets/bondi-preview.webp": [1983, 1047],
  "assets/pipecheck-exploration.webp": [900, 720],
  "assets/pipecheck-flow.webp": [1920, 1080],
  "assets/factory-preview.webp": [1611, 937],
  "assets/factory-vision.webp": [1427, 800],
  "assets/karaoke-ui.webp": [1100, 625],
};
window.PORTFOLIO.projects.forEach((p) => {
  Object.assign(p, MEDIA[p.id] || {});
  if (p.screens)
    p.screens = p.screens.map(([src, caption]) => [
      src,
      caption,
      IMAGE_SIZES[src],
    ]);
});
