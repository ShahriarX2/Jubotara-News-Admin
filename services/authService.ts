import { cookies } from "next/headers";

export const login = async (
  email: string,
  password: string,
): Promise<string | undefined> => {
  try {
    const res = await fetch(
      "/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      const cookieStore = await cookies();
      cookieStore.set("token", data.token, { path: "/" });
      return data.token;
    } 
    console.error("Login failed: No token received");
    return undefined;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};
