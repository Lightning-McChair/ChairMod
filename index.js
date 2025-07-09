// index.js
window.addEventListener("DOMContentLoaded", () => {
  const supabase = window.supabaseClient;

  const loginButton = document.getElementById("nav-login-button");
  const profileButton = document.getElementById("nav-profile-button");
  const signOutButton = document.getElementById("nav-signout-button");
  const loginContainer = document.getElementById("nav-login");
  const userActions = document.getElementById("nav-user-actions");
  const searchButton = document.getElementById("nav-search-button");
  const searchInput = document.getElementById("nav-search");

  supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (session) {
      loginContainer.style.display = "none";
      userActions.style.display = "flex";

      // Ensure profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (!existingProfile && !fetchError) {
        const defaultUsername = `user_${session.user.id.substring(0, 8)}`;
        await supabase.from("profiles").insert([
          { id: session.user.id, username: defaultUsername, email: session.user.email }
        ]);
        profileButton.onclick = () => {
          window.location.href = `/users/${defaultUsername}`;
        };
      } else if (existingProfile?.username) {
        profileButton.onclick = () => {
          window.location.href = `/users/${existingProfile.username}`;
        };
      }
    }
  });

  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("nav-login-email").value.trim();
    const password = document.getElementById("nav-login-password").value.trim();
    if (!email || !password) {
      alert("Please fill out both fields.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Login failed: " + error.message);
      return;
    }
    alert("✅ Logged in successfully!");
    window.location.reload();
  });

  signOutButton.addEventListener("click", async () => {
    await supabase.auth.signOut();
    alert("👋 Signed out.");
    location.reload();
  });

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) window.location.href = `/users/${encodeURIComponent(query)}`;
  });
});

// signup.js
window.addEventListener("DOMContentLoaded", () => {
  const supabase = window.supabaseClient;
  const signupForm = document.getElementById("signup-form");

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
        await supabase.from("profiles").insert([{ id: userId, username, email }]);
      }
    });
  }
});
