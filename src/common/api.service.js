import { VIDE_API_URL } from "@/common/config";
import { axiosPublicInstance, axiosClientIpInstance } from "@/plugins/axios";
import store from "@/store";
import axios from "axios";

const { v4: uuidv4 } = require("uuid");

const ApiService = {
  query(resource, params) {
    params.data = "";
    return axiosPublicInstance.get(`${resource}`, params);
  },

  get(resource, slug = "", params) {
    return axiosPublicInstance.get(`${resource}/${slug}`, params);
  },

  post(resource, params, config) {
    return axiosPublicInstance.post(`${resource}`, params, config);
  },

  put(resource, slug = "", params, config) {
    return axiosPublicInstance.put(`${resource}/${slug}`, params, config);
  },

  delete(resource, params) {
    return axiosPublicInstance.delete(`${resource}`, params);
  },

  attach(resource, slug = "", formData) {
    return axios.create().post(`${VIDE_API_URL}${resource}/${slug}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Request-ID": uuidv4(),
        "X-Forwarded-For": store.getters.clientIp,
        "X-Tenant-Id": store.getters.tenantId
      },
      params: formData
    });
  }
};

export function getStandardHeader() {
  const stdHeader = {
    "Content-Type": "application/json",
    "X-Request-ID": uuidv4(),
    "X-Forwarded-For": store.getters.clientIp,
    "X-Tenant-Id": store.getters.tenantId
  };
  return stdHeader;
}

export default ApiService;

export const AppointmentService = {
  listAppointments(params) {
    return ApiService.query("appointments", {
      headers: getStandardHeader(),
      params: params,
      data: ""
    });
  },
  getVirtualDeskId() {
    return ApiService.query("virtual-desk", {
      headers: getStandardHeader(),
      data: ""
    });
  },
  updateAppointment(slug, params) {
    return ApiService.put("appointments", slug, params, {
      headers: getStandardHeader()
    });
  }
};

export const AttachmentService = {
  upload(idAppointment, params) {
    return ApiService.attach("attachment", idAppointment, params);
  },
  listAttachments(slug) {
    return ApiService.query(`attachment/${slug}`, {
      headers: getStandardHeader(),
      data: ""
    });
  },
  download(appointment_id, attachment_id) {
    return ApiService.query(`attachment/${appointment_id}/${attachment_id}`, {
      responseType: "arraybuffer",
      headers: {
        "X-Request-ID": uuidv4(),
        "X-Forwarded-For": store.getters.clientIp,
        "X-Tenant-Id": store.getters.tenantId
      }
    });
  },
  delete(appointment_id, attachment_id) {
    return ApiService.delete(`attachment/${appointment_id}/${attachment_id}`, {
      headers: getStandardHeader(),
      data: ""
    });
  }
};

export const GlobalService = {
  carousel() {
    return ApiService.query("carousel", {
      headers: getStandardHeader()
    });
  },
  clientIp() {
    const params = {
      headers: { "Content-Type": "application/json" },
      params: { format: "json" },
      data: ""
    };
    return axiosClientIpInstance.get("/", params).catch(error => {
      throw new Error(`[ViDe] ApiService ${error}`);
    });
  },
  layout() {
    return ApiService.query("layout", {
      headers: getStandardHeader()
    });
  },
  tenant(hostname) {
    return ApiService.get("tenant", hostname, {
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": uuidv4(),
        "X-Forwarded-For": store.getters.clientIp
      },
      data: ""
    });
  }
};

export const OperatorService = {
  decodeToken(token) {
    const header = getStandardHeader();
    header["X-Token-JWT"] = token;
    return ApiService.query("operator/decodeToken", {
      headers: header,
      data: ""
    });
  }
};
