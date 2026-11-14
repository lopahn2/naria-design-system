export const SCHEMA_VERSION = 1;
export interface Selection { id: string; note: string; }
export function parseSelection(raw: unknown, validIds: readonly string[]): Selection[] {
  const data: unknown = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!data || typeof data !== 'object' || !('schemaVersion' in data) || data.schemaVersion !== SCHEMA_VERSION || !('selections' in data) || !Array.isArray(data.selections)) throw new Error('naria 선택 파일 형식이 아닙니다.');
  if (data.selections.length > validIds.length) throw new Error('선택 항목이 너무 많습니다.');
  const seen = new Set<string>();
  return data.selections.map((item: unknown) => {
    if (!item || typeof item !== 'object' || !('id' in item) || typeof item.id !== 'string' || !validIds.includes(item.id) || seen.has(item.id)) throw new Error('알 수 없거나 중복된 샘플이 있습니다.');
    if (!('note' in item) || typeof item.note !== 'string' || item.note.length > 2000) throw new Error('메모 형식을 확인해 주세요.');
    seen.add(item.id);
    return { id: item.id, note: item.note };
  });
}
export function selectionDocument(selections: readonly Selection[]) {
  return { schemaVersion: SCHEMA_VERSION, project: 'naria-cloud', stage: 'exploration', exportedAt: new Date().toISOString(), selections };
}
export function contrastRatio(hexA: string, hexB: string): number {
  const luminance = (h: string) => {
    if (!/^#[\da-f]{6}$/i.test(h)) throw new Error('6자리 HEX 색상이어야 합니다.');
    const rgb = h.slice(1).match(/.{2}/g)!.map(n=>parseInt(n,16)/255).map(n=>n<=0.04045?n/12.92:((n+0.055)/1.055)**2.4);
    return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722;
  };
  const a=luminance(hexA),b=luminance(hexB);
  return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
}
