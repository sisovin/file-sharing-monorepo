import React from 'react';
import { useAuth } from '../hooks/useAuth';

const SubscriptionPlans: React.FC = () => {
  const { subscribeToPlan } = useAuth();

  const handleSubscribe = (planId: string) => {
    subscribeToPlan(planId);
  };

  return (
    <div className="subscription-plans">
      <h2 className="text-xl font-bold mb-4">Subscription Plans</h2>
      <div className="plan">
        <h3 className="text-lg font-semibold">Light Plan</h3>
        <p>$5.99 per month</p>
        <p>Upload up to 10 files</p>
        <button onClick={() => handleSubscribe('light-plan-id')} className="btn btn-primary">
          Subscribe
        </button>
      </div>
      <div className="plan">
        <h3 className="text-lg font-semibold">Pro Plan</h3>
        <p>$9.99 per month</p>
        <p>Upload up to 100 files</p>
        <button onClick={() => handleSubscribe('pro-plan-id')} className="btn btn-primary">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
