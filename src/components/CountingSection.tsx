import { StatsStrip } from "@/components/ui/stats-strip";

interface CountStat {
  value: number;
  suffix?: string;
  label: string;
}

interface CountingSectionProps {
  stats: CountStat[];
  className?: string;
}

const CountingSection = ({ stats, className }: CountingSectionProps) => {
  return <StatsStrip stats={stats} className={className} />;
};

export default CountingSection;
