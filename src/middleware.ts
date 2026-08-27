import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16+ için proxy export, eski sürümler için middleware de dışa aktar
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Geriye dönük uyumluluk
export { proxy as middleware };

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
