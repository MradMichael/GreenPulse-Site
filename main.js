/* ============================================================
   Re-Tire Lebanon — contact form
   ------------------------------------------------------------
   Works two ways:

   (A) OUT OF THE BOX — leave FORM_ENDPOINT empty. On submit the
       form opens the visitor's e-mail app with every field
       pre-filled, addressed to FALLBACK_EMAIL.

   (B) TRUE BACKGROUND SEND — paste a free form endpoint into
       FORM_ENDPOINT (e.g. Formspree, Web3Forms, Getform). The
       form then POSTs in the background and shows a success
       message without leaving the page.

       Formspree:  https://formspree.io  ->  create a form  ->
                   copy the URL like  https://formspree.io/f/abcdwxyz
   ============================================================ */

(function () {
  "use strict";

  // ----- CONFIG -------------------------------------------------
  var FORM_ENDPOINT  = "";                       // <-- paste endpoint here to enable background send
  var FALLBACK_EMAIL = "commercial@re-tire.lb";  // used by the e-mail-app fallback
  // --------------------------------------------------------------

  var form = document.getElementById("retire-contact-form");
  if (!form) return;

  var statusEl  = form.querySelector(".form-status");
  var submitBtn = form.querySelector("button[type=submit]");
  var labelEl   = submitBtn ? submitBtn.querySelector(".btn-label") : null;
  var labelText = labelEl ? labelEl.textContent : "Send enquiry";

  function setStatus(msg, kind) {
    statusEl.textContent = msg || "";
    statusEl.className = "form-status" + (kind ? " " + kind : "");
  }

  function val(name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? el.value : "";
  }

  function clearErrors() {
    var bad = form.querySelectorAll(".field.invalid");
    for (var i = 0; i < bad.length; i++) bad[i].classList.remove("invalid");
  }

  function markInvalid(name) {
    var el = form.querySelector('[name="' + name + '"]');
    var field = el && el.closest ? el.closest(".field") : null;
    if (field) field.classList.add("invalid");
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validate(d) {
    clearErrors();
    var ok = true;
    if (!d.name.trim())          { markInvalid("name");    ok = false; }
    if (!isEmail(d.email.trim())){ markInvalid("email");   ok = false; }
    if (!d.message.trim())       { markInvalid("message"); ok = false; }
    if (!ok) setStatus("Please complete the highlighted fields.", "error");
    return ok;
  }

  function buildMailto(d) {
    var subject = "Spec enquiry — " + (d.company || d.name);
    var body = [
      "Name: "          + d.name,
      "Company: "       + d.company,
      "Email: "         + d.email,
      "Enquiry type: "  + d.type,
      "",
      "Target spec / mesh recipe:",
      d.spec || "(none provided)",
      "",
      "Message:",
      d.message
    ].join("\n");
    return "mailto:" + FALLBACK_EMAIL +
           "?subject=" + encodeURIComponent(subject) +
           "&body="    + encodeURIComponent(body);
  }

  function setSending(on) {
    if (submitBtn) submitBtn.disabled = on;
    if (labelEl)   labelEl.textContent = on ? "Sending…" : labelText;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // honeypot: a bot filled the hidden field — silently stop
    if (val("company_website")) return;

    var d = {
      name:    val("name"),
      company: val("company"),
      email:   val("email"),
      type:    val("type"),
      spec:    val("spec"),
      message: val("message")
    };

    if (!validate(d)) return;

    // ---- Fallback path: open the visitor's e-mail client ----
    if (!FORM_ENDPOINT) {
      setStatus("Opening your e-mail app… if nothing happens, write to " + FALLBACK_EMAIL + ".", "success");
      window.location.href = buildMailto(d);
      return;
    }

    // ---- Background submit (Formspree-compatible) ----
    setSending(true);
    setStatus("Sending…", "");

    var fd = new FormData();
    Object.keys(d).forEach(function (k) { fd.append(k, d[k]); });
    fd.append("_subject", "Re-Tire spec enquiry — " + (d.company || d.name));

    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: fd
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          setStatus("Thank you — your enquiry has been sent. We respond within 48 hours.", "success");
          return;
        }
        return res.json().then(function (j) {
          var m = (j && j.errors && j.errors.length)
            ? j.errors.map(function (x) { return x.message; }).join(", ")
            : "Something went wrong.";
          setStatus(m + " You can also email " + FALLBACK_EMAIL + ".", "error");
        }).catch(function () {
          setStatus("Something went wrong. Please email " + FALLBACK_EMAIL + " directly.", "error");
        });
      })
      .catch(function () {
        setStatus("Network error. Please email " + FALLBACK_EMAIL + " directly.", "error");
      })
      .then(function () { setSending(false); });
  });
})();
