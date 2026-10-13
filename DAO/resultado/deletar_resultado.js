import { conexao } from '../conexao.js'

// Remove um resultado da tbl_resultado, a partir do id -- IMPORTANTEEEEEEEEEEEEEE
async function deletarResultado(id) {
    const conn = await conexao()
    try {
        const [results] = await conn.query(`DELETE FROM tbl_resultado WHERE id = ?`, [id])
        return results
    } finally {
        await conn.end()
    }
}

export { deletarResultado }
