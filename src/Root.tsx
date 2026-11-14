import { useEffect, useState } from "react";
import { App as Atlas } from "./App";
import { SystemApp } from "./system/SystemApp";
const legacy = new Set([
  "all",
  "board",
  "sources",
  "skills",
  "tokens",
  "quality",
  "motion-lab",
  "actions",
  "typography",
  "inputs",
  "cards",
  "navigation",
  "feedback",
  "motion",
  "icons",
]);
export function Root() {
  const [hash, setHash] = useState(() => location.hash.slice(1));
  useEffect(() => {
    const fn = () => setHash(location.hash.slice(1));
    addEventListener("hashchange", fn);
    return () => removeEventListener("hashchange", fn);
  }, []);
  return legacy.has(hash) ? (
    <>
      <a className="nds-atlas-return" href="#system">
        ← naria Design System
      </a>
      <Atlas />
    </>
  ) : (
    <SystemApp />
  );
}
