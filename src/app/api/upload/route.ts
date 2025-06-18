import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'
import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'
import { Readable } from 'stream'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir,
    })

    if (!req.body) {
      throw new Error('Request body is missing')
    }
    function webStreamToNodeReadable(webStream: ReadableStream<Uint8Array>) {
      const reader = webStream.getReader();
      return new Readable({
        async read() {
          try {
            const { done, value } = await reader.read();
            if (done) {
              this.push(null);
            } else {
              this.push(Buffer.from(value));
            }
          } catch (err) {
            this.destroy(err as Error);
          }
        }
      });
    }

    const reqNodeCompatible = Object.assign(webStreamToNodeReadable(req.body as ReadableStream<Uint8Array>), {
      headers: Object.fromEntries(req.headers.entries()),
      method: req.method,
      url: '',
    })

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(reqNodeCompatible as unknown as import('http').IncomingMessage, (err, fields, files) => {
        if (err) reject(err)
        else resolve([fields, files])
      })
    })

    const fileArray = files?.file
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray

    if (!file || typeof file !== 'object' || !('filepath' in file)) {
      throw new Error('Uploaded file is missing or malformed')
    }
    const type = fields.type?.[0] || 'others'
    const publicId = fields.publicId?.[0] || undefined

    const buffer = await fs.readFile(file.filepath)

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `themotorcycle/${type}`,
          public_id: publicId,
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )

      Readable.from(buffer).pipe(stream)
    })

    const { secure_url } = result as { secure_url: string }

    return NextResponse.json({ secure_url }, { status: 200 })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed', details: `${err}` }, { status: 500 })
  }
}