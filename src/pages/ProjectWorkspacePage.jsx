import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '../features/project-instances';

export default function ProjectWorkspacePage() {
  const { projectInstanceId } = useParams();

  return <ProjectWorkspace projectInstanceId={projectInstanceId} />;
}