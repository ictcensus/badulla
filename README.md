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
3. Project settings > Your apps > **Web app** එකතු කර config එක `public/index.html` හි `const FB={...}` ට අලවන්න. `.firebaserc` හි `YOUR_PROJECT_ID` වෙනස් කරන්න.
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
- CSP හි `'unsafe-inline'` ඇත්තේ app එකේ inline script නිසා; අවශ්‍ය නම් පසුව ඉවත් කළ හැක.

## දෘඩාංග කණ්ඩායම සහ අලුත්වැඩියා ඉල්ලීම්
- පාසල් පරිශීලකයා: පාසල් පිටුවේ **අලුත්වැඩියා** ටැබ් එකෙන් ඉල්ලීම යවයි. **GPS ස්ථානය** ටැබ් එකෙන් පාසලේ ස්ථානය සුරකින්න (සිතියමට අවශ්‍යයි).
- Admin: **✔ අනුමැතීන්** පුවරුවේ පහළ **දෘඩාංග කණ්ඩායම** කොටසෙන් සාමාජිකයන්ගේ ඊමේල් + නම + WhatsApp අංකය එකතු කරන්න. ඔවුන් එම ඊමේලයෙන් පිවිසුණු විට ස්වයංක්‍රීයව කණ්ඩායමට ඇතුළත් වේ.
- සෑම දෘඩාංග සාමාජිකයෙකුටම **🛠 අලුත්වැඩියා** ටැබ් එකේ ඉල්ලීම් පාසලේ සිතියම සමඟ පෙනේ. එක් අයෙක් **භාර ගන්න** ඔබූ විට අනෙක් අයට එය භාර ගත නොහැක; භාර ගත් අයට WhatsApp නිල ලිපිය (පාසලට) විවෘත වේ.
- WhatsApp ලිපිය ස්වයංක්‍රීයව යැවෙන්නේ නැත; WhatsApp විවෘත වී ලිපිය සූදානම්ව තිබේ, **Send** එබීම ඔබ කළ යුතුය.
- නව CSP: සිතියම් ටයිල් සඳහා `tile.openstreetmap.org` img-src වලට එකතු කර ඇත.
