const supabase = window.supabaseClient;

window.addEventListener("DOMContentLoaded", async () => {
  const pathParts = window.location.pathname.split("/");
  const targetUsername = pathParts[2]; // example: "Lightning-McChair"

  const usernameSpan = document.getElementById("username");
  const userIdSpan = document.getElementById("user-id");
  const followButton = document.getElementById("follow-button");
  const followStatus = document.getElementById("follow-status");

  if (!targetUsername) {
    alert("No username in path.");
    window.location.href = "/";
    return;
  }

  // Get the target user's ID
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", targetUsername)
    .single();

  if (profileError || !profile) {
    alert("User not found.");
    return;
  }

  usernameSpan.textContent = targetUsername;
  userIdSpan.textContent = profile.id;

  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;

  // Show Follow/Unfollow button if not your own profile
  if (currentUserId && currentUserId !== profile.id) {
    followButton.style.display = "inline-block";

    // Check if you're already following them
    let isFollowing = false;
    const { data: existingFollow } = await supabase
      .from("follows")
      .select("*")
      .eq("follower", currentUserId)
      .eq("followed", profile.id)
      .maybeSingle();

    if (existingFollow) {
      isFollowing = true;
      followStatus.textContent = "✅ You follow this user.";
      followButton.textContent = "Unfollow";
    } else {
      followButton.textContent = "Follow";
    }

    followButton.onclick = async () => {
      if (isFollowing) {
        // Unfollow
        const { error: deleteError } = await supabase
          .from("follows")
          .delete()
          .eq("follower", currentUserId)
          .eq("followed", profile.id);

        if (deleteError) {
          alert("Failed to unfollow: " + deleteError.message);
          return;
        }

        isFollowing = false;
        followStatus.textContent = "❌ You no longer follow this user.";
        followButton.textContent = "Follow";
      } else {
        // Follow
        const { error: insertError } = await supabase
          .from("follows")
          .insert({ follower: currentUserId, followed: profile.id });

        if (insertError) {
          alert("Failed to follow: " + insertError.message);
          return;
        }

        isFollowing = true;
        followStatus.textContent = "✅ You follow this user.";
        followButton.textContent = "Unfollow";
      }
    };
  }
  // Show follower count
  const { data: followers, error: followerError } = await supabase
    .from("follows")
    .select("follower")
    .eq("followed", profile.id);
  
  if (!followerError) {
    document.getElementById("follower-count").textContent = followers.length;
  }
  
  // Optional: Show following count
  const { data: following, error: followingError } = await supabase
    .from("follows")
    .select("followed")
    .eq("follower", profile.id);

  if (!followingError) {
    document.getElementById("following-count").textContent = following.length;
  }
});
