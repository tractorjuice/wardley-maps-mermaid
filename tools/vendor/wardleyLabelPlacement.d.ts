export interface Point {
    x: number;
    y: number;
}
export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface Circle {
    x: number;
    y: number;
    radius: number;
}
export interface Segment {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export declare const estimateLabelBox: (text: string, fontSize: number) => {
    width: number;
    height: number;
};
/** Area of intersection between two axis-aligned rects (0 if disjoint). */
export declare const rectsOverlapArea: (a: Rect, b: Rect) => number;
/** True if a circle intersects (or touches) an axis-aligned rect. */
export declare const circleRectOverlap: (circle: Circle, rect: Rect) => boolean;
/** True if a line segment crosses or lies inside an axis-aligned rect. */
export declare const segmentIntersectsRect: (seg: Segment, rect: Rect) => boolean;
/** Area of `rect` that lies outside `bounds`. */
export declare const areaOutsideBounds: (rect: Rect, bounds: Rect) => number;
export type LabelKind = 'component' | 'anchor' | 'link' | 'annotation';
export interface LabelBox {
    /** Stable identifier — used to key results back to render elements. */
    id: string;
    /** The point the label is attached to (node center / link midpoint / declared annotation position). */
    anchor: Point;
    width: number;
    height: number;
    kind: LabelKind;
    /** Source-declaration order; lower is placed-priority earlier on ties. */
    priority: number;
    /** For link labels: unit vector hint for the perpendicular side preference. */
    preferredOffset?: Point;
    /** Author's chosen label position (`label [x, y]`). Component/anchor labels only. */
    manualRect?: Rect;
    /**
     * Unit vector for the soft direction the label prefers to sit relative to
     * its anchor. Defaults to NE (up-right) when absent; pipeline child
     * components use S (straight down).
     */
    preferredDirection?: Point;
}
export interface Candidate {
    rect: Rect;
    /** Unit direction from anchor to the candidate's center. */
    direction: Point;
    /** Distance from the anchor to the candidate's center. */
    distance: number;
}
export type Obstacle = {
    type: 'circle';
    x: number;
    y: number;
    radius: number;
} | {
    type: 'segment';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
} | {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * Score a candidate position. Lower is better. A score near 0 is an
 * unobstructed placement close to the anchor in the preferred direction.
 * When `preferredCenter` is supplied, the soft distance/direction terms are
 * replaced by a single pull toward that point (used to bias a re-placed
 * manual label back toward the author's intended position).
 * `preferredDirection` (a unit vector) overrides the default NE direction
 * bias — pipeline child components pass S so their labels prefer to sit
 * underneath. It is ignored when `preferredCenter` is set.
 */
export declare const scoreCandidate: (candidate: Candidate, obstacles: Obstacle[], bounds: Rect, anchor: Point, placedRects?: Rect[], preferredCenter?: Point, preferredDirection?: Point) => number;
/**
 * Decide whether a manual label's authored position (`manualRect`) is
 * collision-free and may be kept as-is. A manual label is kept unless its
 * rect overlaps another node's marker, overlaps a rect obstacle (e.g. a
 * pipeline box), spills outside the chart bounds, or overlaps another manual
 * label's rect.
 *
 * Crossing a link line does NOT, on its own, reject a manual label: link
 * lines are thin, an author who placed a label across one accepted that, and
 * on dense maps treating every clipped link as a collision re-places labels
 * that looked fine. Link segments are still a soft penalty for auto-placed
 * labels (see `scoreCandidate`).
 *
 * The label's OWN node marker — the circle centred on `label.anchor` — is
 * ignored: a normal label sits snugly against its own node, and counting that
 * as a collision would reject almost every tightly authored label.
 *
 * `otherManualRects` must exclude this label's own `manualRect`.
 */
export declare const isManualLabelKept: (label: LabelBox, obstacles: Obstacle[], bounds: Rect, otherManualRects: Rect[]) => boolean;
/**
 * Generate the set of candidate positions for a label.
 * Component / anchor / annotation labels use the 8 compass directions at each
 * supplied distance. Link labels use only the perpendicular axis (both sides).
 * When the label has a `manualRect`, the author's exact position is appended
 * as one extra candidate.
 */
export declare const generateCandidates: (label: LabelBox, distances: number[]) => Candidate[];
export interface PlacementConfig {
    /** Candidate ring distances, in pixels, from anchor to label center. */
    slotDistances: number[];
    /** A label moved farther than this from its anchor gets `needsLeader`. */
    leaderThreshold: number;
    /** Number of worst-scoring labels re-placed in the refinement pass. */
    refinementCount: number;
}
export interface PlacedLabel {
    id: string;
    /** Final bounding box of the label. */
    rect: Rect;
    /** The anchor point the label belongs to (for drawing a leader line). */
    anchor: Point;
    /** True when the label is far enough from its anchor to warrant a leader. */
    needsLeader: boolean;
}
/**
 * Place every label to minimise overlap with other labels, node markers, the
 * chart boundary, and link lines.
 *
 * A label carrying a `manualRect` (an author-specified `label [x, y]`) is kept
 * exactly when that position is collision-free; such kept labels become fixed
 * obstacles. Every other label — untuned labels and manual labels whose
 * authored position collided — is placed by the greedy algorithm: most
 * constrained first, ties broken by `priority`, then a refinement pass. A
 * re-placed manual label is biased back toward its authored position.
 * Pure and deterministic.
 */
export declare const autoPlaceLabels: (labels: LabelBox[], obstacles: Obstacle[], bounds: Rect, config: PlacementConfig) => PlacedLabel[];
