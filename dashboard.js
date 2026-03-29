const SUPABASE_URL = "https://bzrxpejjfzlecpugylqx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6cnhwZWpqZnpsZWNwdWd5bHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNTkxNjksImV4cCI6MjA4NDgzNTE2OX0.tS3GgxA5L969XGQK9Uw4qxTcqco1Y2iytoKcfos0DNU";


const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const table = document.querySelector("#board tbody");

async function loadBoard() {
  table.innerHTML = "";

  const { data: hospitals, error } = await supabase
    .from("hospitals")
    .select("*");

  if (error) {
    alert(error.message);
    return;
  }

  for (const hospital of hospitals) {
    const { data: stock } = await supabase
      .from("inventory")
      .select("*")
      .eq("hospital_id", hospital.id);

    const row = document.createElement("tr");

    function getUnits(bg) {
      if (!stock || stock.length === 0) return 0;
      const item = stock.find(s => s.blood_group === bg);
      return item ? item.units : 0;
    }

    const status =
      getUnits("A+") === 0 ||
        getUnits("B+") === 0 ||
        getUnits("O+") === 0
        ? "LOW"
        : "OK";

    row.innerHTML = `
      <td>${hospital.name}</td>
      <td>${getUnits("A+")}</td>
      <td>${getUnits("B+")}</td>
      <td>${getUnits("O+")}</td>
      <td>${getUnits("AB+")}</td>
      <td style="color:${status === "LOW" ? "red" : "lime"}">
        ${status}
      </td>
    `;

    table.appendChild(row);
  }
}

loadBoard();
setInterval(loadBoard, 5000);
