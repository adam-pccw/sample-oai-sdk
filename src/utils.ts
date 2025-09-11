import fs from 'node:fs'

const fileToBase64 = (filePath: string): string => {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.toString('base64');
}

export {fileToBase64}