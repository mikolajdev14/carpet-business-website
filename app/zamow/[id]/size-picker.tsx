"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export const SizePicker = ({ id }: { id: string }) => {
  const [sizes, setSizes] = useState<{ rug_sizes: any[] } | null>(null);

  useEffect(() => {
    const fetchSizes = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("rug_types")
        .select("rug_sizes(*)")
        .eq("id", id)
        .single();
      setSizes(data);
      console.log("data: ", data?.rug_sizes, "error: ", error);
    };
    fetchSizes();
  }, [id]);

  console.log(sizes);
  return (
    <div>
      <select name="size" id="">
        {sizes?.rug_sizes.map((size) => (
          <option key={size.id} value={size.label}>
            {size.label}
          </option>
        ))}
      </select>
    </div>
  );
};
