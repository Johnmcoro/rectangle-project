import InvalidRectangleError from '../errors';
import Rectangle from '../rectangle';

describe('Rectangle class', () => {
  const _ = new Rectangle({ x: 0, y: 0 }, { x: 5, y: 5 });
  const Proto = Object.getPrototypeOf(_);
  describe('Rectangle creation', () => {
    const r1 = new Rectangle({ x: 0, y: 0 }, { x: 5, y: 5 });
    it('should sets the bottom left property', () => {
      expect(r1.bottomLeft).toStrictEqual({ x: 0, y: 0 });
    });
    it('should sets the bottom right property', () => {
      expect(r1.bottomRight).toStrictEqual({ x: 5, y: 0 });
    });
    it('should sets the top left property', () => {
      expect(r1.topLeft).toStrictEqual({ y: 5, x: 0 });
    });
    it('should sets the top right property', () => {
      expect(r1.topRight).toStrictEqual({ x: 5, y: 5 });
    });
  });

  describe('Rectangle InvalidRectangleError', () => {
    it('should throw InvalidRectangleError when top right x coordinate is less the left corner x coordinate', () => {
      const bl = { x: 0, y: 0 };
      const tr = { x: -1, y: 0 };
      expect(() => new Rectangle(bl, tr)).toThrow(InvalidRectangleError);
    });
    it('should throw InvalidRectangleError when top right y coordinate is less the left corner y coordinate', () => {
      const bl = { x: 0, y: 0 };
      const tr = { x: 1, y: -1 };
      expect(() => new Rectangle(bl, tr)).toThrow(InvalidRectangleError);
    });
    it('should throw InvalidRectangleError when bottom left x coordinate is greater then top right x coordinate', () => {
      const bl = { x: 1, y: 0 };
      const tr = { x: 0, y: 4 };
      expect(() => new Rectangle(bl, tr)).toThrow(InvalidRectangleError);
    });
    it('should throw InvalidRectangleError when bottom left y coordinate is greater then top right y coordinate', () => {
      const bl = { x: 0, y: 1 };
      const tr = { x: 1, y: 0 };
      expect(() => new Rectangle(bl, tr)).toThrow(InvalidRectangleError);
    });
  });

  describe('Rectangle private lineIntersects method', () => {
    it('should return intersection coordinate of two lines', () => {
      expect(
        Proto.lineIntersects(
          [
            { x: 0, y: 1 },
            { x: 5, y: 1 },
          ],
          [
            { x: 3, y: 5 },
            { x: 3, y: -5 },
          ],
        ),
      ).toStrictEqual({ x: 3, y: 1 });
    });

    it('should return false when lines do not intersect', () => {
      expect(
        Proto.lineIntersects(
          [
            { x: 0, y: 1 },
            { x: 5, y: 1 },
          ],
          [
            { x: 3, y: 20 },
            { x: 3, y: 25 },
          ],
        ),
      ).toEqual(false);
    });
  });

  describe('Rectangle Intersects method', () => {
    it('should return intersecting points of rectangles', () => {
      const r1 = new Rectangle({ x: 0, y: 0 }, { x: 10, y: 10 });
      const r2 = new Rectangle({ x: 5, y: 5 }, { x: 15, y: 15 });

      expect(r1.Intersects(r2)).toEqual(
        expect.arrayContaining([
          { x: 5, y: 10 },
          { x: 10, y: 5 },
        ]),
      );
      expect(r2.Intersects(r1)).toEqual(
        expect.arrayContaining([
          { x: 5, y: 10 },
          { x: 10, y: 5 },
        ]),
      );
    });

    it('should return empty array when rectangles do not intersect', () => {
      const r1 = new Rectangle({ x: 0, y: 0 }, { x: 10, y: 10 });
      const r2 = new Rectangle({ x: 11, y: 11 }, { x: 15, y: 15 });
      expect(r1.Intersects(r2)).toEqual(expect.arrayContaining([]));
    });
  });

  describe('Rectangle Contains method', () => {
    const r1 = new Rectangle({ x: 0, y: 0 }, { x: 10, y: 10 });
    it('should return true when calling rectangle contains input rectangle', () => {
      expect(r1.Contains(new Rectangle({ x: 1, y: 1 }, { x: 5, y: 5 }))).toBe(true);
    });
    it('should return false when calling rectangle does not contain input rectangle', () => {
      expect(r1.Contains(new Rectangle({ x: 11, y: 11 }, { x: 15, y: 13 }))).toBe(false);
    });
  });

  describe('Rectangle private lineOverlap method', () => {
    it('should return Proper when checking x-axis overlap', () => {
      expect(
        Proto.lineOverlap(
          [
            { x: -10, y: 10 },
            { x: 20, y: 10 },
          ],
          [
            { x: -10, y: 10 },
            { x: 20, y: 10 },
          ],
          'x',
        ),
      ).toBe('Proper');
    });

    it('should return Proper when checking y-axis overlap', () => {
      expect(
        Proto.lineOverlap(
          [
            { x: 10, y: 5 },
            { x: 10, y: 10 },
          ],
          [
            { x: 10, y: 5 },
            { x: 10, y: 10 },
          ],
          'y',
        ),
      ).toBe('Proper');
    });

    it('should return Subline when one line is a subline on x axis', () => {
      expect(
        Proto.lineOverlap(
          [
            { x: -10, y: 10 },
            { x: 10, y: 10 },
          ],
          [
            { x: -5, y: 10 },
            { x: 0, y: 10 },
          ],
          'x',
        ),
      ).toBe('SubLine');
    });

    it('should return Subline when one line is a subline on y axis', () => {
      expect(
        Proto.lineOverlap(
          [
            { x: 10, y: -5 },
            { x: 10, y: 10 },
          ],
          [
            { x: 10, y: 0 },
            { x: 10, y: 5 },
          ],
          'y',
        ),
      ).toBe('SubLine');
    });

    it('should return NonAdjacent when no overlap exists on x axis', () => {
      expect(
        Proto.lineOverlap(
          [
            { x: -5, y: 10 },
            { x: 20, y: 10 },
          ],
          [
            { x: 25, y: 10 },
            { x: 30, y: 10 },
          ],
          'x',
        ),
      ).toBe('NonAdjacent');
    });

    it('should return NonAdjacent when no overlap exists on y axis', () => {
      expect(
        Proto.lineOverlap(
          [
            { x: 5, y: 0 },
            { x: 5, y: 10 },
          ],
          [
            { x: 5, y: 11 },
            { x: 5, y: 12 },
          ],
          'y',
        ),
      ).toBe('NonAdjacent');
    });

    it('should return Partial when line partially overlaps on x axis', () => {
      expect(
        Proto.lineOverlap(
          [
            { x: -10, y: -5 },
            { x: 10, y: -5 },
          ],
          [
            { x: 5, y: -5 },
            { x: 15, y: -5 },
          ],
          'x',
        ),
      ).toBe('Partial');
    });

    it('should return Partial when line partially overlaps on y axis', () => {
      expect(
        Proto.lineOverlap(
          [
            { x: 10, y: -20 },
            { x: 10, y: 10 },
          ],
          [
            { x: 10, y: 5 },
            { x: 10, y: 12 },
          ],
          'y',
        ),
      ).toBe('Partial');
    });
  });

  describe('Rectangle Adjacent method', () => {
    const r1 = new Rectangle({ x: 0, y: 0 }, { x: 10, y: 10 });
    const r2 = new Rectangle({ x: 0, y: 10 }, { x: 10, y: 12 });
    it('should return Proper when two rectangles share a side completly', () => {
      expect(r1.Adjacent(r2)).toBe('Proper');
    });

    it('should return Partial when two rectangles partially share a side', () => {
      expect(r1.Adjacent(new Rectangle({ x: 5, y: 10 }, { x: 11, y: 13 }))).toBe(
        'Partial',
      );
    });

    it('should return SubLine when one rectangle is a subline of the other', () => {
      expect(r1.Adjacent(new Rectangle({ x: 5, y: 10 }, { x: 8, y: 12 }))).toBe(
        'SubLine',
      );
    });

    it('should return NonAdjacent when one rectangle is not adjacent to the other', () => {
      expect(r1.Adjacent(new Rectangle({ x: 5, y: 11 }, { x: 7, y: 20 }))).toBe(
        'NonAdjacent',
      );
    });
  });
});
