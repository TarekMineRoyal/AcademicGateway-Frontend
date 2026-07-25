import PropTypes from 'prop-types';

/**
 * Biography sub-component for the Student Profile read-only view.
 * Renders the student's aboutMe text or an empty state placeholder.
 */
export default function StudentBiography({ aboutMe }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        About Me / Biography
      </h3>
      {aboutMe ? (
        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/50 p-3.5 rounded-lg border border-slate-100">
          {aboutMe}
        </p>
      ) : (
        <p className="text-sm text-slate-400 italic bg-slate-50/50 p-3.5 rounded-lg border border-slate-100">
          No biography provided yet.
        </p>
      )}
    </div>
  );
}

StudentBiography.propTypes = {
  aboutMe: PropTypes.string,
};