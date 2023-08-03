export const ToEntity = <T>(dto: T, entity: any) => {
  const keys = Object.keys(dto);
  const entityObject = new entity();

  keys.forEach((key) => {
    entityObject[key] = dto[key];
  });

  return entityObject;
};
