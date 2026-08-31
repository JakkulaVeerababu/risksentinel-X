export const ENTITY_LABELS = {
  customer: "Identity",
  device: "Device",
  ip: "Network address",
  merchant: "Merchant",
  payment_instrument: "Payment instrument",
  transaction: "Payment",
  payment: "Payment",
  unknown: "Other entity",
} as const;

export function entityKind(type?: string): keyof typeof ENTITY_LABELS {
  const key = type?.toLowerCase() || "unknown";
  return Object.hasOwn(ENTITY_LABELS, key) ? key as keyof typeof ENTITY_LABELS : "unknown";
}

export type RelationshipNode = { id: string; group?: string };
export type RelationshipContext = { nodes: RelationshipNode[]; links: { source: string; target: string }[] };

export function directNeighbors(context: RelationshipContext | null, anchorId: string) {
  const ids = new Set((context?.links || []).flatMap(link => link.source === anchorId ? [link.target] : link.target === anchorId ? [link.source] : []));
  return (context?.nodes || []).filter(node => node.id !== anchorId && ids.has(node.id));
}

// A bounded six-node page keeps both labels and connections legible at phone width.
export function connectionPosition(index: number, count: number) {
  const angle = count === 1 ? 0 : (index * 360 / count - 90) * Math.PI / 180;
  return { x: 50 + 33 * Math.cos(angle), y: 166 + 108 * Math.sin(angle) };
}
