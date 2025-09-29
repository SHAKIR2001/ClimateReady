import { UserProgress } from './storage';

export interface Badge {
  icon: React.ReactNode;
  label: string;
}

export const getEarnedBadges = (progress: UserProgress): Badge[] => {
  const badges: Badge[] = [];
  
  if (!progress) return badges;

  // First checklist item badge
  const hasCompletedAnyItem = Object.values(progress.checklists).some(category => 
    Object.values(category).some(completed => completed)
  );
  
  if (hasCompletedAnyItem) {
    badges.push({
      icon: '⭐',
      label: 'Starter'
    });
  }

  // First category completed badge
  const completedCategories = Object.keys(progress.checklists).filter(categoryId => {
    const category = progress.checklists[categoryId];
    return Object.values(category).every(completed => completed);
  });
  
  if (completedCategories.length > 0) {
    badges.push({
      icon: '🏆',
      label: 'Expert'
    });
  }

  // Level badge
  if (progress.level >= 2) {
    badges.push({
      icon: '🚀',
      label: `Level ${progress.level}`
    });
  }

  // Progress badge
  if (progress.percent >= 50) {
    badges.push({
      icon: '🔥',
      label: 'Halfway'
    });
  }

  if (progress.percent >= 100) {
    badges.push({
      icon: '🎯',
      label: 'Complete'
    });
  }

  return badges;
};