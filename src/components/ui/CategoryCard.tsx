import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  // AI & Machine Learning
  Brain,
  Server,
  MessageCircle,
  
  // Business Software
  Briefcase,
  Users,
  Building,
  DollarSign,
  UserPlus,
  Megaphone,
  Headphones,
  ShoppingCart,
  ClipboardList,
  Calendar,
  Share2,
  
  // Content & Publishing
  FileText,
  Globe,
  Code,
  BookOpen,
  GraduationCap,
  Edit,
  Languages,
  
  // Data & Analytics
  BarChart3,
  TrendingUp,
  Activity,
  PieChart,
  BarChart,
  LineChart,
  GitMerge,
  
  // Developer Tools
  Terminal,
  Plug,
  GitBranch,
  RefreshCw,
  Layers,
  Database,
  Layout,
  PanelsTopLeft,
  Package,
  CloudUpload,
  
  // Infrastructure & Operations
  AlertTriangle,
  Cloud,
  FileCode,
  Box,
  HardDrive,
  Settings,
  Upload,
  
  // Security & Privacy
  Shield,
  Key,
  Lock,
  KeyRound,
  ShieldCheck,
  Flag,
  Network,
  
  // Productivity & Utilities
  Zap,
  Clock,
  Timer,
  Cog,
  Mail,
  Folder,
  Monitor,
  Video,
  Wallet,
  
  // Community & Social
  MessageSquare,
  
  // Specialized Industries
  Building2,
  Palette,
  Landmark,
  Heart,
  Film,
  Music,
  Gamepad2,
  
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  // AI & Machine Learning
  Brain,
  Server,
  MessageCircle,
  
  // Business Software
  Briefcase,
  Users,
  Building,
  DollarSign,
  UserPlus,
  Megaphone,
  Headphones,
  HeadphonesIcon: Headphones,
  ShoppingCart,
  ClipboardList,
  Calendar,
  Share2,
  
  // Content & Publishing
  FileText,
  Globe,
  Code,
  BookOpen,
  GraduationCap,
  Edit,
  Languages,
  
  // Data & Analytics
  BarChart3,
  TrendingUp,
  Activity,
  PieChart,
  BarChart,
  LineChart,
  GitMerge,
  
  // Developer Tools
  Terminal,
  Plug,
  GitBranch,
  RefreshCw,
  Layers,
  Database,
  Layout,
  PanelsTopLeft,
  Package,
  CloudUpload,
  
  // Infrastructure & Operations
  AlertTriangle,
  Cloud,
  FileCode,
  Box,
  HardDrive,
  Settings,
  Upload,
  
  // Security & Privacy
  Shield,
  Key,
  Lock,
  KeyRound,
  ShieldCheck,
  Flag,
  Network,
  
  // Productivity & Utilities
  Zap,
  Clock,
  Timer,
  Cog,
  Mail,
  Folder,
  Monitor,
  Video,
  Wallet,
  
  // Community & Social
  MessageSquare,
  
  // Specialized Industries
  Building2,
  Palette,
  Landmark,
  Heart,
  Film,
  Music,
  Gamepad2,
};

// Flexible interface for both old and new category types
interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  count?: number;
}

interface CategoryCardProps {
  category: CategoryData;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon ? iconMap[category.icon] || Code : Code;

  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="card-dark group touch-manipulation active:scale-[0.98] transition-transform">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-center text-brand group-hover:border-brand/40 transition-colors flex-shrink-0">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-brand transition-colors truncate">
                {category.name}
              </h3>
              <p className="text-[10px] sm:text-xs font-mono text-muted">
                {category.count ?? 0} alternatives
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted group-hover:text-brand group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
        </div>
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-mono text-muted line-clamp-2">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
