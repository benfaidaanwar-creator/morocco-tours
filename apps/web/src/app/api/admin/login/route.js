import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const hashPassword = (password) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
};

const verifyPassword = (password, storedHash) => {
  const parts = (storedHash || "").split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") {
    return false;
  }
  const [, salt, expected] = parts;
  const actual = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .maybeSingle();
    throwIfSupabaseError(adminError);
    if (!admin) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (admin.password_hash === "$placeholder_change_on_setup$") {
      const hashedPassword = hashPassword(password);
      const { error: updateError } = await supabase
        .from("admin_users")
        .update({
          password_hash: hashedPassword,
          updated_at: new Date().toISOString(),
        })
        .eq("id", admin.id);
      throwIfSupabaseError(updateError);

      const token = Buffer.from(
        `${admin.id}:${Date.now()}:${admin.username}`,
      ).toString("base64");
      return Response.json({
        success: true,
        token,
        admin: { id: admin.id, username: admin.username },
        firstLogin: true,
      });
    }

    const validPassword = verifyPassword(password, admin.password_hash);
    if (!validPassword) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = Buffer.from(
      `${admin.id}:${Date.now()}:${admin.username}`,
    ).toString("base64");
    return Response.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
