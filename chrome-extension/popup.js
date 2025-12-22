const API_BASE = "http://127.0.0.1:8000";

const $ = (id) => document.getElementById(id);

function setStatus(text) {
  $("status").innerText = text || "";
}

function setWarn(text) {
  // lightweight “warning” using same status area
  $("status").innerText = text || "";
}

async function loadCvIdFromStorage() {
  const { cv_id } = await chrome.storage.local.get(["cv_id"]);
  if (cv_id) {
    $("cvId").value = cv_id;
    setStatus("Loaded saved CV ID ✅");
  }
}

async function saveCvIdToStorage() {
  const cv_id = $("cvId").value.trim();
  if (!cv_id) throw new Error("cv_id is empty.");
  await chrome.storage.local.set({ cv_id });
  setStatus("Saved CV ID ✅");
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function ensureTabCanReceiveMessages(tab) {
  if (!tab?.id) throw new Error("No active tab found.");
  const url = tab.url || "";
  // Chrome blocks content scripts on internal pages
  if (url.startsWith("chrome://") || url.startsWith("edge://") || url.startsWith("about:")) {
    throw new Error("Cannot extract from browser internal pages.");
  }
}

async function extractFromPage() {
  const tab = await getActiveTab();
  ensureTabCanReceiveMessages(tab);

  const res = await chrome.tabs.sendMessage(tab.id, { type: "JP_EXTRACT_JOB" });
  if (!res?.ok) throw new Error(res?.error || "Could not extract job from page.");

  $("jobTitle").value = res.job.job_title || "";
  $("company").value = res.job.company || "";
  $("jobDesc").value = res.job.job_description || "";

  if (!res.job.company) {
    setWarn("Extracted ✅ Company not found — type it in (common on some sites).");
  } else {
    setStatus("Extracted job info ✅");
  }
}

async function useSelectedText() {
  const tab = await getActiveTab();
  ensureTabCanReceiveMessages(tab);

  const res = await chrome.tabs.sendMessage(tab.id, { type: "JP_GET_SELECTION" });
  if (!res?.ok || !res.text) throw new Error("No text selected. Highlight the job description on the page first.");

  $("jobDesc").value = res.text || "";
  setStatus("Inserted selected text into Job Description ✅");
}

function getFormValues() {
  return {
    cv_id: $("cvId").value.trim(),
    job_title: $("jobTitle").value.trim(),
    company: $("company").value.trim(),
    job_description: $("jobDesc").value.trim(),
    tone: $("tone").value,
    job_id: $("jobId").value.trim(),
  };
}

async function saveTrackedJobViaMatch() {
  const { cv_id, job_title, company, job_description } = getFormValues();

  if (!cv_id) throw new Error("cv_id is required.");
  if (!job_title) throw new Error("Job Title is required (extract or type it).");
  if (!job_description) throw new Error("Job Description is required (extract/paste/select text).");

  // Company is allowed to be empty — but we warn
  if (!company) {
    setWarn("Saving… (Company is empty — you can still save, but add it for best results.)");
  } else {
    setStatus("Saving tracked job (running match)…");
  }

  const r = await fetch(`${API_BASE}/jobs/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cv_id, job_title, company, job_description })
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Save failed: ${text}`);
  }

  const data = await r.json();

  $("jobId").value = data.tracked_job_id || "";
  setStatus(`Saved ✅ tracked_job_id: ${data.tracked_job_id || "(missing from backend response)"}`);
}

async function generateCoverLetter() {
  const { cv_id, job_id, job_title, company, job_description, tone } = getFormValues();

  if (!cv_id) throw new Error("cv_id is required.");
  if (!job_id) throw new Error("tracked job_id is required (click Save tracked job first).");
  if (!job_title) throw new Error("Job Title is required.");
  if (!job_description) throw new Error("Job Description is required.");

  // company optional, but recommended
  if (!company) {
    setWarn("Generating… (Company is empty — letter may look generic. Consider filling it.)");
  } else {
    setStatus("Generating cover letter…");
  }

  const r = await fetch(`${API_BASE}/cover-letter/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cv_id, job_id, job_title, company, job_description, tone })
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Generate failed: ${text}`);
  }

  const data = await r.json();

  $("output").value = data.cover_letter || "";
  setStatus(`Done ✅ (${data.mode || "template"})`);
}

function resetForm(keepCvId = true) {
  const cv = $("cvId").value;
  $("jobTitle").value = "";
  $("company").value = "";
  $("jobDesc").value = "";
  $("jobId").value = "";
  $("output").value = "";
  if (!keepCvId) $("cvId").value = "";
  setStatus("Cleared ✅");
  if (keepCvId) $("cvId").value = cv;
}

// ---- wire up buttons ----
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadCvIdFromStorage();
  } catch (e) {}
});

$("saveCvBtn").addEventListener("click", async () => {
  try {
    setStatus("");
    await saveCvIdToStorage();
  } catch (e) {
    setStatus(e.message);
  }
});

$("extractBtn").addEventListener("click", async () => {
  try {
    setStatus("");
    await extractFromPage();
  } catch (e) {
    setStatus(e.message);
  }
});

$("selectionBtn").addEventListener("click", async () => {
  try {
    setStatus("");
    await useSelectedText();
  } catch (e) {
    setStatus(e.message);
  }
});

$("saveBtn").addEventListener("click", async () => {
  try {
    setStatus("");
    await saveTrackedJobViaMatch();
  } catch (e) {
    setStatus(e.message);
  }
});

$("genBtn").addEventListener("click", async () => {
  try {
    setStatus("");
    await generateCoverLetter();
  } catch (e) {
    setStatus(e.message);
  }
});

$("clearBtn").addEventListener("click", () => resetForm(true));
