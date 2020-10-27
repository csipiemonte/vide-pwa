import axios from "axios";
import { CLIENTIP_API_URL, VIDE_API_URL } from "@/common/config";

const axiosPublicConfig = { baseURL: VIDE_API_URL };
const axiosClientIpConfig = { baseURL: CLIENTIP_API_URL };

const axiosPublicInstance = axios.create(axiosPublicConfig);
const axiosClientIpInstance = axios.create(axiosClientIpConfig);

export { axiosPublicInstance, axiosClientIpInstance };
