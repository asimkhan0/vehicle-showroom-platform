// A tiny valid 1x1 PNG, decoded at runtime so we don't commit a binary asset.
// Used to exercise the direct browser → Supabase Storage upload path.
export const pngFixture = {
  name: 'e2e-car.png',
  mimeType: 'image/png',
  buffer: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
  ),
}
