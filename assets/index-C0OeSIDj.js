(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();function k(r,t=1){const e=new Date(r.getFullYear(),0,1);let n=e.getDay()-t;n=n>=0?n:n+7;const i=Math.floor((r.getTime()-e.getTime()-(r.getTimezoneOffset()-e.getTimezoneOffset())*6e4)/864e5)+1;let s;if(n<4){if(s=Math.floor((i+n-1)/7)+1,s>52){let c=new Date(r.getFullYear()+1,0,1).getDay()-t;c=c>=0?c:c+7,s=c<4?1:53}}else s=Math.floor((i+n-1)/7);return s}function U(r){return r.toISOString().split("T")[0]}function j(r){const t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],e=["January","February","March","April","May","June","July","August","September","October","November","December"],n=t[r.getDay()],i=e[r.getMonth()],s=r.getDate(),o=r.getFullYear();return`${n}, ${i} ${s}, ${o}`}function q(r){let t=r.getHours();const e=r.getMinutes().toString().padStart(2,"0"),n=t>=12?"PM":"AM";return t=t%12,t=t||12,`${t}:${e} ${n}`}function O(r){const e=r.split(",")[1].trim(),n=e.split(" "),i=n[0].substring(0,3),s=n[1];return{shortest:"TODAY",short:`TODAY, ${i} ${s}`,medium:`TODAY, ${i} ${s}`,full:`TODAY, ${e}`,justEmoji:"📅",withEmoji:`📅 ${s} TODAY`,justDate:`${i} ${s}`}}function x(r){const t=r.split(","),e=t[0].trim(),i=t[1].trim().split(" "),s=i[0].substring(0,3),o=i[1],c=parseInt(o,10);let d="";const a=["🗓️","🌈","☀️","🌟","🌙","🚀","⚡"];return d=a[c%a.length],{shortest:e.substring(0,3),short:`${e.substring(0,3)}, ${s} ${o}`,medium:`${e}, ${s} ${o}`,full:r,justEmoji:`${d}`,withEmoji:`${d} ${o} ${e.substring(0,3)}`,justDate:`${s} ${o}`}}const y={INFO_BUTTON:"infoButton",INFO_MODAL:"infoModal",EVENT_LIST:"eventList"},f={DAY_CONTAINER:"day-container",DAY_HEADER:"day-header",EVENT_DAY_CONTAINER:"event-day-container",EVENTBOX:"event-box",EVENT_IMAGE:"event-image",EVENT_TAG:"event-tag",EVENT_DETAILS:"event-details",EVENT_TITLE:"event-title",EVENT_DATE:"event-date",EVENT_LOCATION:"event-location",MODAL_CLOSE:"close",MODAL_CONTENT:"modal-content"},B={FILTERS_CHANGED:"filtersChangedEvent"},$="https://picsum.photos/400/300";function M(r){return r.toLowerCase().replace(/[★*]/g,"").trim()}function Y(r,t,e){const n=e+1;if(r.length<n||t.length<n)return!1;const i=r.toLowerCase(),s=t.toLowerCase();let o,c;i.length<=s.length?(o=i,c=s):(o=s,c=i);const d=new Set,a=o.length-n;for(let l=0;l<=a;l++){const u=o.substring(l,l+n);d.add(u)}const h=c.length-n;for(let l=0;l<=h;l++){const u=c.substring(l,l+n);if(d.has(u))return console.log(`Found duplicate strings:
A: ${r}
B: ${t}`),!0}return!1}const P=["Dining Week","VEGA"],F={HUSET:["Husets Biograf"],"Husets Biograf":["HUSET"]},z=13;function G(r,t){return Array.from(t).some(e=>{var u,m;if(e.date.start.getTime()!==r.date.start.getTime())return!1;const n=e.source.pageName,i=r.source.pageName,s=n===i,o=((u=F[n])==null?void 0:u.includes(i))||((m=F[i])==null?void 0:m.includes(n));if(!s&&!o)return!1;if(P.includes(n))return!0;const c=e.name.toLowerCase().trim(),d=r.name.toLowerCase().trim();if(c===d)return!0;const h=M(r.name),l=M(e.name);return h.includes(l)||l.includes(h)?!0:Y(h,l,z)})}const W="/resources/eventsJSON/",X=4;class J{async loadEventsAsync(t,e,n){const[i,s]=await Promise.all([this.fetchWeekEvents(e),this.fetchWeekEvents(n)]);return this.processEvents([...i,...s],e,n)}async fetchWeekEvents(t){function e(o){return{id:o.id,name:o.name,description:o.description,category:o.page_name==="CPH DOX"?"CPH:DOX":o.tag,date:{start:new Date(o.date.start_timestamp*1e3),end:new Date(o.date.end_timestamp*1e3),timezone:o.date.timezone},location:{name:o.location.name,fullAddress:o.location.address,city:o.location.city,district:o.location.copenhagen_district,country:o.location.country,coordinates:{latitude:o.location.latitude,longitude:o.location.longitude,bounds_ne_lat:o.location.bounds_ne_lat,bounds_ne_lng:o.location.bounds_ne_lng,bounds_sw_lat:o.location.bounds_sw_lat,bounds_sw_lng:o.location.bounds_sw_lng,plus_code_global:o.location.plus_code_global,plus_code_local:o.location.plus_code_local,plus_code_locality:o.location.plus_code_locality}},media:{imageUrl:o.image_url,videoUrl:o.video_url},source:{url:o.url,pageName:o.page_name,pageUrl:o.page_url,platform:o.platform}}}const n=k(t,1).toString().padStart(2,"0"),i=t.getFullYear().toString(),s=W+`${i}-W${n}.json`;return console.log("Attempting to Load Events from file_name",s),fetch(s).then(o=>o.ok?o.json():[]).then(o=>o.map(e)).catch(o=>(console.error("Error loading events:",o),console.error("Stack trace:",o.stack),[]))}processEvents(t,e,n){const i=new Map,s=new Date;return t.filter(c=>{var l;const d=c.date.start;if(d<new Date(s.getTime()-X*60*60*1e3)||d>n)return!1;const a=U(d);if(!i.has(a))return i.set(a,[]),(l=i.get(a))==null||l.push(c),!0;const h=i.get(a)||[];return G(c,h)?!1:(h.push(c),!0)}).sort((c,d)=>c.date.start.getTime()-d.date.start.getTime())}}class K{constructor(){this.hasInitialized=!1,this.dates=new Set,this.events=new Map,this.eventsHTML=new Map,this.scrollListeners=[()=>this.updateNavBar()],this.resizeListeners=[()=>this.updateNavBar()],this.onScroll=()=>{this.scrollListeners.forEach(t=>t())},this.onResize=()=>{this.resizeListeners.forEach(t=>t())}}generateEventsHTML(t){if(this.events.values.length>0)throw new Error("generateEventsHTML should only be called once! The events map already contains events.");t.forEach(n=>{this.events.set(n.id,n)});const e=document.getElementById(y.EVENT_LIST);if(!e){console.error(`HTML Page needs DIV ${y.EVENT_LIST}`);return}e.innerHTML=Object.entries(t.reduce((n,i)=>{const s=j(i.date.start);return this.dates.add(s),n[s]=n[s]||[],n[s].push(i),n},{})).map(([n,i])=>`
        <div class="${f.DAY_CONTAINER}" data-date="${n}">
            <div class="${f.DAY_HEADER}" data-date="${n}">
            </div>
          <div class="${f.EVENT_DAY_CONTAINER}">
            ${i.map(s=>`
                <div class="${f.EVENTBOX}" data-id="${s.id}"
                    onmousedown="if(event.button === 0 || event.button === 1) { window.open('${s.source.url}', '_blank'); return false; }"
                    style="cursor: pointer; display: none">
                 <img 
                    src="${s.media.imageUrl||$}" 
                    class="${f.EVENT_IMAGE}" 
                    loading="lazy" 
                    alt="${s.name}"
                    data-uses-placeholder="false"
                    onerror="this.onerror=null; this.src='${$}'; this.dataset.usesPlaceholder='true'"
                  >
                  <div class="${f.EVENT_TAG}" data-filter="${s.category}">${s.category}</div>
                  <div class="${f.EVENT_DETAILS}">
                    <div class="${f.EVENT_TITLE}">${s.name}</div>
                    <div class="${f.EVENT_DATE}">📆 ${q(s.date.start)}</div>
                    <div class="${f.EVENT_LOCATION}">📍 ${s.source.pageName==="CPH DOX"?s.location.name+" ("+s.location.district+")":s.source.pageName+" ("+s.location.district+")"}</div>
                  </div>
                </div>
              `).join("")}
          </div>
            <div class = "day-filtered-container" style="display: none;">
                <div class="day-filtered-message">
                    <span>Some events hidden by your current filters</span>
                </div>
            </div>
        </div>
        `).join(""),document.querySelectorAll(`.${f.EVENTBOX}`).forEach(n=>{const i=n.getAttribute("data-id");if(i===null)throw new Error(`HTML event ${n} block did not have Event ID!!`);this.eventsHTML.set(i,n)})}generateNavBarHTML(){const t=document.getElementById("day-nav-container");if(!t)throw new Error('Nav Container must exist! Element with ID "day-nav-container" not found.');if(t.children.length>0)throw new Error("Nav Container already has children! It should only be generated once.");this.createNavBar(t),this.scrollListeners.push(this.updateNavBar),this.resizeListeners.push(this.updateNavBar)}createNavBar(t){let e=document.getElementsByClassName(f.DAY_HEADER);for(let n=0;n<=6;n++){const i=document.createElement("button");i.className="day-nav-button",i.innerHTML="",n===0&&i.classList.add("current"),i.addEventListener("click",s=>{s.stopPropagation();const c=n==0?0:e[n].getBoundingClientRect().top+window.scrollY+-60-20;window.scrollTo({top:c,behavior:"smooth"})}),t.appendChild(i)}this.updateNavBarButtons()}updateNavBar(){this.updateNavBarStyle(),this.updateNavBarButtons()}updateNavBarStyle(){const t=document.getElementById("day-nav-container");if(!t)return;t.getBoundingClientRect(),window.scrollY>100?t.classList.contains("sticky")||t.classList.add("sticky"):t.classList.contains("sticky")&&t.classList.remove("sticky");const e=t.querySelectorAll(".day-nav-button");let n=document.getElementsByClassName("day-container"),i=0,s=1/0;const o=100,c=t.offsetHeight||50;let d=-1;for(let a=0;a<n.length;a++){const l=n[a].getBoundingClientRect();if(l.top-c<=0&&l.bottom>0){d=a;break}}if(i=d,d!==-1){if(d<n.length-1){const l=n[d+1].getBoundingClientRect();l.top>0&&l.top<100&&(i=d+1)}}else for(let a=0;a<n.length;a++){const l=n[a].getBoundingClientRect();if(l.top>0){const u=l.top;u<s&&(s=u,i=a)}if(l.bottom<0&&Math.abs(l.bottom)<o){const u=Math.abs(l.bottom);u<s&&(s=u,i=a)}}e.forEach((a,h)=>{h===i?a.classList.add("current"):a.classList.remove("current")})}updateNavBarButtons(){const t=document.getElementById("day-nav-container");if(!t)return;const e=window.innerWidth,n=e<768,i=160,s=120;let o,c=e/(n?3:7);c>=i?o="full":c>=s?o="medium":o="short";const d=t.querySelectorAll(".day-nav-button");let a=Array.from(this.dates);const h=Array.from(d).findIndex(l=>l.classList.contains("current"));n?d.forEach((l,u)=>{let m=!1,T=-1;if(h===0?(m=u<3,T=u):h>=a.length-1?(m=u>=d.length-3,T=a.length-(d.length-u)):(m=u>=h-1&&u<=h+1,T=u===h-1?h-1:u===h?h:h+1),l.style.display=m?"flex":"none",m&&T>=0&&T<a.length){const N=a[T],D=T===0?O(N):x(N);let V=D.justEmoji+" "+D.shortest;l.innerHTML=V}}):(console.log("letsgo"),d.forEach((l,u)=>{if(l.style.display="flex",u<a.length){const m=a[u],N=u===0?O(m):x(m);let I;o==="full"?I=`${N.withEmoji.split(" ")[0]} ${N.medium}`:o==="medium"?I=`${N.withEmoji.split(" ")[0]} ${N.short}`:I=N.withEmoji,l.innerHTML=I}}))}registerInfoModalInteraction(){const t=document.getElementById(y.INFO_BUTTON),e=document.getElementById(y.INFO_MODAL);if(!t||!e){console.error("Info button or modal not found");return}const n=e.querySelector(`.${f.MODAL_CLOSE}`),i=e.querySelector(`.${f.MODAL_CONTENT}`);t.addEventListener("click",()=>{e.style.display="block",document.body.style.overflow="hidden",document.body.classList.add("modal-open")}),n&&n.addEventListener("click",()=>{e.style.display="none",document.body.style.overflow="",document.body.classList.remove("modal-open")}),window.addEventListener("click",s=>{s.target===e&&(e.style.display="none",document.body.style.overflow="",document.body.classList.remove("modal-open"))}),e.addEventListener("touchend",s=>{s.target===e&&(s.preventDefault(),s.stopPropagation(),e.style.display="none",document.body.style.overflow="",document.body.classList.remove("modal-open"))},{passive:!1}),i&&i.addEventListener("touchmove",function(s){s.stopPropagation()},{passive:!1})}applyFilters(){if(this.events.size===0||!this.activeFilters||this.activeFilters.length===0)return;this.events.forEach((n,i)=>{const s=this.activeFilters.every(c=>c.isEventVisible(n)),o=this.eventsHTML.get(i);if(o==null)throw new Error(`Could not find HTML element with Event ID: ${i}`);o.style.display=s?"flex":"none"});const t=document.querySelectorAll(`.${f.DAY_CONTAINER}`),e=t[0];if(e){const n=e.querySelectorAll(`.${f.EVENTBOX}`),i=new Date;n.forEach(s=>{const o=s.getAttribute("data-id");if(o&&this.events.has(o)){const c=this.events.get(o);c&&new Date(c.date.start)<i&&s.classList.add("event-has-begun")}})}t.forEach(n=>{const i=n.querySelectorAll(`.${f.EVENTBOX}`),s=n.querySelectorAll(`.${f.EVENTBOX}[style*="display: flex"]`),o=i.length>0&&s.length<i.length,c=i.length-s.length,d=n.querySelector(".day-filtered-container");if(d===null)throw new Error("Filtered message element not found");if(o){const a=d.querySelector("span");a&&(a.textContent=`${c} Events Hidden by your Filters`),d.style.display="flex"}else d.style.display="none"}),this.updateFilterIndicator()}updateFilterIndicator(){const t=document.getElementById(y.INFO_BUTTON);if(!t||!this.activeFilters)throw new Error("Info button or active filters not found");const e=this.activeFilters.some(n=>Array.from(this.events.values()).some(i=>!n.isEventVisible(i)));t.classList.toggle("has-filters",e)}checkAdblockerMessingWithImages(t=0){const e=document.querySelectorAll('.event-box[style*="display: flex"] img');if(Array.from(e).filter(s=>s.dataset.usesPlaceholder==="true").length>=8&&e.length>0){const s=document.getElementById(y.EVENT_LIST);if(s&&!document.querySelector(".adblocker-notice")){const o=document.createElement("div");o.className="adblocker-notice",o.innerHTML=`
                    <p>⚠️ If you don't see the proper event images, try disabling your adblocker. We don't run ads, don't worry :)</p>
                `,s.insertAdjacentElement("beforebegin",o)}}else t<3&&setTimeout(()=>this.checkAdblockerMessingWithImages(t+1),1e3)}toggleLoadingSpinner(t){const e=document.querySelector(".loading-spinner");if(e===null){console.error("Loading spinner element not found in the DOM");return}e.style.display=t?"block":"none"}toggleEventContainerVisibility(t){const e=document.getElementById(y.EVENT_LIST);if(e===null)throw new Error(`${y.EVENT_LIST} Not Found!`);e.style.display=t?"":"none"}async initialize(t){if(this.hasInitialized)throw new Error("Cannot Initialize EventDisplay twice!");this.hasInitialized=!0,this.toggleLoadingSpinner(!0),this.toggleEventContainerVisibility(!1);const e=new J,n=new Date;n.setHours(0,0,0,0);const i=new Date(n.getTime());i.setDate(i.getDate()+6),i.setHours(23,59,59,999);const s=await e.loadEventsAsync(t,n,i);this.generateEventsHTML(s),this.generateNavBarHTML(),window.addEventListener("scroll",this.onScroll),window.addEventListener("resize",this.onResize),this.registerInfoModalInteraction(),this.checkAdblockerMessingWithImages(),this.addFilterInfoBox(),await this.initializeFilters(),this.toggleLoadingSpinner(!1),this.applyFilters(),this.toggleEventContainerVisibility(!0),document.addEventListener(B.FILTERS_CHANGED,()=>this.applyFilters())}addFilterInfoBox(){var i,s;const t=document.getElementById(y.EVENT_LIST);if(!t)return;const e="cph_filter_info_dismissed_8a7b6c5d4e3f2g1h";if(localStorage.getItem(e)==="permanent")return;const n=document.createElement("div");n.id="filterInfoBox",n.className="filter-info-box",n.innerHTML=`
            <div class="filter-info-content">
                <svg class="filter-info-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div class="filter-info-text">
                    <p>Click the <strong>gear icon</strong> to filter events!</p>
                    <p>You can enable or disable <strong>neighborhoods</strong> and <strong>event categories</strong> to see exactly what interests you!</p>
                    <small><i>You might want to hide CPH:DOX...</i></small>
                </div>
                <div class="filter-info-buttons">
                    <button id="dismissUntilReload" class="dismiss-filter-info">OK</button>
                    <button id="dismissPermanently" class="dismiss-filter-info permanent">Never show again</button>
                </div>
            </div>
            <style>
                .filter-info-box {
                    margin: 20px 0;
                    padding: 15px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #64b5f6;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .filter-info-content {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                }
                
                .filter-info-icon {
                    flex-shrink: 0;
                    margin-right: 15px;
                    color: #64b5f6;
                }
                
                .filter-info-text {
                    font-family: "Roboto Condensed", sans-serif;
                    color: #333;
                    line-height: 1.4;
                    flex: 1;
                }
                
                .filter-info-text p {
                    margin: 0 0 8px 0;
                }
                
                .filter-info-text p:last-child {
                    margin-bottom: 0;
                }
                
                .filter-info-text strong {
                    font-weight: 600;
                }
                
                .filter-info-buttons {
                    display: flex;
                    gap: 10px;
                    margin-left: 15px;
                }
                
                .dismiss-filter-info {
                    background-color: #64b5f6;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px 12px;
                    font-family: "Roboto Condensed", sans-serif;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    width: 200px;
                }
                
                .dismiss-filter-info.permanent {
                    background-color: #f44336;
                }
                
                .dismiss-filter-info:hover {
                    background-color: #4a90e2;
                }
                
                .dismiss-filter-info.permanent:hover {
                    background-color: #d32f2f;
                }
                
                @media screen and (max-width: 768px) {
                    .filter-info-box {
                        padding: 12px;
                    }
                    
                    .filter-info-icon {
                        width: 20px;
                        height: 20px;
                        margin-right: 10px;
                    }
                    
                    .filter-info-text {
                        font-size: 0.9rem;
                    }
                    
                    .filter-info-buttons {
                        margin-top: 10px;
                        margin-left: 0;
                        width: 100%;
                        justify-content: space-between;
                    }
                    
                    .dismiss-filter-info {
                        flex: 1;
                    }
                }
            </style>
        `,t.insertAdjacentElement("beforebegin",n),(i=document.getElementById("dismissUntilReload"))==null||i.addEventListener("click",()=>{n.style.display="none"}),(s=document.getElementById("dismissPermanently"))==null||s.addEventListener("click",()=>{n.style.display="none",localStorage.setItem(e,"permanent")})}}function Q(r,t){r.className=t.join(" ")}function H(r,t){Object.entries(t).forEach(([e,n])=>{r.dataset[e]=n})}function Z(r,t){t.forEach(({event:e,handler:n})=>{r.addEventListener(e,n)})}function v(r,t){const e=document.createElement(r);return t&&(t.classes&&Q(e,t.classes),t.data&&H(e,t.data),t.text&&(e.textContent=t.text),t.attributes&&Object.entries(t.attributes).forEach(([n,i])=>{e.setAttribute(n,i)}),t.eventListeners&&Z(e,t.eventListeners)),e}function R(r,t,e,n){return v("button",{text:r,classes:Array.isArray(e)?e:[e],...n?{data:n}:{},eventListeners:[{event:"click",handler:t}]})}function tt(r){const t=v("div",{classes:[r.containerClass]}),e=v("div",{classes:[r.labelClass]});if(r.labelUrl){const o=v("a",{text:r.labelText,attributes:{href:r.labelUrl,target:"_blank"}});e.appendChild(o)}else e.textContent=r.labelText;const n=v("label",{classes:[r.toggleClass]}),i=v("input",{attributes:{type:"checkbox"},eventListeners:[{event:"change",handler:r.onChange}]});i.checked=r.checked,r.dataAttributes&&H(i,r.dataAttributes);const s=v("span",{classes:[r.sliderClass]});return n.appendChild(i),n.appendChild(s),t.appendChild(e),t.appendChild(n),t}class et{}const g=class g{};g.FILTER_SECTION="filter-section",g.FILTER_HEADER="filter-header",g.FILTER_CONTROLS="filter-controls",g.CONTROL_BTN="control-btn",g.ACTIVE="active",g.BUTTON="button",g.CONTROL_BTN_ENABLED="enable",g.CONTROL_BTN_DISABLED="disable";let p=g;const C=class C extends et{constructor(t,e){if(super(),this.filterElements=new Map,this.filterElementsContainer=null,this.controlBtnContainer=null,console.log(`Attempting to Initialize filter with name ${t.name}`),(t.name!==""&&C.allFiltersNames.includes(t.name)==!1)==!1)throw new Error(`Filter with Name "${t.name}" already exists or has an invalid ID.`);this.uniqueName=t.name,C.allFiltersNames.push(this.uniqueName),this.data=this.loadFromStorage()??t,(this.data.version<t.version||this.data.version==null)&&(this.data=t),this.data.filters=Object.fromEntries(Object.entries(this.data.filters).sort(([i],[s])=>i.localeCompare(s))),this.generateHTML(e),this.onFiltersChanged()}loadFromStorage(){let t=localStorage.getItem(this.uniqueName);if(t==null)return null;try{return JSON.parse(t)}catch{return null}}saveToStorage(){localStorage.setItem(this.uniqueName,JSON.stringify(this.data)),this.onFiltersChanged()}onFiltersChanged(){this.filterElements.forEach((t,e)=>{const n=this.getFilterEnabled(e);t(n)}),this.updateHeader(),document.dispatchEvent(new Event(B.FILTERS_CHANGED))}updateHeader(){const t=Object.keys(this.data.filters).length,e=Object.entries(this.data.filters).filter(([i,s])=>s.enabled).length,n=document.getElementById(`${this.uniqueName}Header`);n&&(n.textContent=`${this.data.name}: ${e}/${t}`)}getFilterEnabled(t){if(this.data.filters==null)throw new Error(`Items dictionary undefined in filter "${this.uniqueName}"`);if(!(t in this.data.filters))throw new Error(`Item key "${t}" does not exist in filter "${this.uniqueName}"`);return this.data.filters[t].enabled}setFilterEnabled(t,e){if(this.data.filters==null)throw new Error(`Items dictionary undefined in filter "${this.uniqueName}"`);if(!(t in this.data.filters))throw new Error(`Item key "${t}" does not exist in filter "${this.uniqueName}"`);this.data.filters[t].enabled=e,this.saveToStorage()}toggleFilterEnabled(t){this.setFilterEnabled(t,!this.getFilterEnabled(t))}setAllFiltersEnabled(t){if(this.data.filters==null)throw new Error(`Items dictionary undefined in filter "${this.uniqueName}"`);for(const e in this.data.filters)this.data.filters[e].enabled=t;this.saveToStorage()}generateHTML(t){this.generateContainerHTML(t),this.generateControlBtnHTML(),this.generateFiltersHTML()}generateContainerHTML(t){const e=document.createElement("div");e.className=p.FILTER_SECTION,t.appendChild(e);const n=document.createElement("div");n.className=p.FILTER_HEADER,e.appendChild(n);const i=document.createElement("h3");i.id=`${this.uniqueName}Header`,i.textContent=this.data.name,n.appendChild(i);const s=document.createElement("div");s.className=p.FILTER_CONTROLS,this.controlBtnContainer=s,n.appendChild(s);const o=document.createElement("div");o.className=this.getFiltersContainerClass(),e.appendChild(o),this.filterElementsContainer=o}generateControlBtnHTML(){this.addControlButton("All",()=>this.setAllFiltersEnabled(!0),p.CONTROL_BTN_ENABLED),this.addControlButton("None",()=>this.setAllFiltersEnabled(!1),p.CONTROL_BTN_DISABLED)}addFilterElement(t,e,n){e&&n&&this.filterElements.set(e,n),t instanceof HTMLElement&&this.addHTMLElement(t)}addHTMLElement(t){if(this.filterElementsContainer===null)throw new Error(`Filter ${this.uniqueName} control container HTML is null!`);this.filterElementsContainer.appendChild(t)}addControlButton(t,e,n){if(this.controlBtnContainer===null)throw new Error(`Filter ${this.uniqueName} button container HTML is null!`);const i=R(t,e,n?[p.CONTROL_BTN,n]:[p.CONTROL_BTN]);this.controlBtnContainer.appendChild(i)}};C.allFiltersNames=[];let S=C;const b=class b{};b.FILTER_MAP_CONTAINER="filter-map-container",b.MAP_DISTRICT="map-district",b.MAP_LABEL="map-label",b.SELECTED="selected",b.UNSELECTED="unselected";let E=b;class nt extends S{getFiltersContainerClass(){return E.FILTER_MAP_CONTAINER}generateFiltersHTML(){const t=document.createElement("div");this.addHTMLElement(t),this.mapContainer=t,console.log(`Attempting to load SVG map from: ${this.data.svgPath}`),this.loadSvgMap(this.data.svgPath)}async loadSvgMap(t){if(this.mapContainer==null)throw new Error("Map container not initialized");try{const e=await fetch(t);if(!e.ok)throw new Error(`Failed to fetch SVG: ${e.status} ${e.statusText}`);const n=await e.text();this.mapContainer.innerHTML=n,this.setupDistrictElements(),this.onFiltersChanged()}catch(e){console.error("Error loading map:",e),this.mapContainer&&(this.mapContainer.innerHTML="<p>Failed to load map</p>")}}setupDistrictElements(){if(!this.mapContainer)return;this.mapContainer.querySelectorAll("[data-district]").forEach(e=>{var s;const n=e.getAttribute("data-district");if(!n||!(e instanceof SVGPathElement||e instanceof SVGCircleElement))return;const i=(s=this.mapContainer)==null?void 0:s.querySelector(`rect[data-district="${n}"]`);e.addEventListener("click",()=>this.toggleFilterEnabled(n)),this.addFilterElement(e,n,o=>{this.updateDistrictStyle(e,o,i)})})}updateDistrictStyle(t,e,n){t.classList.remove(e?E.UNSELECTED:E.SELECTED),t.classList.add(e?E.SELECTED:E.UNSELECTED),n&&(n.classList.remove(e?E.UNSELECTED:E.SELECTED),n.classList.add(e?E.SELECTED:E.UNSELECTED))}createSvgElement(t,e){const n=document.createElementNS("http://www.w3.org/2000/svg",t);return e&&Object.entries(e).forEach(([i,s])=>{n.setAttribute(i,s)}),n}}const A=class A{};A.FILTER_BUTTON_CONTAINER="filter-buttons-list",A.FILTER_BUTTON="filter-button";let _=A;class st extends S{getFiltersContainerClass(){return _.FILTER_BUTTON_CONTAINER}generateFiltersHTML(){console.assert(this.data.filters!=null,`Filter ${this.uniqueName} cannot find any items in LocalStorage`),Object.keys(this.data.filters).forEach(t=>{const e=R(t,()=>{this.toggleFilterEnabled(t)},_.FILTER_BUTTON,{filter:t});this.addFilterElement(e,t,n=>{e.classList.toggle(p.ACTIVE,n)})})}}const w=class w{};w.FILTER_TOGGLE_CONTAINER="filter-toggles-list",w.VENUE_ITEM="filter-toggle-container",w.VENUE_INFO="filter-toggle-label",w.VENUE_TOGGLE="filter-toggle-toggle",w.VENUE_SLIDER="filter-toggle-slider";let L=w;class it extends S{getFiltersContainerClass(){return L.FILTER_TOGGLE_CONTAINER}generateFiltersHTML(){console.assert(this.data.filters!=null,`Filter ${this.uniqueName} cannot find any items in LocalStorage`),Object.entries(this.data.filters).forEach(([t,e])=>{const n=tt({labelClass:L.VENUE_INFO,toggleClass:L.VENUE_TOGGLE,sliderClass:L.VENUE_SLIDER,containerClass:L.VENUE_ITEM,labelText:t,labelUrl:e.url,checked:this.getFilterEnabled(t),onChange:()=>{this.toggleFilterEnabled(t)},dataAttributes:{filter:t}});this.addFilterElement(n,t,i=>{const s=n.querySelector('input[type="checkbox"]');s&&(s.checked=i)})})}}class ot extends nt{isEventVisible(t){let e=t.location.district;return e==="Unknown / Not Copenhagen"&&(e="Anywhere Else"),this.getFilterEnabled(e)}}class rt extends st{isEventVisible(t){return this.getFilterEnabled(t.category)}}class at extends it{isEventVisible(t){return this.getFilterEnabled(t.source.pageName)}}class lt extends K{async initializeFilters(){const t=document.getElementById("filters");if(!t)throw new Error("Filters parent element not found");const e=await fetch("copenhagen.json");if(!e.ok)throw new Error(`Failed to fetch copenhagen.json: ${e.status} ${e.statusText}`);const i=(await e.json()).filters;this.activeFilters=i.map(s=>{switch(console.log(`System JSON wants to load filter ${s.type}`),s.type){case"DistrictFilter":return new ot(s,t);case"CategoryFilter":return new rt(s,t);case"SourceFilter":return new at(s,t);default:return console.warn(`Unknown filter type: ${s.type}`),null}}).filter(s=>s!==null)}}document.addEventListener("DOMContentLoaded",()=>{new lt().initialize("copenhagen")});
