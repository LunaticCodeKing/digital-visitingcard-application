import { customAlphabet } from 'nanoid';
const nanoId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 16)
const upperCaseNanoId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 22)

export function generateRandomId() {
    return nanoId()
}

export function generateUpperCaseRandomId() {
    return upperCaseNanoId()
}