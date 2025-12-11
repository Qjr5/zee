let users = {
    "a": "admin",
    "z": "viewer"
};

let score = parseInt(localStorage.getItem("score") || "0");
let pfp = localStorage.getItem("pfp") || "default.png";

function login() {
    let u = document.getElementById("user").value.trim();

    if (!users[u]) {
        document.getElementById("msg").innerText = "You are not welcome.";
        return;
    }
    localStorage.setItem("role", users[u]);
    
    if (users[u] === "viewer") {
        localStorage.setItem("showHeartsOnLoad", "true");
    }
    
    window.location = "index.html";
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        login();
    }
}

function loadDashboard() {
    let role = localStorage.getItem("role");
    
    if (!role) {
        window.location = "login.html";
        return;
    }

    let scoreText = document.getElementById("scoreText");
    let fg = document.querySelector(".fg");
    let welcome = document.getElementById("welcome");
    let profile = document.getElementById("profile");
    let logoutBtn = document.getElementById("logoutBtn");
    let adminMessage = document.getElementById("adminMessage");
    let messageDisplay = document.getElementById("messageDisplay");

    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (profile) profile.src = pfp;
    if (welcome) welcome.innerText = role === "admin" ? "Welcome Admin" : "Welcome";

    updateScoreDisplay();

    if (role === "admin") {
        let adminPanel = document.getElementById("adminPanel");
        if (adminPanel) adminPanel.style.display = "block";
        
        let existingMsg = localStorage.getItem("adminMsg") || "";
        let msgInput = document.getElementById("msgInput");
        if (msgInput) msgInput.value = existingMsg;
    }
    
    if (role === "viewer") {
        let msg = localStorage.getItem("adminMsg");
        if (msg && messageDisplay) {
            messageDisplay.innerText = msg;
            messageDisplay.style.display = "block";
        }
        
        if (localStorage.getItem("showHeartsOnLoad") === "true") {
            localStorage.removeItem("showHeartsOnLoad");
            setTimeout(() => {
                createHearts();
            }, 300);
        }
    }
}

function updateScoreDisplay() {
    let scoreText = document.getElementById("scoreText");
    let fg = document.querySelector(".fg");
    
    if (scoreText) scoreText.innerText = score + " / 10";
    if (fg) fg.style.strokeDashoffset = 377 - (score / 10) * 377;
}

function addScore() {
    if (score < 10) {
        score++;
        save();
        createHearts();
        pulseScore();
    }
}

function subScore() {
    if (score > 0) {
        score--;
        save();
    }
}

function save() {
    localStorage.setItem("score", score);
    updateScoreDisplay();
}

function sendMessage() {
    let msgInput = document.getElementById("msgInput");
    if (msgInput) {
        let msg = msgInput.value.trim();
        localStorage.setItem("adminMsg", msg);
        showNotification("Message sent!");
    }
}

function showNotification(text) {
    let notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = text;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 1500);
}

function createHearts() {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            let heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '❤️';
            heart.style.left = (Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2) + 'px';
            heart.style.top = (Math.random() * 200 + 300) + 'px';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 1500);
        }, i * 100);
    }
}

function pulseScore() {
    let container = document.querySelector('.ring-container');
    if (container) {
        container.classList.add('score-pulse');
        setTimeout(() => {
            container.classList.remove('score-pulse');
        }, 400);
    }
}

function uploadPfp() {
    let file = document.getElementById("pfpUpload").files[0];
    if (!file) return;
    
    let reader = new FileReader();
    reader.onload = function(e) {
        pfp = e.target.result;
        localStorage.setItem("pfp", pfp);
        let profile = document.getElementById("profile");
        if (profile) {
            profile.src = pfp;
            profile.classList.add('score-pulse');
            setTimeout(() => {
                profile.classList.remove('score-pulse');
            }, 400);
        }
    };
    reader.readAsDataURL(file);
}

function logout() {
    localStorage.removeItem("role");
    window.location = "login.html";
}
