export const onRequestGet = async (ctx: any) => {
  // Só para verificar que a rota GET está viva
  return new Response(JSON.stringify({ ok: true, route: "GET /api/registros" }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const onRequestPost = async ({ env, request }: any) => {
  // Body JSON
  const data = await request.json().catch(() => null);
  if (!data) {
    return new Response(JSON.stringify({ error: "JSON inválido" }), { status: 400 });
  }

  // Exemplo simplificado de INSERT — adapte aos nomes de colunas do seu schema
  const {
    condutor,
    placa_veiculo,
    data_saida,
    data_chegada,
    km_inicial,
    km_final,
    observacoes,
  } = data;

  const sql =
    `INSERT INTO registros (condutor, placa_veiculo, data_saida, data_chegada, km_inicial, km_final, observacoes)
     VALUES (?, ?, ?, ?, ?, ?, ?);`;

  const params = [
    condutor,
    placa_veiculo,
    data_saida,
    data_chegada,
    km_inicial,
    km_final,
    observacoes ?? null,
  ];

  try {
    // env.DB vem do binding D1 (Associações → DB)
    // @ts-ignore
    const result = await env.DB.prepare(sql).bind(...params).run();
    return new Response(JSON.stringify({ ok: true, result }), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};