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

      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        alert("Signup failed: " + signUpError.message);
        return;
      }

      const userId = data?.user?.id;
      if (!userId) {
        alert("Signup failed: user ID not returned.");
        return;
      }

      // Insert profile row in 'users' table
      const { error: profileError } = await supabase
        .from("users")
        .insert([
          {
            id: userId,
            username: username,
            about_me: "",   // empty for now
            role: "",       // empty for now
            // created_at will default to now()
            // avatar_url will default to your DB default later
          },
        ]);

      if (profileError) {
        alert("Failed to create user profile: " + profileError.message);
        return;
      }

      alert("✅ Signup successful! Check your email for confirmation.");
      // Optionally, redirect or reset the form here
      signupForm.reset();
    });
  }
});
