import axios from 'axios';
const axiosinstance=axios.create({
    baseURL:"https://bridge-up-roan.vercel.app/"
})
export default axiosinstance;