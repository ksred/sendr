import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="p-2 border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" className="rounded-full">
          🔄 New Trade
        </Button>
        <Button size="sm" variant="secondary" className="rounded-full">
          📊 Popular Pairs
        </Button>
        <Button size="sm" variant="secondary" className="rounded-full">
          🔍 Search Pairs
        </Button>
        <Button size="sm" variant="secondary" className="rounded-full">
          ⭐ Favourites
        </Button>
        <Button size="sm" variant="secondary" className="rounded-full">
          ⏰ Set Alert
        </Button>
        <Button size="sm" variant="secondary" className="rounded-full">
          📈 Active Trades
        </Button>
        <Button size="sm" variant="secondary" className="rounded-full">
          📜 History
        </Button>
      </div>
    </div>
  );
}
