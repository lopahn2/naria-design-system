import type { ReactNode } from "react";
import { Checkbox } from "./forms";
export function BottomCTA({
  children,
  description,
}: {
  children: ReactNode;
  description?: string;
}) {
  return (
    <div className="nds-bottom-cta">
      {description && <p>{description}</p>}
      <div>{children}</div>
    </div>
  );
}
export function Agreement({
  items,
  value,
  onValueChange,
  error,
}: {
  items: { id: string; label: string; required?: boolean; href?: string }[];
  value: string[];
  onValueChange: (v: string[]) => void;
  error?: string;
}) {
  const all = items.length > 0 && items.every((x) => value.includes(x.id));
  return (
    <fieldset className="nds-agreement">
      <legend className="nds-label">약관 동의</legend>
      <Checkbox
        label="모두 동의"
        checked={all}
        indeterminate={value.length > 0 && !all}
        onChange={() => onValueChange(all ? [] : items.map((x) => x.id))}
      />
      <div>
        {items.map((item) => (
          <div className="nds-between" key={item.id}>
            <Checkbox
              label={`${item.required ? "[필수]" : "[선택]"} ${item.label}`}
              checked={value.includes(item.id)}
              onChange={() =>
                onValueChange(
                  value.includes(item.id)
                    ? value.filter((x) => x !== item.id)
                    : [...value, item.id],
                )
              }
            />
            {item.href && (
              <a
                className="nds-link"
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${item.label} 보기 (새 창)`}
              >
                보기
              </a>
            )}
          </div>
        ))}
      </div>
      {error && (
        <p role="alert" className="nds-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
