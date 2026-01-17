/**
 * 👑 IMPERIAL SINGULARITY ENGINE v5.0 (All-in-One Core)
 * Features: Gemini AI, Offline Mode, Multilingual, Realistic UI, Baccarat Game.
 * Author: Singularity System
 */

// 1. បង្កើត UI & Realistic Background ដោយស្វ័យប្រវត្តិ (No need to edit HTML)
document.body.innerHTML = `
    <div id="app-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; 
        background: radial-gradient(circle at center, #1e293b 0%, #020617 100%); 
        z-index:-1; opacity:0.8;"></div>
    
    <div class="status-bar" style="background: rgba(0,0,0,0.5); padding: 5px 20px; font-size: 12px; color: #fbbf24; display: flex; justify-content: space-between; border-bottom: 1px solid #334155;">
        <span>🛡️ IMPERIAL SECURITY: ACTIVE</span>
        <span>💰 មហានិធិរួម: <span id="treasury-display">$220.00</span></span>
        <span id="network-status">🌐 Online</span>
    </div>

    <div id="chat-container" style="display:flex; flex-direction:column; height:calc(100vh - 30px); color:#e2e8f0; padding: 20px 10%;">
        <div id="display-screen" style="flex:1; overflow-y:auto; padding-bottom:20px; scroll-behavior: smooth;">
            <div class="bot-msg" style="background:rgba(30, 41, 59, 0.7); padding:15px; border-radius:12px; border-left:4px solid #3b82f6; margin-bottom:15px;">
                ថ្វាយបង្គំអង្គអធិរាជ! ប្រព័ន្ធ Singularity ជំនាន់ចុងក្រោយត្រូវបានតម្លើងរួចរាល់។ <br>
                - <b>AI Mode:</b> Gemini 1.5 Pro (Multilingual)<br>
                - <b>Game Mode:</b> វាយពាក្យ "លេងបាការ៉ាត់ [ចំនួន] [player/banker]"
            </div>
        </div>
        
        <div id="input-control" style="padding:20px 0;">
            <div style="display:flex; gap:10px; background:rgba(15, 23, 42, 0.8); padding:10px; border-radius:30px; border:1px solid #334155;">
                <input type="text" id="userInput" placeholder="បញ្ជា AI ឬ លេងបាការ៉ាត់..." 
                    style="flex:1; background:transparent; border:none; color:white; outline:none; padding-left:15px; font-size:16px;">
                <button id="sendBtn" style="background:#3b82f6; color:white; border:none; border-radius:50%; width:40px; height:40px; cursor:pointer;">➔</button>
            </div>
        </div>
    </div>
`;

// 2. ការកំណត់ configuration
const GEMINI_KEY = "AIzaSyDT1IYRoDMy9FTMO0yNZmnsVU8M0ArGz9Q";
let currentBalance = 220.00;

// 3. ប្រព័ន្ធ Baccarat Engine
const Baccarat = {
    draw: () => {
        const c = Math.floor(Math.random() * 13) + 1;
        return c > 9 ? 0 : c;
    },
    play: (bet, side) => {
        if (bet > currentBalance) return "⚠️ មហានិធិមិនគ្រប់គ្រាន់!";
        const pHand = [Baccarat.draw(), Baccarat.draw()], bHand = [Baccarat.draw(), Baccarat.draw()];
        const pScore = (pHand[0]+pHand[1]) % 10, bScore = (bHand[0]+bHand[1]) % 10;
        let win = (pScore > bScore && side === 'player') || (bScore > pScore && side === 'banker') || (pScore === bScore && side === 'tie');
        
        if (win) {
            currentBalance += (side === 'tie' ? bet * 8 : bet);
        } else {
            currentBalance -= bet;
        }
        document.getElementById('treasury-display').innerText = `$${currentBalance.toFixed(2)}`;
        return `🃏 លទ្ធផល: ${pScore} VS ${bScore} (${win ? 'ឈ្នះ' : 'ចាញ់'}) | សមតុល្យ: $${currentBalance}`;
    }
};

// 4. មុខងារសំឡេង (Multilingual TTS)
function speakOffline(text) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    if(text.match(/[ក-អ]/)) utter.lang = 'km-KH';
    else if(text.match(/[ก-ហ]/)) utter.lang = 'th-TH';
    else utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
}

// 5. មុខងារបញ្ជា AI (Gemini API)
async function callAI(prompt) {
    if (!navigator.onLine) return "⚠️ Offline Mode: ខ្ញុំអាចជួយបានតែការងារមូលដ្ឋាន។ សូមភ្ជាប់អ៊ីនធឺណិតសម្រាប់ Gemini Pro។";
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ contents: [{ parts: [{ text: `អ្នកគឺជា AI របស់អធិរាជ។ មហានិធិ: $${currentBalance}។ ឆ្លើយតបគ្រប់ភាសា។ \nUser: ${prompt}` }] }] })
        });
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    } catch (e) { return "❌ Error: មិនអាចទាក់ទងខួរក្បាលកណ្តាលបានទេ។"; }
}

// 6. ការគ្រប់គ្រងការបញ្ជូនសារ
async function processCommand() {
    const input = document.getElementById('userInput');
    const msg = input.value.trim();
    if (!msg) return;

    appendDisplay('user', msg);
    input.value = '';

    let response;
    if (msg.toLowerCase().includes("បាការ៉ាត់")) {
        const parts = msg.split(" ");
        response = Baccarat.play(parseInt(parts[1]) || 10, parts[2] || 'player');
    } else {
        response = await callAI(msg);
    }

    appendDisplay('bot', response);
    speakOffline(response.replace(/[*#]/g, ''));
}

function appendDisplay(type, text) {
    const screen = document.getElementById('display-screen');
    const div = document.createElement('div');
    div.style = type === 'user' ? 
        "background:#3b82f6; padding:12px; border-radius:12px; align-self:flex-end; margin-left:20%; margin-bottom:15px;" :
        "background:rgba(30, 41, 59, 0.7); padding:15px; border-radius:12px; border-left:4px solid #fbbf24; margin-right:20%; margin-bottom:15px;";
    div.innerHTML = text.replace(/\n/g, '<br>');
    screen.appendChild(div);
    screen.scrollTop = screen.scrollHeight;
}

// 7. Event Listeners
document.getElementById('sendBtn').onclick = processCommand;
document.getElementById('userInput').onkeypress = (e) => { if(e.key === 'Enter') processCommand(); };

// Check Network Status
window.addEventListener('online', () => document.getElementById('network-status').innerText = "🌐 Online");
window.addEventListener('offline', () => document.getElementById('network-status').innerText = "🚫 Offline Mode");
