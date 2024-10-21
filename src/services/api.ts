import axios from "axios";
import dotenv from "dotenv";
import querystring from "querystring";
import { getCookieValue } from "../apps/services/selenium/repo.service";

dotenv.config();

const awplClient = axios.create({
  baseURL: process.env.SERVER_LOTTE_URL,
  headers: {
    maxBodyLength: Infinity,
    "Content-Type": "application/json",
    Authorization: process.env.SERVER_AUTHORIZATION,
  },
});

export function crawlDataProductCode(data) {
  return awplClient.post("/v1/p/mart/es/vi_vih/products/search", data);
}

const awplClientMykiot = axios.create({
  baseURL: process.env.SERVER_MYKIOT_URL,
  headers: {
    maxBodyLength: Infinity,
    "Content-Type": "application/json",
    ["Store-Id"]: "393008",
  },
});

export function crawlDataProductMykiot(data) {
  return awplClientMykiot.post("/api/v1/products/search", data);
}

const awplClientSieuThiDucThanh = axios.create({
  baseURL: process.env.SERVER_SIEUTHIDUCTHANH_URL,
  headers: {
    maxBodyLength: Infinity,
    "Content-Type": "application/json",
  },
});

const awplClientFbGraphql = axios.create({
  baseURL: process.env.SERVER_FB_GRAPHQL,
  headers: {
    maxBodyLength: Infinity,
    "Content-Type": "application/json",
  },
});

export function crawlDataProductSieuThiDucThanh({ product_bar_code }) {
  return awplClientSieuThiDucThanh.get("/search", {
    params: {
      type: "product",
      view: "json",
      q: product_bar_code,
    },
    headers: {
      ["sec-ch-ua-mobile"]: "?1",
      authority: "sieuthiducthanh.com",
      accept: "*/*",
      cookie:
        "cart_currency=VND; _landing_page=%2Fsearch%3Ftype%3Dproduct%26q%3D893501880160%26view%3Djson; _orig_referrer=https%3A%2F%2Fsieuthiducthanh.com%2Fsearch%3Fquery%3D8935018801603; cart=473f42a6f815906f734b019413820eb7; cart_sig=e805b6faeaef55bba376ca0b23152a9d",
    },
  });
}

export async function crawlDataGroupId({ cursor, searchText = "", token, cookie, divide }) {
  const url = "https://www.facebook.com/api/graphql/";
  const headers = {
    accept: "*/*",
    "accept-language": "en,vi;q=0.9,en-US;q=0.8",
    "content-type": "application/x-www-form-urlencoded",
    cookie: cookie,
    origin: "https://www.facebook.com",
    priority: "u=1, i",
    referer: `https://www.facebook.com/groups/search/groups_home/?q=${encodeURIComponent(searchText)}`,
    "sec-ch-prefers-color-scheme": "dark",
    "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    "sec-ch-ua-full-version-list":
      '"Chromium";v="128.0.6613.138", "Not;A=Brand";v="24.0.0.0", "Google Chrome";v="128.0.6613.138"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": '""',
    "sec-ch-ua-platform": '"macOS"',
    "sec-ch-ua-platform-version": '"13.4.1"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": divide,
    "x-asbd-id": "129477",
  };

  const c_user = getCookieValue("c_user", cookie);
  console.log({ c_user });
  const data = querystring.stringify({
    av: c_user,
    __aaid: "0",
    __user: c_user,
    __a: "1",
    dpr: "2",
    __ccg: "EXCELLENT",
    fb_dtsg: token,
    fb_api_caller_class: "RelayModern",
    variables: JSON.stringify({
      count: 1,
      allow_streaming: false,
      args: {
        callsite: "comet:groups_search",
        config: {
          exact_match: false,
          high_confidence_config: null,
          intercept_config: null,
          sts_disambiguation: null,
          watch_config: null,
        },
        context: {
          bsid: "1801e5d5-2437-404f-84ad-76db10bb6af6",
          tsid: "0.30743673869412214",
        },
        experience: {
          client_defined_experiences: ["ADS_PARALLEL_FETCH"],
          encoded_server_defined_params: null,
          fbid: null,
          type: "GROUPS_TAB_GLOBAL",
        },
        filters: [],
        text: searchText,
      },
      cursor: cursor,
    }),
    server_timestamps: true,
    doc_id: "8124921897636473",
  });

  try {
    const response = await axios.post(url, data, { headers });
    const responseData = response.data;

    // Trích xuất cursor từ response
    const endCursor = responseData?.data?.serpResponse.results.page_info?.end_cursor;
    const hasNextPage = responseData?.data?.serpResponse.results.page_info?.has_next_page;

    return {
      data: responseData,
      endCursor: endCursor,
      hasNextPage: hasNextPage,
    };
  } catch (error) {
    console.error("Error fetching Facebook data:", error);
    return error;
  }
}
