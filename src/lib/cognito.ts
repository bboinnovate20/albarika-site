import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";

const region = process.env.AWS_REGION ?? "us-east-1";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function secretHash(username: string, clientId: string, clientSecret: string) {
  return createHmac("sha256", clientSecret).update(username + clientId).digest("base64");
}

async function signIn(clientId: string, clientSecret: string, username: string, password: string) {
  // USER_PASSWORD_AUTH does not need IAM credentials, so this works on Vercel
  // without AWS_ACCESS_KEY_ID (AdminInitiateAuth would not).
  const result = await client.send(
    new InitiateAuthCommand({
      ClientId: clientId,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash(username, clientId, clientSecret),
      },
    }),
  );
  const token = result.AuthenticationResult?.AccessToken;
  if (!token) throw new Error(result.ChallengeName ? `Sign-in challenge: ${result.ChallengeName}` : "Sign-in did not return a session");
  return { accessToken: token, expiresIn: result.AuthenticationResult?.ExpiresIn ?? 3600 };
}

const client = new CognitoIdentityProviderClient({ region });

export function signInStudent(username: string, password: string) {
  return signIn(required("COGNITO_CLIENT_ID"), required("COGNITO_CLIENT_SECRET"), username, password);
}

export function signInStaff(username: string, password: string) {
  return signIn(required("COGNITO_STAFF_CLIENT_ID"), required("COGNITO_STAFF_CLIENT_SECRET"), username, password);
}
