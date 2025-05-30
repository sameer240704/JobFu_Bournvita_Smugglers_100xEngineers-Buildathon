import React, { useState } from "react";
import { Check, Star, Zap, Crown, Users } from "lucide-react";

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const pricingPlans = [
    {
      name: "Starter",
      icon: Users,
      description: "Perfect for small teams getting started with AI hiring",
      monthlyPrice: 99,
      annualPrice: 79,
      popular: false,
      features: [
        "Up to 5 active job postings",
        "Access to 10,000+ AI candidates",
        "Email support",
        "Standard screening tools",
        "Basic analytics dashboard",
      ],
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
    },
    {
      name: "Professional",
      icon: Zap,
      description: "Advanced features for scaling AI teams efficiently",
      monthlyPrice: 299,
      annualPrice: 239,
      popular: true,
      features: [
        "Up to 25 active job postings",
        "Access to 50,000+ AI candidates",
        "Advanced AI matching & scoring",
        "Priority support + dedicated manager",
        "Custom screening workflows",
      ],
      gradient: "from-purple-600 to-indigo-600",
      bgGradient: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
    },
    {
      name: "Enterprise",
      icon: Crown,
      description: "Complete solution for large organizations",
      monthlyPrice: 799,
      annualPrice: 639,
      popular: false,
      features: [
        "Unlimited job postings",
        "Access to entire candidate network",
        "Custom AI models for your needs",
        "24/7 dedicated support team",
        "White-label solution available",
        "Custom integrations & APIs",
      ],
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
    },
  ];

  const PricingCard = ({ plan }) => {
    const IconComponent = plan.icon;
    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
    const savings = plan.monthlyPrice - plan.annualPrice;

    return (
      <div
        className={`relative bg-white dark:bg-gray-800/80 rounded-2xl shadow-xl border-2 ${
          plan.borderColor
        } dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
          plan.popular
            ? "scale-105 ring-4 ring-purple-200 dark:ring-purple-700/50"
            : ""
        }`}
      >
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
              <Star className="w-fit h-4 fill-current" />
              Most Popular
            </div>
          </div>
        )}

        <div
          className={`bg-gradient-to-br ${plan.bgGradient} dark:from-gray-900/50 dark:to-gray-800/50 p-8 rounded-t-2xl`}
        >
          <div className="flex items-center justify-center mb-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}
            >
              <IconComponent className="w-8 h-8 text-white" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-2">
            {plan.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-6">
            {plan.description}
          </p>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-1">
              <span className="text-4xl font-bold text-gray-800 dark:text-white">
                ${price}
              </span>
              <div className="text-left">
                <div className="text-gray-600 dark:text-gray-300 text-sm">
                  per month
                </div>
                {isAnnual && savings > 0 && (
                  <div className="text-green-600 dark:text-green-400 text-xs font-medium">
                    Save ${savings}/mo
                  </div>
                )}
              </div>
            </div>
            {isAnnual && (
              <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Billed annually
              </div>
            )}
          </div>

          <button
            className={`w-full bg-gradient-to-r ${
              plan.gradient
            } text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
              plan.popular ? "shadow-lg" : ""
            }`}
          >
            {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
          </button>
        </div>

        <div className="p-8">
          <ul className="space-y-4">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}
                >
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-transparent py-2">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
            From startups to enterprise, we have the right solution to
            accelerate your AI hiring process
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              className={`text-sm font-medium ${
                !isAnnual
                  ? "text-gray-800 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                isAnnual
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform duration-300 shadow-md ${
                  isAnnual ? "transform translate-x-8" : "translate-x-1"
                }`}
              ></div>
            </button>
            <span
              className={`text-sm font-medium ${
                isAnnual
                  ? "text-gray-800 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Annual
            </span>
            {isAnnual && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-3 py-1 rounded-full font-medium ml-2">
                Save up to 20%
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700 shadow-lg max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Not sure which plan is right for you?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Schedule a personalized demo and we'll help you choose the perfect
              solution for your hiring needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-medium">
                Schedule Demo
              </button>
              <button className="border border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 px-8 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-gray-700 transition-all font-medium">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
