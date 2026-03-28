"use client";

import { type Boss, getBossDrops } from "@/lib/boss-data";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Skull, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BossCardProps {
  boss: Boss;
  onClose?: () => void;
  compact?: boolean;
}

export function BossCard({ boss, onClose, compact = false }: BossCardProps) {
  const drops = getBossDrops(boss);

  if (compact) {
    return (
      <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  boss.type === "epic"
                    ? "bg-accent"
                    : boss.type === "raid"
                      ? "bg-primary"
                      : "bg-muted-foreground"
                }`}
              />
              <span className="font-medium text-foreground">{boss.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              Lv. {boss.level}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{boss.location}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div
        className={`h-1 ${
          boss.type === "epic"
            ? "bg-accent"
            : boss.type === "raid"
              ? "bg-primary"
              : "bg-muted-foreground"
        }`}
      />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Skull
                className={`h-5 w-5 ${
                  boss.type === "epic" ? "text-accent" : "text-primary"
                }`}
              />
              <h3 className="font-(family-name:--font-cinzel) text-lg font-bold text-foreground">
                {boss.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  boss.type === "epic"
                    ? "bg-accent/20 text-accent"
                    : boss.type === "raid"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {boss.type.toUpperCase()}
              </span>
              <span className="text-sm text-muted-foreground">
                Level {boss.level}
              </span>
            </div>
          </div>
          {onClose && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4">{boss.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <p className="text-muted-foreground text-xs">Location</p>
              <p className="text-foreground">{boss.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-accent" />
            <div>
              <p className="text-muted-foreground text-xs">Respawn</p>
              <p className="text-foreground">{boss.respawnTime}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Notable Drops</p>
          <div className="flex flex-wrap gap-2">
            {drops.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-secondary/50 border border-border"
              >
                <span>{item.icon}</span>
                <span className="text-foreground">{item.name}</span>
                <span
                  className={`font-medium ${
                    item.grade === "S80" || item.grade === "S"
                      ? "text-accent"
                      : item.grade === "A"
                        ? "text-primary"
                        : "text-muted-foreground"
                  }`}
                >
                  [{item.grade}]
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
