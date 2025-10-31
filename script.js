// script.js — Universal Hash Generator with Auto-Detect Feature
document.addEventListener("DOMContentLoaded", async () => {
  const algoSelect = document.getElementById("algoSelect");
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const copyBtn = document.getElementById("copyBtn");
  const clearBtn = document.getElementById("clearBtn");
  const copyMsg = document.getElementById("copyMsg");
  const detectMsg = document.getElementById("detectMsg");
  const yearEl = document.getElementById("year");
  const menuToggle = document.getElementById("menuToggle");
  const navList = document.querySelector(".nav-list");

  // Set current year
  yearEl.textContent = new Date().getFullYear();

  // Load CryptoJS dynamically
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  // Hash function switcher
  const hashText = (algo, text) => {
    switch (algo) {
      case "MD5": return CryptoJS.MD5(text).toString();
      case "SHA1": return CryptoJS.SHA1(text).toString();
      case "SHA256": return CryptoJS.SHA256(text).toString();
      case "SHA512": return CryptoJS.SHA512(text).toString();
      default: return "";
    }
  };

  // Auto-detect hash type based on length
  const detectHashType = (value) => {
    const hexOnly = /^[a-f0-9]+$/i.test(value);
    if (!hexOnly) return null;

    switch (value.length) {
      case 32: return "MD5";
      case 40: return "SHA1";
      case 64: return "SHA256";
      case 128: return "SHA512";
      default: return null;
    }
  };

  // Update hash output
  const updateHash = () => {
    const val = inputText.value.trim();
    const algo = algoSelect.value;
    detectMsg.style.display = "none";
    outputText.value = val ? hashText(algo, val) : "";
  };

  // Listen for typing and algorithm changes
  inputText.addEventListener("input", updateHash);
  algoSelect.addEventListener("change", updateHash);

  // Detect pasted hash
  inputText.addEventListener("paste", (e) => {
    setTimeout(() => {
      const pastedValue = inputText.value.trim();
      const detected = detectHashType(pastedValue);
      if (detected) {
        algoSelect.value = detected;
        detectMsg.textContent = `Detected hash type: ${detected}`;
        detectMsg.style.display = "block";
      } else {
        detectMsg.style.display = "none";
      }
    }, 100);
  });

  // Copy hash
  copyBtn.addEventListener("click", async () => {
    if (!outputText.value.trim()) return;
    try {
      await navigator.clipboard.writeText(outputText.value);
      copyMsg.textContent = "Copied to clipboard!";
      copyMsg.style.display = "block";
      setTimeout(() => (copyMsg.style.display = "none"), 2000);
    } catch {
      outputText.select();
      document.execCommand("copy");
    }
  });

  // Clear fields
  clearBtn.addEventListener("click", () => {
    inputText.value = "";
    outputText.value = "";
    detectMsg.style.display = "none";
    copyMsg.style.display = "none";
  });

  // Responsive nav
  menuToggle.addEventListener("click", () => {
    const isOpen = navList.style.display === "flex";
    navList.style.display = isOpen ? "none" : "flex";
  });

  document.querySelectorAll(".nav-list a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 900) navList.style.display = "none";
    });
  });
});
