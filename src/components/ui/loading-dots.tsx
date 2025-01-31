'use client';

export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-1.5 h-5">
      {[0, 1, 2].map((dot) => (
        <div
          key={dot}
          className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60"
          style={{
            animationDelay: `${dot * 0.15}s`,
            animationDuration: '0.9s'
          }}
        />
      ))}
    </div>
  );
}
