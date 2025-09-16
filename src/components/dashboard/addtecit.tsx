interface ticket{
    title:string,
    content:string,
    status:string,
    priority:string,
    openAt:string,
    category?: { name: string },
    employee?: { name: string },
    company?: string,
    dailyStatus:boolean
}


const categoray = async()=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
    const json = await res.json();
    console.log("Raw API response:", json);
    return json.data || [];
}

  const payload  = {
        filters: {
          type:'device'
        },

      }

const device = async()=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
         },
         body: JSON.stringify(payload),
    });
    const json = await res.json();
    console.log("Raw API response:", json);
    return json.data || [];
}
const employee = async()=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
         },
         body: JSON.stringify(payload),
    });
    const json = await res.json();
    console.log("Raw API response:", json);
    return json.data || [];
}


const addticetadmin = async (ticket: ticket) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
         },
         body: JSON.stringify(ticket),
    });
    const json = await res.json();
    console.log("Raw API response:", json);
    return json.data || [];
}


export {addticetadmin,categoray,device,employee}