let lastPoint = [0, 0];

function getIntersection (x0, y0, r0, x1, y1, r1) {
  /** This will make sure we never devide by a zero down below */
  x0 += 0.000001;
  y0 += 0.000001;

  let a, dx, dy, d, h, rx, ry;
  let x2, y2;

  /* dx and dy are the vertical and horizontal distances between
   * the circle centers.
   */
  dx = x1 - x0;
  dy = y1 - y0;

  /* Determine the straight-line distance between the centers. */
  d = Math.sqrt (dy * dy + dx * dx);

  /* Check for solvability. */
  if (d > r0 + r1) {
    /* no solution. circles do not intersect. */
    console.log ('no');
    return false;
  }
  if (d < Math.abs (r0 - r1)) {
    /* no solution. one circle is contained in the other */
    return false;
  }

  /* 'point 2' is the point where the line through the circle
   * intersection points crosses the line between the circle
   * centers.
   */

  /* Determine the distance from point 0 to point 2. */
  a = (r0 * r0 - r1 * r1 + d * d) / (2.0 * d);

  /* Determine the coordinates of point 2. */
  x2 = x0 + dx * a / d;
  y2 = y0 + dy * a / d;

  /* Determine the distance from point 2 to either of the
   * intersection points.
   */
  h = Math.sqrt (r0 * r0 - a * a);

  /* Now determine the offsets of the intersection points from
   * point 2.
   */
  rx = -dy * (h / d);
  ry = dx * (h / d);

  /* Determine the absolute intersection points. */
  const xi = x2 + rx;
  const xi_prime = x2 - rx;
  const yi = y2 + ry;
  const yi_prime = y2 - ry;

  /**
   * Let's take two intersection points and return the one, thats closest to the previous
   * intersection
   */
  let point;

  const distance1 = Math.hypot (xi - lastPoint.x, yi - lastPoint.y);
  const distance2 = Math.hypot (xi_prime - lastPoint.x, yi_prime - lastPoint.y);

  if (distance1 < distance2) point = [xi, yi];
  else point = [xi_prime, yi_prime];

  lastPoint[0] = point[0];
  lastPoint[1] = point[1];

  const res = {
    x: point[0],
    y: point[1],
  };

  return res;
}

module.exports = getIntersection;
