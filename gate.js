(function(){"use strict";
/* ===== 1) ඔබේ Firebase web app config මෙතැන දමන්න (Project settings > Your apps) ===== */
const FB={apiKey:"AIzaSyAOC6YKY8A31IsCazWEQUA7Z23uBWbQSXA",authDomain:"ict-census.firebaseapp.com",projectId:"ict-census",storageBucket:"ict-census.firebasestorage.app",messagingSenderId:"900085423949",appId:"1:900085423949:web:b148b4f01fa32030926104"};
/* App Check (bot protection): reCAPTCHA site key මෙහි දමන්න – SECURITY.md බලන්න */
const APPCHECK_KEY="",APPCHECK_ENTERPRISE=false;
const g=id=>document.getElementById(id),X=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let ok,unlocked=false,unsub=null;const ready=new Promise(r=>ok=r);
const dl={save:async({filename,data})=>{const b=data instanceof Blob?data:new Blob([data],{type:"text/csv;charset=utf-8"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3000)}};
window.claude={use:async n=>n==="db"?ready:n==="downloads"?dl:Promise.reject(new Error("n/a"))};
const V=h=>{g("gv").innerHTML=h},M=(t,good)=>{const e=g("gm");if(e){e.textContent=t||"";e.className="gmsg"+(good?" ok":"")}};
const ERR=c=>({"auth/invalid-credential":"ඊමේල් හෝ මුරපදය වැරදියි.","auth/wrong-password":"ඊමේල් හෝ මුරපදය වැරදියි.","auth/user-not-found":"ඊමේල් හෝ මුරපදය වැරදියි.","auth/invalid-email":"ඊමේල් ලිපිනය වලංගු නොවේ.","auth/email-already-in-use":"මෙම ඊමේල් එකට දැනටමත් ගිණුමක් ඇත.","auth/too-many-requests":"උත්සාහ ගණන වැඩියි. මඳ වේලාවකින් නැවත උත්සාහ කරන්න.","auth/network-request-failed":"අන්තර්ජාල සම්බන්ධතාව පරීක්ෂා කරන්න.","auth/popup-closed-by-user":""}[c]??"දෝෂයක් ඇති විය. නැවත උත්සාහ කරන්න.");
const strong=p=>p.length>=10&&/[a-z]/i.test(p)&&/\d/.test(p);
if(FB.apiKey.startsWith("YOUR_")){V('<h2>⚠ Setup අවශ්‍යයි</h2><p class="gs">gate.js හි FB config එක ඇතුළත් කර නැත. README බලන්න.</p>');return}
firebase.initializeApp(FB);if(APPCHECK_KEY){try{firebase.appCheck().activate(APPCHECK_ENTERPRISE?new firebase.appCheck.ReCaptchaEnterpriseProvider(APPCHECK_KEY):new firebase.appCheck.ReCaptchaV3Provider(APPCHECK_KEY),true)}catch(e){}}
const auth=firebase.auth(),fs=firebase.firestore();auth.useDeviceLanguage();
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).catch(()=>{}); /* tab වසන විට ලොග්අවුට් */
const out=()=>{try{Object.keys(sessionStorage).filter(k=>k.startsWith("hwFormDraft_")).forEach(k=>sessionStorage.removeItem(k))}catch(e){}return auth.signOut().then(()=>location.reload())};

const ROLE=()=>{try{return sessionStorage.getItem("lr")||"school"}catch(e){return"school"}};
const HINT={school:"",hw:"🛠 දෘඩාංග කණ්ඩායම: ඔබේ ඊමේලයෙන් පිවිසෙන්න. ගිණුමක් නැත්නම් 'නව ලියාපදිංචිය' ඔබා ලියාපදිංචි වී admin ගේ අනුමැතිය ලබා ගන්න.",admin:"👑 Admin ගිණුම් සාදන්නේ Firebase Console මගින් පමණි. ඔබේ admin ඊමේලයෙන් පිවිසෙන්න."};
const NOADM1="🚫 Admin ගිණුමක් නොවේ",NOADM2="මෙම ගිණුම admin ගිණුමක් නොවේ. ඉවත් වී පාසල් හෝ දෘඩාංග ලෙස තෝරා පිවිසෙන්න.";
const DICT=[
["බදුල්ල කලාපය – ICT උපකරණ පුවරුව","Badulla Zone – ICT Equipment Dashboard","பதுளை வலயம் – ICT உபகரண டாஷ்போர்டு"],
["🔐 පිවිසෙන්න","🔐 Sign in","🔐 உள்நுழைக"],["පිවිසෙන්න","Sign in","உள்நுழைக"],
["Google ගිණුමෙන් පිවිසෙන්න","Sign in with Google","Google மூலம் உள்நுழைக"],
["හෝ Google මගින්","or continue with Google","அல்லது Google மூலம்"],
["ඊමේල්","Email","மின்னஞ்சல்"],["මුරපදය","Password","கடவுச்சொல்"],
["නව ලියාපදිංචිය","New registration","புதிய பதிவு"],["මුරපදය අමතකද?","Forgot password?","கடவுச்சொல் மறந்துவிட்டதா?"],
["පාසල","School","பாடசாலை"],["දෘඩාංග","Hardware","வன்பொருள்"],
[HINT.hw,"🛠 Hardware team: sign in with your email. If you have no account, tap 'New registration', register and wait for admin approval.","🛠 வன்பொருள் குழு: உங்கள் மின்னஞ்சலால் உள்நுழையவும். கணக்கு இல்லையெனில் 'புதிய பதிவு' மூலம் பதிவு செய்து நிர்வாகியின் ஒப்புதலுக்காகக் காத்திருக்கவும்."],
[HINT.admin,"👑 Admin accounts are created only in the Firebase Console. Sign in with your admin email.","👑 நிர்வாகி கணக்குகள் Firebase Console மூலம் மட்டுமே உருவாக்கப்படும். உங்கள் நிர்வாகி மின்னஞ்சலால் உள்நுழையவும்."],
[NOADM1,"🚫 Not an admin account","🚫 நிர்வாகி கணக்கு அல்ல"],[NOADM2,"This account is not an admin. Sign out and choose School or Hardware.","இது நிர்வாகி கணக்கு அல்ல. வெளியேறி பாடசாலை அல்லது வன்பொருள் எனத் தெரிவு செய்யவும்."],
["📝 නව ගිණුමක්","📝 New account","📝 புதிய கணக்கு"],
["පළමුව ඊමේල් ගිණුම සාදන්න; ඉන්පසු පාසල ලියාපදිංචි කරන්න.","First create an email account, then register your school.","முதலில் மின்னஞ்சல் கணக்கை உருவாக்கி, பின் பாடசாலையைப் பதிவு செய்யுங்கள்."],
["මුරපදය (අකුරු+ඉලක්කම්, අවම 10)","Password (letters + digits, min 10)","கடவுச்சொல் (எழுத்து+இலக்கம், குறைந்தது 10)"],
["මුරපදය නැවත","Repeat password","கடவுச்சொல்லை மீண்டும்"],["ගිණුම සාදන්න","Create account","கணக்கை உருவாக்கு"],
["← පිවිසීම","← Sign in","← உள்நுழைவு"],["✉ ඊමේල් සත්‍යාපනය","✉ Email verification","✉ மின்னஞ்சல் சரிபார்ப்பு"],
["වෙත යැවූ සබැඳිය ක්ලික් කරන්න (Spam ෆෝල්ඩරයත් බලන්න). ඉන්පසු පහත බොත්තම ඔබන්න.","– click the link we sent (also check Spam), then press the button below.","– அனுப்பிய இணைப்பைச் சொடுக்கவும் (Spam கோப்புறையையும் பார்க்கவும்), பின் கீழுள்ள பொத்தானை அழுத்தவும்."],
["මම සත්‍යාපනය කළා","I have verified","நான் சரிபார்த்துவிட்டேன்"],["සබැඳිය නැවත යවන්න","Resend link","இணைப்பை மீண்டும் அனுப்பு"],
["ඉවත් වන්න","Sign out","வெளியேறு"],["🏫 පාසල ලියාපදිංචිය","🏫 School registration","🏫 பாடசாலை பதிவு"],
["– ඔබේ පාසලේ තොරතුරු දෙන්න. කලාප කාර්යාලයේ අනුමැතියෙන් පසු ප්‍රවේශය ලැබේ.","– enter your school details. Access is granted after zone office approval.","– உங்கள் பாடசாலை விவரங்களை வழங்கவும். வலய அலுவலக ஒப்புதலின் பின் அணுகல் கிடைக்கும்."],
["පාසල් සංගණන අංකය","School census number","பாடசாலை கணக்கெடுப்பு இலக்கம்"],["ඔබේ සම්පූර්ණ නම","Your full name","உங்கள் முழுப் பெயர்"],
["විදුහල්පති","Principal","அதிபர்"],["ICT ගුරුවරයා/ගුරුවරිය","ICT teacher","ICT ஆசிரியர்"],["අනෙකුත්","Other","மற்றவை"],
["දුරකථන / WhatsApp","Phone / WhatsApp","தொலைபேசி / WhatsApp"],["ඉල්ලීම යවන්න","Send request","கோரிக்கையை அனுப்பு"],
["🛠 දෘඩාංග කණ්ඩායමේ සාමාජිකයෙක්ද? (සංගණන අංකයක් අවශ්‍ය නැත)","🛠 Hardware team member? (no census number needed)","🛠 வன்பொருள் குழு உறுப்பினரா? (கணக்கெடுப்பு இலக்கம் தேவையில்லை)"],
["← පාසල් ලියාපදිංචියට","← School registration","← பாடசாலை பதிவு"],
["⏳ අනුමැතිය බලාපොරොත්තුවෙන්","⏳ Awaiting approval","⏳ ஒப்புதலுக்காகக் காத்திருக்கிறது"],
["කලාප කාර්යාලය අනුමත කළ විට මෙම පිටුව ස්වයංක්‍රීයව විවෘත වේ.","This page opens automatically once the zone office approves.","வலய அலுவலகம் ஒப்புதல் அளித்ததும் இப்பக்கம் தானாகத் திறக்கும்."],
["❌ ඉල්ලීම ප්‍රතික්ෂේප විය","❌ Request rejected","❌ கோரிக்கை நிராகரிக்கப்பட்டது"],
["නිවැරදි තොරතුරු සමඟ නැවත ඉල්ලන්න හෝ කලාප කාර්යාලය අමතන්න.","Request again with correct details or contact the zone office.","சரியான விவரங்களுடன் மீண்டும் கோரவும் அல்லது வலய அலுவலகத்தைத் தொடர்பு கொள்ளவும்."],
["නැවත ඉල්ලන්න","Request again","மீண்டும் கோரு"],
["🛠 දෘඩාංග කණ්ඩායම","🛠 Hardware team","🛠 வன்பொருள் குழு"],["දෘඩාංග කණ්ඩායම","Hardware team","வன்பொருள் குழு"],
["ඊමේල් සහ මුරපදය ඇතුළත් කරන්න.","Enter your email and password.","மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்."],
["ඊමේල් හෝ මුරපදය වැරදියි.","Incorrect email or password.","மின்னஞ்சல் அல்லது கடவுச்சொல் தவறு."],
["උත්සාහ ගණන වැඩියි. මඳ වේලාවකින් නැවත උත්සාහ කරන්න.","Too many attempts. Try again later.","அதிக முயற்சிகள். சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."],
["ඉහත ඊමේල් ලිපිනය ඇතුළත් කර නැවත ඔබන්න.","Enter your email above and press again.","மேலே மின்னஞ்சலை உள்ளிட்டு மீண்டும் அழுத்தவும்."],
["එම ඊමේල් එකට ගිණුමක් ඇත්නම් මුරපද යළි-සැකසුම් සබැඳියක් යවා ඇත.","If an account exists for that email, a password reset link has been sent.","அந்த மின்னஞ்சலுக்குக் கணக்கு இருந்தால் கடவுச்சொல் மீட்டமைப்பு இணைப்பு அனுப்பப்பட்டுள்ளது."],
["මෙම සංගණන අංකය බදුල්ල කලාප ලැයිස්තුවේ නැත.","This census number is not in the Badulla zone list.","இந்த கணக்கெடுப்பு இலக்கம் பதுளை வலயப் பட்டியலில் இல்லை."],
["මුරපද නොගැලපේ.","Passwords do not match.","கடவுச்சொற்கள் பொருந்தவில்லை."],
["මුරපදය අවම අක්ෂර 10ක්, අකුරු සහ ඉලක්කම් සහිත විය යුතුය.","Password must be at least 10 characters with letters and digits.","கடவுச்சொல் குறைந்தது 10 எழுத்துகளுடன் எழுத்துகளும் இலக்கங்களும் இருக்க வேண்டும்."],
["මෙම ඊමේල් එකට දැනටමත් ගිණුමක් ඇත.","An account already exists for this email.","இந்த மின்னஞ்சலுக்குக் கணக்கு ஏற்கனவே உள்ளது."],
["ඊමේල් ලිපිනය වලංගු නොවේ.","Invalid email address.","தவறான மின்னஞ்சல் முகவரி."],
["තවම සත්‍යාපනය වී නැත.","Not verified yet.","இன்னும் சரிபார்க்கப்படவில்லை."],
["යවන ලදී.","Sent.","அனுப்பப்பட்டது."],["යැවීමට නොහැකි විය.","Could not send.","அனுப்ப முடியவில்லை."],
["නම සහ දුරකථන අංකය නිවැරදිව ඇතුළත් කරන්න.","Enter your name and phone number correctly.","பெயர் மற்றும் தொலைபேசி எண்ணைச் சரியாக உள்ளிடவும்."],
["අන්තර්ජාල සම්බන්ධතාව පරීක්ෂා කරන්න.","Check your internet connection.","இணைய இணைப்பைச் சரிபார்க்கவும்."],
["දෝෂයක් ඇති විය. නැවත උත්සාහ කරන්න.","An error occurred. Try again.","பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."],
["දත්ත කියවීමට නොහැකි විය. නැවත පිවිසෙන්න.","Could not read data. Please sign in again.","தரவை வாசிக்க முடியவில்லை. மீண்டும் உள்நுழையவும்."],
["දෝෂයක්","Error","பிழை"]];
const Z=s=>s.replace(/\u200d/g,"");
const LD=DICT.map(a=>[Z(a[0]),a[1],a[2]]).sort((a,b)=>b[0].length-a[0].length);
let trBusy=false;const obs=new MutationObserver(()=>trG());
function trG(){const au=g("au");if(!au||trBusy)return;trBusy=true;obs.disconnect();
try{const lg=typeof L!=="undefined"?L:"si",tx=o=>{if(lg==="si")return o;let z=Z(o);for(const[k,en,ta]of LD)if(z.includes(k))z=z.split(k).join(lg==="ta"?ta:en);return z};
const w=document.createTreeWalker(au,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(n.__o===undefined)n.__o=n.nodeValue;const v=tx(n.__o);if(n.nodeValue!==v)n.nodeValue=v}
au.querySelectorAll("[placeholder]").forEach(e=>{if(e.__p===undefined)e.__p=e.getAttribute("placeholder");e.setAttribute("placeholder",tx(e.__p))})}catch(e){}
trBusy=false;obs.observe(au,{childList:true,subtree:true,characterData:true})}
document.addEventListener("click",e=>{if(e.target.closest("#au [data-l]"))setTimeout(trG,0)});
if(g("au"))obs.observe(g("au"),{childList:true,subtree:true,characterData:true});

function login(){V(`<h2>🔐 පිවිසෙන්න</h2><p class="gs">බදුල්ල කලාපය – ICT උපකරණ පුවරුව</p>
<div class="rolebar"><button class="rb" data-role="school">පාසල</button><button class="rb" data-role="hw">දෘඩාංග</button><button class="rb" data-role="admin">Admin</button></div><p class="gs" id="rh"></p>
<input id="em" type="email" autocomplete="username" placeholder="ඊමේල්" maxlength="120"><input id="pw" type="password" autocomplete="current-password" placeholder="මුරපදය" maxlength="128">
<button class="gb pri" id="li">පිවිසෙන්න</button><div class="gor">හෝ Google මගින්</div><button class="gb gg" id="gg" style="display:flex;align-items:center;justify-content:center;gap:10px"><svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg><span>Google ගිණුමෙන් පිවිසෙන්න</span></button><div class="gl"><button class="gk" id="rg">නව ලියාපදිංචිය</button><button class="gk" id="fp">මුරපදය අමතකද?</button></div><div id="gm" class="gmsg"></div>`);
const paint=()=>{document.querySelectorAll(".rb").forEach(b=>b.classList.toggle("on",b.dataset.role===ROLE()));g("rh").textContent=HINT[ROLE()]};document.querySelectorAll(".rb").forEach(b=>b.onclick=()=>{try{sessionStorage.setItem("lr",b.dataset.role)}catch(e){}paint()});paint();
g("gg").onclick=()=>{const p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:"select_account"});auth.signInWithPopup(p).catch(e=>e.code==="auth/popup-blocked"?auth.signInWithRedirect(p):M(ERR(e.code)))};
g("li").onclick=()=>{const e=g("em").value.trim(),p=g("pw").value;if(!e||!p)return M("ඊමේල් සහ මුරපදය ඇතුළත් කරන්න.");auth.signInWithEmailAndPassword(e,p).catch(x=>M(ERR(x.code)))};
g("pw").onkeydown=e=>{if(e.key==="Enter")g("li").click()};
g("rg").onclick=signup;
g("fp").onclick=()=>{const e=g("em").value.trim();if(!e)return M("ඉහත ඊමේල් ලිපිනය ඇතුළත් කර නැවත ඔබන්න.");auth.sendPasswordResetEmail(e).catch(()=>{});M("එම ඊමේල් එකට ගිණුමක් ඇත්නම් මුරපද යළි-සැකසුම් සබැඳියක් යවා ඇත.",1)}}
function signup(){const T0=Date.now();V(`<h2>📝 නව ගිණුමක්</h2><p class="gs">පළමුව ඊමේල් ගිණුම සාදන්න; ඉන්පසු පාසල ලියාපදිංචි කරන්න.</p><p class="gs">ℹ️ ගිණුම සෑදූ පසු ඔබේ ඊමේල් එකට සබැඳියක් එයි – එය එක් වරක් click කළ යුතුයි. (Gmail ඇත්නම් ආපසු ගොස් <b>Google</b> බොත්තමෙන් පිවිසීම වඩා ලේසියි.)</p>
<input id="em" type="email" autocomplete="username" placeholder="ඊමේල්" maxlength="120"><input id="pw" type="password" autocomplete="new-password" placeholder="මුරපදය (අකුරු+ඉලක්කම්, අවම 10)" maxlength="128"><input id="p2" type="password" autocomplete="new-password" placeholder="මුරපදය නැවත" maxlength="128">
<input id="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0"><button class="gb pri" id="sg">ගිණුම සාදන්න</button><div class="gl"><button class="gk" id="bk2">← පිවිසීම</button></div><div id="gm" class="gmsg"></div>`);
g("bk2").onclick=login;
g("sg").onclick=async()=>{if(g("hp").value||Date.now()-T0<2500)return M("කරුණාකර තත්පර කිහිපයකින් නැවත උත්සාහ කරන්න.");const e=g("em").value.trim(),p=g("pw").value;if(!e)return M("ඊමේල් ඇතුළත් කරන්න.");if(!strong(p))return M("මුරපදය අවම අක්ෂර 10ක්, අකුරු සහ ඉලක්කම් සහිත විය යුතුය.");if(p!==g("p2").value)return M("මුරපද නොගැලපේ.");
try{const c=await auth.createUserWithEmailAndPassword(e,p);await c.user.sendEmailVerification()}catch(x){M(ERR(x.code))}}}
function verify(u){V(`<h2>✉ ඊමේල් සත්‍යාපනය</h2><p class="gs"><b>${X(u.email)}</b> වෙත සත්‍යාපන සබැඳියක් යවා ඇත. මෙසේ කරන්න:</p>
<ol class="gs" style="text-align:left;line-height:1.75;padding-left:22px;margin:6px 0 10px">
<li>ඔබේ ඊමේල් (Gmail) විවෘත කරන්න.</li>
<li><b>Inbox</b> හි නැත්නම් <b>Spam / Junk</b> ෆෝල්ඩරය බලන්න (යවන්නා: <i>noreply ... firebaseapp.com</i>).</li>
<li>එම ඊමේල් එකේ ඇති සබැඳිය (<b>Verify email</b>) එක් වරක් click කරන්න.</li>
<li>මෙම පිටුවට ආපසු එන්න – ස්වයංක්‍රීයව ඉදිරියට යයි. (නොයා නම් පහත "මම සත්‍යාපනය කළා" ඔබන්න.)</li></ol>
<button class="gb pri" id="vk">මම සත්‍යාපනය කළා</button><button class="gb" id="vr">සබැඳිය නැවත යවන්න</button><button class="gb" id="vo">ඉවත් වන්න</button>
<p class="gs" style="margin-top:10px">💡 Gmail ගිණුමක් ඇත්නම්: <b>ඉවත් වන්න</b> ඔබා, පිවිසුම් පිටුවේ <b>Google</b> බොත්තමෙන් පිවිසෙන්න – ඊමේල් සත්‍යාපනය අවශ්‍ය නැත.</p><div id="gm" class="gmsg"></div>`);
const chk=async()=>{if(!g("vk"))return;try{await u.reload();if(u.emailVerified)location.reload()}catch(e){}};
const iv=setInterval(()=>{if(!g("vk")){clearInterval(iv);return}chk()},4000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)chk()});
g("vk").onclick=async()=>{await chk();if(g("vk"))M("තවම සත්‍යාපනය වී නැත. ඊමේල් එකේ සබැඳිය click කළාදැයි බලන්න.")};
g("vr").onclick=async()=>{const b=g("vr");b.disabled=true;try{await u.sendEmailVerification();M("යවන ලදී. Inbox සහ Spam බලන්න.",1)}catch(x){M(ERR(x.code))}let s=60;const tm=setInterval(()=>{if(!g("vr")){clearInterval(tm);return}s--;b.textContent="නැවත යවන්න ("+s+")";if(s<=0){clearInterval(tm);b.disabled=false;b.textContent="සබැඳිය නැවත යවන්න"}},1000)};
g("vo").onclick=out}
function reg(u){const T0=Date.now();V(`<h2>🏫 පාසල ලියාපදිංචිය</h2><p class="gs">${X(u.email)} – ඔබේ පාසලේ තොරතුරු දෙන්න. කලාප කාර්යාලයේ අනුමැතියෙන් පසු ප්‍රවේශය ලැබේ.</p>
<input id="cn2" inputmode="numeric" placeholder="පාසල් සංගණන අංකය" maxlength="8"><input id="nm" placeholder="ඔබේ සම්පූර්ණ නම" maxlength="100" autocomplete="name">
<select id="ps"><option>විදුහල්පති</option><option>ICT ගුරුවරයා/ගුරුවරිය</option><option>අනෙකුත්</option></select><input id="ph" type="tel" placeholder="දුරකථන / WhatsApp" maxlength="20" autocomplete="tel">
<button class="gb" id="hwb" type="button">🛠 දෘඩාංග කණ්ඩායමේ සාමාජිකයෙක්ද? (සංගණන අංකයක් අවශ්‍ය නැත)</button><input id="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0"><button class="gb pri" id="sr">ඉල්ලීම යවන්න</button><button class="gb" id="so2">ඉවත් වන්න</button><div id="gm" class="gmsg"></div>`);
let hwMode=ROLE()==="hw";if(hwMode){g("cn2").style.display="none";g("ps").style.display="none";g("hwb").textContent="← පාසල් ලියාපදිංචියට"}g("so2").onclick=out;g("hwb").onclick=()=>{hwMode=!hwMode;g("cn2").style.display=hwMode?"none":"";g("ps").style.display=hwMode?"none":"";g("hwb").textContent=hwMode?"← පාසල් ලියාපදිංචියට":"🛠 දෘඩාංග කණ්ඩායමේ සාමාජිකයෙක්ද? (සංගණන අංකයක් අවශ්‍ය නැත)"};
g("sr").onclick=async()=>{if(g("hp").value||Date.now()-T0<2500)return M("කරුණාකර තත්පර කිහිපයකින් නැවත උත්සාහ කරන්න.");const c=g("cn2").value.trim(),n=g("nm").value.trim(),ph=g("ph").value.trim(),s=(typeof S!=="undefined"?S:[]).find(x=>String(x[0])===c);
if(!hwMode&&!s)return M("මෙම සංගණන අංකය බදුල්ල කලාප ලැයිස්තුවේ නැත.");if(n.length<2||!/^[0-9+ ]{7,20}$/.test(ph))return M("නම සහ දුරකථන අංකය නිවැරදිව ඇතුළත් කරන්න.");
if(!hwMode&&!confirm("පාසල: "+s[1]+"\nමෙය නිවැරදිද?"))return;
try{await fs.doc("users/"+u.uid).set({email:u.email,name:n,position:hwMode?"දෘඩාංග කණ්ඩායම":g("ps").value,phone:ph,requestedCensus:hwMode?0:+c,status:"pending",created:firebase.firestore.FieldValue.serverTimestamp()})}catch(x){M("යැවීමට නොහැකි විය.")}}}
function pend(x,u){const s=(typeof S!=="undefined"?S:[]).find(y=>y[0]===x.requestedCensus),rj=x.status==="rejected";
V(`<h2>${rj?"❌ ඉල්ලීම ප්‍රතික්ෂේප විය":"⏳ අනුමැතිය බලාපොරොත්තුවෙන්"}</h2><p class="gs">${X(x.requestedCensus===0?"🛠 දෘඩාංග කණ්ඩායම":s?s[1]:x.requestedCensus)}<br>${rj?"නිවැරදි තොරතුරු සමඟ නැවත ඉල්ලන්න හෝ කලාප කාර්යාලය අමතන්න.":"කලාප කාර්යාලය අනුමත කළ විට මෙම පිටුව ස්වයංක්‍රීයව විවෘත වේ."}</p>
${rj?'<button class="gb pri" id="rr">නැවත ඉල්ලන්න</button>':""}<button class="gb" id="po">ඉවත් වන්න</button><div id="gm" class="gmsg"></div>`);
g("po").onclick=out;if(rj)g("rr").onclick=()=>{if(unsub){unsub();unsub=null}reg(u)}}

async function admin(){const o=g("adm");o.style.display="flex";o.innerHTML='<div class="gbox wide">…</div>';
const q=await fs.collection("users").get(),sn=c=>{const s=S.find(x=>x[0]===c);return s?s[1]:"?"},rk={pending:0,rejected:1,approved:2};
const L=q.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>rk[a.status]-rk[b.status]),map={};L.forEach(x=>map[x.id]=x);
o.innerHTML=`<div class="gbox wide"><h2>✔ පාසල් ලියාපදිංචි අනුමැතීන්</h2><button class="gb" id="ax" style="width:auto">වසන්න</button><div style="overflow:auto"><table><tr><th>තත්ත්වය</th><th>පාසල</th><th>නම / තනතුර</th><th>ඊමේල් / දුරකථන</th><th></th></tr>`+
L.map(x=>`<tr><td>${X(x.status)}</td><td>${x.requestedCensus===0?"🛠 දෘඩාංග කණ්ඩායම":X(x.requestedCensus)+" · "+X(sn(x.requestedCensus))}</td><td>${X(x.name)}<br>${X(x.position)}</td><td>${X(x.email)}<br>${X(x.phone)}</td><td>${x.status!=="approved"?`<button class="gb pri" data-a="ap" data-i="${X(x.id)}">අනුමත</button>`:x.requestedCensus===0?`<button class="gb pri" data-a="hw" data-i="${X(x.id)}">දෘඩාංග ප්‍රවේශය දෙන්න</button>`:""}${x.status!=="rejected"?`<button class="gb" data-a="rj" data-i="${X(x.id)}">${x.status==="approved"?"ඉවත් කරන්න":"ප්‍රතික්ෂේප"}</button>`:""}</td></tr>`).join("")+`</table></div></div>`;
g("ax").onclick=()=>{o.style.display="none"};hwPanel(o);
o.querySelectorAll("button[data-a]").forEach(b=>b.onclick=async()=>{const x=map[b.dataset.i];b.disabled=true;
try{if(b.dataset.a==="hw"||(b.dataset.a==="ap"&&x.requestedCensus===0))await fs.doc("users/"+x.id).update({status:"approved"});else await fs.doc("users/"+x.id).update(b.dataset.a==="ap"?{status:"approved",census:x.requestedCensus}:{status:"rejected",census:firebase.firestore.FieldValue.delete()});admin()}catch(e){b.disabled=false;alert("අසාර්ථකයි: "+(e.code||e.message))}})}

async function hwPanel(o){const b=o.querySelector(".gbox"),d=document.createElement("div");
d.innerHTML='<h2 style="margin-top:22px">🛠 දෘඩාංග කණ්ඩායම</h2><p class="gs">සාමාජිකයාගේ ඊමේල් ලිපිනය එකතු කරන්න. ඔවුන් එම ඊමේල් එකෙන් (Google හෝ මුරපදය) පිවිසුණු විට ස්වයංක්‍රීයව කණ්ඩායමට ඇතුළත් වේ.</p><div id="hl"></div><input id="he" type="email" placeholder="ඊමේල්"><input id="hn" placeholder="නම"><input id="hp" type="tel" placeholder="WhatsApp අංකය"><button class="gb pri" id="ha" style="width:auto">එකතු කරන්න</button>';b.appendChild(d);
b.insertAdjacentHTML("afterbegin",'<button id="ax2" class="gb" type="button" style="position:sticky;top:0;float:right;z-index:3;width:auto;padding:6px 14px;font-size:1.1rem">✕</button>');
d.insertAdjacentHTML("beforeend",'<div style="margin-top:18px;text-align:right"><button id="ax3" class="gb" type="button" style="width:auto">වසන්න</button></div>');
const cl=()=>{o.style.display="none"};g("ax2").onclick=cl;g("ax3").onclick=cl;
const draw=async()=>{const[iv,hw]=await Promise.all([fs.collection("hw_invites").get(),fs.collection("hardware").get()]),on=new Set(hw.docs.map(x=>x.data().email));
d.querySelector("#hl").innerHTML=iv.docs.map(x=>`<div style="margin:6px 0">${X(x.data().name)} · ${X(x.id)} · ${X(x.data().phone)} ${on.has(x.id)?"✓ සක්‍රීය":"(තවම පිවිසී නැත)"} <button class="gb" data-r="${X(x.id)}">ඉවත් කරන්න</button></div>`).join("")||"—";
d.querySelectorAll("[data-r]").forEach(bt=>bt.onclick=async()=>{const id=bt.dataset.r;await fs.doc("hw_invites/"+id).delete();for(const x of hw.docs)if(x.data().email===id)await x.ref.delete();draw()})};
d.querySelector("#ha").onclick=async()=>{const e=d.querySelector("#he").value.trim().toLowerCase(),n=d.querySelector("#hn").value.trim(),p=d.querySelector("#hp").value.trim();if(!/^[^@\s]+@[^@\s]+$/.test(e)||n.length<2||p.length<7)return alert("නම, ඊමේල්, WhatsApp අංකය නිවැරදිව ඇතුළත් කරන්න.");
try{await fs.doc("hw_invites/"+e).set({name:n,phone:p,created:Date.now()});draw()}catch(x){alert("අසාර්ථකයි: "+(x.code||x.message))}};draw()}

let hwErr="";async function tryHW(u){hwErr="";try{const d=await fs.doc("hardware/"+u.uid).get();if(d.exists)return d.data();const iv=await fs.doc("hw_invites/"+u.email.toLowerCase()).get();if(iv.exists){const hw={email:u.email.toLowerCase(),name:iv.data().name,phone:iv.data().phone,created:firebase.firestore.FieldValue.serverTimestamp()};await fs.doc("hardware/"+u.uid).set(hw);return hw}}catch(e){hwErr=e.code||e.message||"error"}return null}
function hwEnter(u,x){unlock("hw",null,u,{name:x.name,phone:x.phone,email:u.email});const go3=()=>window.htab?window.htab(3):setTimeout(go3,60);go3()}
function unlock(role,census,u,x){if(unlocked)return;unlocked=true;window.APP={role,uid:u.uid,email:u.email,census,name:(x&&x.name)||u.displayName||"",phone:(x&&x.phone)||""};
document.body.classList.remove("locked");document.body.classList.toggle("school",role==="school");document.body.classList.toggle("hw",role==="hw");g("gate").style.display="none";
const l=document.querySelector(".lang"),w=document.createElement("span");w.className="who";w.textContent=(role==="admin"?"👑 ":role==="hw"?"🛠 ":"")+u.email;l.appendChild(w);
if(role==="admin"){const b=document.createElement("button");b.textContent="✔ අනුමැතීන්";b.onclick=admin;l.appendChild(b)}
const so=document.createElement("button");so.textContent="ඉවත් වන්න";so.onclick=out;l.appendChild(so);
if(role==="school"){const h="#s"+census,f=()=>{if(location.hash!==h)location.hash=h};f();addEventListener("hashchange",f)}
/* පාසල් පරිශීලකයාට තමන්ගේ පාසලේ ලේඛන පමණක් (rules මගින්ද බලාත්මක කෙරේ) */
ok(role!=="school"?fs:{collection:c=>c==="repairs"?{doc:id=>fs.collection(c).doc(id),onSnapshot:(cb,er)=>fs.collection(c).where("cn","==",String(census)).onSnapshot(cb,er)}:({doc:id=>fs.collection(c).doc(id),onSnapshot:(cb,er)=>fs.collection(c).doc(String(census)).onSnapshot(d=>cb({docs:d.exists?[d]:[]}),er)})});
let t;const rs=()=>{clearTimeout(t);t=setTimeout(out,30*60*1000)};["click","keydown","touchstart"].forEach(e=>addEventListener(e,rs,{passive:true}));rs()}

auth.onAuthStateChanged(async u=>{if(unsub){unsub();unsub=null}
if(!u){if(!unlocked)login();return}
if(u.providerData.some(p=>p.providerId==="password")&&!u.emailVerified){verify(u);return}
try{await u.getIdToken(true)}catch(e){}
let adm=false;try{adm=(await fs.doc("admins/"+u.uid).get()).exists}catch(e){}
if(adm){unlock("admin",null,u,{name:u.displayName||"Admin"});return}
if(ROLE()==="admin"){V(`<h2>${NOADM1}</h2><p class="gs">${NOADM2}</p><button class="gb" id="eo">ඉවත් වන්න</button>`);g("eo").onclick=()=>{try{sessionStorage.removeItem("lr")}catch(e){}out()};return}
const hw=await tryHW(u);
if(hw){unlock("hw",null,u,hw);const go3=()=>window.htab?window.htab(3):setTimeout(go3,60);go3();return}
unsub=fs.doc("users/"+u.uid).onSnapshot(d=>{if(!d.exists){reg(u);return}const x=d.data();x.status==="approved"&&x.requestedCensus===0?hwEnter(u,x):x.status==="approved"&&x.census?unlock("school",x.census,u,x):pend(x,u)},()=>{V('<h2>දෝෂයක්</h2><p class="gs">දත්ත කියවීමට නොහැකි විය. නැවත පිවිසෙන්න.</p><button class="gb" id="eo">ඉවත් වන්න</button>');g("eo").onclick=out})});
})();
