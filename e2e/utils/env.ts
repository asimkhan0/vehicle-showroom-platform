import { config } from 'dotenv'

// Load e2e project creds first, then fall back to the day-to-day dev project.
// Existing process.env values (CI secrets) are never overwritten.
config({ path: '.env.e2e.local', override: false })
config({ path: '.env.local', override: false })
