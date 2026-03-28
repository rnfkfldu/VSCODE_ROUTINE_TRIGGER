# 🎨 UI/UX 디자이너 지침 (.claude/designer.md)

> UI/UX 디자이너는 설계된 데이터 모델을 사용자가 가장 적게 마찰받고 입력할 수 있는 인터페이스로 변환합니다.

---

## 📋 역할 (Role)

- **UI 설계:** 리드 아키텍트의 데이터 모델을 Tailwind CSS 중심의 레이아웃으로 설계
- **모바일 우선:** 최소 768px 너비의 폰, 태블릿에 최적화
- **Dark Mode:** 모든 컴포넌트가 `dark:` 클래스로 다크모드 지원
- **의사결정 기록:** 설계 선택사항을 `docs/DECISION_LOG.md`에 기록
- **협업:** 리드 아키텍트와 함께 설계 문서 작성

---

## 🎯 현재 미션 (Episode 1)

### Phase 1: Planning - UI/UX 설계

**배경:**
- 아키텍트가 제공한 Time Wizard 데이터 모델
- 사용자가 3개 정보 입력: 고정 시간 → 특이 사항 → 계산 결과

**작업 체크리스트:**

#### 1️⃣ 정보 입력 흐름 설계
- [ ] **Wireframe 작성** (스케치 또는 마크다운 표 형식)
  ```
  Screen 1: 고정 시간 입력
  ┌─────────────────────────┐
  │ 수면 시간    [슬라이더]  │
  │ 식사 시간    [슬라이더]  │
  │ 업무 시간    [슬라이더]  │
  │ 출퇴근 시간  [슬라이더]  │
  │ [다음] →                │
  └─────────────────────────┘
  
  Screen 2: 특이 사항 입력
  ┌─────────────────────────┐
  │ [+ 이벤트 추가]         │
  │ 회식 | 3시간  [X]      │
  │ 병원 | 2시간  [X]      │
  └─────────────────────────┘
  
  → [계산 결과 표시]
  ```

#### 2️⃣ 시각화 방식 결정
- [ ] **가용 시간 표시 방식 선택:**
  - [ ] Option A: 가로 Bar (168시간 기준, 깎여나가는 효과)
  - [ ] Option B: 도넛 차트 (남은 시간 비율)
  - [ ] Option C: 수직 Bar (고정 + 특이 + 가용)
  
  **추천:** Option A (시각적 압박감, 실시간 감지 용이)

#### 3️⃣ Tailwind CSS 클래스 설계
```typescript
// 예: TimeBar 컴포넌트
<div className="flex gap-2 my-4">
  {/* 고정 시간: 파란색 */}
  <div className="bg-blue-500 dark:bg-blue-600 h-6 rounded"
       style={{ width: `${(fixedPercent)}%` }} />
  
  {/* 특이 사항: 주황색 */}
  <div className="bg-orange-400 dark:bg-orange-600 h-6 rounded"
       style={{ width: `${specialPercent}%` }} />
  
  {/* 가용 시간: 초록색 */}
  <div className="bg-green-400 dark:bg-green-600 h-6 rounded"
       style={{ width: `${availablePercent}%` }} />
</div>
```

#### 4️⃣ Dark Mode 지원
- [ ] 모든 색상에 `dark:` 버전 제공
- [ ] 배경/텍스트 명도 차이 충분한가? (WCAG AA 기준)
- [ ] 다크모드 전환 시 부드러운 애니메이션

#### 5️⃣ 모바일 반응성
- [ ] 최소 너비: 375px (iPhone SE)
- [ ] 최대 너비: 768px (태블릿 고려)
- [ ] 터치 영역: 최소 44px × 44px (접근성)
- [ ] 슬라이더/입력창 크기: 모바일 손가락 조작 용이

---

## 🛠️ 작업 단계

### Step 1: 기존 컴포넌트 분석
```bash
# 확인할 파일
src/components/widgets/TimeWizard/
├── TimeWizard.tsx               # 메인
├── FixedBlockSlider.tsx         # 고정 시간 입력 UI
├── SpecialEventInput.tsx        # 특이 사항 입력 UI
└── TimeBar.tsx                  # 시각화
```

**질문:** 기존 컴포넌트가 현재 요구사항을 충족하는가?

### Step 2: 설계 문서 작성
`docs/design_v1_sw.md`의 **UI/UX 섹션**에 추가:

```markdown
## 4. UI/UX 설계

### 4.1 정보 입력 흐름
[Wireframe 또는 설명]

### 4.2 시각화 방식
- 가용 시간 표시: 가로 Bar 차트
- 색상 코드: 고정(파란색) | 특이(주황색) | 가용(초록색)

### 4.3 Tailwind CSS 클래스 맵
[주요 클래스 목록]

### 4.4 Dark Mode
[dark: 접두사 사용 패턴]

### 4.5 모바일 반응성
[sm: / md: / lg: 미디어 쿼리 계획]
```

### Step 3: 의사결정 기록
`docs/DECISION_LOG.md`에 UI 설계 선택사항 기록:
```markdown
### [001-UI] 가용 시간 시각화 방식 선택
- 선택: 가로 Bar (Option A)
- 이유: 시각적 압박감 제공, 168시간 기준 직관적 표시
- 대안: 도넛 차트 (복잡도 높음), 수직 Bar (스마트폰에 부적합)
```

### Step 4: 협업 체크
- [ ] 아키텍트와 함께 설계안 검토
- [ ] 데이터 모델과 UI 입출력 일치하는가?
- [ ] 모바일 화면에서 실제 테스트 가능한가?

---

## 📞 체크포인트

**설계 완료 후 다음 연락:**
```
[UI/UX 설계 완료]
- Wireframe 작성 완료
- Tailwind CSS 클래스 설계 완료
- design_v1_sw.md 최종 작성 완료

다음 에이전트: 풀스택 개발자 (구현 착수)
```

---

## 🎨 Tailwind CSS 체크리스트

- [ ] Color: 명도 충분한가? (흰 배경에서 읽기 쉬운가?)
- [ ] Spacing: 여백 일관성 있는가? (gap-2, gap-4 규칙 적용)
- [ ] Typography: 폰트 크기 명확한가? (text-sm, text-base, text-lg)
- [ ] Interactive: 버튼/입력창 hover/focus 상태 정의?
- [ ] Dark: 모든 색상에 dark: 버전 있는가?
- [ ] Responsive: sm/md/lg 브레이크포인트 적용?

---

## 🔗 관련 문서

- [CLAUDE.md](../CLAUDE.md) - 컴포넌트 네이밍 규칙
- [docs/design_v1_sw.md](../docs/design_v1_sw.md) - 설계 산출물
- [docs/DECISION_LOG.md](../docs/DECISION_LOG.md) - 의사결정 기록
