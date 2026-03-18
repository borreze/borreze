import path from 'path'
import { Terminal } from './utils/terminal.utils'
import fs from 'fs'
import { MEDIA_UPLOAD_DIR } from '@brz/shared'

const seed = async () => {
  const sourceDir = path.resolve(__dirname, `../seeds/${MEDIA_UPLOAD_DIR}`)
  const targetDir = path.resolve(__dirname, `../${MEDIA_UPLOAD_DIR}`)

  Terminal.info(`Seeding files from ${sourceDir} to ${targetDir}...`)

  try {

    // Ensure the target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    // Copie the whole directory
    fs.cpSync(sourceDir, targetDir, { recursive: true })
  } catch (error) {
    Terminal.error(`Error seeding files: ${error}`)
    throw error
  }

}

(async () => {
  try {
    await seed()
    Terminal.success('Files seeding completed successfully')
    process.exit(0)
  } catch (error) {
    Terminal.error(`Error running the script: ${error}`)
    process.exit(1)
  }
})()
