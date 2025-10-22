export const onRequestGet = async ({ env, params }: any) => {
  const id = Number(params.id);
  if (!id) return new Response(JSON.stringify({ error: "id inválido" }), { status: 400 });

  try {
    // @ts-ignore
    const row = await env.DB.prepare("SELECT * FROM registros WHERE id = ?").bind(id).first();
    if (!row) return new Response(JSON.stringify({ error: "não encontrado" }), { status: 404 });
    return new Response(JSON.stringify(row), { headers: { "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500 });
  }
};

export const onRequestDelete = async ({ env, params }: any) => {
  const id = Number(params.id);
  if (!id) return new Response(JSON.stringify({ error: "id inválido" }), { status: 400 });

  try {
    // @ts-ignore
    const res = await env.DB.prepare("DELETE FROM registros WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ ok: true, changes: res.meta?.changes ?? 0 }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500 });
  }
};