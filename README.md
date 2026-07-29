# 💍 دعوة خطوبة محمد ورنا

## 📋 محتويات المجلد

```
invitation-mohamed-rana/
├── src/
│   ├── App.tsx          ← الكود الرئيسي للدعوة
│   ├── main.tsx         ← نقطة الدخول
│   └── index.css        ← الأنماط العامة
├── assets/
│   ├── heroBg.png       ← خلفية الدعوة (Gemini)
│   ├── cartoonCouple.png← صورة الكارتون (Gemini)
│   └── couplePhoto.jpeg ← صورة الخطيبين
├── public/
│   └── dist/            ← النسخة الجاهزة للنشر (بعد البناء)
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🚀 تشغيل محلي (Development)

### المتطلبات
- [Node.js](https://nodejs.org/) v18 أو أحدث
- npm أو pnpm

### الخطوات

```bash
# 1. فتح المجلد
cd invitation-mohamed-rana

# 2. تثبيت الحزم
npm install
# أو
pnpm install

# 3. تشغيل السيرفر المحلي
npm run dev
# أو
pnpm dev
```

ثم افتح المتصفح على:
```
http://localhost:5173
```

---

## 📦 بناء النسخة النهائية (Production Build)

```bash
npm run build
```

الملفات الجاهزة للنشر ستكون في مجلد `dist/`

---

## 🌐 معاينة النسخة المبنية

```bash
npm run preview
```

ثم افتح:
```
http://localhost:4173
```

---

## 📁 مجلد `public/dist`

يحتوي على نسخة جاهزة مبنية مسبقاً — يمكنك رفعها مباشرة على أي استضافة ثابتة مثل:
- [Netlify](https://netlify.com) — اسحب وأفلت المجلد
- [Vercel](https://vercel.com)
- [GitHub Pages](https://pages.github.com)
- أي استضافة تدعم HTML/CSS/JS

---

## ✏️ تعديل التفاصيل

كل شيء في ملف `src/App.tsx`:

| التفصيل | المكان في الكود |
|---------|----------------|
| التاريخ | `TARGET_DATE` في أعلى الملف |
| المكان  | سيكشن Details |
| رابط الخريطة | `MAP_LINK` في أعلى الملف |
| الموسيقى | `<audio src="...">` |

---

## 💡 ملاحظات

- الدعوة مُصممة للموبايل (430px max-width)
- تعمل بالكامل بدون إنترنت بعد البناء (ما عدا الخطوط من Google Fonts)
- لإيقاف الموسيقى التلقائية: احذف `autoplay` من عنصر `<audio>`
