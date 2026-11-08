/* Vanguard Guild: interactivity for the one-page site.
   - highlights the nav link of the section you are reading
   - tribe cards pre-select a tribe in the application form
   - gallery pictures open in a lightbox
   - the application form validates, previews your club and tracks progress
   Progress is kept in localStorage so it survives a refresh. */
(() => {
  "use strict";

  const TRIBES = {
    fighter: {name: "Fighter", plural: "Fighters", text: "Train, spar and compete with people who take it seriously.",
      facts: [["Format", "Open mats, sparring and fight-camp film study"], ["Who attends", "MMA practitioners and combat-sports athletes"], ["How you join", "Apply here, then wait for your invite"]]},
    trader: {name: "Trader", plural: "Traders", text: "Compare strategy, review risk and talk markets face to face.",
      facts: [["Format", "Strategy roundtables and risk reviews"], ["Who attends", "Traders at every level"], ["How you join", "Apply here, then wait for your invite"]]},
    gamer: {name: "Gamer", plural: "Gamers", text: "Meet your scrim partners and compete in person.",
      facts: [["Format", "LAN nights, scrims and tournament watch parties"], ["Who attends", "Competitive and esports players"], ["How you join", "Apply here, then wait for your invite"]]}
  };
  const STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","Other region"];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem("vg_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("vg_" + k, JSON.stringify(v)); } catch (e) {} },
    clear() { try { Object.keys(localStorage).filter((k) => k.startsWith("vg_")).forEach((k) => localStorage.removeItem(k)); } catch (e) {} }
  };
  const say = (text, kind) => { const m = $("#msg"); m.textContent = text; m.className = "msg" + (kind ? " " + kind : ""); };

  /* ---------- nav: highlight the section in view ---------- */
  const links = $$(".top nav a");
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => {
          const here = a.getAttribute("href") === "#" + e.target.id;
          if (here) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current");
        });
      });
    }, {rootMargin: "-45% 0px -50% 0px"});
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- application form ---------- */
  const form = $("#apply-form");
  const stateSel = $("#state");
  const accept = $("#accept");
  const handle = $("#handle");
  stateSel.innerHTML = `<option value="">Select your state</option>` + STATES.map((s) => `<option>${s}</option>`).join("");

  const values = () => ({
    tribe: (form.querySelector('input[name="tribe"]:checked') || {}).value || "",
    state: stateSel.value,
    accepted: accept.checked,
    submitted: store.get("submitted", false)
  });

  // 0 = not started, 34 = tribe + state, 67 = code accepted, 100 = form submitted
  const progress = (v) => {
    if (v.submitted) return [100, "Submitted. Your application is saved on this device."];
    if (v.tribe && v.state && v.accepted) return [67, "Code accepted. Add your details and submit to finish."];
    if (v.tribe && v.state) return [34, "Tribe and state chosen. Accept the Guild code next."];
    return [0, "Not started. Choose your tribe to begin."];
  };

  function render() {
    const v = values();
    const t = TRIBES[v.tribe];
    $$(".item", form).forEach((l) => { const i = $("input", l); l.classList.toggle("on", i.checked); });
    // club preview
    const ready = t && v.state;
    $("#club-title").textContent = ready ? (v.state + " / " + t.name).toUpperCase() : "YOUR CLUB";
    $("#club-empty").hidden = !!ready;
    $("#club").hidden = !ready;
    $("#sq").classList.toggle("on", v.accepted);
    if (ready) {
      $("#club-name").textContent = v.state + " " + t.plural + " club";
      $("#club-text").textContent = t.text;
    }
    $("#club-facts").innerHTML = ready ? t.facts.map(([k, val]) => `<div class="lrow"><dt>${k}</dt><dd>${val}</dd></div>`).join("") : "";
    // progress (hero status box + line under the header)
    const [pct, text] = progress(v);
    $("#pct").textContent = pct + "%";
    $("#next").textContent = text;
    $("#fill").style.width = pct + "%";
    $("#hbar").style.width = pct + "%";
    $("#bar").setAttribute("aria-valuenow", pct);
  }

  const validHandle = () => handle.value.trim() === "" || /^@?[A-Za-z0-9_]{3,20}$/.test(handle.value.trim());
  const save = () => {
    const v = values();
    store.set("tribe", v.tribe); store.set("state", v.state); store.set("accepted", v.accepted); store.set("handle", handle.value.trim());
  };

  // restore saved choices
  const saved = store.get("tribe", "");
  if (TRIBES[saved]) { const r = form.querySelector(`input[name="tribe"][value="${saved}"]`); if (r) r.checked = true; }
  stateSel.value = store.get("state", "");
  accept.checked = store.get("accepted", false);
  handle.value = store.get("handle", "");

  form.addEventListener("change", () => { say(""); save(); render(); });

  // tribe cards choose a tribe, then the link scrolls to #apply
  $$("[data-tribe]").forEach((a) => a.addEventListener("click", () => {
    const r = form.querySelector(`input[name="tribe"][value="${a.dataset.tribe}"]`);
    if (r) { r.checked = true; say(""); save(); render(); }
  }));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = values(), name = $("#name").value.trim(), email = $("#email").value.trim(), why = $("#why").value.trim();
    const fail = (text, el) => { say(text, "err"); el.focus(); };
    if (!v.tribe) return fail("Choose your tribe.", form.querySelector('input[name="tribe"]'));
    if (!v.state) return fail("Select your state.", stateSel);
    if (!v.accepted) return fail("Accept the Guild code to continue.", accept);
    if (!validHandle()) return fail("Use 3 to 20 letters, numbers or underscores for your handle.", handle);
    if (name.length < 2) return fail("Enter your name.", $("#name"));
    if (!/^\S+@\S+\.\S+$/.test(email)) return fail("Enter a valid email address.", $("#email"));
    if (why.length < 10) return fail("Tell us why you want to join (10+ characters).", $("#why"));
    save(); store.set("submitted", true); render();
    say("Demo only, nothing was sent. Thanks, " + name.split(" ")[0] + ". Your application is saved on this device.", "ok");
  });

  $("#clear-btn").addEventListener("click", () => {
    store.clear(); form.reset(); say(""); render();
    window.scrollTo({top: 0, behavior: "smooth"});
  });

  /* ---------- gallery lightbox ---------- */
  const box = $("#lightbox");
  if (box && typeof box.showModal === "function") {
    $$(".shot").forEach((b) => b.addEventListener("click", () => {
      const img = $("img", b);
      $("#lb-img").src = img.src; $("#lb-img").alt = img.alt;
      $("#lb-cap").textContent = b.dataset.title + ": " + b.dataset.line;
      box.showModal();
    }));
    $("#lb-close").addEventListener("click", () => box.close());
    box.addEventListener("click", (e) => { if (e.target === box) box.close(); }); // click on the backdrop
  } else {
    $$(".shot").forEach((b) => { b.style.cursor = "default"; });
  }

  render();
})();
