import { Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ConfigValidateException } from './exceptions/config-validate.exception';

export function validate(environmentVariables: Type) {
  return (config: Record<string, unknown>) => {
    const transformedValue = plainToInstance(environmentVariables, config, {
      exposeUnsetFields: false,
      exposeDefaultValues: true,
    });

    removeEmptyStringValues(transformedValue);

    const errors = validateSync(transformedValue, { whitelist: true });

    if (errors && errors.length !== 0) {
      throw new ConfigValidateException(errors);
    }

    return transformedValue;
  };
}

function removeEmptyStringValues(instance: InstanceType<any>): void {
  Object.keys(instance).forEach((key) => {
    if (instance[key] === '') {
      delete instance[key];
    }
  });
}
