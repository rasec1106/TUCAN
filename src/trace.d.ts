// declare module 'trace' {
//     export function trace<T>(fn: T): T
//   }

// declare module 'trace' {
//   export * from './src/utils/trace'
// }

declare module 'trace' {
  export function logTrace (message: string): void
}
