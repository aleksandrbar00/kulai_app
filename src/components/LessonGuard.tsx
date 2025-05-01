import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { isLessonInitialized, loadLesson, checkLessonExists } from './GameManager/stores/lessonStore';

interface LessonGuardProps {
  children: React.ReactNode;
}

export const LessonGuard: React.FC<LessonGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId?: string }>();
  
  useEffect(() => {
    // If we have a specific lessonId in the URL, try to load that lesson
    if (lessonId) {
      if (!checkLessonExists(lessonId) || !loadLesson(lessonId)) {
        navigate('/');
        return;
      }
    } 
    // Otherwise, check if there's an initialized lesson
    else if (!isLessonInitialized.value) {
      navigate('/');
      return;
    }
  }, [navigate, lessonId]);

  // Don't render anything while we're checking
  if ((lessonId && !checkLessonExists(lessonId)) || (!lessonId && !isLessonInitialized.value)) {
    return null;
  }

  return <>{children}</>;
}; 