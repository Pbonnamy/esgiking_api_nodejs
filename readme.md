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
- /auth/login `(POST)`
  ```
  - login
  - password
- /auth/register `(POST)`
  ```
  - login
  - password
  - type `(2 : admin, 3 : employee, 4 : client, 5 : deliverer)`
  - restaurant `(only if user_type 2, 3 or 5)`
  - address `(only if user_type 4)`
- /auth/me `(GET)` -> get token info
- /users `(GET)` -> show all `(only if user_type 1 or 2, required ?restaurant={id} if user_type 2)`
- /users/{id} `(GET)` -> show one 
- /users/{id} `(PUT)` -> update one `(only if user_type 1, 2, 4 or 5)`
  ```
  - login
  - password
  - lat `(only if user_type 5)`
  - long `(only if user_type 5)`
  - address `(only if user_type 4)`
- /users/{id} `(DELETE)` -> delete one `(only if user_type 1 or 2)`

**RESTAURANTS**

- /restaurants `(POST)` -> create `(only if user_type 1)`
  ```
  - name
  - address
  - phone
  - description `(optionnal, default null)`
- /restaurants `(GET)` -> show all
- /restaurants/{id} `(GET)` -> show one
- /restaurants/{id} `(DELETE)` -> delete one `(only if user_type 1)`
- /restaurants/{id} `(PUT)` -> update one `(only if user_type 1 or 2)`
  ```
  - name
  - address
  - phone
  - description 

**DISHES**

- /restaurants/{restaurant}/dishes `(GET)` -> show all
- /restaurants/{restaurant}/dishes/{id} `(GET)` -> show one
- /restaurants/{restaurant}/dishes `(POST)` -> create one `(only if user_type 1 or 2)`
  ```
  - name
  - price
  - discount `(optionnal, default 0)`
- /restaurants/{restaurant}/dishes/{id} `(PUT)` -> update one `(only if user_type 1 or 2)`
  ```
  - name
  - price
  - discount 
- /restaurants/{restaurant}/dishes/{id} `(DELETE)` -> delete one `(only if user_type 1 or 2)`

**Menus**

- /restaurants/{restaurant}/menus `(GET)` -> show all 
- /restaurants/{restaurant}/menus/{id} `(GET)` -> show one
- /restaurants/{restaurant}/menus `(POST)` -> create one `(only if user_type 1 or 2)`
  ```
  - name
  - price
  - discount
  - dishes[]
- /restaurants/{restaurant}/menus/{id} `(PUT)` -> update one `(only if user_type 1 or 2)`
  ```
  - name
  - price
  - discount
  - dishes[]
- /restaurants/{restaurant}/menus/{id} `(DELETE)` -> delete one `(only if user_type 1 or 2)`


**Orders**

- /restaurants/{restaurant}/orders `(GET)` -> show all `(only if user_type 1, 2 or 3)`
- /restaurants/{restaurant}/orders/{id} `(GET)` -> show one
- /restaurants/{restaurant}/orders `(POST)` -> create one `(only if user_type 4)`
  ```
  - dishes[]
  - menus[]
  - take_away
- /restaurants/{restaurant}/orders/{id} `(PUT)` -> update one
  ```
  - dishes[]
  - menus[]
  - status `(1 : ordered, 2 : preparation, 3 : delivering, 4 : delivered)`
- /restaurants/{restaurant}/orders/{id} `(DELETE)` -> delete one `(only if user_type 1, 2, 3 or 4)`
- /restaurants/{restaurant}/orders/{id}/messages `(POST)` -> create one
```
  - text

