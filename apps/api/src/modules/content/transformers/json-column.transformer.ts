import { Transform, plainToInstance } from "class-transformer";

export function JsonColumnTransformer<T>(cls: new (...args: any[]) => T) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata("design:type", cls, target, propertyKey);

    const transformFn = ({ value }: { value: any }) => {
      if (!value) return undefined;
      const obj = typeof value === "string" ? JSON.parse(value) : value;
      return plainToInstance(cls, obj, { excludeExtraneousValues: true });
    };

    Transform(transformFn)(target, propertyKey);
  };
}
