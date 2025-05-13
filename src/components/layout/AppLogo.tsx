import Link from 'next/link';
import { GraduationCap } from 'lucide-react'; // Example icon
import { SITE_NAME } from '@/lib/constants';

interface AppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ className, iconSize = 28, textSize = "text-2xl" }) => {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <GraduationCap
        size={iconSize}
        className="text-primary group-hover:text-accent transition-colors duration-200"
      />
      <span className={`font-bold ${textSize} text-foreground group-hover:text-accent transition-colors duration-200`}>
        {SITE_NAME}
      </span>
    </Link>
  );
};

export default AppLogo;
