import React from "react";

const Pricing = () => {
  const plans = [
    {
      name: "Open Source",
      price: "Free",
      features: [
        "Full ERP functionality",
        "Products, BOMs, Inventory",
        "Sales & Production Orders",
        "MRP & Capacity Planning",
        "Self-hosted",
        "Community support",
      ],
    },
    {
      name: "Pro",
      price: "$79/month",
      features: [
        "Everything in Open Source",
        "Customer Quote Portal",
        "B2B Partner Portal",
        "E-commerce Integrations",
        "Payment Processing",
        "Email Support",
        "SaaS or Self-hosted",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Everything in Pro",
        "ML Time Estimation",
        "Printer Fleet Management",
        "Advanced Analytics",
        "Priority Support",
        "Custom Development",
        "SaaS only",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Pricing</h1>
        <p className="text-center text-gray-400 mb-12">
          Choose the plan that's right for your print farm
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-gray-800 p-6 rounded-lg ${
                plan.popular ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="text-3xl font-bold mb-6">{plan.price}</div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {plan.name === "Open Source" ? "Get Started" : "Coming 2026"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
