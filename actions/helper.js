import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"

let _cachedUser = null;

export async function getCurrentUser() {
  if (_cachedUser) return _cachedUser;
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId }
  });
  if (!user) throw new Error("User not found");

  _cachedUser = user;
  return user;
}
