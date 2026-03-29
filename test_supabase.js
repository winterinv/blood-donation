const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  "https://bzrxpejjfzlecpugylqx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6cnhwZWpqZnpsZWNwdWd5bHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNTkxNjksImV4cCI6MjA4NDgzNTE2OX0.tS3GgxA5L969XGQK9Uw4qxTcqco1Y2iytoKcfos0DNU"
);

async function run() {
  const requesterId = "f5c0a3f9-a4df-4576-8657-43288a574189";
  const bloodGroup = "A+";
  const requiredUnits = 5;
  const { data: reqInv, error: readErr } = await supabase.from("inventory").select("units").eq("hospital_id", requesterId).eq("blood_group", bloodGroup).maybeSingle();
  console.log("Read:", reqInv, readErr);

  if (reqInv) {
    const { data: updData, error: updErr } = await supabase.from("inventory").update({ units: reqInv.units + requiredUnits }).eq("hospital_id", requesterId).eq("blood_group", bloodGroup).select();
    console.log("Update:", updData, updErr);
  } else {
    const { data: insData, error: insErr } = await supabase.from("inventory").insert({ hospital_id: requesterId, blood_group: bloodGroup, units: requiredUnits }).select();
    console.log("Insert:", insData, insErr);
  }
}
run();
