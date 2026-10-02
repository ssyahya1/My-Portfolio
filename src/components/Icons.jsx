/**
 * Inline SVG icons.
 * Kept local instead of pulling in an icon package: the set is small, it adds
 * no dependency, and every icon inherits `currentColor` so it themes for free.
 */

const stroke = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
}

const filled = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': 'true',
  focusable: 'false',
}

export function IconGitHub(props) {
  return (
    <svg {...filled} {...props}>
      <path d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c-.5.1-.7-.2-.7-.5v-2c-3 .6-3.7-1.4-3.7-1.4-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.4-.3-4.9-1.2-4.9-5.4 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 3 1.1a10.3 10.3 0 0 1 5.4 0c2-1.4 3-1.1 3-1.1.6 1.4.2 2.5.1 2.8.7.8 1.1 1.8 1.1 3 0 4.2-2.5 5-4.9 5.3.4.4.7 1 .7 2v3c0 .3-.2.6-.7.5A11.1 11.1 0 0 0 12 .9z" />
    </svg>
  )
}

export function IconLinkedIn(props) {
  return (
    <svg {...filled} {...props}>
      <path d="M20.4 20.4h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.5h.1a3.7 3.7 0 0 1 3.3-1.8c3.6 0 4.2 2.3 4.2 5.3v6.4zM5.3 7.4a2 2 0 1 1 0-4.1 2 2 0 0 1 0 4.1zM7.1 20.4H3.6V9h3.5v11.4zM22.2 0H1.8A1.8 1.8 0 0 0 0 1.7v20.6A1.8 1.8 0 0 0 1.8 24h20.4a1.8 1.8 0 0 0 1.8-1.7V1.7A1.8 1.8 0 0 0 22.2 0z" />
    </svg>
  )
}

export function IconExternal(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  )
}

export function IconArrowRight(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

export function IconSearch(props) {
  return (
    <svg {...stroke} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </svg>
  )
}

export function IconPlus(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export function IconPencil(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  )
}

export function IconTrash(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

export function IconEye(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function IconEyeOff(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="m3 3 18 18" />
      <path d="M10.6 5.2A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-2.4 3.2" />
      <path d="M6.5 6.7A17.3 17.3 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 4.2-.9" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

export function IconClose(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  )
}

export function IconAlert(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

export function IconInfo(props) {
  return (
    <svg {...stroke} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

export function IconMenu(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  )
}

export function IconStar(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="m12 3 2.9 5.9 6.6.9-4.8 4.6 1.1 6.5L12 18l-5.8 3 1.1-6.5L2.5 9.8l6.6-.9z" />
    </svg>
  )
}

export function IconDatabase(props) {
  return (
    <svg {...stroke} {...props}>
      <ellipse cx="12" cy="5" rx="8.5" ry="3" />
      <path d="M3.5 5v14c0 1.7 3.8 3 8.5 3s8.5-1.3 8.5-3V5" />
      <path d="M3.5 12c0 1.7 3.8 3 8.5 3s8.5-1.3 8.5-3" />
    </svg>
  )
}

export function IconCpu(props) {
  return (
    <svg {...stroke} {...props}>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" />
    </svg>
  )
}

export function IconServer(props) {
  return (
    <svg {...stroke} {...props}>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </svg>
  )
}

export function IconLayers(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  )
}

export function IconCode(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="m9 18-6-6 6-6" />
      <path d="m15 6 6 6-6 6" />
    </svg>
  )
}

export function IconMail(props) {
  return (
    <svg {...stroke} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export function IconLock(props) {
  return (
    <svg {...stroke} {...props}>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function IconRefresh(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  )
}

export function IconSparkles(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M12 3.5l1.5 4.1 4.1 1.5-4.1 1.5L12 14.7l-1.5-4.1L6.4 9.1l4.1-1.5z" />
      <path d="M18.5 15l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8z" />
    </svg>
  )
}

export function IconChevronDown(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function IconSliders(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  )
}

export function IconGrid(props) {
  return (
    <svg {...stroke} {...props}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  )
}