import axios, {RawAxiosRequestHeaders} from "axios";

export const requestHeaders: RawAxiosRequestHeaders = {
  "Content-Type": "application/json",
};

export const apiRequest = axios.create({
  headers: requestHeaders,
});

export const x5SearchRequest = async (
  url: string,
  searchValue: string | null,
) => {
  if (!searchValue) return;

  const result = await apiRequest(url, {
    params: {
      mode: "delivery",
      limit: 100,
      q: searchValue,
    },
  });
  console.log(result, "x5 result");
  return result;
};
