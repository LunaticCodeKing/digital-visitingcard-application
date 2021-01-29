import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('0123456789', 8)

export function generateOTP() {
    return nanoid()
}