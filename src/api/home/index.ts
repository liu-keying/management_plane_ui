import type { ReqTopoInfo } from "@/types";
import request from "@/utils/request";

enum API {
  GET_ANIME_HOME_URL = "/control_page/get_info",
}

export const reqControlPageHome = (req: ReqTopoInfo) => request.post(API.GET_ANIME_HOME_URL, req);
