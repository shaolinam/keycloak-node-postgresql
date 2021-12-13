import KeycloakConnect from "keycloak-connect";
import session from "express-session";

 KeycloakConnect.prototype.accessDenied = (req, res) => {
  res.status(403).json({ message: 'Não Autorizado'})
 }

export const memmoryStore = new session.MemoryStore();

const config: KeycloakConnect.KeycloakConfig = {
  realm: 'my-realm',
  "auth-server-url": 'http://localhost:8080/auth',
  resource: 'express-web',
  "confidential-port": 0,
  "ssl-required": "external"
}

const keycloak = new KeycloakConnect({ store: memmoryStore }, config);

export default keycloak;
