// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  token?: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__otc_admin_session",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/admin",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

export {
  getSession as getAdminSession,
  commitSession as commitAdminSession,
  destroySession as destroyAdminSession,
};
