// components/testimonialCard.tsx
// Branded testimonial component for output previews or Web/PDF use

type TestimonialCardProps = {
    name: string
    quote: string
    role?: string
    avatarUrl?: string
  }
  
  export function TestimonialCard({ name, quote, role, avatarUrl }: TestimonialCardProps) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
        {avatarUrl && (
          <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full mb-4" />
        )}
        <blockquote className="italic text-gray-700 mb-2">"{quote}"</blockquote>
        <p className="font-semibold text-[#3A69E0]">{name}</p>
        {role && <p className="text-sm text-gray-500">{role}</p>}
      </div>
    )
  }
  