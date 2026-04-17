import api from "./config";

const studentsApi = {
    getAll() {
        return api.get('alunos/')
    },

    create(data) {
        return api.post('alunos/', data)
    },

    uploadImage(formData) {
        return api.post('media/images/', formData)
    }
}

export default studentsApi