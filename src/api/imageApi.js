import api from "./config";

const imageApi = {
    uploadImage(formData) {
        return api.post('media/images/', formData)
    }
}

export default imageApi