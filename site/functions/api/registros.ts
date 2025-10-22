export const onRequestGet = async () => {
  return new Response(JSON.stringify({ ok: true, route: "GET /api/registros" }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const onRequestPost = async ({ env, request }: any) => {
  const data = await request.json().catch(() => null);
  if (!data) {
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const {
    condutor,
    placa_veiculo,
    data_saida,
    data_chegada,
    km_inicial,
    km_final,
    observacoes,
  } = data;

  const sql = `INSERT INTO registros
    (condutor, placa_veiculo, data_saida, data_chegada, km_inicial, km_final, observacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?);`;

  try {
    // @ts-ignore
    const result = await env.DB.prepare(sql)
      .bind(
        condutor,
        placa_veiculo,
        data_saida,
        data_chegada,
        km_inicial,
        km_final,
        observacoes ?? null
      )
      .run();

    return new Response(JSON.stringify({ ok: true, result }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};