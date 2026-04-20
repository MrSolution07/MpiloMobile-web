import{j as n}from"./index-Da7WEvTm.js";const d=t=>{const e={year:"numeric",month:"short",day:"numeric"};return new Date(t).toLocaleDateString(void 0,e)},g=t=>{const[e,s]=t.split(":"),r=parseInt(e,10),a=r>=12?"PM":"AM";return`${r%12||12}:${s} ${a}`},p=t=>{const e=new Date(t),s={month:"short",day:"numeric",hour:"numeric",minute:"2-digit",hour12:!0};return e.toLocaleString(void 0,s)},u=t=>{const e=new Date().toISOString().split("T")[0];return t===e},m=t=>{const e=new Date;e.setDate(e.getDate()+1);const s=e.toISOString().split("T")[0];return t===s},x=t=>u(t)?"Today":m(t)?"Tomorrow":d(t),y=t=>t.reduce((e,s)=>{const r=s.date;return e[r]||(e[r]=[]),e[r].push(s),e},{}),b=({text:t,variant:e="neutral",size:s="medium"})=>{const r=`
    inline-flex items-center justify-center
    font-medium rounded-full
    whitespace-nowrap break-words
    text-center
  `,a={primary:"bg-blue-100 text-blue-800",success:"bg-green-100 text-green-800",warning:"bg-yellow-100 text-yellow-800",danger:"bg-red-100 text-red-800",info:"bg-cyan-100 text-cyan-800",neutral:"bg-gray-100 text-gray-800"},o={small:"text-xs px-2 py-0.5",medium:"text-sm px-3 py-1",large:"text-base px-4 py-1.5"},i=`${r} ${a[e]} ${o[s]}`;return n.jsx("span",{className:i,children:t})},h=({children:t,className:e="",padding:s="medium",bordered:r=!0,hoverable:a=!1,onClick:o})=>{const c=`
    bg-white rounded-lg shadow-sm
    ${r?"border border-gray-200":""}
    ${a?"transition-shadow hover:shadow-md":""}
    ${{none:"p-0",small:"p-3",medium:"p-4",large:"p-6"}[s]}
    ${o?"cursor-pointer":""}
    ${e}
  `;return n.jsx("div",{className:c,onClick:o,children:t})},w=({children:t,className:e=""})=>n.jsx("div",{className:`mb-4 ${e}`,children:t}),f=({children:t,className:e=""})=>n.jsx("h3",{className:`text-lg font-semibold text-gray-900 ${e}`,children:t}),$=({children:t,className:e=""})=>n.jsx("div",{className:e,children:t}),C=({children:t,className:e=""})=>n.jsx("div",{className:`mt-4 pt-3 border-t border-gray-100 ${e}`,children:t});export{b as B,h as C,w as a,f as b,$ as c,C as d,p as e,g as f,y as g,x as h,u as i,d as j};
