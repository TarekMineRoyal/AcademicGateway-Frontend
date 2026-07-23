import React from 'react';

function OnboardingCard({
  icon: Icon,
  iconBgColor = 'bg-blue-50 text-blue-600',
  title,
  description,
  buttonText,
  buttonBgColor = 'bg-primary hover:bg-primary-hover',
  onButtonClick,
}) {
  return (
    <div className="bg-white p-8 rounded-card shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col items-center text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${iconBgColor}`}>
        {Icon && <Icon size={32} />}
      </div>
      <h2 className="text-xl font-bold text-brand-dark mb-3">{title}</h2>
      <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-6">
        {description}
      </p>
      <button
        onClick={onButtonClick}
        className={`w-full py-3 text-white font-semibold rounded-btn transition-colors duration-200 cursor-pointer ${buttonBgColor}`}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default OnboardingCard;