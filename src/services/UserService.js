class UserService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}users`
    }

    getAll() {
        let self = this;
        return self.axios.get(`${self.baseUrl}`);
    }

    getRoles() {
        let self = this;
        return self.axios.get(`${self.baseUrl}-roles`);
    }

    get(id) {
        let self = this;
        return self.axios.get(`${self.baseUrl}/${id}`);
    }

    create(data) {
        let self = this
        return self.axios.post(`${self.baseUrl}`, data)
    }

    update(data) {
        let self = this
        return self.axios.put(`${self.baseUrl}/${data.id}`, data)
    }

    changePassword(data) {
        let self = this
        return self.axios.put(`${self.baseUrl}-change-password`, data)
    }

    remove(id) {
        let self = this;
        return self.axios.delete(`${self.baseUrl}/${id}`);
    }
}

export default UserService