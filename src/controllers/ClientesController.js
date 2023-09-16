import ClientesRepository from "ClientesRepository.js"
import ValidacoesClientes from "ClienteServices.js"

class ClientesController{
    static rotas(app){
        
        app.get("/clientes", async (req, res) => {
            try {
                const clientes = await ClientesRepository.buscarTodosClientes()
                res.status(200).json(clientes)
            } catch (erro) {
                res.status(404).json(erro.message)
            }
        })

        app.get("/clientes/:id", async (req, res) => {
            try {
                const cliente = await ClientesRepository.buscarClientePorId(req.params.id)
                if (!cliente) {
                    throw new Error("Id do cliente está inválido ou não cadastrado")
                }
                res.status(200).json(cliente)
            } catch (erro) {
                res.status(404).json({ message: erro.message, id: req.params.id })
            }
        })

        app.post("/clientes", async (req, res) => {
            try {
                ValidacoesClientes.validaCliente(req.body.cpf, req.body.nome, req.body.telefone, req.body.email)
                const cliente = req.body
                const inserir = await ClientesRepository.criarCliente(cliente)
                res.status(201).json(inserir)
            } catch (erro) {
                res.status(400).json({ message: erro.message })
            }
        })

        app.delete("/clientes/:id", async (req, res) => {
            try {
                const cliente = await ClientesRepository.buscarClientePorId(req.params.id)
                if (!cliente) {
                    throw new Error("Cliente não encontrado")
                }
                const resposta = await ClientesRepository.deletarClientePorId(req.params.id)
                res.status(200).json(resposta)
            } catch (erro) {
                res.status(404).json({ Erro: erro.message, id: req.params.id })
            }
        })

        app.patch("/clientes/:id", async (req, res) => {
            try {
                const cliente = await ClientesRepository.buscarClientePorId(req.params.id)
                if (!cliente) {
                    throw new Error("Id do cliente está inválido ou não cadastrado")
                }
                const data = req.body
                await ClientesRepository.atualizarClientePorId(req.params.id, data)
                res.status(200).json({ message: "Cliente atualizado com sucesso" })
            } catch (erro) {
                res.status(400).json({ message: erro.message, id: req.params.id })
            }
        })

    }
}

export default ClientesController