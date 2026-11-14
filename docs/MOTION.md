# Motion collection · v0.2

확인일: 2026-11-14 · 목록: https://designbookmark.com/motion

82개 전체 항목을 ID 기준으로 대응했습니다. DesignBookmark HTML 50개, DesignBookmark React 1개, Kokonut UI React 25개, SmoothUI React 6개입니다. 원본 파일과 해시는 `references/motion-originals/`, `references/motion-integrity.json`에 남겼습니다. HTML의 CSS/JS 의존성 103개는 `references/motion-assets/`에 포함됩니다.

## 적용 범위

- 원본 모션 구현을 사용합니다. 브랜드 화면 자체를 복제한 것은 아닙니다.
- 보라·바이올렛·푸크시아·인디고 계열을 청록으로 조정했습니다.
- React 샘플에는 테마, 로컬 상태, 버튼·카드 프리미티브 어댑터를 연결했습니다. 원본 아이콘은 유지했습니다.
- Siri orb 상태 선택, 작업 목록 진행, 명령 버튼, 서명 패드, 음악 재생 UI 등에 데모 상태를 제공합니다.
- 외부 폰트 요청을 제거하고 Inter Latin variable 100–900을 내장했습니다. 한국어는 시스템 폰트를 사용합니다.
- 샘플은 독립 iframe에서 실행합니다. 화면에 보이는 샘플만 마운트하며 페이지당 12개를 표시합니다.
- 앱은 오프라인으로 실행됩니다. 원본 링크를 누를 때는 인터넷이 필요합니다.

## 사용

`deliverables/naria-motion-gallery.html` 열기 → 필터/검색 → 샘플 조작 → 크게 보기 → 즐겨찾기 또는 개별 HTML 다운로드.

모션 선택은 브라우저의 `naria:motion-picks:v1`에 저장됩니다. JSON 가져오기는 기존 선택과 병합하며 알려지지 않은 ID나 잘못된 형식은 거부합니다. 기기 사이 자동 동기화는 없습니다. 파일 URL의 저장 정책은 브라우저마다 다르므로 JSON을 함께 보관하세요.

## 명확한 한계

- AI, 음성, Face ID, 결제, 전송, 파일 업로드는 화면 데모입니다. API·결제·마이크·카메라를 연결하지 않습니다. 복사 버튼은 샌드박스에서 성공 상태만 보여줄 수 있습니다.
- 모션 감소는 자동 재생을 끄고 CSS 및 지원되는 스프링 전환을 단순화합니다. 원본의 일부 반복 루프나 직접 조작 애니메이션은 남습니다. 완전히 멈추려면 해당 샘플의 정지 버튼을 사용합니다.
- 샘플별 키보드·터치 지원은 원본에 따라 다릅니다. 모든 동작의 접근성을 검증한 제품용 컴포넌트 패키지는 아닙니다.
- 단일 HTML 안에 82개 구현을 포함하므로 Vite의 큰 청크 경고가 발생합니다. 배포용 제품으로 채택할 때는 필요한 컴포넌트만 분리하세요.
- Kokonut UI와 SmoothUI는 MIT이며 원문 라이선스를 포함했습니다. DesignBookmark Command button은 원본에 MIT가 명시되어 있습니다. 나머지 HTML 50개에는 별도 라이선스 선언을 찾지 못했으므로 해당 코드 전체를 MIT라고 표시하지 않습니다. 상용 재배포 전 원저작자의 조건을 확인하세요.

## 재생성 및 검사

```bash
npm ci
npm run build
npm test
node scripts/motion-qa.mjs
```

마지막 명령은 `dist/motion-check.html`에 임시 브라우저 렌더링 검사 페이지를 만듭니다. 정적 서버로 dist를 열면 라이트와 다크/모션 감소 조합 164개를 순차 검사합니다. 이 검사는 로딩·초기 실행 오류 검사이며 모든 제스처나 장시간 동작을 증명하지 않습니다. 실제 확인 결과는 `docs/VALIDATION.md`에 기록합니다.

## 전체 대응표

| ID | 모션 | 분류 | 출처 | 원본 |
| --- | --- | --- | --- | --- |
| M01 · `db-plan-switch` | Plan switch | Cards | DesignBookmark | [원본](https://designbookmark.com/motion-src/plan-switch/) |
| M02 · `db-letter-limit` | Letter limit | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/letter-limit/) |
| M03 · `db-pull-cord` | Pull cord | Buttons | DesignBookmark | [원본](https://designbookmark.com/motion-src/pull-cord/) |
| M04 · `db-morph-tooltip` | Morph tooltip | Navigation | DesignBookmark | [원본](https://designbookmark.com/motion-src/morph-tooltip/) |
| M05 · `db-spring-dropdown` | Spring dropdown | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/spring-dropdown/) |
| M06 · `db-file-drop` | File drop | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/file-drop/) |
| M07 · `db-morph-island` | Morph island | Cards | DesignBookmark | [원본](https://designbookmark.com/motion-src/morph-island/) |
| M08 · `db-goo-menu` | Goo menu | Buttons | DesignBookmark | [원본](https://designbookmark.com/motion-src/goo-menu/) |
| M09 · `db-jelly-slider` | Jelly slider | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/jelly-slider/) |
| M10 · `db-hold-button` | Hold to publish | Buttons | DesignBookmark | [원본](https://designbookmark.com/motion-src/hold-button/) |
| M11 · `db-swipe-deck` | Swipe deck | Cards | DesignBookmark | [원본](https://designbookmark.com/motion-src/swipe-deck/) |
| M12 · `db-springy-input` | Springy input | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/springy-input/) |
| M13 · `db-rubber-dock` | Rubber dock | Navigation | DesignBookmark | [원본](https://designbookmark.com/motion-src/rubber-dock/) |
| M14 · `db-parallax-ticket` | Parallax ticket | Cards | DesignBookmark | [원본](https://designbookmark.com/motion-src/parallax-ticket/) |
| M15 · `db-glass-lens` | Glass lens | Cards | DesignBookmark | [원본](https://designbookmark.com/motion-src/glass-lens/) |
| M16 · `db-pull-refresh` | Pull to refresh | Cards | DesignBookmark | [원본](https://designbookmark.com/motion-src/pull-refresh/) |
| M17 · `db-word-roll` | Word roll | Text | DesignBookmark | [원본](https://designbookmark.com/motion-src/word-roll/) |
| M18 · `db-weight-wave` | Weight wave | Text | DesignBookmark | [원본](https://designbookmark.com/motion-src/weight-wave/) |
| M19 · `db-goo-morph` | Goo morph | Text | DesignBookmark | [원본](https://designbookmark.com/motion-src/goo-morph/) |
| M20 · `db-scramble-text` | Scramble text | Text | DesignBookmark | [원본](https://designbookmark.com/motion-src/scramble-text/) |
| M21 · `db-read-along` | Read along | Text | DesignBookmark | [원본](https://designbookmark.com/motion-src/read-along/) |
| M22 · `db-roll-links` | Roll links | Text | DesignBookmark | [원본](https://designbookmark.com/motion-src/roll-links/) |
| M23 · `db-prompt-box` | Prompt box | AI | DesignBookmark | [원본](https://designbookmark.com/motion-src/prompt-box/) |
| M24 · `db-streaming-reply` | Streaming reply | AI | DesignBookmark | [원본](https://designbookmark.com/motion-src/streaming-reply/) |
| M25 · `db-ghost-suggestion` | Ghost suggestion | AI | DesignBookmark | [원본](https://designbookmark.com/motion-src/ghost-suggestion/) |
| M26 · `db-goo-thinking` | Goo thinking | AI | DesignBookmark | [원본](https://designbookmark.com/motion-src/goo-thinking/) |
| M27 · `db-expand-card` | Expand card | Cards | DesignBookmark | [원본](https://designbookmark.com/motion-src/expand-card/) |
| M28 · `db-fan-cards` | Fan cards | Cards | DesignBookmark | [원본](https://designbookmark.com/motion-src/fan-cards/) |
| M29 · `db-stat-card` | Stat card | Cards | DesignBookmark | [원본](https://designbookmark.com/motion-src/stat-card/) |
| M30 · `db-profile-card` | Profile card | Cards | DesignBookmark | [원본](https://designbookmark.com/motion-src/profile-card/) |
| M31 · `db-magnetic-button` | Magnetic button | Buttons | DesignBookmark | [원본](https://designbookmark.com/motion-src/magnetic-button/) |
| M32 · `db-loading-success` | Loading to success | Buttons | DesignBookmark | [원본](https://designbookmark.com/motion-src/loading-success/) |
| M33 · `db-copy-button` | Copy button | Buttons | DesignBookmark | [원본](https://designbookmark.com/motion-src/copy-button/) |
| M34 · `db-like-burst` | Like burst | Buttons | DesignBookmark | [원본](https://designbookmark.com/motion-src/like-burst/) |
| M35 · `db-tab-pill` | Tab pill | Navigation | DesignBookmark | [원본](https://designbookmark.com/motion-src/tab-pill/) |
| M36 · `db-bottom-bar` | Bottom bar | Navigation | DesignBookmark | [원본](https://designbookmark.com/motion-src/bottom-bar/) |
| M37 · `db-dynamic-menu` | Dynamic menu | Navigation | DesignBookmark | [원본](https://designbookmark.com/motion-src/dynamic-menu/) |
| M38 · `db-segmented-control` | Segmented control | Navigation | DesignBookmark | [원본](https://designbookmark.com/motion-src/segmented-control/) |
| M39 · `db-sidebar-collapse` | Sidebar collapse | Navigation | DesignBookmark | [원본](https://designbookmark.com/motion-src/sidebar-collapse/) |
| M40 · `db-pagination-dots` | Pagination dots | Navigation | DesignBookmark | [원본](https://designbookmark.com/motion-src/pagination-dots/) |
| M41 · `db-command-palette` | Command palette | Navigation | DesignBookmark | [원본](https://designbookmark.com/motion-src/command-palette/) |
| M42 · `db-step-progress` | Step progress | Navigation | DesignBookmark | [원본](https://designbookmark.com/motion-src/step-progress/) |
| M43 · `db-otp-code` | OTP code | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/otp-code/) |
| M44 · `db-toggle-switch` | Toggle switch | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/toggle-switch/) |
| M45 · `db-star-rating` | Star rating | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/star-rating/) |
| M46 · `db-tag-input` | Tag input | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/tag-input/) |
| M47 · `db-number-stepper` | Number stepper | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/number-stepper/) |
| M48 · `db-range-slider` | Range slider | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/range-slider/) |
| M49 · `db-password-strength` | Password strength | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/password-strength/) |
| M50 · `db-checkbox-list` | Checkbox list | Inputs | DesignBookmark | [원본](https://designbookmark.com/motion-src/checkbox-list/) |
| M51 · `db-command-button` | Command button | Buttons | DesignBookmark | [원본](https://designbookmark.com/motion-src/react/command-button.tsx) |
| M52 · `detent-dial` | Detent dial | Inputs | Kokonut UI | [원본](https://kokonutui.com/docs/inputs/detent-dial) |
| M53 · `siri-orb` | Siri orb | AI | SmoothUI | [원본](https://smoothui.dev/docs/components/siri-orb) |
| M54 · `ai-loading` | Agent steps | AI | Kokonut UI | [원본](https://kokonutui.com/docs/ai/ai-loading) |
| M55 · `hold-button` | Hold button | Buttons | Kokonut UI | [원본](https://kokonutui.com/docs/buttons/hold-button) |
| M56 · `exposure-slider` | Exposure slider | Inputs | SmoothUI | [원본](https://smoothui.dev/docs/components/exposure-slider) |
| M57 · `boarding-pass` | Boarding pass | Cards | Kokonut UI | [원본](https://kokonutui.com/docs/cards/boarding-pass) |
| M58 · `marker-text` | Marker text | Text | Kokonut UI | [원본](https://kokonutui.com/docs/texts/marker-text) |
| M59 · `smooth-tab` | Smooth tab | Navigation | Kokonut UI | [원본](https://kokonutui.com/docs/navigation/smooth-tab) |
| M60 · `unlock-face-id` | Unlock Face ID | Cards | SmoothUI | [원본](https://smoothui.dev/docs/components/unlock-face-id) |
| M61 · `slide-to-confirm` | Slide to confirm | Buttons | Kokonut UI | [원본](https://kokonutui.com/docs/buttons/slide-to-confirm) |
| M62 · `notification-stack` | Notification stack | Cards | Kokonut UI | [원본](https://kokonutui.com/docs/cards/notification-stack) |
| M63 · `wheel-picker` | Wheel picker | Inputs | Kokonut UI | [원본](https://kokonutui.com/docs/inputs/wheel-picker) |
| M64 · `dynamic-text` | Dynamic text | Text | Kokonut UI | [원본](https://kokonutui.com/docs/texts/dynamic-text) |
| M65 · `ai-voice` | Voice input | AI | Kokonut UI | [원본](https://kokonutui.com/docs/ai/ai-voice) |
| M66 · `ai-tool-approval` | Tool approval | AI | Kokonut UI | [원본](https://kokonutui.com/docs/ai/ai-tool-approval) |
| M67 · `toolbar` | Toolbar | Navigation | Kokonut UI | [원본](https://kokonutui.com/docs/navigation/toolbar) |
| M68 · `scrubber` | Scrubber | Inputs | SmoothUI | [원본](https://smoothui.dev/docs/components/scrubber) |
| M69 · `cart-button` | Cart button | Cards | Kokonut UI | [원본](https://kokonutui.com/docs/buttons/cart-button) |
| M70 · `page-flip` | Page flip | Cards | Kokonut UI | [원본](https://kokonutui.com/docs/cards/page-flip) |
| M71 · `signature-pad` | Signature pad | Inputs | Kokonut UI | [원본](https://kokonutui.com/docs/inputs/signature-pad) |
| M72 · `undo-button` | Undo button | Buttons | Kokonut UI | [원본](https://kokonutui.com/docs/buttons/undo-button) |
| M73 · `card-field` | Card field | Inputs | Kokonut UI | [원본](https://kokonutui.com/docs/inputs/card-field) |
| M74 · `stack-panel` | Stack panel | Navigation | Kokonut UI | [원본](https://kokonutui.com/docs/navigation/stack-panel) |
| M75 · `type-writer` | Typewriter | Text | Kokonut UI | [원본](https://kokonutui.com/docs/texts/type-writer) |
| M76 · `ai-text-loading` | Thinking text | AI | Kokonut UI | [원본](https://kokonutui.com/docs/ai/ai-text-loading) |
| M77 · `liquid-glass-card` | Glass player | Cards | Kokonut UI | [원본](https://kokonutui.com/docs/cards/liquid-glass-card) |
| M78 · `bell-button` | Bell button | Buttons | Kokonut UI | [원본](https://kokonutui.com/docs/buttons/bell-button) |
| M79 · `morph-popover` | Morph popover | Buttons | Kokonut UI | [원본](https://kokonutui.com/docs/buttons/morph-popover) |
| M80 · `ai-task-list` | Task list | AI | SmoothUI | [원본](https://smoothui.dev/docs/components/ai-task-list) |
| M81 · `music-toggle` | Music toggle | Buttons | SmoothUI | [원본](https://smoothui.dev/docs/components/music-toggle) |
| M82 · `command-button` | Command button | Buttons | Kokonut UI | [원본](https://kokonutui.com/docs/buttons/command-button) |
