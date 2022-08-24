import InvalidRectangleError from './errors';

/**
 * CartesianCoordinate is a tuple representing the x and y coordinate of a point
 */
export type CartesianCoordinate = {
  x: number;
  y: number;
};

type Axis = 'x' | 'y';

//Line is pair of coordinates, representing a line on a 2D plane
export type Line2D = [p1: CartesianCoordinate, p2: CartesianCoordinate];

enum AdjacenyType {
  SubLine = 'SubLine',
  Proper = 'Proper',
  Partial = 'Partial',
  NonAdjacent = 'NonAdjacent',
}

class Rectangle {
  readonly bottomLeft: CartesianCoordinate;
  readonly topRight: CartesianCoordinate;
  readonly topLeft: CartesianCoordinate;
  readonly bottomRight: CartesianCoordinate;
  constructor(bottomLeft: CartesianCoordinate, topRight: CartesianCoordinate) {
    if (this.isValidRectangle(bottomLeft, topRight)) {
      this.bottomLeft = bottomLeft;
      this.topRight = topRight;
      this.topLeft = this.getTopLeft(bottomLeft, topRight);
      this.bottomRight = this.getBottomRight(bottomLeft, topRight);
    } else {
      throw new InvalidRectangleError(bottomLeft, topRight);
    }
  }

  /**
   *
   * @returns Array of rectangle corners in clockwise direction, starting at topLeft
   */
  private getCorners(): CartesianCoordinate[] {
    return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
  }

  /**
   *
   * @param bl bottom left coordnate
   * @param tr top right coordinate
   * @returns boolean if bl and tr can create a valid rectangle
   */
  private isValidRectangle(bl: CartesianCoordinate, tr: CartesianCoordinate): boolean {
    return bl.x < tr.x && bl.y < tr.y;
  }

  private getTopLeft(
    bl: CartesianCoordinate,
    tr: CartesianCoordinate,
  ): CartesianCoordinate {
    return { x: bl.x, y: tr.y };
  }

  private getBottomRight(
    bl: CartesianCoordinate,
    tr: CartesianCoordinate,
  ): CartesianCoordinate {
    return { x: tr.x, y: bl.x };
  }

  /**
   *
   * @param r input rectangle to check for intersection points
   * @returns array of coordinates where rectangles intersect
   */
  public Intersects(r: Rectangle) {
    const intersections: (CartesianCoordinate | boolean)[] = [];
    const rightLine: Line2D = [r.bottomRight, r.topRight];
    const leftLine: Line2D = [r.bottomLeft, r.topLeft];
    const bottomLine: Line2D = [r.bottomLeft, r.bottomRight];
    const topLine: Line2D = [r.topLeft, r.topRight];

    intersections.push(this.lineIntersects(rightLine, [this.topLeft, this.topRight]));
    intersections.push(
      this.lineIntersects(rightLine, [this.bottomLeft, this.bottomRight]),
    );

    intersections.push(this.lineIntersects(leftLine, [this.topLeft, this.topRight]));
    intersections.push(
      this.lineIntersects(leftLine, [this.bottomLeft, this.bottomRight]),
    );

    intersections.push(
      this.lineIntersects(bottomLine, [this.topRight, this.bottomRight]),
    );
    intersections.push(this.lineIntersects(bottomLine, [this.topLeft, this.bottomLeft]));

    intersections.push(this.lineIntersects(topLine, [this.topRight, this.bottomRight]));
    intersections.push(this.lineIntersects(topLine, [this.topLeft, this.bottomLeft]));
    return intersections.filter(intersection => intersection != false);
  }

  /**
   * Returns point of intersection of two perpendicular straight lines
   * @param l1 straight line segment
   * @param l2 straight line segment
   * @returns coordinate point of intersection. If no intersection return null
   *
   */
  private lineIntersects(l1: Line2D, l2: Line2D) {
    const vertical = l1[0].x === l1[1].x ? l1 : l2;
    const horizontal = l1[0].y === l1[1].y ? l1 : l2;
    let x, y;
    let min = Math.min(horizontal[0].x, horizontal[1].x);
    let max = Math.max(horizontal[0].x, horizontal[1].x);
    if (vertical[0].x > min && vertical[0].x < max) {
      x = vertical[0].x;
    }
    min = Math.min(vertical[0].y, vertical[1].y);
    max = Math.max(vertical[0].y, vertical[1].y);
    if (horizontal[0].y > min && horizontal[0].y < max) {
      y = horizontal[0].y;
    }
    if (x && y) {
      return { x, y };
    }

    return false;
  }

  /**
   *
   * @param r input rectangle which is checked if it is contained in calling rectangle
   * @returns boolean value representing whether calling rectangle contains input rectangle
   */
  public Contains(r: Rectangle): boolean {
    let contains = true;
    const right = this.topRight.x;
    const bottom = this.bottomLeft.y;
    const left = this.bottomLeft.x;
    const top = this.topRight.y;
    r.getCorners().forEach(corner => {
      const xAxisBoundCheck = corner.x < right && corner.x > left;
      const yAxisBoundsCheck = corner.y < top && corner.y > bottom;
      if (!(xAxisBoundCheck && yAxisBoundsCheck)) {
        contains = false;
      }
    });
    return contains;
  }

  // Observation:
  //  Adjacency occurs when two rectangles share their 'reverse' side, ie top-bottom, left-right
  //  There are four possible ways two rectangles can be adjacent

  /**
   *
   * @param r
   * @returns
   */
  public Adjacent(r: Rectangle): AdjacenyType {
    let overlap = AdjacenyType.NonAdjacent;

    //Right side of rectangle is adjacent to left side of input
    // AND
    if (this.bottomRight.x === r.topLeft.x) {
      overlap = this.lineOverlap(
        [this.bottomRight, this.topRight],
        [r.bottomLeft, r.topLeft],
        'y',
      );
    }

    //Top of rectangle overlaps with bottom of input rectangle
    if (this.topRight.y === r.bottomLeft.y) {
      overlap = this.lineOverlap(
        [this.topLeft, this.topRight],
        [r.bottomLeft, r.bottomRight],
        'x',
      );
    }
    //Left side of rectangle is adjacent to right side of input
    if (this.topLeft.x === r.bottomRight.x) {
      overlap = this.lineOverlap(
        [this.bottomLeft, this.topLeft],
        [r.bottomRight, r.topRight],
        'y',
      );
    }
    //Bottom of rectangle is adjacent with top of input rectangle
    if (this.bottomLeft.y === r.topLeft.y) {
      overlap = this.lineOverlap(
        [this.bottomLeft, this.bottomRight],
        [r.topLeft, r.topRight],
        'x',
      );
    }

    return overlap;
  }
  /**
   * Given two lines that could potentially be adjacent, return the adjacendy type
   * @param l1 line segment of one side a rectangle
   * @param l2 line segment of another rectangle
   * @param axis axis we checking for overlap
   * @returns
   */

  private lineOverlap(l1: Line2D, l2: Line2D, axis: Axis): AdjacenyType {
    l1.sort((a, b) => a[axis] - b[axis]);
    l2.sort((a, b) => a[axis] - b[axis]);
    const l1Length = l1[1][axis] - l1[0][axis];
    const l2Length = l2[1][axis] - l2[0][axis];
    //Both lines are same length and have same start point
    if (l1Length === l2Length && l1[0][axis] === l2[0][axis]) {
      return AdjacenyType.Proper;
    }
    //Either line is completly contained in the other line
    //Could also get smaller line and check if smaller start and smaller end are in bounds of larger
    if (
      (l1[0][axis] > l2[0][axis] && l1[1][axis] < l2[1][axis]) ||
      (l2[0][axis] > l1[0][axis] && l2[1][axis] < l1[1][axis])
    )
      return AdjacenyType.SubLine;

    // line has just one point in the other line
    // One line is before or after the other, ie no overlap
    if (
      (l1[0][axis] < l2[0][axis] && l1[1][axis] < l2[0][axis]) ||
      (l1[0][axis] > l2[0][axis] && l1[1][axis] > l2[0][axis])
    )
      return AdjacenyType.NonAdjacent;
    return AdjacenyType.Partial;
  }
}

export default Rectangle;
