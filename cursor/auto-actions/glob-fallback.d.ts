// Fallback module declaration for 'glob' if @types/glob is not installed
// Remove this file if you add @types/glob as a dev dependency
declare module 'glob' {
  const glob: any;
  export = glob;
} 