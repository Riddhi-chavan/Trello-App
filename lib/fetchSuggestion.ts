import formatTodosForAI  from  "./formatTodosForAI"

const fetchSuggestion = async (board : Board ) => {
    const todos = formatTodosForAI(board);

    const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://your-vercel-app.vercel.app'
    : 'http://localhost:3000';
    

    const res = await fetch(`${baseUrl}/api/generateSummery` , {
        method: "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify({todos}),
    });

 

    
    const GPTdata = await res.json();

    const {content} = GPTdata ;

    return content ;

}

export  default fetchSuggestion ;