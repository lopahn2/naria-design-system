import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import * as UI from '../../packages/ui/src';
import '../../packages/ui/src/styles.css';
function RegressionCases(){
 const [removeTab,setRemoveTab]=useState(false),[removeNode,setRemoveNode]=useState(false),[tab,setTab]=useState('a'),[node,setNode]=useState('a'),[valid,setValid]=useState(false),[option,setOption]=useState('');
 return <UI.NariaProvider><UI.Container><UI.Stack gap={24}><h1>동적 상태 회귀 검사</h1><UI.Card title="선택한 탭 제거"><UI.Button onClick={()=>setRemoveTab(true)}>선택 탭 제거</UI.Button><UI.Tabs label="회귀 탭" value={tab} onValueChange={setTab} items={[...!removeTab?[{value:'a',label:'첫 탭',content:'첫 내용'}]:[],{value:'b',label:'남은 탭',content:'복구된 탭 내용'}]}/></UI.Card><UI.Card title="현재 트리 노드 제거"><UI.Button onClick={()=>setRemoveNode(true)}>현재 노드 제거</UI.Button><UI.Tree label="회귀 트리" value={node} onValueChange={setNode} nodes={[...!removeNode?[{id:'a',label:'첫 노드'}]:[],{id:'b',label:'남은 노드'}]}/></UI.Card><UI.Card title="이미지 로딩 실패 후 새 주소"><UI.Button onClick={()=>setValid(true)}>정상 이미지로 변경</UI.Button><UI.Avatar name="테스트 아바타" src={valid?'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXsAAAAASUVORK5CYII=':'data:image/png;base64,invalid'}/></UI.Card><UI.Card title="첫 옵션이 비활성인 검색 선택"><UI.Combobox label="담당자" value={option} onValueChange={setOption} options={[{value:'archived',label:'마감된 담당자',disabled:true},{value:'available',label:'선택 가능한 담당자'}]}/><p role="status">선택값: {option||'없음'}</p></UI.Card></UI.Stack></UI.Container></UI.NariaProvider>
}
createRoot(document.querySelector('#root')!).render(<RegressionCases/>);
