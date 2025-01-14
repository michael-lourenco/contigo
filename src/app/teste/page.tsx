export default async function Teste() {    
    const data = await fetch("https://api.vercel.app/blog");
    const posts = await data.json();

    return (
        <div>
            <h1>posts
                {posts.map((post: any) => (
                    <div key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.body}</p>
                    </div>
                ))}
            </h1>
        </div>
    )
    
}