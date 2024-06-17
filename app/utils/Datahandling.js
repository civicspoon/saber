const api = process.env.NEXT_PUBLIC_API_KEY
const myHeaders = new Headers();
myHeaders.append("x-api-key", api);


export async function GetData(url){
    try {
         const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
    
      const response = await fetch(url,requestOptions)
      const obj = await response.json()
      return obj
    } catch (error) {
        console.log(error);
    }
   

}

export async function PostData(url, data) {
  try {
      const requestOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'x-api-key': api
          },
          body: JSON.stringify(data),
          redirect: 'follow'
      };

      const response = await fetch(url, requestOptions);
      const obj = await response.json();
      return obj;
  } catch (error) {
      console.error('Error:', error);
  }
}



export function formatNumber(num) {
    // Convert the number to a string with two decimal places
    let formattedNum = num.toFixed(2);

    // Split the number into integer and decimal parts
    let [integer, decimal] = formattedNum.split('.');

    // Add commas to the integer part
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine the integer part with the decimal part
    return `${integer}.${decimal}`;
}


export async function PutData(url, data) {
    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": api,
        },
        body: JSON.stringify(data),
        redirect: "follow",
      };
  
      const response = await fetch(url, requestOptions);
      const obj = await response.json();
      return obj;
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  export async function DeleteData(url) {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "x-api-key": api,
        },
        redirect: "follow",
      };
  
      const response = await fetch(url, requestOptions);
      const obj = await response.json();
      return obj;
    } catch (error) {
      console.error("Error:", error);
    }
  }