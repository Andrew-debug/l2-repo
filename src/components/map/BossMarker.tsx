"use client";
import { useRef } from "react";
import { useTransformContext, useTransformEffect } from "react-zoom-pan-pinch";

type Boss = any;

export default function BossMarker({
  boss,
  isActive,
  onClick,
}: {
  boss: Boss;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  // 1. We still get the initial state for the very first render
  const { transformState } = useTransformContext();

  // 2. We create a direct reference to the DOM node we want to scale
  const scaleRef = useRef<HTMLDivElement>(null);

  // 3. The Magic: This fires at 60fps during zooming/panning, bypassing React renders
  useTransformEffect(({ state }) => {
    if (scaleRef.current) {
      const inverseScale = 1 / state.scale;
      // Directly mutate the CSS transform. This is buttery smooth.
      scaleRef.current.style.transform = `scale(${inverseScale})`;
    }
  });

  return (
    <div
      className="absolute z-10"
      style={{
        left: boss.absoluteX,
        top: boss.absoluteY,
        transform: "translate(-50%, -50%)", // Outer div still handles absolute positioning
      }}
    >
      {/* Attach the ref to this inner scaling container */}
      <div
        ref={scaleRef}
        className="relative flex items-center justify-center pointer-events-auto"
        style={{
          // Set the initial scale so it doesn't "pop" on mount
          transform: `scale(${1 / transformState.scale})`,
          transformOrigin: "center center",
          width: "30px",
          height: "30px",
        }}
      >
        <button
          onClick={onClick}
          className="w-full h-full text-red-500 hover:text-red-400 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] transition-colors focus:outline-none group"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L9 7H3L5 12L2 17L8 16L12 22L16 16L22 17L19 12L21 7H15L12 2Z"
              stroke="#facc15"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="12" r="1.5" fill="#1e293b" />
            <circle cx="15" cy="12" r="1.5" fill="#1e293b" />
          </svg>
        </button>

        {isActive && (
          <div className="absolute bottom-full mb-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-3 text-left cursor-default">
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-b border-r border-slate-700 rotate-45"></div>
            <h3 className="text-red-400 font-bold text-sm uppercase tracking-wider mb-1">
              {boss.name}
            </h3>
            <div className="text-slate-400 text-xs mb-2">
              Level {boss.level}
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              {boss.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
