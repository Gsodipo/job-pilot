// content.js

function pickText(selectors, root = document) {
  for (const sel of selectors) {
    const el = root.querySelector(sel);
    const txt = el?.innerText?.trim();
    if (txt) return txt;
  }
  return "";
}

function cleanText(t) {
  return (t || "")
    .replace(/\u00a0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function waitForAnySelector(selectors, timeoutMs = 3000) {
  return new Promise((resolve) => {
    for (const sel of selectors) {
      if (document.querySelector(sel)) return resolve(true);
    }

    const obs = new MutationObserver(() => {
      for (const sel of selectors) {
        if (document.querySelector(sel)) {
          obs.disconnect();
          return resolve(true);
        }
      }
    });

    obs.observe(document.documentElement, { childList: true, subtree: true });

    setTimeout(() => {
      obs.disconnect();
      resolve(false);
    }, timeoutMs);
  });
}

const host = location.hostname;

function isLinkedIn() {
  return host.includes("linkedin.com");
}
function isIndeed() {
  return host.includes("indeed.");
}
function isGlassdoor() {
  return host.includes("glassdoor.");
}

async function extractLinkedIn() {
  await waitForAnySelector(
    [
      ".jobs-unified-top-card__job-title h1",
      ".job-details-jobs-unified-top-card__job-title h1",
      ".jobs-description__content",
      ".show-more-less-html__markup"
    ],
    3500
  );

  const job_title = pickText([
    ".jobs-unified-top-card__job-title h1",
    ".job-details-jobs-unified-top-card__job-title h1",
    "h1.t-24.t-bold.inline",
    "h1.t-24.t-bold"
  ]);

  const company = pickText([
    ".jobs-unified-top-card__company-name a",
    ".jobs-unified-top-card__company-name",
    ".job-details-jobs-unified-top-card__company-name a",
    ".job-details-jobs-unified-top-card__company-name",
    ".topcard__org-name-link"
  ]);

  const job_description = pickText([
    ".jobs-description__content",
    ".jobs-description-content__text",
    ".show-more-less-html__markup",
    ".jobs-box__html-content",
    "article"
  ]);

  return {
    job_title: cleanText(job_title),
    company: cleanText(company),
    job_description: cleanText(job_description).slice(0, 12000)
  };
}

async function extractIndeed() {
  await waitForAnySelector(
    [
      "h1.jobsearch-JobInfoHeader-title",
      "#jobDescriptionText",
      "[data-testid='jobDetailTitle']",
      "[data-testid='jobDescriptionText']"
    ],
    3500
  );

  const job_title = pickText([
    "h1.jobsearch-JobInfoHeader-title",
    "[data-testid='jobDetailTitle']",
    "h1"
  ]);

  const company = pickText([
    "[data-testid='company-name']",
    "div.jobsearch-InlineCompanyRating div:first-child",
    "div.jobsearch-CompanyInfoWithoutHeaderImage div:first-child",
    "div.jobsearch-CompanyInfoContainer a",
    "div.jobsearch-CompanyInfoContainer div"
  ]);

  const job_description = pickText([
    "#jobDescriptionText",
    "[data-testid='jobDescriptionText']",
    ".jobsearch-jobDescriptionText",
    "article",
    "main"
  ]);

  return {
    job_title: cleanText(job_title),
    company: cleanText(company),
    job_description: cleanText(job_description).slice(0, 12000)
  };
}

async function extractGlassdoor() {
  await waitForAnySelector(
    [
      "h1[data-test='job-title']",
      "[data-test='employer-name']",
      "[data-test='jobDescriptionContent']",
      "[data-test='job-description']"
    ],
    4500
  );

  const job_title = pickText([
    "h1[data-test='job-title']",
    "h1[data-test='jobTitle']",
    "h1"
  ]);

  const company = pickText([
    "[data-test='employer-name']",
    "[data-test='employerName']",
    "[data-test='employer']",
    ".EmployerProfile_employerName__",
    ".employerName"
  ]);

  const job_description = pickText([
    "[data-test='jobDescriptionContent']",
    "[data-test='job-description']",
    "[data-test='jobDescription']",
    "article",
    "main"
  ]);

  return {
    job_title: cleanText(job_title),
    company: cleanText(company),
    job_description: cleanText(job_description).slice(0, 12000)
  };
}

function extractGeneric() {
  const titleEl = document.querySelector("h1");
  const job_title = (titleEl?.innerText || document.title || "").trim();

  const company = pickText([
    "[data-company-name]",
    ".company"
  ]);

  const job_description = pickText([
    "[data-job-description]",
    ".description",
    "article",
    "main",
    "body"
  ]);

  return {
    job_title: cleanText(job_title),
    company: cleanText(company),
    job_description: cleanText(job_description).slice(0, 12000)
  };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      if (msg.type === "JP_GET_SELECTION") {
        const text = window.getSelection()?.toString()?.trim();
        return sendResponse({ ok: !!text, text: text?.slice(0, 12000) || "" });
      }

      if (msg.type === "JP_EXTRACT_JOB") {
        let job;

        if (isLinkedIn()) job = await extractLinkedIn();
        else if (isIndeed()) job = await extractIndeed();
        else if (isGlassdoor()) job = await extractGlassdoor();
        else job = extractGeneric();

        // Debug payload so you can see what site + what got extracted
        return sendResponse({
          ok: true,
          job,
          debug: {
            host,
            hasTitle: !!job.job_title,
            hasCompany: !!job.company,
            hasDesc: !!job.job_description
          }
        });
      }

      return sendResponse({ ok: false, error: "Unknown message type" });
    } catch (e) {
      return sendResponse({ ok: false, error: String(e) });
    }
  })();

  return true;
});
