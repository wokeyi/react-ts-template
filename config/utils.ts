import * as path from 'path'
import * as fs from 'fs'

export function resolve(relativePath: string) {
 return path.resolve(__dirname, '..', relativePath)
}

export function getEnvVariables() {
  const filename = `.env.${process.env.NODE_ENV}.local`
  const fullPath = resolve(filename)
  if (fs.existsSync(fullPath)) {
    const fileContent = fs.readFileSync(fullPath, 'utf-8')
    const lines = fileContent.split('\n')

    return {
      'process.env': lines.reduce((variables, line) => {
        if (line.startsWith('APP_')) {
          const [key, value] = line.split('=')
          variables[key] = JSON.stringify(value)
        }
        return variables
      }, {} as any)
    }
  }
  return {}
}