import {
  cpSync,
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, resolve } from 'node:path'

const templateKey = process.argv[2]?.trim()

if (!templateKey || !/^[a-z0-9][a-z0-9-]*$/.test(templateKey)) {
  console.error('Uso: npm run template:create -- cliente-ou-renderer')
  process.exit(1)
}

const projectRoot = resolve(import.meta.dirname, '..')
const blueprintPath = resolve(projectRoot, 'app/components/templates/pharmacy')
const targetPath = resolve(projectRoot, 'app/components/templates', templateKey)
const templateName = templateKey
  .split('-')
  .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
  .join('')
const brandingName = `${templateName.charAt(0).toLowerCase()}${templateName.slice(1)}Branding`

if (existsSync(targetPath)) {
  console.error(`O template ${templateKey} já existe.`)
  process.exit(1)
}

cpSync(blueprintPath, targetPath, { recursive: true })

const customizeBlueprint = (directory) => {
  for (const entry of readdirSync(directory)) {
    const entryPath = resolve(directory, entry)

    if (statSync(entryPath).isDirectory()) {
      customizeBlueprint(entryPath)
      continue
    }

    const source = readFileSync(entryPath, 'utf8')
      .replaceAll('pharmacyBranding', brandingName)
      .replaceAll('pharmacy.config', `${templateKey}.config`)
      .replaceAll('Pharmacy', templateName)

    writeFileSync(entryPath, source)

    const renamedEntry = basename(entryPath)
      .replaceAll('pharmacy.config', `${templateKey}.config`)
      .replaceAll('Pharmacy', templateName)

    if (renamedEntry !== basename(entryPath)) {
      renameSync(entryPath, resolve(dirname(entryPath), renamedEntry))
    }
  }
}

customizeBlueprint(targetPath)

console.log(`Template ${templateKey} criado a partir do blueprint Farmácia.`)
console.log(`Personalize ${targetPath} e associe o campo folder do Template técnico a "${templateKey}".`)
