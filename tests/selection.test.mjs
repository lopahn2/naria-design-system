import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSelection, selectionDocument, contrastRatio } from '../src/lib/selection.ts';
const ids=['ACT-01','FDB-02'];
test('selection export/import preserves Korean and literal markup notes',()=>{
  const entries=[{id:'ACT-01',note:'글자 위계 <script>텍스트</script>가 좋아요.'},{id:'FDB-02',note:''}];
  assert.deepEqual(parseSelection(JSON.stringify(selectionDocument(entries)),ids),entries);
});
test('rejects malformed, unknown, duplicate, and unsupported imports',()=>{
  const invalid=[null,{}, {schemaVersion:2,selections:[]},{schemaVersion:1,selections:[{id:'unknown',note:''}]},{schemaVersion:1,selections:[{id:'ACT-01',note:''},{id:'ACT-01',note:''}]},{schemaVersion:1,selections:[{id:'ACT-01',note:42}]},{schemaVersion:1,selections:[{id:'ACT-01',note:'x'.repeat(2001)}]}];
  for(const data of invalid)assert.throws(()=>parseSelection(data,ids));
  assert.throws(()=>parseSelection('{bad json',ids));
});
test('contrast function matches black/white reference and candidate label pairs',()=>{
  assert.equal(contrastRatio('#000000','#ffffff'),21);
  assert.equal(contrastRatio('#ffffff','#ffffff'),1);
  for(const accent of ['#3558d4','#266851','#875344','#6d4eaa','#25282f','#e9bc4c']){
    const label=contrastRatio(accent,'#ffffff')>=4.5?'#ffffff':'#171b24';
    assert.ok(contrastRatio(accent,label)>=4.5);
  }
});
