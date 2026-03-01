# Borrèze

## 📦 - Requirements

- **Git**: https://git-scm.com/downloads
- **Node.js**: https://nodejs.org/en/download/, pick the LTS version
- **npm**: Comes with Node.js, but you can also install it separately if needed.
- **Nuxt CLI** (frontend): `npm i -g nuxt`
- **Docker** + **Docker Compose**: https://docs.docker.com/get-docker/
- Any chromium-based **browser**: https://www.google.com/chrome/
- Any **IDE**: 
  - Visual Studio Code: https://code.visualstudio.com/
  - JetBrains IDEs: https://www.jetbrains.com/
  - ...
- **Postman** (optional, for API testing): https://www.postman.com/downloads/
- **Looping** (optional, DB design): https://www.looping-mcd.fr/

---

## 🚀 - Quick start

### With Docker

```sh
# Clone the repo
git clone git@github.com:borreze/borreze.git

# Move into the project directory
cd borreze

# Copy .env.development file to .env and fill in the required environment variables.
cp .env.development .env

# Start the development server
docker-compose down ; docker-compose --profile development up --build -d

# Install both frontend dependencies
# You may want to install dependencies despite Docker, especially for IDE linters and type checking.
cd frontend ; npm i
cd ../backend ; npm i
```

#### Useful Docker Commands

```powershell
# "Nuke" command: cleans up all Docker containers, images, and volumes
# This is useful for starting fresh or cleaning up after a development session.
docker stop $(docker ps -aq) 2>$null; docker system prune -a --volumes -f; docker builder prune -a -f
```

```sh
# Stop all services
docker-compose down

# Start in Development
docker-compose --profile development up --build -d

# Start in Production
docker-compose --profile production up --build -d

# Restart in development mode
docker-compose --profile development down -v ; docker-compose --profile development up -d

# Get all frontend env variables
docker exec -it borreze-brz-frontend-dev-1 printenv

# Run seeder
docker exec -it borreze-brz-backend-dev-1 sh -c "npm run seed"

# Clear database
docker-compose down
docker volume rm borreze_brz-postgres_data
docker-compose up --build

# Clean everything
docker-compose down -v --rmi all

# View logs
docker-compose logs -fp
```

---

### The old fashioned way (not recommended)

This method is not recommended since Postgres and Redis will not be available.
But it can still be used for quick debugging.

```sh
# Clone the repo
git clone git@github.com:borreze/borreze.git

# Move into the project directory
cd borreze

# Copy .env.development file to .env and fill in the required environment variables.
cp .env.development .env

# Start the development server
cd frontend ; npm i ; npm run dev
cd ..
cd backend ; npm i ; npm run dev
```

---

### Seeding the database

Because working with data is always a good idea, you can seed the database with some initial data.

All the seeding logic is in the `src/seeder.ts` file. All data is stored in the `backend/seeds/` directory.

```sh
docker exec -it borreze-brz-backend-dev-1 sh
npm run seed
```

Somehow, Sequilize might not increment the IDs correctly after a seed. This could lead to conflicts when using the API to create new entries right after a seed.
Should be fixed by the time you read this, but keep this in mind if you encounter issues.

## 👯 - Contributing

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to this project.

## 🤖 - AI

Feel free to use AI to generate content, answer questions, and assist with various tasks related to the project.

`AGENTS.md` contains information for AI agents on how to interact with the project. You can either use configure IDEs to apply these rules or manually paste them into any LLM you prefer.

---

## 📚 - Documentation

A swagger documentation for the API is available at `<API_URL>/swagger` when running the backend locally.

A [SNIPPETS.md](SNIPPETS.md) file is also available with useful code snippets for both frontend and backend.

---

## ⚡ - Technologia

### Containerization

This project uses Docker for containerization. The `docker-compose.yml` file defines the services, networks, and volumes needed to run the application.

Both of the frontend and backend containers are built using the `Dockerfile` in their respective directories.
Each directory has 2 `Dockerfile` files:
- `Dockerfile.prod`: Used for production/preproduction builds.
- `Dockerfile.dev`: Used for development builds.

The `docker-compose.yml` provide a `DOCKERIZED` environment variable to each service, which is set to `true` when running in a Docker container. It allows the application to adapt its behavior based on the environment.

### Stack & structure

```sh
├── .github/        # All Github stuff
├── docs/           # Documentation
├── frontend/       # Nuxt.js (Vue 3) application
│   ├── components/
│   ├── pages/
│   └── ...
├── backend/        # Express API
│   ├── seeds/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── errors/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── app.ts
│   │   ├── seeder.ts
│   │   ├── server.ts
│   │   ├── swagger.json
│   │   └── ...
│   ├── tests/
│   └── ...
├── .env.development
├── .gitignore
├── docker-compose.yml
├── LICENSE
└── README.md
``` 

- **frontend/**: Contains the entire Nuxt.js application.
- **backend/**: Contains the Express server and API code.

---

### Frontend

#### Components

Frontend components are organized in the `frontend/components/` directory, following the Atomic Design principles:
- `atoms/`: Basic building blocks (e.g. buttons, inputs, icons). `atoms/` should be as dumb as possible, without any logic or state management. It should never import any other component.
- `molecules/`: Combinations of atoms that form more complex components (e.g. cards, modals).
- `organisms/`: Groups of molecules that form distinct sections of the UI (e.g. header, footer, event list).

In each of those directories, you can find two subdirectories:
  - `admin/`: Contains components specific to the back-office.
  - `site/`: Contains components specific to the public-facing site.

### Notifications

This project uses `Notivue` for notifications.

You can find the documentation here:
https://docs.notivue.smastrom.io/

#### Icons

List of available icons: https://icones.js.org/

---

### Backend

...

---

### PGAdmin

Setup:
- Open pgAdmin in your browser (usually at `http://localhost:${DBMS_PORT}`).
- Login using the email and password from your environment variables (`DBMS_EMAIL`, `DBMS_PASSWORD`).
- Add a new server:
  - Right-click `Servers` > `Create` > `Server...`
  - General tab:
    - Name: Any name (e.g. `Borreze Postgres`)
  - Connection tab:
    - Host: `brz-postgres-all` (the service name from docker-compose.yml)
    - Port: `5432`
    - Username: `${DATABASE_USER}` (from the .env)
    - Password: `${DATABASE_PASSWORD}` (from the .env)
    - Maintenance DB: `${DATABASE_DB}` (from the .env)
- Save and connect.

## 👨‍💻 - Snippets

You can find useful code snippets in the [SNIPPETS.md](SNIPPETS.md) file.

## 🌿 - Git

### Branching Strategy

We use a Git workflow based on two main branches:

| Branch    | Purpose                                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| `main`    | Production-ready code. All hotfixes and critical patches land here.                                             |
| `preprod` | Integration branch for new features and non-critical fixes. Reviewed changes merge here before going to `main`. |
| `develop` | A development branch for ongoing work. Can be used for feature branches or as a staging area before `preprod`.  |

> **Note:** All contributions **must** go through **Merge Requests** (MRs). Direct pushes to `main` or `preprod` are **not** allowed.

Please check the [CONTRIBUTING.md](CONTRIBUTING.md) file for more details on branching, commits, code style, and pull request guidelines.

---

## 🛠️ - CI/CD

This project uses GitHub Actions for CI/CD. Workflows are defined in `.github/workflows/*`.

Architecture:
- All `*.inc.yml` files are meant to be included in other workflows, allowing for modular and reusable configurations.
- All `*.flow.yml` are the main workflows that orchestrate the CI/CD process.

It includes:
- `tests.inc.yml` : Contains reusable steps for running tests and linting on both frontend and backend.
- `tests.flow.yml`: Runs tests and linting for both frontend and backend.
- `deploy.flow.yml`: Handles deployment to pre-production and production environments.

### Secret Management

All those secrets should be set in the GitHub repository settings under "Secrets and variables" -> "Actions":

Pre-production specific secrets:
- `PREPROD_SSH_HOST`: The SSH host for the pre-production server.
- `PREPROD_SSH_USER`: The SSH user for the pre-production server.
- `PREPROD_SSH_PRIVATE_KEY`: The private SSH key for the pre-production server.
- `PREPROD_FOLDER`: The folder on the pre-production server where the project will be deployed (from `/home/<PREPROD_SSH_USER>/`).
- `PREPROD_DATABASE_DB`
- `PREPROD_DATABASE_USER`
- `PREPROD_DATABASE_PASSWORD`
- `PREPROD_DBMS_PORT`
- `PREPROD_DBMS_EMAIL`
- `PREPROD_DBMS_PASSWORD`
- `PREPROD_BACKEND_PORT`
- `PREPROD_BACKEND_CORS_ORIGIN`
- `PREPROD_BACKEND_DATABASE_LOGGING`
- `PREPROD_BACKEND_JWT_SECRET`
- `PREPROD_BACKEND_JWT_EXPIRES`
- `PREPROD_BACKEND_SMTP_HOST`
- `PREPROD_BACKEND_SMTP_PORT`
- `PREPROD_BACKEND_SMTP_USER`
- `PREPROD_BACKEND_SMTP_PASS`
- `PREPROD_BACKEND_SMTP_FROM`
- `PREPROD_FRONTEND_PORT`
- `PREPROD_FRONTEND_URL`
- `PREPROD_FRONTEND_API_BASE_URL_SSR`
- `PREPROD_FRONTEND_API_BASE_URL_CLIENT`
- `PREPROD_FRONTEND_NOINDEX`

Production specific secrets:
- `PROD_SSH_HOST`: The SSH host for the production server.
- `PROD_SSH_USER`: The SSH user for the production server.
- `PROD_SSH_PRIVATE_KEY`: The private SSH key for the production server.
- `PROD_FOLDER`: The folder on the production server where the project will be deployed (from `/home/<PROD_SSH_USER>/`).
- `PROD_DATABASE_DB`
- `PROD_DATABASE_USER`
- `PROD_DATABASE_PASSWORD`
- `PROD_DBMS_PORT`
- `PROD_DBMS_EMAIL`
- `PROD_DBMS_PASSWORD`
- `PROD_BACKEND_PORT`
- `PROD_BACKEND_CORS_ORIGIN`
- `PROD_BACKEND_DATABASE_LOGGING`
- `PROD_BACKEND_JWT_SECRET`
- `PROD_BACKEND_JWT_EXPIRES`
- `PROD_BACKEND_SMTP_HOST`
- `PROD_BACKEND_SMTP_PORT`
- `PROD_BACKEND_SMTP_USER`
- `PROD_BACKEND_SMTP_PASS`
- `PROD_BACKEND_SMTP_FROM`
- `PROD_FRONTEND_PORT`
- `PROD_FRONTEND_URL`
- `PROD_FRONTEND_API_BASE_URL_SSR`
- `PROD_FRONTEND_API_BASE_URL_CLIENT`
- `PROD_FRONTEND_NOINDEX`

Used in both pre-production and production deployments:
- `DOCKERHUB_USERNAME`: Your Docker Hub username.
- `DOCKERHUB_TOKEN`: Your Docker Hub access token (Personal Access Token). Can technically be your password, but it's not recommended.

Used by the workflow:
- `PROJECT_URL`: The GitHub repository URL (e.g. `https://github.com/username/repo`)
- `PROJECT_TOKEN`: A GitHub token with permissions to read the repository and create releases. You can use the default `GITHUB_TOKEN` provided by GitHub Actions, but it has some limitations (e.g. it cannot trigger other workflows). For more advanced use cases, you can create a custom token in your GitHub account settings.

#### Creating a GitHub Personal Access Token (PAT)

- GitHub => `Settings` => `Developer settings` => `Personal access tokens` => `Tokens (classic)`
- Generate new token => select the following scopes:
  - `repo` (Full control of private repositories)
  - `read:repo_hook` (Read repository hooks)
  - `write:repo_hook` (Write repository hooks)
  - `read:org` (Read org and team membership)
  - `read:project` (Read project boards)
- Copy the generated token and add it to your GitHub repository secrets as `PROJECT_TOKEN`.

### Server environment

Ensure that the user specified in `PREPROD_SSH_USER` and `PROD_SSH_USER` is in the `docker` group on the server to allow Docker commands without `sudo`:
```sh
sudo usermod -aG docker <USER>
# Then restart the session or server
```

#### UFW Configuration


To avoid exposing internal services, configure UFW (Uncomplicated Firewall) to allow only necessary traffic:

```sh
apt install ufw -y

# Allow SSH
ufw allow 20/tcp

# Allow Web traffic (a2)
ufw allow 80/tcp
ufw allow 443/tcp

# Block access to containers' internal ports
ufw deny 5001 # PostgreSQL
ufw deny 5004 # Prod PG Admin
ufw deny 5002 # Prod backend
ufw deny 5003 # Prod frontend
ufw deny 4001 # PostgreSQL
ufw deny 4004 # Preprod PG Admin
ufw deny 4002 # Preprod backend
ufw deny 4003 # Preprod frontend

ufw enable
ufw status
```

#### Apache Configuration

Use both `apache.prod.conf` and `apache.preprod.conf` as templates for your Apache virtual host configuration.

Enable the required Apache modules and restart Apache:
```sh
sudo a2enmod proxy proxy_http proxy_wstunnel headers rewrite
sudo systemctl restart apache2
```

---

## 📝 - License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

---

## ❤️ - Thank You

Your contributions make this project better for everyone. We appreciate your time and effort! 🎉

<img src="https://media.tenor.com/bvXwJ4I19ZQAAAAi/cat-cat-meme.gif" width="400"/>

