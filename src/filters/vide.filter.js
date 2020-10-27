import {
  APPOINTMENT_CONFIRMED,
  APPOINTMENT_OPEN,
  APPOINTMENT_CLOSED,
  APPOINTMENT_DELETED
} from "@/common/config";

const VideFilter = {
  translateStatus(value) {
    if (value == APPOINTMENT_CONFIRMED) {
      return "Confermato";
    } else if (value == APPOINTMENT_OPEN) {
      return "Aperto";
    } else if (value == APPOINTMENT_CLOSED) {
      return "Chiuso";
    } else if (value == APPOINTMENT_DELETED) {
      return "Annullato";
    }
    return value;
  }
};

export default VideFilter;
