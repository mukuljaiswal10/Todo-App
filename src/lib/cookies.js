export const accessCookieName = "at";
export const refreshCookieName = "rt";

export function cookieOptions() {
    const secure = String(process.env.COOKIE_SECURE) === "true";
    return {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
    };
}

export function accessCookieOpts() {
    return {
        ...cookieOptions(),
        maxAge: 60 * 15, // 15 min
    };
}

export function refreshCookieOpts() {
    return {
        ...cookieOptions(),
        maxAge: 60 * 60 * 24 * 30, // 30d
    };
}