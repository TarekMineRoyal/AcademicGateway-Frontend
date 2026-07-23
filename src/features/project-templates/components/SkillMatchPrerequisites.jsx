function SkillMatchPrerequisites({
  requiredSkills = [],
  userSkills = [],
  isStudent = false,
  skillsLoading = false
}) {
  const totalRequirementCount = requiredSkills.length;

  if (!isStudent || skillsLoading || totalRequirementCount === 0) {
    return null;
  }

  const matchIntersectionCount = requiredSkills.filter(sk =>
    userSkills.some(userSk => userSk.id === sk.id)
  ).length;

  return (
    <div className="border-t border-slate-200/60 w-full pt-6">
      <div>
        <span className="block text-xs font-bold text-slate-400 uppercase mb-2">
          Target Capabilities & Prerequisites
        </span>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-full mb-4">
          You possess {matchIntersectionCount} of {totalRequirementCount} required capabilities
        </div>

        <div className="flex flex-wrap gap-1.5">
          {requiredSkills.map((sk, idx) => {
            const studentOwnsSkill = userSkills.some(userSk => userSk.id === sk.id);

            return (
              <span
                key={sk.id || idx}
                className={`text-xs px-2 py-0.5 rounded font-semibold border transition-colors ${
                  studentOwnsSkill
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                {sk.name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SkillMatchPrerequisites;