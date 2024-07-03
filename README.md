
[Full Documentation Adonisjs](https://docs.adonisjs.com/guides/preface/introduction)

Fork From [AdonisJS-6-REST-API](https://github.com/rayhannovelo/AdonisJS-6-REST-API/tree/main)

# Api-Adonisjs 

Version: 6

## Description:
This project is an example of implementing key features in AdonisJS 6 for REST API with Access Tokens as its auth guard.

## Requirements:
- **Node.js** >= 20.6


## Features:
- **User Authentication (Access Token)**: adding features for login, logout, manage profile using token, and refresh token
- **User Authorization (Bouncer)**: adding user abilities and post policies
- **Database (Lucid)**: implementing migration, seeder, and relationship model
- **Validation (VineJS)**: adding custom rules for exists and unique
- **Middleware**: implementing auth and bouncer middleware
- **Exception Handling**: adding handling errors for route not found, unauthorized access, unauthorized action (Bouncer), validation error (VineJS), custom database error (Lucid)
- **CRUD Examples**: users, user roles, user statuses and posts
- **Others**: add global helper, add global constants, and add uploaded file route


=====================

**Command pallate ``F1`` Vscode**

```
AdonisJS VSCode extension
Edge VSCode extension
Japa VSCode extension
```

# command cheatsheet
hanya bantuan sekilas

### App-key
```
node ace generate:key 
```

### Controller
```
node ace make:controller users
```

Menggunakan library [lucid](https://lucid.adonisjs.com/docs/introduction)
### Migration
```
node ace make:migration users
# CREATE: database/migrations/1630981615472_users.ts

node ace migration:run

# Rollback the latest batch
node ace migration:rollback

# Rollback until the start of the migration
node ace migration:rollback --batch=0

# Rollback until batch 1
node ace migration:rollback --batch=1

node ace migration:reset

node ace migration:refresh

# Refresh the database and run all seeders
node ace migration:refresh --seed

```

### Seeder
```
node ace make:seeder User

# runs all
node ace db:seed
# runs Specified file
node ace db:seed --files "./database/seeders/user_seeder.ts"
# Interactive mode
node ace db:seed -i

```

### Model
```
node ace make:model User
# CREATE: app/Models/User.ts


node ace make:model User -m
# CREATE: database/migrations/1618903673925_users.ts
# CREATE: app/Models/User.ts

node ace make:model User -f
# CREATE: app/Models/User.ts
# CREATE: database/factories/User.ts
```


### View
```
node ace make:view email/test
```

## advance
```
node ace make:command greet
```


# postman

## postman

Akses data login
```
Authorization: Bearer <token>
```
token didapat dari login

## postman response default

display single data
```json
{
  "status": 200,
  "success": true,
  "error_code": 0,
  "message": "success",
  "data": {
      "item": {}
  }
}
```

display multiple data
```json
{
  "status": 200,
  "success": true,
  "error_code": 0,
  "message": "success",
  "data": {
      "items": [],
      "pagination" : {}
  }
}
```
