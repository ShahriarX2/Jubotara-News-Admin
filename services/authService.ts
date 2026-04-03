import { cookies } from "next/headers";

export const login = async (
  email: string,
  password: string,
): Promise<string | undefined> => {
  try {
    const res = await fetch(
      "https://jubotara-news-api.onrender.com/api/v1/auth/login",
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
    } else {
      throw new Error("Login failed");
    }
    return data.token;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};
