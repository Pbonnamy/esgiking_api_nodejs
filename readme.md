## EsgiKing

- `npm install`
- `npx tsc --init`
  - tsconfig.json →
    - "declaration": true,
    - "sourceMap": true,
    - "outDir": "./dist",
- `npx tsc`
---
- `npm run build`
- `npm run start`
---
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