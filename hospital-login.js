import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://bzrxpejjfzlecpugylqx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6cnhwZWpqZnpsZWNwdWd5bHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNTkxNjksImV4cCI6MjA4NDgzNTE2OX0.tS3GgxA5L969XGQK9Uw4qxTcqco1Y2iytoKcfos0DNU";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.querySelector("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  // 1️⃣ Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  const userId = data.user.id;

  // 2️⃣ Check hospital verification
  const { data: hospital, error: dbError } = await supabase
    .from("hospitals")
    .select("verified")
    .eq("id", userId)
    .single();

  if (dbError) {
    alert("Hospital profile not found.");
    return;
  }

  // 3️⃣ Block unverified hospitals
  if (!hospital.verified) {
    alert("Your hospital is not verified yet. Please wait for admin approval.");
    return;
  }

  // 4️⃣ Redirect verified hospitals
  window.location.href = `hospital.html?id=${userId}`;
});
