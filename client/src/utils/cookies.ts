export function getCookie(name: string) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0] === name) {
      return decodeURIComponent(cookie[1]);
    }
  }
  return null;
}

export function setCookie(name:string,value:string){


  document.cookie = name+"="+value

}

export const cookies = {
  auth:"authorized"

} as const