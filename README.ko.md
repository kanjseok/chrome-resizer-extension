# Chrome Resizer Extension

> 현재 Chrome 창의 크기를 원하는 해상도로 즉시 변경하는 Chrome 확장 프로그램입니다.

## Why Chrome Resizer Extension?

- **Problem**: 웹 개발 및 테스트 과정이나 일반적인 사용 환경에서 다양한 해상도의 브라우저 창 크기를 빠르고 정확하게 전환하는 데 어려움이 있습니다.
- **Solution**: 커스텀 가능한 프리셋을 기반으로, 클릭 한 번 또는 단축키를 통해 브라우저 창의 크기를 정확한 해상도로 즉시 변경할 수 있게 해줍니다.
- **Scope**: 다양한 기기 해상도 프리셋 관리, 사용자 정의 해상도 추가, 단축키 지원, 화면 중앙 정렬 및 테마 설정을 포괄합니다.

## Quick Start

### Prerequisites
- PC 데스크톱 환경 (Windows, macOS, Linux, ChromeOS)
- Google Chrome 브라우저 (Manifest V3 지원) 또는 크로미움(Chromium) 기반 데스크톱 브라우저 (예: Microsoft Edge, Brave, 네이버 웨일)
  - *참고: 안드로이드(Android) 및 아이폰(iOS)용 모바일 브라우저 앱은 확장 프로그램을 지원하지 않아 사용할 수 없습니다.*

### Installation
1. Chrome 주소창에 `chrome://extensions` 입력 후 이동합니다.
2. 우측 상단 **개발자 모드**를 켭니다.
3. **압축해제된 확장 프로그램을 로드합니다**를 클릭합니다.
4. 이 폴더(`Chrome Resizer Extension`)를 선택합니다.
5. 브라우저 툴바에 추가된 리사이저 아이콘을 클릭해 사용합니다.

### Basic Usage

#### 팝업에서
- 프리셋 항목을 클릭하면 해당 크기가 즉시 적용됩니다.
- 각 프리셋 우측의 `×` 버튼으로 삭제할 수 있습니다.
- **커스텀 크기** 섹션에서 너비·높이를 입력하고 **적용**을 누르거나, **프리셋에 저장** 버튼으로 프리셋 목록에 추가할 수 있습니다.
- **창을 화면 중앙에 배치** 옵션을 켜면 리사이즈 시 창이 기본 디스플레이 중앙으로 이동합니다.
- **프리셋 기본값 복원**을 누르면 커스텀 항목을 지우고 기본 프리셋으로 되돌립니다.

#### 단축키로
- `Alt+Shift+1` → 프리셋 1번 적용
- `Alt+Shift+2` → 프리셋 2번 적용
- `Alt+Shift+3` → 프리셋 3번 적용

단축키를 바꾸려면 `chrome://extensions/shortcuts`에서 수정할 수 있습니다.

## Documentation

### 주요 기능
- **프리셋 리사이즈** — 기본 프리셋(1280×720, 1440×900, 1920×1080, 375×667, 768×1024) 기본 제공
- **커스텀 해상도** — 원하는 너비·높이를 직접 입력해 적용하거나 프리셋으로 저장
- **설정 동기화** — `chrome.storage.sync`로 프리셋과 옵션을 계정 간 동기화
- **다크 모드** — 시스템 설정에 따라 팝업 테마 자동 전환

### 파일 구조
```text
Chrome Resizer Extension/
├── manifest.json        # 확장 프로그램 매니페스트 (MV3)
├── background.js        # 서비스 워커 — 단축키 처리, 기본 프리셋 초기화
├── popup.html           # 툴바 팝업 UI
├── popup.css            # 팝업 스타일 (라이트/다크 테마)
├── popup.js             # 팝업 로직 — 프리셋, 커스텀 크기, 저장
├── icons/               # 확장 아이콘 (16/32/48/128)
└── scripts/make-icons.js # 아이콘 재생성 스크립트 (의존성 없음)
```

### 이슈 트래커
기타 문의 사항이나 버그 리포트, 기능 제안은 [GitHub Issues](https://github.com/kanjseok/chrome-resizer-extension/issues)를 이용해 주세요.

## Contributing

자세한 기여 방법은 [Contributing Guide](CONTRIBUTING.md)를 참고하세요.

## License

이 프로젝트는 [MIT License](LICENSE)의 적용을 받습니다.

## Author

**KANJSEOK**
- **이메일**: [kanjseok@gmail.com](mailto:kanjseok@gmail.com)
- **공식 저장소**: [https://github.com/kanjseok/chrome-resizer-extension.git](https://github.com/kanjseok/chrome-resizer-extension.git)
