import * as go from 'gojs'

export class TaperedLink extends go.Link {
  // produce a Geometry from the Link's route
  makeGeometry() {
    // maybe use the standard geometry for this route, instead?
    const numpts = this.pointsCount
    if (numpts < 4 || this.computeCurve() !== go.Link.Bezier) {
      return super.makeGeometry()
    }

    const p0 = this.getPoint(0)
    const p1 = this.getPoint((numpts > 4) ? 2 : 1)
    const p2 = this.getPoint((numpts > 4) ? numpts - 3 : 2)
    const p3 = this.getPoint(numpts - 1)
    const fromHoriz = Math.abs(p0.y - p1.y) < Math.abs(p0.x - p1.x)
    const toHoriz = Math.abs(p2.y - p3.y) < Math.abs(p2.x - p3.x)

    let p0x = p0.x + (fromHoriz ? 0 : -4)
    let p0y = p0.y + (fromHoriz ? -4 : 0)
    let p1x = p1.x + (fromHoriz ? 0 : -3)
    let p1y = p1.y + (fromHoriz ? -3 : 0)
    let p2x = p2.x + (toHoriz ? 0 : -2)
    let p2y = p2.y + (toHoriz ? -2 : 0)
    let p3x = p3.x + (toHoriz ? 0 : -1)
    let p3y = p3.y + (toHoriz ? -1 : 0)

    const fig = new go.PathFigure(p0x, p0y, true) // filled
    fig.add(new go.PathSegment(go.PathSegment.Bezier, p3x, p3y, p1x, p1y, p2x, p2y))

    p0x = p0.x + (fromHoriz ? 0 : 4)
    p0y = p0.y + (fromHoriz ? 4 : 0)
    p1x = p1.x + (fromHoriz ? 0 : 3)
    p1y = p1.y + (fromHoriz ? 3 : 0)
    p2x = p2.x + (toHoriz ? 0 : 2)
    p2y = p2.y + (toHoriz ? 2 : 0)
    p3x = p3.x + (toHoriz ? 0 : 1)
    p3y = p3.y + (toHoriz ? 1 : 0)
    fig.add(new go.PathSegment(go.PathSegment.Line, p3x, p3y))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, p0x, p0y, p2x, p2y, p1x, p1y).close())

    const geo = new go.Geometry()
    geo.add(fig)
    geo.normalize()
    return geo
  }
}