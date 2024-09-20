import axios from "axios";
import dotenv from "dotenv";
import querystring from "querystring";

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

export async function crawlDataGroupId({ cursor, searchText = "", token, cookie }) {
  const url = "https://www.facebook.com/api/graphql/";
  //"datr=93emZuYtC3monePxe-stds5b; sb=93emZvXYIcFK7aqjsRFZu1NW; ps_l=1; ps_n=1; wl_cbv=v2%3Bclient_version%3A2587%3Btimestamp%3A1723265759; locale=vi_VN; ar_debug=1; usida=eyJ2ZXIiOjEsImlkIjoiQXNrM2Fma2R2NXlpaSIsInRpbWUiOjE3MjY3OTg3MzZ9; c_user=100083130741074; xs=30%3AMybWFK540QlVng%3A2%3A1726801127%3A-1%3A6308; fr=16hJAQRry2ytNuFma.AWWaKKrpH4HBvXmgeH1hEt9gV2U.Bm7NtO..AAA.0.0.Bm7OkK.AWX23s7iXR4; wd=1240x1491; presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1726802212190%2C%22v%22%3A1%7D; fr=1UFRL7FjBHzB1jksN.AWWEA0etaen3BIGmUeq9gkGVYlo.Bm6qmR..AAA.0.0.Bm6_2B.AWVqOfsBFtQ; sb=gf3rZmd52qAvYTT55YtCDKgX"
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
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "x-asbd-id": "129477",
  };

  const data = querystring.stringify({
    av: "100083130741074",
    __aaid: "0",
    __user: "100083130741074",
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
    doc_id: "8646474315383063",
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
