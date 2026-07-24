import { Zap, UserCheck } from 'lucide-react';

const INITIATION_OPTIONS = [
  {
    id: 'solo',
    title: 'Deploy in Solo Execution Mode',
    description: 'Instantiates the runtime workspace track immediately. You hold the ability to invite a faculty advisor later.',
    icon: Zap,
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-700',
  },
  {
    id: 'supervised',
    title: 'Request Faculty Academic Supervision',
    description: 'Search our verified faculty registry to route an invitation. Track status will remain pending until approved.',
    icon: UserCheck,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-700',
  },
];

export function InitiationModeSelector({ onSelectMode }) {
  return (
    <div>
      <p className="text-slate-600 text-sm leading-relaxed mb-6">
        Select how you want to deploy this capstone aggregate model workspace track. You can modify mentorship settings post-launch.
      </p>

      <div className="flex flex-col gap-4">
        {INITIATION_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onSelectMode(option.id)}
              className="w-full p-5 border-2 border-slate-200 hover:border-primary rounded-xl bg-white text-left cursor-pointer flex gap-4 items-center hover:bg-slate-50/60 transition-all duration-150 shadow-xs"
            >
              <div className={`p-2 ${option.iconBg} ${option.iconColor} rounded-lg`}>
                <Icon size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-0.5">
                  {option.title}
                </h4>
                <p className="text-slate-500 text-xs leading-normal">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default InitiationModeSelector;