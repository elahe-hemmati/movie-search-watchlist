let activeToast = null;
let toastTimeout = null;

function showToast(message, type = "info", duration = 2000) {
  const container = document.getElementById("toast");
  if (!container) return;

  if (activeToast) {
    clearTimeout(toastTimeout);
    activeToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  activeToast = toast;

  toastTimeout = setTimeout(() => {
    toast.remove();
    if (activeToast === toast) {
      activeToast = null;
      toastTimeout = null;
    }
  }, duration);
}