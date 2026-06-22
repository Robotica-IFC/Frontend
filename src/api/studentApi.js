import api from "./config";

const studentsApi = {
    getAll() {
        return api.get('alunos/')
    },

    getById(id) {
        return api.get(`alunos/${id}/`)
    },

    create(data) {
        return api.post('alunos/', data)
    },

    update(id, data) {
        return api.patch(`alunos/${id}/`, data)
    },

    delete(id) {
        return api.delete(`alunos/${id}/`)
    },

    uploadImage(formData) {
        return api.post('media/images/', formData)
    },
}

export default studentsApi