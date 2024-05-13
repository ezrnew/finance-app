type httpMethod = "GET" | "POST" | "DELETE" | "PUT";

export const httpReqHandler = (basePath: string) => {
  return async (path: string, method: httpMethod = "GET", data?: { body?: any; headers?: any }) => {

    try {
      const response = await fetch(basePath + path, {
        method,

        body: JSON.stringify(data?.body),
          credentials: 'include',
        headers: data?.headers ?? {
          "Content-Type": "application/json",
        },
      });
    //   if (!response.ok) return response.status
         return response;
    } catch (error) {
      console.log("error sending request ", error);
    }
  };
};
