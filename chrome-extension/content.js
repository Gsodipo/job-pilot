chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "JP_EXTRACT_JOB") {
    try {
      // Basic extraction strategy:
      // - title: h1 or document.title
      // - company: try common selectors
      // - description: try main/article, else body text trimmed

      const titleEl = document.querySelector("h1");
      const job_title = (titleEl?.innerText || document.title || "").trim();

      const companyEl =
        document.querySelector('[data-company-name]') ||
        document.querySelector(".company") ||
        document.querySelector(".topcard__org-name-link") ||  // LinkedIn-ish
        document.querySelector(".jobsearch-InlineCompanyRating div"); // Indeed-ish

      const company = (companyEl?.innerText || "").trim();

      const descEl =
        document.querySelector("article") ||
        document.querySelector("main") ||
        document.querySelector('[data-job-description]') ||
        document.querySelector(".description") ||
        document.querySelector(".show-more-less-html__markup"); // LinkedIn-ish

      const job_description = (descEl?.innerText || document.body.innerText || "")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(0, 12000); // prevent huge payloads

      sendResponse({
        ok: true,
        job: { job_title, company, job_description }
      });
    } catch (e) {
      sendResponse({ ok: false, error: String(e) });
    }
  }

  return true;
});
