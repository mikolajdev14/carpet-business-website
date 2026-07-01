"use client";

import { useState } from "react";
import { use } from "react";
import { SizePicker } from "./size-picker";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [booking, setBooking] = useState({
    rugTypeId: id,
    pickedSize: 1,
    pickupDate: null,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerNotes: "",
  });
  console.log(id);

  return (
    <div>
      <SizePicker id={id} />
    </div>
  );
}
