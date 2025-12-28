import { cn } from "@/lib/utils";
import { BackgroundLines } from "./ui/background-lines";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

const alignMap = {
  left: "items-start text-left",
  center: "items-center text-center",
};

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) => {
  return (
    <BackgroundLines className={cn("w-full px-6 py-10 md:px-10 md:py-14", className)}>
      <div className={cn("flex w-full flex-col gap-4", alignMap[align])}>
        {eyebrow ? (
          <span className="text-xs uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="max-w-3xl text-sm md:text-base text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </BackgroundLines>
  );
};

export default SectionHeading;
