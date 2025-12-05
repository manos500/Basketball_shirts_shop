"use client";

import React from "react";
import { submitShippingDetails } from "@/lib/actions/shipping";
import { useActionState } from "react";

const Shipping = () => {
  // Correct usage: useActionState returns { state, action }
  const { state, action } = useActionState(submitShippingDetails);

  return (
    <form action={action} className="space-y-6">
      <input
        id="firstname"
        name="firstname"
        type="text"
        placeholder="First Name"
        className="w-full p-3 text-body text-black border border-neutral-400"
      />
      <input
        id="lastname"
        name="lastname"
        type="text"
        placeholder="Last Name"
        className="w-full p-3 text-body text-black border border-neutral-400"
      />
      <input
        id="country"
        name="country"
        type="text"
        placeholder="Country"
        className="w-full p-3 text-body text-black border border-neutral-400"
      />
      <input
        id="city"
        name="city"
        type="text"
        placeholder="City"
        className="w-full p-3 text-body text-black border border-neutral-400"
      />
      <input
        id="street"
        name="street"
        type="text"
        placeholder="Street"
        className="w-full p-3 text-body text-black border border-neutral-400"
      />
      <input
        id="postalCode"
        name="postalCode"
        type="text"
        placeholder="Postal Code"
        className="w-full p-3 text-body text-black border border-neutral-400"
      />
      <input
        id="phone"
        name="phone"
        type="text"
        placeholder="Phone Number"
        className="w-full p-3 text-body text-black border border-neutral-400"
      />

      <button
        type="submit"
        disabled={state?.isLoading}
        className="bg-black text-white p-2 w-full"
      >
        {state?.isLoading ? "Saving..." : "Submit"}
      </button>

      {state?.error && <p className="text-red-500">{state.error}</p>}
      {state?.success && <p className="text-green-500">Saved successfully!</p>}
    </form>
  );
};

export default Shipping;
