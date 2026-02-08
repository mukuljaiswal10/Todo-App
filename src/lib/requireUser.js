import { verifyAccessToken } from "@/lib/jwt";
import { accessCookieName } from "@/lib/cookies";

export function getUserIdFromRequest(req) {
    const at = req.cookies.get(accessCookieName)?.value;
    if (!at) return null;

    try {
        const payload = verifyAccessToken(at);
        return payload?.sub || null;
    } catch {
        return null;
    }
}