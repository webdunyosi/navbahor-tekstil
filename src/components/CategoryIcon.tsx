import { FaGears, FaScissors, FaHouse, FaFolderOpen, FaFolder } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

const ICON_MAP: Record<string, IconType> = {
  FaGears,
  FaScissors,
  FaHouse,
  FaFolderOpen,
};

interface CategoryIconProps {
  name: string;
  className?: string;
}

const CategoryIcon = ({ name, className }: CategoryIconProps) => {
  const Icon = ICON_MAP[name] ?? FaFolder;
  return <Icon className={className} />;
};

export default CategoryIcon;
