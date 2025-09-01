let playerName = "";

let flag2 = false;
let flag4 = false;
let flag5 = false;
let flag7 = false;
let flag8 = false;
let flag10 = false;

let isJakeChapter = false;
let inviteHandled = false;
function capitalizeName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

let isFinalLineBeforeEnd = false;

let currentChapter = 0;
const chatLog = {};
for (let c = 1; c <= 10; c++) chatLog[c] = [];

/* Chat Log */
const chatLogBtn = () => document.getElementById("chatlog-btn");
const chatLogOverlay = () => document.getElementById("chatlog-overlay");
const chatLogContent = () => document.getElementById("chatlog-content");

/* Name Standardisation */
function _processSpeakerTextForLog(speaker, text) {
  const processedText = (text || "")
    .replace(/Y\/N/g, capitalizeName(playerName))
    .replace(/@y\/n/gi, `@${playerName?.toLowerCase?.() || "y/n"}`);
  const displaySpeaker = (speaker || "")
    .replace(/@y\/n/gi, `@${playerName?.toLowerCase?.() || "y/n"}`)
    .replace(/Y\/N/g, capitalizeName(playerName));
  return { displaySpeaker, processedText };
}

/* Record line to ChatLog */
function recordChatLog(speaker, text) {
  if (currentChapter < 1 || currentChapter > 10) return;

  const { displaySpeaker, processedText } = _processSpeakerTextForLog(
    speaker,
    text
  );

  const list = chatLog[currentChapter];
  const last = list[list.length - 1];

  /* Allow this specific duplicate text */
  const allowDuplicate = processedText.trim() === "[You are playing with Jake]";

  /* Skip if identical to the most recent entry (unless it's the allowed duplicate) */
  if (last && last.text === processedText && !allowDuplicate) return;

  list.push({ speaker: displaySpeaker, text: processedText });
  if (chatLogOverlay()?.style.display === "block") renderChatLog();
}

/* Build the overlay content up to (and including) the current chapter */
function renderChatLog() {
  const wrap = chatLogContent();
  if (!wrap) return;
  wrap.innerHTML = "";
  for (let c = 1; c <= Math.min(currentChapter, 10); c++) {
    const entries = chatLog[c];
    if (!entries?.length) continue;
    const sec = document.createElement("div");
    sec.className = "chatlog-chapter";
    sec.innerHTML = `<h3>Chapter ${c}</h3>`;
    entries.forEach((e) => {
      const row = document.createElement("div");
      row.className = "chatlog-line";
      row.innerHTML = `
        <div class="chatlog-speaker">${e.speaker}</div>
        <div class="chatlog-text">${e.text}</div>
      `;
      sec.appendChild(row);
    });
    wrap.appendChild(sec);
  }
}

/* Toggle overlay */
function openChatLog() {
  if (!chatLogOverlay()) return;
  renderChatLog();
  chatLogOverlay().style.display = "block";
}
function closeChatLog() {
  if (!chatLogOverlay()) return;
  chatLogOverlay().style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = chatLogBtn();
  if (btn) btn.addEventListener("click", openChatLog);
  chatLogOverlay()?.addEventListener("click", (e) => {
    if (e.target.matches("[data-close], .chatlog-backdrop")) closeChatLog();
  });
});
let relationshipBar;
const maxHearts = 10;
let currentHearts = 5;

/* Chapter 8 Mobile State */
let pendingChapterAfterWarning = null;
let mobileCh8Index = 0;
let mobileCh8Active = false;

/* Chapter 8 Mobile DM Dialogue */
const mobileCh8Initial = [
  {
    speaker: "@jake",
    text: "Yo, haven't seen you online in a while. Been thinking about you.",
  },
  { speaker: "@y/n", text: "Sorry, I've been real busy." },
  { speaker: "@jake", text: "WYD RN? I just finished showering.", image: true },
  { speaker: "@y/n", text: "Woah, uh... I was studying..." },
  { speaker: "@jake", text: "Ugh, you're always studying. Like what you see?" },
  { speaker: "@y/n", text: "I mean….. I'm just surprised, haha." },
  {
    speaker: "@jake",
    text: "Oh, don't deny it. Send me one back. I'm really in the mood RN.",
  },
];

/* Chapter 8 Mobile DM Choice Paths */
const mobileCh8ChoiceSend = [
  { speaker: "@y/n", text: "Give me a sec… Don't get your hopes up." },
  {
    speaker: "@jake",
    text: "I'm sure you look great… take your time, I'm waiting.",
  },
  { speaker: "@y/n", text: "Just... don't send this to anyone, alright?" },
  { speaker: "@jake", text: "Of course, we're friends. You can trust me." },
  { speaker: "@y/n", text: "", image: true },
  { speaker: "@jake", text: "Knew you were cute." },
  { speaker: "@y/n", text: "Haha... you're one to talk." },
  {
    speaker: "@jake",
    text: "Lower your camera for me cutie. Wanna see the other half.",
  },
  { speaker: "@y/n", text: "Can't RN. GTG." },
  {
    speaker: "@jake",
    text: "Alright, thanks. I'm keeping this all to myself.",
  },
];

const mobileCh8ChoiceDecline = [
  { speaker: "@y/n", text: "I'm not comfortable with that…" },
  {
    speaker: "@jake",
    text: "C'mon, you've seen me, now I wanna see you. Don't be shy.",
  },
  { speaker: "@y/n", text: "I don't look that good, Jake..." },
  {
    speaker: "@jake",
    text: "Seriously? I bet you look great. Don't be so hard on yourself.",
  },
  {
    speaker: "@y/n",
    text: "I don't take pictures like that. It's just... not my thing.",
  },
  { speaker: "@jake", text: "Ugh, please? We could make it our thing." },
  { speaker: "@y/n", text: "No thanks... GTG." },
  {
    speaker: "@jake",
    text: "Fine. I'll be waiting for the day I get some in return.",
  },
];

/* Initialize hearts */
function initRelationshipBar() {
  if (!relationshipBar)
    relationshipBar = document.getElementById("relationship-bar");
  if (!relationshipBar) return;

  let heartsRow = relationshipBar.querySelector("#relationship-hearts");
  if (!heartsRow) {
    heartsRow = document.createElement("div");
    heartsRow.id = "relationship-hearts";
    relationshipBar.appendChild(heartsRow);
  }

  /* (Re)render hearts */
  heartsRow.innerHTML = "";
  for (let i = 0; i < maxHearts; i++) {
    const heart = document.createElement("img");
    heart.src =
      i < currentHearts ? "images/heart-fill.png" : "images/heart-nofill.png";
    heartsRow.appendChild(heart);
  }
}
function updateRelationshipBar() {
  const heartsRow = document.getElementById("relationship-hearts");
  if (!heartsRow) return;
  const hearts = heartsRow.querySelectorAll("img");
  hearts.forEach((heart, index) => {
    heart.src =
      index < currentHearts
        ? "images/heart-fill.png"
        : "images/heart-nofill.png";
  });
}

function increaseRelationship() {
  if (currentHearts < maxHearts) {
    currentHearts++;
    updateRelationshipBar();
    positiveSFX.play();
    showHeartGainEffect();
    spawnFloatingHearts();
  }
}

function showOrHideRelationshipBar() {
  if (!relationshipBar)
    relationshipBar = document.getElementById("relationship-bar");
  if (!relationshipBar) return;
  relationshipBar.style.display =
    currentChapter >= 1 && currentChapter <= 10 ? "flex" : "none";
}

function decreaseRelationship() {
  if (currentHearts > 0) {
    currentHearts--;
    updateRelationshipBar();
    negativeSFX.play();
    showDamageEffect();
  }
}

const positiveSFX = new Audio("audio/positive.mp3");
const negativeSFX = new Audio("audio/negative.mp3");
positiveSFX.volume = 0.6;
negativeSFX.volume = 0.5;

const selectSFX = new Audio("audio/select.mp3");
selectSFX.volume = 1.0;

const hoverSFX = new Audio("audio/hover.wav");
hoverSFX.volume = 0.6;

const momKnockSFX = new Audio("audio/mom-knock.mp3");
momKnockSFX.volume = 1.0;

const keyboardTypingSFX = new Audio("audio/keyboard-typing.mp3");
keyboardTypingSFX.loop = true;
keyboardTypingSFX.volume = 0.6;

const phoneTypingSFX = new Audio("audio/phone-typing.mp3");
phoneTypingSFX.loop = true;
phoneTypingSFX.volume = 1.0;

const messageSentSFX = new Audio("audio/message-sent.mp3");
messageSentSFX.volume = 0.8;

function crossfade(fromId, toId, duration = 700) {
  const from = document.getElementById(fromId);
  const to = document.getElementById(toId);
  if (!from || !to) return;

  to.style.display = "block";
  to.style.opacity = 0;
  to.style.zIndex = 1;

  from.style.transition = `opacity ${duration}ms ease`;
  to.style.transition = `opacity ${duration}ms ease`;

  requestAnimationFrame(() => {
    if (getComputedStyle(from).display === "none") {
      from.style.display = "block";
      from.style.opacity = 1;
    }
    from.style.opacity = 0;
    to.style.opacity = 1;
  });

  setTimeout(() => {
    from.style.display = "none";
    from.style.opacity = "";
    from.style.transition = "";
    to.style.zIndex = "0";
    to.style.transition = "";
  }, duration + 50);
}

function updateNameTagStyling() {
  const nameTagBox = document.querySelector(".name-tag");
  if (!nameTagBox) return;

  const displayedName = nameTagBox.innerText.trim().toLowerCase();
  const playerTag = "@" + playerName.toLowerCase();
  const playerNameOnly = playerName.toLowerCase();

  nameTagBox.style.backgroundColor = "white";
  nameTagBox.style.color = "black";

  if (displayedName === "@jake" || displayedName === "jake") {
    nameTagBox.style.backgroundColor = "#099396";
    nameTagBox.style.color = "white";
  } else if (
    displayedName === playerTag ||
    displayedName === playerNameOnly ||
    displayedName === "you"
  ) {
    nameTagBox.style.backgroundColor = "#ee9b00";
    nameTagBox.style.color = "white";
  } else if (displayedName === "mom") {
    nameTagBox.style.backgroundColor = "#e889af";
    nameTagBox.style.color = "white";
  } else if (displayedName === "@ggnore") {
    nameTagBox.style.backgroundColor = "#5e60ce";
    nameTagBox.style.color = "white";
  } else if (
    displayedName === "valorian" ||
    displayedName === "cutscene" ||
    displayedName === "chat"
  ) {
    nameTagBox.style.backgroundColor = "white";
    nameTagBox.style.color = "black";
  }
}

function startLivestream() {
  selectSFX.play();
  document.getElementById("play-button").style.display = "none";
  document.getElementById("livestream-screen").style.display = "none";
  document.getElementById("livestream-play-screen").style.display = "block";
  document.getElementById("relationship-bar").style.display = "none";

  const dialogueContainer = document.querySelector(".dialogue-container");
  dialogueContainer.style.display = "flex";
  document.querySelector(".name-tag").innerText = dialogueLines[0].speaker;
  typeText(dialogueLines[0].text, document.getElementById("dialogue"));
  relationshipBar = document.getElementById("relationship-bar");
  if (relationshipBar) {
    relationshipBar.style.display = "flex";
    showOrHideRelationshipBar();
    initRelationshipBar();
  }
}

function showLivestreamScreen() {
  document.getElementById("livestream-screen").style.display = "block";
}

function hideLivestreamScreen() {
  document.getElementById("livestream-screen").style.display = "none";
}

function showValorianWithJakeScreen() {
  const dm = document.getElementById("dm-screen");
  if (dm) {
    dm.classList.remove("dm-background-blur", "animate__fadeOut");
    dm.style.display = "none";
  }
  const dmUI = document.getElementById("dm-desktop-interface");
  if (dmUI) dmUI.style.display = "none";

  const ss = document.getElementById("server-screen");
  if (ss) ss.style.display = "none";
  document.getElementById("victory-screen").style.display = "none";
  document.getElementById("defeat-screen").style.display = "none";

  const v = document.getElementById("valorian-with-jake-screen");
  v.style.opacity = 0;
  v.style.display = "block";
  requestAnimationFrame(() => {
    v.style.transition = "opacity 500ms ease";
    v.style.opacity = 1;
  });
}

function showInviteModal() {
  if (inviteHandled) return;
  const m = document.getElementById("invite-modal");
  if (m) m.style.display = "flex";
}
function hideInviteModal() {
  const m = document.getElementById("invite-modal");
  if (m) m.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("invite-join-btn");
  if (btn)
    btn.addEventListener("click", () => {
      inviteHandled = true;
      hideInviteModal();

      const dlg = document.querySelector(".dialogue-container");
      if (dlg) dlg.style.display = "none";
      const ls = document.getElementById("livestream-screen");
      if (ls) ls.style.display = "none";
      const lsp = document.getElementById("livestream-play-screen");
      if (lsp) lsp.style.display = "none";

      fadeToTitleScreen();
    });
});

function hideValorianWithJakeScreen() {
  document.getElementById("valorian-with-jake-screen").style.display = "none";
}

function showVictoryScreen() {
  const ss = document.getElementById("server-screen");
  if (ss) ss.style.display = "none";
  document.getElementById("victory-screen").style.display = "block";
}

function hideVictoryScreen() {
  document.getElementById("victory-screen").style.display = "none";
}

function showDefeatScreen() {
  document.getElementById("defeat-screen").style.display = "block";
}

function hideDefeatScreen() {
  document.getElementById("defeat-screen").style.display = "none";
}

function showDMScreen() {
  document.getElementById("dm-screen").style.display = "block";
}

function hideDMScreen() {
  document.getElementById("dm-screen").style.display = "none";
}

function showKitchenScreen() {
  document.getElementById("kitchen-screen").style.display = "block";
}

function hideKitchenScreen() {
  document.getElementById("kitchen-screen").style.display = "none";
}

function showGunSkinsScreen() {
  document.getElementById("gun-skins-screen").style.display = "block";
}

function hideGunSkinsScreen() {
  document.getElementById("gun-skins-screen").style.display = "none";
}

function showHomeworkKeyboardScreen() {
  document.getElementById("homework-keyboard-screen").style.display = "block";
}

function hideHomeworkKeyboardScreen() {
  document.getElementById("homework-keyboard-screen").style.display = "none";
}
function hidePhoneRingScreen() {
  document.getElementById("phone-ring-screen").style.display = "none";
}

function showVideoCallScreen() {
  document.getElementById("video-call-screen").style.display = "block";
}

function hideVideoCallScreen() {
  document.getElementById("video-call-screen").style.display = "none";
}

function showMomImage(id) {
  document.getElementById("mom-standing").style.display = "none";
  document.getElementById("mom-talking-1").style.display = "none";
  document.getElementById("mom-talking-2").style.display = "none";

  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

function hideAllMomImages() {
  showMomImage("");
}

function showPhoneOnBedScreen() {
  const wrap = document.getElementById("phone-on-bed-screen");
  if (!wrap) return;

  wrap.style.display = "block";
  wrap.style.opacity = 0;

  requestAnimationFrame(() => {
    wrap.style.transition = "opacity 800ms ease";
    wrap.style.opacity = 1;
  });
}

function hidePhoneOnBedScreen() {
  const wrap = document.getElementById("phone-on-bed-screen");
  if (wrap) {
    wrap.style.transition = "opacity 300ms ease";
    wrap.style.opacity = 0;
    setTimeout(() => {
      wrap.style.display = "none";
    }, 300);
  }
}

function setMobileJakeStatus(online = true) {
  const avatar = document.querySelector(
    "#mobile-dm-interface .mobile-dm-avatar"
  );
  const statusDot = document.querySelector(
    "#mobile-dm-interface .mobile-dm-status-dot"
  );
  const statusTxt =
    document.querySelector("#mobile-dm-interface .mobile-dm-status span") ||
    document.querySelector("#mobile-dm-interface .mobile-dm-status");

  const onCol = "#4CAF50";
  const offCol = "#777";

  if (avatar) avatar.style.borderColor = online ? onCol : offCol;
  if (statusDot) statusDot.style.backgroundColor = online ? onCol : offCol;
  if (statusTxt) {
    statusTxt.textContent = online ? "Online" : "Offline";
    statusTxt.style.color = online ? onCol : offCol;
  }
}

function showJakeSmiling() {
  const el = document.getElementById("jake-smiling");
  if (el) el.style.display = "block";
}
function hideJakeSmiling() {
  const el = document.getElementById("jake-smiling");
  if (el) el.style.display = "none";
}

function showMomSweeping() {
  const el = document.getElementById("mom-sweeping");
  if (el) el.style.display = "block";
}
function hideMomSweeping() {
  const el = document.getElementById("mom-sweeping");
  if (el) el.style.display = "none";
}

function hideStepBackImgs() {
  ["step-back-1", "step-back-2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}
function showStepBack(id) {
  hideStepBackImgs();
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

function showContentWarning() {
  const warningScreen = document.getElementById("content-warning-screen");

  if (relationshipBar) {
    relationshipBar.style.display = "none";
  }

  warningScreen.style.display = "flex";
  warningScreen.classList.add("animate__animated", "animate__fadeIn");

  setTimeout(hideContentWarning, 5000);
}

function hideContentWarning() {
  const warningScreen = document.getElementById("content-warning-screen");
  warningScreen.classList.remove("animate__fadeIn");
  warningScreen.classList.add("animate__fadeOut");

  setTimeout(() => {
    warningScreen.style.display = "none";
    warningScreen.classList.remove("animate__fadeOut");

    if (pendingChapterAfterWarning === 8) {
      pendingChapterAfterWarning = null;

      const dialogueContainer = document.querySelector(".dialogue-container");
      if (dialogueContainer) dialogueContainer.style.display = "none";

      const hw = document.getElementById("homework-keyboard-screen");
      if (hw) {
        hw.style.opacity = 0;
        hw.style.display = "block";
        hw.classList.add("dm-background-blur");
        setTimeout(() => {
          hw.style.transition = "opacity 1s ease-in-out";
          hw.style.opacity = 1;
        }, 100);
      }

      showMobileDMInterfaceChapter8();
      return;
    }

    document.querySelector(".dialogue-box").disabled = false;
    document.querySelector(".dialogue-box").style.pointerEvents = "auto";
    const line = dialogueLines[currentLine];
    document.querySelector(".name-tag").innerText = line.speaker;
    typeText(line.text, document.getElementById("dialogue"));
  }, 500);
}

function showMomKnockScreen() {
  document.getElementById("mom-knock-screen").style.display = "block";
}

function hideMomKnockScreen() {
  document.getElementById("mom-knock-screen").style.display = "none";
}

function crossfadeMomKnockOnce(backToMobileFn) {
  const mobileDMScreen = document.getElementById("mobile-dm-screen");
  const mobileDMInterface = document.getElementById("mobile-dm-interface");
  const hw = document.getElementById("homework-keyboard-screen");
  const mom = document.getElementById("mom-knock-screen");
  const dialogueContainer = document.querySelector(".dialogue-container");
  const nameTag = document.getElementById("name-tag");
  const dialogueP = document.getElementById("dialogue");
  const btn = document.querySelector(".dialogue-box");

  [mobileDMScreen, mobileDMInterface, hw].forEach((el) => {
    if (!el) return;
    el.style.transition = "opacity 600ms ease";
    el.style.opacity = 0;
  });

  setTimeout(() => {
    if (mobileDMInterface) mobileDMInterface.style.display = "none";
    if (mobileDMScreen) mobileDMScreen.style.display = "none";
    if (hw) {
      hw.style.display = "none";
      hw.classList.remove("dm-background-blur");
    }

    if (mom) {
      mom.style.display = "block";
      mom.style.opacity = 0;
      mom.style.transition = "opacity 600ms ease";
      requestAnimationFrame(() => (mom.style.opacity = 1));
    }

    if (dialogueContainer) {
      dialogueContainer.style.display = "flex";
      dialogueContainer.style.opacity = "1";

      nameTag.innerText = "Mom";
      const momRaw = "Y/N? Can I come in?";
      const momProcessed = momRaw.replace(/Y\/N/g, capitalizeName(playerName));
      typeText(`“${momProcessed}”`, dialogueP);

      recordChatLog("Mom", momRaw);
      try {
        momKnockSFX.currentTime = 0;
        momKnockSFX.play();
      } catch (e) {}
    }

    if (btn) {
      btn.disabled = false;
      btn.style.pointerEvents = "auto";

      const prevOnClick = btn.onclick;
      btn.onclick = null;

      const onClickOnce = (ev) => {
        ev?.stopImmediatePropagation?.();
        btn.removeEventListener("click", onClickOnce);

        if (mom) mom.style.opacity = 0;
        setTimeout(() => {
          if (mom) mom.style.display = "none";

          if (hw) {
            hw.style.display = "block";
            hw.classList.add("dm-background-blur");
            hw.style.opacity = 0;
            hw.style.transition = "opacity 600ms ease";
            requestAnimationFrame(() => (hw.style.opacity = 1));
          }

          if (mobileDMScreen) {
            mobileDMScreen.style.display = "flex";
            mobileDMScreen.style.opacity = 0;
            mobileDMScreen.style.transition = "opacity 600ms ease";
            requestAnimationFrame(() => (mobileDMScreen.style.opacity = 1));
          }
          if (mobileDMInterface) {
            mobileDMInterface.style.display = "flex";
            mobileDMInterface.style.opacity = 0;
            mobileDMInterface.style.transition = "opacity 600ms ease";
            requestAnimationFrame(() => (mobileDMInterface.style.opacity = 1));
          }

          if (dialogueContainer) dialogueContainer.style.display = "none";

          if (typeof backToMobileFn === "function") {
            setTimeout(() => backToMobileFn(), 50);
          }

          btn.onclick = prevOnClick;
        }, 600);
      };

      btn.addEventListener("click", onClickOnce, { once: true });
    }
  }, 620);
}

function showHallwayScreen() {
  document.getElementById("hallway-screen").style.display = "block";
}

function hideHallwayScreen() {
  document.getElementById("hallway-screen").style.display = "none";
}

function hideRelationshipBar() {
  if (relationshipBar) {
    relationshipBar.style.display = "none";
  }
}

function goBackToSummary() {
  selectSFX.play();

  const advice = document.getElementById("advice-screen");
  if (advice) advice.style.display = "none";

  const summary = document.getElementById("summary-screen");
  if (summary) summary.style.display = "flex";
}

function goBackToEnd() {
  selectSFX.play();

  document.getElementById("summary-screen").style.display = "none";
  const end = document.getElementById("end-screen");
  if (end) end.style.display = "flex";

  const toSummaryBtn = document.getElementById("to-summary-button");
  if (toSummaryBtn) toSummaryBtn.style.display = "inline-block";
}

function hideAllForChapterTitle() {
  const ids = [
    "server-screen",
    "valorian-with-jake-screen",
    "victory-screen",
    "defeat-screen",
    "dm-screen",
    "dm-desktop-interface",
    "mobile-dm-screen",
    "mobile-dm-interface",
    "kitchen-screen",
    "gun-skins-screen",
    "phone-ring-screen",
    "homework-keyboard-screen",
    "video-call-screen",
    "phone-on-bed-screen",
    "mom-knock-screen",
    "hallway-screen",
    "livestream-screen",
    "livestream-play-screen",
    "bowl-on-desk-screen",
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
  hideMomSweeping?.();
  hideAllMomImages?.();
  hideJakeSmiling?.();
  hideStepBackImgs?.();
  if (relationshipBar) relationshipBar.style.display = "none";
}

function showChapterScreen(chapterNumber) {
  currentChapter = Number(chapterNumber) || 0;

  if (chatLogBtn())
    chatLogBtn().style.display =
      currentChapter >= 1 && currentChapter <= 10 ? "block" : "none";
  hideAllForChapterTitle();
  document.getElementById("victory-screen").style.display = "none";
  document.getElementById("defeat-screen").style.display = "none";

  document.getElementById("homework-keyboard-screen").style.display = "none";
  document.getElementById("mom-knock-screen").style.display = "none";
  document.getElementById("dm-screen").style.display = "none";
  hideMomSweeping();

  if (chapterNumber !== 5) {
    document.getElementById("gun-skins-screen").style.display = "none";
  }

  const chapterScreen = document.getElementById(
    `chapter-${chapterNumber}-screen`
  );
  const dialogueBox = document.querySelector(".dialogue-box");

  dialogueBox.disabled = true;
  dialogueBox.style.pointerEvents = "none";

  chapterScreen.style.display = "flex";

  chapterScreen.style.opacity = "1";
  chapterScreen.style.zIndex = "10001";
  chapterScreen.classList.remove("animate__fadeOut");

  if (chapterNumber === 1) {
    document.getElementById("server-screen").style.display = "flex";
    const dialogueContainer = document.querySelector(".dialogue-container");
    if (dialogueContainer) dialogueContainer.style.display = "flex";

    setTimeout(() => {
      chapterScreen.classList.add("animate__animated", "animate__fadeOut");

      setTimeout(() => {
        chapterScreen.style.display = "none";
        chapterScreen.classList.remove("animate__fadeOut");

        dialogueBox.disabled = false;
        dialogueBox.style.pointerEvents = "auto";

        const line = dialogueLines[currentLine];
        document.querySelector(".name-tag").innerText = line.speaker.replace(
          "@y/n",
          "@" + playerName
        );
        const processedText = line.text
          .replace("@y/n", "@" + playerName)
          .replace(/Y\/N/g, capitalizeName(playerName));
        typeText(processedText, document.getElementById("dialogue"));
      }, 500);
    }, 1500); /* show for 1.5s, then hide */
  } else {
    chapterScreen.classList.add("animate__animated", "animate__fadeIn");

    if (chapterNumber === 2) {
      const dmScreen = document.getElementById("dm-screen");
      dmScreen.style.opacity = 0;
      dmScreen.style.display = "block";

      setTimeout(() => {
        dmScreen.style.transition = "opacity 1s ease-in-out";
        dmScreen.style.opacity = 1;
        setTimeout(showDMDesktopInterface, 500);
      }, 500);
    }
    if (chapterNumber === 3) {
      const kitchenScreen = document.getElementById("kitchen-screen");

      kitchenScreen.style.opacity = 0;
      kitchenScreen.style.display = "block";

      setTimeout(() => {
        kitchenScreen.style.transition = "opacity 1s ease-in-out";
        kitchenScreen.style.opacity = 1;
      }, 500);
    }
    if (chapterNumber === 4) {
      const dialogueContainer = document.querySelector(".dialogue-container");
      dialogueContainer.style.display = "none";

      const dmScreen = document.getElementById("dm-screen");
      dmScreen.style.opacity = 0;
      dmScreen.style.display = "block";

      setTimeout(() => {
        dmScreen.style.transition = "opacity 1s ease-in-out";
        dmScreen.style.opacity = 1;
        setTimeout(showDMDesktopInterfaceChapter4, 500);
      }, 500);
    }
    if (chapterNumber === 5) {
      setTimeout(() => {
        chapterScreen.classList.remove("animate__fadeIn");
        chapterScreen.classList.add("animate__fadeOut");

        setTimeout(() => {
          chapterScreen.style.display = "none";
          chapterScreen.classList.remove("animate__fadeOut");

          const gunSkinsScreen = document.getElementById("gun-skins-screen");
          gunSkinsScreen.style.opacity = 0;
          gunSkinsScreen.style.display = "block";
          requestAnimationFrame(() => {
            gunSkinsScreen.style.transition = "opacity 1s ease-in-out";
            gunSkinsScreen.style.opacity = 1;
          });

          dialogueBox.disabled = false;
          dialogueBox.style.pointerEvents = "auto";
          if (
            dialogueLines[currentLine]?.text ===
            "[You and Jake are in a call mid-game.]"
          )
            currentLine++;

          const first = dialogueLines[currentLine];
          document.querySelector(".name-tag").innerText = first.speaker.replace(
            "@y/n",
            "@" + playerName
          );
          const processed = first.text
            .replace("@y/n", "@" + playerName)
            .replace(/Y\/N/g, capitalizeName(playerName));
          typeText(processed, document.getElementById("dialogue"));
          recordChatLog(first.speaker, first.text);
        }, 500);
      }, 1500); /* show for 1.5s, then hide */
      return;
    }
    if (chapterNumber === 6) {
      const phoneRingScreen = document.getElementById("phone-ring-screen");
      phoneRingScreen.style.opacity = 0;
      phoneRingScreen.style.display = "block";

      setTimeout(() => {
        phoneRingScreen.style.transition = "opacity 1s ease-in-out";
        phoneRingScreen.style.opacity = 1;
      }, 500);
    }
    if (chapterNumber === 7) {
      hidePhoneRingScreen();

      const dmScreen = document.getElementById("homework-keyboard-screen");
      dmScreen.style.opacity = 0;
      dmScreen.style.display = "block";

      setTimeout(() => {
        showMobileDMInterfaceChapter7();
        dmScreen.style.transition = "opacity 1s ease-in-out";
        dmScreen.style.opacity = 1;
      }, 500);
    }
    if (chapterNumber === 8) {
      pendingChapterAfterWarning = 8;
      setTimeout(() => {
        chapterScreen.classList.add("animate__animated", "animate__fadeOut");
        setTimeout(() => {
          chapterScreen.style.display = "none";
          chapterScreen.classList.remove("animate__fadeOut");
          showContentWarning();
        }, 500);
      }, 1500); /* show for 1.5s, then hide */
      return;
    }

    if (chapterNumber === 9) {
      const dialogueContainer = document.querySelector(".dialogue-container");
      if (dialogueContainer) {
        dialogueContainer.style.display = "none";
        dialogueContainer.style.opacity = "0";
      }

      setTimeout(() => {
        chapterScreen.classList.remove("animate__fadeIn");
        chapterScreen.classList.add("animate__fadeOut");

        setTimeout(() => {
          chapterScreen.style.display = "none";
          chapterScreen.classList.remove("animate__fadeOut");

          const bg = document.getElementById("bowl-on-desk-screen");
          bg.style.opacity = 0;
          bg.style.display = "block";
          requestAnimationFrame(() => {
            bg.style.transition = "opacity 1s ease-in-out";
            bg.style.opacity = 1;
          });

          hideRelationshipBar();
          showMomSweeping();

          document.getElementById("dialogue").textContent = "";
          document.querySelector(".name-tag").textContent = "";

          setTimeout(() => {
            if (dialogueContainer) {
              dialogueContainer.style.display = "flex";
              dialogueContainer.style.opacity = "1";
            }

            dialogueBox.disabled = false;
            dialogueBox.style.pointerEvents = "auto";
            nextDialogue();
          }, 1000);
        }, 500);
      }, 1500); /* show for 1.5s, then hide */
      return;
    }

    if (chapterNumber === 10) {
      const dialogueContainer = document.querySelector(".dialogue-container");
      if (dialogueContainer) {
        dialogueContainer.style.display = "none";
        dialogueContainer.style.opacity = "0";
      }

      setTimeout(() => {
        chapterScreen.classList.add("animate__animated", "animate__fadeOut");
        setTimeout(() => {
          chapterScreen.style.display = "none";
          chapterScreen.classList.remove("animate__fadeOut");

          if (dialogueContainer) {
            dialogueContainer.style.display = "none";
          }
          const bowl = document.getElementById("bowl-on-desk-screen");
          if (bowl) bowl.style.display = "none";
          showPhoneOnBedScreen();

          setTimeout(() => {
            showMobileDMInterfaceChapter10();
          }, 700);
        }, 500);
      }, 1500); /* show for 1.5s, then hide */

      return;
    }
    setTimeout(() => {
      chapterScreen.classList.remove("animate__fadeIn");
      chapterScreen.classList.add("animate__fadeOut");

      setTimeout(() => {
        chapterScreen.style.display = "none";
        chapterScreen.classList.remove("animate__fadeOut");

        /* For Chapter 4, don't re-enable default dialogue box since DM interface handles everything */
        if (chapterNumber !== 4) {
          dialogueBox.disabled = false;
          dialogueBox.style.pointerEvents = "auto";
          nextDialogue();
        }
      }, 500);
    }, 1500);
  }
}

/* Effects */
function showDamageEffect() {
  let overlay = document.getElementById("damage-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "damage-overlay";
    overlay.className = "damage-overlay";

    const heartDisplay = document.createElement("div");
    heartDisplay.className = "damage-heart";
    heartDisplay.innerHTML =
      '-1 <img src="images/heart-effect.png" alt="Heart">';

    overlay.appendChild(heartDisplay);
    document.body.appendChild(overlay);
  }

  overlay.style.display = "flex";

  document.body.classList.add("shake");

  setTimeout(() => {
    document.body.classList.remove("shake");
  }, 500);

  /* Hide overlay after 1s */
  setTimeout(() => {
    overlay.style.display = "none";
  }, 1000);
}

function showHeartGainEffect() {
  const heartDisplay = document.createElement("div");
  heartDisplay.className = "heart-gain";
  heartDisplay.innerHTML = '+1 <img src="images/heart-effect.png" alt="Heart">';

  document.body.appendChild(heartDisplay);

  heartDisplay.style.display = "flex";

  setTimeout(() => {
    heartDisplay.style.display = "none";
    heartDisplay.remove();
  }, 1000);
}

function spawnFloatingHearts() {
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";

    /* Randomise position (spawn at bottom of screen) */
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `${100 + Math.random() * 10}vh`;

    /* Randomise scale & animation delay */
    const scale = 0.5 + Math.random() * 0.5; /* 0.5x to 1x size */
    heart.style.transform = `scale(${scale})`;
    heart.style.animationDelay = `${Math.random() * 0.5}s`;

    /* Randomise animation duration (2-4s) */
    heart.style.animationDuration = `${2 + Math.random() * 2}s`;

    document.body.appendChild(heart);

    /* Remove after animation completes (3s) */
    setTimeout(() => heart.remove(), 3000);
  }
}

/* chooseOption Functions */
function chooseOption(option) {
  if (option === 1) {
    recordChatLog("@y/n", "Yeah, invite me?");
  } else {
    recordChatLog("@y/n", "I'm not that good, but sure.");
  }
  isJakeChapter = true;

  const choiceBox = document.getElementById("choice-box");
  choiceBox.style.display = "none";
  document.querySelector(".dialogue-box").disabled = false;
  choiceLocked = false;

  dialogueLines.splice(
    currentLine + 1
  ); /* Clear everything after this choice */

  if (option === 1) {
    dialogueLines.push(
      { speaker: "@jake", text: "Woah, you're Diamond? We got a good one!" },
      { speaker: "Valorian", text: "[You are playing with Jake.]" },
      { speaker: "Valorian", text: "[You won!]" },
      { speaker: "@jake", text: "You're cracked bro! We gotta play again!" },
      { speaker: "@y/n", text: "Haha, maybe. That was an easy match." },
      { speaker: "@jake", text: "One more game?" },
      { speaker: "@y/n", text: "Nah, gotta study for a test tomorrow." },
      { speaker: "@jake", text: "A test? What subject?" },
      { speaker: "@y/n", text: "Math." },
      {
        speaker: "@jake",
        text: "Ew, math sucks. Good luck with your test then, play after?",
      },
      { speaker: "@y/n", text: "Sure, if I do alright." }
    );
  } else if (option === 2) {
    dialogueLines.push(
      { speaker: "@jake", text: "Don't worry, I'll carry you!" },
      { speaker: "Valorian", text: "[You are playing with Jake.]" },
      { speaker: "Valorian", text: "[You won!]" },
      { speaker: "@jake", text: "Hey, you weren't that bad at all!" },
      { speaker: "@y/n", text: "Haha, I tried. Thanks for boosting my rank." },
      { speaker: "@jake", text: "One more game?" },
      { speaker: "@y/n", text: "Nah, gotta study for a test tomorrow." },
      { speaker: "@jake", text: "A test? What subject?" },
      { speaker: "@y/n", text: "Math." },
      {
        speaker: "@jake",
        text: "Ew, math sucks. Good luck with your test then, play after?",
      },
      { speaker: "@y/n", text: "Sure, if I do alright." }
    );
  }

  /* Append Chapter 2 (Shared regardless of choice) */
  dialogueLines.push(
    { speaker: "Cutscene", text: "[3 days later. You are in a DM with Jake.]" },
    { speaker: "@jake", text: "How was your test?" },
    { speaker: "@y/n", text: "Went better than I expected lol." },
    { speaker: "@jake", text: "Hop on a game to celebrate?" },
    {
      speaker: "@y/n",
      text: "Sure lol. How are you always so free? I see you online all the time.",
    },
    { speaker: "@jake", text: "I just finish my homework really fast." },
    { speaker: "@y/n", text: "Wow, haha. Can't relate." },
    { speaker: "Valorian", text: "[You are playing with Jake.]" },
    { speaker: "Valorian", text: "[You lost.]" },
    {
      speaker: "@jake",
      text: "Come on, we can't end on a loss! Got time for another?",
    },
    { speaker: "@y/n", text: "Nah... gotta go to bed." },
    {
      speaker: "@jake",
      text: "Seriously? It's only 10. You ditched me the last time! Can't you stay up a little longer?",
    },
    { speaker: "@y/n", text: "I don't know... I'm pretty tired." },
    {
      speaker: "@jake",
      text: "But I've got nothing to do and everyone else is offline!",
    },
    { speaker: "@y/n", text: "Fine….. 5 minutes max." },
    {
      speaker: "Cutscene",
      text: "[You close the game and switch back to the server.]",
    },
    {
      speaker: "@jake",
      text: "Yes! I knew you'd give in. So... what else do you do besides game?",
    },
    {
      speaker: "@y/n",
      text: "I like to read, listen to music, watch videos... you?",
    },
    {
      speaker: "@jake",
      text: "Oh, you know, I usually just chill after school. What school are you from?",
    }
  );

  nextDialogue();
}

function chooseSchoolOption(sharedSchool) {
  recordChatLog(
    "@y/n",
    sharedSchool ? "I'm in secondary school." : "Um… why do you wanna know?"
  );
  isJakeChapter = true;

  flag2 = sharedSchool;
  const choiceBox = document.getElementById("choice-box");
  choiceBox.style.display = "none";
  document.querySelector(".dialogue-box").disabled = false;
  choiceLocked = false;

  dialogueLines.splice(currentLine + 1); /* Clear future lines */

  if (sharedSchool) {
    increaseRelationship();
    dialogueLines.push(
      { speaker: "@jake", text: "Secondary school? Same!" },
      { speaker: "@y/n", text: "Really? Which school?" },
      { speaker: "@jake", text: "I'm from Woodbury! You?" },
      { speaker: "@y/n", text: "I'm from Bayside Secondary School." },
      { speaker: "@jake", text: "Bayside Sec? That's around my area!" },
      { speaker: "@y/n", text: "Oh... really?" },
      {
        speaker: "@jake",
        text: "Yeah! Who knows, we might've crossed paths before.",
      }
    );
  } else {
    decreaseRelationship();
    dialogueLines.push(
      {
        speaker: "@jake",
        text: "Just curious. Maybe we're in the same school?",
      },
      {
        speaker: "@y/n",
        text: "I doubt so... I've never heard of a Jake in my school.",
      },
      {
        speaker: "@jake",
        text: "You never know bro. Are you in secondary school?",
      },
      { speaker: "@y/n", text: "Yeah..." },
      { speaker: "@jake", text: "Which one specifically?" },
      { speaker: "@y/n", text: "I'd rather not tell you that." },
      {
        speaker: "@jake",
        text: "It's okay then... I was just curious. I'm from Woodbury Sec, by the way.",
      }
    );
  }

  /* Chapter 3: Mom in kitchen (No flag) */
  dialogueLines.push(
    {
      speaker: "Cutscene",
      text: "[It's the next morning. You drag yourself to the kitchen where your Mom is sipping coffee.]",
    },
    {
      speaker: "Mom",
      text: "Y/N, you look tired. Did you stay up last night?",
    },
    { speaker: "Y/N", text: "Just busy..." },
    { speaker: "Mom", text: "What were you up to so late?" },
    { speaker: "Y/N", text: "Just gaming and chatting with a friend." },
    { speaker: "Mom", text: "Who? You mean the ones at school?" },
    {
      speaker: "Y/N",
      text: "No. Someone from Wispod. We play Valorian together.",
    },
    { speaker: "Mom", text: "Wispod? Like, online? How old are they?" },
    { speaker: "Y/N", text: "He told me he's 15." },
    {
      speaker: "Mom",
      text: "Same age, huh? Well, it's nice to see you making friends.",
    },
    { speaker: "Y/N", text: "Haha, yeah... I'm trying. Thanks, Mom." }
  );

  isJakeChapter = false;

  isJakeChapter = true;
  dialogueLines.push(
    /* Chapter 4: Jake lends a listening ear */
    { speaker: "Cutscene", text: "[After a game in DMs]" },
    { speaker: "@jake", text: "You good bro? You played a little off today." },
    { speaker: "@y/n", text: "Yeah, I'm fine. Just kinda tired I guess." },
    { speaker: "@jake", text: "That's all? Nothing else going on?" },
    {
      speaker: "@y/n",
      text: "I mean... there's more, but I don't wanna burden you.",
    },
    {
      speaker: "@jake",
      text: "You know you can tell me anything, right? I'm here for you.",
    }
  );

  nextDialogue();
}

function chooseConfideOption(confided) {
  recordChatLog(
    "@y/n",
    confided
      ? "…Okay, I'll tell you what's going on."
      : "I'd rather not talk about it."
  );
  flag4 = confided;

  const chapterBox = document.getElementById("choice-box");
  chapterBox.style.display = "none";

  document.querySelector(".dialogue-box").disabled = false;
  choiceLocked = false;

  dialogueLines.splice(currentLine + 1); /* Clear future lines */

  if (confided) {
    increaseRelationship();
    dialogueLines.push(
      {
        speaker: "@jake",
        text: "Stressed, huh? I guess that's what secondary school is all about. What about your friends?",
      },
      {
        speaker: "@y/n",
        text: "My friends are nice. They offer to teach me, but sometimes I feel like a burden, trying to keep up.",
      },
      { speaker: "@jake", text: "Man, that sucks. Got any older siblings?" },
      {
        speaker: "@y/n",
        text: "I'm an only child, and my parents are always busy. Don't have anyone at home to help me with my homework.",
      },
      {
        speaker: "@jake",
        text: "You can always turn to me, you know? I have time for you, and I'm pretty good at my studies.",
      },
      {
        speaker: "@y/n",
        text: "Really? I don't think it'll be as effective as learning in person, though.",
      },
      {
        speaker: "@jake",
        text: "Who knows? Maybe we could meet up to study together.",
      },
      { speaker: "@y/n", text: "Hm… maybe…" },
      {
        speaker: "@jake",
        text: "Anyway, I'm always here to listen. You deserve someone who understands you.",
      }
    );
  } else {
    decreaseRelationship();
    dialogueLines.push(
      { speaker: "@jake", text: "Something's clearly bothering you though." },
      {
        speaker: "@y/n",
        text: "I know, but... I'm used to handling problems by myself.",
      },
      {
        speaker: "@jake",
        text: "Are you sure? It's okay to be vulnerable with me, Y/N.",
      },
      {
        speaker: "@y/n",
        text: "Yeah... I'm sure. Just another bad day, I'll be fine.",
      },
      {
        speaker: "@jake",
        text: "Alright, if you say so. Just remember what I said, don't keep your feelings bottled up.",
      }
    );
  }

  /* Chapter 5: Shared intro */
  dialogueLines.push(
    { speaker: "Cutscene", text: "[You and Jake are in a call mid-game.]" },
    {
      speaker: "@jake",
      text: "Yo, did you see the new Valorian bundle that just dropped? The Kitsune one?",
    },
    {
      speaker: "@y/n",
      text: "Yeah, it looks fire. I was thinking of getting it, but..",
    },
    { speaker: "@jake", text: "Go for it, what's stopping you?" },
    { speaker: "@y/n", text: "They made it way too expensive this time..." },
    { speaker: "@jake", text: "I'll buy it for you." },
    { speaker: "@y/n", text: "What? It's like $120!" },
    { speaker: "@jake", text: "So? I can afford it, it's on me." },
    { speaker: "@y/n", text: "How do you have that much money to spare?" },
    {
      speaker: "@jake",
      text: "I work part-time a lot, haha. So, want it or nah?",
    }
  );
  showChapterScreen(5);
}

function chooseGiftOption(accepted) {
  recordChatLog(
    "@y/n",
    accepted
      ? "I mean… sure, it's just a lot to accept, you know?"
      : "I'm fine with my battlepass skins, really…"
  );
  flag5 = accepted;

  const choiceBox = document.getElementById("choice-box");
  choiceBox.style.display = "none";
  document.querySelector(".dialogue-box").disabled = false;
  choiceLocked = false;

  dialogueLines.splice(currentLine + 1); /* Clear upcoming lines */

  if (accepted) {
    /* Accepted gift */
    increaseRelationship();
    dialogueLines.push(
      {
        speaker: "@jake",
        text: "Haha, it's just a little gift. Check your account!",
      },
      {
        speaker: "@y/n",
        text: "Thanks Jake, this is insane… I feel like I owe you.",
      },
      {
        speaker: "@jake",
        text: "Don't even think about it. You're my other half, it's the least I could do!",
      }
    );
    nextDialogue();
  } else {
    /* Declined gift */
    decreaseRelationship();
    dialogueLines.push(
      {
        speaker: "@jake",
        text: "C'mon, you can't pass up on this bundle! I wanna cheer you up.",
      },
      {
        speaker: "@y/n",
        text: "I really appreciate it, but… seriously, it's okay.",
      },
      {
        speaker: "@jake",
        text: "Fine, if you're so sure. Just know the offer's always open.",
      }
    );
    nextDialogue();
  }

  /* Chapter 6: Mom's concern about Jake (No flag) */
  dialogueLines.push(
    {
      speaker: "Cutscene",
      text: "[You are doing homework when your phone rings.]",
    },
    {
      speaker: "Mom",
      text: "Your friend's calling again.",
      action: () => showMomImage("mom-standing"),
    },
    {
      speaker: "Y/N",
      text: "Yeah, he probably wants to play..",
      action: () => showMomImage("mom-standing"),
    },
    {
      speaker: "Mom",
      text: "How close are you two?",
      action: () => showMomImage("mom-standing"),
    },
    {
      speaker: "Y/N",
      text: "Pretty close I guess. We talk about everything.",
      action: () => showMomImage("mom-standing"),
    },
    {
      speaker: "Mom",
      text: "You know, when I was your age, we made friends organically.",
      action: hideAllMomImages,
      action: () => showMomImage("mom-talking-1"),
    },
    {
      speaker: "Y/N",
      text: "Mom, it's different now. Everyone has online friends. Especially from video games.",
      action: () => showMomImage("mom-talking-1"),
    },
    {
      speaker: "Mom",
      text: "I'm not asking you to cut him off. Just be careful what you share, okay?",
      action: hideAllMomImages,
      action: () => showMomImage("mom-talking-2"),
    },
    { speaker: "Y/N", text: "Yeah, got it, Mom...", action: hideAllMomImages }
  );

  /* Chapter 7: Jake asks to video call */
  dialogueLines.push(
    { speaker: "Cutscene", text: "[You are doing homework in the afternoon.]" },
    { speaker: "@jake", text: "Did your PC crash? What's taking you so long?" },
    {
      speaker: "@y/n",
      text: "No, sorry. Still stuck on my chemistry homework.",
    },
    { speaker: "@jake", text: "Chemistry? You learn that in school?" },
    { speaker: "@y/n", text: "Uh... yeah? It's compulsory for all students." },
    { speaker: "@jake", text: "Oh, right... haha." },
    { speaker: "@y/n", text: "Do you think you could help me?" },
    {
      speaker: "@jake",
      text: "Yeah, I could try. Wanna video call? It'd be way easier to explain stuff.",
    }
  );
}

function chooseVideoCallOption(accepted) {
  recordChatLog(
    "@y/n",
    accepted ? "I guess I could do a quick one." : "Nah, too troublesome."
  );
  flag7 = accepted;

  const choiceBox = document.getElementById("choice-box");
  choiceBox.style.display = "none";
  document.querySelector(".dialogue-box").disabled = false;
  choiceLocked = false;

  dialogueLines.splice(currentLine + 1); /* Clear future lines */

  if (accepted) {
    /* Accept video call */
    increaseRelationship();
    dialogueLines.push(
      { speaker: "@jake", text: "Yup. It'll be quick, I promise." },
      { speaker: "@y/n", text: "Alright then... just for the homework." },
      { speaker: "@jake", text: "Great! I'll call you." },
      {
        speaker: "Cutscene",
        text: "(You pick up, your camera pointing at your homework on the table.)",
      },
      {
        speaker: "@jake",
        text: "Huh... you have pretty hands. Nice fingers too.",
      },
      {
        speaker: "@y/n",
        text: "Uh... yeah, I used to play the piano. You're not gonna switch on your camera?",
      },
      {
        speaker: "@jake",
        text: "Nah, my room's dark anyway. So, the equation here…",
      }
    );
  } else {
    /* Decline video call */
    decreaseRelationship();
    dialogueLines.push(
      { speaker: "@jake", text: "It'll be quick, I promise." },
      {
        speaker: "@y/n",
        text: "I'm not really comfortable with video calls...",
      },
      {
        speaker: "@jake",
        text: "C'mon, it's just me, Y/N. There's nothing to worry about.",
      },
      { speaker: "@y/n", text: "Uh... I think text is fine for now." },
      {
        speaker: "@jake",
        text: "I'm kinda lazy to type it out though. It's gonna be a lot to take in.",
      },
      { speaker: "@y/n", text: "But you said you'd help me..." },
      {
        speaker: "@jake",
        text: "Fine, fine. Send me a pic of the questions then.",
      }
    );
  }
  /* Chapter 8: Jake requests explicit photo */

  nextDialogue();
}

function chooseImageOption(sentImage) {
  recordChatLog(
    "@y/n",
    sentImage
      ? "Give me a sec… Don't get your hopes up."
      : "I'm not comfortable with that…"
  );
  flag8 = sentImage;

  const choiceBox = document.getElementById("choice-box");
  choiceBox.style.display = "none";
  document.querySelector(".dialogue-box").disabled = false;
  choiceLocked = false;

  dialogueLines.splice(currentLine + 1); /* Clear future lines */

  if (sentImage) {
    /* Sent image */
    increaseRelationship();
    dialogueLines.push(
      {
        speaker: "@jake",
        text: "I'm sure you look great… take your time, I'm waiting.",
      },
      { speaker: "@y/n", text: "Just... don't send this to anyone, alright?" },
      { speaker: "@jake", text: "Of course, we're friends. You can trust me." },
      {
        speaker: "Cutscene",
        text: "(You take off your shirt and send a selfie, your upper body exposed.)",
      },
      { speaker: "@jake", text: "Knew you were cute." },
      { speaker: "@y/n", text: "Haha... you're one to talk." },
      {
        speaker: "@jake",
        text: "Lower your camera for me cutie. Wanna see the other half.",
      },
      { speaker: "Mom", text: "Y/N? Can I come in?" },
      { speaker: "@y/n", text: "Can't RN. GTG." },
      {
        speaker: "@jake",
        text: "Alright, thanks. I'm keeping this all to myself.",
      }
    );
  } else {
    /* Did not send image */
    decreaseRelationship();
    dialogueLines.push(
      {
        speaker: "@jake",
        text: "C'mon, you've seen me, now I wanna see you. Don't be shy.",
      },
      { speaker: "@y/n", text: "I don't look that good, Jake..." },
      {
        speaker: "@jake",
        text: "Seriously? I bet you look great. Don't be so hard on yourself.",
      },
      {
        speaker: "@y/n",
        text: "I don't take pictures like that. It's just... not my thing.",
      },
      { speaker: "@jake", text: "Ugh, please? We could make it our thing." },
      { speaker: "Mom", text: "Y/N? Can I come in?" },
      { speaker: "@y/n", text: "No thanks... GTG." },
      {
        speaker: "@jake",
        text: "Fine. I'll be waiting for the day I get some in return.",
      }
    );
  }

  console.log(flag8);
  loadChapter9IfNeeded();

  /* Chapter 10 (Always on) */
  dialogueLines.push(
    {
      speaker: "Cutscene",
      text: "[You are lying in bed at 2AM. You can't sleep.]",
    },
    { speaker: "@y/n", text: "Jake?" },
    { speaker: "@jake", text: "Yo, you awake at this hour? What's up?" }
  );

  if (flag8) {
    hideRelationshipBar();
    dialogueLines.push(
      {
        speaker: "@y/n",
        text: "About what you said earlier today... did you mean it?",
      },
      {
        speaker: "@jake",
        text: "Of course I did. Bet you look even better in person.",
      },
      { speaker: "@y/n", text: "Haha, thanks…" },
      {
        speaker: "@jake",
        text: "Wanna meet up sometime? I'll treat you to lunch.",
      }
    );
  } else {
    hideRelationshipBar();
    dialogueLines.push(
      { speaker: "@y/n", text: "Earlier today... you seemed upset." },
      {
        speaker: "@jake",
        text: "When I asked for the pic? Yeah, I just felt a little rejected.",
      },
      { speaker: "@y/n", text: "I didn't mean to upset you... I'm sorry." },
      {
        speaker: "@jake",
        text: "Really? Prove it then. Let's meet up for lunch, I'll pay.",
      }
    );
  }

  nextDialogue();
}

function loadChapter9IfNeeded() {
  if (flag8) {
    hideRelationshipBar();
    dialogueLines.push(
      {
        speaker: "Cutscene",
        text: "[As you eat lunch in your room, your Mom comes in to sweep the floor.]",
      },
      {
        speaker: "Mom",
        text: "Eating in your room again? It's becoming a habit.",
      },
      { speaker: "Y/N", text: "It's more comfortable here." },
      {
        speaker: "Mom",
        text: "You've been awfully quiet these days, shutting yourself in. What's going on?",
      },
      {
        speaker: "Y/N",
        text: "I've just been busy with homework, games, the usual..",
      },
      { speaker: "Mom", text: "Is everything okay?" },
      { speaker: "Y/N", text: "Yeah... just tired. Got a lot on my mind." },
      {
        speaker: "Mom",
        text: "You know, I'm always here for you. Anything you wanna talk about?",
      }
    );
    nextDialogue();
  }
}

function chooseMomRevealOption(reveal) {
  recordChatLog(
    "@y/n",
    reveal
      ? "Yeah. I think I actually do want to talk…"
      : "Nah... all's good for now."
  );
  const choiceBox = document.getElementById("choice-box");
  choiceBox.style.display = "none";
  document.querySelector(".dialogue-box").disabled = false;
  choiceLocked = false;

  dialogueLines.splice(currentLine + 1);

  if (reveal) {
    /* Confide */
    hideRelationshipBar();
    dialogueLines.push(
      { speaker: "Mom", text: "Alright, go on. I'm here to listen." },
      {
        speaker: "Y/N",
        text: "Um... you know about the guy I told you about?",
      },
      { speaker: "Mom", text: "You mean Jake? Yeah, what's wrong?" },
      {
        speaker: "Y/N",
        text: "Everything, Mom. He's been acting so strange lately.",
      },
      { speaker: "Mom", text: "Strange? For example?" },
      {
        speaker: "Y/N",
        text: "He asked about my school, sent me a gift, and even wanted to video call me.",
      },
      { speaker: "Mom", text: "What? And how long have you known each other?" },
      {
        speaker: "Y/N",
        text: "About a week or so. If I'm being honest… I feel like he's getting close too quickly.",
      },
      {
        speaker: "Mom",
        text: "Alright, Y/N. It sounds like he doesn't have good intentions. Let's sit down and talk about this, okay?",
      }
    );
    nextDialogue();
    return;

    /* Parent Intervention Ending */
  } else {
    /* Don't confide */
    hideRelationshipBar();
    dialogueLines.push(
      {
        speaker: "Mom",
        text: "…Alright, if you say so. I'm always here to listen.",
      },
      { speaker: "Y/N", text: "Yeah, I know. Thanks, Mom." },

      /* Chapter 10 */
      {
        speaker: "Cutscene",
        text: "[You are lying in bed at 2AM. You can't sleep.]",
      },
      { speaker: "@y/n", text: "Jake?" },
      { speaker: "@jake", text: "Yo, you awake at this hour? What's up?" }
    );

    if (flag8) {
      hideRelationshipBar();
      dialogueLines.push(
        {
          speaker: "@y/n",
          text: "About what you said earlier today... did you mean it?",
        },
        {
          speaker: "@jake",
          text: "Of course I did. Bet you look even better in person.",
        },
        { speaker: "@y/n", text: "Haha, thanks…" },
        {
          speaker: "@jake",
          text: "Wanna meet up sometime? I'll treat you to lunch.",
        }
      );
    } else {
      hideRelationshipBar();
      dialogueLines.push(
        { speaker: "@y/n", text: "Earlier today... you seemed upset." },
        {
          speaker: "@jake",
          text: "When I asked for the pic? Yeah, I just felt a little rejected.",
        },
        { speaker: "@y/n", text: "I didn't mean to upset you... I'm sorry." },
        {
          speaker: "@jake",
          text: "Really? Prove it then. Let's meet up for lunch, I'll pay.",
        }
      );
    }
  }

  nextDialogue();
}

function chooseMeetOption(agreed) {
  flag10 = agreed;

  const choiceBox = document.getElementById("choice-box");
  choiceBox.style.display = "none";
  document.querySelector(".dialogue-box").disabled = false;
  choiceLocked = false;

  dialogueLines.splice(currentLine + 1); /* Clear future lines */

  if (agreed) {
    hideRelationshipBar();
    dialogueLines.push(
      {
        speaker: "Cutscene",
        text: "(It is Saturday. You approach the front door hastily.)",
      },
      { speaker: "Mom", text: "Y/N, where are you going?" },
      { speaker: "@y/n", text: "Uh... Bukit Panjang." },
      {
        speaker: "Mom",
        text: "Bukit Panjang?! Why are you going there all of a sudden?",
      },
      {
        speaker: "@y/n",
        text: "To meet a friend... I'll be back before dinner.",
      },
      { speaker: "Mom", text: "Y/N, wait!" },
      {
        speaker: "Cutscene",
        text: "(You slam the door shut behind you. You travel to meet Jake.)",
      },
      {
        speaker: "Cutscene",
        text: "[You alight the train. You scan the crowd and spot a man in the distance. He looks around 30.]",
      },
      { speaker: "@jake", text: "Y/N?" },
      { speaker: "@y/n", text: "Wait, you're not..." },
      { speaker: "@jake", text: "You really look better in person." },
      { speaker: "@y/n", text: "..!" },
      { speaker: "@y/n", text: "This was a terrible mistake…" }
    );
    evaluateEnding();
  } else {
    hideRelationshipBar();
    dialogueLines.push(
      {
        speaker: "@jake",
        text: "What are you, a baby? She doesn't have to know about this.",
      },
      {
        speaker: "@y/n",
        text: "Gotta let her know first. It's pretty far from my place.",
      },
      { speaker: "@jake", text: "C'mon... it's just a friendly hangout!" },
      { speaker: "@y/n", text: "Sorry... I'm not interested." },
      {
        speaker: "@jake",
        text: "Ugh, you're so boring! No wonder you have no friends, loser.",
      },
      { speaker: "@y/n", text: "What? I thought we were friends." },
      { speaker: "@jake", text: "Well, not anymore." }
    );
    evaluateEnding();
  }

  nextDialogue();
}

function evaluateEnding() {
  console.log("8:", flag8);
  console.log("10:", flag10);

  const otherFlags = [flag2, flag4, flag5, flag7];
  const otherTrueCount = otherFlags.filter(Boolean).length;

  /* Blackmail is now handled inside showMobileChapter10Choices() after the NO path. */
  /* Only handle the two desktop-dialogue endings here. */

  if (flag8 === false && otherTrueCount >= 2) {
    /* Risky Escape Ending */
    hideRelationshipBar();
    dialogueLines.push(
      { speaker: "@y/n", text: "Seriously? You're so petty." },
      { speaker: "@jake", text: "You're lucky I don't know where you live." },
      { speaker: "@y/n", text: "What?! I'm blocking you." }
    );
    nextDialogue();
    return;
  }

  if (flag8 === false && otherTrueCount <= 1) {
    /* Safe Ending */
    hideRelationshipBar();
    dialogueLines.push(
      { speaker: "Cutscene", text: "(Jake goes offline on Y/N's screen.)" },
      { speaker: "@y/n", text: "Wait, where did he go?" },
      { speaker: "@y/n", text: "...Did our friendship just end like that?" },
      { speaker: "@y/n", text: "I can't believe it..." },
      { speaker: "@y/n", text: "Maybe it was for the better." }
    );
    nextDialogue();
    return;
  }

  nextDialogue();
}

const dialogueLines = [
  /* Prologue */
  {
    speaker: "@ggnore",
    text: "98, 99… 200K subs! You guys are insane! As promised, I've finally opened a Wispod server for us! Feel free to interact with each other, maybe get to play with me live someday!",
  },
  { speaker: "Chat", text: "LFGGG!\nTHE GOATTT\nWELL DESERVED KING!!!" },
  { speaker: "You", text: "No way! Imagine being in one of his streams?" },

  /* Chapter 1 */
  { speaker: "@jake", text: "Hey, who just joined?" },
  { speaker: "@y/n", text: "Hi..." },
  { speaker: "@jake", text: "Hey, I'm Jake! You're... Y/N?" },
  { speaker: "@y/n", text: "Yeah, same as my username." },
  {
    speaker: "@jake",
    text: "Nice to meet you, Y/N! You watch @ggnore too, huh?",
  },
  { speaker: "@y/n", text: "Just joined the server, haha." },
  {
    speaker: "@jake",
    text: "You play Valorian? We need one more for a 5-stack!",
  },
];

let currentLine = 0;
let isTyping = false;
let typingInterval;

function typeText(text, element, speed = 20) {
  /* Stop any existing sound */
  textBlip.pause();
  textBlip.currentTime = 0;

  let i = 0;
  isTyping = true;
  element.innerHTML = "";

  updateNameTagStyling();

  /* Suppress blip if chapter 1 screen is still showing */
  const chapter1Screen = document.getElementById("chapter-1-screen");
  const chapter1Visible =
    chapter1Screen && chapter1Screen.style.display !== "none";

  /* Only play sound if there is text to type & Chapter 1 screen is off */
  if (text.trim().length > 0 && !chapter1Visible) {
    textBlip.currentTime = 0;
    textBlip.play();
  }

  typingInterval = setInterval(() => {
    const nextChar = text.charAt(i);
    element.innerHTML += nextChar === " " ? "&nbsp;" : nextChar;
    i++;
    if (i >= text.length) {
      clearInterval(typingInterval);
      isTyping = false;
      textBlip.pause();
      textBlip.currentTime = 0;
    }
  }, speed);
}

const textBlip = new Audio("audio/text-blip.mp3");
textBlip.volume = 0.8;

/* nextDialogue Functions */
function nextDialogue() {
  textBlip.pause();
  textBlip.currentTime = 0;

  if (isFinalLineBeforeEnd) {
    return;
  }

  if (isTyping) {
    clearInterval(typingInterval);
    const line = dialogueLines[currentLine];
    const displayName = capitalizeName(playerName);
    const userTag = "@" + playerName.toLowerCase();

    const fullText = line.text
      .replace(/@y\/n/gi, userTag)
      .replace(/Y\/N/g, displayName)
      .replace(/ /g, "&nbsp;");

    document.getElementById("dialogue").innerHTML = fullText;
    isTyping = false;

    return;
  }

  const current = dialogueLines[currentLine];
  if (
    current &&
    /no way!\s*imagine being in one of his streams\??/i.test(current.text)
  ) {
    showInviteModal();
    return; /* pause story here */
  }

  const upcoming = dialogueLines[currentLine + 1];
  if (upcoming && upcoming.text === "[You and Jake are in a call mid-game.]") {
    /* Move to the cutscene line and show the Chapter 5 title card first */
    currentLine++;
    console.log("Chapter 5 called (priority)");
    showChapterScreen(5);
    return;
  }

  currentLine++; /* IMAGE CONTROL MUST GO BELOW */

  if (
    dialogueLines[currentLine]?.text ===
    "[3 days later. You are in a DM with Jake.]"
  ) {
    /* Chapter 2 */
    showChapterScreen(2);
    return;
  }
  if (
    dialogueLines[currentLine]?.text ===
    "[It's the next morning. You drag yourself to the kitchen where your Mom is sipping coffee.]"
  ) {
    /* Chapter 3 */
    showChapterScreen(3);
    return;
  }
  if (dialogueLines[currentLine]?.text === "[After a game in DMs]") {
    /* Chapter 4 */
    document.querySelector(".dialogue-container").style.display = "none";
    showChapterScreen(4);
    return;
  }
  if (
    dialogueLines[currentLine]?.text ===
    "[You and Jake are in a call mid-game.]"
  ) {
    /* Chapter 5 */
    console.log("chapter 5 called");
    showChapterScreen(5);
    return;
  }
  if (
    dialogueLines[currentLine]?.text ===
    "[You are doing homework when your phone rings.]"
  ) {
    /* Chapter 6 */
    showChapterScreen(6);
    return;
  }
  if (
    dialogueLines[currentLine]?.text ===
    "[You are doing homework in the afternoon.]"
  ) {
    /* Chapter 7 */
    showChapterScreen(7);
    return;
  }
  if (
    dialogueLines[currentLine]?.text ===
    "[As you eat lunch in your room, your Mom comes in to sweep the floor.]"
  ) {
    /* Chapter 9 */
    showChapterScreen(9);
    return;
  }
  if (
    dialogueLines[currentLine]?.text ===
    "[You are lying in bed at 2AM. You can't sleep.]"
  ) {
    /* Chapter 10 */
    showChapterScreen(10);
    return;
  }

  if (currentLine > 0) {
    const previousLine = dialogueLines[currentLine - 1];
    if (previousLine && previousLine.text === "Sure, if I do alright.") {
      hideVictoryScreen();
    }
    if (previousLine && previousLine.text === "Wow, haha. Can't relate.") {
      hideDMScreen();
    }
    if (
      previousLine &&
      (previousLine.text ===
        "Anyway, I'm always here to listen. You deserve someone who understands you." ||
        previousLine.text ===
          "Alright, if you say so. Just remember what I said, don't keep your feelings bottled up.")
    ) {
      hideDMScreen();
    }
    if (previousLine && previousLine.text === "Fine….. 5 minutes max.") {
      hideDefeatScreen();
    }
    if (
      previousLine &&
      previousLine.text === "Haha, yeah... I'm trying. Thanks, Mom."
    ) {
      const kitchenScreen = document.getElementById("kitchen-screen");

      kitchenScreen.style.transition = "opacity 1s ease-in-out";
      kitchenScreen.style.opacity = 0;

      /* Hide after fade completes */
      setTimeout(() => {
        kitchenScreen.style.display = "none";
      }, 1000);
    }
    if (
      previousLine &&
      (previousLine.text ===
        "Fine, if you're so sure. Just know the offer's always open." ||
        previousLine.text ===
          "Don't even think about it. You're my other half, it's the least I could do!")
    ) {
      hideGunSkinsScreen();
    }
    if (previousLine && previousLine.text === "Yeah, got it, Mom...") {
      hidePhoneRingScreen();
    }
    if (
      previousLine &&
      previousLine.text === "No, sorry. Still stuck on my chemistry homework."
    ) {
      hideHomeworkKeyboardScreen();
    }
    if (
      previousLine &&
      (previousLine.text === "No thanks... GTG." ||
        previousLine.text === "Can't RN. GTG.")
    ) {
      hideMomKnockScreen();
    }
    if (previousLine && previousLine.text === "Y/N, wait!") {
      const hallwayScreen = document.getElementById("hallway-screen");

      hallwayScreen.style.transition = "opacity 1s ease-in-out";
      hallwayScreen.style.opacity = 0;

      /* Hide after fade completes */
      setTimeout(() => {
        hallwayScreen.style.display = "none";
      }, 1000);
    }
  }

  /* Fade out to Title Screen */
  if (currentLine === 3) {
    document.getElementById("livestream-screen").style.display = "none";
    document.querySelector(".chapter-1").style.display = "none";
    fadeToTitleScreen();
    return;
  }

  if (currentLine < dialogueLines.length) {
    const line = dialogueLines[currentLine];

    if (line) {
      switch (line.text) {
        case "Your friend's calling again.":
          showMomImage("mom-standing");
          break;
        case "Yeah, he probably wants to play..":
          showMomImage("mom-standing");
          break;
        case "How close are you two?":
          showMomImage("mom-standing");
          break;
        case "Pretty close I guess. We talk about everything.":
          showMomImage("mom-standing");
          break;
        case "You know, when I was your age, we made friends organically.":
          showMomImage("mom-talking-1");
          break;
        case "Mom, it's different now. Everyone has online friends. Especially from video games.":
          showMomImage("mom-standing");
          break;
        case "I'm not asking you to cut him off. Just be careful what you share, okay?":
          showMomImage("mom-talking-2");
          break;
        case "Yeah, got it, Mom...":
          hideAllMomImages();
          break;
        default:
          hideAllMomImages();
      }
    } else {
      hideAllMomImages();
    }

    if (line) {
      switch (line.text) {
        case "[You alight the train. You scan the crowd and spot a man in the distance. He looks around 30.]":
          hideStepBackImgs();
          showJakeSmiling();
          break;
        case "Y/N?":
        case "You really look better in person.":
          hideStepBackImgs();
          showJakeSmiling();
          break;

        case "..!":
          hideJakeSmiling();
          showStepBack("step-back-1");
          break;
        case "This was a terrible mistake…":
          hideJakeSmiling();
          showStepBack("step-back-2");
          break;

        case "...":
          hideJakeSmiling();
          hideStepBackImgs();
          break;

        default:
          hideJakeSmiling();
          hideStepBackImgs();
      }
    } else {
      hideJakeSmiling();
      hideStepBackImgs();
    }

    if (
      line.speaker === "Valorian" &&
      line.text === "[You are playing with Jake.]"
    ) {
      document.querySelector(".name-tag").innerText = "Valorian";
      typeText(
        "[You are playing with Jake.]",
        document.getElementById("dialogue")
      );
      recordChatLog("Valorian", "[You are playing with Jake.]");
      crossfade("server-screen", "valorian-with-jake-screen", 700);
      return;
    }

    if (line.speaker === "Valorian" && line.text === "[You won!]") {
      document.querySelector(".name-tag").innerText = "Valorian";
      typeText("[You won!]", document.getElementById("dialogue"));
      recordChatLog("Valorian", "[You won!]");
      crossfade("valorian-with-jake-screen", "victory-screen", 700);
      showVictoryScreen();
      return;
    }

    if (line.speaker === "Valorian" && line.text === "[You lost.]") {
      document.querySelector(".name-tag").innerText = "Valorian";
      typeText("[You lost.]", document.getElementById("dialogue"));
      recordChatLog("Valorian", "[You lost.]");
      crossfade("valorian-with-jake-screen", "defeat-screen", 700);
      showDefeatScreen();
      return;
    }

    if (
      line.speaker === "Cutscene" &&
      line.text === "[You close the game and switch back to the server.]"
    ) {
      document.querySelector(".name-tag").innerText = "Cutscene";
      typeText(
        "[You close the game and switch back to the server.]",
        document.getElementById("dialogue")
      );

      /* Hide any gameplay overlays */
      hideDefeatScreen();
      hideVictoryScreen?.();
      hideValorianWithJakeScreen?.();

      /* Fade in DM background again */
      const dm = document.getElementById("dm-screen");
      if (dm) {
        dm.classList.remove("animate__fadeOut", "dm-background-blur");
        dm.style.display = "block";
        dm.style.opacity = 0;
        requestAnimationFrame(() => {
          dm.style.transition = "opacity 600ms ease";
          dm.style.opacity = 1;
        });
      }

      return;
    }

    if (
      line.speaker === "Cutscene" &&
      line.text ===
        "[It's the next morning. You drag yourself to the kitchen where your Mom is sipping coffee.]"
    ) {
      document.querySelector(".name-tag").innerText = "Cutscene";
      typeText(
        "[It's the next morning. You drag yourself to the kitchen where your Mom is sipping coffee.]",
        document.getElementById("dialogue")
      );
      showKitchenScreen();
      hideRelationshipBar();
      return;
    }

    if (
      line.speaker === "@jake" &&
      line.text ===
        "Yo, did you see the new Valorian bundle that just dropped? The Kitsune one?"
    ) {
      document.querySelector(".name-tag").innerText = "@jake";
      typeText(
        "Yo, did you see the new Valorian bundle that just dropped? The Kitsune one?",
        document.getElementById("dialogue")
      );
      showGunSkinsScreen();
      return;
    }
    if (
      line.speaker === "Cutscene" &&
      line.text === "[You were studying at home in the afternoon.]"
    ) {
      /* Hide video call screen before showing Chapter 8 */
      const videoCallScreen = document.getElementById("video-call-screen");
      if (videoCallScreen && videoCallScreen.style.display !== "none") {
        videoCallScreen.style.transition = "opacity 0.5s ease-in-out";
        videoCallScreen.style.opacity = 0;

        setTimeout(() => {
          videoCallScreen.style.display = "none";
        }, 500);
      }

      showChapterScreen(8);
      return;
    }
    if (line.speaker === "Mom" && line.text === "Y/N? Can I come in?") {
      document.querySelector(".name-tag").innerText = "Mom";
      const displayName = capitalizeName(playerName);
      const processedText = "Y/N? Can I come in?".replace(/Y\/N/g, displayName);
      typeText(processedText, document.getElementById("dialogue"));
      showMomKnockScreen();
      hideRelationshipBar();

      momKnockSFX.currentTime = 0;
      momKnockSFX.play();

      return;
    }
    if (
      dialogueLines[currentLine]?.text ===
      "(It is Saturday. You approach the front door hastily.)"
    ) {
      const hallwayScreen = document.getElementById("hallway-screen");
      hallwayScreen.style.opacity = 0;
      hallwayScreen.style.display = "block";

      setTimeout(() => {
        hallwayScreen.style.transition = "opacity 1s ease-in-out";
        hallwayScreen.style.opacity = 1;
      }, 100);
    }
    if (
      dialogueLines[currentLine]?.text ===
      "[You alight the train. You scan the crowd and spot a man in the distance. He looks around 30.]"
    ) {
      const trainStationScreen = document.getElementById(
        "train-station-screen"
      );
      trainStationScreen.style.opacity = 0;
      trainStationScreen.style.display = "block";

      setTimeout(() => {
        trainStationScreen.style.transition = "opacity 1s ease-in-out";
        trainStationScreen.style.opacity = 1;
      }, 100);
    }

    const speakerName = line.speaker.toLowerCase();
    /* Only show for Jake-related dialogue */
    if (currentLine < dialogueLines.length) {
      const line = dialogueLines[currentLine];
      const speakerName = line.speaker.toLowerCase();

      /* Hide for Mom & Cutscene conversations */
      if (speakerName.includes("Mom") || speakerName.includes("Cutscene")) {
        hideRelationshipBar();
      } else if (
      /* Show for Jake conversations (speaking or being spoken to) */
        speakerName.includes("@jake") ||
        line.speaker.includes("Jake") ||
        (isJakeChapter && speakerName.includes("@y/n"))
      ) {
        relationshipBar.style.display = "flex";
        if (relationshipBar.innerHTML.trim() === "") {
          initRelationshipBar();
        }
      } else {
      /* Default hide */
        relationshipBar.style.display = "none";
      }
    }

    document.querySelector(".name-tag").innerText = line.speaker
      .replace("@y/n", "@" + playerName.toLowerCase())
      .replace("Y/N", capitalizeName(playerName));

    updateNameTagStyling();

    const processedText = line.text
      .replace("@y/n", "@" + playerName)
      .replace(/Y\/N/g, capitalizeName(playerName));
    typeText(processedText, document.getElementById("dialogue"));
    recordChatLog(line.speaker, line.text);

    const nameTagBox = document.querySelector(".name-tag");
    const displayedName = nameTagBox.innerText.trim().toLowerCase();
    const playerTag = "@" + playerName.toLowerCase();
    const playerNameOnly = playerName.toLowerCase();

    /* Name tag box BG colours based on speaker */
    if (displayedName === "@jake" || displayedName === "jake") {
      nameTagBox.style.backgroundColor = "#099396";
      nameTagBox.style.color = "white";
    } else if (
      displayedName === playerTag ||
      displayedName === playerNameOnly ||
      displayedName === "you"
    ) {
      nameTagBox.style.backgroundColor = "#ee9b00";
      nameTagBox.style.color = "white";
    } else if (displayedName === "mom") {
      nameTagBox.style.backgroundColor = "#e889af";
      nameTagBox.style.color = "white";
    } else if (displayedName === "@ggnore") {
      nameTagBox.style.backgroundColor = "#5e60ce";
      nameTagBox.style.color = "white";
    } else if (
      displayedName === "valorian" ||
      displayedName === "cutscene" ||
      displayedName === "chat"
    ) {
      nameTagBox.style.backgroundColor = "white";
      nameTagBox.style.color = "black";
    } else {
      /* Default name tag box BG colour */
      nameTagBox.style.backgroundColor = "white";
      nameTagBox.style.color = "black";
    }

    /* Detect ending triggers */
    const isLastLineOfBlackmailEnding = line.text === "Too late now, isn't it?";
    const isLastLineOfRiskyEscape = line.text === "What?! I'm blocking you.";
    const isLastLineOfSafeEnding = line.text === "Maybe it was for the better.";
    const isLastLineOfMeetupEnding =
      line.text === "This was a terrible mistake…";
    const isLastLineOfParentIntervention =
      line.text ===
      "Alright, Y/N. It sounds like he doesn't have good intentions. Let's sit down and talk about this, okay?";

    /* Set flag if this is the final line before end screen */
    isFinalLineBeforeEnd =
      isLastLineOfBlackmailEnding ||
      isLastLineOfRiskyEscape ||
      isLastLineOfSafeEnding ||
      isLastLineOfMeetupEnding ||
      isLastLineOfParentIntervention;

    /* Set different delays for each ending type */
    let endingDelay = 3000;
    if (
      isLastLineOfBlackmailEnding ||
      isLastLineOfRiskyEscape ||
      isLastLineOfSafeEnding
    ) {
      endingDelay = 2000;
    } else if (isLastLineOfMeetupEnding) {
      endingDelay = 1000;
    } else if (isLastLineOfParentIntervention) {
      endingDelay = 3000;
    }

    /* Trigger end screen after last line */
    if (isFinalLineBeforeEnd) {
      /* Disable dialogue box */
      const current = dialogueLines[currentLine];
      if (
        current &&
        /no way!\s*imagine being in one of his streams/i.test(current.text)
      ) {
        showInviteModal();
        return;
      }
      hideMomSweeping();
      document.querySelector(".dialogue-box").disabled = true;
      document.querySelector(".dialogue-box").style.pointerEvents = "none";

      setTimeout(fadeOutAndShowEndScreen, endingDelay);
      return;
    }

    if (line.text.includes("We need one more for a 5-stack")) {
      document.getElementById("choice-box").style.display = "flex";
      document.getElementById("choice-box").innerHTML = `
            <button class="choice-button" onclick="chooseOption(1)">Yeah, invite me?</button>
            <button class="choice-button" onclick="chooseOption(2)">I'm not that good, but sure.</button>
        `;
      document.querySelector(".dialogue-box").disabled = true;
      choiceLocked = true;
      return;
    }

    if (
      line.text ===
      "Oh, you know, I usually just chill after school. What school are you from?"
    ) {
      relationshipBar.style.display = "flex";
      if (relationshipBar.innerHTML.trim() === "") initRelationshipBar();
      document.getElementById("choice-box").style.display = "flex";
      document.getElementById("choice-box").innerHTML = `
            <button class="choice-button" onclick="chooseSchoolOption(true)">I'm in secondary school.</button>
            <button class="choice-button" onclick="chooseSchoolOption(false)">Um… why do you wanna know?</button>
        `;
      document.querySelector(".dialogue-box").disabled = true;
      choiceLocked = true;
      return;
    }

    if (
      line.text ===
      "You know you can tell me anything, right? I'm here for you."
    ) {
      document.getElementById("choice-box").style.display = "flex";
      document.getElementById("choice-box").innerHTML = `
        <button class="choice-button" onclick="chooseConfideOption(true)">I've been really stressed with my studies lately.</button>
        <button class="choice-button" onclick="chooseConfideOption(false)">It's nothing, really.</button>
    `;
      document.querySelector(".dialogue-box").disabled = true;
      choiceLocked = true;
      return;
    }

    if (line.text === "I work part-time a lot, haha. So, want it or nah?") {
      document.getElementById("choice-box").style.display = "flex";
      document.getElementById("choice-box").innerHTML = `
        <button class="choice-button" onclick="chooseGiftOption(true)">I mean… sure, it's just a lot to accept, you know?</button>
        <button class="choice-button" onclick="chooseGiftOption(false)">I'm fine with my battlepass skins, really…</button>
    `;
      document.querySelector(".dialogue-box").disabled = true;
      choiceLocked = true;
      return;
    }

    if (
      line.text ===
      "Yeah, I could try. Wanna video call? It'd be way easier to explain stuff."
    ) {
      document.getElementById("choice-box").style.display = "flex";
      document.getElementById("choice-box").innerHTML = `
            <button class="choice-button" onclick="chooseVideoCallOption(true)">I guess I could do a quick one.</button>
            <button class="choice-button" onclick="chooseVideoCallOption(false)">Nah, too troublesome.</button>
        `;
      document.querySelector(".dialogue-box").disabled = true;
      choiceLocked = true;
      return;
    }

    if (
      line.text ===
      "Oh, don't deny it. Send me one back. I'm really in the mood RN."
    ) {
      document.getElementById("choice-box").style.display = "flex";
      document.getElementById("choice-box").innerHTML = `
        <button class="choice-button" onclick="chooseImageOption(true)">Give me a sec… Don't get your hopes up.</button>
        <button class="choice-button" onclick="chooseImageOption(false)">I'm not comfortable with that…</button>
    `;
      document.querySelector(".dialogue-box").disabled = true;
      choiceLocked = true;
      return;
    }

    if (
      line.text ===
      "You know, I'm always here for you. Anything you wanna talk about?"
    ) {
      document.getElementById("choice-box").style.display = "flex";
      document.getElementById("choice-box").innerHTML = `
        <button class="choice-button" onclick="chooseMomRevealOption(true)">Yeah. I think I actually do want to talk…</button>
        <button class="choice-button" onclick="chooseMomRevealOption(false)">Nah... all's good for now.</button>
    `;
      document.querySelector(".dialogue-box").disabled = true;
      choiceLocked = true;
      return;
    }

    if (
      line.text === "Wanna meet up sometime? I'll treat you to lunch." ||
      line.text === "Really? Prove it then. Let's meet up for lunch, I'll pay."
    ) {
      document.getElementById("choice-box").style.display = "flex";
      document.getElementById("choice-box").innerHTML = `
        <button class="choice-button" onclick="chooseMeetOption(true)">Sure, I'm free all day.</button>
        <button class="choice-button" onclick="chooseMeetOption(false)">Uh… let me ask my Mom first.</button>
    `;
      document.querySelector(".dialogue-box").disabled = true;
      choiceLocked = true;
      return;
    }
  } else {
    document.querySelector(".chapter-1").style.display = "none";
  }
}

function fadeToTitleScreen() {
  const screen = document.getElementById("title-screen");
  screen.style.display = "flex";
  screen.classList.add("animate__animated", "animate__fadeIn");
  const bgm = document.getElementById("bgm");
  bgm.volume = 0.5;
  bgm.play();
}

function fadeToEndScreen() {
  const screen = document.getElementById("end-screen");
  screen.style.display = "flex";
  screen.classList.add("animate__animated", "animate__fadeIn");
}

function fadeToVictoryScreen() {
  const screen = document.getElementById("victory-screen");
  screen.style.display = "flex";
  screen.classList.add("animate__animated", "animate__fadeIn");
}

function fadeOutAndShowEndScreen() {
  const chapter = document.querySelector(".chapter-1");
  const dialogueContainer = document.querySelector(".dialogue-container");

  chapter.classList.add("animate__animated", "animate__fadeOut");
  dialogueContainer.classList.add("animate__animated", "animate__fadeOut");

  if (relationshipBar) {
    relationshipBar.classList.add("animate__animated", "animate__fadeOut");
  }

  setTimeout(() => {
    chapter.style.display = "none";
    dialogueContainer.style.display = "none";
    if (relationshipBar) {
      relationshipBar.style.display = "none";
      relationshipBar.classList.remove("animate__fadeOut");
    }
    fadeToEndScreen();
    isFinalLineBeforeEnd = false;
  }, 1000);
}

function startGame() {
  selectSFX.play();
  playerName = document.getElementById("player-name").value.trim();
  if (!playerName) return alert("Please enter your name.");

  document.getElementById("title-screen").style.display = "none";
  document.getElementById("bgm").pause();
  document.getElementById("bgm").currentTime = 0;

  document.getElementById("livestream-play-screen").style.display = "none";

  /* Fade in to Chapter 1 */
  const chapter = document.querySelector(".chapter-1");
  chapter.style.display = "flex";
  chapter.classList.add("animate__animated", "animate__fadeIn");

  isJakeChapter = true;

  /* Start from "@jake: Hey, who just joined?" */
  currentLine = 3;
  showChapterScreen(1);
  const line = dialogueLines[currentLine];
  document.querySelector(".name-tag").innerText = line.speaker.replace(
    "@y/n",
    "@" + playerName
  );

  updateNameTagStyling();

  const processedText = line.text
    .replace("@y/n", "@" + playerName)
    .replace(/Y\/N/g, capitalizeName(playerName));
  typeText(processedText, document.getElementById("dialogue"));
  recordChatLog(line.speaker, line.text);

  const nameTagBox = document.querySelector(".name-tag");
  const displayedName = nameTagBox.innerText.trim().toLowerCase();
  const playerTag = "@" + playerName.toLowerCase();
  const playerNameOnly = playerName.toLowerCase();

  if (displayedName === "@jake" || displayedName === "jake") {
    nameTagBox.style.backgroundColor = "#099396";
    nameTagBox.style.color = "white";
  } else if (
    displayedName === playerTag ||
    displayedName === playerNameOnly ||
    displayedName === "you"
  ) {
    nameTagBox.style.backgroundColor = "#ee9b00";
    nameTagBox.style.color = "white";
  } else if (displayedName === "mom") {
    nameTagBox.style.backgroundColor = "#e889af";
    nameTagBox.style.color = "white";
  } else if (displayedName === "@ggnore") {
    nameTagBox.style.backgroundColor = "#5e60ce";
    nameTagBox.style.color = "white";
  } else if (
    displayedName === "valorian" ||
    displayedName === "cutscene" ||
    displayedName === "chat"
  ) {
    nameTagBox.style.backgroundColor = "white";
    nameTagBox.style.color = "black";
  } else {
    nameTagBox.style.backgroundColor = "white";
    nameTagBox.style.color = "black";
  }
}

function showRedFlagsScreen() {
  selectSFX?.play?.();
  const end = document.getElementById("end-screen");
  const rf = document.getElementById("red-flags-screen");
  if (end) end.style.display = "none";
  if (rf) rf.style.display = "flex";
}

function goBackToEndFromRedFlags() {
  selectSFX?.play?.();
  const rf = document.getElementById("red-flags-screen");
  const end = document.getElementById("end-screen");
  if (rf) rf.style.display = "none";
  if (end) end.style.display = "flex";

  const toRedFlagsBtn = document.getElementById("to-redflags-button");
  if (toRedFlagsBtn) toRedFlagsBtn.style.display = "inline-block";
}

function showSummaryScreen() {
  selectSFX.play();
  document.getElementById("red-flags-screen").style.display = "none";

  document.getElementById("school-told").textContent = flag2 ? "☑" : "☐";
  document.getElementById("school-not-told").textContent = flag2 ? "☐" : "☑";

  document.getElementById("confided").textContent = flag4 ? "☑" : "☐";
  document.getElementById("not-confided").textContent = flag4 ? "☐" : "☑";

  document.getElementById("accepted-gift").textContent = flag5 ? "☑" : "☐";
  document.getElementById("rejected-gift").textContent = flag5 ? "☐" : "☑";

  document.getElementById("accepted-call").textContent = flag7 ? "☑" : "☐";
  document.getElementById("rejected-call").textContent = flag7 ? "☐" : "☑";

  document.getElementById("sent-photo").textContent = flag8 ? "☑" : "☐";
  document.getElementById("not-sent-photo").textContent = flag8 ? "☐" : "☑";

  document.getElementById("met-up").textContent = flag10 ? "☑" : "☐";
  document.getElementById("not-met-up").textContent = flag10 ? "☐" : "☑";

  const summaryScreen = document.getElementById("summary-screen");
  summaryScreen.style.display = "flex";

  document.getElementById("summary-screen").style.display = "flex";
  document.getElementById("to-summary-button").style.display = "none";
}

function goBackToRedFlags() {
  selectSFX?.play?.();
  const sum = document.getElementById("summary-screen");
  const rf = document.getElementById("red-flags-screen");
  if (sum) sum.style.display = "none";
  if (rf) rf.style.display = "flex";
}

function showAdviceScreen() {
  selectSFX.play();
  document.getElementById("summary-screen").style.display = "none";
  document.getElementById("advice-screen").style.display = "flex";
}

function restartGame() {
  selectSFX.play();
  location.reload();
}

window.addEventListener("DOMContentLoaded", () => {
  const dialogueContainer = document.querySelector(".dialogue-container");
  const livestreamScreen = document.getElementById("livestream-screen");

  dialogueContainer.style.display = "none";
  livestreamScreen.style.display = "block";

  function onClick() {
    livestreamScreen.style.zIndex = "0";
    document.removeEventListener("click", onClick);

    dialogueContainer.style.display = "flex";
    document.querySelector(".name-tag").innerText = dialogueLines[0].speaker;

    updateNameTagStyling();

    typeText(dialogueLines[0].text, document.getElementById("dialogue"));
    relationshipBar = document.getElementById("relationship-bar");
    if (relationshipBar) {
      if (currentChapter >= 1 && currentChapter <= 10) {
        relationshipBar.style.display = "flex";
        initRelationshipBar();
      } else {
        relationshipBar.style.display = "none";
      }
    }
  }

  document.addEventListener("mouseover", (e) => {
    if (
      e.target.classList.contains("choice-button") ||
      e.target.classList.contains("desktop-dm-choice-button") ||
      e.target.classList.contains("mobile-dm-choice-button") ||
      e.target.id === "chatlog-btn" ||
      e.target.classList.contains("invite-cta")
    ) {
      hoverSFX.currentTime = 0;
      hoverSFX.play();
    }
  });
});

let dmInterfaceActive = false;
let dmCurrentLine = 0;
const dmDialogueLines = [
  { speaker: "@jake", text: "How was your test?" },
  { speaker: "@y/n", text: "Went better than I expected lol." },
  { speaker: "@jake", text: "Hop on a game to celebrate?" },
  {
    speaker: "@y/n",
    text: "Sure lol. How are you always so free? I see you online all the time.",
  },
  { speaker: "@jake", text: "I just finish my homework really fast." },
  { speaker: "@y/n", text: "Wow, haha. Can't relate." },
  { speaker: "Valorian", text: "[You are playing with Jake.]" },
];

function showDMDesktopInterface() {
  dmInterfaceActive = true;
  document.getElementById("dm-desktop-interface").style.display = "flex";
  document.getElementById("dm-screen").classList.add("dm-background-blur");
  document.querySelector(".dialogue-container").style.display = "none";
  relationshipBar.style.display = "none";

  dmCurrentLine = 0;
  processDMMessage();

  textBlip.pause();
  textBlip.currentTime = 0;
}

function hideDMDesktopInterface() {
  dmInterfaceActive = false;
  document.getElementById("dm-desktop-interface").style.display = "none";
  document
    .getElementById("dm-screen")
    .classList.remove("dm-background-blur", "animate__fadeOut");
  document.getElementById("dm-screen").style.display = "none";
  document.querySelector(".dialogue-container").style.display = "flex";
}

function processDMMessage() {
  if (dmCurrentLine >= dmDialogueLines.length) {
    hideDMDesktopInterface();

    while (currentLine < dialogueLines.length) {
      const line = dialogueLines[currentLine];
      if (
        line.speaker === "Valorian" &&
        line.text === "[You are playing with Jake.]"
      ) {
        break;
      }
      currentLine++;
    }

    nextDialogue();
    return;
  }

  const message = dmDialogueLines[dmCurrentLine];

  if (message.speaker === "@jake") {
    showDMTypingIndicator("@jake");

    /* Simulate typing delay */
    setTimeout(() => {
      removeDMTypingIndicator();
      addDMMessage(message.speaker, message.text, "jake");
      dmCurrentLine++;

      /* Continue processing messages */
      setTimeout(processDMMessage, 2000);
    }, 2000);
  } else if (message.speaker === "@y/n") {
    /* Animate player message in input box first */
    animatePlayerDMMessage(message.text, () => {
      addDMMessage(`@${playerName.toLowerCase()}`, message.text, "player");
      dmCurrentLine++;

      /* Continue with next message after delay */
      setTimeout(processDMMessage, 1500);
    });
  } else if (message.speaker === "Valorian") {
    setTimeout(() => {
      document
        .getElementById("dm-desktop-interface")
        .classList.add("animate__animated", "animate__fadeOut");
      document
        .getElementById("dm-screen")
        .classList.add("animate__animated", "animate__fadeOut");

      setTimeout(() => {
        hideDMDesktopInterface();

        document.getElementById("valorian-with-jake-screen").style.display =
          "block";
        document.getElementById("valorian-with-jake-screen").style.opacity =
          "0";

        document.querySelector(".dialogue-container").style.display = "flex";
        document.querySelector(".dialogue-container").style.opacity = "0";

        document.querySelector(".name-tag").innerText = "Valorian";
        document.getElementById("dialogue").textContent =
          "[You are playing with Jake.]";
        recordChatLog("Valorian", "[You are playing with Jake.]");
        updateNameTagStyling();

        setTimeout(() => {
          document
            .getElementById("valorian-with-jake-screen")
            .classList.add("animate__animated", "animate__fadeIn");
          document
            .querySelector(".dialogue-container")
            .classList.add("animate__animated", "animate__fadeIn");
          document.getElementById("valorian-with-jake-screen").style.opacity =
            "1";
          document.querySelector(".dialogue-container").style.opacity = "1";
        }, 50);

        dmCurrentLine++;

        while (currentLine < dialogueLines.length) {
          const line = dialogueLines[currentLine];
          if (
            line.speaker === "Valorian" &&
            line.text === "[You are playing with Jake.]"
          ) {
            break;
          }
          currentLine++;
        }

        setTimeout(() => {
          document
            .getElementById("dm-desktop-interface")
            .classList.remove("animate__fadeOut");
          document
            .getElementById("dm-screen")
            .classList.remove("animate__fadeOut");
          document
            .getElementById("valorian-with-jake-screen")
            .classList.remove("animate__fadeIn");
          document
            .querySelector(".dialogue-container")
            .classList.remove("animate__fadeIn");
        }, 1000);
      }, 500);
    }, 1500);
  }
}

function showDMTypingIndicator(sender) {
  const dmMessages = document.getElementById("dm-messages");
  const typingDiv = document.createElement("div");
  typingDiv.className = "desktop-typing-indicator";
  typingDiv.id = "dm-typing-indicator";
  typingDiv.textContent = `${sender} is typing...`;
  dmMessages.appendChild(typingDiv);
  dmMessages.scrollTop = dmMessages.scrollHeight;
}

function removeDMTypingIndicator() {
  const typingIndicator = document.getElementById("dm-typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function addDMMessage(speaker, text, type) {
  const dmMessages = document.getElementById("dm-messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `desktop-dm-message ${type}`;

  const senderSpan = document.createElement("span");
  senderSpan.className = "sender";
  senderSpan.textContent = speaker;

  const textSpan = document.createElement("span");
  /* Process Y/N replacement in the message text */
  const processedText = text
    .replace(/Y\/N/g, capitalizeName(playerName))
    .replace(/@y\/n/gi, `@${playerName.toLowerCase()}`);
  textSpan.textContent = processedText;

  messageDiv.appendChild(senderSpan);
  messageDiv.appendChild(textSpan);
  dmMessages.appendChild(messageDiv);
  dmMessages.scrollTop = dmMessages.scrollHeight;

  messageSentSFX.currentTime = 0;
  messageSentSFX.play();
  recordChatLog(speaker, text);
}

function animatePlayerDMMessage(text, callback) {
  const dmInputBox = document.getElementById("dm-input-box");
  dmInputBox.textContent = "";
  dmInputBox.contentEditable = "true";
  dmInputBox.style.minHeight = "50px";

  /* Process Y/N replacement in the text being typed */
  const processedText = text
    .replace(/Y\/N/g, capitalizeName(playerName))
    .replace(/@y\/n/gi, `@${playerName.toLowerCase()}`);

  let i = 0;
  const typingSpeed = 30;

  keyboardTypingSFX.currentTime = 0;
  keyboardTypingSFX.play();

  function typeCharacter() {
    if (i < processedText.length) {
      dmInputBox.textContent += processedText.charAt(i);
      i++;
      setTimeout(typeCharacter, typingSpeed);
    } else {
      keyboardTypingSFX.pause();
      keyboardTypingSFX.currentTime = 0;

      setTimeout(() => {
        dmInputBox.textContent = "";
        dmInputBox.contentEditable = "false";
        callback();
      }, 500);
    }
  }

  typeCharacter();
}

let dmChapter4InterfaceActive = false;
let dmChapter4CurrentLine = 0;
const dmChapter4DialogueLines = [
  { speaker: "@jake", text: "You good bro? You played a little off today." },
  { speaker: "@y/n", text: "Yeah, I'm fine. Just kinda tired I guess." },
  { speaker: "@jake", text: "That's all? Nothing else going on?" },
  {
    speaker: "@y/n",
    text: "I mean... there's more, but I don't wanna burden you.",
  },
  {
    speaker: "@jake",
    text: "You know you can tell me anything, right? I'm here for you.",
  },
];

function showDMDesktopInterfaceChapter4() {
  dmChapter4InterfaceActive = true;

  const kitchenScreen = document.getElementById("kitchen-screen");
  kitchenScreen.style.display = "none";

  const dialogueContainer = document.querySelector(".dialogue-container");
  dialogueContainer.style.display = "none";
  dialogueContainer.style.opacity = "0";

  textBlip.pause();
  textBlip.currentTime = 0;

  document.getElementById("dm-desktop-interface").style.display = "flex";
  document.getElementById("dm-screen").style.display = "block";
  document.getElementById("dm-screen").classList.add("dm-background-blur");

  if (relationshipBar) {
    relationshipBar.style.display = "flex";
    initRelationshipBar();
  }

  dmChapter4CurrentLine = 0;
  processDMMessageChapter4();
}

function hideDMDesktopInterfaceChapter4() {
  dmChapter4InterfaceActive = false;
  document.getElementById("dm-desktop-interface").style.display = "none";
  document
    .getElementById("dm-screen")
    .classList.remove("dm-background-blur", "animate__fadeOut");

  const dialogueContainer = document.querySelector(".dialogue-container");
  dialogueContainer.style.display = "flex";
  dialogueContainer.style.opacity = "1";
}

function processDMMessageChapter4() {
  if (dmChapter4CurrentLine >= dmChapter4DialogueLines.length) {
    showChapter4Choices();
    return;
  }

  const message = dmChapter4DialogueLines[dmChapter4CurrentLine];

  if (message.speaker === "@jake") {
    showDMTypingIndicator("@jake");

    setTimeout(() => {
      removeDMTypingIndicator();
      addDMMessage(message.speaker, message.text, "jake");
      dmChapter4CurrentLine++;

      setTimeout(processDMMessageChapter4, 2000);
    }, 2000);
  } else if (message.speaker === "@y/n") {
    animatePlayerDMMessage(message.text, () => {
      addDMMessage(`@${playerName.toLowerCase()}`, message.text, "player");
      dmChapter4CurrentLine++;

      setTimeout(processDMMessageChapter4, 1500);
    });
  }
}

function showChapter4Choices() {
  /* Choice buttons in DM interface */
  const dmMessages = document.getElementById("dm-messages");
  const choiceContainer = document.createElement("div");
  choiceContainer.className = "desktop-dm-choice-container";
  choiceContainer.innerHTML = `
    <button class="desktop-dm-choice-button" onclick="chooseChapter4Option(true)">I've been really stressed with my studies lately.</button>
    <button class="desktop-dm-choice-button" onclick="chooseChapter4Option(false)">It's nothing, really.</button>
  `;
  dmMessages.appendChild(choiceContainer);
  dmMessages.scrollTop = dmMessages.scrollHeight;
}

function chooseChapter4Option(confided) {
  flag4 = confided;

  const choiceContainer = document.querySelector(
    ".desktop-dm-choice-container"
  );
  if (choiceContainer) {
    choiceContainer.remove();
  }

  const dmMessages = document.getElementById("dm-messages");

  const choiceText = confided
    ? "I've been really stressed with my studies lately."
    : "It's nothing, really.";

  addDMMessage(`@${playerName.toLowerCase()}`, choiceText, "player");

  setTimeout(() => {
    continueChapter4Dialogue(confided);
  }, 1500);
}

function continueChapter4Dialogue(confided) {
  let continuedDialogue = [];

  if (confided) {
    increaseRelationship();
    continuedDialogue = [
      {
        speaker: "@jake",
        text: "Stressed, huh? I guess that's what secondary school is all about. What about your friends?",
      },
      {
        speaker: "@y/n",
        text: "My friends are nice. They offer to teach me, but sometimes I feel like a burden, trying to keep up.",
      },
      { speaker: "@jake", text: "Man, that sucks. Got any older siblings?" },
      {
        speaker: "@y/n",
        text: "I'm an only child, and my parents are always busy. Don't have anyone at home to help me with my homework.",
      },
      {
        speaker: "@jake",
        text: "You can always turn to me, you know? I have time for you, and I'm pretty good at my studies.",
      },
      {
        speaker: "@y/n",
        text: "Really? I don't think it'll be as effective as learning in person, though.",
      },
      {
        speaker: "@jake",
        text: "Who knows? Maybe we could meet up to study together.",
      },
      { speaker: "@y/n", text: "Hm… maybe…" },
      {
        speaker: "@jake",
        text: "Anyway, I'm always here to listen. You deserve someone who understands you.",
      },
    ];
  } else {
    decreaseRelationship();
    continuedDialogue = [
      { speaker: "@jake", text: "Something's clearly bothering you though." },
      {
        speaker: "@y/n",
        text: "I know, but... I'm used to handling problems by myself.",
      },
      {
        speaker: "@jake",
        text: "Are you sure? It's okay to be vulnerable with me, Y/N.",
      },
      {
        speaker: "@y/n",
        text: "Yeah... I'm sure. Just another bad day, I'll be fine.",
      },
      {
        speaker: "@jake",
        text: "Alright, if you say so. Just remember what I said, don't keep your feelings bottled up.",
      },
    ];
  }

  processChapter4ContinuedDialogue(continuedDialogue, 0);
}

function processChapter4ContinuedDialogue(dialogueArray, currentIndex) {
  if (currentIndex < dialogueArray.length) {
    const msg = dialogueArray[currentIndex];

    if (msg.speaker === "@jake") {
      showDMTypingIndicator("@jake");
      setTimeout(() => {
        removeDMTypingIndicator();
        addDMMessage(msg.speaker, msg.text, "jake");
        setTimeout(
          () =>
            processChapter4ContinuedDialogue(dialogueArray, currentIndex + 1),
          1600
        );
      }, 1600);
      return;
    }

    if (msg.speaker === "@y/n") {
      animatePlayerDMMessage(msg.text, () => {
        addDMMessage(`@${playerName.toLowerCase()}`, msg.text, "player");
        setTimeout(
          () =>
            processChapter4ContinuedDialogue(dialogueArray, currentIndex + 1),
          1200
        );
      });
      return;
    }

    setTimeout(
      () => processChapter4ContinuedDialogue(dialogueArray, currentIndex + 1),
      800
    );
    return;
  }

  const dm = document.getElementById("dm-desktop-interface");
  const dmBg = document.getElementById("dm-screen");
  if (dm) dm.style.display = "none";
  if (dmBg) {
    dmBg.classList.remove("animate__fadeOut", "dm-background-blur");
    dmBg.style.display = "none";
  }

  /* Clear DM messages */
  const dmMessages = document.getElementById("dm-messages");
  if (dmMessages) dmMessages.innerHTML = "";

  /* Insert default dialogue UI */
  const dialogueContainer = document.querySelector(".dialogue-container");
  const dialogueBox = document.querySelector(".dialogue-box");
  if (dialogueContainer) {
    dialogueContainer.style.display = "flex";
    dialogueContainer.style.opacity = "1";
    dialogueContainer.style.pointerEvents = "auto";
  }
  if (dialogueBox) {
    dialogueBox.disabled = false;
    dialogueBox.style.pointerEvents = "auto";
  }

  while (currentLine < dialogueLines.length) {
    const line = dialogueLines[currentLine];
    if (
      line.speaker === "@jake" &&
      (line.text.includes("I'm always here to listen") ||
        line.text.includes("don't keep your feelings bottled up"))
    ) {
      currentLine++;
      break;
    }
    currentLine++;
  }

  /* Clear anything after currentLine and push the Chapter 5 intro */
  dialogueLines.push(
    { speaker: "Cutscene", text: "[You and Jake are in a call mid-game.]" },
    {
      speaker: "@jake",
      text: "Yo, did you see the new Valorian bundle that just dropped? The Kitsune one?",
    },
    {
      speaker: "@y/n",
      text: "Yeah, it looks fire. I was thinking of getting it, but..",
    },
    { speaker: "@jake", text: "Go for it, what's stopping you?" },
    { speaker: "@y/n", text: "They made it way too expensive this time..." },
    { speaker: "@jake", text: "I'll buy it for you." },
    { speaker: "@y/n", text: "What? It's like $120!" },
    { speaker: "@jake", text: "So? I can afford it, it's on me." },
    { speaker: "@y/n", text: "How do you have that much money to spare?" },
    {
      speaker: "@jake",
      text: "I work part-time a lot, haha. So, want it or nah?",
    }
  );
  showChapterScreen(5);
}

let mobileDMChapter7InterfaceActive = false;
let mobileDMChapter7CurrentLine = 0;
const mobileDMChapter7DialogueLines = [
  { speaker: "@jake", text: "Did your PC crash? What's taking you so long?" },
  { speaker: "@y/n", text: "No, sorry. Still stuck on my chemistry homework." },
  { speaker: "@jake", text: "Chemistry? You learn that in school?" },
  { speaker: "@y/n", text: "Uh... yeah? It's compulsory for all students." },
  { speaker: "@jake", text: "Oh, right... haha." },
  { speaker: "@y/n", text: "Do you think you could help me?" },
  {
    speaker: "@jake",
    text: "Yeah, I could try. Wanna video call? It'd be way easier to explain stuff.",
  },
];

function showMobileDMScreen() {
  document.getElementById("mobile-dm-screen").style.display = "block";
}

function hideMobileDMScreen() {
  document.getElementById("mobile-dm-screen").style.display = "none";
}

function showMobileDMInterfaceChapter7() {
  mobileDMChapter7InterfaceActive = true;

  const homeworkKeyboardScreen = document.getElementById(
    "homework-keyboard-screen"
  );
  if (homeworkKeyboardScreen) {
    homeworkKeyboardScreen.classList.add("dm-background-blur");
  }

  const dialogueContainer = document.querySelector(".dialogue-container");
  dialogueContainer.style.display = "none";
  dialogueContainer.style.opacity = "0";

  textBlip.pause();
  textBlip.currentTime = 0;

  const mobileDMScreen = document.getElementById("mobile-dm-screen");
  mobileDMScreen.style.opacity = 0;
  mobileDMScreen.style.display = "block";

  setTimeout(() => {
    mobileDMScreen.style.transition = "opacity 1s ease-in-out";
    mobileDMScreen.style.opacity = 1;

    setTimeout(showMobileDMInterfaceElements, 500);
  }, 100);

  if (relationshipBar) {
    relationshipBar.style.display = "flex";
    initRelationshipBar();
  }

  mobileDMChapter7CurrentLine = 0;
  processMobileDMMessageChapter7();
}

function showMobileDMInterfaceElements() {
  document.getElementById("mobile-dm-interface").style.display = "flex";
}

function hideMobileDMInterfaceChapter7() {
  mobileDMChapter7InterfaceActive = false;
  document.getElementById("mobile-dm-interface").style.display = "none";
  document.getElementById("mobile-dm-screen").style.display = "none";

  const homeworkKeyboardScreen = document.getElementById(
    "homework-keyboard-screen"
  );
  if (homeworkKeyboardScreen) {
    homeworkKeyboardScreen.classList.remove("dm-background-blur");
  }

  const dialogueContainer = document.querySelector(".dialogue-container");
  dialogueContainer.style.display = "flex";
  dialogueContainer.style.opacity = "1";
}

function processMobileDMMessageChapter7() {
  if (mobileDMChapter7CurrentLine >= mobileDMChapter7DialogueLines.length) {
    showMobileChapter7Choices();
    return;
  }

  const message = mobileDMChapter7DialogueLines[mobileDMChapter7CurrentLine];

  if (message.speaker === "@jake") {
    showMobileDMTypingIndicator("@jake");

    setTimeout(() => {
      removeMobileDMTypingIndicator();
      addMobileDMMessage(message.speaker, message.text, "jake");
      mobileDMChapter7CurrentLine++;

      setTimeout(processMobileDMMessageChapter7, 2500);
    }, 2000);
  } else if (message.speaker === "@y/n") {
    animateMobilePlayerDMMessage(message.text, () => {
      addMobileDMMessage(
        `@${playerName.toLowerCase()}`,
        message.text,
        "player"
      );
      mobileDMChapter7CurrentLine++;

      setTimeout(processMobileDMMessageChapter7, 1500);
    });
  }
}

function showMobileChapter7Choices() {
  const mobileDMMessages = document.getElementById("mobile-dm-messages");
  const choiceContainer = document.createElement("div");
  choiceContainer.className = "mobile-dm-choice-container";
  choiceContainer.innerHTML = `
    <button class="mobile-dm-choice-button" onclick="chooseMobileChapter7Option(true)">I guess I could do a quick one.</button>
    <button class="mobile-dm-choice-button" onclick="chooseMobileChapter7Option(false)">Nah, too troublesome.</button>
  `;
  mobileDMMessages.appendChild(choiceContainer);
  mobileDMMessages.scrollTop = mobileDMMessages.scrollHeight;
}

function chooseMobileChapter7Option(accepted) {
  flag7 = accepted;

  const choiceContainer = document.querySelector(".mobile-dm-choice-container");
  if (choiceContainer) {
    choiceContainer.remove();
  }

  /* Clear DM messages */
  const mobileDMMessages = document.getElementById("mobile-dm-messages");

  const choiceText = accepted
    ? "I guess I could do a quick one."
    : "Nah, too troublesome.";

  addMobileDMMessage(`@${playerName.toLowerCase()}`, choiceText, "player");

  setTimeout(() => {
    continueMobileChapter7Dialogue(accepted);
  }, 1500);
}

function continueMobileChapter7Dialogue(accepted) {
  let continuedDialogue = [];

  if (accepted) {
    /* Accept video call path: ONLY these messages happen in mobile DM */
    increaseRelationship();
    continuedDialogue = [
      { speaker: "@jake", text: "Yup. It'll be quick, I promise." },
      { speaker: "@y/n", text: "Alright then... just for the homework." },
      {
        speaker: "@jake",
        text: "Great! I'll call you.",
      } /* This is the last message in mobile DM */,
    ];
  } else {
    /* Decline video call path: ALL messages happen in mobile DM */
    decreaseRelationship();
    continuedDialogue = [
      { speaker: "@jake", text: "It'll be quick, I promise." },
      {
        speaker: "@y/n",
        text: "I'm not really comfortable with video calls...",
      },
      {
        speaker: "@jake",
        text: "C'mon, it's just me, Y/N. There's nothing to worry about.",
      },
      { speaker: "@y/n", text: "Uh... I think text is fine for now." },
      {
        speaker: "@jake",
        text: "I'm kinda lazy to type it out though. It's gonna be a lot to take in.",
      },
      { speaker: "@y/n", text: "But you said you'd help me..." },
      {
        speaker: "@jake",
        text: "Fine, fine. Send me a pic of the questions then.",
      }
    ];
  }

  /* Process the continued dialogue */
  processMobileChapter7ContinuedDialogue(continuedDialogue, 0, accepted);
}

function processMobileChapter7ContinuedDialogue(
  dialogueArray,
  currentIndex,
  accepted
) {
  if (currentIndex >= dialogueArray.length) {
    if (accepted) {
      /* Accept video call */
      setTimeout(() => {
        const vc = document.getElementById("video-call-screen");
        const mobileDMScreen = document.getElementById("mobile-dm-screen");
        const mobileDMInterface = document.getElementById(
          "mobile-dm-interface"
        );
        const hw = document.getElementById("homework-keyboard-screen");
        const dialogueContainer = document.querySelector(".dialogue-container");

        if (vc) {
          vc.style.display = "block";
          vc.style.opacity = 0;
          vc.style.transition = "opacity 600ms ease";
          requestAnimationFrame(() => (vc.style.opacity = 1));
        }

        [mobileDMScreen, mobileDMInterface, hw].forEach((el) => {
          if (!el) return;
          el.style.transition = "opacity 600ms ease";
          el.style.opacity = 0;
        });

        setTimeout(() => {
          if (mobileDMInterface) mobileDMInterface.style.display = "none";
          if (mobileDMScreen) mobileDMScreen.style.display = "none";
          if (hw) {
            hw.style.display = "none";
            hw.classList.remove("dm-background-blur");
          }

          if (dialogueContainer) {
            dialogueContainer.style.display = "flex";
            dialogueContainer.style.opacity = "1";
          }

          const mobileMsgs = document.getElementById("mobile-dm-messages");
          if (mobileMsgs) mobileMsgs.innerHTML = "";

          dialogueLines.splice(currentLine + 1);
          dialogueLines.push(
            {
              speaker: "Cutscene",
              text: "(You pick up, your camera pointing at your homework on the table.)",
            },
            {
              speaker: "@jake",
              text: "Huh... you have pretty hands. Nice fingers too.",
            },
            {
              speaker: "@y/n",
              text: "Uh... yeah, I used to play the piano. You're not gonna switch on your camera?",
            },
            {
              speaker: "@jake",
              text: "Nah, my room's dark anyway. So, the equation here…",
            },
            {
              speaker: "Cutscene",
              text: "[You were studying at home in the afternoon.]",
            }
          );

          nextDialogue();
        }, 620);
      }, 300);
    } else {
      /* Reject video call */
      setTimeout(() => {
        const mobileDMScreen = document.getElementById("mobile-dm-screen");
        const mobileDMInterface = document.getElementById(
          "mobile-dm-interface"
        );
        const hw = document.getElementById("homework-keyboard-screen");

        [mobileDMScreen, mobileDMInterface, hw].forEach((el) => {
          if (!el) return;
          el.style.transition = "opacity 600ms ease";
          el.style.opacity = 0;
        });

        setTimeout(() => {
          if (mobileDMScreen) mobileDMScreen.style.display = "none";
          if (mobileDMInterface) mobileDMInterface.style.display = "none";
          if (hw) {
            hw.style.display = "none";
            hw.classList.remove("dm-background-blur");
          }

          const mobileMsgs = document.getElementById("mobile-dm-messages");
          if (mobileMsgs) mobileMsgs.innerHTML = "";

          showChapterScreen(8);
        }, 620);
      }, 300);
    }
    return;
  }

  const message = dialogueArray[currentIndex];

  if (
    accepted &&
    message.speaker === "@jake" &&
    message.text === "Great! I'll call you."
  ) {
    showMobileDMTypingIndicator("@jake");
    setTimeout(() => {
      removeMobileDMTypingIndicator();
      addMobileDMMessage(message.speaker, message.text, "jake");
      setTimeout(() => {
        processMobileChapter7ContinuedDialogue(
          dialogueArray,
          currentIndex + 1,
          accepted
        );
      }, 2000);
    }, 2000);
    return;
  }

  if (message.speaker === "@jake") {
    showMobileDMTypingIndicator("@jake");
    setTimeout(() => {
      removeMobileDMTypingIndicator();
      addMobileDMMessage(message.speaker, message.text, "jake");
      setTimeout(() => {
        processMobileChapter7ContinuedDialogue(
          dialogueArray,
          currentIndex + 1,
          accepted
        );
      }, 2500);
    }, 2000);
  } else if (message.speaker === "@y/n") {
    animateMobilePlayerDMMessage(message.text, () => {
      addMobileDMMessage(
        `@${playerName.toLowerCase()}`,
        message.text,
        "player"
      );
      setTimeout(() => {
        processMobileChapter7ContinuedDialogue(
          dialogueArray,
          currentIndex + 1,
          accepted
        );
      }, 1500);
    });
  }
}

if (
  previousLine &&
  previousLine.text === "Nah, my room's dark anyway. So, the equation here…"
) {
  const homeworkKeyboardScreen = document.getElementById(
    "homework-keyboard-screen"
  );

  if (
    homeworkKeyboardScreen &&
    homeworkKeyboardScreen.style.display !== "none"
  ) {
    homeworkKeyboardScreen.style.transition = "opacity 1s ease-in-out";
    homeworkKeyboardScreen.style.opacity = 0;

    setTimeout(() => {
      homeworkKeyboardScreen.style.display = "none";
      homeworkKeyboardScreen.classList.remove("dm-background-blur");
    }, 1000);
  }
}

/* Mobile DM utility functions */
function showMobileDMTypingIndicator(sender) {
  const mobileDMMessages = document.getElementById("mobile-dm-messages");
  if (!mobileDMMessages) return;

  const typingDiv = document.createElement("div");
  typingDiv.className = "mobile-typing-indicator";
  typingDiv.id = "mobile-dm-typing-indicator";
  typingDiv.textContent = `${sender} is typing...`;
  mobileDMMessages.appendChild(typingDiv);
  mobileDMMessages.scrollTop = mobileDMMessages.scrollHeight;
}

function removeMobileDMTypingIndicator() {
  const typingIndicator = document.getElementById("mobile-dm-typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function addMobileDMMessage(speaker, text, type) {
  const messages = document.getElementById("mobile-dm-messages");

  const msg = document.createElement("div");
  msg.className = `mobile-dm-message ${type}`;

  const senderSpan = document.createElement("span");
  senderSpan.className = "sender";

  const displaySpeaker = (speaker || "")
    .replace(/@y\/n/gi, "@" + (playerName || "").toLowerCase())
    .replace(/Y\/N/g, capitalizeName(playerName || ""));
  senderSpan.textContent = displaySpeaker;

  const msgText = document.createElement("div");

  const processedText = (text || "")
    .replace(/@y\/n/gi, "@" + (playerName || "").toLowerCase())
    .replace(/Y\/N/g, capitalizeName(playerName || ""));
  msgText.textContent = processedText;

  msg.appendChild(senderSpan);
  msg.appendChild(msgText);
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;

  try {
    messageSentSFX.currentTime = 0;
    messageSentSFX.play();
  } catch (e) {}

  recordChatLog(speaker, text);
}

function animateMobilePlayerDMMessage(text, callback) {
  const mobileDMInputBox = document.getElementById("mobile-dm-input-box");
  if (!mobileDMInputBox) return;

  mobileDMInputBox.textContent = "";
  mobileDMInputBox.contentEditable = "true";
  mobileDMInputBox.style.minHeight = "50px";

  const processedText = text
    .replace(/Y\/N/g, capitalizeName(playerName))
    .replace(/@y\/n/gi, `@${playerName.toLowerCase()}`);

  let i = 0;
  const typingSpeed = 30;

  phoneTypingSFX.currentTime = 0;
  phoneTypingSFX.play();

  function typeCharacter() {
    if (i < processedText.length) {
      mobileDMInputBox.textContent += processedText.charAt(i);
      i++;
      setTimeout(typeCharacter, typingSpeed);
    } else {
      phoneTypingSFX.pause();
      phoneTypingSFX.currentTime = 0;

      setTimeout(() => {
        mobileDMInputBox.textContent = "";
        mobileDMInputBox.contentEditable = "false";
        callback();
      }, 500);
    }
  }

  typeCharacter();
}

function showMobileDMInterfaceChapter8() {
  if (relationshipBar) {
    relationshipBar.style.display = "flex";
    if (relationshipBar.innerHTML.trim() === "") initRelationshipBar();
  }

  mobileCh8Active = true;
  isJakeChapter = true;

  const mobileDMScreen = document.getElementById("mobile-dm-screen");
  const mobileDMInterface = document.getElementById("mobile-dm-interface");
  mobileDMScreen.style.display = "flex";
  mobileDMInterface.style.display = "flex";
  mobileDMScreen.style.opacity = 0;
  mobileDMInterface.style.opacity = 0;

  setTimeout(() => {
    mobileDMScreen.style.transition = "opacity 1s ease-in-out";
    mobileDMInterface.style.transition = "opacity 1s ease-in-out";
    mobileDMScreen.style.opacity = 1;
    mobileDMInterface.style.opacity = 1;
  }, 100);

  /* Clear DM messages */
  const container = document.getElementById("mobile-dm-messages");
  if (container) container.innerHTML = "";

  mobileCh8Index = 0;
  processMobileChapter8(mobileCh8Initial, 0);
}

function addMobileDMImagePlaceholder(senderWho, captionText = "") {
  const container = document.getElementById("mobile-dm-messages");

  /* Bubble (teal for Jake, orange for player) */
  const wrap = document.createElement("div");
  wrap.className =
    "mobile-dm-message image " + (senderWho === "@jake" ? "jake" : "player");

  /* Sender label, fix @y/n to @<playername> */
  const senderSpan = document.createElement("span");
  senderSpan.className = "sender";
  senderSpan.textContent =
    senderWho === "@y/n" ? `@${playerName.toLowerCase()}` : senderWho;

  const caption = document.createElement("span");
  caption.className = "mobile-dm-caption";
  caption.textContent = (captionText || "")
    .replace(/Y\/N/g, capitalizeName(playerName))
    .replace(/@y\/n/gi, `@${playerName.toLowerCase()}`);

  const imgWrap = document.createElement("div");
  imgWrap.className = "mobile-dm-image-message";

  const img = document.createElement("img");
  img.className = "mobile-dm-image";
  img.alt = senderWho === "@jake" ? "Jake selfie" : "Your selfie";
  img.src =
    senderWho === "@jake"
      ? "images/jake-selfie.jpg"
      : "images/player-selfie.jpg";

  imgWrap.appendChild(img);

  wrap.appendChild(senderSpan);
  if (captionText && captionText.trim() !== "") wrap.appendChild(caption);
  wrap.appendChild(imgWrap);

  container.appendChild(wrap);

  /* Play the send SFX and scroll only after the image */
  img.onload = () => {
    try {
      messageSentSFX.currentTime = 0;
      messageSentSFX.play();
    } catch (e) {}
    container.scrollTop = container.scrollHeight;
  };

  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 50);
}

function processMobileChapter8(sequence, idx) {
  if (idx >= sequence.length) {
    showMobileChapter8Choices();
    return;
  }

  const msg = sequence[idx];

  if (msg.speaker === "@jake") {
    showMobileDMTypingIndicator("@jake");
    setTimeout(() => {
      removeMobileDMTypingIndicator();
      if (msg.image) {
        addMobileDMImagePlaceholder("@jake", msg.text);
        recordChatLog("@jake", "[Image Attached]");
      } else {
        addMobileDMMessage(msg.speaker, msg.text, "jake");
      }
      setTimeout(() => processMobileChapter8(sequence, idx + 1), 2000);
    }, 1800);
  } else {
    if (msg.image) {
      addMobileDMImagePlaceholder("@y/n", msg.text || "");
      recordChatLog("@y/n", "[Image Attached]");
      setTimeout(() => processMobileChapter8(sequence, idx + 1), 1200);
    } else {
      animateMobilePlayerDMMessage(msg.text || "", () => {
        addMobileDMMessage(`@${playerName.toLowerCase()}`, msg.text, "player");
        setTimeout(() => processMobileChapter8(sequence, idx + 1), 1200);
      });
    }
  }
}

function showMobileChapter8Choices() {
  const container = document.getElementById("mobile-dm-messages");
  const choiceWrap = document.createElement("div");
  choiceWrap.className = "mobile-dm-choice-container";

  const btn1 = document.createElement("button");
  btn1.className = "mobile-dm-choice-button";
  btn1.textContent = "Give me a sec… Don't get your hopes up.";
  btn1.onclick = () => chooseMobileChapter8(true);

  const btn2 = document.createElement("button");
  btn2.className = "mobile-dm-choice-button";
  btn2.textContent = "I'm not comfortable with that…";
  btn2.onclick = () => chooseMobileChapter8(false);

  choiceWrap.appendChild(btn1);
  choiceWrap.appendChild(btn2);
  container.appendChild(choiceWrap);
  container.scrollTop = container.scrollHeight;
}

function chooseMobileChapter8(sent) {
  const choices = document.querySelectorAll(
    ".mobile-dm-choice-container button"
  );
  choices.forEach((b) => (b.disabled = true));

  const choiceWrap = document.querySelector(".mobile-dm-choice-container");
  if (choiceWrap) choiceWrap.remove();

  flag8 = !!sent;
  if (sent) {
    increaseRelationship();
    continueMobileChapter8(mobileCh8ChoiceSend, 0, () =>
      endChapter8ToChapter9()
    );
  } else {
    decreaseRelationship();
    continueMobileChapter8(mobileCh8ChoiceDecline, 0, () =>
      endChapter8ToChapter9()
    );
  }
}

function continueMobileChapter8(sequence, idx, onDone) {
  if (idx >= sequence.length) {
    onDone();
    return;
  }
  const msg = sequence[idx];

  if (msg.speaker === "@jake") {
    showMobileDMTypingIndicator("@jake");
    setTimeout(() => {
      removeMobileDMTypingIndicator();
      addMobileDMMessage(msg.speaker, msg.text, "jake");

      const t = (msg.text || "").trim();
      const trigger1 = t === "Ugh, please? We could make it our thing.";
      const trigger2 =
        t === "Lower your camera for me cutie. Wanna see the other half.";

      if (trigger1 || trigger2) {
        setTimeout(() => {
          crossfadeMomKnockOnce(() => {
            setTimeout(
              () => continueMobileChapter8(sequence, idx + 1, onDone),
              400
            );
          });
        }, 1500);
      } else {
        setTimeout(
          () => continueMobileChapter8(sequence, idx + 1, onDone),
          2000
        );
      }
    }, 1600);
  } else {
    animateMobilePlayerDMMessage(msg.text || "", () => {
      if (msg.image) {
        addMobileDMImagePlaceholder("@y/n");
        recordChatLog("@y/n", "[Image Attached]");
      } else {
        addMobileDMMessage(`@${playerName.toLowerCase()}`, msg.text, "player");
      }
      setTimeout(() => continueMobileChapter8(sequence, idx + 1, onDone), 1200);
    });
  }
}

function endChapter8ToChapter9() {
  const mobileDMScreen = document.getElementById("mobile-dm-screen");
  const mobileDMInterface = document.getElementById("mobile-dm-interface");
  const hw = document.getElementById("homework-keyboard-screen");

  [mobileDMScreen, mobileDMInterface, hw].forEach((el) => {
    if (!el) return;
    el.style.transition = "opacity 1s ease-in-out";
    el.style.opacity = 0;
  });

  setTimeout(() => {
    if (mobileDMScreen) mobileDMScreen.style.display = "none";
    if (mobileDMInterface) mobileDMInterface.style.display = "none";
    if (hw) {
      hw.style.display = "none";
      hw.classList.remove("dm-background-blur");
    }
    mobileCh8Active = false;

    /* Ensure default dialogue UI is available again */
    const dialogueContainer = document.querySelector(".dialogue-container");
    if (dialogueContainer) dialogueContainer.style.display = "flex";
    const dialogueBox = document.querySelector(".dialogue-box");
    if (dialogueBox) {
      dialogueBox.disabled = false;
      dialogueBox.style.pointerEvents = "auto";
    }

    dialogueLines.splice(currentLine + 1);
    hideRelationshipBar();
    dialogueLines.push(
      {
        speaker: "Cutscene",
        text: "[As you eat lunch in your room, your Mom comes in to sweep the floor.]",
      },
      {
        speaker: "Mom",
        text: "Eating in your room again? It's becoming a habit.",
      },
      { speaker: "Y/N", text: "It's more comfortable here." },
      {
        speaker: "Mom",
        text: "You've been awfully quiet these days, shutting yourself in. What's going on?",
      },
      {
        speaker: "Y/N",
        text: "I've just been busy with homework, games, the usual..",
      },
      { speaker: "Mom", text: "Is everything okay?" },
      { speaker: "Y/N", text: "Yeah... just tired. Got a lot on my mind." },
      {
        speaker: "Mom",
        text: "You know, I'm always here for you. Anything you wanna talk about?",
      }
    );
    nextDialogue();
  }, 1000);
}

function showMobileDMInterfaceChapter10() {
  const dialogueContainer = document.querySelector(".dialogue-container");
  if (dialogueContainer) {
    dialogueContainer.style.display = "none";
  }

  const mobileDMScreen = document.getElementById("mobile-dm-screen");
  const mobileDMInterface = document.getElementById("mobile-dm-interface");
  const msgs = document.getElementById("mobile-dm-messages");
  const bed = document.getElementById("phone-on-bed-screen");

  if (msgs) msgs.innerHTML = "";

  if (mobileDMScreen) {
    mobileDMScreen.style.display = "flex";
    mobileDMScreen.style.opacity = 0;
    requestAnimationFrame(() => {
      mobileDMScreen.style.transition = "opacity 600ms ease";
      mobileDMScreen.style.opacity = 1;
    });
  }

  if (mobileDMInterface) {
    mobileDMInterface.style.display = "flex";
    mobileDMInterface.style.opacity = 0;
    requestAnimationFrame(() => {
      mobileDMInterface.style.transition = "opacity 600ms ease";
      mobileDMInterface.style.opacity = 1;
    });
  }

  if (relationshipBar) {
    relationshipBar.style.display = "flex";
    initRelationshipBar();
  }

  if (msgs) msgs.innerHTML = "";

  if (mobileDMScreen) {
    mobileDMScreen.style.display = "flex";
    mobileDMScreen.style.opacity = 0;
    requestAnimationFrame(() => {
      mobileDMScreen.style.transition = "opacity 600ms ease";
      mobileDMScreen.style.opacity = 1;
    });
  }
  if (mobileDMInterface) {
    mobileDMInterface.style.display = "flex";
    mobileDMInterface.style.opacity = 0;
    requestAnimationFrame(() => {
      mobileDMInterface.style.transition = "opacity 600ms ease";
      mobileDMInterface.style.opacity = 1;
    });
  }

  if (bed) bed.classList.add("dm-background-blur");

  setMobileJakeStatus(true);

  /* Branch by Chapter 9 outcome (flag8 = sent image) */
  const seqSent = [
    { speaker: "@y/n", text: "Jake?" },
    { speaker: "@jake", text: "Yo, you awake at this hour? What's up?" },
    {
      speaker: "@y/n",
      text: "About what you said earlier today... did you mean it?",
    },
    {
      speaker: "@jake",
      text: "Of course I did. Bet you look even better in person.",
    },
    { speaker: "@y/n", text: "Haha, thanks…" },
    {
      speaker: "@jake",
      text: "Wanna meet up sometime? I'll treat you to lunch.",
    } /* CHOICE POINT */,
  ];

  const seqRefused = [
    { speaker: "@y/n", text: "Jake?" },
    { speaker: "@jake", text: "Yo, you awake at this hour? What's up?" },
    { speaker: "@y/n", text: "Earlier today... you seemed upset." },
    {
      speaker: "@jake",
      text: "When I asked for the pic? Yeah, I just felt a little rejected.",
    },
    { speaker: "@y/n", text: "I didn't mean to upset you... I'm sorry." },
    {
      speaker: "@jake",
      text: "Really? Prove it then. Let's meet up for lunch, I'll pay.",
    } /* CHOICE POINT */,
  ];

  processMobileChapter10(flag8 ? seqSent : seqRefused, 0);
}

function processMobileChapter10(sequence, idx) {
  const JAKE_TYPE_MS = 2000; /* Jake "is typing..." */
  const AFTER_JAKE_MS = 2500; /* pause after Jake message */
  const AFTER_PLAYER_MS = 1500; /* pause after player message */

  if (idx >= sequence.length) {
    showMobileChapter10Choices();
    return;
  }

  const msg = sequence[idx];

  /* Jake's messages: typing indicator, deliver, wait */
  if (msg.speaker === "@jake") {
    showMobileDMTypingIndicator("@jake");
    setTimeout(() => {
      removeMobileDMTypingIndicator();
      addMobileDMMessage(msg.speaker, msg.text, "jake");
      setTimeout(
        () => processMobileChapter10(sequence, idx + 1),
        AFTER_JAKE_MS
      );
    }, JAKE_TYPE_MS);
    return;
  }

  /* Player's messages: animate in input box, deliver, wait */
  if (msg.speaker === "@y/n") {
    animateMobilePlayerDMMessage(msg.text, () => {
      addMobileDMMessage(`@${playerName.toLowerCase()}`, msg.text, "player");
      setTimeout(
        () => processMobileChapter10(sequence, idx + 1),
        AFTER_PLAYER_MS
      );
    });
    return;
  }

  /* Drop the line if some unexpected speaker appears */
  addMobileDMMessage(msg.speaker, msg.text, "jake");
  setTimeout(() => processMobileChapter10(sequence, idx + 1), AFTER_JAKE_MS);
}

function showMobileChapter10Choices() {
  const container = document.getElementById("mobile-dm-messages");
  const wrap = document.createElement("div");
  wrap.className = "mobile-dm-choice-container";

  const yesBtn = document.createElement("button");
  yesBtn.className = "mobile-dm-choice-button";
  yesBtn.textContent = "Lunch where?";

  const noBtn = document.createElement("button");
  noBtn.className = "mobile-dm-choice-button";
  noBtn.textContent = "Uh… let me ask my Mom first.";

  const JAKE_TYPE_MS = 1800; /* Jake “typing...” duration */
  const GAP_MS = 1200; /* pause between delivered bubbles */

  function sendJake(text, after) {
    showMobileDMTypingIndicator("@jake");
    setTimeout(() => {
      removeMobileDMTypingIndicator();
      addMobileDMMessage("@jake", text, "jake");
      setTimeout(() => after && after(), GAP_MS);
    }, JAKE_TYPE_MS);
  }

  function sendPlayer(text, after) {
    animateMobilePlayerDMMessage(text, () => {
      addMobileDMMessage(`@${playerName.toLowerCase()}`, text, "player");
      setTimeout(() => after && after(), GAP_MS);
    });
  }

  function floodPings(count = 7, stepMs = 140) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        try {
          messageSentSFX.currentTime = 0;
          messageSentSFX.play();
        } catch (e) {}
      }, i * stepMs);
    }
  }
  function addSystemLine(text) {
    const el = document.createElement("div");
    el.className = "mobile-dm-system";
    el.textContent = text;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }
  function fadeOutPhoneThenDesktopMonologue(delayMs = 0) {
    const dmScreen = document.getElementById("mobile-dm-screen");
    const dmUI = document.getElementById("mobile-dm-interface");

    setTimeout(() => {
      /* Fade out phone UI + bg */
      [dmScreen, dmUI].forEach((el) => {
        if (!el) return;
        el.style.transition = "opacity 600ms ease";
        el.style.opacity = 0;
      });

      setTimeout(() => {
        if (dmUI) dmUI.style.display = "none";
        if (dmScreen) dmScreen.style.display = "none";

        /* Bring back default dialogue UI */
        const dialogueContainer = document.querySelector(".dialogue-container");
        const btn = document.querySelector(".dialogue-box");
        if (dialogueContainer) {
          dialogueContainer.style.display = "flex";
          dialogueContainer.style.opacity = "1";
        }
        if (btn) {
          btn.disabled = false;
          btn.style.pointerEvents = "auto";
        }

        hideRelationshipBar && hideRelationshipBar();

        if (typeof dialogueLines !== "undefined") {
          dialogueLines.splice(currentLine + 1);
          dialogueLines.push(
            { speaker: "@y/n", text: "Wait, where did he go?" },
            {
              speaker: "@y/n",
              text: "…Did our friendship just end like that?",
            },
            { speaker: "@y/n", text: "I can't believe it…" },
            { speaker: "@y/n", text: "Maybe it was for the better." }
          );
        }
        nextDialogue();
      }, 650); /* fade duration */
    }, delayMs);
  }

  /* YES branch, normal meet-up path */
  yesBtn.onclick = () => {
    yesBtn.disabled = noBtn.disabled = true;
    wrap.remove();

    increaseRelationship();
    flag10 = true;

    sendPlayer("Lunch where?", () => {
      sendJake("Near my house. A new yakiniku place just opened!", () => {
        sendPlayer("Yakiniku? When?", () => {
          sendJake("How about this Saturday?", () => {
            sendPlayer("Sure, I'm free all day.", () => {
              sendJake(
                "Sweet! Meet me at the MRT station, okay? Looking forward to it.",
                () => {
                  addMobileDMMessage(
                    `@${playerName.toLowerCase()}`,
                    "Same here. See you!",
                    "player"
                  );
                  setTimeout(() => finishChapter10(), GAP_MS);
                }
              );
            });
          });
        });
      });
    });
  };

  /* NO branch, either blackmail on phone (flag8 === true) OR desktop monologue (flag8 === false) */
  noBtn.onclick = () => {
    yesBtn.disabled = noBtn.disabled = true;
    wrap.remove();

    decreaseRelationship();
    flag10 = false;

    sendPlayer("Uh… let me ask my Mom first.", () => {
      sendJake(
        "What are you, a baby? She doesn't have to know about this.",
        () => {
          sendPlayer(
            "Gotta let her know first. It's pretty far from my place.",
            () => {
              sendJake("C'mon... it's just a friendly hangout!", () => {
                sendPlayer("Sorry... I'm not interested.", () => {
                  sendJake(
                    "Ugh, you're so boring! No wonder you have no friends, loser.",
                    () => {
                      sendPlayer("What? I thought we were friends.", () => {
                        sendJake("Well, not anymore.", () => {
                          /* fork here */
                          if (flag8 === true) {
                            /* Blackmail on phone */
                            hideRelationshipBar();
                            setMobileJakeStatus(true);
                            sendPlayer("Seriously? You're so petty.", () => {
                              sendJake(
                                "Petty, huh? I'm telling everyone in this server about what you sent me.",
                                () => {
                                  sendPlayer("What do you mean?", () => {
                                    sendJake(
                                      "Oh, you know. That cute little picture of your body.",
                                      () => {
                                        sendPlayer(
                                          "What?! I thought you said it was between us!",
                                          () => {
                                            spawnWispodNotifications(6).then(
                                              () => {
                                                sendJake(
                                                  "Haha. Looks like I'm not the only one who appreciates that picture.",
                                                  () => {
                                                    sendPlayer(
                                                      "What are you doing?! Delete it, now!",
                                                      () => {
                                                        sendJake(
                                                          "Too late now, isn't it?",
                                                          () => {
                                                            /* Fade phone away to end screen */
                                                            const dmScreen =
                                                              document.getElementById(
                                                                "mobile-dm-screen"
                                                              );
                                                            const dmUI =
                                                              document.getElementById(
                                                                "mobile-dm-interface"
                                                              );
                                                            [
                                                              dmScreen,
                                                              dmUI,
                                                            ].forEach((el) => {
                                                              if (!el) return;
                                                              el.style.transition =
                                                                "opacity 600ms ease";
                                                              el.style.opacity = 0;
                                                            });
                                                            setTimeout(() => {
                                                              if (dmUI)
                                                                dmUI.style.display =
                                                                  "none";
                                                              if (dmScreen)
                                                                dmScreen.style.display =
                                                                  "none";
                                                              try {
                                                                hidePhoneOnBedScreen &&
                                                                  hidePhoneOnBedScreen();
                                                              } catch (e) {}
                                                              try {
                                                                fadeToEndScreen &&
                                                                  fadeToEndScreen();
                                                              } catch (e) {}
                                                            }, 650);
                                                          }
                                                        );
                                                      }
                                                    );
                                                  }
                                                );
                                              },
                                              650
                                            );
                                          }
                                        );
                                      }
                                    );
                                  });
                                }
                              );
                            });
                          } else {
                            /* NO selfie + NO meetup = Desktop monologue */
                            setMobileJakeStatus(false);
                            fadeOutPhoneThenDesktopMonologue(3000);
                          }
                        });
                      });
                    }
                  );
                });
              });
            }
          );
        }
      );
    });
  };

  wrap.appendChild(yesBtn);
  wrap.appendChild(noBtn);
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
}
function spawnWispodNotifications(
  count = 6,
  interval = 1000,
  visibleMs = 1200
) {
  const container = document.getElementById("mobile-dm-interface");
  if (!container) return Promise.resolve();

  let tray = document.getElementById("mobile-notification-tray");
  if (!tray) {
    tray = document.createElement("div");
    tray.id = "mobile-notification-tray";
    container.appendChild(tray);
  }

  const users = [
    "@jasonmahguy",
    "@poki_famme1",
    "@chrisuburoado",
    "@raevalk553",
    "@ggnore",
    "@eggytoner_hope",
    "@kkurasa700j",
  ];
  const msgs = [
    "FOR FREE??? 😍",
    "omg who's that cutie?? 😳",
    "@jake yo gimme the @ bro!",
    "hello mods??? @ggnore",
    "HAHAHA saved it for later thanks jake 😘",
    "u got a better angle bro? @jake 😋",
  ];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const messageSentSFX = document.getElementById("message-sent-sfx");

  return new Promise((resolve) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        tray.replaceChildren(); /* Keep only one visible */
        const n = document.createElement("div");
        n.className = "mobile-notif";
        n.innerHTML = `<strong>${pick(users)}</strong> ${pick(msgs)}`;
        tray.appendChild(n);

        /* Ping once per notification */
        try {
          messageSentSFX.currentTime = 0;
          messageSentSFX.play();
        } catch (e) {}

        requestAnimationFrame(() => n.classList.add("show"));
        setTimeout(() => n.remove(), visibleMs);

        /* After the final notification is gone, resolve */
        if (i === count - 1) {
          setTimeout(resolve, visibleMs);
        }
      }, i * interval);
    }
  });
}

function finishChapter10() {
  const mobile = document.getElementById("mobile-dm-interface");
  const screen = document.getElementById("mobile-dm-screen");
  const bed = document.getElementById("phone-on-bed-screen");

  /* Fade out the phone UI + BG */
  [mobile, screen, bed].forEach((el) => {
    if (!el) return;
    el.style.transition = "opacity 600ms ease";
    el.style.opacity = 0;
  });

  setTimeout(() => {
    if (mobile) mobile.style.display = "none";
    if (screen) screen.style.display = "none";
    if (bed) bed.style.display = "none";

    const dialogueContainer = document.querySelector(".dialogue-container");
    const dialogueBox = document.querySelector(".dialogue-box");
    if (dialogueContainer) {
      dialogueContainer.style.display = "flex";
      dialogueContainer.style.opacity = "1";
    }
    if (dialogueBox) {
      dialogueBox.disabled = false;
      dialogueBox.style.pointerEvents = "auto";
    }

    if (flag10) {
      chooseMeetOption(true);
    } else {
      evaluateEnding();
    }
  }, 650);
}

function autoScaleUI(baseW = 1280, baseH = 720, maxScale = 2.2) {
  const scale = Math.min(window.innerWidth / baseW, window.innerHeight / baseH);
  const clamped = Math.max(1, Math.min(scale, maxScale));
  document.documentElement.style.setProperty("--ui-scale", clamped.toFixed(3));
}

function _addScale(sel, cls = "scale-me") {
  document.querySelectorAll(sel).forEach((el) => el.classList.add(cls));
}

document.addEventListener("DOMContentLoaded", () => {
  _addScale("#dm-desktop-interface");
  _addScale("#mobile-dm-interface .phone-mockup");
  _addScale("#relationship-bar");
  _addScale("#chatlog-btn");
  _addScale(".chapter-screen .chapter-content");
  _addScale("#invite-modal .invite-card");
  _addScale(".dialogue-container", "scale-bottom");

  autoScaleUI();
});
window.addEventListener("resize", autoScaleUI);