'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUpDown, Search, Star, Clock, LineChart, History, Bell } from "lucide-react";

const actions = [
  { id: 1, icon: ArrowUpDown, label: "New Trade" },
  { id: 2, icon: LineChart, label: "Popular Pairs" },
  { id: 3, icon: Search, label: "Search Pairs" },
  { id: 4, icon: Star, label: "Favourites" },
  { id: 5, icon: Bell, label: "Set Alert" },
  { id: 6, icon: Clock, label: "Active Trades" },
  { id: 7, icon: History, label: "History" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const hover = {
  scale: 1.05,
  y: -5,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 10
  }
};

export function QuickActions() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-2 border-t border-border bg-background/50 backdrop-blur-sm"
    >
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              variants={item}
              whileHover={hover}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full backdrop-blur-sm bg-background/50 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <Icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
