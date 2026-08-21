import { OPERATORS, RULE_LISTS, type FtmActionTrigger, type FtmConditionNode } from "@/lib/mock/regras";

function toAst(node: FtmConditionNode): unknown {
  if (node.kind === "cond") {
    const meta = OPERATORS[node.operator];
    const out: Record<string, unknown> = { path: node.path, operator: node.operator };
    if (meta.requiresValue) {
      const asNumber = Number(node.value);
      out.value = node.value !== "" && !Number.isNaN(asNumber) ? asNumber : node.value;
    }
    if (meta.requiresList) {
      const list = RULE_LISTS.find((l) => l.id === node.listId) ?? RULE_LISTS[0];
      out.list_id = list.id;
      out.list_code = list.code;
    }
    return out;
  }
  if (node.kind === "not") {
    return { not: node.children[0] ? toAst(node.children[0]) : null };
  }
  return { [node.kind]: node.children.map(toAst) };
}

export function AstPreview({
  name,
  schema,
  tree,
  actions,
}: {
  name: string;
  schema: string;
  tree: FtmConditionNode;
  actions: FtmActionTrigger[];
}) {
  const ast = {
    version: "1.0",
    name,
    target_schema: schema,
    conditions: toAst(tree),
    actions: actions.map((a) => ({
      type: a.type,
      severity: a.severity,
      params: safeParse(a.params),
    })),
  };

  return (
    <div className="ga-card">
      <div className="ga-card-head">
        <div className="ga-stack-2" style={{ gap: 3 }}>
          <span className="ga-card-title">AST da regra</span>
          <span className="ga-caption">rule_definition.definition</span>
        </div>
        <span className="ga-caption">Dedupe de alertas: SHA256(rule_id, rule_version, target_entity_id, janela)</span>
      </div>
      <div className="ga-card-body">
        <pre
          className="ga-mono"
          style={{
            margin: 0,
            fontSize: 12.5,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            color: "var(--ga-gray-700)",
          }}
        >
          {JSON.stringify(ast, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function safeParse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}
