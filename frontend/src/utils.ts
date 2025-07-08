import { User } from "./generated/graphql";

export function isAuth() {
  return (
    localStorage.getItem("token") != null &&
    localStorage.getItem("token") !== undefined
  );

  // check if token valid (not expired)
}

export function setTokenLocalStorage(token: string) {
  localStorage.setItem("token", token);
}

export function setUserLocalStorage(user: User) {
  if (user === undefined || user === null) return;

  localStorage.setItem("user", JSON.stringify(user));
}

export function getUserLocalStorage(): User | undefined {
  const userString = localStorage.getItem("user");
  if (userString != null) return JSON.parse(userString);

  return undefined;
}

export function logout() {
  localStorage.removeItem("token");
}

export const HOME = "/home";
export const LOGIN = "/";
