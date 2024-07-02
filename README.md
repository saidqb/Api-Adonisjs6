# Api-Adonisjs6

[Full Documentation Adonisjs](https://docs.adonisjs.com/guides/preface/introduction)

Command pallate ``F1`` Vscode

```
AdonisJS VSCode extension
Edge VSCode extension
Japa VSCode extension
```

# command cheatsheet
hanya bantuan sekilas

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

## advance
```
node ace make:command greet
```
