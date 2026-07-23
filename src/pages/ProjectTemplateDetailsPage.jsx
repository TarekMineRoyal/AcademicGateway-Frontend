import { useParams } from 'react-router-dom';
import { ProjectTemplateDetails } from '../features/project-templates';
import { useUserSkills } from '../features/skills';
import { useAuth } from '../context/AuthContextCore';
import { UserRole } from '../shared/constants/enums';

export default function ProjectTemplateDetailsPage() {
  const { templateId } = useParams();
  const { user } = useAuth();
  const userId = user?.id;
  const isStudent = user?.role === UserRole.STUDENT;

  const { data: userSkills = [], isLoading } = useUserSkills(userId);

  return (
    <ProjectTemplateDetails
      templateId={templateId}
      userSkills={userSkills}
      isStudent={isStudent}
      skillsLoading={isLoading}
    />
  );
}