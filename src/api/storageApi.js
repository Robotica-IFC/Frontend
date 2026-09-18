import api from "./config"

const storageApi = {
    create(payload){
        return api.post('estoques/', payload)
    }
}

export default storageApi