require("dotenv").config({ path: "../.env" })
const { checkFileIsAValidImage } = require("../controllers/imageController")

const buf = (...bytes) => Buffer.from(bytes)

const cases = [
  //ones we want
  ["real JPEG",        buf(0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10), "image/jpeg"],
  ["real PNG",         buf(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A), "image/png"],
  ["real WebP",        buf(0x52, 0x49, 0x46, 0x46, 0,0,0,0, 0x57, 0x45, 0x42, 0x50), "image/webp"],
  ["RIFF", buf(0x52, 0x49, 0x46, 0x46, 0,0,0,0, 0x57, 0x41, 0x56, 0x45), null],
  //ones that should be rejected
  ["PDF", buf(0x25, 0x50, 0x44, 0x46), null],
  ["plain text",       buf(0x68, 0x65, 0x6C, 0x6C, 0x6F), null],
  ["empty",            buf(), null],
  ["too short for webp check", buf(0x52, 0x49, 0x46, 0x46), null],
]

let passed = 0

for (const [desc, b, expected] of cases) {
    const result = checkFileIsAValidImage(b)
    const ok = result === expected

    console.log(`${ok ? "yes" : "no"} ${desc}: ${result} vs expected: ${expected} `)
    if(ok) passed++
}
console.log(`\n ${passed}/${cases.length} tests passed`)