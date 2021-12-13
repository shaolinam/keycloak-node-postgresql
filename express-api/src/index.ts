import express from 'express';
import Token from 'keycloak-connect/middleware/auth-utils/token'
import Signature from 'keycloak-connect/middleware/auth-utils/signature'

var app = express();

const protectMiddleware = (req, res, next) => {
  // const tokenRaw = headers.authorization.split(" ").slice(-1)[0]
  
  let headers = req.headers;
  // console.log("Header: ", headers)
  
  // if (!headers.authorization) {
    //   headers.authorization = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJESFh5S2dWQVVzWFBfM0xVUURMcjA3NUprNlRleHNSQng0OEN0NGlKbjRnIn0.eyJleHAiOjE2MzkwODQzMzQsImlhdCI6MTYzOTA4NDAzNCwianRpIjoiY2ExYzJkMGYtNmQ5OS00ZDkwLWI4NTYtNTk5OWE1ZmRiMjkwIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL215LXJlYWxtIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjY2MDc5ZWQ0LWM3NTktNGM5MC1hZjdkLThkYmZlY2MwMWQ0NSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImV4cHJlc3Mtd2ViIiwic2Vzc2lvbl9zdGF0ZSI6ImVlZWU1ZmM2LTQxOTUtNDNkNS1iN2IyLWM5ZDNkZWZiZWQ3MSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1teS1yZWFsbSIsImdlcmVudGUiXX0sInJlc291cmNlX2FjY2VzcyI6eyJleHByZXNzLXdlYiI6eyJyb2xlcyI6WyJ0ZXN0ZSJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsInNpZCI6ImVlZWU1ZmM2LTQxOTUtNDNkNS1iN2IyLWM5ZDNkZWZiZWQ3MSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiRmFiaW8gQ2FydmFsaG8iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ1c2VyMUB1c2VyLmNvbSIsImdpdmVuX25hbWUiOiJGYWJpbyIsImZhbWlseV9uYW1lIjoiQ2FydmFsaG8iLCJlbWFpbCI6InVzZXIxQHVzZXIuY29tIn0.SOqGd-vSi4CaCdkA2LWm7WLifH-yV4CgScVgig6Z33TFCfxkeCHEfoxpJlpFqB8H8YOY92U1dF-b8Cd7YGmV5LUhaQ0MCVgQ_nJ1V0uX4kLOgZcKVUuD60N91WbRpFoCH4QQWybeS6bQ-tvGtYs9W-Ik6CbvOgq4PTdyHDYn_A9pLZbTFEcGCn_OPdBlz6SgDrbA1TRmbfZiRJAmkCPXPVHzpJ1P5YsUU3rXJmhc1moUBJbj25D0XvOjrfUUt98zrVhyvgQBrsZZxA1mcEk6JFoenlQDOXDwk1eKWKD1-_uTE-mW7_x2gK2KEfSXbMUER8b5OPx_vEz9w5srGQl_hw'
    // } 
    
    const tokenRaw = headers.authorization.replace("Bearer ", "")
    
    const token = new Token(tokenRaw, "express-api")
  
  try {
    
    const signature = new Signature({
      realmUrl: 'http://localhost:8080/auth/realms/my-realm',
      publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgTfOQlVPljipf3o3IHDJlgnQuG+5I4FLJ6ZwuhgpUWS7/740fL1i6ng4Hs5vpWqSGJSaL/zexC+zwBvPa9Nnh6ETQKw/jI/GdpQaHthcmGZm4TAU81BvOoZ4ocK028YJbdHegmtPRqM66nz5zD3btce6bgswg3Bfmxojyz1uAwhxoEjMA4esnVUMGiJIinEIrcnh7vFZ1RPUmj5Aab5F9Eq/RRroeypv+rn8poXvNinVlnSUBZQeCXpJn+YxxY5y5hlUeUolA5DyWkI5bSgGp/5/VDYmUGyCidqjYSHKtDR0ulKkzjFhpZT7H0qoDESn2/zjikVqrX4YbD3NZxVl9QIDAQAB",
      minTimeBetweenJwksRequests: 0
    })
    
    if (!token) res.status(400).json({ headers, token })

    signature
    .verify(token, null)
    .then((token) => {
      req.user = token
      next()
    })
    .catch((err) => {
      console.error(err)
      res.status(401).json({ message: "Unauthenticated"})
    })
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: "Token cannot be manipulated"})
  }
}

app.use(protectMiddleware)

app.get('/', function (req, res, next) {
  //@ts-ignore
  console.log(req.user)
  res.json({ key: 'value'})
})

app.listen(3001, '0.0.0.0'), () => {
  console.log('Running in http://localhost:3001')
}
