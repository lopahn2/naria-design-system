import fs from 'node:fs/promises';

export async function thirdPartyNotices(){
 const packages=['@radix-ui/react-icons','react','react-dom','scheduler','lucide-react','motion','framer-motion','motion-dom','motion-utils','clsx','class-variance-authority','tailwind-merge','tailwindcss','tslib'];
 const licenses=await Promise.all(packages.map(async name=>{
  const file=(await fs.readdir(`node_modules/${name}`)).find(f=>/^license(?:\.(?:md|txt))?$/i.test(f));
  if(!file)throw Error(`Missing license: ${name}`);
  return `## ${name}\n\n${await fs.readFile(`node_modules/${name}/${file}`,'utf8')}`;
 }));
 for(const name of ['SmoothUI','KokonutUI','Inter'])licenses.push(`## ${name}\n\n${await fs.readFile(`references/${name}-LICENSE.txt`,'utf8')}`);
 licenses.push(`## IBM Plex Sans KR\n\n${await fs.readFile('packages/ui/fonts/LICENSE','utf8')}`);
 return `# Third-party notices\n\nThis comparison gallery adapts the 82 examples listed at https://designbookmark.com/motion on 2026-11-14. Each sample retains its source URL. Original files and SHA-256 hashes are included in references/. Adaptations cover offline packaging, theme controls, a teal palette, and demo-only state.\n\nDesignBookmark: https://designbookmark.com/motion . Its Command button source explicitly declares MIT. No separate license declaration was found in the other 50 supplied HTML examples; no additional redistribution license is asserted for those examples. Review upstream terms before production redistribution.\n\nKokonut UI: https://github.com/kokonut-labs/kokonutui (MIT). SmoothUI: https://github.com/educlopez/smoothui (MIT). Inter Latin variable font: @fontsource-variable/inter 5.3.0, https://github.com/rsms/inter (SIL OFL 1.1). Icons are original upstream SVGs and Lucide, with downloaded Radix assets retained in src/assets/icons/radix/LICENSE. No proprietary Apple font or icon set is bundled.\n\n${licenses.join('\n\n')}`;
}
