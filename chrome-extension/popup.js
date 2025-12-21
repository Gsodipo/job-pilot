const API_BASE = "http://127.0.0.1:8000";

const $ = (id) => document.getElementById(id);

function setStatus(text) {
  $("status").innerText = text;
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

async function extractFromPage() {
  const tab = await getActiveTab();
  const res = await chrome.tabs.sendMessage(tab.id, { type: "JP_EXTRACT_JOB" });
  if (!res?.ok) throw new Error("Could not extract job from page.");

  $("jobTitle").value = res.job.job_title || "";
  $("company").value = res.job.company || "";
  $("jobDesc").value = res.job.job_description || "";
  setStatus("Extracted job info ✅");
}

async function saveTrackedJobViaMatch() {
  const cv_id = $("cvId").value.trim();
  const job_title = $("jobTitle").value.trim();
  const company = $("company").value.trim();
  const job_description = $("jobDesc").value.trim();

  if (!cv_id) throw new Error("cv_id is required.");
  if (!job_title || !company || !job_description) throw new Error("Missing job fields.");

  setStatus("Saving tracked job (running match)...");

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

  // IMPORTANT: backend should return tracked_job_id
  $("jobId").value = data.tracked_job_id || "";
  setStatus(`Saved ✅ tracked_job_id: ${data.tracked_job_id}`);
}

async function generateCoverLetter() {
  const cv_id = $("cvId").value.trim();
  const job_id = $("jobId").value.trim();
  const job_title = $("jobTitle").value.trim();
  const company = $("company").value.trim();
  const job_description = $("jobDesc").value.trim();
  const tone = $("tone").value;

  if (!cv_id) throw new Error("cv_id is required.");
  if (!job_id) throw new Error("tracked job_id is required (click Save tracked job first).");

  setStatus("Generating cover letter...");

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
  setStatus(`Done ✅ (${data.mode})`);
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
