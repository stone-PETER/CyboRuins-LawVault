function analyzeVerdict() {
    const score = Math.floor(Math.random() * 100);
    document.getElementById("score").innerText = score;
    document.getElementById("bias-text").innerText = 
        score > 70 ? "Verdict seems fair!" : "Potential bias detected!";
    document.getElementById("upload-modal").style.display = "none";
}
