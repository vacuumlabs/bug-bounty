type DrizzleEnum<T extends string> = [T, ...T[]]

export const getDrizzleEnum = <T extends string>(obj: Record<string, T>) =>
  Object.values(obj) as DrizzleEnum<T>
