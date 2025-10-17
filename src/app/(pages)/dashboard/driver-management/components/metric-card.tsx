import { Card, CardContent } from '@/components/ui/card';
import clsx from 'clsx';

// MetricCard Component
interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  trend?: number;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'primary',
}) => {
  // Map color prop to specific Tailwind classes
  const getColorClasses = (colorName: string) => {
    const colorMap = {
      primary: 'bg-blue-100 text-blue-500',
      success: 'bg-green-100 text-green-500',
      warning: 'bg-yellow-100 text-yellow-500',
      destructive: 'bg-red-100 text-red-500',
    };
    return colorMap[colorName as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <Card className="flex-1 rounded-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={clsx('p-2 rounded-lg', getColorClasses(color))}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
