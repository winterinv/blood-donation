import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://bzrxpejjfzlecpugylqx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6cnhwZWpqZnpsZWNwdWd5bHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNTkxNjksImV4cCI6MjA4NDgzNTE2OX0.tS3GgxA5L969XGQK9Uw4qxTcqco1Y2iytoKcfos0DNU";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


document.querySelector("#hospitalForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const name = document.querySelector("#name").value;
  const city = document.querySelector("#city").value;
  const type = document.querySelector("#type").value;

  // 1️⃣ Create auth account
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  if (!data?.user) {
    alert("Registration failed. Please try again.");
    return;
  }

  // 2️⃣ Create hospital profile
  const { error: dbError } = await supabase.from("hospitals").insert({
    id: data.user.id,
    name,
    city,
    type
  });

  if (dbError) {
    alert(dbError.message);
    return;
  }

  alert("Hospital Registered! Waiting for verification.");
  window.location.href = "hospital-login.html";
});
