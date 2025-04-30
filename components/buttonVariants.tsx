// components/buttonVariants.tsx
// Reusable Tailwind-styled buttons for UI or PDF elements

type ButtonProps = {
    label: string
    onClick?: () => void
  }
  
  export function PrimaryButton({ label, onClick }: ButtonProps) {
    return (
      <button
        onClick={onClick}
        className="bg-[#3A69E0] text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
      >
        {label}
      </button>
    )
  }
  
  export function AccentButton({ label, onClick }: ButtonProps) {
    return (
      <button
        onClick={onClick}
        className="bg-[#26D9C1] text-white py-2 px-4 rounded-xl hover:bg-teal-600 transition"
      >
        {label}
      </button>
    )
  }
  