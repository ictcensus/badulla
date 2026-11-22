# Badulla Zone ICT Dashboard – Firebase + GitHub (ආරක්ෂිත අනුවාදය)

## ක්‍රියාකාරීත්වය
- පිවිසුම: **Google** හෝ **ඊමේල්+මුරපදය** (ඊමේල් සත්‍යාපනය අනිවාර්යයි, මුරපදය අවම 10, අකුරු+ඉලක්කම්).
- හැම පාසලක්ම ලියාපදිංචි වී (සංගණන අංකය, නම, තනතුර, දුරකථනය) **කලාප admin ගේ අනුමැතිය** ලැබිය යුතුයි.
- අනුමත පාසල් පරිශීලකයාට **තමන්ගේ පාසලේ දත්ත පමණක්** බලා/සුරකින්න හැක (Firestore Rules මගින් server පැත්තෙන් බලාත්මක කෙරේ).
- Admin ට සියලු පාසල්, Database/Zone Summary, Reports සහ අනුමැතී පුවරුව.
- ටැබ් වසන විට ලොග්අවුට්; විනාඩි 30ක් අක්‍රිය නම් ස්වයං ලොග්අවුට්.

## පියවර
1. **Firebase project** සාදන්න → Build > **Authentication** > Sign-in method: **Google** සහ **Email/Password** සක්‍රීය කරන්න.
   Settings > User actions: **Email enumeration protection** සක්‍රීය කරන්න. (Password policy ඇත්නම් අවම දිග 10 කරන්න.)
2. Build > **Firestore Database** සාදන්න (Production mode).
3. Project settings > Your apps > **Web app** එකතු කර config එක `public/js/gate.js` හි `const FB={...}` ට අලවන්න. (script ඉවත් කර `public/js/` ෆෝල්ඩරයට දමා ඇත – `public/index.html` සමඟ දෙකම deploy කළ යුතුයි.) `.firebaserc` හි `YOUR_PROJECT_ID` වෙනස් කරන්න.
4. Authentication > Settings > **Authorized domains** හි ඔබේ `*.web.app` / custom domain පමණක් තබන්න.
5. Google Cloud Console > APIs & Credentials > ඔබේ **Browser API key** එක **HTTP referrer** (ඔබේ domain) වලට සීමා කරන්න.
6. **පළමු Admin**: සයිට් එකට ගොස් ඔබේ ඊමේල් එකෙන් පිවිස (පාසල් ලියාපදිංචි පෝරමය ආවොත් නොසලකන්න) Authentication > Users වෙතින් ඔබේ **UID** පිටපත් කරන්න.
   Firestore > **Start collection** `admins` > Document ID = ඔබේ **UID** (field එකක් ඕනෑම: `role` = `admin`). පිටුව refresh කරන්න.
   (Admin කෙනෙක් Console එකෙන් පමණක් සෑදිය හැක; website එකෙන් කිසිවෙකුට admin විය නොහැක.)
7. **GitHub**: private repo සාදා මෙම ෆෝල්ඩරය push කරන්න.
   Service account: Firebase Console > Project settings > Service accounts > Generate new private key (JSON). GitHub repo > Settings > Secrets > Actions > **FIREBASE_SERVICE_ACCOUNT** ලෙස JSON මුළුමනින්ම අලවන්න. (JSON ෆයිල් එක repo එකට නොදමන්න; ඉන්පසු මකන්න.)
   Service account එකට `Firebase Admin` role අවශ්‍යයි. `main` වෙත push කළ විට auto deploy වේ.
8. (නිර්දේශිත) **App Check** (reCAPTCHA Enterprise) සක්‍රීය කර Firestore සඳහා Enforce කරන්න. Budget alert එකක් තබන්න.

## සටහන්
- Firebase web config (apiKey) ප්‍රසිද්ධ දෙයක්; ආරක්ෂාව Rules + Auth + admin අනුමැතිය මගිනි.
- පැරණි claude.ai දත්ත මෙයට ස්වයංක්‍රීයව ගමන් නොකරයි.
- CSP හි scripts සඳහා `'unsafe-inline'` ඉවත් කර ඇත (සියලු script `public/js/` ගොනුවලට ගෙන ඇත). නව inline `<script>` හෝ `onclick=` වැනි inline handler එකතු නොකරන්න – ඒවා අවහිර වේ.

## දෘඩාංග කණ්ඩායම සහ අලුත්වැඩියා ඉල්ලීම්
- පාසල් පරිශීලකයා: පාසල් පිටුවේ **අලුත්වැඩියා** ටැබ් එකෙන් ඉල්ලීම යවයි. **GPS ස්ථානය** ටැබ් එකෙන් පාසලේ ස්ථානය සුරකින්න (සිතියමට අවශ්‍යයි).
- Admin: **✔ අනුමැතීන්** පුවරුවේ පහළ **දෘඩාංග කණ්ඩායම** කොටසෙන් සාමාජිකයන්ගේ ඊමේල් + නම + WhatsApp අංකය එකතු කරන්න. ඔවුන් එම ඊමේලයෙන් පිවිසුණු විට ස්වයංක්‍රීයව කණ්ඩායමට ඇතුළත් වේ.
- සෑම දෘඩාංග සාමාජිකයෙකුටම **🛠 අලුත්වැඩියා** ටැබ් එකේ ඉල්ලීම් පාසලේ සිතියම සමඟ පෙනේ. එක් අයෙක් **භාර ගන්න** ඔබූ විට අනෙක් අයට එය භාර ගත නොහැක; භාර ගත් අයට WhatsApp නිල ලිපිය (පාසලට) විවෘත වේ.
- WhatsApp ලිපිය ස්වයංක්‍රීයව යැවෙන්නේ නැත; WhatsApp විවෘත වී ලිපිය සූදානම්ව තිබේ, **Send** එබීම ඔබ කළ යුතුය.
- නව CSP: සිතියම් ටයිල් සඳහා `tile.openstreetmap.org` img-src වලට එකතු කර ඇත.

## නව: Monitor, සටහන්, වාර්තා
- අලුත්වැඩියා උපකරණ ලැයිස්තුවට **Monitor (මොනිටරය)** එකතු කර ඇත (පාසල් ඉල්ලීම් ෆෝරමයේ සහ දෘඩාංග ෆෝරමයේ දෙකෙහිම).
- **📝 කණ්ඩායම් සටහන්**: සෑම අලුත්වැඩියා කාඩ්පතකම (භාර ගත්තේ කවුරුන් වුවත්) ඕනෑම දෘඩාංග සාමාජිකයෙකුට/admin ට සටහන් එක් කළ හැක. සටහන් `repairs/{id}/notes` හි ගබඩා වේ; පාසල් පරිශීලකයන්ට නොපෙනේ.
- **📋 ෆෝරමය**: පුරවන දත්ත "වාර්තාව සුරකින්න" ඔබූ විට Firestore හි සුරැකේ. සුරැකීමට පෙර ෆෝරමය වසා දැමුවත්/refresh කළත් කෙටුම්පත (draft) මෙම උපාංගයේ ස්වයංක්‍රීයව රැඳේ.
- **වාර්තා**: Excel/PDF/CSV සඳහා දිනයෙන් (සිට – දක්වා) පෙරන්න පුළුවන්. Excel හි `Jobs`, `Devices`, `Parts`, `Notes` පත්‍ර ඇත. එක් කාර්යයක **📄 අවසන් කිරීමේ වාර්තාව** (PDF) තුළ සටහන්ද ඇතුළත් වේ.
- `firestore.rules` යාවත්කාලීන කර ඇත – `main` වෙත push කළ විට auto deploy වේ.

## ආරක්ෂාව (Security)
සවිස්තරාත්මක වාර්තාව, bot ආරක්ෂාව (App Check) සක්‍රීය කිරීම සහ Console පියවර: **SECURITY.md**

## GitHub Pages (ictcensus.github.io) හි publish කිරීම
GitHub Pages සාමාන්‍යයෙන් repo එකේ **root** ෆෝල්ඩරයේ `index.html` පමණක් පෙන්වයි. `public/index.html` පෙන්වන්නේ නැත; එවිට README පමණක් පෙනේ.
1. Repo > **Settings > Pages > Build and deployment > Source = GitHub Actions** තෝරන්න.
2. `main` වෙත push කරන්න (`.github/workflows/pages.yml` ඉබේම `public/` ෆෝල්ඩරය publish කරයි). Actions ටැබ් එකේ **Deploy to GitHub Pages** සාර්ථක වන තෙක් බලන්න.
3. Firebase Console > Authentication > Settings > **Authorized domains** හි `ictcensus.github.io` එකතු කරන්න.
4. GitHub Pages හි `firebase.json` headers (CSP ආදිය) ක්‍රියාත්මක නොවේ; ඒවා ක්‍රියාත්මක වන්නේ Firebase Hosting (`*.web.app`) හි පමණි.
5. `FIREBASE_SERVICE_ACCOUNT` secret එක නැත්නම් `deploy.yml` (Firebase) අසාර්ථක වේ; එය Pages වලට බලපාන්නේ නැත. Firestore rules එකතු කිරීමට Console හි Rules ටැබ් එකට අතින් අලවන්න.

## උපාංග විස්තර සහ විද්‍යාගාරයේ උපාංග (යාවත්කාලීන)
- **උපාංග විස්තර** ටැබ් එකේ දැන් උපාංග 8ම ඇත: ඩෙස්ක්ටොප්, ලැප්ටොප්, ස්මාර්ට් බෝඩ්, ටැබ්, මල්ටිමීඩියා යන්ත්‍ර, ඩොට් මැට්‍රික්ස් / ඉන්ක්ජෙට් / ලේසර් ප්‍රින්ටර්. ඉහළින් "සියලු උපාංගවල පිරිවිතර මෙහි එක් කරන්න" සටහන ඇත.
- **පරිගණක විද්‍යාගාරය** වගුව දැන් ලැබුණු පරිගණක පළමු පේළියෙන් පටන් ගෙන ඉහත උපාංග 8ම ඇතුළත් කරයි (ක්‍රියාත්මක / අක්‍රිය / ලැබුණු ප්‍රමාණය).
- විද්‍යාගාරය සහ "පිටත උපකරණ" වගු යටින් "උපාංග විස්තර ටැබ් එකේ පිරිවිතර එක් කරන්න" සටහන ඇත.
- දත්ත ගබඩාව (Firestore rules) වෙනස් කිරීම අවශ්‍ය නැත.
