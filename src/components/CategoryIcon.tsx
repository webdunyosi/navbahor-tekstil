import { FaCog, FaCut, FaHome, FaThLarge } from 'react-icons/fa';
import type { IconType } from 'react-icons';

const ICON_MAP: Record<string, IconType> = {
  FaCog,
  FaCut,
  FaHome,
  FaThLarge,
};

interface CategoryIconProps {
  name: string;
  className?: string;
}

const CategoryIcon = ({ name, className }: CategoryIconProps) => {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={className} />;
};

export default CategoryIcon;
