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

    create(data) {
        let self = this
        return self.axios.post(`${self.baseUrl}`, data)
    }

    update(data) {
        let self = this
        return self.axios.put(`${self.baseUrl}/${data.id}`, data)
    }

    remove(id) {
        let self = this;
        return self.axios.delete(`${self.baseUrl}/${id}`);
    }
}

export default ConsultaService