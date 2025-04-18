import { motion } from 'framer-motion';
import Link from 'next/link';
import { FC } from 'react';
import { 
  FaHeart, 
  FaCalculator, 
  FaInfoCircle, 
  FaQuran, 
  FaSearch,
  FaQuestion 
} from "react-icons/fa";

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

interface MobileNavProps {
  pathname: string | null;
  toggleMenu: () => void;
}

const menuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// Utiliser les mêmes routes que dans le Header
const navItems: NavItem[] = [
  { href: "/", label: "Accueil", icon: FaQuran },
  { href: "/search", label: "Explorer", icon: FaSearch },
  { href: "/favorites", label: "Favoris", icon: FaHeart },
  { href: "/tahajjud", label: "Calcul Tahajjud", icon: FaCalculator },
  { href: "/about", label: "À propos", icon: FaInfoCircle },
  { href: "/faq", label: "FAQ", icon: FaQuestion },
];

const MobileNav: FC<MobileNavProps> = ({ pathname, toggleMenu }) => {
  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <motion.div
      className="absolute top-full left-0 w-full bg-[#0C0600]/95 backdrop-blur-md z-50 py-2 shadow-lg border-t border-amber-900/30"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={menuVariants}
    >
      <motion.nav className="container mx-auto px-4">
        <ul className="flex flex-col space-y-1 py-2">
          {navItems.map((item) => (
            <motion.li key={item.href} variants={itemVariants}>
              <Link
                href={item.href}
                onClick={toggleMenu}
                className={`flex items-center py-3 px-4 text-base transition rounded-md ${
                  isActive(item.href)
                    ? 'bg-amber-900/20 text-amber-400 font-medium'
                    : 'text-amber-100/80 hover:bg-amber-900/10 hover:text-amber-300'
                }`}
              >
                <item.icon className="mr-3" size={18} />
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.nav>
    </motion.div>
  );
};

export default MobileNav; 