const agentChat = document.querySelector("[data-agent-chat]");
const agentForm = document.querySelector("[data-agent-form]");
const agentInput = document.querySelector("[data-agent-input]");
const quickReplies = document.querySelector("[data-quick-replies]");
const summaryPanel = document.querySelector("[data-agent-summary]");
const copySummaryButton = document.querySelector("[data-copy-summary]");
const copyStatus = document.querySelector("[data-copy-status]");
const resetButton = document.querySelector("[data-agent-reset]");

const flow = [
  {
    key: "name",
    prompt:
      "Hi, I am the StrongStart Fitness assistant. I can help you see if coaching is a good fit. What is your name?",
    quickReplies: [],
  },
  {
    key: "goal",
    prompt: "Nice to meet you. What is your main fitness goal right now?",
    quickReplies: ["Lose weight", "Build muscle", "Get stronger", "Improve consistency"],
  },
  {
    key: "service",
    prompt: "Are you looking for online coaching, in-person training, or both?",
    quickReplies: ["Online coaching", "In-person training", "Both"],
  },
  {
    key: "level",
    prompt: "How would you describe your current fitness level?",
    quickReplies: ["Beginner", "Intermediate", "Advanced", "Starting again"],
  },
  {
    key: "limitations",
    prompt: "Do you have any injuries, health limits, or movement restrictions the coach should know about?",
    quickReplies: ["No injuries", "Knee issue", "Back pain", "I will explain"],
  },
  {
    key: "timeline",
    prompt: "When would you ideally like to start?",
    quickReplies: ["This week", "Next week", "This month", "Not sure yet"],
  },
];

const state = {
  step: 0,
  answers: {},
  complete: false,
};

function addMessage(sender, text) {
  const message = document.createElement("div");
  message.className = `agent-message ${sender}`;
  message.innerHTML = `<span>${sender === "bot" ? "AI Assistant" : "Lead"}</span><p>${escapeHtml(text)}</p>`;
  agentChat.appendChild(message);
  agentChat.scrollTop = agentChat.scrollHeight;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setQuickReplies(replies) {
  quickReplies.innerHTML = "";

  replies.forEach((reply) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = reply;
    button.addEventListener("click", () => {
      submitAnswer(reply);
    });
    quickReplies.appendChild(button);
  });
}

function askCurrentQuestion() {
  const current = flow[state.step];

  if (!current) {
    completeFlow();
    return;
  }

  addMessage("bot", current.prompt);
  setQuickReplies(current.quickReplies);
}

function submitAnswer(answer) {
  const cleaned = answer.trim();

  if (!cleaned || state.complete) {
    return;
  }

  const current = flow[state.step];
  state.answers[current.key] = cleaned;
  addMessage("lead", cleaned);
  state.step += 1;
  updateSummary();

  window.setTimeout(() => {
    if (state.step === 2) {
      addMessage(
        "bot",
        "Thanks. I will ask a few quick questions so the coach can understand your goal and recommend the right next step."
      );
    }

    askCurrentQuestion();
  }, 450);

  agentInput.value = "";
}

function getLeadTemperature() {
  const timeline = (state.answers.timeline || "").toLowerCase();

  if (timeline.includes("week")) {
    return "Warm";
  }

  if (timeline.includes("month")) {
    return "Medium";
  }

  return state.answers.timeline ? "Early interest" : "Not enough information yet";
}

function buildSummaryText() {
  const answers = state.answers;
  return [
    "StrongStart Fitness Coaching - Lead Summary",
    "",
    `Name: ${answers.name || "Not collected yet"}`,
    `Goal: ${answers.goal || "Not collected yet"}`,
    `Service interest: ${answers.service || "Not collected yet"}`,
    `Fitness level: ${answers.level || "Not collected yet"}`,
    `Injuries/limitations: ${answers.limitations || "Not collected yet"}`,
    `Timeline: ${answers.timeline || "Not collected yet"}`,
    `Lead temperature: ${getLeadTemperature()}`,
    "",
    "Recommended next step: Invite the lead to a free consultation and confirm their schedule.",
  ].join("\n");
}

function updateSummary() {
  const answers = state.answers;
  const fields = [
    ["Name", answers.name],
    ["Goal", answers.goal],
    ["Service interest", answers.service],
    ["Fitness level", answers.level],
    ["Limitations", answers.limitations],
    ["Timeline", answers.timeline],
    ["Lead temperature", getLeadTemperature()],
  ];

  summaryPanel.innerHTML = fields
    .map(([label, value]) => {
      return `<div><dt>${label}</dt><dd>${escapeHtml(value || "Waiting...")}</dd></div>`;
    })
    .join("");

  copySummaryButton.disabled = Object.keys(answers).length === 0;
}

function completeFlow() {
  state.complete = true;
  setQuickReplies([]);
  addMessage(
    "bot",
    "Great. Based on what you shared, the best next step is a free consultation so the coach can understand your goal, schedule, and starting point. I have prepared a summary for the coach on the right."
  );
  addMessage("bot", "Demo booking link: [Consultation booking link]");
  agentInput.disabled = true;
  agentInput.placeholder = "Demo complete. Reset to try again.";
}

function resetDemo() {
  state.step = 0;
  state.answers = {};
  state.complete = false;
  agentChat.innerHTML = "";
  agentInput.value = "";
  agentInput.disabled = false;
  agentInput.placeholder = "Type your answer...";
  copyStatus.textContent = "";
  copySummaryButton.disabled = true;
  summaryPanel.innerHTML = '<p class="empty-summary">The lead summary will appear here as the conversation progresses.</p>';
  askCurrentQuestion();
}

agentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitAnswer(agentInput.value);
});

copySummaryButton.addEventListener("click", async () => {
  const summary = buildSummaryText();

  try {
    await navigator.clipboard.writeText(summary);
    copyStatus.textContent = "Summary copied.";
  } catch {
    copyStatus.textContent = "Copy failed. Select the summary manually.";
  }
});

resetButton.addEventListener("click", resetDemo);

resetDemo();
