export interface IConfig {
  port: number;
}

export default () =>
  ({
    port: Number.parseInt(process.env.PORT, 10) || 3000,
  }) satisfies IConfig;
