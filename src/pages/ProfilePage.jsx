import { useAuth } from '@/context/AuthContextCore';
import { UserRole } from '@/config/roles';
import { StudentProfile } from '@/features/student';
import { ProviderProfile } from '@/features/provider';
import { ProfessorProfile } from '@/features/professor';

export default function ProfilePage() {
  const { user } = useAuth();

  switch (user?.role) {
    case UserRole.STUDENT:
      return <StudentProfile />;
    case UserRole.PROVIDER:
      return <ProviderProfile />;
    case UserRole.PROFESSOR:
      return <ProfessorProfile />;
    default:
      return (
        <div className="text-center py-16 text-slate-500 font-medium">
          Profile view for role &quot;{user?.role}&quot; is not implemented yet.
        </div>
      );
  }
}