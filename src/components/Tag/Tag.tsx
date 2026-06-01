import { Badge } from '@/components/ui/badge';

export type TagColor = 'red' | 'green' | 'blue' | 'gray' | 'yellow';

export interface TagProps {
  label: string;
  color: TagColor;
}

function getTagClass(color: TagColor) {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    case 'gray':
      return 'bg-olive-50 text-olive-700 dark:bg-olive-950 dark:text-olive-300';
    case 'green':
      return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
    case 'red':
      return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300';
    case 'yellow':
      return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
    default:
      return 'bg-olive-50 text-olive-700 dark:bg-olive-950 dark:text-olive-300';
  }
}

const Tag = ({ label, color }: TagProps) => {
  const tagClass = getTagClass(color);
  return <Badge className={`shrink-0 ${tagClass}`}>{label}</Badge>;
};

export default Tag;
