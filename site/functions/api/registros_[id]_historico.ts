export const onRequestGet = async ({ env, params }: any) => {
  const id = Number(params.id);
  if (!id) return new Response(JSON.stringify({ error: "id inválido" }), { status: 400 });

  try {
    // @ts-ignore
    const rows = await env.DB.prepare(
      "SELECT * FROM historico_alteracoes WHERE registro_id = ? ORDER BY alterado_em DESC"
    ).bind(id).all();

    return new Response(JSON.stringify(rows?.results ?? []), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500 });
  }
};