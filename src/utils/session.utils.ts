import Cookies from "js-cookie";

const decryptJwt = (token: string) => {
  var base64Url = token.split(".")[1];

  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const getRutCookieSession = () => {
  const tokenJWT = Cookies.get("token") || null;

  let rutSession: string | null = null;

  if (tokenJWT) {
    const tokenDecrypt = decryptJwt(tokenJWT);

    rutSession = tokenDecrypt.rut;
  }

  return rutSession;
};

export const getToken = () => {
  const tokenJWT = (Cookies.get("token") as string) ?? null;
  return tokenJWT;
};

export const eliminateDvFromRut = (rut: string) => {
  if (rut.indexOf("-") >= 0) {
    rut = rut.substring(0, rut.indexOf("-"));
  }

  return rut;
};
