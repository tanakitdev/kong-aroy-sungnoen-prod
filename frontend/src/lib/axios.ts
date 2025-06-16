import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  withCredentials: true,
});

// แนบ token อัตโนมัติทุกครั้งที่ request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log("[Axios Headers]", config.headers);
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
