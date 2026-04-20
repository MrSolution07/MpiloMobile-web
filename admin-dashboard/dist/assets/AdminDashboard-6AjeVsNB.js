import{c as _,r as l,s as m,j as e}from"./index-XeI5Z7Md.js";import{U as C}from"./users-D3CdQ-uY.js";import{C as E}from"./calendar-HnOMKd7Q.js";import{F}from"./file-text-BX1WLj4t.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]],V=_("activity",G);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]],Y=_("arrow-down",X);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],J=_("arrow-up",B),x=({className:r="",children:i,...n})=>e.jsx("div",{className:`rounded-lg border bg-white shadow-sm ${r}`,...n,children:i}),p=({className:r="",children:i,...n})=>e.jsx("div",{className:`p-6 ${r}`,...n,children:i}),j=({className:r="",children:i,...n})=>e.jsx("div",{className:`flex flex-col space-y-1.5 p-6 ${r}`,...n,children:i}),y=({className:r="",children:i,...n})=>e.jsx("h3",{className:`text-2xl font-semibold leading-none tracking-tight ${r}`,...n,children:i}),N=({className:r="",children:i,...n})=>e.jsx("p",{className:`text-sm text-gray-500 ${r}`,...n,children:i}),K=({value:r=0,className:i="",indicatorClassName:n=""})=>e.jsx("div",{className:`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${i}`,children:e.jsx("div",{className:`h-full w-full flex-1 bg-red-600 transition-all ${n}`,style:{transform:`translateX(-${100-r}%)`}})}),se=()=>{const[r,i]=l.useState([]),[n,T]=l.useState([]),[u,L]=l.useState([]),[z,U]=l.useState([]),[I,v]=l.useState(!0),[w,O]=l.useState(null);l.useEffect(()=>{H()},[]);const H=async()=>{try{v(!0);const{count:t}=await m.from("patients").select("*",{count:"exact",head:!0}),{count:c}=await m.from("medical_records").select("*",{count:"exact",head:!0}),{count:b}=await m.from("doctors").select("*",{count:"exact",head:!0}),o=new Date;o.setDate(1),o.setHours(0,0,0,0);const s=new Date;s.setMonth(s.getMonth()+1),s.setDate(0),s.setHours(23,59,59,999);const{count:W}=await m.from("appointments").select("*",{count:"exact",head:!0}).gte("scheduled_datetime",o.toISOString()).lte("scheduled_datetime",s.toISOString()),$=new Date;$.setHours(0,0,0,0);const S=new Date;S.setHours(23,59,59,999);const{data:D,error:k}=await m.from("appointments").select(`
          id,
          appointment_number,
          scheduled_datetime,
          appointment_type,
          status,
          patient_id,
          doctor_id,
          patients!appointments_patient_id_fkey(first_name, last_name),
          doctors!appointments_doctor_id_fkey(first_name, last_name, specialization)
        `).gte("scheduled_datetime",$.toISOString()).lte("scheduled_datetime",S.toISOString()).order("scheduled_datetime",{ascending:!0});k&&console.error("Error fetching appointments:",k);const{data:A}=await m.from("medical_records").select(`
          id,
          created_at,
          diagnosis,
          patients!medical_records_patient_id_fkey(first_name, last_name),
          doctors!medical_records_doctor_id_fkey(first_name, last_name)
        `).order("created_at",{ascending:!1}).limit(5),{data:f}=await m.from("appointments").select(`
          id,
          doctors!appointments_doctor_id_fkey(specialization)
        `).gte("scheduled_datetime",o.toISOString()).lte("scheduled_datetime",s.toISOString());if(f){const d={};f.forEach(g=>{const h=g.doctors?.specialization||"General";d[h]||(d[h]=0),d[h]++});const a=f.length,q=Object.entries(d).map(([g,h])=>{const M=a>0?Math.round(h/a*100):0;return{department:g,patients:h,percentage:M,capacity:100,utilization:M}});U(q)}if(i([{title:"Total Patients",value:t?.toLocaleString()||"0",icon:C,change:"+0.8%",trend:"up"},{title:"Appointments This Month",value:W?.toLocaleString()||"0",icon:E,change:"+2.1%",trend:"up"},{title:"Medical Records",value:c?.toLocaleString()||"0",icon:F,change:"+1.5%",trend:"up"},{title:"Total Staff",value:b?.toLocaleString()||"0",icon:C,change:"-0.2%",trend:"down"}]),A){const d=A.map(a=>({id:a.id,patient:`${a.patients?.first_name||"Unknown"} ${a.patients?.last_name||"Patient"}`,action:a.diagnosis?`Diagnosis: ${a.diagnosis}`:"Medical record updated",doctor:`${a.doctors?.first_name||"Unknown"} ${a.doctors?.last_name||"Doctor"}`,time:P(a.created_at)}));T(d)}if(D){const d=D.map(a=>({id:a.id,appointmentNumber:a.appointment_number,patient:`${a.patients?.first_name||"Unknown"} ${a.patients?.last_name||"Patient"}`,time:R(a.scheduled_datetime),type:a.appointment_type||"Consultation",doctor:`${a.doctors?.first_name||"Unknown"} ${a.doctors?.last_name||"Doctor"}`,specialty:a.doctors?.specialization||"General",status:a.status||"scheduled"}));L(d)}}catch(t){O(t.message),console.error("Error fetching dashboard data:",t)}finally{v(!1)}},P=t=>{const c=new Date(t),o=Math.floor((new Date-c)/1e3);let s=Math.floor(o/31536e3);return s>=1?`${s} year${s===1?"":"s"} ago`:(s=Math.floor(o/2592e3),s>=1?`${s} month${s===1?"":"s"} ago`:(s=Math.floor(o/86400),s>=1?`${s} day${s===1?"":"s"} ago`:(s=Math.floor(o/3600),s>=1?`${s} hour${s===1?"":"s"} ago`:(s=Math.floor(o/60),s>=1?`${s} minute${s===1?"":"s"} ago`:"just now"))))},R=t=>new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!0});return I?e.jsx("div",{className:"flex justify-center items-center h-64",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"})}):w?e.jsx("div",{className:"flex justify-center items-center h-64",children:e.jsxs("p",{className:"text-red-500",children:["Error loading dashboard: ",w]})}):e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("style",{jsx:!0,children:`
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .card-hover {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
      `}),e.jsx("h1",{className:"mb-6 font-bold text-3xl text-black",children:"Dashboard"}),e.jsx("div",{className:"gap-6 grid sm:grid-cols-2 lg:grid-cols-4",children:r.map((t,c)=>e.jsx(x,{className:"card-hover",children:e.jsxs(p,{className:"p-6 ",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-gray-500 text-sm",children:t.title}),e.jsx("h3",{className:"mt-1 font-bold text-2xl",children:t.value})]}),e.jsx("div",{className:"bg-[#274D60]/10 p-2 rounded-full text-[#274D60]",children:e.jsx(t.icon,{size:20})})]}),e.jsxs("div",{className:"flex items-center mt-3 text-xs",children:[t.trend==="up"?e.jsx(J,{className:"mr-1 w-3 h-3 text-green-600"}):e.jsx(Y,{className:"mr-1 w-3 h-3 text-red-600"}),e.jsx("span",{className:t.trend==="up"?"text-green-600":"text-red-600",children:t.change}),e.jsx("span",{className:"ml-1 text-gray-500",children:"from last month"})]})]})},c))}),e.jsxs("div",{className:"gap-6 grid lg:grid-cols-2 mt-6",children:[e.jsxs(x,{className:"card-hover",children:[e.jsxs(j,{children:[e.jsxs(y,{className:"flex items-center",children:[e.jsx(V,{className:"mr-2 w-5 h-5"}),"Department Workload"]}),e.jsx(N,{children:"Current patient distribution across departments"})]}),e.jsx(p,{children:e.jsx("div",{className:"space-y-4",children:z.map((t,c)=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between items-center mb-1",children:[e.jsx("span",{className:"font-medium text-sm",children:t.department}),e.jsxs("span",{className:"text-gray-500 text-sm",children:[t.patients," patients (",t.percentage,"%)"]})]}),e.jsx(K,{value:t.utilization,className:"h-2 bg-gray-200",indicatorClassName:"bg-red-600"})]},c))})})]}),e.jsxs(x,{className:"card-hover",children:[e.jsxs(j,{children:[e.jsxs(y,{className:"flex items-center",children:[e.jsx(E,{className:"mr-2 w-5 h-5"}),"Today's Appointments (",u.length,")"]}),e.jsx(N,{children:"Today's scheduled appointments across all doctors"})]}),e.jsx(p,{children:e.jsx("div",{className:"space-y-4",children:u.length>0?u.map(t=>e.jsxs("div",{className:"flex justify-between items-center pb-3 last:border-0 border-b",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"font-medium",children:t.patient}),e.jsxs("p",{className:"text-gray-500 text-sm",children:[t.time," - ",t.type]}),e.jsx("p",{className:"text-xs text-blue-600",children:t.specialty})]}),e.jsxs("div",{className:"text-right",children:[e.jsxs("p",{className:"text-sm font-medium",children:["Dr. ",t.doctor]}),e.jsx("p",{className:`text-xs ${t.status==="completed"?"text-green-600":t.status==="cancelled"?"text-red-600":"text-yellow-600"}`,children:t.status})]})]},t.id)):e.jsx("p",{className:"text-gray-500 text-center py-4",children:"No appointments scheduled for today"})})})]})]}),e.jsxs(x,{className:"mt-6 card-hover",children:[e.jsxs(j,{children:[e.jsx(y,{children:"Recent Activity"}),e.jsx(N,{children:"Latest updates from your medical facility"})]}),e.jsx(p,{children:e.jsx("div",{className:"space-y-4",children:n.length>0?n.map(t=>e.jsxs("div",{className:"flex items-center pb-3 last:border-0 border-b",children:[e.jsx("div",{className:"bg-red-600 mr-4 rounded-full w-2 h-2"}),e.jsxs("div",{children:[e.jsxs("p",{className:"text-sm",children:[e.jsx("span",{className:"font-medium",children:t.patient})," - ",t.action]}),e.jsxs("div",{className:"flex mt-1 text-gray-500 text-xs",children:[e.jsxs("span",{children:["Dr. ",t.doctor]}),e.jsx("span",{className:"mx-2",children:"•"}),e.jsx("span",{children:t.time})]})]})]},t.id)):e.jsx("p",{className:"text-gray-500 text-center py-4",children:"No recent activity"})})})]})]})};export{se as default};
