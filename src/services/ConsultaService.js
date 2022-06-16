class ConsultaService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}consultas-medicas`
    }

    getAll(params) {
        let self = this;
        return self.axios.get(`${self.baseUrl}`);
    }

    get(id) {
        let self = this;
        return self.axios.get(`${self.baseUrl}/${id}`);
    }

    getByUser() {
        let self = this;
        return self.axios.get(`${self.baseUrl}-user`);
    }

    getByUserDate(date) {
        let self = this;
        return self.axios.get(`${self.baseUrl}-user-date/${date}`);
    }

    getMedicamentos(id) {
        let self = this;
        return self.axios.get(`${self.baseUrl}-medicamentos/${id}`);
    }

    getExamenes(id) {
        let self = this;
        return self.axios.get(`${self.baseUrl}-examenes/${id}`);
    }

    create(data) {
        let self = this
        return self.axios.post(`${self.baseUrl}`, data)
    }

    update(data) {
        let self = this
        return self.axios.put(`${self.baseUrl}/${data.id}`, data)
    }

    entregarMedicamento(id) {
        let self = this
        return self.axios.put(`${self.baseUrl}-entregar-medicamentos/${id}`)
    }

    resultadoExamen(id, data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}-resultado-examenes/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    finish(data) {
        let self = this
        return self.axios.put(`${self.baseUrl}-finish/${data.id}`, data)
    }

    remove(id) {
        let self = this;
        return self.axios.delete(`${self.baseUrl}/${id}`);
    }
}

export default ConsultaService