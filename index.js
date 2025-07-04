window.addEventListener("DOMContentLoaded", () => {
  const supabase = window.supabaseClient;

  const loginButton = document.getElementById("nav-login-button");
  const profileButton = document.getElementById("nav-profile-button");
  const signOutButton = document.getElementById("nav-signout-button");
  const loginContainer = document.getElementById("nav-login");
  const userActions = document.getElementById("nav-user-actions");

  // Auto-show correct buttons on load
  supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (session) {
      loginContainer.style.display = "none";
      userActions.style.display = "flex";

      // Load username
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (profile?.username) {
        profileButton.onclick = () => {
          window.location.href = `/users/${profile.username}`;
        };
      }
    }
  });

  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const username = document.getElementById("nav-login-username").value.trim();
    const password = document.getElementById("nav-login-password").value.trim();

    if (!username || !password) {
      alert("Please fill out both fields.");
      return;
    }

    // Look up email from profiles table
    const { data: userRecord, error: userError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("username", username)
      .single();

    if (userError || !userRecord?.email) {
      alert("Username not found.");
      return;
    }

    // Sign in using email
    const { error } = await supabase.auth.signInWithPassword({
      email: userRecord.email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
      return;
    }

    alert("✅ Logged in successfully!");
    window.location.href = `/users/${username}`;
  });

  signOutButton.addEventListener("click", async () => {
    await supabase.auth.signOut();
    alert("👋 Signed out.");
    location.reload();
  });
});
