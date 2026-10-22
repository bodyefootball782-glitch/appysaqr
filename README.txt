SAQR TEAM APPLICATIONS — إعداد الموقع على Vercel
==================================================

الملفات:
- index.html / style.css / script.js: واجهة الموقع.
- api/submit.js: واجهة آمنة لإرسال التقديمات إلى Discord Webhook.
- vercel.json: إعدادات Vercel.

خطوات النشر:
1) ارفع محتويات هذا المجلد إلى مستودع GitHub جديد.
2) افتح Vercel واستورد المستودع الجديد كمشروع مستقل.
3) من Project Settings > Environment Variables أضف:
   Name: DISCORD_WEBHOOK_URL
   Value: رابط Webhook الخاص بروم التقديمات في ديسكورد
   ثم احفظ الإعداد.
4) من Deployments أعد النشر Redeploy بعد إضافة المتغير.
5) افتح script.js وابحث عن:
   const DISCORD_INVITE_URL = "https://discord.com/";
   واستبدل الرابط برابط دعوة سيرفر صقر الحقيقي، ثم ارفع التعديل.

ملاحظات:
- لا تضع رابط Webhook في index.html أو script.js أو GitHub.
- لو ظهر أن الإرسال لم يكتمل، راجع إعداد Environment Variables ثم أعد النشر.
- رقم الهاتف مطلوب عند اختيار «ولد» واختياري عند اختيار «بنت».
- حاليًا كل تقديم يُرسل كـ Embed إلى نفس الـ Webhook، مع توضيح نوع التقديم.
- الموقع لا يحفظ التقديمات في قاعدة بيانات؛ يرسلها إلى ديسكورد فقط.
