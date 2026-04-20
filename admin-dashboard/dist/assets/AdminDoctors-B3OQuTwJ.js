import{c as v,a as N,r as i,s as m,j as e}from"./index-XeI5Z7Md.js";import{P as w}from"./plus-JIHek6Ds.js";import{S as y}from"./search-DubjUncW.js";import{F as C}from"./funnel-Mk8z23EH.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"m16 11 2 2 4-4",key:"9rsbq5"}],["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],_=v("user-check",k),h=({className:t="",variant:a="default",size:r="default",children:l,...o})=>{const d="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",n={default:"bg-red-600 text-white hover:bg-red-700",outline:"border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900",ghost:"hover:bg-gray-100 hover:text-gray-900",destructive:"bg-red-600 text-white hover:bg-red-700"},c={default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"};return e.jsx("button",{className:`${d} ${n[a]} ${c[r]} ${t}`,...o,children:l})},L=({className:t="",...a})=>e.jsx("input",{className:`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${t}`,...a}),p=({className:t="",children:a,...r})=>e.jsx("div",{className:`rounded-lg border bg-white text-gray-900 shadow-sm ${t}`,...r,children:a}),g=({className:t="",children:a,...r})=>e.jsx("div",{className:`p-6 ${t}`,...r,children:a}),$=({className:t="",children:a,...r})=>e.jsx("div",{className:`flex flex-col space-y-1.5 p-6 ${t}`,...r,children:a}),S=({className:t="",children:a,...r})=>e.jsx("h3",{className:`text-2xl font-semibold leading-none tracking-tight ${t}`,...r,children:a}),D=({className:t="",children:a,...r})=>e.jsx("p",{className:`text-sm text-gray-500 ${t}`,...r,children:a}),H=()=>{const t=N(),[a,r]=i.useState(""),[l,o]=i.useState([]),[d,n]=i.useState(!0),[c,b]=i.useState(null);i.useEffect(()=>{x();const s=m.channel("doctors_changes").on("postgres_changes",{event:"*",schema:"public",table:"doctors"},()=>{x()}).subscribe();return()=>m.removeChannel(s)},[]);const x=async()=>{try{n(!0);const{data:s,error:u}=await m.from("doctors").select("*").order("created_at",{ascending:!1});if(u)throw u;o(s||[])}catch(s){b(s.message),console.error("Error fetching doctors:",s)}finally{n(!1)}},f=a?l.filter(s=>`${s.first_name} ${s.last_name}`.toLowerCase().includes(a.toLowerCase())||s.specialization?.toLowerCase().includes(a.toLowerCase())||s.doctor_number?.toLowerCase().includes(a.toLowerCase())||s.email?.toLowerCase().includes(a.toLowerCase())):l,j=()=>{t("/admin/adminadddoctor")};return d?e.jsx("div",{className:"flex justify-center items-center h-64",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"})}):c?e.jsx("div",{className:"flex justify-center items-center h-64 px-4",children:e.jsxs("p",{className:"text-red-500 text-center",children:["Error loading doctors: ",c]})}):e.jsxs("div",{className:"animate-fade-in px-2 py-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 w-full max-w-screen-2xl mx-auto",children:[e.jsx("style",{jsx:!0,children:`
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .status-active {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: #dcfce7;
          color: #166534;
        }
        
        .status-inactive {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: #fee2e2;
          color: #991b1b;
        }
        
        .status-leave {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: #fef3c7;
          color: #92400e;
        }
      `}),e.jsxs("div",{className:"mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",children:[e.jsx("span",{className:"text-3xl sm:text-3xl text-black font-bold",children:"Doctors"}),e.jsxs(h,{onClick:j,className:"w-full sm:w-auto",children:[e.jsx(w,{className:"mr-2 h-4 w-4"})," Add Doctor"]})]}),e.jsxs(p,{className:"w-full",children:[e.jsxs($,{className:"pb-3",children:[e.jsx(S,{children:"Medical Staff"}),e.jsx(D,{children:"Manage doctors and medical staff in your facility"})]}),e.jsxs(g,{className:"p-2 sm:p-4 md:p-6",children:[e.jsxs("div",{className:"mb-4 flex flex-col gap-2 sm:flex-row",children:[e.jsxs("div",{className:"relative flex-1 min-w-0",children:[e.jsx(y,{className:"absolute left-3 top-3 h-4 w-4 text-gray-500"}),e.jsx(L,{placeholder:"Search doctors...",className:"pl-9 w-full",value:a,onChange:s=>r(s.target.value)})]}),e.jsxs(h,{variant:"outline",className:"flex gap-2 w-full sm:w-auto",children:[e.jsx(C,{className:"h-4 w-4"})," Filter"]})]}),e.jsx("div",{className:"grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",children:f.map(s=>e.jsx(p,{className:"hover:shadow-md transition-shadow w-full",children:e.jsxs(g,{className:"p-4 sm:p-6",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row items-start justify-between mb-4 gap-2",children:[e.jsxs("div",{className:"flex items-center w-full sm:w-auto",children:[e.jsx("div",{className:"rounded-full bg-red-100 p-3 text-red-600 mr-3",children:e.jsx(_,{className:"h-6 w-6"})}),e.jsxs("div",{children:[e.jsxs("h3",{className:"font-medium text-base sm:text-lg",children:[s.first_name," ",s.last_name]}),e.jsx("p",{className:"text-xs sm:text-sm text-gray-500",children:s.specialization})]})]}),e.jsx("div",{className:"flex gap-1"})]}),e.jsxs("div",{className:"space-y-1 text-xs sm:text-sm",children:[e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"ID:"})," ",e.jsx("span",{className:"break-all",children:s.doctor_number})]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"License:"})," ",e.jsx("span",{className:"break-all",children:s.license_number})]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"HPCSA:"})," ",e.jsx("span",{className:"break-all",children:s.hpcsa_number})]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Experience:"})," ",s.experience_years," years"]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Consultation Fee:"})," R",s.consultation_fee]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Languages:"})," ",s.languages?.join(", ")||"English"]})]}),e.jsxs("div",{className:"mt-4 flex flex-col sm:flex-row items-center justify-between gap-2",children:[e.jsx("span",{className:(s.is_available?"status-active":"status-inactive")+" px-2 py-1 text-xs font-semibold whitespace-nowrap",children:s.is_available?"Available":"Not Available"}),e.jsxs("span",{className:"text-xs text-gray-500",children:["Rating: ",s.rating||"0","/5 (",s.total_reviews||"0"," reviews)"]})]})]})},s.id))}),f.length===0&&e.jsx("div",{className:"py-8 text-center text-gray-500",children:l.length===0?"No doctors found":"No doctors match the current search"})]})]})]})};export{H as default};
