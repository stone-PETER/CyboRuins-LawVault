document.addEventListener("DOMContentLoaded", fetchEvidence);

function fetchEvidence() {
    const evidenceList = document.getElementById("evidence-list");
    
    const evidenceData = [
        { id: 1, name: "Fingerprint Scan", type: "image", date: "2025-02-25" },
        { id: 2, name: "CCTV Footage", type: "video", date: "2025-02-24" }
    ];
    evidenceList.innerHTML = evidenceData.map(ev => 
        `<div class="evidence-item">
            <h3>${ev.name}</h3>
            <p>Type: ${ev.type}</p>
            <p>Date: ${ev.date}</p>
        </div>`).join('');
}

function openUploadModal() {
    document.getElementById("upload-modal").style.display = "block";
}

function uploadEvidence() {
    alert("File uploaded! (Mock Function)");
    document.getElementById("upload-modal").style.display = "none";
}
