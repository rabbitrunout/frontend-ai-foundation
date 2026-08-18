import Link from 'next/link'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/competitions', label: 'Competitions' },
  { href: '/payments', label: 'Payments' },
  { href: '/results', label: 'Results' },
  { href: '/requests', label: 'Requests' },
  { href: '/profile', label: 'Profile' },
  { href: '/health', label: 'Health' },
]

export default function Navigation() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:gap-x-5 sm:py-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}