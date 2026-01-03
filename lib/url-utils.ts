export function getSiteUrl() {
    let url =
        process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.NEXT_PUBLIC_VERCEL_URL ??
        'http://localhost:3000'

    // No remover /auth/callback si viene en la variable
    // url = url.replace(/\/auth\/callback\/?$/, '')

    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`

    // NO agregar trailing slash aquí
    url = url.endsWith('/') ? url.slice(0, -1) : url

    return url
}