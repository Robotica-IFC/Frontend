import api from "./config";
import { useFormLimits } from '@/composables/useFormLimits'

const imageApi = {
    async uploadImage(formData, { validateLimits = true } = {}) {
        if (validateLimits) await useFormLimits().assertImages(formData.getAll('file'))
        return api.post('media/images/', formData)
    }
}

export default imageApi
