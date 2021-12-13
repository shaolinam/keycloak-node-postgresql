import express from 'express';
import keycloak, { memmoryStore } from './keycloak';
import session from 'express-session';
import axios from 'axios';

var app = express();

app.use(
  session({
    secret: '1234567890',
    resave: false,
    saveUninitialized: true,
    store: memmoryStore,
    cookie: {
      maxAge: 1000 * 60 * 10
    }
  })
)

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/'
}))

app.get('/', keycloak.protect("realm:gerente"), function (req, res, next) {
  //@ts-ignore
  // console.log("Access_Token: ",req.kauth.grant.access_token)
  //@ts-ignore
  // console.log("Id_Token: ", req.kauth.grant.id_token)
  // console.log("Id_Token: ", req.kauth.grant.id_token.content)
  res.json('Hello Wolrd')
})

app.get('/consume-api', keycloak.protect(), async (req, res, next) => {
  try {
    const { data } = await axios.get('http://localhost:3001', {
      headers: {
        //@ts-ignore
        Authorization: `Bearer ${req.kauth.grant.access_token.token}`,
      }
    })
    res.json(data)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: e.message })
  }
})

app.listen(3000, '0.0.0.0'), () => {
  console.log('Running in http://localhost:3000')
}
