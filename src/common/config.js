import { getHostname } from "@/common/utils";

export default {};

export const CLIENTIP_API_URL = "https://api.ipify.org";
export const VIDE_API_URL = "https://" + getHostname() + "/videapi/api/v1/";
export const USER_JOIN_VIDE_URL = "https://" + getHostname() + "/#/user/join/";
export const APPSCHED_LOGIN_URL =
  "https://" + getHostname() + "/appschedweb/index.php/user/logout";

export const CHECK_START_FREQ = 30; // valore in secondi

export const VIDE_AUTH_COOKIE = "vide_auth";

export const VIRTUAL_DESK_ID_MAX_LENGTH = 36;

export const APPOINTMENT_CONFIRMED = "confirmed";
export const APPOINTMENT_OPEN = "open";
export const APPOINTMENT_CLOSED = "closed";
export const APPOINTMENT_DELETED = "deleted";

export const ATTACHMENTS_FILES_EXTS = [
  "pdf",
  "tif",
  "jpg",
  "jpeg",
  "doc",
  "docx",
  "png",
  "pptx",
  "odt",
  "ods",
  "odp",
  "odg",
  "odb",
  "txt"
];

export const ATTACHMENTS_FILES_MAX_NUM = 20;

export const ATTACHMENTS_FILES_MAX_SIZE = 15; // in MB

export const X_AUTH_ROLE_OPERATOR = "operator";
export const X_AUTH_ROLE_USER = "user";
