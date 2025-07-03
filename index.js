window.addEventListener("DOMContentLoaded", () => {
  const supabase = window.supabaseClient;

  // Login button handler
  const loginButton = document.getElementById("nav-login-button");
  if (loginButton) {
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
      updateNavbar(); // Update UI after login
    });
  } else {
    console.error("❌ Login button not found.");
  }

  // UI update and sign out logic
  async function updateNavbar() {
    const { data: { session } } = await supabase.auth.getSession();

    const navLogin = document.getElementById("nav-login");
    const navUserActions = document.getElementById("nav-user-actions");
    const profileBtn = document.getElementById("nav-profile-button");
    const signOutBtn = document.getElementById("nav-signout-button");

    if (session) {
      navLogin.style.display = "none";
      navUserActions.style.display = "flex";

      profileBtn.onclick = () => {
        window.location.href = "/profile.html"; // Change if needed
      };

      signOutBtn.onclick = async () => {
        await supabase.auth.signOut();
        updateNavbar();
      };
    } else {
      navLogin.style.display = "flex";
      navUserActions.style.display = "none";
    }
  }

  // Run on page load
  updateNavbar();

  // Listen for auth changes (optional)
  supabase.auth.onAuthStateChange(() => {
    updateNavbar();
  });
});
