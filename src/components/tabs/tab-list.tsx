import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface AdminUserDetailsTabsProps {
  nav: { title: string; href: string; isActive: boolean }[] | undefined;
  className?: string;
}
export function CustomTabsList({ nav, className }: AdminUserDetailsTabsProps) {
  const router = useRouter();

  if (!nav) return null;
  return (
    <>
      <Tabs
        defaultValue={nav.find((tab) => tab.isActive)?.href ?? nav[0]?.href}
        className="sticky top-0 z-30 h-full w-full overflow-auto bg-background px-2 py-2 border rounded-sm"
        onValueChange={(value) => router.push(value)}
      >
        <ScrollArea orientation="horizontal" className="pb-2.5" scrollBarClassName="h-2">
          <TabsList className="inline-flex items-center justify-center space-x-1.5 text-muted-foreground">
            {nav.map((tab) => (
              <div role="none" key={tab.href} className={cn("border-b-2 border-transparent py-1.5", tab.isActive && "border-foreground")}>
                <TabsTrigger
                  value={tab.href}
                  className={cn(
                    "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    tab.isActive && "text-foreground",
                  )}
                  asChild
                >
                  <Link href={tab.href}>{tab.title}</Link>
                </TabsTrigger>
              </div>
            ))}
          </TabsList>
          <Separator />
        </ScrollArea>
      </Tabs>
    </>
  );
}
