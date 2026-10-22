const ALLOWED_TYPES = new Set(["ADMIN", "MOD", "EDITOR"]);
const MAX_TEXT = 1200;

function clean(value, max = 200) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max).replace(/@everyone/g, "@ everyone").replace(/@here/g, "@ here");
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "الطريقة غير مسموحة." });
  }

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) {
    return res.status(500).json({ error: "إعدادات استقبال التقديمات غير مكتملة. جرّب لاحقًا." });
  }

  const body = req.body || {};
  const applicationType = clean(body.applicationType, 20).toUpperCase();
  const fullName = clean(body.fullName, 100);
  const age = Number(body.age);
  const experience = clean(body.experience, MAX_TEXT);
  const previousPlaces = clean(body.previousPlaces, MAX_TEXT);
  const applicantGender = clean(body.applicantGender, 10);
  const phone = clean(body.phone, 30);
  const discordUsername = clean(body.discordUsername, 100);
  const kickUsername = clean(body.kickUsername, 100);
  const tiktokUsername = clean(body.tiktokUsername, 150);

  if (!ALLOWED_TYPES.has(applicationType)) return res.status(400).json({ error: "نوع التقديم غير صحيح." });
  if (!fullName || !Number.isInteger(age) || age < 13 || age > 99 ||
      !experience || !previousPlaces || !["ولد", "بنت"].includes(applicantGender) ||
      !discordUsername || !kickUsername || !tiktokUsername) {
    return res.status(400).json({ error: "راجع البيانات المطلوبة وحاول مرة أخرى." });
  }
  if (applicantGender === "ولد" && !phone) {
    return res.status(400).json({ error: "رقم الهاتف مطلوب للولد." });
  }

  const fields = [
    { name: "الاسم الكامل", value: fullName, inline: true },
    { name: "العمر الحقيقي", value: String(age), inline: true },
    { name: "نوع المتقدم", value: applicantGender, inline: true },
    { name: "الخبرة", value: experience.slice(0, MAX_TEXT), inline: false },
    { name: "أماكن العمل السابقة", value: previousPlaces.slice(0, MAX_TEXT), inline: false },
    { name: "رقم الهاتف", value: phone || "لم يتم إدخاله", inline: true },
    { name: "يوزر ديسكورد", value: discordUsername, inline: true },
    { name: "يوزر Kick", value: kickUsername, inline: true },
    { name: "يوزر TikTok", value: tiktokUsername, inline: false }
  ].map(field => ({ ...field, value: String(field.value).slice(0, 1024) }));

  try {
    const discordResponse = await fetch(`${webhook}${webhook.includes("?") ? "&" : "?"}wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "SAQR TEAM Applications",
        allowed_mentions: { parse: [] },
        embeds: [{
          title: `📩 تقديم جديد — ${applicationType}`,
          description: `وصل تقديم جديد لقسم **APPY ${applicationType}**.`,
          color: 16765737,
          fields,
          footer: { text: "SAQR TEAM • Applications" },
          timestamp: new Date().toISOString()
        }]
      })
    });

    if (!discordResponse.ok) {
      return res.status(502).json({ error: "تعذر إرسال التقديم إلى ديسكورد. حاول لاحقًا." });
    }
    return res.status(200).json({ success: true });
  } catch {
    return res.status(502).json({ error: "تعذر الاتصال بديسكورد. حاول لاحقًا." });
  }
};
