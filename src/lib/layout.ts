import type { Edge, Node } from "@xyflow/react";

export interface LayoutPreset {
  xStart: number;
  yStart: number;
  xGap: number;
  yGap: number;
  componentGap: number;
}

export const DEFAULT_LAYOUT: LayoutPreset = {
  xStart: 80,
  yStart: 80,
  xGap: 280,
  yGap: 150,
  componentGap: 200,
};

export const COMPARE_LAYOUT: LayoutPreset = {
  xStart: 64,
  yStart: 72,
  xGap: 240,
  yGap: 130,
  componentGap: 160,
};

const sortIdsByPosition = (ids: string[], nodeMap: Map<string, Node>) =>
  [...ids].sort((left, right) => {
    const leftNode = nodeMap.get(left);
    const rightNode = nodeMap.get(right);
    if (!leftNode || !rightNode) return left.localeCompare(right);
    if (leftNode.position.y !== rightNode.position.y) {
      return leftNode.position.y - rightNode.position.y;
    }
    return leftNode.position.x - rightNode.position.x;
  });

export const sortNodesByFlow = (nodes: Node[]) =>
  [...nodes].sort((left, right) => {
    if (left.position.x !== right.position.x) return left.position.x - right.position.x;
    if (left.position.y !== right.position.y) return left.position.y - right.position.y;
    return left.id.localeCompare(right.id);
  });

export const layoutNodes = (
  nodes: Node[],
  edges: Edge[],
  preset: LayoutPreset = DEFAULT_LAYOUT,
): Node[] => {
  if (nodes.length === 0) return nodes;

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const undirected = new Map<string, Set<string>>();
  const incoming = new Map<string, Set<string>>();
  const outgoing = new Map<string, Set<string>>();

  for (const node of nodes) {
    undirected.set(node.id, new Set());
    incoming.set(node.id, new Set());
    outgoing.set(node.id, new Set());
  }

  for (const edge of edges) {
    if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) continue;
    undirected.get(edge.source)?.add(edge.target);
    undirected.get(edge.target)?.add(edge.source);
    incoming.get(edge.target)?.add(edge.source);
    outgoing.get(edge.source)?.add(edge.target);
  }

  const unvisited = new Set(nodes.map((node) => node.id));
  const positions = new Map<string, { x: number; y: number }>();
  let currentBaseY = preset.yStart;

  while (unvisited.size > 0) {
    const sortedUnvisited = sortIdsByPosition([...unvisited], nodeMap);
    const rootCandidate =
      sortedUnvisited.find((id) => (incoming.get(id)?.size ?? 0) === 0) ?? sortedUnvisited[0];

    const componentQueue = [rootCandidate];
    const componentIds: string[] = [];
    unvisited.delete(rootCandidate);

    while (componentQueue.length > 0) {
      const currentId = componentQueue.shift();
      if (!currentId) continue;
      componentIds.push(currentId);
      for (const nextId of undirected.get(currentId) ?? []) {
        if (!unvisited.has(nextId)) continue;
        unvisited.delete(nextId);
        componentQueue.push(nextId);
      }
    }

    const componentSet = new Set(componentIds);
    const indegree = new Map<string, number>();
    const depth = new Map<string, number>();

    for (const id of componentIds) {
      const indegreeValue = [...(incoming.get(id) ?? [])].filter((parent) =>
        componentSet.has(parent),
      ).length;
      indegree.set(id, indegreeValue);
      if (indegreeValue === 0) depth.set(id, 0);
    }

    const depthQueue = sortIdsByPosition(
      componentIds.filter((id) => (indegree.get(id) ?? 0) === 0),
      nodeMap,
    );

    while (depthQueue.length > 0) {
      const currentId = depthQueue.shift();
      if (!currentId) continue;
      const currentDepth = depth.get(currentId) ?? 0;
      for (const nextId of outgoing.get(currentId) ?? []) {
        if (!componentSet.has(nextId)) continue;
        depth.set(nextId, Math.max(depth.get(nextId) ?? 0, currentDepth + 1));
        indegree.set(nextId, (indegree.get(nextId) ?? 1) - 1);
        if ((indegree.get(nextId) ?? 0) <= 0) depthQueue.push(nextId);
      }
    }

    let fallbackDepth = Math.max(...depth.values(), 0);
    for (const id of sortIdsByPosition(componentIds, nodeMap)) {
      if (!depth.has(id)) {
        fallbackDepth += 1;
        depth.set(id, fallbackDepth);
      }
    }

    const columns = new Map<number, string[]>();
    for (const id of componentIds) {
      const column = depth.get(id) ?? 0;
      columns.set(column, [...(columns.get(column) ?? []), id]);
    }

    const maxColumnSize = Math.max(...[...columns.values()].map((c) => c.length), 1);
    const componentHeight = (maxColumnSize - 1) * preset.yGap;

    for (const [column, ids] of [...columns.entries()].sort((a, b) => a[0] - b[0])) {
      const sortedIds = sortIdsByPosition(ids, nodeMap);
      const columnHeight = (sortedIds.length - 1) * preset.yGap;
      const columnStartY = currentBaseY + (componentHeight - columnHeight) / 2;
      sortedIds.forEach((id, index) => {
        positions.set(id, {
          x: preset.xStart + column * preset.xGap,
          y: columnStartY + index * preset.yGap,
        });
      });
    }

    currentBaseY += componentHeight + preset.componentGap;
  }

  return nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) ?? node.position,
  }));
};

export const orderedNodeIds = (nodes: Node[], edges: Edge[]): string[] => {
  const laid = layoutNodes(nodes, edges, DEFAULT_LAYOUT);
  return sortNodesByFlow(laid).map((node) => node.id);
};

export const snapToGrid = (value: number, grid = 24) => Math.round(value / grid) * grid;
