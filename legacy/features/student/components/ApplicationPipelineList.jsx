import PropTypes from 'prop-types';
import { Clock, Zap } from 'lucide-react';
import StatusBadge from '../../../shared/components/StatusBadge';

export default function ApplicationPipelineList({ pipelineApplications = [], onStartSolo }) {
  return (
    <section className="bg-white p-6 rounded-card border border-slate-200/60 shadow-sm">
      <h2 className="text-lg font-bold text-brand-dark mb-5 flex items-center gap-2">
        <Clock className="text-amber-600" size={18} /> Application Pipeline
        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">
          {pipelineApplications.length}
        </span>
      </h2>

      {pipelineApplications.length === 0 ? (
        <div className="p-8 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-sm font-medium">
          Your pipeline registry is empty. Ready to launch a brand new initiative?
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pipelineApplications.map((app) => (
            <div
              key={app.id}
              className="bg-amber-50/30 border border-amber-100 rounded-lg p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="text-base font-bold text-brand-dark line-clamp-2">{app.title}</h3>
                </div>

                <div className="flex flex-col gap-1.5 text-xs text-slate-600">
                  <span>
                    <strong className="text-slate-500">Sponsor Unit:</strong>{' '}
                    {app.providerCompanyName || 'Unspecified Provider'}
                  </span>
                  <span>
                    <strong className="text-slate-500">Supervisor:</strong>{' '}
                    {app.requestedProfessorName || 'Pending Assignment'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-dashed border-amber-200/60 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-medium">
                    Opened {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                  <StatusBadge status={app.status} />
                </div>

                <button
                  onClick={() => onStartSolo(app)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-bold text-xs transition-colors cursor-pointer"
                >
                  <Zap size={13} />
                  Start Solo Instead
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

ApplicationPipelineList.propTypes = {
  pipelineApplications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      providerCompanyName: PropTypes.string,
      requestedProfessorName: PropTypes.string,
      createdAt: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  onStartSolo: PropTypes.func.isRequired,
};