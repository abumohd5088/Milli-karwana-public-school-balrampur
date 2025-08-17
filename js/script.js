// script.js
const API_KEY = "AIzaSyCdzFBQ1KVgBfmmjSgHJJwcuLbqne9VjUs";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

function lockName() {
    const name = document.getElementById("studentName").value.trim();
    const cls = document.getElementById("studentClass").value;
    if (!name || !cls) return alert("Fill all fields");

    localStorage.setItem("studentName", name);
    localStorage.setItem("studentClass", cls);
    loadDashboard();
}

function loadDashboard() {
    document.getElementById("nameSection").classList.add("hidden");
    document.getElementById("dashboardSection").classList.remove("hidden");
    document.getElementById("displayName").innerText = localStorage.getItem("studentName");
    document.getElementById("displayClass").innerText = localStorage.getItem("studentClass");
}

function logout() {
    localStorage.clear();
    location.reload();
}

function openChat() {
    document.getElementById("chatBox").classList.toggle("hidden");
}

async function askAI() {
    const input = document.getElementById("chatInput").value;
    const cls = localStorage.getItem("studentClass");
    const prompt = `You are a helpful school assistant. The student is in class ${cls}. Answer in short and friendly tone: ${input}`;

    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response.";
    document.getElementById("chatOutput").innerHTML = `<p><strong>AI:</strong> ${reply}</p>`;
}

function goAdmin() {
    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("adminSection").classList.remove("hidden");
}

function checkAdmin() {
    const pass = document.getElementById("adminPass").value;
    if (pass === "Abutalha") {
        document.getElementById("adminData").innerHTML = `<p>Admin logged in. No data yet.</p>`;
    } else {
        alert("Wrong password");
    }
}

window.onload = () => {
    if (localStorage.getItem("studentName")) loadDashboard();
};
