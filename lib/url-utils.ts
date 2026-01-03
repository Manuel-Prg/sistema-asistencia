export function getSiteUrl() {
    let url =
        process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        'http://localhost:3000'

    // If the user set the variable to the full callback URL, strip it to get the origin
    url = url.replace(/\/auth\/callback\/?$/, '')

    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`
    // Make sure to include the trailing slash.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
    return url
}
