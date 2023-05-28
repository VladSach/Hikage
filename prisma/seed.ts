import { PrismaClient } from '@prisma/client'

const db = new PrismaClient();

// TODO: change names and types and fetch


type Post = {
    title: string
    vertex: string
    pixel: string
};

async function getPosts() {
    const responce = await fetch('');
    const { posts } = await responce.json();
    return posts as Post[]
}

async slugify(text: string) {
    return text
}

async function main() {
    const posts = await getPosts();

    for (const post of posts) {
        await db.post.create({
            data: {
                title: post.title,
                content: post.body,
                slug: slugify(post.title)
            }
        })
    }
}

main()
