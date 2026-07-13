"use server";

import { bookingSchema } from "@/schema/booking";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createCheckoutSession(input: unknown) {
  const result = bookingSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Nieprawidłowe dane.",
    };
  }

  const booking = result.data;
  const supabase = createAdminClient();

  const { data: rugType, error: rugTypeError } = await supabase
    .from("rug_types")
    .select("id, name")
    .eq("id", Number(booking.rugTypeId))
    .single();

  if (rugTypeError || !rugType) {
    return { success: false, message: "Nie znaleziono typu dywanu." };
  }

  const { data: size, error } = await supabase
    .from("rug_sizes")
    .select("id, label, price_cents")
    .eq("id", booking.pickedSize)
    .single();

  if (error || !size) {
    return { success: false, message: "Nie znaleziono rozmiaru." };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: booking.customerEmail,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/zamow/sukces?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/zamow/anulowano`,
    line_items: [
      {
        price_data: {
          currency: "pln",
          unit_amount: Number(size.price_cents),
          product_data: {
            name: `${rugType.name} - ${size.label}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      rugTypeId: booking.rugTypeId,
      rugTypeName: rugType.name,
      pickedSize: String(booking.pickedSize),
      rugSizeLabel: size.label,
      pickupDate: booking.pickupDate,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone ?? "",
      customerNotes: booking.customerNotes ?? "",
    },
  });

  return {
    success: true,
    checkoutUrl: session.url,
  };
}
