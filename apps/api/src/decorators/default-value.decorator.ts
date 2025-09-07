import { Transform } from 'class-transformer';
import { TransformOptions } from 'class-transformer/types/interfaces';

// NOTE:: exposeDefaultValues: true doesn't work properly with @Tranfrom decorator
// https://github.com/typestack/class-transformer/issues/1330
export const DefaultValue = (
  val: unknown,
  options?: TransformOptions,
): PropertyDecorator =>
  Transform(({ value }) => {
    if (value === global.undefined) {
      return val;
    }

    return value;
  }, options);
