class ReporteService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}reporte`
    }

    exportPacientes(data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}-pacientes`, data, { responseType: 'arraybuffer' });
    }

    exportCobros(data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}-cobros`, data, { responseType: 'arraybuffer' });
    }

    exportPagosFundacion(data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}-pagos-fundacion`, data, { responseType: 'arraybuffer' });
    }

    exportExamenes(data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}-examenes`, data, { responseType: 'arraybuffer' });
    }

    exportMedicamentos(data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}-medicamentos`, data, { responseType: 'arraybuffer' });
    }

    exportIngresosGastos(data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}-ingresos-gastos`, data, { responseType: 'arraybuffer' });
    }


}

export default ReporteService