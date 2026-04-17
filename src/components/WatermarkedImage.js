import React from "react";

export default function WatermarkedImage({
  src,
  alt = "",
  className = "",
  imageClassName = "",
  watermarkText = "DEMORE",
  mode = "centered-bottom",
  opacity = 0.14,
  onError,
  preserveDimensions = false, // خاصية جديدة
  style = {}, // خاصية جديدة للستايل المباشر
}) {
  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      style={preserveDimensions ? style : {}}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        onError={onError}
        className={`select-none ${preserveDimensions ? '' : 'w-full h-full object-cover'} ${imageClassName}`}
        style={preserveDimensions ? style : {}}
      />

      {mode === "corner" ? (
        <div className="pointer-events-none absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
          <div
            className="text-[11px] font-bold uppercase tracking-[0.35em] text-white sm:text-xs md:text-sm"
            style={{ opacity: Math.min(opacity + 0.05, 0.25) }}
          >
            {watermarkText}
          </div>
        </div>
      ) : mode === "centered-bottom" ? (
        <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center sm:bottom-6 md:bottom-8">
          <div
            className="text-sm font-black uppercase tracking-[0.5em] text-white drop-shadow-lg sm:text-xl md:text-xl lg:text-2xl"
            style={{ opacity: Math.min(opacity + 0.1, 0.35) }}
          >
            {watermarkText}
          </div>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-[-20%] rotate-[-24deg] flex flex-col justify-center gap-8">
            {Array.from({ length: 6 }).map((_, row) => (
              <div
                key={row}
                className="flex justify-center gap-8 whitespace-nowrap"
              >
                {Array.from({ length: 8 }).map((__, col) => (
                  <span
                    key={`${row}-${col}`}
                    className="text-sm font-bold uppercase tracking-[0.4em] text-white sm:text-base md:text-lg"
                    style={{ opacity }}
                  >
                    {watermarkText}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}