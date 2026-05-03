export default function Logo({ className = "", size = "normal", centered = false, iconOnly = false, inverted = false }: { className?: string; size?: "small" | "normal" | "large"; centered?: boolean; iconOnly?: boolean; inverted?: boolean }) {
  // Balanced height sizing for the single-piece logo
  const heights = {
    small: "h-10",
    normal: "h-16",
    large: "h-24"
  }[size]

  const iconSizes = {
    small: "w-8 h-8",
    normal: "w-12 h-12",
    large: "w-20 h-20"
  }[size]

  const filterClass = inverted ? "brightness-0 invert" : ""

  return (
    <div className={`flex items-center ${centered ? 'justify-center' : 'justify-start'} ${className}`}>
      {iconOnly ? (
        <img 
          src="/assets/upper.png" 
          alt="Icon" 
          className={`${iconSizes} object-contain aspect-auto ${filterClass}`}
        />
      ) : (
        <img 
          src="/assets/final_logo_2.png" 
          alt="Skillect Logo" 
          className={`${heights} w-auto object-contain aspect-auto transition-opacity duration-300 ${filterClass}`}
        />
      )}
    </div>
  )
}




