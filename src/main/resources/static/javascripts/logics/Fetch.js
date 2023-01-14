async function generateFetch(items) {
    return await fetch(items.url,{
        method: items.method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(items.body)
    });
}