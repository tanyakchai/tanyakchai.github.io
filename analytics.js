(() => {
  "use strict";

  const MEASUREMENT_ID = "G-94J4CPKQHH";
  const CONSENT_KEY = "tanya-portfolio-analytics-consent";
  const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000;
  let analyticsStarted = false;

  function readConsent() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(CONSENT_KEY));
      if (!saved || Date.now() - saved.savedAt > CONSENT_DURATION) return null;
      return saved.choice;
    } catch (_) {
      return null;
    }
  }

  function saveConsent(choice) {
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, savedAt: Date.now() }));
    } catch (_) {
      // The selection still applies for this page when storage is unavailable.
    }
  }

  function startAnalytics() {
    if (analyticsStarted) return;
    analyticsStarted = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(){ window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID);

    const tag = document.createElement("script");
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(tag);
  }

  function showConsentBanner() {
    if (document.getElementById("analytics-consent")) return;

    const style = document.createElement("style");
    style.id = "analytics-consent-styles";
    style.textContent = `
      #analytics-consent {
        position: fixed;
        left: 16px;
        right: 16px;
        bottom: 16px;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        max-width: 760px;
        margin: 0 auto;
        padding: 16px 18px;
        border: 1px solid #363b45;
        border-radius: 10px;
        background: #1b1f26;
        color: #f2f1ec;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.32);
        font-family: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 13px;
        line-height: 1.5;
      }
      #analytics-consent p { margin: 0; }
      #analytics-consent-actions { display: flex; gap: 8px; flex: 0 0 auto; }
      #analytics-consent button {
        min-height: 36px;
        padding: 8px 12px;
        border: 1px solid #4a4f5a;
        border-radius: 6px;
        font: 600 12px/1 "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        cursor: pointer;
      }
      #analytics-decline { background: transparent; color: #f2f1ec; }
      #analytics-allow { border-color: #8c93fa; background: #8c93fa; color: #14171c; }
      #analytics-consent button:focus-visible { outline: 2px solid #f2f1ec; outline-offset: 2px; }
      @media (max-width: 600px) {
        #analytics-consent { align-items: stretch; flex-direction: column; gap: 12px; }
        #analytics-consent-actions { justify-content: flex-end; }
      }
    `;

    const banner = document.createElement("section");
    banner.id = "analytics-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Analytics preferences");
    banner.innerHTML = `
      <p>This portfolio uses Google Analytics to understand which pages visitors find useful. Analytics remains off unless you allow it.</p>
      <div id="analytics-consent-actions">
        <button type="button" id="analytics-decline">Decline</button>
        <button type="button" id="analytics-allow">Allow analytics</button>
      </div>
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    document.getElementById("analytics-decline").addEventListener("click", () => {
      saveConsent("denied");
      banner.remove();
      style.remove();
    });

    document.getElementById("analytics-allow").addEventListener("click", () => {
      saveConsent("granted");
      banner.remove();
      style.remove();
      startAnalytics();
    });
  }

  const consent = readConsent();
  if (consent === "granted") {
    startAnalytics();
  } else if (consent !== "denied") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showConsentBanner, { once: true });
    } else {
      showConsentBanner();
    }
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || typeof window.gtag !== "function") return;

    const destination = new URL(link.href, window.location.href);
    const linkText = link.textContent.trim().replace(/\s+/g, " ").slice(0, 100);
    const details = {
      link_text: linkText,
      link_url: destination.href,
      source_page: window.location.pathname
    };

    if (destination.protocol === "mailto:") {
      window.gtag("event", "contact_click", { ...details, contact_method: "email" });
      return;
    }

    if (destination.hostname === "linkedin.com" || destination.hostname.endsWith(".linkedin.com")) {
      window.gtag("event", "contact_click", { ...details, contact_method: "linkedin" });
      return;
    }

    if (/Tanya_Chai_Resume\.pdf$/i.test(destination.pathname)) {
      window.gtag("event", "resume_open", details);
      return;
    }

    if (/\/work\/career-copilot\/prototype2?\.html$/i.test(destination.pathname)) {
      window.gtag("event", "prototype_open", details);
      return;
    }

    if (destination.origin === window.location.origin && /\/work\/.+\/index\.html$/i.test(destination.pathname)) {
      window.gtag("event", "project_open", details);
    }
  });
})();
