import axios from 'axios';
const axiosinstance=axios.create({
    baseURL:"https://bridge-up-peach.vercel.app/"
})
export default axiosinstance;