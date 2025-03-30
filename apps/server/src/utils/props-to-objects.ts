// import { ValueObject } from 'src/libs/value-object-base';

// /**
//  * Converts Entity/Value Objects props to a plain object.
//  * Useful for testing and debugging.
//  * @param props
//  */
// export function convertPropsToObject(props: any): any {
//   const propsCopy = structuredClone(props);

//   for (const prop in propsCopy) {
//     if (Array.isArray(propsCopy[prop])) {
//       propsCopy[prop] = (propsCopy[prop] as Array<unknown>).map((item) => {
//         return convertToPlainObject(item);
//       });
//     }
//     propsCopy[prop] = convertToPlainObject(propsCopy[prop]);
//   }

//   return propsCopy;
// }

// function convertToPlainObject(item: any): any {
//   if (ValueObject.isValueObject(item)) {
//     return item.unpack();
//   }
//   if (isEntity(item)) {
//     return item.toObject();
//   }
//   return item;
// }
