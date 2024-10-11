import{C as m,r as E}from"./chart-BZRWlfz0.js";import{a as C}from"./AxiosInstance--4YUcpg_.js";import{_ as D,r as i,b as F,c as p,a as e,z as r,i as x,F as I,A as P,E as B,o as f,p as M,j as H}from"./index-E7HFo_Uv.js";import"./axios-CCb-kr4I.js";const v=g=>(M("data-v-5ece53ff"),g=g(),H(),g),N={class:"content-container"},W={class:"total-asset"},G={class:"asset-amount"},V={class:"asset-graph-container"},Z=v(()=>e("div",{class:"asset-analysis-nav"},[e("div",{class:"asset-title"},"전체 자산 비교")],-1)),j={class:"asset-graph-container2"},T={class:"graph-container"},q={class:"graph-container-title"},J=v(()=>e("br",null,null,-1)),K={style:{color:"#ff0062"}},O=v(()=>e("canvas",{id:"barChart",class:"chart-size"},null,-1)),Q=v(()=>e("canvas",{id:"radarChart",class:"chart-size"},null,-1)),U={class:"compare-table"},X=v(()=>e("thead",null,[e("tr",null,[e("th",null,"종목"),e("th",null,"나의 자산"),e("th",null,"평균 자산"),e("th",null,"비교")])],-1)),Y={key:0},$={key:1},S="김리치",ee={__name:"AssetComparisonPage",setup(g){m.register(...E);const l=i(0),h=i(0),d=i(0),c=i([]),n=i(!1),s=i(""),L=async()=>{n.value=!0,s.value="";try{const a=await C.get("/finance/fin/sum");if(console.log("Financial Assets Sum Response:",a.data),a.data.success&&a.data.response.data){const o=a.data.response.data.amount;l.value=o,console.log("Current Asset:",l.value)}else s.value="자산 데이터가 올바르지 않습니다."}catch(a){s.value="금융 자산을 가져오는 데 실패했습니다.",console.error("Error fetching financial asset sum:",a)}finally{n.value=!1}},w=async()=>{n.value=!0,s.value="";try{const a=await C.get("/finance/peer");console.log("Peer Data Response:",a.data),a.data.success&&a.data.response.data?(h.value=a.data.response.data.spotAvgAmount,d.value=(l.value-h.value)/1e4,console.log("Peer Average Asset:",h.value),console.log("Asset Difference:",d.value)):s.value="동료 자산 데이터를 가져오는 데 실패했습니다."}catch(a){s.value="동료 자산 데이터를 가져오는 데 실패했습니다.",console.error("Error fetching peer data:",a)}finally{n.value=!1}},z=async()=>{n.value=!0,s.value="";try{const o=(await C.get("/finance/peer/finance")).data.response.data;Array.isArray(o)?c.value=o.map(t=>({category:t.category,myAsset:t.bsAmount,averageAsset:t.spotAvgAmount,difference:t.bsAmount-t.spotAvgAmount})):(console.error("Expected an array but got: ",o),s.value="예상한 배열을 받지 못했습니다.",c.value=[])}catch(a){s.value="금융 자산 비교 데이터를 가져오는 데 실패했습니다.",console.error("Error fetching peer finance data:",a)}finally{n.value=!1}},R=()=>{const a=document.getElementById("barChart").getContext("2d"),o=document.getElementById("radarChart").getContext("2d"),t=c.value.map(u=>u.category),_=c.value.map(u=>u.myAsset/1e4),k=c.value.map(u=>u.averageAsset/1e4),b=a.createLinearGradient(0,0,0,400);b.addColorStop(0,"#ff0062"),b.addColorStop(1,"#ff80b2");const y=o.createLinearGradient(0,0,0,400);y.addColorStop(0,"#ff6384"),y.addColorStop(1,"#ff80b2");const A=o.createLinearGradient(0,0,0,400);A.addColorStop(0,"#4bc0c0"),A.addColorStop(1,"#80e1e1"),new m(a,{type:"bar",data:{labels:["20대 평균","나의 자산"],datasets:[{label:"자산 비교",data:[h.value,l.value],backgroundColor:[b,"rgba(255, 0, 98, 0.7)"],borderColor:"#ff0062",borderWidth:2,hoverBorderWidth:3,hoverBorderColor:"#ff4081",borderRadius:20}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{display:!0,beginAtZero:!0,grid:{drawBorder:!0,color:"rgba(200, 200, 200, 0.3)"}},x:{grid:{display:!1},ticks:{color:"#666",font:{size:16,weight:"bold"}}}},plugins:{legend:{display:!1},tooltip:{backgroundColor:"#ff4081",titleFont:{size:16},bodyFont:{size:14}}}}}),new m(o,{type:"radar",data:{labels:t,datasets:[{label:"나의 자산",data:_,backgroundColor:y,borderColor:"#ff6384",borderWidth:2,pointBackgroundColor:"#ff6384",pointHoverRadius:7,pointHoverBackgroundColor:"#ff0062"},{label:"평균 자산",data:k,backgroundColor:A,borderColor:"#4bc0c0",borderWidth:2,pointBackgroundColor:"#4bc0c0",pointHoverRadius:7,pointHoverBackgroundColor:"#2bc0c0"}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{r:{beginAtZero:!0,min:0,max:Math.max(..._,...k),ticks:{stepSize:1e3,font:{size:11}}}},plugins:{legend:{labels:{font:{size:14,family:"'Pretendard', sans-serif"}}}}}})};return F(async()=>{await L(),await w(),await z(),R()}),(a,o)=>(f(),p("div",N,[e("div",W,[e("div",{class:"asset-title"},r(S)+"님의 자산 현황 😎"),e("div",G,r(l.value?l.value.toLocaleString():0)+"원",1)]),e("div",V,[Z,e("div",j,[e("div",T,[e("div",q,[x(r(S)+"님의 자산은 "),J,x(" 20대 평균보다 "),e("strong",K,r(d.value>0?d.value.toLocaleString()+"만원 많습니다.":Math.abs(d.value).toLocaleString()+"만원 적습니다."),1)]),O]),e("div",{class:"graph-container"},[e("div",{class:"graph-container-title"},r(S)+"님의 카테고리별 자산 비교 "),Q])])]),e("div",U,[e("table",null,[X,e("tbody",null,[(f(!0),p(I,null,P(c.value,(t,_)=>(f(),p("tr",{key:_},[e("td",null,r(t.category),1),e("td",null,r(t.myAsset?t.myAsset.toLocaleString():0)+"원",1),e("td",null,r(t.averageAsset?t.averageAsset.toLocaleString():0)+"원",1),e("td",null,r(t.difference>0?t.difference.toLocaleString()+"원이 더 적습니다.":Math.abs(t.difference).toLocaleString()+"원이 더 많습니다."),1)]))),128))])])]),n.value?(f(),p("div",Y,"로딩 중...")):B("",!0),s.value?(f(),p("div",$,r(s.value),1)):B("",!0)]))}},re=D(ee,[["__scopeId","data-v-5ece53ff"]]);export{re as default};
