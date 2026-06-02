import api from "./config";

const instituteApi = {
    getAllInstitutes() {
        return api.get('instituicoes/')
    },

    createInstitute(data) {
        return api.post('instituicoes/', data)
    },

    
}

export default instituteApi