let playerName = "";

let flag2 = false;
let flag4 = false;
let flag5 = false;
let flag7 = false;
let flag8 = false;
let flag10 = false;

let isJakeChapter = false;

function capitalizeName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

let isFinalLineBeforeEnd = false; // Add this near the top with other variables

let relationshipBar;
const maxHearts = 10;
let currentHearts = 5; // Start with 5 filled

// Initialize hearts
function initRelationshipBar() {
    relationshipBar.innerHTML = "";
    for (let i = 0; i < maxHearts; i++) {
        const heart = document.createElement("img");
        heart.src = i < currentHearts ? "images/heart_fill.png" : "images/heart_nofill.png";
        heart.style.width = "30px";
        heart.style.height = "30px";
        relationshipBar.appendChild(heart);
    }
}


// Update hearts display
function updateRelationshipBar() {
    const hearts = relationshipBar.querySelectorAll("img");
    hearts.forEach((heart, index) => {
        heart.src = index < currentHearts ? "images/heart_fill.png" : "images/heart_nofill.png";
    });
}

function increaseRelationship() {
    if (currentHearts < maxHearts) {
        currentHearts++;
        updateRelationshipBar();
        positiveSFX.play();
        showHeartGainEffect();
        spawnFloatingHearts(); // Add this line
    }
}

// Update in interactive_story_experience.js
function decreaseRelationship() {
    if (currentHearts > 0) {
        currentHearts--;
        updateRelationshipBar();
        negativeSFX.play();
        showDamageEffect(); // Add this line
    }
}

const positiveSFX = new Audio('audio/positive.mp3');
const negativeSFX = new Audio('audio/negative.mp3');
positiveSFX.volume = 0.6;
negativeSFX.volume = 0.5

const selectSFX = new Audio('audio/select.mp3');
selectSFX.volume = 1.0;

const hoverSFX = new Audio('audio/hover.wav');
hoverSFX.volume = 0.6;

const momKnockSFX = new Audio('audio/mom-knock.mp3');
momKnockSFX.volume = 1.0;



function startLivestream() {
    selectSFX.play();
  document.getElementById("play-button").style.display = "none";
  document.getElementById("livestream-screen").style.display = "none";
  document.getElementById("livestream-play-screen").style.display = "block";

  const dialogueContainer = document.querySelector(".dialogue-container");
  dialogueContainer.style.display = "flex";
  document.querySelector(".name-tag").innerText = dialogueLines[0].speaker;
  typeText(dialogueLines[0].text, document.getElementById("dialogue"));
  relationshipBar = document.getElementById("relationship-bar");
}

function showLivestreamScreen() {
    document.getElementById("livestream-screen").style.display = "block";
}

function hideLivestreamScreen() {
    document.getElementById("livestream-screen").style.display = "none";
}

function showVictoryScreen() {
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

function showKitchenMomScreen() {
    document.getElementById("kitchen-mom-screen").style.display = "block";
}

function hideKitchenMomScreen() {
    document.getElementById("kitchen-mom-screen").style.display = "none";
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



function showContentWarning() {
    const warningScreen = document.getElementById("content-warning-screen");

    if (relationshipBar) {
        relationshipBar.style.display = "none"; // 🔥 Hide the bar during content warning
    }

    warningScreen.style.display = "flex";
    warningScreen.classList.add("animate__animated", "animate__fadeIn");
    
    setTimeout(hideContentWarning, 3000);
}

function hideContentWarning() {
    const warningScreen = document.getElementById("content-warning-screen");
    warningScreen.classList.remove("animate__fadeIn");
    warningScreen.classList.add("animate__fadeOut");
    
    setTimeout(() => {
        warningScreen.style.display = "none";
        warningScreen.classList.remove("animate__fadeOut");
        
        // Enable the dialogue box and continue
        document.querySelector(".dialogue-box").disabled = false;
        document.querySelector(".dialogue-box").style.pointerEvents = "auto";
        
        // Continue with the next line of dialogue
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

function hideRelationshipBar() {
    if (relationshipBar) {
        relationshipBar.style.display = "none";
    }
}

function showChapterScreen(chapterNumber) {
    // Hide all persistent background screens when chapter screen shows
    document.getElementById("victory-screen").style.display = "none";
    document.getElementById("defeat-screen").style.display = "none";
    document.getElementById("kitchen-screen").style.display = "none";
    document.getElementById("kitchen-mom-screen").style.display = "none";
    document.getElementById("gun-skins-screen").style.display = "none";
    document.getElementById("homework-keyboard-screen").style.display = "none";
    document.getElementById("mom-knock-screen").style.display = "none";
    document.getElementById("dm-screen").style.display = "none";
    

    const chapterScreen = document.getElementById(`chapter-${chapterNumber}-screen`);
    const dialogueBox = document.querySelector(".dialogue-box");

    dialogueBox.disabled = true;
    dialogueBox.style.pointerEvents = "none";

    chapterScreen.style.display = "flex";

    if (chapterNumber === 1) {
        setTimeout(() => {
            chapterScreen.classList.add("animate__animated", "animate__fadeOut");

            setTimeout(() => {
                chapterScreen.style.display = "none";
                chapterScreen.classList.remove("animate__fadeOut");

                dialogueBox.disabled = false;
                dialogueBox.style.pointerEvents = "auto";
                
                // Only now start the very first line
                const line = dialogueLines[currentLine];
                document.querySelector(".name-tag").innerText = line.speaker.replace("@y/n", "@" + playerName);
                const processedText = line.text
                    .replace("@y/n", "@" + playerName)
                    .replace(/Y\/N/g, capitalizeName(playerName));
                typeText(processedText, document.getElementById("dialogue"));

            }, 500);
        }, 1500); // show "Chapter 1" for 1.5s

} else {
    chapterScreen.classList.add("animate__animated", "animate__fadeIn");

    if (chapterNumber === 2 || chapterNumber === 4) {
        const dmScreen = document.getElementById("dm-screen");
        dmScreen.style.opacity = 0;
        dmScreen.style.display = "block";

        setTimeout(() => {
            dmScreen.style.transition = "opacity 1s ease-in-out";
            dmScreen.style.opacity = 1;
        }, 500);
    }
    if (chapterNumber === 3) {
    const kitchenScreen = document.getElementById("kitchen-screen");
    const kitchenMomScreen = document.getElementById("kitchen-mom-screen");

    kitchenScreen.style.opacity = 0;
    kitchenScreen.style.display = "block";
    kitchenMomScreen.style.opacity = 0;
    kitchenMomScreen.style.display = "block";

    setTimeout(() => {
        kitchenScreen.style.transition = "opacity 1s ease-in-out";
        kitchenScreen.style.opacity = 1;
        kitchenMomScreen.style.transition = "opacity 1s ease-in-out";
        kitchenMomScreen.style.opacity = 1;
    }, 500);
}
    if (chapterNumber === 5) {
        const gunSkinsScreen = document.getElementById("gun-skins-screen");
        gunSkinsScreen.style.opacity = 0;
        gunSkinsScreen.style.display = "block";

        setTimeout(() => {
            gunSkinsScreen.style.transition = "opacity 1s ease-in-out";
            gunSkinsScreen.style.opacity = 1;
        }, 500);
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
        dmScreen.style.transition = "opacity 1s ease-in-out";
        dmScreen.style.opacity = 1;
    }, 500);
}
if (chapterNumber === 8) {
        setTimeout(() => {
            chapterScreen.classList.add("animate__animated", "animate__fadeOut");

            setTimeout(() => {
                chapterScreen.style.display = "none";
                chapterScreen.classList.remove("animate__fadeOut");

            // Now show content warning after Chapter 8 screen
            showContentWarning();
        }, 500);
    }, 1500);
    return;
}

    setTimeout(() => {
        chapterScreen.classList.remove("animate__fadeIn");
        chapterScreen.classList.add("animate__fadeOut");

        setTimeout(() => {
            chapterScreen.style.display = "none";
            chapterScreen.classList.remove("animate__fadeOut");

            dialogueBox.disabled = false;
            dialogueBox.style.pointerEvents = "auto";

            nextDialogue();
        }, 500);
    }, 1500);
}

}


// Effects
function showDamageEffect() {
    // Create overlay if it doesn't exist
    let overlay = document.getElementById('damage-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'damage-overlay';
        overlay.className = 'damage-overlay';
        
        // Create heart display
        const heartDisplay = document.createElement('div');
        heartDisplay.className = 'damage-heart';
        heartDisplay.innerHTML = '-1 <img src="images/heart_fill.png" alt="Heart">';
        
        overlay.appendChild(heartDisplay);
        document.body.appendChild(overlay);
    }
    
    // Show the overlay
    overlay.style.display = 'flex';
    
    // Add shake class to body
    document.body.classList.add('shake');
    
    // Remove shake class after animation completes
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 500);
    
    // Hide overlay after 1 second
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1000);
}

function showHeartGainEffect() {
    // Create heart display
    const heartDisplay = document.createElement('div');
    heartDisplay.className = 'heart-gain';
    heartDisplay.innerHTML = '+1 <img src="images/heart_fill.png" alt="Heart">';
    
    // Add to body
    document.body.appendChild(heartDisplay);
    
    // Show the heart
    heartDisplay.style.display = 'flex';
    
    // Remove after animation completes
    setTimeout(() => {
        heartDisplay.style.display = 'none';
        heartDisplay.remove();
    }, 1000);
}

function spawnFloatingHearts() {
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        
        // Random positioning (spawn at bottom of screen)
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.top = `${100 + Math.random() * 10}vh`; // Start just below viewport
        
        // Random scale and animation delay
        const scale = 0.5 + Math.random() * 0.5; // 0.5x to 1x size
        heart.style.transform = `scale(${scale})`;
        heart.style.animationDelay = `${Math.random() * 0.5}s`;
        
        // Random animation duration (2-4 seconds)
        heart.style.animationDuration = `${2 + Math.random() * 2}s`;
        
        document.body.appendChild(heart);
        
        // Remove after animation completes
        setTimeout(() => heart.remove(), 3000);
    }
}


/* chooseOption Functions */

function chooseOption(option) {
    isJakeChapter = true;

    const choiceBox = document.getElementById("choice-box");
    choiceBox.style.display = "none";
    document.querySelector(".dialogue-box").disabled = false;
    choiceLocked = false;

    dialogueLines.splice(currentLine + 1); // Clear everything after this choice

    if (option === 1) {
        dialogueLines.push(
            { speaker: "@jake", text: "Woah, you’re Diamond? We got a good one!" },
            { speaker: "Valorian", text: "[You won!]" },
            { speaker: "@jake", text: "You're cracked bro! We gotta play again!" },
            { speaker: "@y/n", text: "Haha, maybe. That was an easy match." },
            { speaker: "@jake", text: "One more game?" },
            { speaker: "@y/n", text: "Nah, gotta study for a test tomorrow." },
            { speaker: "@jake", text: "A test? What subject?" },
            { speaker: "@y/n", text: "Math." },
            { speaker: "@jake", text: "Ew, math sucks. Good luck with your test then, play after?" },
            { speaker: "@y/n", text: "Sure, if I do alright." },
        );
    } else if (option === 2) {
        dialogueLines.push(
            { speaker: "@jake", text: "Don’t worry, I’ll carry you!" },
            { speaker: "Valorian", text: "[You won!]" },
            { speaker: "@jake", text: "Hey, you weren't that bad at all!" },
            { speaker: "@y/n", text: "Haha, I tried. Thanks for boosting my rank." },
            { speaker: "@jake", text: "One more game?" },
            { speaker: "@y/n", text: "Nah, gotta study for a test tomorrow." },
            { speaker: "@jake", text: "A test? What subject?" },
            { speaker: "@y/n", text: "Math." },
            { speaker: "@jake", text: "Ew, math sucks. Good luck with your test then, play after?" },
            { speaker: "@y/n", text: "Sure, if I do alright." },
        );
    }

    /* Append Chapter 2 (Shared regardless of choice) */
    dialogueLines.push(
        { speaker: "Cutscene", text: "[3 days later. You are in a DM with Jake.]" },
        { speaker: "@jake", text: "How was your test?" },
        { speaker: "@y/n", text: "Went better than I expected lol." },
        { speaker: "@jake", text: "Hop on a game to celebrate?" },
        { speaker: "@y/n", text: "Sure lol. How are you always so free? I see you online all the time." },
        { speaker: "@jake", text: "I just finish my homework really fast." },
        { speaker: "@y/n", text: "Wow, haha. Can’t relate." },
        { speaker: "Valorian", text: "[You lost.]" },
        { speaker: "@jake", text: "Come on, we can’t end on a loss! Got time for another?" },
        { speaker: "@y/n", text: "Nah... gotta go to bed." },
        { speaker: "@jake", text: "Seriously? It’s only 10. You ditched me the last time! Can’t you stay up a little longer?" },
        { speaker: "@y/n", text: "I don’t know... I’m pretty tired." },
        { speaker: "@jake", text: "But I've got nothing to do and everyone else is offline!" },
        { speaker: "@y/n", text: "Fine….. 5 minutes max." },
        { speaker: "Cutscene", text: "[Y/N closes the game and switches back to the server]" },
        { speaker: "@jake", text: "Yes! I knew you’d give in. So... what else do you do besides game?" },
        { speaker: "@y/n", text: "I like to read, listen to music, watch videos... you?" },
        { speaker: "@jake", text: "Oh, you know, I usually just chill after school. What school are you from?" }
    );

    nextDialogue();
}

function chooseSchoolOption(sharedSchool) {
    isJakeChapter = true;

    flag2 = sharedSchool;
    const choiceBox = document.getElementById("choice-box");
    choiceBox.style.display = "none";
    document.querySelector(".dialogue-box").disabled = false;
    choiceLocked = false;

    dialogueLines.splice(currentLine + 1); // Clear future lines

    if (sharedSchool) {
        increaseRelationship();
        dialogueLines.push(
            { speaker: "@jake", text: "Secondary school? Same!" },
            { speaker: "@y/n", text: "Really? Which school?" },
            { speaker: "@jake", text: "I'm from Woodbury! You?" },
            { speaker: "@y/n", text: "I'm from Bayside Secondary School." },
            { speaker: "@jake", text: "Bayside Sec? That's around my area!" },
            { speaker: "@y/n", text: "Oh... really?" },
            { speaker: "@jake", text: "Yeah! Who knows, we might've crossed paths before." }
        );
    } else {
        decreaseRelationship();
        dialogueLines.push(
            { speaker: "@jake", text: "Just curious. Maybe we're in the same school?" },
            { speaker: "@y/n", text: "I doubt so... I've never heard of a Jake in my school." },
            { speaker: "@jake", text: "You never know bro. Are you in secondary school?" },
            { speaker: "@y/n", text: "Yeah..." },
            { speaker: "@jake", text: "Which one specifically?" },
            { speaker: "@y/n", text: "I'd rather not tell you that." },
            { speaker: "@jake", text: "It's okay then... I was just curious. I'm from Woodbury Sec, by the way." }
        );
    }


    /* Chapter 3: Mom in kitchen (No flag) */
    dialogueLines.push(
    { speaker: "Cutscene", text: "[It’s the next morning. You drag yourself to the kitchen where your Mom is sipping coffee.]" },
    { speaker: "Mom", text: "Y/N, you look tired. Did you stay up last night?" },
    { speaker: "Y/N", text: "Just busy..." },
    { speaker: "Mom", text: "What were you up to so late?" },
    { speaker: "Y/N", text: "Just gaming and chatting with a friend." },
    { speaker: "Mom", text: "Who? You mean the ones at school?" },
    { speaker: "Y/N", text: "No. Someone from Wispod. We play Valorian together." },
    { speaker: "Mom", text: "Wispod? Like, online? How old are they?" },
    { speaker: "Y/N", text: "He told me he's 15." },
    { speaker: "Mom", text: "Same age, huh? Well, it's nice to see you making friends." },
    { speaker: "Y/N", text: "Haha, yeah... I'm trying. Thanks, Mom." },
    );

    isJakeChapter = false;

    isJakeChapter = true;
    dialogueLines.push(
    /* Chapter 4: Jake lends a listening ear */
    { speaker: "Cutscene", text: "[After a game in DMs]" },
    { speaker: "@jake", text: "You good bro? You played a little off today." },
    { speaker: "@y/n", text: "Yeah, I'm fine. Just kinda tired I guess." },
    { speaker: "@jake", text: "That's all? Nothing else going on?" },
    { speaker: "@y/n", text: "I mean... there's more, but I don't wanna burden you." },
    { speaker: "@jake", text: "You know you can tell me anything, right? I’m here for you." },
    );

nextDialogue();
}

function chooseConfideOption(confided) {
    //isJakeChapter = true//
    flag4 = confided;

    const chapterBox = document.getElementById("choice-box");
    chapterBox.style.display = "none";

    document.querySelector(".dialogue-box").disabled = false;
    choiceLocked = false;

    dialogueLines.splice(currentLine + 1); // Clear future lines

    if (confided) {
        increaseRelationship();
        dialogueLines.push(
            { speaker: "@jake", text: "Stressed, huh? I guess that’s what secondary school is all about. What about your friends?" },
            { speaker: "@y/n", text: "My friends are nice. They offer to teach me, but sometimes I feel like a burden, trying to keep up." },
            { speaker: "@jake", text: "Man, that sucks. Got any older siblings?" },
            { speaker: "@y/n", text: "I’m an only child, and my parents are always busy. Don’t have anyone at home to help me with my homework." },
            { speaker: "@jake", text: "You can always turn to me, you know? I have time for you, and I’m pretty good at my studies." },
            { speaker: "@y/n", text: "Really? I don’t think it’ll be as effective as learning in person, though." },
            { speaker: "@jake", text: "Who knows? Maybe we could meet up to study together." },
            { speaker: "@y/n", text: "Hm… maybe…" },
            { speaker: "@jake", text: "Anyway, I'm always here to listen. You deserve someone who understands you." }
        );
    } else {
        decreaseRelationship();
        dialogueLines.push(
            { speaker: "@jake", text: "Something’s clearly bothering you though." },
            { speaker: "@y/n", text: "I know, but... I'm used to handling problems by myself." },
            { speaker: "@jake", text: "Are you sure? It's okay to be vulnerable with me, Y/N." },
            { speaker: "@y/n", text: "Yeah... I'm sure. Just another bad day, I'll be fine." },
            { speaker: "@jake", text: "Alright, if you say so. Just remember what I said, don't keep your feelings bottled up." }
        );
    }

    /* Chapter 5: Shared intro */
    dialogueLines.push(
        { speaker: "Cutscene", text: "[You and Jake are in a call mid-game.]" },
        { speaker: "@jake", text: "Yo, did you see the new Valorian bundle that just dropped? The Kitsune one?" },
        { speaker: "@y/n", text: "Yeah, it looks fire. I was thinking of getting it, but.." },
        { speaker: "@jake", text: "Go for it, what's stopping you?" },
        { speaker: "@y/n", text: "They made it way too expensive this time..." },
        { speaker: "@jake", text: "I'll buy it for you." },
        { speaker: "@y/n", text: "What? It's like $120!" },
        { speaker: "@jake", text: "So? I can afford it, it's on me." },
        { speaker: "@y/n", text: "How do you have that much money to spare?" },
        { speaker: "@jake", text: "I work part-time a lot, haha. So, want it or nah?" }
    );
    nextDialogue();
}

function chooseGiftOption(accepted) {
    flag5 = accepted;

    const choiceBox = document.getElementById("choice-box");
    choiceBox.style.display = "none";
    document.querySelector(".dialogue-box").disabled = false;
    choiceLocked = false;

    dialogueLines.splice(currentLine + 1); // Clear upcoming lines

    if (accepted) {
        /* Accepted gift */
        increaseRelationship();
        dialogueLines.push(
            { speaker: "@jake", text: "Haha, it’s just a little gift. Check your account!" },
            { speaker: "@y/n", text: "Thanks Jake, this is insane… I feel like I owe you." },
            { speaker: "@jake", text: "Don’t even think about it. You’re my other half, it’s the least I could do!" }
        );
    nextDialogue();
    } else {
        /* Declined gift */
        decreaseRelationship();
        dialogueLines.push(
            { speaker: "@jake", text: "C’mon, you can’t pass up on this bundle! I wanna cheer you up." },
            { speaker: "@y/n", text: "I really appreciate it, but… seriously, it’s okay." },
            { speaker: "@jake", text: "Fine, if you’re so sure. Just know the offer’s always open." }
    );
    nextDialogue();
}

    /* Chapter 6: Mom's concern about Jake (No flag) */
    dialogueLines.push(
        { speaker: "Cutscene", text: "[You are doing homework when your phone rings.]" },
        { speaker: "Mom", text: "Your friend's calling again." },
        { speaker: "Y/N", text: "Yeah, he probably wants to play.." },
        { speaker: "Mom", text: "How close are you two?" },
        { speaker: "Y/N", text: "Pretty close I guess. We talk about everything." },
        { speaker: "Mom", text: "You know, when I was your age, we made friends organically." },
        { speaker: "Y/N", text: "Mom, it's different now. Everyone has online friends. Especially from video games." },
        { speaker: "Mom", text: "I'm not asking you to cut him off. Just be careful what you share, okay?" },
        { speaker: "Y/N", text: "Yeah, got it, Mom..." }
    );

    /* Chapter 7: Jake asks to video call */
    dialogueLines.push(
        { speaker: "Cutscene", text: "[You are doing homework in the afternoon.]" },
        { speaker: "@jake", text: "Did your PC crash? What’s taking you so long?" },
        { speaker: "@y/n", text: "No, sorry. Still stuck on my chemistry homework." },
        { speaker: "@jake", text: "Chemistry? You learn that in school?" },
        { speaker: "@y/n", text: "Uh... yeah? It's compulsory for all students." },
        { speaker: "@jake", text: "Oh, right... haha." },
        { speaker: "@y/n", text: "Do you think you could help me?" },
        { speaker: "@jake", text: "Yeah, I could try. Wanna video call? It’d be way easier to explain stuff." }
    );

}

function chooseVideoCallOption(accepted) {
    flag7 = accepted;

    const choiceBox = document.getElementById("choice-box");
    choiceBox.style.display = "none";
    document.querySelector(".dialogue-box").disabled = false;
    choiceLocked = false;

    dialogueLines.splice(currentLine + 1); // Clear future lines

    if (accepted) {
        /* Accept video call */
        increaseRelationship();
        dialogueLines.push(
            { speaker: "@jake", text: "Yup. It’ll be quick, I promise." },
            { speaker: "@y/n", text: "Alright then... just for the homework." },
            { speaker: "@jake", text: "Great! I'll call you." },
            { speaker: "Cutscene", text: "(You pick up, your camera pointing at your homework on the table.)" },
            { speaker: "@jake", text: "Huh... you have pretty hands. Nice fingers too." },
            { speaker: "@y/n", text: "Uh... yeah, I used to play the piano. You're not gonna switch on your camera?" },
            { speaker: "@jake", text: "Nah, my room's dark anyway. So, the equation here…" }
        );
    } else {
        /* Decline video call */
        decreaseRelationship();
        dialogueLines.push(
            { speaker: "@jake", text: "It’ll be quick, I promise." },
            { speaker: "@y/n", text: "I'm not really comfortable with video calls..." },
            { speaker: "@jake", text: "C'mon, it's just me, Y/N. There's nothing to worry about." },
            { speaker: "@y/n", text: "Uh... I think text is fine for now." },
            { speaker: "@jake", text: "I'm kinda lazy to type it out though. It's gonna be a lot to take in." },
            { speaker: "@y/n", text: "But you said you'd help me..." },
            { speaker: "@jake", text: "Fine, fine. Send me a pic of the questions then." }
        );
    }
    /* Chapter 8: Jake requests explicit photo */
    dialogueLines.push(
        { speaker: "Cutscene", text: "[You were studying at home in the afternoon.]" },
        { speaker: "@jake", text: "Yo, haven’t seen you online in a while. Been thinking about you." },
        { speaker: "@y/n", text: "Sorry, I've been real busy." },
        { speaker: "@jake", text: "WYD RN? I just finished showering." },
        { speaker: "Cutscene", text: "(Jake sends an image, top-half naked.)" },
        { speaker: "@y/n", text: "Woah, uh... I was studying..." },
        { speaker: "@jake", text: "Ugh, you’re always studying. Like what you see?" },
        { speaker: "@y/n", text: "I mean….. I'm just surprised, haha." },
        { speaker: "@jake", text: "Oh, don't deny it. Send me one back. I’m really in the mood RN." }
    );
    nextDialogue();
}

function chooseImageOption(sentImage) {
    flag8 = sentImage;

    const choiceBox = document.getElementById("choice-box");
    choiceBox.style.display = "none";
    document.querySelector(".dialogue-box").disabled = false;
    choiceLocked = false;

    dialogueLines.splice(currentLine + 1); // Clear future dialogue

    if (sentImage) {
        /* Sent image */
        increaseRelationship();
        dialogueLines.push(
            { speaker: "@jake", text: "I’m sure you look great… take your time, I’m waiting." },
            { speaker: "@y/n", text: "Just... don't send this to anyone, alright?" },
            { speaker: "@jake", text: "Of course, we're friends. You can trust me." },
            { speaker: "Cutscene", text: "(You take off your shirt and send a selfie, your upper body exposed.)" },
            { speaker: "@jake", text: "Knew you were cute." },
            { speaker: "@y/n", text: "Haha... you're one to talk." },
            { speaker: "@jake", text: "Lower your camera for me cutie. Wanna see the other half." },
            { speaker: "Mom", text: "Y/N? Can I come in?" },
            { speaker: "@y/n", text: "Can't RN. GTG." },
            { speaker: "@jake", text: "Alright, thanks. I'm keeping this all to myself." }
        );
    } else {
        /* Did not send image */
        decreaseRelationship();
        dialogueLines.push(
            { speaker: "@jake", text: "C’mon, you’ve seen me, now I wanna see you. Don’t be shy." },
            { speaker: "@y/n", text: "I don't look that good, Jake..." },
            { speaker: "@jake", text: "Seriously? I bet you look great. Don't be so hard on yourself." },
            { speaker: "@y/n", text: "I don't take pictures like that. It's just... not my thing." },
            { speaker: "@jake", text: "Ugh, please? We could make it our thing." },
            { speaker: "Mom", text: "Y/N? Can I come in?" },
            { speaker: "@y/n", text: "No thanks... GTG." },
            { speaker: "@jake", text: "Fine. I'll be waiting for the day I get some in return." }
        );
    }

console.log(flag8);
    loadChapter9IfNeeded();

/* Chapter 10 (Always on) */
dialogueLines.push(
    { speaker: "Cutscene", text: "[You are lying in bed at 2AM. You can’t sleep.]" },
    { speaker: "@y/n", text: "Jake?" },
    { speaker: "@jake", text: "Yo, you awake at this hour? What's up?" }
);

if (flag8) {
    hideRelationshipBar(); // Add this line
    dialogueLines.push(
        { speaker: "@y/n", text: "About what you said earlier today... did you mean it?" },
        { speaker: "@jake", text: "Of course I did. Bet you look even better in person." },
        { speaker: "@y/n", text: "Haha, thanks…" },
        { speaker: "@jake", text: "Wanna meet up sometime? I’ll treat you to lunch." }
    );
} else {
    hideRelationshipBar(); // Add this line
    dialogueLines.push(
        { speaker: "@y/n", text: "Earlier today... you seemed upset." },
        { speaker: "@jake", text: "When I asked for the pic? Yeah, I just felt a little rejected." },
        { speaker: "@y/n", text: "I didn't mean to upset you... I'm sorry." },
        { speaker: "@jake", text: "Really? Prove it then. Let’s meet up for lunch, I’ll pay." }
    );
}

nextDialogue();
}

function loadChapter9IfNeeded() {
    if (flag8) {
        hideRelationshipBar(); // Add this line
        dialogueLines.push(
            { speaker: "Cutscene", text: "[As you eat lunch in your room, your Mom comes in to sweep the floor.]" },
            { speaker: "Mom", text: "Eating in your room again? It’s becoming a habit." },
            { speaker: "Y/N", text: "It's more comfortable here." },
            { speaker: "Mom", text: "You've been awfully quiet these days, shutting yourself in. What's going on?" },
            { speaker: "Y/N", text: "I've just been busy with homework, games, the usual.." },
            { speaker: "Mom", text: "Is everything okay?" },
            { speaker: "Y/N", text: "Yeah... just tired. Got a lot on my mind." },
            { speaker: "Mom", text: "You know, I’m always here for you. Anything you wanna talk about?" }
        );
        nextDialogue();
    }
}

function chooseMomRevealOption(reveal) {
    const choiceBox = document.getElementById("choice-box");
    choiceBox.style.display = "none";
    document.querySelector(".dialogue-box").disabled = false;
    choiceLocked = false;

    dialogueLines.splice(currentLine + 1);

    if (reveal) {
        /* Confide */
        hideRelationshipBar(); // Add this line
        dialogueLines.push(
            { speaker: "Mom", text: "Alright, go on. I'm here to listen." },
            { speaker: "Y/N", text: "Um... you know about the guy I told you about?" },
            { speaker: "Mom", text: "You mean Jake? Yeah, what's wrong?" },
            { speaker: "Y/N", text: "Everything, Mom. He's been acting so strange lately." },
            { speaker: "Mom", text: "Strange? For example?" },
            { speaker: "Y/N", text: "He asked about my school, sent me a gift, and even wanted to video call me." },
            { speaker: "Mom", text: "What? And how long have you known each other?" },
            { speaker: "Y/N", text: "About a week or so. If I’m being honest… I feel like he’s getting close too quickly." },
            { speaker: "Mom", text: "Alright, Y/N. It sounds like he doesn’t have good intentions. Let’s sit down and talk about this, okay?" }
        );
        nextDialogue();
        return;

        /* Parent Intervention Ending */

    } else {
        /* Don't confide */
        hideRelationshipBar(); // Add this line
        dialogueLines.push(
            { speaker: "Mom", text: "…Alright, if you say so. I'm always here to listen." },
            { speaker: "Y/N", text: "Yeah, I know. Thanks, Mom." },

            /* Chapter 10 */
            { speaker: "Cutscene", text: "[You are lying in bed at 2AM. You can’t sleep.]" },
            { speaker: "@y/n", text: "Jake?" },
            { speaker: "@jake", text: "Yo, you awake at this hour? What's up?" }
        );

        if (flag8) {
            hideRelationshipBar(); // Add this line
            dialogueLines.push(
                { speaker: "@y/n", text: "About what you said earlier today... did you mean it?" },
                { speaker: "@jake", text: "Of course I did. Bet you look even better in person." },
                { speaker: "@y/n", text: "Haha, thanks…" },
                { speaker: "@jake", text: "Wanna meet up sometime? I’ll treat you to lunch." }
            );
        } else {
            hideRelationshipBar(); // Add this line
            dialogueLines.push(
                { speaker: "@y/n", text: "Earlier today... you seemed upset." },
                { speaker: "@jake", text: "When I asked for the pic? Yeah, I just felt a little rejected." },
                { speaker: "@y/n", text: "I didn't mean to upset you... I'm sorry." },
                { speaker: "@jake", text: "Really? Prove it then. Let’s meet up for lunch, I’ll pay." }
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

    dialogueLines.splice(currentLine + 1); // clear future

    if (agreed) {
        hideRelationshipBar(); // Add this line
        dialogueLines.push(
            { speaker: "@jake", text: "Sweet! Meet me at the MRT station, okay? Looking forward to it." },
            { speaker: "@y/n", text: "Same here. See you!" },
            { speaker: "Cutscene", text: "(It is Saturday. You approach the front door hastily.)" },
            { speaker: "Mom", text: "Y/N, where are you going?" },
            { speaker: "@y/n", text: "Uh... Bukit Panjang." },
            { speaker: "Mom", text: "Bukit Panjang?! Why are you going there all of a sudden?" },
            { speaker: "@y/n", text: "To meet a friend... I'll be back before dinner." },
            { speaker: "Mom", text: "Y/N, wait!" },
            { speaker: "Cutscene", text: "(You slam the door shut behind you. You travel to meet Jake.)" },
            { speaker: "Cutscene", text: "[You alight the train. You scan the crowd and spot a man in the distance. He looks around 30.]" },
            { speaker: "@jake", text: "Y/N?" },
            { speaker: "@y/n", text: "Wait, you're not..." },
            { speaker: "@jake", text: "You really look better in person." },
            { speaker: "@y/n", text: "..." }
        );
        evaluateEnding();
    } else {
        hideRelationshipBar(); // Add this line
        dialogueLines.push(
            { speaker: "@jake", text: "What are you, a baby? She doesn’t have to know about this." },
            { speaker: "@y/n", text: "Gotta let her know first. It's pretty far from my place." },
            { speaker: "@jake", text: "C'mon... it's just a friendly hangout!" },
            { speaker: "@y/n", text: "Sorry... I'm not interested." },
            { speaker: "@jake", text: "Ugh, you're so boring! No wonder you have no friends, loser." },
            { speaker: "@y/n", text: "What? I thought we were friends." },
            { speaker: "@jake", text: "Well, not anymore." },
        );
        evaluateEnding();
    }

    nextDialogue();
}


function evaluateEnding() {
    console.log("8:",flag8);
    console.log("10:",flag10);

    const otherFlags = [flag2, flag4, flag5, flag7];
    const otherTrueCount = otherFlags.filter(Boolean).length;

    if (flag8 && !flag10) {
        /* Blackmail Ending */
        hideRelationshipBar(); // Add this line
        dialogueLines.push(
            { speaker: "@y/n", text: "Seriously? You're so petty." },
            { speaker: "@jake", text: "Petty, huh? I'm telling everyone in this server about what you sent me." },
            { speaker: "@y/n", text: "What do you mean?" },
            { speaker: "@jake", text: "Oh, you know. That cute little picture of your body." },
            { speaker: "@y/n", text: "What?! I thought you said it was between us!" },
            { speaker: "Cutscene", text: "[A flood of Wispod notification pings.]" },
            { speaker: "@jake", text: "Haha. Looks like I'm not the only one who appreciates that picture." },
            { speaker: "@y/n", text: "What are you doing?! Delete it, now!" },
            { speaker: "@jake", text: "Too late now, isn't it?" }
        );
        nextDialogue();
        return; // Add this to prevent further execution
    } else if (flag8 === false && otherTrueCount >= 2) {
        /* Risky Escape Ending */
        hideRelationshipBar(); // Add this line
        dialogueLines.push(
            { speaker: "@y/n", text: "Seriously? You're so petty." },
            { speaker: "@jake", text: "You're lucky I don't know where you live." },
            { speaker: "@y/n", text: "What?! I'm blocking you." }
        );
        nextDialogue();
        return; // Add this to prevent further execution
    } else if (flag8 === false && otherTrueCount <= 1) {
        /* Safe Ending */
        hideRelationshipBar(); // Add this line
        dialogueLines.push(
            { speaker: "Cutscene", text: "(Jake goes offline on Y/N's screen.)" },
            { speaker: "@y/n", text: "Wait, where did he go?" },
            { speaker: "@y/n", text: "...Did our friendship just end like that?" },
            { speaker: "@y/n", text: "I can't believe it..." },
            { speaker: "@y/n", text: "Maybe it was for the better." }
        );
        nextDialogue();
        return; // Add this to prevent further execution
    }

    nextDialogue();
}


const dialogueLines = [
    /* Prologue */
    { speaker: "@ggnore", text: "98, 99… 200K subs! You guys are insane! As promised, I've finally opened a Wispod server for us! Feel free to interact with each other, maybe get to play with me live someday!" },
    { speaker: "Chat", text: "LFGGG!\nTHE GOATTT\nWELL DESERVED KING!!!" },
    { speaker: "You", text: "No way! Imagine being in one of his streams?" },

    /* Chapter 1 */
    { speaker: "@jake", text: "Hey, who just joined?" },
    { speaker: "@y/n", text: "Hi..." },
    { speaker: "@jake", text: "Hey, I'm Jake! You're... Y/N?" },
    { speaker: "@y/n", text: "Ah, yeah, same as my username." },
    { speaker: "@jake", text: "Nice to meet you, Y/N! You watch @ggnore too, huh?" },
    { speaker: "@y/n", text: "Yeah, just joined the server, haha." },
    { speaker: "@jake", text: "You play Valorian? We need one more for a 5-stack!" },
];


let currentLine = 0;
let isTyping = false;
let typingInterval;

function typeText(text, element, speed = 20) {
    // Stop any existing sound immediately
    textBlip.pause();
    textBlip.currentTime = 0;

    let i = 0;
    isTyping = true;
    element.innerHTML = "";

    // Suppress blip if chapter 1 screen is still showing
    const chapter1Screen = document.getElementById("chapter-1-screen");
    const chapter1Visible = chapter1Screen && chapter1Screen.style.display !== "none";

    // Only play sound if there's actually text to type & Chapter 1 screen off
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

const textBlip = new Audio('audio/text-blip.mp3');
textBlip.volume = 0.8; // Adjust as needed


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

    currentLine++; /* IMAGE CONTROL MUST GO BELOW */

    if (dialogueLines[currentLine]?.text === "[3 days later. You are in a DM with Jake.]") { // Chapter 2
        showChapterScreen(2);
        return;
    }
    if (dialogueLines[currentLine]?.text === "[It’s the next morning. You drag yourself to the kitchen where your Mom is sipping coffee.]") { // Chapter 3
        showChapterScreen(3);
        return;
    }
    if (dialogueLines[currentLine]?.text === "[After a game in DMs]") { // Chapter 4
        showChapterScreen(4);
        return;
    }
    if (dialogueLines[currentLine]?.text === "[You and Jake are in a call mid-game.]") { // Chapter 5
        showChapterScreen(5);
        return;
    }
    if (dialogueLines[currentLine]?.text === "[You are doing homework when your phone rings.]") { // Chapter 6
        showChapterScreen(6);
        return;
    }
    if (dialogueLines[currentLine]?.text === "[You are doing homework in the afternoon.]") { // Chapter 7
        showChapterScreen(7);
        return;
    }
    if (dialogueLines[currentLine]?.text === "[As you eat lunch in your room, your Mom comes in to sweep the floor.]") { // Chapter 9
        showChapterScreen(9);
        return;
    }
    if (dialogueLines[currentLine]?.text === "[You are lying in bed at 2AM. You can’t sleep.]") { // Chapter 10
        showChapterScreen(10);
        return;
    }


    if (currentLine > 0) {
    const previousLine = dialogueLines[currentLine - 1];
    if (previousLine && previousLine.text === "Sure, if I do alright.") {
        hideVictoryScreen();
    }
    if (previousLine && previousLine.text === "Wow, haha. Can’t relate.") {
        hideDMScreen();
    }
    if (
    previousLine &&
    (
        previousLine.text === "Anyway, I'm always here to listen. You deserve someone who understands you." ||
        previousLine.text === "Alright, if you say so. Just remember what I said, don't keep your feelings bottled up."
    )
    ) {
        hideDMScreen();
    }
    if (previousLine && previousLine.text === "Fine….. 5 minutes max.") {
        hideDefeatScreen();
    }
    if (previousLine && previousLine.text === "Haha, yeah... I'm trying. Thanks, Mom.") {
        hideKitchenScreen();
        hideKitchenMomScreen();
    }
    if (
        previousLine &&
        (
            previousLine.text === "Fine, if you’re so sure. Just know the offer’s always open." ||
            previousLine.text === "Don’t even think about it. You’re my other half, it’s the least I could do!"
        )
    ) {
        hideGunSkinsScreen();
    }
    if (previousLine && previousLine.text === "Yeah, got it, Mom...") {
    hidePhoneRingScreen();
    }
    if (previousLine && previousLine.text === "No, sorry. Still stuck on my chemistry homework.") {
        hideHomeworkKeyboardScreen();
    }
    if (
        previousLine &&
        (
            previousLine.text === "No thanks... GTG." ||
            previousLine.text === "Can't RN. GTG."
        )
    ) {
        hideMomKnockScreen();
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

    if (line.speaker === "Valorian" && line.text === "[You won!]") {
        document.querySelector(".name-tag").innerText = "Valorian";
        typeText("[You won!]", document.getElementById("dialogue"));
        showVictoryScreen();
        return;
    }

    if (line.speaker === "Valorian" && line.text === "[You lost.]") {
        document.querySelector(".name-tag").innerText = "Valorian";
        typeText("[You lost.]", document.getElementById("dialogue"));
        showDefeatScreen();
        return;
    }

    if (line.speaker === "Cutscene" && line.text === "[It’s the next morning. You drag yourself to the kitchen where your Mom is sipping coffee.]") {
        document.querySelector(".name-tag").innerText = "Cutscene";
        typeText("[It’s the next morning. You drag yourself to the kitchen where your Mom is sipping coffee.]", document.getElementById("dialogue"));
        showKitchenScreen();
        showKitchenMomScreen();
        hideRelationshipBar();
        return;
    }

    if (line.speaker === "Cutscene" && line.text === "[You and Jake are in a call mid-game.]") {
        document.querySelector(".name-tag").innerText = "Cutscene";
        typeText("[You and Jake are in a call mid-game.]", document.getElementById("dialogue"));
        showGunSkinsScreen();
        return;
    }
    if (line.speaker === "Cutscene" && line.text === "[You were studying at home in the afternoon.]") {
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
    if (dialogueLines[currentLine]?.text === "[You alight the train. You scan the crowd and spot a man in the distance. He looks around 30.]") {
        const trainStationScreen = document.getElementById("train-station-screen");
        trainStationScreen.style.opacity = 0;
        trainStationScreen.style.display = "block";

        setTimeout(() => {
            trainStationScreen.style.transition = "opacity 1s ease-in-out";
            trainStationScreen.style.opacity = 1;
        }, 100);
    }



    const speakerName = line.speaker.toLowerCase();
    // Only show for Jake-related dialogue
    if (currentLine < dialogueLines.length) {
        const line = dialogueLines[currentLine];
        const speakerName = line.speaker.toLowerCase();
        
        // Explicitly hide for Mom & Cutscene conversations
        if (speakerName.includes("Mom") || speakerName.includes("Cutscene")) {
        hideRelationshipBar();
        }
        // Show for Jake conversations (speaking or being spoken to)
        else if (speakerName.includes("@jake") || 
                line.speaker.includes("Jake") || 
                (isJakeChapter && speakerName.includes("@y/n"))) {
            relationshipBar.style.display = "flex";
            if (relationshipBar.innerHTML.trim() === "") {
                initRelationshipBar();
            }
        }
        // Default hide for other cases
        else {
            relationshipBar.style.display = "none";
        }
    }

        document.querySelector(".name-tag").innerText = line.speaker
    .replace("@y/n", "@" + playerName.toLowerCase())
    .replace("Y/N", capitalizeName(playerName));
        const processedText = line.text
        .replace("@y/n", "@" + playerName)
        .replace(/Y\/N/g, capitalizeName(playerName));
        typeText(processedText, document.getElementById("dialogue"));


    // Detect ending triggers
    const isLastLineOfBlackmailEnding = line.text === "Too late now, isn't it?";
    const isLastLineOfRiskyEscape = line.text === "What?! I'm blocking you.";
    const isLastLineOfSafeEnding = line.text === "Maybe it was for the better.";
    const isLastLineOfMeetupEnding = line.text === "...";
    const isLastLineOfParentIntervention = line.text === "Alright, Y/N. It sounds like he doesn't have good intentions. Let's sit down and talk about this, okay?";

    // Set flag if this is the final line before end screen
    isFinalLineBeforeEnd = isLastLineOfBlackmailEnding || isLastLineOfRiskyEscape || 
        isLastLineOfSafeEnding || isLastLineOfMeetupEnding || 
        isLastLineOfParentIntervention;

    // Set different delays for each ending type
    let endingDelay = 3000; // Default 3 seconds
    if (isLastLineOfBlackmailEnding || isLastLineOfRiskyEscape || isLastLineOfSafeEnding) {
        endingDelay = 2000; // 2 seconds
    } else if (isLastLineOfMeetupEnding) {
        endingDelay = 1000; // 1 second
    } else if (isLastLineOfParentIntervention) {
        endingDelay = 3000; // 3 seconds
    }

    // Trigger end screen after last line
    if (isFinalLineBeforeEnd) {
        // Disable the dialogue box
        document.querySelector(".dialogue-box").disabled = true;
        document.querySelector(".dialogue-box").style.pointerEvents = "none";
        
        setTimeout(fadeOutAndShowEndScreen, endingDelay); // Use the calculated delay
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

    if (line.text === "Oh, you know, I usually just chill after school. What school are you from?") {
        //isJakeChapter = true//
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

    if (line.text === "You know you can tell me anything, right? I’m here for you.") {
    document.getElementById("choice-box").style.display = "flex";
    document.getElementById("choice-box").innerHTML = `
        <button class="choice-button" onclick="chooseConfideOption(true)">I’ve been really stressed with my studies lately.</button>
        <button class="choice-button" onclick="chooseConfideOption(false)">It’s nothing, really.</button>
    `;
    document.querySelector(".dialogue-box").disabled = true;
    choiceLocked = true;
    return;
    }

    if (line.text === "I work part-time a lot, haha. So, want it or nah?") {
    document.getElementById("choice-box").style.display = "flex";
    document.getElementById("choice-box").innerHTML = `
        <button class="choice-button" onclick="chooseGiftOption(true)">I mean… sure, it’s just a lot to accept, you know?</button>
        <button class="choice-button" onclick="chooseGiftOption(false)">I’m fine with my battlepass skins, really…</button>
    `;
    document.querySelector(".dialogue-box").disabled = true;
    choiceLocked = true;
    return;
    }

    if (line.text === "Yeah, I could try. Wanna video call? It’d be way easier to explain stuff.") {
        document.getElementById("choice-box").style.display = "flex";
        document.getElementById("choice-box").innerHTML = `
            <button class="choice-button" onclick="chooseVideoCallOption(true)">I guess I could do a quick one.</button>
            <button class="choice-button" onclick="chooseVideoCallOption(false)">Nah, too troublesome.</button>
        `;
        document.querySelector(".dialogue-box").disabled = true;
        choiceLocked = true;
        return;
    }

    if (line.text === "Oh, don't deny it. Send me one back. I’m really in the mood RN.") {
    document.getElementById("choice-box").style.display = "flex";
    document.getElementById("choice-box").innerHTML = `
        <button class="choice-button" onclick="chooseImageOption(true)">Give me a sec… Don’t get your hopes up.</button>
        <button class="choice-button" onclick="chooseImageOption(false)">I’m not comfortable with that…</button>
    `;
    document.querySelector(".dialogue-box").disabled = true;
    choiceLocked = true;
    return;
    }
    
    if (line.text === "You know, I’m always here for you. Anything you wanna talk about?") {
    document.getElementById("choice-box").style.display = "flex";
    document.getElementById("choice-box").innerHTML = `
        <button class="choice-button" onclick="chooseMomRevealOption(true)">Yeah. I think I actually do want to talk…</button>
        <button class="choice-button" onclick="chooseMomRevealOption(false)">Nah... all's good for now.</button>
    `;
    document.querySelector(".dialogue-box").disabled = true;
    choiceLocked = true;
    return;
    }

    if (line.text === "Wanna meet up sometime? I’ll treat you to lunch." ||
    line.text === "Really? Prove it then. Let’s meet up for lunch, I’ll pay.") {
    
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
    // Fade out current elements
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
    document.querySelector(".name-tag").innerText = line.speaker.replace("@y/n", "@" + playerName);
    const processedText = line.text
    .replace("@y/n", "@" + playerName)
    .replace(/Y\/N/g, capitalizeName(playerName));
    typeText(processedText, document.getElementById("dialogue"));
}

function showSummaryScreen() {
    selectSFX.play();
    // Hide the end screen
    document.getElementById("end-screen").style.display = "none";
    
    // Update checkboxes based on player choices
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
    
    // Show the summary screen
    const summaryScreen = document.getElementById("summary-screen");
    summaryScreen.style.display = "flex";

    document.getElementById("summary-screen").style.display = "flex";
    document.getElementById("to-summary-button").style.display = "none"; // hide from end-screen

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
        // Lower the z-index so dialogue appears on top
        livestreamScreen.style.zIndex = "0";
        document.removeEventListener("click", onClick);

        dialogueContainer.style.display = "flex";
        document.querySelector(".name-tag").innerText = dialogueLines[0].speaker;
        typeText(dialogueLines[0].text, document.getElementById("dialogue"));
        relationshipBar = document.getElementById("relationship-bar");
    }

    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('choice-button')) {
            hoverSFX.currentTime = 0;
            hoverSFX.play();
        }
    });
});
