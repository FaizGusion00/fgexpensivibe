
import React from 'react';
import { Circle, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriorityCircleProps {
  priority: 'low' | 'medium' | 'high';
  className?: string;
  size?: number;
}

const PriorityCircle: React.FC<PriorityCircleProps> = ({ 
  priority,
  className,
  size = 16
}) => {
  switch (priority) {
    case 'low':
      return (
        <Circle 
          className={cn("text-green-500 fill-green-100 dark:fill-green-900/30", className)} 
          size={size} 
        />
      );
    case 'medium':
      return (
        <AlertCircle 
          className={cn("text-yellow-500 fill-yellow-100 dark:fill-yellow-900/30", className)} 
          size={size} 
        />
      );
    case 'high':
      return (
        <CheckCircle 
          className={cn("text-red-500 fill-red-100 dark:fill-red-900/30", className)} 
          size={size} 
        />
      );
    default:
      return null;
  }
};

export default PriorityCircle;
