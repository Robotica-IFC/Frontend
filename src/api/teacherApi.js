import api from "./config";

const teacherApi = {
    getAll() {
        return api.get('professores/')
    },

    create(data) {
        return api.post('professores/', data)
    },

    uploadImage(formData) {
        return api.post('media/images/', formData)
    }
}

export default teacherApi