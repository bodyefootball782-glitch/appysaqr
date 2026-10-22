const cards = document.querySelectorAll(".application-card");
const formPanel = document.getElementById("formPanel");
const form = document.getElementById("applicationForm");
const formTitle = document.getElementById("formTitle");
const appTypeInput = document.getElementById("applicationType");
const formStatus = document.getElementById("formStatus");
const submitButton = document.getElementById("submitButton");
const phoneInput = document.getElementById("phoneInput");
const phoneRequirement = document.getElementById("phoneRequirement");
const backButton = document.getElementById("backButton");

// ضع رابط دعوة ديسكورد الحقيقي هنا، وسيتم استخدامه في الزرين أعلى الصفحة.
const DISCORD_INVITE_URL = "https://discord.com/";

document.getElementById("discordTop").href = DISCORD_INVITE_URL;
document.getElementById("discordJoin").href = DISCORD_INVITE_URL;

cards.forEach(card => {
  card.addEventListener("click", () => {
    const type = card.dataset.type;
    form.reset();
    appTypeInput.value = type;
    formTitle.textContent = `APPY ${type}`;
    formStatus.textContent = "";
    formStatus.className = "form-status";
    phoneInput.required = false;
    phoneRequirement.textContent = "اختياري للبنت / إلزامي للولد";
    document.querySelector(".application-grid").hidden = true;
    document.querySelector(".discord-notice").hidden = true;
    document.querySelector(".hero").hidden = true;
    formPanel.hidden = false;
    formPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll('input[name="applicantGender"]').forEach(radio => {
  radio.addEventListener("change", () => {
    phoneInput.required = radio.value === "ولد" && radio.checked;
    phoneInput.placeholder = phoneInput.required ? "رقم الهاتف (مطلوب)" : "رقم الهاتف (اختياري)";
  });
});

backButton.addEventListener("click", () => {
  formPanel.hidden = true;
  document.querySelector(".application-grid").hidden = false;
  document.querySelector(".discord-notice").hidden = false;
  document.querySelector(".hero").hidden = false;
  document.getElementById("home").scrollIntoView({ behavior: "smooth", block: "start" });
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = Object.fromEntries(new FormData(form).entries());
  if (data.applicantGender === "ولد" && !data.phone.trim()) {
    phoneInput.setCustomValidity("رقم الهاتف مطلوب للولد.");
    phoneInput.reportValidity();
    phoneInput.setCustomValidity("");
    return;
  }

  submitButton.disabled = true;
  submitButton.querySelector("span:first-child").textContent = "جاري إرسال التقديم...";
  formStatus.textContent = "";
  formStatus.className = "form-status";

  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "حصلت مشكلة أثناء الإرسال. جرّب مرة تانية.");
    formStatus.textContent = "تم إرسال تقديمك بنجاح! تأكد من دخول سيرفر ديسكورد صقر لمتابعة الرد.";
    formStatus.className = "form-status success";
    form.reset();
  } catch (error) {
    formStatus.textContent = error.message || "تعذر إرسال التقديم. حاول مرة أخرى.";
    formStatus.className = "form-status error";
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span:first-child").textContent = "إرسال التقديم";
  }
});
