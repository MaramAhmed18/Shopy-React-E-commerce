// src/components/client/checkout/PayPalButton.jsx
import { PayPalButtons } from "@paypal/react-paypal-js"; // Use built-in component

export default function PayPalButton({ total, onSuccess }) {
  // Only render if total is a valid number to prevent SDK errors
  if (total <= 0) return null;

  return (
    <div className="w-full relative z-0">
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "rect" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toFixed(2),
              },
            }],
          });
        }}
        onApprove={async (data, actions) => {
          const details = await actions.order.capture();
          onSuccess(details); //
        }}
        onError={(err) => {
          console.error("PayPal SDK Error:", err);
        }}
      />
    </div>
  );
}