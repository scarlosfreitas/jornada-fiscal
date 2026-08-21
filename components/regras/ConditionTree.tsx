"use client";

import {
  OPERATORS,
  PATHS_BY_SCHEMA,
  PROPERTY_TYPE_LABEL,
  RULE_LISTS,
  type FtmConditionNode,
  type FtmOperatorCode,
  type FtmSchemaTarget,
} from "@/lib/mock/regras";

let uid = 1000;
const nextId = (prefix: string) => `${prefix}${++uid}`;

function cloneNode(node: FtmConditionNode): FtmConditionNode {
  return JSON.parse(JSON.stringify(node));
}

function removeNode(node: FtmConditionNode, id: string): FtmConditionNode | null {
  if (node.kind !== "cond" && node.id === id) return null;
  if (node.kind !== "cond") {
    return { ...node, children: node.children.map((c) => removeNode(c, id)).filter((c): c is FtmConditionNode => c !== null) };
  }
  return node;
}

function updateNode(
  node: FtmConditionNode,
  id: string,
  fn: (n: FtmConditionNode) => FtmConditionNode,
): FtmConditionNode {
  if (node.id === id) return fn(node);
  if (node.kind === "cond") return node;
  return { ...node, children: node.children.map((c) => updateNode(c, id, fn)) };
}

function addChild(node: FtmConditionNode, groupId: string, child: FtmConditionNode): FtmConditionNode {
  if (node.kind === "cond") return node;
  if (node.id === groupId) return { ...node, children: [...node.children, child] };
  return { ...node, children: node.children.map((c) => addChild(c, groupId, child)) };
}

interface FlatRow {
  node: FtmConditionNode;
  depth: number;
}

function flatten(node: FtmConditionNode, depth: number, out: FlatRow[]): FlatRow[] {
  out.push({ node, depth });
  if (node.kind !== "cond") node.children.forEach((c) => flatten(c, depth + 1, out));
  return out;
}

function newCondition(schema: FtmSchemaTarget): FtmConditionNode {
  const first = PATHS_BY_SCHEMA[schema][0];
  return { id: nextId("c"), kind: "cond", path: first.path, operator: "EQUAL", value: "", listId: RULE_LISTS[0].id };
}

function newGroup(): FtmConditionNode {
  return { id: nextId("g"), kind: "all", children: [] };
}

export function ConditionTree({
  schema,
  tree,
  onChange,
}: {
  schema: FtmSchemaTarget;
  tree: FtmConditionNode;
  onChange: (tree: FtmConditionNode) => void;
}) {
  const paths = PATHS_BY_SCHEMA[schema];
  const rows = flatten(tree, 0, []);

  function setTree(fn: (t: FtmConditionNode) => FtmConditionNode) {
    onChange(fn(cloneNode(tree)));
  }

  function remove(id: string) {
    setTree((t) => {
      if (t.id === id) return t;
      return removeNode(t, id) ?? t;
    });
  }

  function addCondition(groupId: string) {
    setTree((t) => addChild(t, groupId, newCondition(schema)));
  }

  function addGroup(groupId: string) {
    setTree((t) => addChild(t, groupId, newGroup()));
  }

  function setGroupOp(id: string, kind: "all" | "any" | "not") {
    setTree((t) => updateNode(t, id, (n) => (n.kind === "cond" ? n : { ...n, kind })));
  }

  function setCondField(id: string, patch: Partial<Extract<FtmConditionNode, { kind: "cond" }>>) {
    setTree((t) => updateNode(t, id, (n) => (n.kind === "cond" ? { ...n, ...patch } : n)));
  }

  const condSummary = `${countConditions(tree)} condição(ões) · ${countGroups(tree)} grupo(s)`;
  const hasListCond = rows.some((r) => r.node.kind === "cond" && OPERATORS[r.node.operator].requiresList);

  return (
    <div className="ga-card">
      <div className="ga-card-head">
        <div className="ga-stack-2" style={{ gap: 3 }}>
          <span className="ga-card-title">Condições</span>
          <span className="ga-caption">Árvore AST recursiva · navegação em grafo a partir de {schema}</span>
        </div>
        <div className="ga-row" style={{ gap: 8 }}>
          <button type="button" className="ga-btn ga-btn-sm ga-btn-secondary" onClick={() => addCondition(tree.id)}>
            + Condição
          </button>
          <button type="button" className="ga-btn ga-btn-sm ga-btn-secondary" onClick={() => addGroup(tree.id)}>
            + Grupo
          </button>
        </div>
      </div>
      <div className="ga-card-body" style={{ padding: "16px 20px 20px" }}>
        <div className="ga-col" style={{ gap: 8 }}>
          {rows.map(({ node, depth }) => {
            const indent = depth * 22;
            if (node.kind !== "cond") {
              const isRoot = node.id === tree.id;
              return (
                <div
                  key={node.id}
                  className="ga-row ga-wrap"
                  style={{
                    marginLeft: indent,
                    gap: 10,
                    rowGap: 8,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "var(--ga-primary-50)",
                    border: "1px solid var(--ga-primary-200)",
                  }}
                >
                  <select
                    className="ga-select ga-select-sm"
                    style={{ width: 190, flex: "none", minWidth: 0 }}
                    value={node.kind}
                    onChange={(e) => setGroupOp(node.id, e.target.value as "all" | "any" | "not")}
                  >
                    <option value="all">TODAS as condições (E)</option>
                    <option value="any">QUALQUER condição (OU)</option>
                    <option value="not">NÃO (negação)</option>
                  </select>
                  <span className="ga-caption ga-grow">
                    {node.children.length} nó(s) neste grupo{isRoot ? " · raiz da AST" : ""}
                  </span>
                  <button type="button" className="ga-btn ga-btn-sm ga-btn-ghost" onClick={() => addCondition(node.id)}>
                    + condição
                  </button>
                  <button type="button" className="ga-btn ga-btn-sm ga-btn-ghost" onClick={() => addGroup(node.id)}>
                    + grupo
                  </button>
                  {!isRoot && (
                    <button
                      type="button"
                      className="ga-btn ga-btn-sm ga-btn-ghost"
                      style={{ color: "var(--ga-danger)", flex: "none", padding: "0 10px" }}
                      onClick={() => remove(node.id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            }

            const meta = OPERATORS[node.operator];
            const path = paths.find((p) => p.path === node.path);

            return (
              <div
                key={node.id}
                className="ga-row ga-wrap"
                style={{
                  marginLeft: indent,
                  gap: 8,
                  rowGap: 8,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "var(--ga-surface-muted)",
                  border: "1px solid var(--ga-border)",
                }}
              >
                <select
                  className="ga-select ga-select-sm ga-mono"
                  style={{ flex: "1 1 260px", minWidth: 0, width: "100%" }}
                  value={node.path}
                  onChange={(e) => setCondField(node.id, { path: e.target.value })}
                >
                  {paths.map((p) => (
                    <option key={p.path} value={p.path}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <span className="ga-chip ga-mono" style={{ flex: "none" }}>
                  {path ? PROPERTY_TYPE_LABEL[path.typeId] : ""}
                </span>
                <select
                  className="ga-select ga-select-sm"
                  style={{ flex: "0 1 190px", minWidth: 0, width: "100%" }}
                  value={node.operator}
                  onChange={(e) => setCondField(node.id, { operator: e.target.value as FtmOperatorCode })}
                >
                  {(Object.keys(OPERATORS) as FtmOperatorCode[])
                    .filter((op) => !path || OPERATORS[op].types.includes(path.typeId))
                    .map((op) => (
                      <option key={op} value={op}>
                        {OPERATORS[op].label}
                      </option>
                    ))}
                </select>
                {meta.requiresValue && (
                  <input
                    className="ga-input ga-input-sm ga-input-mono"
                    style={{ flex: "1 1 140px", minWidth: 0, width: "100%" }}
                    value={node.value}
                    onChange={(e) => setCondField(node.id, { value: e.target.value })}
                    placeholder="valor constante"
                  />
                )}
                {meta.requiresList && (
                  <select
                    className="ga-select ga-select-sm ga-mono"
                    style={{ flex: "1 1 160px", minWidth: 0, width: "100%" }}
                    value={node.listId}
                    onChange={(e) => setCondField(node.id, { listId: Number(e.target.value) })}
                  >
                    {RULE_LISTS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.code}
                      </option>
                    ))}
                  </select>
                )}
                {!meta.requiresValue && !meta.requiresList && (
                  <span className="ga-caption ga-grow">operador não requer operando</span>
                )}
                <button
                  type="button"
                  className="ga-btn ga-btn-sm ga-btn-ghost"
                  style={{ color: "var(--ga-danger)", flex: "none", padding: "0 10px" }}
                  onClick={() => remove(node.id)}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <div
          className="ga-row"
          style={{ gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px dashed var(--ga-border)" }}
        >
          <span className="ga-caption ga-grow">{condSummary}</span>
          {hasListCond && <span className="ga-chip ga-chip-info">Watchlists resolvidas em Redis Sets · SISMEMBER</span>}
        </div>
      </div>
    </div>
  );
}

function countConditions(node: FtmConditionNode): number {
  if (node.kind === "cond") return 1;
  return node.children.reduce((sum, c) => sum + countConditions(c), 0);
}

function countGroups(node: FtmConditionNode): number {
  if (node.kind === "cond") return 0;
  return 1 + node.children.reduce((sum, c) => sum + countGroups(c), 0);
}
