import { User, Mail, Phone, MapPin } from 'lucide-react';

/**
 * Renders the primary contact and organizational credentials for a reviewer application dossier.
 */
export function ApplicationContactDetails({ application }) {
  if (!application) return null;

  const contactEmail = application.contactEmail;
  const contactPerson = application.contactPersonName || application.fullName;

  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
        <User size={14} className="text-primary" /> Primary Contact & Organizational Details
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
        <div className="sm:col-span-2 bg-white p-3 rounded-lg border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Primary Contact Email</span>
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`} className="text-sm font-bold text-primary hover:underline flex items-center gap-1.5 mt-0.5">
                <Mail size={15} /><span>{contactEmail}</span>
              </a>
            ) : (
              <span className="text-slate-400 italic">No contact email on record</span>
            )}
          </div>
        </div>
        {contactPerson && (
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Contact Person</span>
            <span className="font-bold text-slate-800">{contactPerson}</span>
          </div>
        )}
        {application.phoneNumber && (
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Phone Number</span>
            <span className="font-semibold text-slate-700 flex items-center gap-1"><Phone size={12} /> {application.phoneNumber}</span>
          </div>
        )}
        {application.address && (
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Address</span>
            <span className="font-semibold text-slate-700 flex items-center gap-1"><MapPin size={12} /> {application.address}</span>
          </div>
        )}
        {application.taxRegistrationNumber && (
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Tax Registration / ID</span>
            <span className="font-mono font-semibold text-slate-800">{application.taxRegistrationNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
}