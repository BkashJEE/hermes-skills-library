import React, { useEffect, useRef, useState } from "react";
import {
  host,
  ROUTES_AREA,
  SIDEBAR_NAV_AREA,
  PALETTE_AREA,
  Codicon,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@hermes/plugin-sdk";
const h = React.createElement;
const css = `
.hsl{height:100%;overflow:auto;color:var(--ui-text-primary,#eeedf2);background:var(--background,#141419);padding:32px clamp(20px,3vw,48px);font:14px/1.55 system-ui,sans-serif;box-sizing:border-box}.hsl *,.hsl-dialog,.hsl-dialog *{box-sizing:border-box}.hsl button,.hsl select,.hsl input,.hsl-dialog button,.hsl-dialog input{font:inherit;color:inherit}.hsl button,.hsl select,.hsl-dialog button{border:1px solid var(--ui-stroke-tertiary,#34343b);border-radius:7px;background:var(--ui-bg-quaternary,#24242b);padding:8px 13px;cursor:pointer}.hsl button:hover,.hsl-dialog button:hover{background:var(--chrome-action-hover,#303038)}.hsl button:disabled,.hsl-dialog button:disabled{opacity:.45;cursor:default}.hsl .primary,.hsl-dialog .primary{background:var(--ui-text-primary,#e9e8ed);color:var(--background,#18181e);border-color:transparent}.hsl .top{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}.hsl h1{font-size:29px;letter-spacing:-1px;font-weight:600;margin:0}.hsl h2,.hsl-dialog h2{font-size:22px;letter-spacing:-.5px;margin:8px 0}.hsl p,.hsl-dialog p{margin:5px 0;color:var(--ui-text-secondary,#b8b6c2)}.hsl .eyebrow{font-size:10px;letter-spacing:1.8px;color:var(--ui-text-tertiary,#a6a4b0);margin-bottom:7px}.hsl .target{width:210px}.hsl label,.hsl-dialog label{display:block;font-size:12px;margin-bottom:6px;color:var(--ui-text-secondary,#b8b6c2)}.hsl select{width:100%;min-height:38px}.hsl .toolbar{display:flex;align-items:center;gap:12px;margin:22px 0;flex-wrap:wrap}.hsl input,.hsl-dialog input{min-width:160px;background:transparent;border:1px solid var(--ui-stroke-tertiary,#34343b);border-radius:7px;padding:10px 12px}.hsl .search{flex:1;min-width:220px;display:flex;gap:10px;align-items:center;border-bottom:1px solid var(--ui-stroke-tertiary,#34343b)}.hsl .search input{width:100%;border:0;outline-offset:-2px;padding-left:0}.hsl .filters{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:24px}.hsl .source-filter{width:185px}.hsl .tabs{display:flex;gap:6px;flex-wrap:wrap}.hsl .tabs button{background:transparent;border-color:transparent;color:var(--ui-text-secondary,#b8b6c2)}.hsl .tabs .active{background:var(--ui-bg-quaternary,#292930);color:var(--ui-text-primary,#eeedf2)}.hsl .sections{display:flex;gap:28px;border-bottom:1px solid var(--ui-stroke-tertiary,#34343b);margin-top:28px}.hsl .sections button{border:0;border-radius:0;padding:14px 0;background:transparent;color:var(--ui-text-secondary,#aaa8b5);display:flex;gap:8px;align-items:center}.hsl .sections .active{color:var(--ui-text-primary,#eeedf2);box-shadow:0 2px 0 currentColor}.hsl .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,270px),1fr));gap:16px}.hsl .card{display:flex;flex-direction:column;min-height:192px;padding:22px;border:1px solid var(--ui-stroke-quaternary,#2c2b34);border-radius:12px;background:var(--card,#1c1c23);text-align:left;transition:border-color .15s}.hsl .card:hover{border-color:var(--ui-stroke-primary,#64616f)}.hsl .card-head{display:flex;gap:12px;align-items:center;min-width:0}.hsl .icon{display:grid;place-items:center;flex-shrink:0;width:36px;height:36px;background:var(--ui-bg-quaternary,#292931);border-radius:9px;color:var(--ui-text-secondary,#c5c0d5)}.hsl .name{font-weight:600;font-size:15px;line-height:1.4;overflow-wrap:anywhere}.hsl .source{font-size:11px;color:var(--ui-text-tertiary,#a6a4b0);margin-top:3px}.hsl .desc{font-size:13px;line-height:1.6;margin:16px 0 22px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:42px}.hsl .foot{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:auto}.hsl .foot button{font-size:12px;padding:5px 0;border:0;background:transparent}.hsl .badge{font-size:11px;color:var(--ui-text-secondary,#b8b6c2)}.hsl .green{color:var(--ui-success,#9ec8ad)}.hsl .amber{color:var(--ui-warning,#d5bb8c)}.hsl .notice,.hsl-dialog .notice{margin:14px 0;padding:14px;border:1px solid var(--ui-stroke-tertiary,#454550);border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}.hsl .error,.hsl-dialog .error{color:var(--ui-danger,#e7a1a1)}.hsl .empty{padding:64px 20px;text-align:center}.hsl-dialog{border-radius:12px;width:min(620px,calc(100vw - 32px));max-width:620px;max-height:88vh;overflow:auto;padding:28px;font:14px/1.6 system-ui,sans-serif;color:var(--ui-text-primary,#eeedf2);background:var(--background,#18181e)}.hsl-dialog pre{max-height:40vh;overflow:auto;font:12px/1.7 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;padding:18px;background:var(--ui-bg-quaternary,#22222a);border-radius:8px}.hsl-dialog .detail-actions{display:flex;gap:10px;margin:20px 0 0;align-items:center;flex-wrap:wrap}.hsl .muted,.hsl-dialog .muted{color:var(--ui-text-tertiary,#aaa8b5)}.hsl .counts{font-size:12px;margin:0 0 18px}.hsl .target-hint{font-size:10px;margin-top:6px}.hsl-dialog input{width:100%;margin:4px 0 12px}.hsl button:focus-visible,.hsl input:focus-visible,.hsl select:focus-visible,.hsl-dialog button:focus-visible,.hsl-dialog input:focus-visible{outline:2px solid var(--ui-accent,#b8aacd);outline-offset:3px}@media(min-width:1550px){.hsl .grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:650px){.hsl{padding:20px}.hsl .target{width:100%}.hsl .grid{grid-template-columns:1fr}.hsl .toolbar>button{flex:1}.hsl .search{flex-basis:100%}}
.hsl{container-type:inline-size;min-width:0;width:100%;overflow-x:hidden}
.hsl .top>div{min-width:0;max-width:100%}
.hsl .search{min-width:min(220px,100%)}
.hsl .search input{min-width:0;flex:1}
.hsl .source-filter{max-width:100%}.hsl .catalog-filters{display:flex;gap:10px;flex-wrap:wrap;max-width:100%}.hsl .author-filter{width:230px;max-width:100%}.hsl .catalog-filters select{flex:1;min-width:150px}@container(max-width:540px){.hsl .catalog-filters{width:100%}.hsl .catalog-filters select{min-width:0}}
.hsl .categories{margin:0 0 26px;min-width:0}
.hsl .clear-grouping{font-size:12px;margin:0 0 8px;padding:4px 8px;align-self:flex-start}.hsl .category-heading{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.hsl .category-heading h2{font-size:15px;letter-spacing:0;margin:0;font-weight:600}
.hsl .category-heading span{font-size:12px;color:var(--ui-text-tertiary,#aaa8b5)}
.hsl .category-picker{display:grid;grid-template-columns:34px minmax(0,1fr) 34px;gap:10px;align-items:center}
.hsl .category-arrow{display:grid;place-items:center;padding:9px 0;min-width:0}
.hsl .category-track{display:flex;gap:8px;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:none;padding:4px 3px;min-width:0}
.hsl .category-track::-webkit-scrollbar{display:none}
.hsl .category-chip{display:flex;align-items:center;gap:9px;flex-shrink:0;white-space:nowrap;border-radius:22px;background:transparent;font-size:12px;padding:9px 14px}
.hsl .chip-label{max-width:180px;overflow:hidden;text-overflow:ellipsis}.hsl .browse-modes button{display:flex;align-items:center;gap:7px;font-size:13px;padding:6px 10px}.hsl .category-chip.active{background:var(--ui-text-primary,#eeedf2);color:var(--background,#141419);border-color:transparent}
.hsl .category-chip .category-count{font-size:11px;opacity:.65;font-variant-numeric:tabular-nums}
.hsl .category-slider{display:block;width:100%;min-width:0;height:24px;margin:8px 0 0;padding:0;cursor:pointer;accent-color:var(--ui-accent,#b8aacd);border:0}
.hsl .grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,200px),1fr));gap:10px;align-items:stretch}
.hsl .card{min-width:0;min-height:0;height:180px;padding:10px;border-radius:10px;border-top:3px solid color-mix(in srgb,var(--card-accent,var(--ui-accent,#b8aacd)) 60%,var(--card,#1c1c23));background:linear-gradient(155deg,color-mix(in srgb,var(--card-accent,var(--ui-accent,#b8aacd)) 7%,var(--card,#1c1c23)),var(--card,#1c1c23) 75%);overflow:hidden;box-shadow:0 3px 10px #0000000a}
.hsl .card:hover{border-color:color-mix(in srgb,var(--card-accent,var(--ui-accent,#b8aacd)) 65%,var(--ui-stroke-primary,#64616f))}
.hsl .card-top{display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0;margin-bottom:12px}
.hsl .card-category{display:flex;align-items:center;gap:8px;min-width:0;font-size:11px;letter-spacing:.3px;color:var(--ui-text-secondary,#b8b6c2)}
.hsl .card-category span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hsl .card-kind{flex-shrink:0;font-size:9px;letter-spacing:1.2px;color:var(--ui-text-tertiary,#aaa8b5);text-transform:uppercase}
.hsl .card-head{display:flex;align-items:flex-start;gap:10px;min-width:0}.hsl .card-heading{min-width:0;flex:1}.hsl .item-icon{display:grid;place-items:center;flex-shrink:0;width:30px;height:30px;border-radius:7px;color:var(--card-accent);background:color-mix(in srgb,var(--card-accent) 12%,transparent)}.hsl .item-icon .codicon{font-size:20px}.hsl .card-meta{font-size:10px;color:var(--ui-text-tertiary,#aaa8b5);margin-top:6px;overflow-wrap:anywhere}.hsl .brief{margin:10px 0 12px;padding:0;list-style:none;font-size:12px;line-height:1.45;color:var(--ui-text-secondary,#b8b6c2)}.hsl .brief li{position:relative;padding-left:11px;margin:4px 0}.hsl .brief li:before{content:"•";position:absolute;left:0;color:var(--card-accent)}.hsl .brief li span{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;overflow-wrap:anywhere}
.hsl .name{font-size:15px;line-height:1.3;letter-spacing:-.15px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:0;margin:0;font-weight:600}
.hsl .source{margin-top:5px;overflow-wrap:anywhere}
.hsl .desc{min-height:0;margin:12px 0 14px;line-height:1.5;-webkit-line-clamp:4;overflow-wrap:anywhere}
.hsl .foot{min-width:0;flex-wrap:wrap;gap:10px;padding-top:2px}
.hsl .foot button{display:flex;align-items:center;gap:7px;flex-shrink:0;font-size:12px}
.hsl .badge{overflow-wrap:anywhere}
@media(min-width:1550px){.hsl .grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,200px),1fr))}}
@container(max-width:540px){.hsl .grid{grid-template-columns:minmax(0,1fr)}.hsl .top{gap:16px}.hsl .target{width:100%}.hsl .toolbar>button{flex:1}.hsl .search{flex-basis:100%}.hsl .source-filter{width:100%}.hsl .card{min-height:0}.hsl .category-picker{gap:6px}}


.hsl{display:flex;flex-direction:column;overflow:hidden;min-height:0;padding-bottom:0}
.hsl .library-header{flex-shrink:0;min-width:0;background:var(--background,#141419);padding-bottom:12px;border-bottom:1px solid var(--ui-stroke-tertiary,#34343b)}
.hsl .library-results{flex:1;min-height:0;min-width:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior-y:contain;scrollbar-gutter:stable;padding:16px 8px 24px 0}
/* A floating thumb: no track, border, corner box, or arrow buttons. */
.hsl .library-results::-webkit-scrollbar{width:8px}
.hsl .library-results::-webkit-scrollbar-track,.hsl .library-results::-webkit-scrollbar-corner{background:transparent;border:0;box-shadow:none}
.hsl .library-results::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--ui-text-secondary,#b8b6c2) 28%,transparent);border:2px solid transparent;background-clip:padding-box;border-radius:999px}
.hsl .library-results:hover::-webkit-scrollbar-thumb{background-color:color-mix(in srgb,var(--ui-text-secondary,#b8b6c2) 48%,transparent)}
.hsl .library-results::-webkit-scrollbar-thumb:hover,.hsl .library-results::-webkit-scrollbar-thumb:active{background-color:var(--ui-accent,#62d1e3)}
.hsl .library-results::-webkit-scrollbar-button{display:none;width:0;height:0}
@supports not selector(::-webkit-scrollbar){.hsl .library-results{scrollbar-width:thin;scrollbar-color:var(--ui-text-tertiary,#777783) transparent}}

.hsl .library-results:focus-visible{outline:2px solid var(--ui-accent,#b8aacd);outline-offset:-2px}
.hsl .counts{margin-bottom:0}
.hsl{padding-top:20px}
.hsl .sections{margin-top:10px}
.hsl .sections button{padding:9px 0}
.hsl .toolbar{margin:10px 0}
.hsl .filters{margin-bottom:10px}
.hsl .category-heading{margin-bottom:6px}
.hsl .category-slider{height:18px;margin-top:4px}
.hsl .categories{margin-bottom:8px}
.hsl select{color-scheme:dark;background-color:var(--ui-bg-quaternary,#24242b);color:var(--ui-text-primary,#eeedf2)}
.hsl select option,.hsl select optgroup{background-color:var(--ui-bg-quaternary,#24242b);color:var(--ui-text-primary,#eeedf2)}
.hsl .item-icon{color:var(--icon-color);background:color-mix(in srgb,var(--icon-color) 16%,transparent)}
@container(max-width:540px){.hsl .top{gap:8px}.hsl .eyebrow,.hsl .top p{display:none}.hsl h1{font-size:23px}.hsl .target{display:flex;align-items:center;gap:10px}.hsl .target label{margin:0}.hsl .target select{flex:1;min-width:0}.hsl .sections{margin-top:8px}.hsl .sections button{padding:8px 0}.hsl .toolbar{margin:10px 0;gap:8px}.hsl .filters{gap:8px;margin-bottom:10px}.hsl .source-filter{width:auto;flex:1;min-width:120px}.hsl .category-heading{margin-bottom:6px}.hsl .category-heading span{display:none}.hsl .categories{margin-bottom:8px}.hsl .library-header{padding-bottom:8px}}
@media(max-height:650px) and (min-width:651px){.hsl{padding-top:14px}.hsl .eyebrow,.hsl .top p{display:none}.hsl .sections{margin-top:6px}.hsl .sections button{padding:8px 0}.hsl .toolbar{margin:8px 0}.hsl .filters{margin-bottom:8px}.hsl .categories{margin-bottom:8px}}

.hsl .card-summary{display:block;flex-shrink:0;margin:10px 0 12px;min-width:0}
.hsl .summary-label{display:block;font-size:10px;font-weight:600;letter-spacing:.25px;color:var(--ui-text-secondary,#b8b6c2);margin-bottom:5px}
.hsl .summary-points{display:grid;gap:5px;min-height:38px;min-width:0}
.hsl .summary-point{display:flex;align-items:flex-start;gap:7px;min-width:0;font-size:13px;line-height:1.45;color:var(--ui-text-primary,#eeedf2)}
.hsl .summary-dot{flex:0 0 5px;color:var(--card-accent)}
.hsl .summary-text{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;overflow-wrap:anywhere;min-width:0}

.hsl .card-head{gap:8px;flex-shrink:0}
.hsl .item-icon{width:26px;height:26px;border-radius:6px}
.hsl .item-icon svg{width:17px;height:17px}
.hsl .item-icon .codicon{font-size:18px}
.hsl .name{display:block;white-space:nowrap;text-overflow:ellipsis;font-size:14px;line-height:1.25}
.hsl .source{margin-top:2px;font-size:10px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hsl .card-summary{margin:6px 0;flex-shrink:0}
.hsl .summary-label{font-size:10px;line-height:1.2;margin-bottom:4px}
.hsl .summary-points{min-height:0;gap:3px}
.hsl .summary-point{font-size:12px;line-height:1.35;gap:5px}
.hsl .foot{flex-wrap:nowrap;gap:6px;padding-top:0;flex-shrink:0}
.hsl .foot button{font-size:11px;line-height:1.3;padding:6px 4px;min-height:32px;gap:5px}
.hsl .foot .badge{font-size:10px;line-height:1.3;min-width:0}

.hsl .project-link,.hsl-dialog .project-link{display:inline-flex;align-items:center;gap:7px;color:inherit;text-decoration:none;font-size:12px;min-height:32px;padding:6px 8px;border-radius:6px;border:1px solid var(--ui-stroke-tertiary,#34343b)}
.hsl .project-link:hover,.hsl-dialog .project-link:hover{background:var(--chrome-action-hover,#303038)}
.hsl .project-link:focus-visible,.hsl-dialog .project-link:focus-visible{outline:2px solid var(--ui-accent,#b8aacd);outline-offset:3px}
.hsl .community-sort{width:160px}.hsl .community-summary{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}.hsl .community-summary button{padding:4px 8px;font-size:12px}
.hsl .community-intro{display:flex;align-items:center;gap:10px;margin-bottom:16px;color:var(--ui-accent,#b8aacd)}.hsl .community-intro p{font-size:13px}
.hsl .community-grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))}
.hsl .community-card{height:196px;padding:14px;transition:transform .15s,border-color .15s}.hsl .community-card:hover{transform:translateY(-2px)}
.hsl .community-card .item-icon{width:32px;height:32px;box-shadow:inset 0 1px 0 #ffffff30,0 3px 6px #0003;background:linear-gradient(145deg,color-mix(in srgb,var(--icon-color) 35%,transparent),color-mix(in srgb,var(--icon-color) 12%,transparent))}
.hsl .project-category{font-size:10px;color:var(--card-accent);margin-top:10px}.hsl .project-description{font-size:13px;line-height:1.45;margin:5px 0 8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.hsl .community-bottom{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-top:20px}.hsl .community-bottom p{font-size:12px;max-width:640px}.community-detail li{margin-bottom:10px}.community-detail .detail-actions .project-link{background:var(--ui-bg-quaternary,#24242b)}
@media(prefers-reduced-motion:reduce){.hsl .community-card{transition:none}.hsl .community-card:hover{transform:none}}
@container(max-width:540px){.hsl .community-sort{width:100%}.hsl.community .top>.project-link{font-size:11px}.hsl .sections{gap:22px}.hsl .community-intro{margin-bottom:10px}}

`;
const title = (name) =>
  String(name)
    .split(/[-_]/)
    .filter(Boolean)
    .map(
      (w) =>
        ({
          ai: "AI",
          ui: "UI",
          ux: "UX",
          cli: "CLI",
          pdf: "PDF",
          openai: "OpenAI",
          chatgpt: "ChatGPT",
          api: "API",
          sdk: "SDK",
          mcp: "MCP",
          github: "GitHub",
          openclaw: "OpenClaw",
          adobe: "Adobe",
          "1password": "1Password",
        })[w.toLowerCase()] || w[0].toUpperCase() + w.slice(1),
    )
    .join(" ");
const icon = (name) => h(Codicon, { name, "aria-hidden": true });
// Brand paths from locally available Simple Icons; see THIRD_PARTY_NOTICES.md.
const BRAND_PATHS = {
  "1password":
    "M12 .007C5.373.007 0 5.376 0 11.999c0 6.624 5.373 11.994 12 11.994S24 18.623 24 12C24 5.376 18.627.007 12 .007Zm-.895 4.857h1.788c.484 0 .729.002.914.096a.86.86 0 0 1 .377.377c.094.185.095.428.095.912v6.016c0 .12 0 .182-.015.238a.427.427 0 0 1-.067.137.923.923 0 0 1-.174.162l-.695.564c-.113.092-.17.138-.191.194a.216.216 0 0 0 0 .15c.02.055.078.101.191.193l.695.565c.094.076.14.115.174.162.03.042.053.087.067.137a.936.936 0 0 1 .015.238v2.746c0 .484-.001.727-.095.912a.86.86 0 0 1-.377.377c-.185.094-.43.096-.914.096h-1.788c-.484 0-.726-.002-.912-.096a.86.86 0 0 1-.377-.377c-.094-.185-.095-.428-.095-.912v-6.016c0-.12 0-.182.015-.238a.437.437 0 0 1 .067-.139c.034-.047.08-.083.174-.16l.695-.564c.113-.092.17-.138.191-.194a.216.216 0 0 0 0-.15c-.02-.055-.078-.101-.191-.193l-.695-.565a.92.92 0 0 1-.174-.162.437.437 0 0 1-.067-.139.92.92 0 0 1-.015-.236V6.25c0-.484.001-.727.095-.912a.86.86 0 0 1 .377-.377c.186-.094.428-.096.912-.096z",
  figma:
    "M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z",
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  gitlab:
    "m23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z",
  docker:
    "M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z",
  react:
    "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z",
  vercel: "m12 1.608 12 20.784H0Z",
  discord:
    "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",
  telegram:
    "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  zoom: "M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z",
  notion:
    "M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z",
  obsidian:
    "M19.355 18.538a68.967 68.959 0 0 0 1.858-2.954.81.81 0 0 0-.062-.9c-.516-.685-1.504-2.075-2.042-3.362-.553-1.321-.636-3.375-.64-4.377a1.707 1.707 0 0 0-.358-1.05l-3.198-4.064a3.744 3.744 0 0 1-.076.543c-.106.503-.307 1.004-.536 1.5-.134.29-.29.6-.446.914l-.31.626c-.516 1.068-.997 2.227-1.132 3.59-.124 1.26.046 2.73.815 4.481.128.011.257.025.386.044a6.363 6.363 0 0 1 3.326 1.505c.916.79 1.744 1.922 2.415 3.5zM8.199 22.569c.073.012.146.02.22.02.78.024 2.095.092 3.16.29.87.16 2.593.64 4.01 1.055 1.083.316 2.198-.548 2.355-1.664.114-.814.33-1.735.725-2.58l-.01.005c-.67-1.87-1.522-3.078-2.416-3.849a5.295 5.295 0 0 0-2.778-1.257c-1.54-.216-2.952.19-3.84.45.532 2.218.368 4.829-1.425 7.531zM5.533 9.938c-.023.1-.056.197-.098.29L2.82 16.059a1.602 1.602 0 0 0 .313 1.772l4.116 4.24c2.103-3.101 1.796-6.02.836-8.3-.728-1.73-1.832-3.081-2.55-3.831zM9.32 14.01c.615-.183 1.606-.465 2.745-.534-.683-1.725-.848-3.233-.716-4.577.154-1.552.7-2.847 1.235-3.95.113-.235.223-.454.328-.664.149-.297.288-.577.419-.86.217-.47.379-.885.46-1.27.08-.38.08-.72-.014-1.043-.095-.325-.297-.675-.68-1.06a1.6 1.6 0 0 0-1.475.36l-4.95 4.452a1.602 1.602 0 0 0-.513.952l-.427 2.83c.672.59 2.328 2.316 3.335 4.711.09.21.175.43.253.653z",
  airtable:
    "M11.992 1.966c-.434 0-.87.086-1.28.257L1.779 5.917c-.503.208-.49.908.012 1.116l8.982 3.558a3.266 3.266 0 0 0 2.454 0l8.982-3.558c.503-.196.503-.908.012-1.116l-8.957-3.694a3.255 3.255 0 0 0-1.272-.257zM23.4 8.056a.589.589 0 0 0-.222.045l-10.012 3.877a.612.612 0 0 0-.38.564v8.896a.6.6 0 0 0 .821.552L23.62 18.1a.583.583 0 0 0 .38-.551V8.653a.6.6 0 0 0-.6-.596zM.676 8.095a.644.644 0 0 0-.48.19C.086 8.396 0 8.53 0 8.69v8.355c0 .442.515.737.908.54l6.27-3.006.307-.147 2.969-1.436c.466-.22.43-.908-.061-1.092L.883 8.138a.57.57 0 0 0-.207-.044z",
  googledrive:
    "M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z",
  gmail:
    "M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z",
  python:
    "M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z",
  pytorch:
    "M12.005 0L4.952 7.053a9.865 9.865 0 000 14.022 9.866 9.866 0 0014.022 0c3.984-3.9 3.986-10.205.085-14.023l-1.744 1.743c2.904 2.905 2.904 7.634 0 10.538s-7.634 2.904-10.538 0-2.904-7.634 0-10.538l4.647-4.646.582-.665zm3.568 3.899a1.327 1.327 0 00-1.327 1.327 1.327 1.327 0 001.327 1.328A1.327 1.327 0 0016.9 5.226 1.327 1.327 0 0015.573 3.9z",
  supabase:
    "M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z",
  brave:
    "M15.68 0l2.096 2.38s1.84-.512 2.709.358c.868.87 1.584 1.638 1.584 1.638l-.562 1.381.715 2.047s-2.104 7.98-2.35 8.955c-.486 1.919-.818 2.66-2.198 3.633-1.38.972-3.884 2.66-4.293 2.916-.409.256-.92.692-1.38.692-.46 0-.97-.436-1.38-.692a185.796 185.796 0 01-4.293-2.916c-1.38-.973-1.712-1.714-2.197-3.633-.247-.975-2.351-8.955-2.351-8.955l.715-2.047-.562-1.381s.716-.768 1.585-1.638c.868-.87 2.708-.358 2.708-.358L8.321 0h7.36zm-3.679 14.936c-.14 0-1.038.317-1.758.69-.72.373-1.242.637-1.409.742-.167.104-.065.301.087.409.152.107 2.194 1.69 2.393 1.866.198.175.489.464.687.464.198 0 .49-.29.688-.464.198-.175 2.24-1.759 2.392-1.866.152-.108.254-.305.087-.41-.167-.104-.689-.368-1.41-.741-.72-.373-1.617-.69-1.757-.69zm0-11.278s-.409.001-1.022.206-1.278.46-1.584.46c-.307 0-2.581-.434-2.581-.434S4.119 7.152 4.119 7.849c0 .697.339.881.68 1.243l2.02 2.149c.192.203.59.511.356 1.066-.235.555-.58 1.26-.196 1.977.384.716 1.042 1.194 1.464 1.115.421-.08 1.412-.598 1.776-.834.364-.237 1.518-1.19 1.518-1.554 0-.365-1.193-1.02-1.413-1.168-.22-.15-1.226-.725-1.247-.95-.02-.227-.012-.293.284-.851.297-.559.831-1.304.742-1.8-.089-.495-.95-.753-1.565-.986-.615-.232-1.799-.671-1.947-.74-.148-.068-.11-.133.339-.175.448-.043 1.719-.212 2.292-.052.573.16 1.552.403 1.632.532.079.13.149.134.067.579-.081.445-.5 2.581-.541 2.96-.04.38-.12.63.288.724.409.094 1.097.256 1.333.256s.924-.162 1.333-.256c.408-.093.329-.344.288-.723-.04-.38-.46-2.516-.541-2.961-.082-.445-.012-.45.067-.579.08-.129 1.059-.372 1.632-.532.573-.16 1.845.009 2.292.052.449.042.487.107.339.175-.148.069-1.332.508-1.947.74-.615.233-1.476.49-1.565.986-.09.496.445 1.241.742 1.8.297.558.304.624.284.85-.02.226-1.026.802-1.247.95-.22.15-1.413.804-1.413 1.169 0 .364 1.154 1.317 1.518 1.554.364.236 1.355.755 1.776.834.422.079 1.08-.4 1.464-1.115.384-.716.039-1.422-.195-1.977-.235-.555.163-.863.355-1.066l2.02-2.149c.341-.362.68-.546.68-1.243 0-.697-2.695-3.96-2.695-3.96s-2.274.436-2.58.436c-.307 0-.972-.256-1.585-.461-.613-.205-1.022-.206-1.022-.206z",
  spotify:
    "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
  googlecalendar:
    "M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684h12.632zm-7.207 6.25v-.065c.272-.144.5-.349.687-.617s.279-.595.279-.982c0-.379-.099-.72-.3-1.025a2.05 2.05 0 0 0-.832-.714 2.703 2.703 0 0 0-1.197-.257c-.6 0-1.094.156-1.481.467-.386.311-.65.671-.793 1.078l1.085.452c.086-.249.224-.461.413-.633.189-.172.445-.257.767-.257.33 0 .602.088.816.264a.86.86 0 0 1 .322.703c0 .33-.12.589-.36.778-.24.19-.535.284-.886.284h-.567v1.085h.633c.407 0 .748.109 1.02.327.272.218.407.499.407.843 0 .336-.129.614-.387.832s-.565.327-.924.327c-.351 0-.651-.103-.897-.311-.248-.208-.422-.502-.521-.881l-1.096.452c.178.616.505 1.082.977 1.401.472.319.984.478 1.538.477a2.84 2.84 0 0 0 1.293-.291c.382-.193.684-.458.902-.794.218-.336.327-.72.327-1.149 0-.429-.115-.797-.344-1.105a2.067 2.067 0 0 0-.881-.689zm2.093-1.931l.602.913L15 10.045v5.744h1.187V8.446h-.827l-2.158 1.557zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0zm-3.289 23.5l4.684-4.684h-4.684V23.5zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0v3.289z",
};
const TOOL_ICONS = [
  [/password|secret|credential/, "key"],
  [/video|movie|quick-cut|animation/, "device-camera-video"],
  [/photo|image|portrait|mockup/, "file-media"],
  [/design|adobe|canva|artwork/, "paintcan"],
  [/spreadsheet|excel|statement|valuation|budget/, "table"],
  [/browser|web-search/, "browser"],
  [/email|mail|slack|chat/, "mail"],
  [/calendar|schedule|meeting/, "calendar"],
  [/audio|voice|speech|transcri/, "mic"],
  [/merge|git/, "git-merge"],
  [/pdf/, "file-pdf"],
  [/document|writing|writer|blog/, "file-text"],
  [/database|sql|storage/, "database"],
  [/analytics|data|report|chart/, "graph"],
  [/terminal|shell|cli/, "terminal"],
];
const ICON_COLORS = {
  build: "#68a9ff",
  design: "#f08ad2",
  research: "#45d4c4",
  writing: "#f6c65c",
  business: "#8cda77",
  productivity: "#a99aff",
  integrations: "#52c9f5",
  ai: "#c58aff",
  security: "#ffac60",
  other: "#ed83a5",
};
const BRAND_COLORS = {
  "1password": "#6084cd",
  figma: "#f46339",
  gitlab: "#fc7431",
  docker: "#3ea2ef",
  react: "#61dafb",
  discord: "#5865f2",
  telegram: "#45b2e8",
  whatsapp: "#4de084",
  zoom: "#2e73ff",
  obsidian: "#803fed",
  airtable: "#2ec5ff",
  googledrive: "#4285f4",
  gmail: "#eb4f42",
  python: "#619bcc",
  pytorch: "#ef5b3d",
  supabase: "#58d59d",
  brave: "#fb5932",
  spotify: "#48e580",
  googlecalendar: "#4285f4",
};
function itemColor(row) {
  const name = String(row.name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const brand = Object.keys(BRAND_COLORS).find((key) => name.startsWith(key));
  return BRAND_COLORS[brand] || ICON_COLORS[categoryOf(row).id];
}
function itemIcon(row) {
  const name = String(row.name || "").toLowerCase();
  const compact = name.replace(/[^a-z0-9]/g, "");
  const brand = Object.keys(BRAND_PATHS).find((key) => compact.startsWith(key));
  if (brand)
    return h(
      "svg",
      {
        width: 19,
        height: 19,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": true,
      },
      h("path", { d: BRAND_PATHS[brand] }),
    );
  return icon(
    TOOL_ICONS.find(([pattern]) => pattern.test(name))?.[1] ||
      categoryOf(row).icon,
  );
}
const CARD_BRIEFS = {
  "1password": [
    "Set up and sign in to 1Password CLI",
    "Read or inject secrets",
  ],
  "adobe-batch-edit-photos": [
    "Apply consistent photo adjustments",
    "Match the look across a photo collection",
  ],
  "adobe-create-mockups": [
    "Preview logos and artwork on products",
    "Mock up shirts, mugs, cards, and more",
  ],
  "adobe-create-social-variations": [
    "Resize images and videos for social media",
    "Crop and export platform-ready versions",
  ],
  "adobe-design-from-template": [
    "Create designs from Adobe Express templates",
    "Flyers, social posts, presentations, and more",
  ],
  "adobe-edit-quick-cut": [
    "Turn long videos into short highlight reels",
    "Edit with Adobe Quick Cut",
  ],
  "adobe-retouch-portraits": [
    "Retouch a collection of portrait photos",
    "Use a consistent editing workflow",
  ],
  "agent-browser": [
    "Automate browser interactions",
    "Navigate, fill forms, and capture screenshots",
  ],
  "agent-browser-verify": [
    "Check a running app in the browser",
    "Verify visible UI and flag console errors",
  ],
};
function briefPoints(row, section) {
  const preset = CARD_BRIEFS[String(row.name || "").toLowerCase()];
  if (section === "skills" && preset) return preset;
  // Extract only supplied description text; full details stay in the card dialog.
  const text = String(row.description || "")
    .replace(/\s+/g, " ")
    .replace(
      /\s+(?:Use this skill whenever|Use this skill when|Also triggers|Access:|Triggers on:?)[\s\S]*$/i,
      "",
    )
    .trim();
  if (!text)
    return [
      section === "plugins"
        ? "Open for plugin details and setup"
        : "Open for skill instructions",
    ];
  let points = text.split(/(?<=[.!?])\s+(?=[A-Z])|;\s+/).filter(Boolean);
  return points.slice(0, 2).map((point) => {
    const clean = point
      .replace(
        /^(?:Use (?:this skill )?when (?:the user|a user) (?:wants|needs) to|Use this skill to)\s+/i,
        "",
      )
      .replace(/[.;,]+$/, "")
      .trim();
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  });
}

// Broad shelves reuse source categories first; names fill gaps in local bundles.
const CATEGORIES = [
  { id: "all", label: "All categories", icon: "library" },
  {
    id: "build",
    label: "Development",
    icon: "code",
    match:
      /software-development|devops|vercel|programming|development|code|coding|debug|github|gitlab|docker|react|nextjs|api|sdk|cli|deploy|server/,
  },
  {
    id: "design",
    label: "Design & media",
    icon: "paintcan",
    match:
      /creative|design|figma|canva|adobe|photo|video|image|animation|music|audio|artwork|slides|presentations/,
  },
  {
    id: "research",
    label: "Research & data",
    icon: "graph",
    match:
      /research|analytics|data|arxiv|paper|science|bioinformatics|genomics|search|scrap|rag/,
  },
  {
    id: "writing",
    label: "Writing",
    icon: "edit",
    match:
      /writing|writer|copywriting|documents|docx|pdf|story|blog|translation|translate|summariz/,
  },
  {
    id: "business",
    label: "Business & finance",
    icon: "briefcase",
    match:
      /finance|financial|investment|equity|banking|valuation|stocks|trading|credit|capital|sales|marketing|pitch|budget|market-sizing|business/,
  },
  {
    id: "productivity",
    label: "Productivity",
    icon: "checklist",
    match:
      /productivity|desktop|automation|calendar|task|todo|notes|notion|obsidian|reminder|kanban|workflow|schedule|meeting|report|memory/,
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: "plug",
    match:
      /integration|platform|messaging|connector|zoom|slack|discord|telegram|whatsapp|email|gmail|drive|mcp|bridge|oauth/,
  },
  {
    id: "ai",
    label: "AI & models",
    icon: "hubot",
    match:
      /mlops|models|autonomous-ai|machine-learning|llm|agent|training|inference|pytorch|lora|embedding|diffusion|model/,
  },
  {
    id: "security",
    label: "Security",
    icon: "shield",
    match:
      /security|red-teaming|password|auth|threat|vulnerab|privacy|encrypt|firewall/,
  },
  { id: "other", label: "Other", icon: "extensions" },
];
const CATEGORY_PRIORITY = [
  "security",
  "business",
  "design",
  "research",
  "writing",
  "integrations",
  "ai",
  "build",
  "productivity",
].map((id) => CATEGORIES.find((c) => c.id === id));
function categoryOf(row) {
  for (const value of [row.category || "", row.name || ""]) {
    const match = CATEGORY_PRIORITY.find((c) =>
      c.match.test(value.toLowerCase()),
    );
    if (match) return match;
  }
  return CATEGORIES[CATEGORIES.length - 1];
}
const CATEGORY_ACCENTS = {
  build: "var(--ui-accent,#a8b6d6)",
  design: "#c0a6cf",
  research: "#9dbfb8",
  writing: "#c5bca2",
  business: "#b8c5a2",
  productivity: "#b0b1ce",
  integrations: "#a2bbc7",
  ai: "#b5a7cd",
  security: "#c7ad9f",
  other: "#b3b0bc",
};
function CategoryPicker({ value, onChange, counts, items = CATEGORIES, mode, onModeChange }) {
  const subject = mode === "authors" ? "author" : "category";
  const track = useRef(null);
  const index = Math.max(0, items.findIndex((c) => c.id === value));
  useEffect(() => {
    const rail = track.current;
    const active = rail?.querySelector('[aria-pressed="true"]');
    if (!rail || !active) return;
    const align = () => {
      rail.scrollTo({
        left:
          rail.scrollLeft +
          active.getBoundingClientRect().left -
          rail.getBoundingClientRect().left -
          (rail.clientWidth - active.offsetWidth) / 2,
        behavior: "instant",
      });
    };
    align();
    const observer = new ResizeObserver(align);
    observer.observe(rail);
    observer.observe(active);
    return () => observer.disconnect();
  }, [value, mode, items.length]);
  return h(
    "section",
    { className: "categories", "aria-label": `Browse by ${subject}` },
    h(
      "div",
      { className: "category-heading" },
      h("div", { className: "tabs browse-modes", "aria-label": "Browse grouping" },
        [["categories", "Categories"], ["authors", "Authors"]].map(([key, label]) =>
          h("button", { key, className: mode === key ? "active" : "",
            "aria-pressed": mode === key, onClick: () => onModeChange(key) },
            icon(key === "authors" ? "organization" : "list-unordered"), label)),
      ),
      h("span", null, `Slide to choose ${subject === "author" ? "an author" : "a category"}`),
    ),
    h(
      "div",
      { className: "category-picker" },
      h(
        "button",
        {
          className: "category-arrow",
          "aria-label": `Previous ${subject}`,
          disabled: index === 0,
          onClick: () => onChange(items[index - 1].id),
        },
        icon("chevron-left"),
      ),
      h(
        "div",
        { className: "category-track", ref: track },
        items.map((c) =>
          h(
            "button",
            {
              key: c.id,
              title: c.fullLabel || c.label,
              "aria-label": `${c.fullLabel || c.label} · ${counts[c.id] || 0}`,
              className: "category-chip" + (value === c.id ? " active" : ""),
              "aria-pressed": value === c.id,
              onClick: () => onChange(c.id),
            },
            icon(c.icon),
            h("span", { className: "chip-label" }, c.label),
            h("span", { className: "category-count" }, counts[c.id] || 0),
          ),
        ),
      ),
      h(
        "button",
        {
          className: "category-arrow",
          "aria-label": `Next ${subject}`,
          disabled: index === items.length - 1,
          onClick: () => onChange(items[index + 1].id),
        },
        icon("chevron-right"),
      ),
    ),
    h("input", {
      className: "category-slider",
      type: "range",
      min: 0,
      max: items.length - 1,
      step: 1,
      value: index,
      disabled: items.length < 2,
      "aria-label": `Choose ${subject}`,
      "aria-valuetext": items[index].label,
      onChange: (e) => onChange(items[Number(e.target.value)].id),
    }),
  );
}
const message = (e) => (typeof e?.message === "string" ? e.message : String(e));
function shortAuthor(label) {
  if (label === "Author not listed") return "Not listed";
  const clean = label
    .replace(/\([^)]*\)/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .split(/,|\s+[+/]\s+|\s+(?:ported|adapted|enhanced|inspired)\s+(?:by|from)/i)[0]
    .replace(/^@/, "")
    .replace(/\s+/g, " ")
    .trim();
  const name = clean || label;
  return name.length > 24 ? name.slice(0, 23).trimEnd() + "…" : name;
}
function authorLabels(row) {
  const suffix = row.author_kind && row.author_kind !== "author" ? ` (${row.author_kind})` : "";
  return row.authors?.length ? row.authors.map((name) => name + suffix) : ["Author not listed"];
}


// BEGIN GENERATED COMMUNITY DIRECTORY
const COMMUNITY_DIRECTORY = {
  "checked_on": "2026-09-20",
  "main_url": "https://github.com/NousResearch/hermes-agent",
  "projects": [
    {
      "id": "hermes-live-voice",
      "name": "Hermes Live Voice",
      "author": "bielcarpi",
      "category": "voice",
      "icon": "mic",
      "color": "#64c8bd",
      "description": "Talk while Hermes works in the background.",
      "highlights": [
        "Continuous voice conversations with task progress.",
        "Resume conversations and receive completion notices after reconnecting."
      ],
      "url": "https://github.com/bielcarpi/hermes-live-voice"
    },
    {
      "id": "hermes-hud",
      "name": "Hermes HUD",
      "author": "Diabloluo",
      "category": "interfaces",
      "icon": "dashboard",
      "color": "#779df1",
      "description": "A local dashboard for understanding your agent.",
      "highlights": [
        "Explore activity, sessions, token usage and costs.",
        "Inspect health, scheduled jobs and incidents."
      ],
      "url": "https://github.com/Diabloluo/hermes-hud"
    },
    {
      "id": "provider-chains",
      "name": "Provider Chains",
      "author": "risers-chevron",
      "category": "workflows",
      "icon": "git-branch",
      "color": "#d5a45e",
      "description": "Give your agent a named model fallback chain.",
      "highlights": [
        "Configure provider fallback chains for Hermes.",
        "Explore the project documentation for setup and compatibility."
      ],
      "url": "https://github.com/risers-chevron/hermes-provider-chains"
    },
    {
      "id": "hermes-atlas",
      "name": "Hermes Atlas",
      "author": "ksimback",
      "category": "resources",
      "icon": "map",
      "color": "#b49ade",
      "description": "Find your way through the Hermes ecosystem.",
      "highlights": [
        "Explore a curated catalog of community tools.",
        "Read guidance on installation, modes and skills."
      ],
      "url": "https://github.com/ksimback/hermes-ecosystem"
    },
    {
      "id": "awesome-hermes",
      "name": "Awesome Hermes Agent",
      "author": "0xNyk",
      "category": "resources",
      "icon": "library",
      "color": "#79b99b",
      "description": "A community directory of tools and guides.",
      "highlights": [
        "Browse skills, plugins, memory providers and interfaces.",
        "Follow links to original projects and learning resources."
      ],
      "url": "https://github.com/0xNyk/awesome-hermes-agent"
    },
    {
      "id": "hermes-usecases",
      "name": "Hermes Use Cases",
      "author": "aliaihub",
      "category": "resources",
      "icon": "lightbulb",
      "color": "#d992b8",
      "description": "Discover examples of what people do with Hermes.",
      "highlights": [
        "Explore real-world use cases and workflows.",
        "Follow the supporting primary sources for each example."
      ],
      "url": "https://github.com/aliaihub/awesome-hermes-usecases"
    },
    {
      "id": "skills-library",
      "name": "Skills & Plugins Library",
      "author": "BkashJEE",
      "category": "interfaces",
      "icon": "extensions",
      "color": "#73bdde",
      "description": "The community-built library you are browsing.",
      "highlights": [
        "Discover compact cards with category and author filters.",
        "Explore the code or contribute your own improvements."
      ],
      "url": "https://github.com/BkashJEE/hermes-skills-library"
    }
  ]
};
// END GENERATED COMMUNITY DIRECTORY

const COMMUNITY_CATEGORIES = [
  { id: "all", label: "All builds", icon: "globe" },
  { id: "voice", label: "Voice", icon: "mic" },
  { id: "interfaces", label: "Interfaces", icon: "dashboard" },
  { id: "workflows", label: "Workflows", icon: "git-branch" },
  { id: "resources", label: "Guides & directories", icon: "library" },
];
function SectionTabs({ section, onChange, busy = false }) {
  return h("div", { className: "sections", "aria-label": "Capability type" },
    [["skills", "book", "Skills"], ["plugins", "extensions", "Plugins"], ["community", "globe", "Use Cases"]].map(([value, symbol, label]) =>
      h("button", { key: value, disabled: busy, className: section === value ? "active" : "",
        "aria-pressed": section === value, onClick: () => onChange(value) }, icon(symbol), label)));
}
function ProjectLink({ ctx, url, children, className = "" }) {
  const [error, setError] = useState("");
  let valid = false;
  try { const u = new URL(url); valid = u.protocol === "https:" && !u.username && !u.password; } catch {}
  if (!valid) return null;
  return h(React.Fragment, null,
    h("a", { href: url, title: url, target: ctx.preview ? "_self" : "_blank", rel: "noopener noreferrer", className: "project-link " + className,
      "aria-label": children === "GitHub" ? "GitHub: " + url.split("/").slice(-2).join("/") : undefined,
      onClick: ctx.os?.openExternal && !ctx.preview ? async (event) => {
        event.preventDefault();
        try { if (await ctx.os.openExternal(url)) { setError(""); return; } } catch {}
        setError("Open this address in your browser: " + url);
      } : undefined }, children, icon("link-external")),
    error && h(Dialog, { open: true, onOpenChange: open => { if (!open) setError(""); } },
      h(DialogContent, { className: "hsl-dialog" }, h(DialogTitle, null, "Open project link"),
        h(DialogDescription, null, "Desktop could not open your browser. Copy this address to open the project:"),
        h("pre", null, url), h("button", { onClick: () => setError("") }, "Close"))));
}
function Community({ ctx, onSection }) {
  const data = COMMUNITY_DIRECTORY;
  const [query, setQuery] = useState(""), [category, setCategory] = useState("all"), [author, setAuthor] = useState("");
  const [mode, setMode] = useState("categories"), [sort, setSort] = useState("curated"), [selected, setSelected] = useState(null);
  const results = useRef(null);
  useEffect(() => { results.current?.scrollTo({ top: 0 }); }, [query, category, author, sort]);
  const projects = data?.projects || [];
  const matches = projects.filter(p => `${p.name} ${p.author} ${p.description} ${p.highlights.join(" ")}`.toLowerCase().includes(query.toLowerCase().trim()));
  const authorCounts = {}, counts = { all: 0 };
  for (const p of matches) {
    if (!author || p.author === author) { counts.all++; counts[p.category] = (counts[p.category] || 0) + 1; }
    if (category === "all" || p.category === category) authorCounts[p.author] = (authorCounts[p.author] || 0) + 1;
  }
  if (author && !authorCounts[author]) authorCounts[author] = 0;
  const shown = matches.filter(p => (category === "all" || p.category === category) && (!author || p.author === author));
  if (sort === "name") shown.sort((a, b) => a.name.localeCompare(b.name));
  const clear = () => { setQuery(""); setCategory("all"); setAuthor(""); };
  return h("div", { className: "hsl community" }, h("style", null, css),
    h("div", { className: "library-header" },
      h("div", { className: "top" }, h("div", null,
        h("div", { className: "eyebrow" }, "HERMES / USE CASES"),
        h("h1", null, "What the community is building"), h("p", null, "Explore what people are making. Meet the builders. Find your next idea.")),
        h(ProjectLink, { ctx, url: "https://github.com/NousResearch/hermes-agent" }, "Main Hermes project")),
      h(SectionTabs, { section: "community", onChange: onSection }),
      h("div", { className: "toolbar" },
        h("div", { className: "search" }, icon("search"), h("input", { value: query, "aria-label": "Search community projects", placeholder: "Search projects, builders, or ideas…", onChange: e => setQuery(e.target.value) })),
        h("select", { className: "community-sort", "aria-label": "Sort community projects", value: sort, onChange: e => setSort(e.target.value) },
          h("option", { value: "curated" }, "Curated order"), h("option", { value: "name" }, "Name A–Z"))),
      h(CategoryPicker, { value: mode === "authors" ? author : category, onChange: mode === "authors" ? setAuthor : setCategory,
        mode, onModeChange: setMode, items: mode === "authors" ? [{ id: "", label: "All builders", icon: "organization" }, ...Object.keys(authorCounts).sort().map(a => ({ id: a, label: shortAuthor(a), fullLabel: a, icon: "account" }))] : COMMUNITY_CATEGORIES,
        counts: mode === "authors" ? { ...authorCounts, "": matches.filter(p => category === "all" || p.category === category).length } : counts }),
      h("div", { className: "community-summary" }, h("span", { className: "counts muted", role: "status", "aria-live": "polite" },
        data ? `${shown.length} ${shown.length === 1 ? "project" : "projects"} · Curated selection · Sources checked ${data.checked_on}${author ? " · " + author : ""}${category !== "all" ? " · " + COMMUNITY_CATEGORIES.find(c => c.id === category)?.label : ""}` : "Community projects"),
        (query || author || category !== "all") && h("button", { onClick: clear }, "Clear filters"))),
    h("div", { className: "library-results", ref: results, tabIndex: 0, role: "region", "aria-label": "Community projects" },
      h(React.Fragment, null,
        h("div", { className: "community-intro" }, icon("lightbulb"), h("p", null, "Community projects and resources, linked to their original repositories. Explore a build to see what it does.")),
        shown.length ? h("div", { className: "grid community-grid" }, shown.map(p => h("article", { key: p.id, className: "card community-card", "aria-label": p.name, style: { "--card-accent": p.color, "--icon-color": p.color } },
          h("div", { className: "card-head" }, h("span", { className: "item-icon", "aria-hidden": true }, icon(p.icon)),
            h("div", { className: "card-heading" }, h("h3", { className: "name", title: p.name }, p.name), h("div", { className: "source", title: p.author }, "by " + p.author))),
          h("div", { className: "project-category" }, COMMUNITY_CATEGORIES.find(c => c.id === p.category)?.label),
          h("p", { className: "project-description" }, p.description),
          h("div", { className: "foot" }, h("button", { onClick: () => setSelected(p), "aria-label": "Explore " + p.name }, "Explore build", icon("arrow-right")),
            h(ProjectLink, { ctx, url: p.url }, "GitHub"))))) : h("div", { className: "empty" }, h("p", null, "No matching projects. Try another builder, category, or search."), h("button", { onClick: clear }, "Reset browsing")),
        h("div", { className: "community-bottom" }, h("p", { className: "muted" }, "A starting collection, not a complete directory or an endorsement. Requirements and availability are maintained by each project."),
          h(ProjectLink, { ctx, url: "https://github.com/BkashJEE/hermes-skills-library/issues/new?title=Community+project+suggestion" }, "Suggest a build")))),
    h(Dialog, { open: !!selected, onOpenChange: open => { if (!open) setSelected(null); } },
      selected && h(DialogContent, { className: "hsl-dialog community-detail" },
        h(DialogTitle, null, selected.name), h(DialogDescription, null, selected.description),
        h("p", { className: "muted" }, "Repository owner: " + selected.author),
        h("h3", null, "What you can explore"), h("ul", null, selected.highlights.map(text => h("li", { key: text }, text))),
        h("p", { className: "muted" }, "Source checked " + data.checked_on + ". See the original repository for current setup, permissions, and compatibility."),
        h("div", { className: "detail-actions" }, h(ProjectLink, { ctx, url: selected.url }, "Open original project"), h("button", { onClick: () => setSelected(null) }, "Close")))));
}

function Library({ ctx }) {
  const [profiles, setProfiles] = useState([]),
    [target, setTarget] = useState(""),
    [rows, setRows] = useState([]);
  const [query, setQuery] = useState(""),
    [tab, setTab] = useState("Discover"),
    [section, setSection] = useState("skills"),
    [source, setSource] = useState("All sources"),
    [author, setAuthor] = useState(""),
    [browseMode, setBrowseMode] = useState("categories"),
    [category, setCategory] = useState("all"),
    [importOpen, setImportOpen] = useState(false),
    [repository, setRepository] = useState(""),
    [importError, setImportError] = useState(""),
    [loading, setLoading] = useState(true);
  const [error, setError] = useState(""),
    [note, setNote] = useState(""),
    [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState(null),
    [preview, setPreview] = useState(null),
    [previewError, setPreviewError] = useState("");
  const [hub, setHub] = useState(null),
    [hubLoading, setHubLoading] = useState(false),
    [revision, setRevision] = useState(0);
  const generation = useRef(0),
    previewGeneration = useRef(0),
    searchGeneration = useRef(0);
  const results = useRef(null);
  useEffect(() => {
    results.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [category, query, source, author, tab, section, target]);
  useEffect(() => {
    let live = true;
    ctx
      .rest("/profiles")
      .then((data) => {
        if (!live) return;
        const list = data.profiles || [];
        setProfiles(list);
        const active = host.state.profile.get();
        setTarget(
          list.some((p) => p.name === active)
            ? active
            : list[0]?.name || "default",
        );
      })
      .catch((e) => {
        if (live) {
          setError(message(e));
          setLoading(false);
        }
      });
    return () => {
      live = false;
    };
  }, [ctx, revision]);
  useEffect(() => {
    if (!target || section === "community") return;
    const gen = ++generation.current;
    ++searchGeneration.current;
    ++previewGeneration.current;
    setLoading(true);
    setError("");
    setRows([]);
    setHub(null);
    setHubLoading(false);
    setSelected(null);
    setPreview(null);
    setNote("");
    ctx
      .rest(
        (section === "plugins"
          ? "/plugins/catalog?target="
          : "/catalog?target=") + encodeURIComponent(target),
        {
          timeoutMs: 60000,
        },
      )
      .then((data) => {
        if (gen === generation.current) setRows(data[section] || []);
      })
      .catch((e) => {
        if (gen === generation.current) setError(message(e));
      })
      .finally(() => {
        if (gen === generation.current) setLoading(false);
      });
    return () => {
      ++generation.current;
    };
  }, [ctx, target, section]);
  useEffect(() => {
    if (!selected) return;
    const gen = ++previewGeneration.current;
    setPreview(null);
    setPreviewError("");
    if (section === "plugins") return;
    ctx
      .rest(
        "/preview?target=" +
          encodeURIComponent(target) +
          "&identifier=" +
          encodeURIComponent(selected.id),
        { timeoutMs: 60000 },
      )
      .then((data) => {
        if (gen === previewGeneration.current) setPreview(data);
      })
      .catch((e) => {
        if (gen === previewGeneration.current) setPreviewError(message(e));
      });
    return () => {
      ++previewGeneration.current;
    };
  }, [ctx, selected, target, section]);
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected, busy]);
  async function refresh() {
    if (!target) {
      setRevision((x) => x + 1);
      return;
    }
    const gen = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const data = await ctx.rest(
        (section === "plugins"
          ? "/plugins/catalog?target="
          : "/catalog?target=") + encodeURIComponent(target),
        { timeoutMs: 60000 },
      );
      if (gen === generation.current) setRows(data[section] || []);
    } catch (e) {
      if (gen === generation.current) setError(message(e));
    } finally {
      if (gen === generation.current) setLoading(false);
    }
  }
  async function searchHub() {
    const gen = ++searchGeneration.current,
      forTarget = target;
    setHubLoading(true);
    setError("");
    try {
      const data = await ctx.rest(
        "/search?target=" +
          encodeURIComponent(forTarget) +
          "&q=" +
          encodeURIComponent(query),
        { timeoutMs: 60000 },
      );
      if (gen === searchGeneration.current) {
        setHub(data.skills || []);
        setTab("Hub results");
        if (data.timed_out?.length)
          setNote("Some skill sources timed out. You can search again.");
      }
    } catch (e) {
      if (gen === searchGeneration.current) setError(message(e));
    } finally {
      if (gen === searchGeneration.current) setHubLoading(false);
    }
  }
  async function act(skill, enable) {
    const forTarget = target;
    setBusy(true);
    setError("");
    try {
      const res = await ctx.rest(
        (section === "plugins" ? "/plugins" : "") +
          (enable === undefined ? "/install" : "/toggle"),
        {
          method: enable === undefined ? "POST" : "PUT",
          body:
            enable === undefined
              ? section === "plugins"
                ? { target: forTarget, catalog_name: skill.name }
                : { target: forTarget, identifier: skill.id }
              : {
                  target: forTarget,
                  name: skill.key || skill.name,
                  enabled: enable,
                },
          timeoutMs: 120000,
        },
      );
      setNote(
        [
          res.message ||
            `${skill.name} ${enable ? "enabled" : "disabled"} for ${forTarget}. Applies to new conversations.`,
          ...(res.missing_env || []).map((name) => "Setup required: " + name),
        ].join("\n"),
      );
      if (section === "plugins" && enable === undefined) {
        setTab("Installed");
        setCategory("all");
        setSource("All sources");
        setAuthor("");
        setQuery("");
      }
      setSelected(null);
      await refresh();
    } catch (e) {
      setError(message(e));
      setPreviewError(message(e));
    } finally {
      setBusy(false);
    }
  }
  async function importPlugin(e) {
    e.preventDefault();
    setBusy(true);
    setImportError("");
    try {
      const result = await ctx.rest("/plugins/install", {
        method: "POST",
        body: { target, identifier: repository.trim() },
        timeoutMs: 180000,
      });
      setNote(
        [
          result.message,
          ...(result.missing_env || []).map(
            (name) => "Setup required: " + name,
          ),
        ]
          .filter(Boolean)
          .join("\n"),
      );
      setImportOpen(false);
      setRepository("");
      setTab("Installed");
      setCategory("all");
      setSource("All sources");
        setAuthor("");
      setQuery("");
      await refresh();
    } catch (e) {
      setImportError(message(e));
    } finally {
      setBusy(false);
    }
  }
  const installedNames = new Map(
    rows.filter((r) => r.kind === "installed").map((r) => [r.name, r]),
  );
  const prepared = (tab === "Hub results" ? hub || [] : rows).map((r) => {
    const got = section === "skills" ? installedNames.get(r.name) : null;
    return got ? { ...r, installed: true, enabled: got.enabled } : r;
  });
  const q = query.toLowerCase().trim();
  const candidates = prepared
    .filter(
      (r) =>
        (!q ||
          `${r.name} ${title(r.name)} ${r.description} ${r.source} ${authorLabels(r).join(" ")}`
            .toLowerCase()
            .includes(q) ||
          tab === "Hub results") &&
        (tab !== "Installed" || r.kind === "installed") &&
        (source === "All sources" || r.source === source) &&
        (tab === "Hub results" ||
          source !== "All sources" ||
          r.kind === "installed" ||
          !r.installed),
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  const authorCounts = new Map();
  for (const row of candidates) {
    if (category !== "all" && categoryOf(row).id !== category) continue;
    for (const label of authorLabels(row)) authorCounts.set(label, (authorCounts.get(label) || 0) + 1);
  }
  if (author && !authorCounts.has(author)) authorCounts.set(author, 0);
  const matching = candidates.filter((row) => !author || authorLabels(row).includes(author));
  const categoryCounts = { all: matching.length };
  for (const row of matching) {
    const id = categoryOf(row).id;
    categoryCounts[id] = (categoryCounts[id] || 0) + 1;
  }
  const filtered = matching.filter(
    (row) => category === "all" || categoryOf(row).id === category,
  );
  const status = (r) =>
    r.installed
      ? r.enabled
        ? "Enabled"
        : "Disabled"
      : r.unsupported
        ? "Incompatible OS"
        : r.requirements?.length
          ? "Setup required"
          : "";
  const current = selected
    ? {
        ...selected,
        ...(preview
          ? {
              unsupported: preview.unsupported ?? selected.unsupported,
              requirements: preview.requirements ?? selected.requirements,
            }
          : {}),
        ...(section === "skills" && installedNames.has(selected.name)
          ? {
              installed: true,
              enabled: installedNames.get(selected.name).enabled,
            }
          : {}),
      }
    : null;
  if (section === "community") return h(Community, { ctx, onSection: setSection });
  return h(
    "div",
    { className: "hsl" },
    h("style", null, css),
    h(
      "div",
      { className: "library-header" },
      h(
        "div",
        { className: "top" },
        h(
          "div",
          null,
          h("div", { className: "eyebrow" }, "HERMES / CAPABILITIES"),
          h("h1", null, "Skills & Plugins"),
          h("p", null, "Add capabilities to your agents, all in one place."),
        ),
        h(
          "div",
          { className: "target" },
          h("label", { htmlFor: "hsl-target" }, "Agent"),
          h(
            "select",
            {
              id: "hsl-target",
              value: target,
              disabled: busy || !profiles.length,
              onChange: (e) => setTarget(e.target.value),
            },
            profiles.map((p) =>
              h(
                "option",
                { key: p.name, value: p.name },
                p.name === "default" ? "Default Hermes" : p.name,
              ),
            ),
          ),
        ),
      ),
      h(SectionTabs, { section, busy, onChange: value => {
        setSection(value); setCategory("all"); setTab("Discover"); setSource("All sources");
        setAuthor(""); setQuery(""); setImportOpen(false);
      } }),
      h(
        "div",
        { className: "toolbar" },
        h(
          "div",
          { className: "search" },
          icon("search"),
          h("input", {
            "aria-label": "Search " + section,
            placeholder:
              section === "skills" ? "Search skills…" : "Search plugins…",
            value: query,
            onChange: (e) => {
              setQuery(e.target.value);
              ++searchGeneration.current;
              setHubLoading(false);
              setHub(null);
              if (tab === "Hub results") setTab("Discover");
            },
            onKeyDown: (e) => {
              if (
                section === "skills" &&
                e.key === "Enter" &&
                query.trim() &&
                target
              )
                searchHub();
            },
          }),
        ),
        section === "skills" &&
          h(
            "button",
            {
              disabled: !query.trim() || !target || hubLoading || busy,
              onClick: searchHub,
            },
            hubLoading ? "Searching…" : "Search online hub",
          ),
        section === "plugins" &&
          h(
            "button",
            {
              className: "primary",
              disabled: busy || !target,
              onClick: () => {
                setImportError("");
                setImportOpen(true);
              },
            },
            "Import plugin",
          ),
        h(
          "button",
          {
            disabled: loading || busy,
            onClick: refresh,
            "aria-label": "Refresh " + section,
          },
          icon("refresh"),
        ),
      ),
      h(
        "div",
        { className: "filters" },
        h(
          "div",
          { className: "tabs", "aria-label": "Library view" },
          ["Discover", "Installed", ...(hub ? ["Hub results"] : [])].map(
            (value) =>
              h(
                "button",
                {
                  key: value,
                  className: tab === value ? "active" : "",
                  "aria-pressed": tab === value,
                  onClick: () => setTab(value),
                },
                value,
              ),
          ),
        ),
        h("div", { className: "catalog-filters" },
        h(
          "select",
          {
            className: "source-filter",
            "aria-label": "Filter by source",
            value: source,
            onChange: (e) => setSource(e.target.value),
          },
          ["All sources", ...new Set(rows.map((r) => r.source))].map((value) =>
            h("option", { key: value, value }, value),
          ),
        ),
        ),
      ),
      h(CategoryPicker, {
        mode: browseMode,
        onModeChange: setBrowseMode,
        value: browseMode === "authors" ? author : category,
        onChange: browseMode === "authors" ? setAuthor : setCategory,
        items: browseMode === "authors" ? [
          { id: "", label: "All authors", icon: "organization" },
          ...[...authorCounts.keys()].sort((a, b) => a.localeCompare(b)).map((label) =>
            ({ id: label, label: shortAuthor(label), fullLabel: label, icon: "account" })),
        ] : CATEGORIES,
        counts: browseMode === "authors" ? {
          ...Object.fromEntries(authorCounts),
          "": candidates.filter((row) => category === "all" || categoryOf(row).id === category).length,
        } : categoryCounts,
      }),
      (author || category !== "all") && h("button", {
        className: "clear-grouping", onClick: () => { setAuthor(""); setCategory("all"); },
      }, "Clear author & category"),
      error &&
        h(
          "div",
          { className: "notice error", role: "alert" },
          error,
          h(
            "p",
            null,
            "If the backend was just installed, reopen Hermes to load it.",
          ),
        ),
      note && h("div", { className: "notice", role: "status" }, note),
      h(
        "div",
        { className: "counts muted", role: "status", "aria-live": "polite" },
        `${filtered.length} ${filtered.length === 1 ? section.slice(0, -1) : section} · ${installedNames.size} installed for ${target || "…"}${author ? ` · Author: ${shortAuthor(author)}` : ""}${category !== "all" ? ` · Category: ${CATEGORIES.find((c) => c.id === category)?.label}` : ""}`,
      ),
    ),
    h(
      "div",
      {
        className: "library-results",
        ref: results,
        role: "region",
        tabIndex: 0,
        "aria-label": "Skills and plugins results",
      },
      loading
        ? h(
            "div",
            { className: "empty", role: "status" },
            "Loading " + section + "…",
          )
        : !filtered.length
          ? h(
              "div",
              { className: "empty" },
              "No matching " +
                section +
                ". Try another category, search, or source.",
              h(
                "button",
                {
                  onClick: () => {
                    setCategory("all");
                    setQuery("");
                    setSource("All sources");
        setAuthor("");
                    setTab("Discover");
                  },
                },
                "Clear filters",
              ),
            )
          : h(
              "div",
              { className: "grid" },
              filtered.map((r) =>
                h(
                  "article",
                  {
                    className: "card",
                    key: r.id,
                    style: {
                      "--card-accent": CATEGORY_ACCENTS[categoryOf(r).id],
                    },
                    "aria-label": title(r.name),
                  },
                  h(
                    "div",
                    { className: "card-head" },
                    h(
                      "span",
                      {
                        className: "item-icon",
                        style: { "--icon-color": itemColor(r) },
                      },
                      itemIcon(r),
                    ),
                    h(
                      "div",
                      { className: "card-heading" },
                      h(
                        "h3",
                        { className: "name", title: title(r.name) },
                        title(r.name),
                      ),
                      h("div", { className: "source", title: `${r.source} · ${authorLabels(r).join(", ")}` }, `${r.source} · ${authorLabels(r).map(shortAuthor).join(", ")}`),
                    ),
                  ),
                  h(
                    "div",
                    { className: "card-summary" },
                    h("div", { className: "summary-label" }, "What it does"),
                    h(
                      "div",
                      {
                        className: "summary-points",
                        role: "list",
                        "aria-label": "What it does",
                      },
                      briefPoints(r, section).map((point, i) =>
                        h(
                          "div",
                          {
                            key: i,
                            className: "summary-point",
                            role: "listitem",
                          },
                          h(
                            "span",
                            { className: "summary-dot", "aria-hidden": true },
                            "•",
                          ),
                          h(
                            "span",
                            { className: "summary-text", title: point },
                            point,
                          ),
                        ),
                      ),
                    ),
                  ),
                  h(
                    "div",
                    { className: "foot" },
                    h(
                      "span",
                      {
                        className:
                          "badge " +
                          (r.installed && r.enabled
                            ? "green"
                            : r.requirements?.length || r.unsupported
                              ? "amber"
                              : ""),
                      },
                      status(r),
                    ),
                    h(
                      "button",
                      { onClick: () => setSelected(r) },
                      r.installed ? "Manage" : "View card",
                      icon("arrow-right"),
                    ),
                  ),
                ),
              ),
            ),
    ),
    h(
      Dialog,
      {
        open: !!current,
        onOpenChange: (open) => {
          if (!open && !busy) setSelected(null);
        },
      },
      current &&
        h(
          DialogContent,
          {
            className: "hsl-dialog",
            onEscapeKeyDown: (e) => {
              if (busy) e.preventDefault();
            },
            onInteractOutside: (e) => {
              if (busy) e.preventDefault();
            },
          },
          h(DialogTitle, null, title(current.name)),
          h(
            DialogDescription,
            null,
            current.description || "Manage this capability.",
          ),
          h("p", { className: "muted" }, current.source + " · " + current.name),
          h("p", { className: "muted" }, "Credit: " + authorLabels(current).join(", ")),
          ctx.preview && h("p", { className: "notice" }, "Read-only preview. Install and manage capabilities in Hermes Desktop."),
          h(
            "div",
            { className: "notice" },
            "Agent: " + target,
            h(
              "p",
              null,
              section === "plugins"
                ? "Plugins extend the agent with tools and integrations. Import first, then enable when ready. Restart Hermes to apply plugin changes."
                : "Changes apply to new conversations. External apps and connectors may need their own setup.",
            ),
          ),
          current.requirements?.length > 0 &&
            h("div", { className: "notice" }, current.requirements.join("\n")),
          section === "plugins" &&
            current.sha &&
            h(
              "p",
              { className: "muted" },
              "Reviewed revision: " + current.sha.slice(0, 12),
            ),
          section === "plugins" &&
            current.repo &&
            h(
              "p",
              { className: "muted", style: { overflowWrap: "anywhere" } },
              current.repo,
            ),
          previewError &&
            h(
              "div",
              { className: "notice error", role: "alert" },
              previewError,
            ),
          section === "skills" &&
            (!preview && !previewError
              ? h("p", null, "Loading instructions…")
              : preview &&
                h("pre", null, preview.content || "No instructions returned.")),
          h(
            "div",
            { className: "detail-actions" },
            h(
              "button",
              { disabled: busy, onClick: () => setSelected(null) },
              "Close",
            ),
            current.installed
              ? h(
                  "button",
                  {
                    disabled: busy || ctx.preview,
                    className: current.enabled ? "" : "primary",
                    onClick: () => act(current, !current.enabled),
                  },
                  busy
                    ? "Saving…"
                    : (current.enabled ? "Disable for " : "Enable for ") +
                        target,
                )
              : h(
                  "button",
                  {
                    className: "primary",
                    disabled:
                      busy || ctx.preview ||
                      (section === "skills" && !preview) ||
                      current.unsupported,
                    onClick: () => act(current),
                  },
                  busy
                    ? "Scanning & installing…"
                    : (section === "plugins" ? "Import for " : "Install for ") +
                        target,
                ),
          ),
        ),
    ),
    h(
      Dialog,
      {
        open: importOpen,
        onOpenChange: (open) => {
          if (!busy) setImportOpen(open);
        },
      },
      h(
        DialogContent,
        {
          className: "hsl-dialog",
          onEscapeKeyDown: (e) => {
            if (busy) e.preventDefault();
          },
          onInteractOutside: (e) => {
            if (busy) e.preventDefault();
          },
        },
        h(DialogTitle, null, "Import a plugin"),
        h(
          DialogDescription,
          null,
          "Paste a GitHub repository to add a Hermes-compatible plugin to " +
            target +
            ".",
        ),
        h(
          "form",
          { onSubmit: importPlugin },
          h("label", { htmlFor: "hsl-repository" }, "Plugin repository"),
          h("input", {
            id: "hsl-repository",
            placeholder:
              "owner/repository or https://github.com/owner/repository",
            value: repository,
            disabled: busy,
            required: true,
            onChange: (e) => setRepository(e.target.value),
          }),
          h(
            "p",
            { className: "muted" },
            (ctx.preview ? "Read-only preview: import from Hermes Desktop. " : "") + "Supports Hermes and Agent Plugins v1 packages. Codex and OpenClaw connectors need a compatible package; copying their skills does not import the connector.",
          ),
          importError &&
            h("div", { className: "notice error", role: "alert" }, importError),
          h(
            "div",
            { className: "detail-actions" },
            h(
              "button",
              {
                type: "button",
                disabled: busy,
                onClick: () => setImportOpen(false),
              },
              "Cancel",
            ),
            h(
              "button",
              {
                type: "submit",
                className: "primary",
                disabled: busy || ctx.preview || !repository.trim(),
              },
              busy ? "Scanning & importing…" : "Import for " + target,
            ),
          ),
        ),
      ),
    ),
  );
}
// Reset the view when Hermes changes backend/profile so stale results
// cannot become actions on a different agent connection.
function ScopedLibrary({ ctx }) {
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    const reset = () => setEpoch((value) => value + 1);
    const stops = [
      host.state.profile.listen(reset),
      host.state.gateway.listen(reset),
    ];
    return () => stops.forEach((stop) => stop());
  }, []);
  return h(Library, { ctx, key: epoch });
}
export default {
  id: "hermes-skills-library",
  name: "Skills & Plugins",
  defaultEnabled: true,
  register(ctx) {
    ctx.registerMany([
      {
        id: "page",
        area: ROUTES_AREA,
        data: { path: "/skills-library" },
        render: () => h(ScopedLibrary, { ctx }),
      },
      {
        id: "nav",
        area: SIDEBAR_NAV_AREA,
        order: 15,
        data: {
          path: "/skills-library",
          label: "Skills & Plugins",
          codicon: "library",
        },
      },
      {
        id: "command",
        area: PALETTE_AREA,
        data: {
          id: "hermes-skills-library.open",
          keywords: ["skills", "plugins", "import", "install", "agents"],
          label: "Open Skills & Plugins",
          run: () => host.navigate("/skills-library"),
        },
      },
    ]);
  },
};
