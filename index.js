// index.js
window.addEventListener("DOMContentLoaded", () => {
  const supabase = window.supabaseClient;

  const loginButton = document.getElementById("nav-login-button");
  if (!loginButton) {
    console.error("❌ Login button not found in DOM.");
    return;
  }

  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("nav-login-email").value.trim();
    const password = document.getElementById("nav-login-password").value.trim();

    if (!email || !password) {
      alert("Please fill out both fields.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Logged in successfully!");
    // Optionally, redirect to a profile page
  });
});