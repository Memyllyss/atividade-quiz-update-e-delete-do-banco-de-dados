import { conexao } from '../conexao.js'

// Atualiza um resultado salvo na tbl_resultado, a partir do id  IMPORTANTE
async function atualizarResultado(id, { nome, princesa, pontos }) {
    const sql = `UPDATE tbl_resultado SET
        nome_jogador = ?, princesa = ?,
        pts_elsa = ?, pts_moana = ?, pts_tiana = ?,
        pts_merida = ?, pts_rapunzel = ?, pts_ariel = ?
        WHERE id = ?`

    const valores = [
        nome, princesa,
        pontos.elsa, pontos.moana, pontos.tiana,
        pontos.merida, pontos.rapunzel, pontos.ariel,
        id
    ]

    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, valores)
        return results
    } finally {
        await conn.end()
    }
}

export { atualizarResultado }
