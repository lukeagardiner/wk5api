//app/api/test/route.tsx
import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// Test GET I guess
export async function GET() {
    return NextResponse.json({ message: 'this API loves CSE3CWA-CSE5007' });
}

// Test POST I guess
export async function POST(req: NextRequest) {
    //const { id } = await req.json(); // tony modified this one from the original
    const url = new URL(req.url); // added
    const id = url.pathname.split('/').pop(); // added - Extract the ID from the URL path

    if (!id) {
        // had to add this response init type to make the argument in the response definition valid
        /*
        const status400Response: globalThis.ResponseInit = {
            status: 400,
        };
        // modified this one-
        //return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        return NextResponse.json({ error: 'ID is required' }, status400Response );
        */
       //return NextResponse.json({ error: 'ID is required' }, { status: 400 } as globalThis.ResponseInit);
       //return NextResponse.json({ error: 'ID is required' }, { status: 400 });
       return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create a SHA-256 has of the Id
    const hash = createHash('sha256')
    .update(id)
    .digest('hex');

    return NextResponse.json({ hash });
}