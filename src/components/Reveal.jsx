import { useEffect, useRef, useState } from 'react'

/**
 * Reveals its children with a short fade-and-lift when they scroll into view.
 *
 * - Uses IntersectionObserver, so nothing runs on every scroll event.
 * - `prefers-reduced-motion` is respected in CSS (see global.css), and the
 *   observer is skipped entirely when the API is unavailable so content is
 *   never stuck invisible.
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const classes = ['reveal', visible ? 'is-visible' : '', className].filter(Boolean).join(' ')

  return (
    <Tag
      ref={ref}
      className={classes}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}