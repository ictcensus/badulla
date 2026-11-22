# Badulla Zone ICT Dashboard – ආරක්ෂක වාර්තාව සහ පියවර

> මෙය **කේතය සහ config අතින් සමාලෝචනය** කිරීමකි (මගේ sandbox එකට අන්තර්ජාලය නැති නිසා ස්වයංක්‍රීය scanner ධාවනය කළ නොහැකි විය).
> Deploy කළ පසු පහත "සත්‍යාපනය" කොටසේ මෙවලම් ධාවනය කරන්න.

## 1. සොයාගත් දෝෂ සහ තත්ත්වය

| # | බරපතලකම | දෝෂය | තත්ත්වය |
|---|---|---|---|
| 1 | **ඉහළ** | **Stored XSS.** පාසල් ගිණුමකට (SDK/Console හරහා) GPS (`lat/lng/acc`), `racks`, උපකරණ/ශිෂ්‍ය ගණන් වැනි ක්ෂේත්‍රවලට HTML/JS ලිවිය හැකි විය. ඒවා admin/hardware දර්ශනවල escape නොකර පෙන්වූ අතර CSP හි `unsafe-inline` තිබූ නිසා එය admin session එකේ ක්‍රියාත්මක වී ගිණුම අල්ලා ගත හැකි විය. | **නිවැරදි කළා:** සියලු ක්ෂේත්‍ර සංඛ්‍යාවට හරවා/escape කළා; `esc()` හි `'` ද escape වේ; GPS දත්ත ලබා ගන්නා විටම සත්‍යාපනය; `locations` rules වලින් සංඛ්‍යා + ශ්‍රී ලංකා සීමාව පමණක් |
| 2 | **මධ්‍යම** | CSP හි `script-src 'unsafe-inline'` – XSS වැළැක්වීමේ ප්‍රධාන ආරක්ෂාව අක්‍රීය විය. | **නිවැරදි කළා:** සියලු inline script `public/js/*.js` වලට ගෙන ගියා; inline `onclick/oninput` ඉවත් කළා; CSP දැන් `script-src 'self' + gstatic/cdnjs/apis.google/recaptcha` |
| 3 | **මධ්‍යම** | පාසල් ඉල්ලීමකට අත්තනෝමතික `report` දත්ත ඇතුළත් කළ හැකි විය; hardware සාමාජිකයෙකුට `status`/`report` ඕනෑම අගයක් දැමිය හැකි විය. | **නිවැරදි කළා** (rules: `report` හිස් විය යුතුයි, status ∈ {rec,fix,nofix}, දිග සීමා, `urgent` bool, review ක්ෂේත්‍ර සීමා) |
| 4 | අඩු | ෆෝරම් draft එක `localStorage` හි ඉතිරි වී පොදු පරිගණකවල log out වූ පසුත් පෙනුණි. | **නිවැරදි කළා:** `sessionStorage` + log out/auto-logout විට මකයි |
| 5 | අඩු (functionality) | `Permissions-Policy: geolocation=()` නිසා "මගේ ස්ථානය ගන්න" GPS බොත්තම අවහිර වී තිබුණි. | **නිවැරදි කළා:** `geolocation=(self)` |
| 6 | අඩු | `deploy.yml`: `firebase-tools@latest`, key ගොනුව සෑම විටම නොමැකීම, පුළුල් අවසර. | **නිවැරදි කළා:** `permissions: contents: read`, `firebase-tools@13`, `if: always()` මැකීම, concurrency, timeout |
| 7 | තොරතුරු | `xlsx 0.18.5`, `jsPDF 2.5.1` පැරණි (advisories ඇත: xlsx<0.19.3 prototype pollution, jsPDF<3.0.1 ReDoS). මෙම app ඒවා භාවිතා කරන්නේ **ගොනු සෑදීමට පමණි** (ගොනු කියවන්නේ නැත) – නිසා අවදානම අඩුයි. CDN scripts වලට SRI නැත. | **ඔබ කළ යුතුයි:** නව අනුවාද බාගෙන `public/js/vendor/` ට දමා (self-host) `index.html` හි src වෙනස් කර CSP වලින් `cdnjs` ඉවත් කරන්න |
| 8 | තොරතුරු | Generic collections (`teachers`, `devices`…) වල ක්ෂේත්‍ර schema බලෙන් පනවා නැත. | අර්ධ වශයෙන් අවම කළා (escape + CSP). අවශ්‍ය නම් එකිනෙක සඳහා schema rules එකතු කළ හැක. |

## 2. Bot / CAPTCHA – **ඔබ කළ යුතු පියවර (App Check)**

සත්‍ය කතාව: Firebase Hosting + Firestore පමණක් ඇති විට, **දෘශ්‍ය "I'm not a robot" checkbox එකක් server එකේ සත්‍යාපනය කළ නොහැක** (backend/Cloud Functions අවශ්‍යයි – Blaze plan). ඒ වෙනුවට හොඳම ක්‍රමය **Firebase App Check + reCAPTCHA** (අදෘශ්‍ය, server පැත්තෙන් බලෙන් පනවයි). එයට අමතරව sign-up / ලියාපදිංචි පෝරම වලට **honeypot + අවම පිරවුම් කාලය** එකතු කළා.

1. https://www.google.com/recaptcha/admin → **Create** → Type: **reCAPTCHA v3** → Domains: ඔබේ `*.web.app` / `*.firebaseapp.com` / custom domain. **Site key** සහ **Secret key** ලැබේ.
2. Firebase Console → **App Check** → **Apps** → Web app → **reCAPTCHA v3** → **Secret key** අලවන්න → Save.
3. `public/js/gate.js` හි මුල් කොටසේ: `const APPCHECK_KEY="<ඔබේ SITE key>"` (Enterprise භාවිතා කළොත් `APPCHECK_ENTERPRISE=true`).
4. Deploy කර දින 1–2ක් **Metrics** බලන්න (verified requests ඉහළ විය යුතුයි).
5. ඉන්පසු **App Check → APIs**: **Cloud Firestore** සහ **Authentication** සඳහා **Enforce** ඔබන්න.
   (Enforce කළ පසු App Check නැති සියලු ඉල්ලීම් – bots, scripts – ප්‍රතික්ෂේප වේ.)
6. දේශීය පරීක්ෂණයට (localhost) App Check **debug token** භාවිතා කරන්න; production හි එය නොදමන්න.

## 3. Firebase / Google Cloud Console – අත්‍යවශ්‍ය සැකසුම්
- **API key**: Google Cloud Console → APIs & Services → Credentials → Browser key → **HTTP referrers** = ඔබේ domain පමණි; API restrictions = Identity Toolkit, Firestore, Token Service, (App Check) පමණි.
- **Authentication → Settings**: Authorized domains ඔබේ domain පමණි; **Email enumeration protection** ON; **Password policy** (අවම 10, අකුරු+ඉලක්කම්) ON; "**One account per email**" තබන්න.
- **Admin ගිණුම්**: Google වලින් පිවිසෙන admin ගේ Google account එකට **2-Step Verification** අනිවාර්යයෙන් සක්‍රීය කරන්න. Admin ගණන අවම (1–2) කරන්න. (`admins/{UID}` සාදන්නේ Console වලින් පමණි.)
- **Budget alert** + Firestore **usage quota alerts** සකසන්න (bot/අනිසි භාවිතයෙන් බිල ඉහළ යාම වැළැක්වීමට).
- **Service account**: "Firebase Admin" වෙනුවට අවම role: *Firebase Hosting Admin* + *Firebase Rules Admin* (deploy අසාර්ථක නම් *Service Usage Consumer* එකතු කරන්න). JSON key එක කිසි විටෙකත් repo එකට/chat එකට නොදමන්න; සැකයක් ඇත්නම් **key rotate** කරන්න.
- **GitHub repo**: private; **main** branch protect (PR + review); **Dependabot / secret scanning** ON; Actions → "Require approval for outside collaborators".
- Authentication → Users හි පරීක්ෂණ/පැරණි ගිණුම් මකන්න.

## 4. Deploy කළ පසු සත්‍යාපනය
1. Browser DevTools → **Console**: `Refused to execute inline script/handler` පණිවිඩ **නොතිබිය යුතුයි**. තිබුණොත් ඒ ස්ථානය මට එවන්න (නැවත inline handlers නොතබා සකස් කරමු).
2. පිවිසීම, පාසල් ලියාපදිංචිය, අලුත්වැඩියා ඉල්ලීම, ෆෝරමය, GPS බොත්තම, PDF/Excel බාගැනීම, print – සියල්ල පරීක්ෂා කරන්න.
3. https://securityheaders.com සහ https://observatory.mozilla.org හි site එක පරීක්ෂා කරන්න; https://csp-evaluator.withgoogle.com හි CSP එක බලන්න.
4. **OWASP ZAP baseline scan** (`zap-baseline.py -t https://<site>`).
5. Firebase Console → Firestore → **Rules Playground** හෝ Emulator වලින් rules පරීක්ෂා කරන්න (විශේෂයෙන් `locations`, `repairs`).

## 5. ඉතිරි අවදානම් (දැනගන්න)
- `style-src 'unsafe-inline'` තවමත් ඇත (app එක බොහෝ `style=""` භාවිතා කරයි). Scripts අවහිර කර ඇති නිසා බරපතල නැත.
- Firebase web `apiKey` ප්‍රසිද්ධ දෙයකි – ආරක්ෂාව Rules + Auth + App Check මගිනි.
- Admin ගිණුමක් අල්ලා ගත හොත් සියලු දත්ත පෙනේ → 2-Step Verification අනිවාර්යයි.
