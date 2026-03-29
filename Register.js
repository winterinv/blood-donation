// ===============================
// Supabase Config
// ===============================
const SUPABASE_URL = "https://bzrxpejjfzlecpugylqx.supabase.co";
const SUPABASE_KEY = "sb_publishable_2JII5deMfSZlnkTE7FUphQ_JuA3iw9d";

// ===============================
// Password Strength Logic (Safe)
// ===============================
const passwordInput = document.querySelector("#password_data");

if (passwordInput) {
  passwordInput.addEventListener("keyup", () => {
    let password = passwordInput.value;

    var strongRegex = new RegExp(
      "^(?=.{14,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$",
      "g"
    );
    var mediumRegex = new RegExp(
      "^(?=.{10,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$",
      "g"
    );

    const safety = document.querySelector(".safety");
    if (!safety) return;

    if (password.length === 0) {
      safety.innerHTML = "Enter Password";
    } else {
      safety.innerHTML =
        '<span>Password Strength</span>' +
        '<span class="line" id="line1"></span>' +
        '<span class="line" id="line2"></span>' +
        '<span class="line" id="line3"></span>';
    }

    if (strongRegex.test(password)) {
      document.querySelector("#line1").style.background = "green";
      document.querySelector("#line2").style.background = "green";
      document.querySelector("#line3").style.background = "green";
    } else if (mediumRegex.test(password)) {
      document.querySelector("#line1").style.background = "yellow";
      document.querySelector("#line2").style.background = "yellow";
    } else {
      document.querySelector("#line1").style.background = "red";
    }
  });
}

// ===================================
// Donor Registration (Supabase Backend)
// ===================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#donorForm");

  if (!form) {
    console.log("Donor form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name")?.value;
    const blood_group = document.querySelector("#blood")?.value;
    const city = document.querySelector("#city")?.value;
    const phone = document.querySelector("#phone")?.value;

    if (!name || !blood_group || !city || !phone) {
      alert("Please fill all donor fields");
      return;
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/donors`,
        {
          method: "POST",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
          },
          body: JSON.stringify({
            name: name,
            blood_group: blood_group,
            city: city,
            phone: phone
          })
        }
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      alert("Donor registered in cloud database \ud83d\ude80");
      form.reset();
    } catch (err) {
      console.error("Supabase error:", err);
      alert("Could not connect to Supabase:\n" + err.message);
    }
  });
});
