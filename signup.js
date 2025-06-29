// signup.js
window.addEventListener("DOMContentLoaded", () => {
  const supabase = window.supabaseClient;

  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !username || !password) {
        alert("Please fill out all fields.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.message);
        return;
      }

      alert("✅ Check your email for confirmation!");
      const userId = data?.user?.id;

      if (userId) {
        await supabase.from("users").insert([{ id: userId, username }]);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

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
    });
  }
});