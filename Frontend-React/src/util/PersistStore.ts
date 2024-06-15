import jwt, { JwtPayload } from "jsonwebtoken";
import Cookies from "js-cookie";

const hashAlgorithm = (s: string): string => {
  return (
    process.env.JWT_SECRET ??
    "7S&Yd@t4^E*f6PLg9!sHj2%Gm5R*pQ" + s + "7S&Yd@t4^E*f6PLg9!sHj2%Gm5R*pQ"
  );
};

export const saveState = (name: string, state: any) => {
  try {
    const crypto: string = jwt.sign(
      state,
      process.env.JWT_SECRET || "7S&Yd@t4^E*f6PLg9!sHj2%Gm5R*pQ",
      {
        expiresIn: "7d",
      }
    );
    Cookies.set(name, crypto, { expires: 7 });
    Cookies.set(`${name}Token`, hashAlgorithm(JSON.stringify(state)), {
      expires: 7,
    });
  } catch (error: any) {}
};

export const getState = (name: string) => {
  try {
    const crypto: string | undefined = Cookies.get(name);
    if (crypto) {
      const state: JwtPayload = jwt.verify(
        crypto,
        process.env.JWT_TOKEN || "7S&Yd@t4^E*f6PLg9!sHj2%Gm5R*pQ"
      ) as JwtPayload;
      const token: string | undefined = Cookies.get(`${name}Token`);
      delete state.exp;
      delete state.iat;
      if (token && token === hashAlgorithm(JSON.stringify(state))) {
        return state;
      }
    }
    Cookies.remove(name);
    Cookies.remove(`${name}Token`);
    return;
  } catch (error: any) {}
};

export const deleteState = (name: string) => {
  Cookies.remove(name);
  Cookies.remove(`${name}Token`);
};
