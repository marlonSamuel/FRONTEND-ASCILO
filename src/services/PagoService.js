class PagoService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}pagos`
    }

    getAll() {
        let self = this;
        return self.axios.get(`${self.baseUrl}`);
    }

    get(id) {
        let self = this;
        return self.axios.get(`${self.baseUrl}/${id}`);
    }

    getAscilo() {
        let self = this;
        return self.axios.get(`${self.baseUrl}-ascilo`);
    }

    create(data) {
        let self = this
        return self.axios.post(`${self.baseUrl}`, data)
    }

    update(data) {
        let self = this
        return self.axios.put(`${self.baseUrl}/${data.id}`, data)
    }

    anular(code) {
        let self = this
        return self.axios.put(`${self.baseUrl}-anular/${code}`)
    }

    remove(id) {
        let self = this;
        return self.axios.delete(`${self.baseUrl}/${id}`);
    }
}

export default PagoService