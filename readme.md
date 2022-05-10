## EsgiKing

- `npm install`
- `npx tsc --init`
  - tsconfig.json →
    - "declaration": true,
    - "sourceMap": true,
    - "outDir": "./dist",
- `npx tsc`
- create .env & fill vars
  - secret : any strong random string

- `npm run build`
- `npm run start`
---

**USERS**
- /auth
  - /login `(POST)`
    - login
    - password
  - /register `(POST)`
    - login
    - password
    - type `(2 : admin, 3 : employee, 4 : client)`
    - restaurant `(only if type 2 or 3)`
  - /me `(GET)`

**RESTAURANTS**
- /restaurants
  - `(POST)` -> create
    - name
    - address
    - phone
    - description `(optionnal)`
  - `(GET)` -> show all
  - /{id} `(GET)` -> show one
  - /{id} `(DELETE)` -> delete one
  - /{id} `(PUT)` -> update one
    - name `(optionnal)`
    - address `(optionnal)`
    - phone `(optionnal)`
    - description `(optionnal)`

**DISHES**
- /restaurants/{restaurant}/dishes `(GET)` -> show all
- /restaurants/{restaurant}/dishes `(POST)` -> create one
  - name
  - price
- /dishes/{id} `(PUT)` -> update one
  - name `(optionnal)`
  - price `(optionnal)`
- /dishes/{id} `(DELETE)` -> delete one