import { CartesianCoordinate } from './rectangle';

/**
 * InvalidRectangleError is thrown if a Rectangle is instantiated
 * with an invalid pair of cartesian coordinates.
 */
class InvalidRectangleError extends Error {
  constructor(bl: CartesianCoordinate, tr: CartesianCoordinate) {
    const message = `Error attempting to instantiate Rectangle. The provided pair of 
        coordinates ${JSON.stringify(bl)}, ${JSON.stringify(
      tr,
    )} do not represent a valid rectangle. `;
    super(message);
  }
}

export default InvalidRectangleError;
