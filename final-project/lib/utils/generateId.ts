import { nanoid } from 'nanoid';

// Fungsi untuk menghasilkan Nano ID dengan panjang default (21 karakter)
// export function generateNanoId(): string {
//   return nanoid();
// }

// Fungsi untuk menghasilkan Nano ID dengan panjang kustom
// Hati-hati: semakin pendek, semakin tinggi probabilitas tabrakan.
export function generateShortNanoId(length: number = 10): string {
  return nanoid(length);
}