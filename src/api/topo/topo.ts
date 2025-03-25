import request from "@/utils/request";
import type { GetTopoPayload } from "@/types";

enum API {
  GET_TOPO_URL = "/topo/get_topo",
}

export const GetTopo = (get_topo_payload: GetTopoPayload) => request.post(API.GET_TOPO_URL, get_topo_payload);
