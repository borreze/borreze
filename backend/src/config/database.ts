import { Sequelize } from 'sequelize'
import { Terminal } from '../utils/terminal.utils'
import { config } from './config'

let sequelize: Sequelize

// if (config.env === 'test') {
//     sequelize = new Sequelize({
//         dialect: 'sqlite',
//         storage: ':memory:',
//         logging: false,
//     })
// } else 
if (config.dockerized && config.env !== 'test') {
    // Regular PostgreSQL Connection for Dockerized environments
    sequelize = new Sequelize(`postgresql://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`, {
        dialect: 'postgres',
        logging: config.env === 'development' && process.env.BACKEND_DATABASE_LOGGING === 'true' ? console.log : false,
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
        logging: config.env === 'development' && process.env.BACKEND_DATABASE_LOGGING === 'true' ? console.log : false,
    })
}

(async () => {
    if (config.env === 'development' && config.dockerized) {
        await new Promise(resolve => setTimeout(resolve, 5000)) // Give DB some time to be ready in Docker
    }
    await sequelize.authenticate()
})().then(async () => {
    // if (config.env === 'development') await sequelize.sync({ alter: true })
    if (config.env === 'development') await sequelize.sync({ alter: { drop: false } })
    // if (config.env === 'production') await sequelize.sync()
    // if (config.env === 'test') await sequelize.sync({ force: true })

    // Create pg_trgm extension for better search performance if using PostgreSQL
    if (config.dockerized) { // We only need this for PostgreSQL, and we assume Dockerized means PostgreSQL in this setup
        sequelize.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;').catch(err => {
            Terminal.error(`Error creating pg_trgm extension: ${err}`)
        })
    }
}).catch(error => {
    Terminal.error(`Unable to connect to the database: ${error}`)
})

export { sequelize }
