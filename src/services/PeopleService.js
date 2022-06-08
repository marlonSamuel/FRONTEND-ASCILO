class PeopleService {
    axios
    baseUrl

    constructor(axios,baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}values`
    }

    getAll(params) {
        let self = this;
        console.log(params)
        return self.axios.get(`${self.baseUrl}`);
    }

    get(id) {
        let self = this;
        return self.axios.get(`${self.baseUrl}/${id}`);
    }

    create(data){
        let self = this
        return self.axios.post(`${self.baseUrl}`,data)
    }

    update(data){
        let self = this
        return self.axios.put(`${self.baseUrl}/${data.id}`,data)
    }

    remove(id) {
        let self = this;
        return self.axios.delete(`${self.baseUrl}/${id}`);
    }
}

export default PeopleService