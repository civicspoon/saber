const api = process.env.NEXT_PUBLIC_API_KEY;
const myHeaders = new Headers();
myHeaders.append("x-api-key", api);

// GET method
export async function getData(url) {
  try {
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}


export async function postData(url, data) {
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

// PUT method
export async function putData(url, obj) {
  try {
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body:JSON.stringify(obj),
      redirect: "follow"
    };

    console.log('=body===================================');
    console.log(requestOptions);
    console.log('====================================');

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// DELETE method
export async function deleteData(url) {
  try {
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
