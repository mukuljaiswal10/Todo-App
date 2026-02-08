export function getAppUrl() {
    const url =
        process.env.APP_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "http://localhost:3000";

    return url.replace(/\/$/, ""); // trailing slash remove
}