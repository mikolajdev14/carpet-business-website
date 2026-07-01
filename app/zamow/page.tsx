import { createClientServer } from "@/lib/supabase/server";
import { RugCard } from "./rug-card";

export default async function ZamowPage() {
  const supabase = await createClientServer();
  const { data: rugTypes, error } = await supabase
    .from("rug_types")
    .select("*")
    .eq("is_active", true);
  console.log("rugtypes: ", rugTypes, "error: ", error);
  return (
    <div>
      {rugTypes?.map((rug) => (
        <RugCard
          key={rug.id}
          id={rug.id}
          name={rug.name}
          description={rug.description}
          leadDays={rug.lead_time_days}
          imgUrl="porshe.png"
        />
      ))}
    </div>
  );
}
