import path from 'path'
import fs from 'fs'
import { sequelize } from './config/database'
import { Category, HomeQuick, Media, Post, Role, Schedule, User } from './models'
import { Model, ModelStatic } from 'sequelize'
import { hashPassword, isHash } from './utils/auth.utils'
import { Terminal } from './utils/terminal.utils'
import { Categorizable } from './models/categorizable.model'

const seed = async () => {
  const models: { model: ModelStatic<Model>; file: string }[] = [
    {
      model: Role,
      file: 'role.seed.json'
    },
    {
      model: User,
      file: 'user.seed.json'
    },
    {
      model: Media,
      file: 'media.seed.json'
    },
    {
      model: Post,
      file: 'post.seed.json'
    },
    {
      model: Category,
      file: 'category.seed.json'
    },
    {
      model: Categorizable,
      file: 'categorizable.seed.json'
    },
    {
      model: Schedule,
      file: 'schedule.seed.json'
    },
    {
      model: HomeQuick,
      file: 'home-quick.seed.json'
    },
  ]

  await sequelize.authenticate()
  await sequelize.sync({ force: true })

  for (const { model, file } of models) {
    try {
      Terminal.info(`Seeding data for ${model.name}...`)

      // Drop existing data
      await model.truncate({ cascade: true })

      // Parse the seed file
      const filePath = path.resolve(__dirname, `../seeds/models/${file}`)
      if (!fs.existsSync(filePath)) throw new Error(`Seed file not found: ${filePath}`)

      // Read and parse the JSON file
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      if (!Array.isArray(data)) throw new Error(`Seed file format invalid for ${model.name} — must be an array`)

      // Hash passwords if seeding users
      if (model === User) {
        for (const user of data) {
          if (!isHash(user.password)) {
            user.password = await hashPassword(user.password)
          }
        }
      }

      // Insert data into the database
      await model.bulkCreate(data, { validate: false })

      // Reset autoincrement to seed length + 1, so data can still be added once the seed is run
      if (model.primaryKeyAttribute === 'id') {
        const tableName = model.getTableName()
        await sequelize.query(
          `SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), :val)`,
          { replacements: { val: (data?.length + 1) } }
        )
      }

      Terminal.success(`Inserted ${data.length} records into ${model.name} database`)
    } catch (error) {
      Terminal.error(`Error while seeding ${model.name}: ${error}`)
      process.exit(1)
    }
  }
}

(async () => {
  try {
    await seed()
    Terminal.success('Models seeding completed successfully')
    process.exit(0)
  } catch (error) {
    Terminal.error(`Error running the script: ${error}`)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
})()
