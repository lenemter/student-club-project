export function initTheme() {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
        document.documentElement.classList.toggle('dark', mq.matches)
        document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light')
    }
    apply()
    mq.addEventListener('change', apply)
}
