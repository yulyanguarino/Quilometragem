function toCSV(rows: any[]) {
  if (!rows.length) return "id,condutor,placa_veiculo,data_saida,data_chegada,km_inicial,km_final,observacoes\n";
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const lines = [
    headers.join(","),
    ...rows.map(r => headers.map(h => escape(r[h])).join(",")),
  ];
  return lines.join("\n");
}

export const onRequestGet = async ({ env, params }: any) => {
  const fmt = (params.fmt || "").toLowerCase();

  try {
    // @ts-ignore
    const rows = await env.DB.prepare("SELECT * FROM registros ORDER BY id DESC").all();

    if (fmt === "csv") {
      const csv = toCSV(rows?.results ?? []);
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="registros.csv"',
        },
      });
    }

    // fallback: json
    return new Response(JSON.stringify(rows?.results ?? []), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500 });
  }
};