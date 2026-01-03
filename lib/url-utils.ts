export function getSiteUrl() {
    let url =
        process.env.NEXT_PUBLIC_SITE_URL ??
        'http://localhost:3000'

    // Asegurar que tiene el protocolo correcto
    if (!url.startsWith('http')) {
        url = url.includes('localhost') ? `http://${url}` : `https://${url}`
    }

    // Remover trailing slash si existe
    url = url.endsWith('/') ? url.slice(0, -1) : url

    return url
}