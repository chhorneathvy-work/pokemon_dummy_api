import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { HandleJWTExpireTokenError } from "../functions/HandleJWTExpireTokenError";

export const getUser = (token: string) => {
  try {
    if (!token) {
      throw new GraphQLError(
        `{"errorMessage": "Invalid Token!", "typeError": "auth_error"}`
      );
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY, {
      maxAge: "30d",
    });
    return decodedToken;
  } catch (error) {
    return HandleJWTExpireTokenError(error);
  }
};
