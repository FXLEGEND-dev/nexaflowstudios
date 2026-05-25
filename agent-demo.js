const agentConfig = window.nexaAgentDemo || {};

const agentChat = document.querySelector("[data-agent-chat]");
const agentForm = document.querySelector("[data-agent-form]");
const agentInput = document.querySelector("[data-agent-input]");
const quickReplies = document.querySelector("[data-quick-replies]");
const summaryPanel = document.querySelector("[data-agent-summary]");
const copySummaryButton = document.querySelector("[data-copy-summary]");
const copyStatus = document.querySelector("[data-copy-status]");
const resetButton = document.querySelector("[data-agent-reset]");

const defaultFlow = [
  {
    key: "name",
    label: "Name",
    prompt:
      "Hi, I am the StrongStart Fitness assistant. I can help you see if coaching is a good fit. What is your name?",
    quickReplies: [],
  },
  {
    key: "goal",
    label: "Goal",
    prompt: "Nice to meet you. What is your main fitness goal right now?",
    quickReplies: ["Lose weight", "Build muscle", "Get stronger", "Improve consistency"],
  },
  {
    key: "service",
    label: "Service interest",
    prompt: "Are you looking for online coaching, in-person training, or both?",
    quickReplies: ["Online coaching", "In-person training", "Both"],
  },
  {
    key: "level",
    label: "Current level",
    prompt: "How would you describe your current fitness level?",
    quickReplies: ["Beginner", "Intermediate", "Advanced", "Starting again"],
  },
  {
    key: "limitations",
    label: "Injuries/limitations",
    prompt: "Do you have any injuries, health limits, or movement restrictions the coach should know about?",
    quickReplies: ["No injuries", "Knee issue", "Back pain", "I will explain"],
  },
  {
    key: "timeline",
    label: "Timeline",
    prompt: "When would you ideally like to start?",
    quickReplies: ["This week", "Next week", "This month", "Not sure yet"],
  },
];

const flow = agentConfig.flow || defaultFlow;
const summaryTitle = agentConfig.summaryTitle || "StrongStart Fitness Coaching - Lead Summary";
const botLabel = agentConfig.botLabel || "AI Assistant";
const leadLabel = agentConfig.leadLabel || "Lead";
const bridgeMessage =
  agentConfig.bridgeMessage ||
  "Thanks. I will ask a few quick questions so the business can understand your goal and recommend the right next step.";
const completionMessage =
  agentConfig.completionMessage ||
  "Great. Based on what you shared, the best next step is a free consultation so the coach can understand your goal, schedule, and starting point. I have prepared a summary on the right.";
const finalMessage = agentConfig.finalMessage || "Demo booking link: [Consultation booking link]";
const recommendedNextStep =
  agentConfig.recommendedNextStep ||
  "Invite the lead to a free consultation and confirm their schedule.";
const emptySummary =
  agentConfig.emptySummary || "The lead summary will appear here as the conversation progresses.";

const state = {
  step: 0,
  answers: {},
  complete: false,
};

function addMessage(sender, text) {
  const message = document.createElement("div");
  message.className = `agent-message ${sender}`;
  message.innerHTML = `<span>${sender === "bot" ? botLabel : leadLabel}</span><p>${escapeHtml(text)}</p>`;
  agentChat.appendChild(message);
  agentChat.scrollTop = agentChat.scrollHeight;
}

function escapeHtml(value) {
  return String(value)
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
  setQuickReplies(current.quickReplies || []);
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
    if (state.step === 2 && bridgeMessage) {
      addMessage("bot", bridgeMessage);
    }

    askCurrentQuestion();
  }, 450);

  agentInput.value = "";
}

function getLeadTemperature() {
  if (typeof agentConfig.scoreLead === "function") {
    return agentConfig.scoreLead(state.answers);
  }

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
  const answerRows = flow.map((item) => {
    return `${item.label || item.key}: ${state.answers[item.key] || "Not collected yet"}`;
  });

  return [
    summaryTitle,
    "",
    ...answerRows,
    `Lead temperature: ${getLeadTemperature()}`,
    "",
    `Recommended next step: ${recommendedNextStep}`,
  ].join("\n");
}

function updateSummary() {
  const fields = flow.map((item) => [item.label || item.key, state.answers[item.key]]);
  fields.push(["Lead temperature", getLeadTemperature()]);

  summaryPanel.innerHTML = fields
    .map(([label, value]) => {
      return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || "Waiting...")}</dd></div>`;
    })
    .join("");

  copySummaryButton.disabled = Object.keys(state.answers).length === 0;
}

function completeFlow() {
  state.complete = true;
  setQuickReplies([]);
  addMessage("bot", completionMessage);

  if (finalMessage) {
    addMessage("bot", finalMessage);
  }

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
  summaryPanel.innerHTML = `<p class="empty-summary">${escapeHtml(emptySummary)}</p>`;
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
