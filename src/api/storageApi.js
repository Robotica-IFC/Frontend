import api from "./config"

const storageApi = {
    create(payload){
        return api.post('estoques/', payload)
    },
    getItemByStorageId(id){
        return api.get(`itens/?estoque=${id}`)
    }
}

export default storageApi