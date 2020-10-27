import { AppointmentService, AttachmentService } from "@/common/api.service";
import { getStandardHeader } from "@/common/api.service";
import { axiosPublicInstance } from "@/plugins/axios";
import {
  APPOINTMENT_CONFIRMED,
  APPOINTMENT_OPEN,
  APPOINTMENT_CLOSED,
  APPOINTMENT_DELETED
} from "@/common/config";
import {
  APPOINTMENT_FETCH,
  APPOINTMENT_SEARCH,
  APPOINTMENT_UPDATE,
  ATTACHMENTS_FETCH,
  ATTACHMENT_UPLOAD,
  ATTACHMENT_DOWNLOAD,
  ATTACHMENT_DELETE,
  VIRTUALDESK_FETCH
} from "./actions.type";

import { SET_APPOINTMENT, SET_APPOINTMENT_JWT } from "./mutations.type";

const initialState = {
  appointment: {
    user: {
      name: null,
      surname: null,
      phone: null,
      email: null
    }
  },
  audioVideo: {
    audio: null,
    video: null
  },
  appointmentJwt: null,
  appointmentStatuses: [
    { text: "Tutti gli stati", value: null },
    { text: "Confermato", value: APPOINTMENT_CONFIRMED },
    { text: "Aperto", value: APPOINTMENT_OPEN },
    { text: "Chiuso", value: APPOINTMENT_CLOSED },
    { text: "Annullato", value: APPOINTMENT_DELETED }
  ]
};

export const state = { ...initialState };

export const actions = {
  async [APPOINTMENT_SEARCH](context, params) {
    const { data } = await AppointmentService.listAppointments(params);
    return { data };
  },

  async [APPOINTMENT_FETCH](context, params) {
    const header = getStandardHeader();
    header["X-Auth-Role"] = params.xAuthRole;

    await axiosPublicInstance
      .get(`appointments/${params.appointmentId}`, {
        headers: header,
        data: ""
      })
      .then(response => {
        context.commit(SET_APPOINTMENT, response.data);
        context.commit(SET_APPOINTMENT_JWT, response.headers.authorization);
      });
  },

  async [VIRTUALDESK_FETCH](context, params) {
    const { data } = await AppointmentService.getVirtualDeskId();
    return data;
  },

  async [APPOINTMENT_UPDATE](context, params) {
    const slug = params.slug;
    state.appointment.status = params.status;
    const appDetail = await AppointmentService.updateAppointment(
      slug,
      state.appointment
    );
    context.commit(SET_APPOINTMENT, appDetail.data);
  },

  async [ATTACHMENTS_FETCH](context, slug) {
    return AttachmentService.listAttachments(slug);
  },

  async [ATTACHMENT_UPLOAD](context, params) {
    const slug = params.get("slug");
    params.delete("slug");
    AttachmentService.upload(slug, params);
  },

  async [ATTACHMENT_DOWNLOAD](context, params) {
    return AttachmentService.download(
      params.appointment_id,
      params.attachment_id
    );
  },

  async [ATTACHMENT_DELETE](context, params) {
    return AttachmentService.delete(
      params.appointment_id,
      params.attachment_id
    );
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_APPOINTMENT](state, appointment) {
    state.appointment = appointment;
  },
  [SET_APPOINTMENT_JWT](state, appointmentJwt) {
    state.appointmentJwt = appointmentJwt;
  }
};

const getters = {
  appointment(state) {
    return state.appointment;
  },
  appointmentJwt(state) {
    return state.appointmentJwt;
  },
  appointmentStatuses(state) {
    return state.appointmentStatuses;
  },
  audioVideo(state) {
    return state.audioVideo;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
