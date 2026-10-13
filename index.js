// COMENTE O CODIGO FIA BETA

import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import { inserirResultado } from './DAO/resultado/inserir_resultado.js'
import { buscarResultados } from './DAO/resultado/buscar_resultado.js'
import { atualizarResultado } from './DAO/resultado/atualizar_resultado.js'
import { deletarResultado } from './DAO/resultado/deletar_resultado.js'
import { testarConexao } from './DAO/conexao.js'

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') return res.sendStatus(204)
    next()
})

// http://localhost:3000
app.use(express.static(path.join(__dirname, 'QuizPricesasVersao1')))

const PRINCESAS = ['elsa', 'moana', 'tiana', 'merida', 'rapunzel', 'ariel']

function limparPontos(pontos) {
    const limpos = {}
    for (const p of PRINCESAS) {
        limpos[p] = Math.max(0, Number.parseInt(pontos[p]) || 0)
    }
    return limpos
}

// CONSULTAR (GET) 
app.get('/resultado', async (req, res) => {
    try {
        res.json(await buscarResultados())
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao listar resultados', detalhes: erro.message })
    }
})

// INCLUSÃO (POST) 
app.post('/resultado', async (req, res) => {
    try {
        const { nome, princesa, pontos } = req.body

        if (!princesa || !PRINCESAS.includes(princesa)) {
            return res.status(400).json({ erro: 'Princesa vencedora inválida ou ausente.' })
        }
        if (!pontos || typeof pontos !== 'object') {
            return res.status(400).json({ erro: 'O campo pontos é obrigatório.' })
        }

        const pontosLimpos = limparPontos(pontos)

        const nomeLimpo = (nome || '').toString().trim().slice(0, 100) || 'Anônimo'

        const resultado = await inserirResultado({ nome: nomeLimpo, princesa, pontos: pontosLimpos })
        res.status(201).json({ mensagem: 'Resultado salvo com sucesso!', id: resultado.insertId })
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao salvar resultado', detalhes: erro.message })
    }
})

// ATUALIZAÇÃO (PUT) 
app.put('/resultado/:id', async (req, res) => {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'Id inválido.' })
    }

    const { nome, princesa, pontos } = req.body

    if (!princesa || !PRINCESAS.includes(princesa)) {
        return res.status(400).json({ erro: 'Princesa vencedora inválida ou ausente.' })
    }
    if (!pontos || typeof pontos !== 'object') {
        return res.status(400).json({ erro: 'O campo pontos é obrigatório.' })
    }

    try {
        const nomeLimpo = (nome || '').toString().trim().slice(0, 100) || 'Anônimo'
        const resultado = await atualizarResultado(id, {
            nome: nomeLimpo, princesa, pontos: limparPontos(pontos)
        })

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Resultado não encontrado.' })
        }
        res.json({ mensagem: 'Resultado atualizado com sucesso!', id })
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar resultado', detalhes: erro.message })
    }
})

// EXCLUSÃO (DELETE)
app.delete('/resultado/:id', async (req, res) => {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'Id inválido.' })
    }

    try {
        const resultado = await deletarResultado(id)

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Resultado não encontrado.' })
        }
        res.json({ mensagem: 'Resultado excluído com sucesso!', id })
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao excluir resultado', detalhes: erro.message })
    }
})

app.listen(3000, () => {
    console.log('🚀 Server is running on http://localhost:3000')
    testarConexao()
})
