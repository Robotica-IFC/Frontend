import api from "./config"

const storageApi = {
    create(payload){
        return api.post('estoques/', payload)
    },
    getItemByStorageId(id){
        return api.get(`itens/?estoque=${id}`)
    },
    getStorageByTeamId(id){
        return api.get(`estoques/?equipe=${id}`)
    },
    getStorageById(id){
        return api.get(`estoques/${id}`)
    }
}

export default storageApi