import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import { Terminal } from '../utils/terminal.utils'

dotenv.config()

const env = process.env.NODE_ENV || 'development'
const isTest = process.env.NODE_ENV === 'test'
const isDockerized = process.env?.DOCKERIZED && Boolean(process.env?.DOCKERIZED) === true

let sequelize: Sequelize

// if (isTest) {
//     sequelize = new Sequelize({
//         dialect: 'sqlite',
//         storage: ':memory:',
//         logging: false,
//     })
// } else 
if (isDockerized && !isTest) {
    // Regular PostgreSQL Connection for Dockerized environments
    sequelize = new Sequelize(`postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DB}`, {
        dialect: 'postgres',
        logging: env === 'development' && process.env.BACKEND_DATABASE_LOGGING === 'true' ? console.log : false,
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
        dialectOptions: {
            ssl: false
        }
    })
} else {
    // Default SQLite Connection for local development so node is happy
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: env === 'development' && process.env.BACKEND_DATABASE_LOGGING === 'true' ? console.log : false,
    })
}

(async () => {
    if (env === 'development' && isDockerized) {
        await new Promise(resolve => setTimeout(resolve, 5000)) // Give DB some time to be ready in Docker
    }
    await sequelize.authenticate()
})().then(async () => {
    if (env === 'development') await sequelize.sync({ alter: true })
    // if (env === 'production') await sequelize.sync()
    // if (env === 'test') await sequelize.sync({ force: true })

    // Create pg_trgm extension for better search performance if using PostgreSQL
    if (isDockerized) { // We only need this for PostgreSQL, and we assume Dockerized means PostgreSQL in this setup
        sequelize.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;').catch(err => {
            Terminal.error(`Error creating pg_trgm extension: ${err}`)
        })
    }
}).catch(error => {
    Terminal.error(`Unable to connect to the database: ${error}`)
})

export { sequelize }
