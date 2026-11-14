import { useState } from "react";
import { CheckIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import * as UI from "../../packages/ui/src";

export function PaletteChooser({ value, onChange }: { value: UI.PaletteName; onChange: (value: UI.PaletteName) => void }) {
  return <div className="nds-palette-grid" role="group" aria-label="두 가지 색상 시안">
    {UI.palettePresets.map((p,i) => <button type="button" className="nds-palette-choice" key={p.id} aria-pressed={value === p.id} onClick={() => onChange(p.id)}>
      <span className="nds-palette-card-top"><span>0{i+1} / {p.englishName}</span><span className="nds-palette-selected">{value === p.id ? <><CheckIcon aria-hidden /> 선택됨</> : "시안 선택"}</span></span>
      <span className="nds-palette-name">{p.name}</span>
      <span className="nds-palette-description">{p.description}</span>
      <span className="nds-palette-swatches" aria-hidden="true">{p.families.map(f => <span key={f.id} style={{background:f.shades[500],color:UI.paletteLabelColor(f.shades[500])}}>{f.name}</span>)}</span>
      <span className="nds-palette-card-footer">6가지 기준색 · 색별 5단계<span>500 / BASE</span></span>
    </button>)}
  </div>;
}

export function PaletteScales({ palette }: { palette: UI.PaletteName }) {
  const p=UI.palettePresets.find(p=>p.id===palette)!;
  const labels: Record<UI.PaletteStep,string>={100:"아주 연하게",300:"부드럽게",500:"기준색",700:"진하게",900:"아주 깊게"};
  return <div className="nds-palette-scales" aria-label={`${p.name} 6색 팔레트`}>
    {p.families.map(f=><section className="nds-palette-family" key={f.id} aria-label={`${f.name} 색상 단계`}>
      <div className="nds-palette-family-title"><strong>{f.name}</strong><code>{f.id}</code></div>
      <div className="nds-palette-ramp">{UI.paletteSteps.map(step=><div className="nds-palette-shade" key={step} style={{background:f.shades[step],color:UI.paletteLabelColor(f.shades[step])}}>
        <span>{step}<small>{labels[step]}</small></span><code>{f.shades[step].toUpperCase()}</code>
      </div>)}</div>
    </section>)}
    <p className="nds-hint">참고한 색감: {p.reference}. 각 기준색을 제품 UI에 맞춰 조정한 조합입니다.</p>
  </div>;
}

export function PaletteApplication() {
  const {palette,theme}=UI.useNaria();
  const preset=UI.palettePresets.find(p=>p.id===palette)!;
  const [name,setName]=useState("새로운 프로젝트"),[shared,setShared]=useState(true),[message,setMessage]=useState("");
  return <div className="nds-palette-application">
    <UI.Card title="읽고 쓰는 영역" description="입력·코드·콘텐츠는 공통 무채색 표면입니다.">
      <UI.Stack gap={18}>
        <UI.TextField label="프로젝트 이름" value={name} onChange={e=>setName(e.target.value)} />
        <div><span className="nds-label">코드 예제</span><pre className="nds-code-block">{`<NariaProvider palette="${palette}">\n  <App />\n</NariaProvider>`}</pre></div>
        <UI.Text size="small" muted>시안을 전환해도 배경과 글자의 기본 색은 그대로 유지됩니다.</UI.Text>
      </UI.Stack>
    </UI.Card>
    <UI.Card title="색으로 구분하는 포인트" description="주요 행동·선택·카테고리에만 색을 사용합니다.">
      <UI.Stack gap={22}>
        <UI.ButtonGroup label="팔레트 행동 예제"><UI.Button trailing={<ArrowRightIcon />} onClick={()=>setMessage(`${name || "프로젝트"}의 색상 적용을 확인했어요.`)}>프로젝트 시작</UI.Button><UI.Button variant="outline" onClick={()=>setMessage("미리 보기를 확인했어요.")}>미리 보기</UI.Button></UI.ButtonGroup>
        <UI.Switch label="팀과 공유하기" description="선택 상태는 포인트 색으로 표시해요." checked={shared} onCheckedChange={setShared} />
        <div><span className="nds-label">6가지 카테고리 포인트</span><div className="nds-palette-categories">{preset.families.map((f,i)=><span key={f.id}><i style={{background:f.shades[theme === "dark" ? 300 : 500]}} aria-hidden />{["기획","디자인","개발","콘텐츠","운영","리서치"][i]}</span>)}</div></div>
        <p className="nds-hint" role="status">{message || "버튼과 스위치를 눌러 실제 적용 상태를 확인하세요."}</p>
      </UI.Stack>
    </UI.Card>
  </div>;
}
